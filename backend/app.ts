import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import http from 'http';
import webhookRouter from "./routes/webhook.route.js"; 
import paystackWebhookRouter from "./routes/buy.route.js"; // ← this should come before body parsers

const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 'https://oceanic-charts.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Mount webhook routes that require raw body parsing BEFORE json parser
app.use('/api/v1/paystack', paystackWebhookRouter);
app.use('/api/v1/webhook', webhookRouter);

// ✅ Then use body parsers for rest of the app
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routers
import userRouter from './routes/user.route.js'; 
import healthCheckRouter from "./routes/healthcheck.route.js";
import transactionRouter from "./routes/transaction.route.js";
import { errorHandler } from "./middlewares/error.middleware.js";

app.options('*', cors()); 
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/transaction", transactionRouter);

// Global error handler
app.use(errorHandler);

export { app, server };
