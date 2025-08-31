import express from "express"
import { userLogin  , userRegister, refreshAccessToken } from "../controllers/userController.js"

const userRouter = express.Router()


userRouter.post("/register" , userRegister)
userRouter.post("/login" , userLogin)
userRouter.post("/refreshToken" , refreshAccessToken)

export default userRouter