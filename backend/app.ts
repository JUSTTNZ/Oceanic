// app.ts
import express from 'express';

// Extend the Request interface to include rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: Buffer;
    }
  }
}
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
//import firebaseInit  from './utils/firebase.js'
const app = express();
const server = http.createServer(app);

//firebaseInit()
// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://oceanic-charts.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-signature', 'Cache-Control' ]  // Added x-signature header
}));

app.options('*', cors());

// Import routers
import userRouter from './routes/user.route.js';
import healthCheckRouter from "./routes/healthcheck.route.js";
import transactionRouter from "./routes/transaction.route.js";
import paystackWebhookRouter from "./routes/buy.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import google from './routes/google.route.js'
// ✅ Setup raw body parsing for webhooks
app.use('/api/v1/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      const rawBody = req.body;
      req.rawBody = rawBody; // Store the raw body
      req.body = JSON.parse(rawBody.toString('utf8')); // Parse it for later use
    }
    next();
  } catch (error) {
    console.error('Error parsing webhook body:', error);
    res.status(400).json({ message: 'Invalid JSON body' });
  }
});

// Add similar raw body handling for Paystack if needed
app.use('/api/v1/paystack', express.raw({ type: 'application/json' }), (req, res, next) => {
  try {
    if (req.body && req.body.length) {
      const rawBody = req.body;
      req.rawBody = rawBody;
      req.body = JSON.parse(rawBody.toString('utf8'));
    }
    next();
  } catch (error) {
    console.error('Error parsing paystack webhook body:', error);
    res.status(400).json({ message: 'Invalid JSON body' });
  }
});

// ✅ Use webhooks BEFORE standard body parsers
import webhookRouter from "./routes/webhook.route.js";
app.use('/api/v1/webhook', webhookRouter);
app.use('/api/v1/paystack', paystackWebhookRouter);

// ✅ Standard body parsers for the rest of the routes
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Regular routes that use parsed JSON
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v2/transaction", transactionRouter);
//app.use("/api/v1/google", google);

// Global error handler
app.use(errorHandler);

export { app, server };