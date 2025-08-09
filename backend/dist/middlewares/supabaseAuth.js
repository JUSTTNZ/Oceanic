import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { User } from '../models/user.model.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY // server key (never expose to client)
);
// 1) Must be first on protected routes
export async function requireSupabaseUser(req, res, next) {
    try {
        const auth = req.headers.authorization || '';
        const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
        if (!token)
            return res.status(401).json({ message: 'Unauthorized' });
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data?.user)
            return res.status(401).json({ message: 'Invalid or expired token' });
        req.supabaseUser = { id: data.user.id, email: data.user.email ?? null };
        // also load your Mongo profile using supabase_user_id
        const profile = await User.findOne({ supabase_user_id: data.user.id });
        if (!profile)
            return res.status(403).json({ message: 'Profile not initialized' });
        req.profile = profile;
        next();
    }
    catch (e) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
// 2) Role guards (use after requireSupabaseUser)
export function requireRole(...roles) {
    return (req, res, next) => {
        const role = req.profile?.role;
        if (!role)
            return res.status(403).json({ message: 'Forbidden' });
        if (!roles.includes(role))
            return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}
// Convenience exports matching your old names
export const adminOrSuperadminAuth = requireRole('admin', 'superadmin');
export const superAdminAuth = requireRole('superadmin');
//# sourceMappingURL=supabaseAuth.js.map