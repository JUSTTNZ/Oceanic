// app.ts
import express from 'express';
import cookieParser from 'cookie-parser'; // Must be ESM compatible
import cors from 'cors'; 
import http from 'http';


const app = express();
const server = http.createServer(app);

// CORS Configuration
app.use(cors({
  origin: ['http://localhost:3000', 
    'https://oceanic-charts.vercel.app' ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser()); // Could throw if cookie-parser isn't ESM ready


import userRouter from './routes/user.route.js'; // Must exist and be ESM
import healthCheckRouter from "./routes/healthcheck.route.js"
import transactionRouter from "./routes/transaction.route.js"
import { errorHandler } from "./middlewares/error.middleware.js"
app.options('*', cors()); 
app.get('/', (req, res) => {
    res.send('Welcome to the backend!');
  });
app.use("/api/v1/healthCheck", healthCheckRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/transaction", transactionRouter)
app.use(errorHandler)

export { app, server };