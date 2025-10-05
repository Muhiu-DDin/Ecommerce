import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

// app.use(express.json()) is used to parse incoming JSON data (POST , PATCH) from the request body. It makes the data accessible via req.body in your route handlers.

app.use(express.json())

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(cookieParser());


import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js';

app.use("/api/user" , userRouter)
app.use("/api/product" , productRouter)

export default app;
