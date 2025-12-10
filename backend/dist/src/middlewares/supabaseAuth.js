// src/middlewares/supabaseAuth.ts
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { User } from '../models/user.model.js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
export async function requireSupabaseUser(req, res, next) {
    // only log for API routes
    const isApi = req.path.startsWith('/api/');
    try {
        const auth = req.headers.authorization || '';
        if (!auth.startsWith('Bearer ')) {
            if (isApi)
                console.warn(`❌ No Bearer token found for ${req.method} ${req.path}`);
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = auth.slice(7);
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data?.user) {
            if (isApi)
                console.warn(`❌ Invalid/expired token for ${req.method} ${req.path}: ${error?.message ?? 'unknown'}`);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.supabaseUser = data.user;
        // (optional) try to load profile; don’t block init if not found
        const profile = await User.findOne({ supabase_user_id: data.user.id });
        if (profile) {
            req.profile = profile;
            // console.log(`📄 Mongo profile found: role=${profile.role}`)
        }
        else {
            // console.log('⚠️ No Mongo profile found for this user')
            req.profile = undefined;
        }
        next();
    }
    catch (e) {
        if (isApi)
            console.error('❌ requireSupabaseUser error:', e);
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
// role guard you can use for admin-only routes
export function requireRole(...roles) {
    return (req, res, next) => {
        const role = req.profile?.role;
        if (!role || !roles.includes(role))
            return res.status(403).json({ message: 'Forbidden' });
        next();
    };
}
export function requireMongoProfile(req, res, next) {
    if (!req.profile) {
        console.warn('❌ requireMongoProfile failed: No profile attached to request');
        return res.status(403).json({ message: 'Profile not initialized' });
    }
    console.log(`✅ Mongo profile OK: role=${req.profile.role}`);
    next();
}
export function superAdminAuth(req, res, next) {
    if (!req.profile) {
        console.warn('❌ superAdminAuth failed: No profile');
        return res.status(403).json({ message: 'Profile not initialized' });
    }
    if (req.profile.role !== 'superadmin') {
        console.warn(`❌ superAdminAuth failed: role=${req.profile.role}`);
        return res.status(403).json({ message: 'Access denied: superadmin only' });
    }
    console.log('✅ superAdminAuth passed');
    next();
}
// export function adminOrSuperadminAuth(req: Request, res: Response, next: NextFunction) {
//   if (!req.profile) {
//     console.warn('❌ adminOrSuperadminAuth failed: No profile')
//     return res.status(403).json({ message: 'Profile not initialized' })
//   }
//   if (!['admin', 'superadmin'].includes(req.profile.role)) {
//     console.warn(`❌ adminOrSuperadminAuth failed: role=${req.profile.role}`)
//     return res.status(403).json({ message: 'Access denied: admin or superadmin only' })
//   }
//   console.log(`✅ adminOrSuperadminAuth passed: role=${req.profile.role}`)
//   next()
// }
//# sourceMappingURL=supabaseAuth.js.map