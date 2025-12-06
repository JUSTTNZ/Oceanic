import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model.js'
import { supabaseAdmin, supabasePublic, supabaseRecoverPassword } from '../lib/supabase.js'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service key for server-side logout
)

export const initProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supaUser = (req as any).supabaseUser as {
      id: string;
      email: string | null;
      user_metadata?: Record<string, any>;
      app_metadata?: {
        provider?: string;
        providers?: string[];
      };
    };
    const { id, email, user_metadata, app_metadata } = supaUser;

    const { username, fullname, phoneNumber } = req.body as {
      username?: string;
      fullname?: string;
      phoneNumber?: string;
    };

    const isGoogleAuth = app_metadata?.provider === 'google';

    if (!isGoogleAuth && (!phoneNumber || phoneNumber.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Phone number is required for registration.' });
    }

    let profile = await User.findOne({ supabase_user_id: id });
    if (!profile) {
      const count = await User.countDocuments();
      const role = count === 0 ? "superadmin" : "user";

      const safeUsername =
        username?.trim() ||
        user_metadata?.username?.trim() ||
        (email ? email.split("@")[0] : `user_${id.slice(0, 6)}`);

      const safeFullname =
        fullname?.trim() ||
        user_metadata?.fullname?.trim() ||
        "";
      
      const safePhone =
        phoneNumber?.trim() ||
        user_metadata?.phoneNumber?.trim() ||
        undefined;

      profile = await User.create({
        supabase_user_id: id,
        email: email ? email.toLowerCase() : null,
        username: safeUsername.toLowerCase(),
        fullname: safeFullname,
        phoneNumber: safePhone,
        role,
        isVerified: true,
        isGoogleAuth: isGoogleAuth,
      });
    }

    res.json({ ok: true, profile });
  } catch (e) {
    next(e);
  }
};

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as any).supabaseUser as { id: string };
    const profile = await User.findOne({ supabase_user_id: id })
      .select('email username fullname role phoneNumber createdAt');

    if (!profile) {
      return res.status(404).json({ status: 'error', message: 'User profile not found' });
    }

    // respond exactly how your BuyCrypto expects: { data: { email, ... } }
    return res.json({
      status: 'success',
      data: {
        email: profile.email,
        username: profile.username,
        fullname: profile.fullname,
        role: profile.role,
        phoneNumber: profile.phoneNumber,
        createdAt: profile.createdAt,
      },
    });
  } catch (e) {
    next(e);
  }
};

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supaUser = (req as any).supabaseUser as { id: string };
    if (!supaUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { fullname, phoneNumber } = req.body;

    if (!fullname) {
      return res.status(400).json({ message: "Fullname is required" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { supabase_user_id: supaUser.id },
      { $set: { fullname, phoneNumber } },
      { new: true }
    ).select("email username fullname role phoneNumber createdAt");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "User details updated successfully",
      profile: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supaUser = (req as any).supabaseUser as { id: string };
    if (!supaUser?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const deletedUser = await User.findOneAndDelete({ supabase_user_id: supaUser.id });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      ok: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const changeUserCurrentPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // user is already authenticated by requireSupabaseUser middleware
    const supaUser = (req as any).supabaseUser as { id: string; email: string | null }
    if (!supaUser?.id || !supaUser.email) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string
      newPassword?: string
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // 1) Re-authenticate with the current password (nice UX and security)
    // We use the public client here to validate the credentials.
    const { error: reauthError } = await supabasePublic.auth.signInWithPassword({
      email: supaUser.email,
      password: currentPassword,
    })
    if (reauthError) {
      return res.status(401).json({ message: 'Current password is incorrect' })
    }

    // 2) Update password with Admin API (service role)
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      supaUser.id,
      { password: newPassword }
    )
    if (updateError) {
      return res.status(500).json({ message: updateError.message })
    }

    return res.status(200).json({ ok: true, message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}


export const requestPasswordRecovery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const appUrl = process.env.APP_URL;
    if (!appUrl || !appUrl.startsWith('http')) {
      console.error(
        'FATAL: APP_URL environment variable is not set or is invalid. It must be a full URL, e.g., "http://localhost:3000".'
      );
      // Return a generic success message to the client to avoid leaking configuration issues.
      return res.status(200).json({
        ok: true,
        message: 'If this email exists, a reset link has been sent.',
      });
    }

    const redirectTo = new URL('/auth/reset', appUrl).toString();

    const { error } = await supabaseRecoverPassword.auth.resetPasswordForEmail(
      email.trim().toLowerCase(),
      { redirectTo }
    );

    if (error) {
      console.error('Password recovery request error:', error.message);
    }

    return res.status(200).json({
      ok: true,
      message: 'If this email exists, a reset link has been sent.',
    });
  } catch (err) {
    console.error('Unexpected error in requestPasswordRecovery:', err);
    return res.status(200).json({
      ok: true,
      message: 'If this email exists, a reset link has been sent.',
    });
  }
};


export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { access_token, newPassword } = req.body as {
      access_token?: string;
      newPassword?: string;
    };

    if (!access_token || !newPassword) {
      return res.status(400).json({ message: 'Access token and new password are required' });
    }

    // 1. Get the user from the access token
    const { data: userResponse, error: userError } = await supabaseAdmin.auth.getUser(access_token);

    if (userError || !userResponse?.user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    const { user } = userResponse;

    // 2. Update the user's password using the Admin API
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: newPassword }
    );

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({
      ok: true,
      message: 'Password updated successfully.',
    });
  } catch (err) {
    const error = err as Error
    console.error('❌ resetPassword error:', error);
    // Add a more specific error message if the error is a known Supabase auth error
    if (error.name === 'AuthApiError') {
      return res.status(400).json({ message: error.message });
    }
    next(err);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // The Supabase Admin API can invalidate a user's session/token.
    // We use the service_role key for this, which is why this is a secure, server-only operation.
    const { error } = await supabaseAdmin.auth.admin.signOut(token);

    if (error) {
      // Log the error for debugging, but send a generic message to the client.
      console.error('Supabase sign out error:', error);
      return res.status(500).json({ message: 'Could not log out, please try again.' });
    }

    return res.status(200).json({ ok: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
