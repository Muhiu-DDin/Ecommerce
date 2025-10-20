import express from "express"
import { adminVerify } from "../middleware/adminmiddleware.js"
import { adminLogin , adminLogout } from "../controllers/userController.js"
import { getUser } from "../controllers/userController.js"
import { allAdminOrders, updateStatus } from "../controllers/orderController.js"

const adminRouter  = express.Router()

adminRouter.post("/login" , adminLogin)
adminRouter.post("/logout" , adminVerify , adminLogout)
adminRouter.get("/getAdmin" , adminVerify , getUser)

adminRouter.get("/orderList" , adminVerify , allAdminOrders )
adminRouter.post("/updateStatus" ,adminVerify , updateStatus)



export default adminRouter