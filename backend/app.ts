// app.ts
import express from 'express';
import cookieParser from 'cookie-parser'; // Must be ESM compatible


const app = express();
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser()); // Could throw if cookie-parser isn't ESM ready


import userRouter from './routes/user.route.js'; // Must exist and be ESM
import healthCheckRouter from "./routes/heathcheck.route.js"
import { errorHandler } from "./middlewares/error.middleware.js"

app.use("/api/v1/healthCheck", healthCheckRouter)
//app.use("/api/v1/users", userRouter)
app.use(errorHandler)

export { app };