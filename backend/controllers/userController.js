import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

const userCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax", 
   path: "/", 
  // domain: "localhost",
};

const adminCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax", 
   path: "/api/admin", 
  // domain: "localhost",
};

// const generateRefreshAndAccessToken = async (id) => {
//   try {
//     const user = await userModel.findById(id);
//     if (!user) throw new Error("User not found");

//     const refreshToken = await user.generateRefreshToken();
//     const accessToken = await user.generateAccessToken();

//     user.refreshToken = refreshToken;
//     await user.save({ validateBeforeSave: false });

//     return { refreshToken, accessToken };
//   } catch (e) {
//     console.error("Error in generateRefreshAndAccessToken:", e);
//     throw e;
//   }
// };

// export const userLogin = async (req, res) => {
//   try {
//     const { email , password} = req.body;
//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email and password are required" });

//     const user = await userModel.findOne({ email });
//     if (!user)
//       return res.status(400).json({ success: false, message: "No such user exist" });

//     const isCorrect = await user.isPasswordCorrect(password);
//     if (!isCorrect)
//       return res.status(400).json({ success: false, message: "Incorrect email or password" });

//     const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);


//     res.cookie("refreshToken", refreshToken, cookieOptions);
//     res.cookie("accessToken", accessToken, cookieOptions);

//     return res.status(200).json({
//       success: true,
//       message: "User login successful",
//       accessToken,
//       user
//     });
//   } catch (error) {
//     console.error("Error in user login:", error.message);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };


// export const userRegister = async (req, res) => {
//   try {
//     const usernameRegex = /^[A-Za-z0-9-]+$/;
//     const { name, password, email } = req.body;

//     if (!email || !password || !name)
//       return res.status(400).json({ success: false, message: "All fields required" });

//     if (!validator.isEmail(email))
//       return res.status(400).json({ success: false, message: "Invalid email" });

//     if (password.length < 8)
//       return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

//     const userExist = await userModel.findOne({ email });
//     if (userExist)
//       return res.status(400).json({ success: false, message: "User already exists" });

//     if (!usernameRegex.test(name))
//       return res.status(400).json({ success: false, message: "Username can only contain letters, numbers, and hyphens" });

//     const createdUser = await userModel.create({ name, email, password });
//     const { refreshToken, accessToken } = await generateRefreshAndAccessToken(createdUser._id);

//     res.cookie("refreshToken", refreshToken, cookieOptions);
//     res.cookie("accessToken", accessToken, cookieOptions);

//     return res.status(201).json({
//       success: true,
//       message: "User created successfully",
//       accessToken,
//       user : createdUser
//     });
//   } catch (error) {
//     console.error("Error in registering user", error);
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };



// export const userLogout = async (req, res) => {
//   try {
//     // await userModel.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } }, { new: true });


//     res.clearCookie("refreshToken", cookieOptions);
//     res.clearCookie("accessToken", cookieOptions);

//     return res.status(200).json({ message: "User logged out successfully" });
//   } catch (error) {
//     console.error("User logout error:", error);
//     return res.status(400).json({ success: false, message: "Error in logout" });
//   }
// };

// export const refreshAccessToken = async (req, res) => {
//   const refreshToken = req?.cookies?.refreshToken;
//   if (!refreshToken)
//     return res.status(401).json({ success: false, message: "No refresh token" });

//   try {
//     const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
//     const user = await userModel.findById(decoded._id);
//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid refresh token" });

//     const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
//       await generateRefreshAndAccessToken(decoded._id);

//     res.cookie("refreshToken", newRefreshToken, cookieOptions);
//     res.cookie("accessToken", newAccessToken, cookieOptions);

//     return res.status(200).json({
//       success: true,
//       message: "Access token refreshed",
//       accessToken: newAccessToken,
//     });
//   } catch (error) {
//     console.error("Error in refreshAccessToken:", error.message);
//     return res.status(500).json({ success: false, message: "Error refreshing token" });
//   }
// };


// export const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const adminExist = await userModel.findOne({ email, role: "admin" });
//     if (!adminExist)
//       return res.status(400).json({ success: false, message: "No such admin exist" });

//     const isCorrect = await adminExist.isPasswordCorrect(password);
//     if (!isCorrect)
//       return res.status(400).json({ success: false, message: "Incorrect credentials" });

//     const { refreshToken, accessToken } = await generateRefreshAndAccessToken(adminExist._id);

//     // res.cookie("refreshToken", refreshToken, cookieOptions);
//     // res.cookie("accessToken", accessToken, cookieOptions);

//     res.cookie("adminAccessToken", accessToken, cookieOptions);
//   res.cookie("adminRefreshToken", refreshToken, cookieOptions);


