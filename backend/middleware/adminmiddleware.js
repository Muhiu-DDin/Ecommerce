
export const adminMiddleware = (req , res , next) => {

    if(!req.admin) return res.status(403).json({ success: false, message: "Admins only" });    
    next()

}