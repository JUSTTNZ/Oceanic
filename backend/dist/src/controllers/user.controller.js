import 'dotenv/config';
import { User } from '../models/user.model.js';
import { supabaseAdmin, supabasePublic, supabaseRecoverPassword } from '../lib/supabase.js';
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY // service key for server-side logout
);
export const initProfile = async (req, res, next) => {
    try {
        const supaUser = req.supabaseUser;
        const { id, email, user_metadata } = supaUser;
        // From frontend body
        const { username, fullname, phoneNumber } = req.body;
        let profile = await User.findOne({ supabase_user_id: id });
        if (!profile) {
            const count = await User.countDocuments();
            const role = count === 0 ? "superadmin" : "user";
            // Merge sources: body → supabase metadata → fallback
            const safeUsername = username?.trim() ||
                user_metadata?.username?.trim() ||
                (email ? email.split("@")[0] : `user_${id.slice(0, 6)}`);
            const safeFullname = fullname?.trim() ||
                user_metadata?.fullname?.trim() ||
                "";
            const safePhone = phoneNumber?.trim() ||
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
    }
    catch (e) {
        next(e);
    }
};
export const getCurrentUser = async (req, res, next) => {
    try {
        const { id } = req.supabaseUser;
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
    }
    catch (e) {
        next(e);
    }
};
export const updateUserDetails = async (req, res, next) => {
    try {
        const supaUser = req.supabaseUser;
        if (!supaUser?.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { fullname, phoneNumber } = req.body;
        if (!fullname) {
            return res.status(400).json({ message: "Fullname is required" });
        }
        const updatedUser = await User.findOneAndUpdate({ supabase_user_id: supaUser.id }, { $set: { fullname, phoneNumber } }, { new: true }).select("email username fullname role phoneNumber createdAt");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({
            ok: true,
            message: "User details updated successfully",
            profile: updatedUser,
        });
    }
    catch (err) {
        next(err);
    }
};
export const deleteUser = async (req, res, next) => {
    try {
        const supaUser = req.supabaseUser;
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
    }
    catch (err) {
        next(err);
    }
};
export const changeUserCurrentPassword = async (req, res, next) => {
    try {
        // user is already authenticated by requireSupabaseUser middleware
        const supaUser = req.supabaseUser;
        if (!supaUser?.id || !supaUser.email) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        // 1) Re-authenticate with the current password (nice UX and security)
        // We use the public client here to validate the credentials.
        const { error: reauthError } = await supabasePublic.auth.signInWithPassword({
            email: supaUser.email,
            password: currentPassword,
        });
        if (reauthError) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        // 2) Update password with Admin API (service role)
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(supaUser.id, { password: newPassword });
        if (updateError) {
            return res.status(500).json({ message: updateError.message });
        }
        return res.status(200).json({ ok: true, message: 'Password changed successfully' });
    }
    catch (err) {
        next(err);
    }
};
export const logoutUser = async (req, res, next) => {
    try {
        // Get access token from Authorization header or cookies
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : req.cookies?.['sb-access-token']; // fallback if stored in cookie
        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }
        // Invalidate Supabase session
        const { error } = await supabase.auth.admin.signOut(token);
        if (error) {
            console.error('❌ Supabase logout error:', error.message);
            return res.status(500).json({ message: 'Logout failed', error: error.message });
        }
        // Clear cookies if used
        res.clearCookie('sb-access-token', { httpOnly: true, sameSite: 'strict', secure: true });
        res.clearCookie('sb-refresh-token', { httpOnly: true, sameSite: 'strict', secure: true });
        return res.status(200).json({ ok: true, message: 'Logged out successfully' });
    }
    catch (err) {
        next(err);
    }
};
async function verifyRecaptcha(token, remoteIp) {
    const params = new URLSearchParams();
    params.append('secret', process.env.RECAPTCHA_SECRET_KEY);
    params.append('response', token);
    if (remoteIp)
        params.append('remoteip', remoteIp);
    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
    });
    return resp.json();
}
export const requestPasswordRecovery = async (req, res, next) => {
    try {
        const { email, captchaToken } = req.body;
        if (!email || !captchaToken) {
            return res.status(400).json({ message: 'Email and captchaToken are required' });
        }
        const result = await verifyRecaptcha(captchaToken, req.ip);
        if (!result?.success) {
            return res.status(400).json({
                message: 'CAPTCHA verification failed',
                details: result?.['error-codes'] ?? [],
            });
        }
        const { error } = await supabaseRecoverPassword.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
            redirectTo: `${process.env.APP_URL}/resetpassword`,
        });
        if (error) {
            // Don’t leak account existence; keep message generic
            return res.status(200).json({
                ok: true,
                message: 'If this email exists, a reset link has been sent.',
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'If this email exists, a reset link has been sent.',
        });
    }
    catch (err) {
        next(err);
    }
};
//# sourceMappingURL=user.controller.js.map