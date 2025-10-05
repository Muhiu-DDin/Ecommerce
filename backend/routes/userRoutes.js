import express from "express"
import {jwtVerify} from "../middleware/authmiddleware.js"
import { userLogin  , userRegister, refreshAccessToken , adminLogin, userLogout , getUser } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register" , userRegister)
userRouter.post("/login" , userLogin)
userRouter.post("/logout" , jwtVerify , userLogout)
userRouter.post("/refreshToken" , refreshAccessToken)
userRouter.post("/admin" , adminLogin)
userRouter.get("/getUser" , jwtVerify ,  getUser)

export default userRouter