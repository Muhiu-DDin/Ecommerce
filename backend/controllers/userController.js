import userModel from "../models/userModel.js"
import validator from "validator";
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
        return res.status(400).json({success : false , message : "something went wrong"})
    }
}


// login user 
export const userLogin = async (req , res) => {
    try{
        const {email , password} = req.body
        if(!email || !password ) return res.status(400).json({success : false , message : "email and password are required"})
        const user = await userModel.findOne({email})   
        if (!user) return res.status(400).json({success : false , message : "no such user exist"})
        const isCorrect = await user.isPasswordCorrect(password)
        console.log("isCorrect =>" , isCorrect)

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
            return res.status(400).json({success : false , message : "incorrect email or password"})
        }
        

    }catch (error) {
    console.error("Error in user login:", error);
    return res.status(500).json({ success: false, message: "error in login user" });
}
}

// register user 
export const userRegister = async (req, res) => {

    try {
        const usernameRegex = /^[A-Za-z0-9-]+$/;
        const { name, password, email } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Please enter the required fields" });
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

        const createdUser = await userModel.create({
            name,
            email,
            password
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

// logout user 
export const logout = async (req , res)=>{
    try{
     await userModel.findByIdAndUpdate(
        req.user._id, 
        { $set : { refreshToken : undefined } }, 
        { new : true }
    )
    res.clearCookie("refreshToken")
    res.clearCookie("accessToken")
        return res.status(200).json({message : "user logout successfully"})
    }catch(error){
        console.log("user logout error =>" , error)
          return res.status(400).json({success : false , message : "error in logout"})
    }
}

// refresh the expire access token 
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

import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminExist = await userModel.findOne({email})

    if(!adminExist) return res.status(400).json({ success: false, message: "no such admin exist" });
 
   const {refreshToken , accessToken} =  await generateRefreshAndAccessToken(adminExist._id)
   
      const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
                sameSite: "strict"
            }; 

            res.cookie("refreshToken", refreshToken, options);
            res.cookie("accessToken", accessToken, options);


    return res.status(200).json({ success: true, message: "admin login successfully" });

  } catch (error) {
    console.log("admin login error =>", error);
    return res.status(500).json({ success: false, message: "Admin login error" });
  }
};
