// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import { Session } from '../models/session.model.js'

/**
 * PATCH /api/v1/auth/activity
 * Updates the lastActivity timestamp for the current user's session
 * Called by the frontend when user is active to prevent idle timeout
 */
export async function updateActivity(req: Request, res: Response) {
  try {
    if (!req.supabaseUser || !req.session) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Update the session's lastActivity timestamp
    req.session.lastActivity = new Date()
    await req.session.save()

    console.log(`✅ Activity updated for user ${req.supabaseUser.id}`)
    return res.status(200).json({
      message: 'Activity updated',
      lastActivity: req.session.lastActivity
    })
  } catch (error) {
    console.error('❌ Error updating activity:', error)
    return res.status(500).json({ message: 'Failed to update activity' })
  }
}

/**
 * POST /api/v1/auth/logout
 * Logs out the user and deletes their session from the database
 * Called when user manually logs out
 */
export async function logout(req: Request, res: Response) {
  try {
    if (!req.supabaseUser) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    // Delete the session from database
    await Session.deleteOne({ userId: req.supabaseUser.id })

    console.log(`🚪 User ${req.supabaseUser.id} logged out`)
    return res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('❌ Error during logout:', error)
    return res.status(500).json({ message: 'Failed to logout' })
  }
}
