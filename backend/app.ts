// app.ts
import express from 'express';
import cookieParser from 'cookie-parser'; // Must be ESM compatible
import userRouter from './routes/user.route.js'; // Must exist and be ESM


const app = express();
app.use(cookieParser()); // Could throw if cookie-parser isn't ESM ready

app.use("/api/v1/users", userRouter)
export { app };