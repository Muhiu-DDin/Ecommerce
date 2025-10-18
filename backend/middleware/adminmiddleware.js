import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// export const adminMiddleware = (req , res , next) => {

//     if(!req.admin) return res.status(403).json({ success: false, message: "Admins only" });    
//     next()

// }

export const adminVerify = async (req, res, next) => {
  try {
    const token = req.cookies?.adminAccessToken;
    if (!token) return res.status(401).json({ message: "No admin token" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);

    const admin = await userModel.findById(decoded._id);

    if (!admin || admin.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    
    req.admin = admin;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
};
