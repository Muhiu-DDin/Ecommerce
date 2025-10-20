import express from "express"
import {userVerify} from "../middleware/authmiddleware.js"
import { userLogin  , userRegister, refreshAccessToken , adminLogin, userLogout , getUser , adminLogout} from "../controllers/userController.js"


const userRouter = express.Router()

userRouter.post("/register" , userRegister)
userRouter.post("/userLogin" , userLogin)
userRouter.post("/userLogout" , userVerify , userLogout)
userRouter.post("/refreshToken" , refreshAccessToken)
userRouter.get("/getUser" , userVerify , getUser)


export default userRouter