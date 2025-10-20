console.log("order routes loaded");


import express from "express"
import {userVerify} from "../middleware/authmiddleware.js"
import {allUserOrders, placeOrderOnCOD, placeOrderOnRazorPay, placeOrderOnStripe, updateStatus } from "../controllers/orderController.js"

const orderRouter = express.Router()


orderRouter.get("/Allorders" , userVerify , allUserOrders)
orderRouter.post("/placeOrder" , userVerify , placeOrderOnCOD)
orderRouter.post("/stripe" , userVerify ,placeOrderOnStripe)
orderRouter.post("/razorPay" , userVerify ,placeOrderOnRazorPay)


export default orderRouter