import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";


export const userVerify = async (req, res, next) => {
  //  console.log("userVerify triggered for:", req.originalUrl);
  try {
    const token = req.cookies?.userAccessToken || req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No user token" });

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER);

    const user = await userModel.findById(decoded._id);

    if (!user) return res.status(401).json({ message: "Invalid user" });
    req.user = user;
    next();
    
  } catch {
    return res.status(401).json({ message: "Invalid or expired user token" });
  }
};

