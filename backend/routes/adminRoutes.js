import express from "express"
import { adminVerify } from "../middleware/adminmiddleware.js"
import { adminLogin , adminLogout } from "../controllers/userController.js"
import { getUser } from "../controllers/userController.js"

const adminRouter = express.Router()

adminRouter.post("/login" , adminLogin)
adminRouter.post("/logout" , adminVerify , adminLogout)
adminRouter.get("/getAdmin" , adminVerify , getUser)


export default adminRouter