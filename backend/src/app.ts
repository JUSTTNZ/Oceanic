// app.ts
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import http from 'http'
import firebaseInit from '../src/utils/firebase.js'
//import connectDB from './config/db.js';

// Connect to the database as soon as the app starts
//connectDB();

// Extend Express types
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer
    }
  }
}

const app = express()
const server = http.createServer(app)
app.set('trust proxy', 1)
firebaseInit()

// ===== CORS =====
const allowedOrigins = [
  'https://oceaniccharts.com',
  'https://www.oceaniccharts.com',
  'http://localhost:3000',
  'https://oceanic-charts.vercel.app'
]
const vercelRegex = /^https:\/\/oceanic-charts(-[\w-]+)?\.vercel\.app$/

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin) || vercelRegex.test(origin)) {
      return callback(null, true)
    }
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 'Authorization', 'X-Requested-With', 'Cookie', 'Set-Cookie',
    'apikey', 'x-client-info'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
// ===== End CORS =====

// ✅ Raw body parsing for webhooks
app.use('/api/v2/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      req.rawBody = req.body
      req.body = JSON.parse(req.body.toString('utf8'))
    }
    next()
  } catch {
    res.status(400).json({ message: 'Invalid JSON body' })
  }
})
app.use('/api/v1/paystack', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      req.rawBody = req.body
      req.body = JSON.parse(req.body.toString('utf8'))
    }
    next()
  } catch {
    res.status(400).json({ message: 'Invalid JSON body' })
  }
})

// ✅ Webhook routes first
import webhookRouter from '../src/routes/webhook.route.js'
import paystackWebhookRouter from '../src/routes/buy.route.js'
app.use('/api/v2/webhook', webhookRouter)
app.use('/api/v1/paystack', paystackWebhookRouter)

// ✅ Standard body parsers
app.use(express.json({ limit: '16kb' }))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

// ===== ROUTES =====
import userRouter from '../src/routes/user.route.js'
import healthCheckRouter from '../src/routes/healthcheck.route.js'
import emailRouter from '../src/routes/email.route.js'
import transactionRouter from '../src/routes/transaction.route.js'
import notificationRouter from '../src/routes/notification.route.js'
import bitgetRouter from '../src/routes/webhook.route.js'
import apiRouter from '../src/routes/coinbankrate.js'
import { errorHandler } from '../src/middlewares/error.middleware.js'

app.get('/', (_, res) => res.send('Welcome to the backend!'))
app.use('/api/v1/data', apiRouter)
app.use('/api/v1/healthCheck', healthCheckRouter)
app.use('/api/v1/users', userRouter)
app.use("/api/v1/email", emailRouter);
app.use('/api/v1/transaction', transactionRouter)
app.use('/api/v1/notifications', notificationRouter)
app.use('/api/v2/bitget', bitgetRouter)

// ===== Error handler =====
app.use(errorHandler)

export default app
export { server }
