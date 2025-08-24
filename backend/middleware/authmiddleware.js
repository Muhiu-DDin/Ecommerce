import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js"

export const jwtVerify = async (req, res, next) => {
    try {
        const token =
            req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new Error("Error in accessing token");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await userModel.findById(decodedToken._id).select("-password -refreshToken");
        console.log("user through jwt =>" , user)

        if (!user) {
            throw new Error("Invalid access token");
        }
        req.user = user;
        next();
    } catch (e) {
        throw new Error(e.message || "Invalid token");
    }
};
