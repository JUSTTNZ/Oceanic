// src/middlewares/supabaseAuth.ts
import 'dotenv/config'
import { Request, Response, NextFunction } from 'express'
import { createClient, User as SupaUser } from '@supabase/supabase-js'
import { User } from '../models/user.model.js'
import { Session } from '../models/session.model.js'


declare global {
  namespace Express {
    interface Request {
      supabaseUser?: SupaUser;
      profile?: import('../models/user.model.js').UserDocument;
      session?: import('../models/session.model.js').SessionDocument;
    }
  }
}

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Session timeout configuration
const IDLE_TIMEOUT_MINUTES = parseInt(process.env.IDLE_TIMEOUT_MINUTES || '30')
const ABSOLUTE_TIMEOUT_HOURS = parseInt(process.env.ABSOLUTE_TIMEOUT_HOURS || '8')

export async function requireSupabaseUser(req: Request, res: Response, next: NextFunction) {
  // only log for API routes
  const isApi = req.path.startsWith('/api/')
  try {
    const auth = req.headers.authorization || ''
    if (!auth.startsWith('Bearer ')) {
      if (isApi) console.warn(`❌ No Bearer token found for ${req.method} ${req.path}`)
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = auth.slice(7)

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      if (isApi) console.warn(`❌ Invalid/expired token for ${req.method} ${req.path}: ${error?.message ?? 'unknown'}`)
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    req.supabaseUser = data.user

    // (optional) try to load profile; don't block init if not found
    const profile = await User.findOne({ supabase_user_id: data.user.id })
    if (profile) {
      req.profile = profile
      // console.log(`📄 Mongo profile found: role=${profile.role}`)
    } else {
      // console.log('⚠️ No Mongo profile found for this user')
      req.profile = undefined
    }

    // Check/create session for activity tracking
    // Supabase token is already validated above, so the user is authenticated.
    // The MongoDB session is only for activity tracking — if it's missing or
    // expired we simply create a fresh one instead of rejecting the request.
    let session = await Session.findOne({ userId: data.user.id })

    const needsNewSession =
      !session ||
      new Date() > session.expiresAt ||
      (Date.now() - session.lastActivity.getTime()) > IDLE_TIMEOUT_MINUTES * 60 * 1000

    if (needsNewSession) {
      // Clean up stale session if one exists
      if (session) {
        await Session.deleteOne({ _id: session._id })
        if (isApi) console.log(`♻️ Expired session cleaned up for user ${data.user.id}`)
      }

      // Create a fresh session
      const expiresAt = new Date(Date.now() + ABSOLUTE_TIMEOUT_HOURS * 60 * 60 * 1000)
      session = await Session.create({
        userId: data.user.id,
        lastActivity: new Date(),
        expiresAt
      })
      if (isApi) console.log(`📝 New session created for user ${data.user.id}`)
    } else {
      // Session is still valid — update last activity
      session!.lastActivity = new Date()
      await session!.save()
    }

    req.session = session ?? undefined

    next()
  } catch (e) {
    if (isApi) console.error('❌ requireSupabaseUser error:', e)
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

// role guard you can use for admin-only routes
export function requireRole(...roles: Array<'user' | 'admin' | 'superadmin'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.profile?.role as 'user' | 'admin' | 'superadmin' | undefined
    if (!role || !roles.includes(role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}

export function requireMongoProfile(req: Request, res: Response, next: NextFunction) {
  if (!req.profile) {
    console.warn('❌ requireMongoProfile failed: No profile attached to request')
    return res.status(403).json({ message: 'Profile not initialized' })
  }
  console.log(`✅ Mongo profile OK: role=${req.profile.role}`)
  next()
}

export function superAdminAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.profile) {
    console.warn('❌ superAdminAuth failed: No profile')
    return res.status(403).json({ message: 'Profile not initialized' })
  }
  if (req.profile.role !== 'superadmin') {
    console.warn(`❌ superAdminAuth failed: role=${req.profile.role}`)
    return res.status(403).json({ message: 'Access denied: superadmin only' })
  }
  console.log('✅ superAdminAuth passed')
  next()
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
