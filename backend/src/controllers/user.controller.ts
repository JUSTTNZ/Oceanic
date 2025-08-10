import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model.js'
import { supabaseAdmin, supabasePublic } from '../lib/supabase.js'

export const initProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supaUser = (req as any).supabaseUser as {
      id: string;
      email: string | null;
      user_metadata?: Record<string, any>;
    };
    const { id, email, user_metadata } = supaUser;

    // From frontend body
    const { username, fullname, phoneNumber } = req.body as {
      username?: string;
      fullname?: string;
      phoneNumber?: string;
    };

    let profile = await User.findOne({ supabase_user_id: id });
    if (!profile) {
      const count = await User.countDocuments();
      const role = count === 0 ? "superadmin" : "user";

      // Merge sources: body → supabase metadata → fallback
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
        "";

      profile = await User.create({
        supabase_user_id: id,
        email: (email || "").toLowerCase(),
        username: safeUsername.toLowerCase(),
        fullname: safeFullname,
        phoneNumber: safePhone,
        role,
        isVerified: true,
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