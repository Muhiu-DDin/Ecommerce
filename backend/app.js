import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

// app.use(express.json()) is used to parse incoming JSON data (POST , PATCH) from the request body. It makes the data accessible via req.body in your route handlers.

app.use(express.json())
app.use(cors())
app.use(cookieParser());


import userRouter from './routes/userRoutes.js'

app.use("/api/user" , userRouter)

export default app;