//     return res.status(200).json({
//       success: true,
//       message: "Admin login successful",
//       accessToken,
//       adminData: adminExist,
//     });
//   } catch (error) {
//     console.error("Admin login error:", error.message);
//     return res.status(500).json({ success: false, message: "Admin login error" });
//   }
// };


export const refreshAccessToken = async (req, res) => {
  const refreshToken =
    req.cookies?.userRefreshToken || req.cookies?.adminRefreshToken;

  if (!refreshToken)
    return res.status(401).json({ success: false, message: "No refresh token provided" });

  try {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_USER);
    } catch {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_ADMIN);
    }

    const user = await userModel.findById(decoded._id);
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid refresh token" });

    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      await generateRefreshAndAccessToken(user._id);

    const refreshCookieName =
      user.role === "admin" ? "adminRefreshToken" : "userRefreshToken";
    const accessCookieName =
      user.role === "admin" ? "adminAccessToken" : "userAccessToken";

    const cookieOptions = user.role === "admin" ? adminCookieOptions : userCookieOptions;

    res.cookie(refreshCookieName, newRefreshToken, cookieOptions);
    res.cookie(accessCookieName, newAccessToken, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Error in refreshAccessToken:", error.message);
    return res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};


const generateRefreshAndAccessToken = async (id) => {
  try {
    const user = await userModel.findById(id);
    if (!user) throw new Error("User not found");

    const isAdmin = user.role === "admin";

    const accessSecret = isAdmin
      ? process.env.ACCESS_TOKEN_SECRET_ADMIN
      : process.env.ACCESS_TOKEN_SECRET_USER;

    const refreshSecret = isAdmin
      ? process.env.REFRESH_TOKEN_SECRET_ADMIN
      : process.env.REFRESH_TOKEN_SECRET_USER;

    const accessToken = jwt.sign(
      { _id: user._id, role: user.role },
      accessSecret,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: user._id, role: user.role },
      refreshSecret,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (e) {
    console.error("Error in generateRefreshAndAccessToken:", e.message);
    throw e;
  }
};


export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "No such user exist" });

    const isCorrect = await user.isPasswordCorrect(password);
    if (!isCorrect)
      return res.status(400).json({ success: false, message: "Incorrect email or password" });

    const { refreshToken, accessToken } = await generateRefreshAndAccessToken(user._id);

    res.cookie("userRefreshToken", refreshToken, userCookieOptions);
    res.cookie("userAccessToken", accessToken, userCookieOptions);

    return res.status(200).json({
      success: true,
      message: "User login successful",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Error in user login:", error.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userRegister = async (req, res) => {
  try {
    const usernameRegex = /^[A-Za-z0-9-]+$/;
    const { name, password, email } = req.body;

    if (!email || !password || !name)
      return res.status(400).json({ success: false, message: "All fields required" });

    if (!validator.isEmail(email))
      return res.status(400).json({ success: false, message: "Invalid email" });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    const userExist = await userModel.findOne({ email });
    if (userExist)
      return res.status(400).json({ success: false, message: "User already exists" });

    if (!usernameRegex.test(name))
      return res.status(400).json({ success: false, message: "Username can only contain letters, numbers, and hyphens" });

    const createdUser = await userModel.create({ name, email, password });
    const { refreshToken, accessToken } = await generateRefreshAndAccessToken(createdUser._id);

    res.cookie("userRefreshToken", refreshToken, userCookieOptions);
    res.cookie("userAccessToken", accessToken, userCookieOptions);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
      user: createdUser,
    });
  } catch (error) {
    console.error("Error in registering user", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("userRefreshToken",userCookieOptions);
    res.clearCookie("userAccessToken", userCookieOptions);

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("User logout error:", error);
    return res.status(400).json({ success: false, message: "Error in logout" });
  }
};


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminExist = await userModel.findOne({ email, role: "admin" });
    if (!adminExist)
      return res.status(400).json({ success: false, message: "No such admin exist" });

    const isCorrect = await adminExist.isPasswordCorrect(password);
    if (!isCorrect)
      return res.status(400).json({ success: false, message: "Incorrect credentials" });

    const { refreshToken, accessToken } = await generateRefreshAndAccessToken(adminExist._id);

    res.cookie("adminRefreshToken", refreshToken, adminCookieOptions);
    res.cookie("adminAccessToken", accessToken, adminCookieOptions);

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      accessToken,
      adminData: adminExist,
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(500).json({ success: false, message: "Admin login error" });
  }
};


export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminRefreshToken", adminCookieOptions);
    res.clearCookie("adminAccessToken", adminCookieOptions);

    return res.status(200).json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(400).json({ success: false, message: "Error in logout" });
  }
};

export const getUser = async (req, res) => {
  // fetching user working is in middlewares 
  try {
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: req.user || req.admin,
    });
  } catch (error) {
    console.log("error in getUser => " , error.message)
    return res.status(400).json({ success: false, message: "Error in get user" });
  }
};

