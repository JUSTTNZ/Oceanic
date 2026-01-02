// src/routes/support.route.ts
import { Router } from 'express'
import { sendSupportEmail } from '../controllers/support.controller.js'

const router = Router()

// POST /api/v1/support/contact - Send support message
router.post('/contact', sendSupportEmail)

export default router
