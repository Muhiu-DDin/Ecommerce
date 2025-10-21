console.log("order routes loaded");


import express from "express"
import {userVerify} from "../middleware/authmiddleware.js"
import {allUserOrders, placeOrderOnCOD, verifyStripe , placeOrderOnStripe } from "../controllers/orderController.js"

const orderRouter = express.Router()

orderRouter.get("/Allorders" , userVerify , allUserOrders)
orderRouter.post("/placeOrder" , userVerify , placeOrderOnCOD)
orderRouter.post("/stripe" , userVerify ,placeOrderOnStripe)
orderRouter.post("/verifyStripe" , userVerify , verifyStripe)


export default orderRouter