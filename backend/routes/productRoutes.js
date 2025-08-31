import express from 'express'
import { addProduct , listProduct , removeProduct , singleProduct } from '../controllers/productController.js'
import { upload } from '../middleware/multermiddleware.js'

const productRouter = express.Router()

// When you use upload.fields([...]) req.files.image1 is always an array of files.

productRouter.post("/add" , 
    // These are the field names in the form-data request body (from frontend). 
    upload.fields([{name : "image1" , maxCount : 1} , {name : "image2" , maxCount : 1} ,{name : "image3" , maxCount : 1} ,{name : "image4" , maxCount : 1}]),
    addProduct)
productRouter.delete("/remove/:id" , removeProduct)
productRouter.get("/list" , listProduct)
productRouter.get("/single/:id" , singleProduct)

export default productRouter