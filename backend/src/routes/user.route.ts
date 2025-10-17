import { Router } from 'express'
import { requireSupabaseUser } from '../middlewares/supabaseAuth.js'
import { initProfile, getCurrentUser, updateUserDetails, deleteUser, changeUserCurrentPassword, logoutUser, requestPasswordRecovery, resetPassword} from '../controllers/user.controller.js'

const router = Router()
router.post('/init', requireSupabaseUser, initProfile)
router.get('/me', requireSupabaseUser, getCurrentUser)
router.put('/update', requireSupabaseUser, updateUserDetails)
router.delete('/delete', requireSupabaseUser, deleteUser)
router.put('/changepassword', requireSupabaseUser, changeUserCurrentPassword)
router.post('/logout', requireSupabaseUser, logoutUser)
router.post('/recover', requestPasswordRecovery);
router.post('/resetpassword', resetPassword);


export default router
