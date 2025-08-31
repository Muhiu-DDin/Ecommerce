export const jwtVerify = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decodedToken.role === "admin") {
      req.admin = { email: decodedToken.email }; 
      return next();
    }

 
    const user = await userModel.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user token" });
    }

    req.user = user;
    next();
  } catch (e) {
    return res.status(403).json({ success: false, message: "Invalid or expired token" });
  }
};
