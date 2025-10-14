import { deleteUploadedFiles } from "../middleware/multermiddleware.js"
import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js"

const addProduct = async (req , res)=>{
    try{
        const {productName , price , description , bestSeller , category , subCategory , size} = req.body
        console.log("req.body =>", req.body)
        console.log("req.files =>", req.files)


        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1 , image2 , image3 , image4].filter((item)=>item != undefined)

        // console.log(name , price , description , bestSeller , category , subCategory , sizes)
        // console.log(images)

        // without await Promise.all the array images_url would be  [Promise, Promise, Promise] 

        const images_url = await Promise.all(
            images.map(img => cloudinary.uploader.upload(img.path, { resource_type: "image" })
            .then(res => res.secure_url))
        )

        const product = {
            productName , 
            price : Number(price) ,
            description , 
            bestSeller : bestSeller === "true" ? true : false , 
            category , 
            subCategory ,
            image : images_url , 
            size : JSON.parse(size) ,
            date : Date.now()
        }

        await productModel.create(product)
        
        // req.files (where files is an object) only exist when we uses multer 
        deleteUploadedFiles(req.files)
        
        return res.status(200).json({ success : true , message : "product added successfully"})


    }catch(error){
        console.log("error in addProduct =>", error)
        return res.status(400).json({ success : false , message : "error in add product"})
    }

}

const listProduct = async (req , res)=>{
    try{
        const products = await productModel.find({})
        return res.status(200).json({ success : true , message : "successfully fetched products" , products})
    }catch(error){
        console.log("error in listProduct =>", error)
        return res.status(400).json({ success : false , message : "error in list product"})
    }
}

const removeProduct = async (req , res)=>{
    try{
        await productModel.findByIdAndDelete(req.params.id)
        return res.status(200).json({ success : true, message : "product deleted successfully"})

    }catch(error){
        console.log("error in removeProduct =>", error)
        return res.status(400).json({ success : false , message : "error in remove product"})
    }
}

const singleProduct = async (req , res)=>{
    try{
        const product = await productModel.findById(req.params.id)
        if(!product) return res.status(400).json({ success : false , message : "no such product exist"})
            
        return res.status(200).json({ success : true , message : "product detail fetched successfully" , product})

    }catch(error){
        console.log("error in singleProduct =>", error)
        return res.status(400).json({ success : false , message : "error in single product"})
    }
}

export {addProduct , listProduct , removeProduct , singleProduct}