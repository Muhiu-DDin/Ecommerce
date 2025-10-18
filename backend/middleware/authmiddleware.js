import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

// export const jwtVerify = async (req, res, next) => {

//   try {
//     const token =
//       req?.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//        req.user = null;
//       return res.status(401).json({ success: false, message: "No token provided" });
//     }
//     console.log("Incoming cookies:", req.cookies);
    
//     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);


//     const user = await userModel.findById(decodedToken._id).select("-password -refreshToken");
    
//     if (!user) {
//       return res.status(401).json({ success: false, message: "Invalid user token" });
//     }

//     if (decodedToken.role === "admin") {
//       const admin = await userModel.findById(decodedToken._id).select("-password -refreshToken");
//       req.admin = admin;
//       return next();
//     }

//     req.user = user;
//     next();
//   } catch (e) {
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };


// export const jwtVerify = async (req, res, next) => {
//   try {
//     const token =
//       req?.cookies?.userAccessToken ||
//       req?.cookies?.adminAccessToken ||
//       req.header("Authorization")?.replace("Bearer ", "");

//     if (!token)
//       return res.status(401).json({ success: false, message: "No token provided" });

//     let decoded;
//     try {
//       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_USER);
//     } catch {
//       decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_ADMIN);
//     }

//     const user = await userModel.findById(decoded._id).select("-password -refreshToken");
//     if (!user)
//       return res.status(401).json({ success: false, message: "Invalid user token" });

//     if (user.role === "admin") req.admin = user;
//     else req.user = user;

//     next();
//   } catch (e) {
//     console.error("JWT Verify Error:", e.message);
//     return res.status(401).json({ success: false, message: "Invalid or expired token" });
//   }
// };

export const userVerify = async (req, res, next) => {
  try {
    const token = req.cookies?.userAccessToken;
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

