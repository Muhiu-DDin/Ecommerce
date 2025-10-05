import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name : {type : String , required : true } , 
    password : {  type : String , required : true } ,
    email : { type : String ,  required : true } ,
    cartData : {type : Object , default : {}} ,
    refreshToken : {type : String , default : ""},
    role: { type: String, enum: ["user", "admin"], default: "user" }
   
} , {timestamps : true , minimize : false})

userSchema.pre("save" , async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        next()
    }else{
        return next()
    }
})

userSchema.methods.isPasswordCorrect = async function(password){
    // bcrypt.compare this return true or false
    const result = await bcrypt.compare(password , this.password)
    return result
}

userSchema.methods.generateAccessToken = async function (){

    // The decodedToken in auth-middleware will be an object containing the payload data (that we are passing below)

   return jwt.sign(
        {
            _id:this._id,
            name:this.name,
            email:this.email,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function (){
   
   return jwt.sign(
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



const userModel = mongoose.models?.userModel || mongoose.model("userModel" , userSchema)
export default userModel