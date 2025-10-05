import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const jwtVerify = async (req, res, next) => {

  try {
    const token =
      req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
       req.user = null;
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    console.log("Incoming cookies:", req.cookies);
    
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


    const user = await userModel.findById(decodedToken._id).select("-password -refreshToken");
    
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user token" });
    }

    if (decodedToken.role === "admin") {
      const admin = await userModel.findById(decodedToken._id).select("-password -refreshToken");
      req.admin = admin;
      return next();
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
