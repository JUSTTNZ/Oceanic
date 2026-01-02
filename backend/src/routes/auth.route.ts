import { Router } from 'express'
import { updateActivity, logout } from '../controllers/auth.controller.js'
import { requireSupabaseUser } from '../middlewares/supabaseAuth.js'

const router = Router()

// PATCH /api/v1/auth/activity - Update user activity timestamp
router.patch('/activity', requireSupabaseUser, updateActivity)

// POST /api/v1/auth/logout - Logout user and clear session
router.post('/logout', requireSupabaseUser, logout)

export default router
