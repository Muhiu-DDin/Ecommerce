console.log("cart route loaded");

import express from "express"
import { addUserCart, deleteCartItem, getUserCart, updateUserCart } from "../controllers/cartController.js"
import {userVerify} from "../middleware/authmiddleware.js"


const cartRouter = express.Router()

cartRouter.post("/get" , userVerify , getUserCart)
cartRouter.post("/add" , userVerify , addUserCart)
cartRouter.post("/update" ,userVerify , updateUserCart)
cartRouter.post("/delete", deleteCartItem)


export default cartRouter