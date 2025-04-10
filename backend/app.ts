// app.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route';

const app = express();

// Essential middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRouter); // Note: Fixed typo from vv1 to v1

export { app };