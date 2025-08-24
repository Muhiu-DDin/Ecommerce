import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : {type : String , required : true } , 
    description : {  type : String , required : true } ,
    price : { type : Number ,  required : true } ,
    image : { type : Array , required : true } , 
    subCategory : { type : String , required : true } , 
    category : { type : String , required : true } ,
    sizes : { type : Array , required : true } ,
    bestSeller : {type : Boolean} 
} , {timestamps : true})

const productModel = mongoose.models?.productModel || mongoose.model("productModel" , productSchema)
export default productModel