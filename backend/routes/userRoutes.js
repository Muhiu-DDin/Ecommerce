import express from "express"
import { jwtVerify } from "../middleware/authmiddleware.js"
import { userLogin , adminLogin , userRegister, refreshAccessToken } from "../controllers/userController.js"

const userRouter = express.Router()


userRouter.post("/register" , userRegister)
userRouter.post("/login" , userLogin)
userRouter.post("/admin" , adminLogin)
userRouter.post("/refreshToken" , refreshAccessToken)

export default userRouter