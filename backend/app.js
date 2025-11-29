import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express()

// app.use(express.json()) is used to parse incoming JSON data (POST , PATCH) from the request body. It makes the data accessible via req.body in your route handlers.

app.use(express.json())

// app.use(cors({
//   origin: ["http://localhost:5173", "http://localhost:5174"],
//   credentials: true,
// }));
// app.use(cookieParser());

app.use(cors({
  origin: ["https://worldwideforever.vercel.app", "https://foreveradminpannel.vercel.app"],
  credentials: true,
}));
app.use(cookieParser());


import userRouter from './routes/userRoutes.js'
import productRouter from './routes/productRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import cartRouter from './routes/cartRoutes.js';
import orderRouter from './routes/orderRoutes.js';

app.use("/api/user" , userRouter)
app.use("/api/admin/product" , productRouter)
app.use("/api/admin" , adminRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/order", orderRouter)

export default app;
