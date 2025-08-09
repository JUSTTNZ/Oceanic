// app.ts
import express from 'express'

// Extend the Request interface to include rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer
    }
  }
}

import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import firebaseInit from './src/utils/firebase.js'

// Create app & server
const app = express()
const server = http.createServer(app)
app.set('trust proxy', 1)
firebaseInit()

// ===== CORS Configuration =====
const allowedOrigins = [
  'http://localhost:3000',
  'https://oceanic-charts.vercel.app'
]
const vercelRegex = /^https:\/\/oceanic-charts(-[\w-]+)?\.vercel\.app$/

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Supabase server-side calls, curl, Postman)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Cookie',
    'Set-Cookie',
    'apikey',        // Supabase client sends this
    'x-client-info'  // Supabase client sends this
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
// ===== End CORS =====

// Import routers
import userRouter from './src/routes/user.route.js'
import healthCheckRouter from './src/routes/healthcheck.route.js'
import transactionRouter from './src/routes/transaction.route.js'
import paystackWebhookRouter from './src/routes/buy.route.js'
import bitgetRouter from './src/routes/webhook.route.js'
import { errorHandler } from './src/middlewares/error.middleware.js'
import google from './src/routes/google.route.js'
import apiRouter from './src/routes/coinbankrate.js'

// ✅ Setup raw body parsing for webhooks
app.use('/api/v2/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      const rawBody = req.body
      req.rawBody = rawBody
      req.body = JSON.parse(rawBody.toString('utf8'))
    }
    next()
  } catch (error) {
    console.error('Error parsing webhook body:', error)
    res.status(400).json({ message: 'Invalid JSON body' })
  }
})

app.use('/api/v1/paystack', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      const rawBody = req.body
      req.rawBody = rawBody
      req.body = JSON.parse(rawBody.toString('utf8'))
    }
    next()
  } catch (error) {
    console.error('Error parsing paystack webhook body:', error)
    res.status(400).json({ message: 'Invalid JSON body' })
  }
})

// ✅ Use webhooks BEFORE standard body parsers
import webhookRouter from './src/routes/webhook.route.js'
app.use('/api/v2/webhook', webhookRouter)
app.use('/api/v1/paystack', paystackWebhookRouter)

// ✅ Standard body parsers for the rest of the routes
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// Root
app.get('/', (req, res) => {
  res.send('Welcome to the backend!')
})

// Data API
app.use('/api/v1/data', apiRouter)

// Regular routes
app.use('/api/v1/healthCheck', healthCheckRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v2/bitget', bitgetRouter)
app.use('/api/v1/google', google)

// Global error handler
app.use(errorHandler)

export { app, server }
