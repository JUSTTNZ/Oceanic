import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model.js'

export const initProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, email } = (req as any).supabaseUser as { id: string; email: string | null }
    const { username, fullname, phoneNumber } = req.body as {
      username?: string; fullname?: string; phoneNumber?: string
    }

    let profile = await User.findOne({ supabase_user_id: id })
    if (!profile) {
      const count = await User.countDocuments()
      const role = count === 0 ? 'superadmin' : 'user'

      profile = await User.create({
        supabase_user_id: id,
        email: (email || '').toLowerCase(),
        username: (username || (email ? email.split('@')[0] : `user_${id.slice(0, 6)}`)).toLowerCase(),
        fullname: fullname || '',
        phoneNumber: phoneNumber || '',
        role,
        isVerified: true,
      })
    }

    res.json({ ok: true, profile })
  } catch (e) { next(e) }
}

export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as any).supabaseUser as { id: string }
    const profile = await User.findOne({ supabase_user_id: id })
      .select('email username fullname role phoneNumber createdAt')
    res.json({ ok: true, profile })
  } catch (e) { next(e) }
}

export const updateUserDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as any).supabaseUser as { id: string }
    const { fullname, phoneNumber } = req.body
    const updated = await User.findOneAndUpdate(
      { supabase_user_id: id },
      { $set: { fullname, phoneNumber } },
      { new: true }
    ).select('email username fullname role phoneNumber createdAt')
    res.json({ ok: true, profile: updated })
  } catch (e) { next(e) }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = (req as any).supabaseUser as { id: string }
    await User.findOneAndDelete({ supabase_user_id: id })
    res.json({ ok: true })
  } catch (e) { next(e) }
}
