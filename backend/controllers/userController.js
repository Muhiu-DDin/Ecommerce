import userModel from "../models/userModel.js"
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const generateRefreshAndAccessToken = async (id)=>{
    try{
        const user = await userModel.findById(id)

        const refreshToken =  await user.generateRefreshToken()
        const accessToken = await user.generateAccessToken()

        user.refreshToken = refreshToken

    //since we are passing only refreshToken to user in database , when we use .save it checks for all the required fields to be pass for example password , here we only passing refreshToken so we dont want to check others fields 

       await user.save({validateBeforeSave : false})
       return {refreshToken , accessToken }

    }catch(e){
        console.log("error in generateRefreshAndAccessToken " , e)
        throw new Error("something went wrong while generating tokens")
    }
}


// login user 
export const userLogin = async (req , res) => {
    try{
        const {email , password} = req.body
        if(!email || !password ) return res.status(400).json({success : false , message : "email and password is required"})
        const user = await userModel.findOne({email})   
        if (!user) return res.status(400).json({success : false , message : "no such user exist"})
        const isCorrect = await user.isPasswordCorrect(password)

        if(isCorrect){
           const {refreshToken , accessToken} =  await generateRefreshAndAccessToken(user._id)
            const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }; 

            res.cookie("refreshToken", refreshToken, options);
            res.cookie("accessToken", accessToken, options);

            return res.status(201).json({
                success: true,
                message: "User login successfully",
                accessToken
            });

        }else{
            return res.status(400).json({success : false , message : "incorrect password"})
        }
        

    }catch{
        console.error("Error in user login:", error);
        return res.status(400).json({success : false , message : "error in login user"})
    }
}

// register user 
export const userRegister = async (req, res) => {

    try {
        const usernameRegex = /^[A-Za-z0-9-]+$/;
        const { name, password, email } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please enter email and password" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        if (!usernameRegex.test(name)) {
            return res.status(400).json({ success: false, message: "Username can only contain letters, numbers, and hyphens" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const createdUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        });

        const { refreshToken, accessToken } = await generateRefreshAndAccessToken(createdUser._id);

        const options = {
            httpOnly: true,
           secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        }; 

        res.cookie("refreshToken", refreshToken, options);
        res.cookie("accessToken", accessToken, options);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            accessToken
        });

    } catch (error) {
        console.error("Error in registering user", error);
        res.status(401).json({ success: false, message: "Server error" });
    }
};

export const refreshAccessToken = async (req , res)=> {
         const refreshToken = req.cookies.refreshToken
         if(!refreshToken) return res.status(500).json({success : false , message : "No refresh token"})
         try{
            const decodedRefreshToken = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET)
            const user = await userModel.findById(decodedRefreshToken._id)
            if(!user) return res.status(400).json({message : "Invalid refresh token"})
           const { refreshToken: newRefreshToken, accessToken: newToken } = await generateRefreshAndAccessToken(decodedRefreshToken._id)

            const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        };

        res.cookie("refreshToken", newRefreshToken, options);
        res.cookie("accessToken", newToken , options);

        return res.status(200).json({
            message : "access token updated!" ,
            newToken , newRefreshToken
        })

         }catch(error){
             console.error("Error in refreshAccessToken:", error);
            return res.status(500).json({
            message : "error in updating access token"
        })
         }
}

// admin login 
export const adminLogin = async (req , res) => {

}