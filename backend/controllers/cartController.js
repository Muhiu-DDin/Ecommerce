import userModel from "../models/userModel.js"

export const addUserCart = async (req , res) => {
    console.log("addUserCart function loaded")
    try{
        const {userId , itemId , size} = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cartData = userData.cartData;
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1 
            }else{
                cartData[itemId][size] = 1
            }
        }else{
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }
       await userModel.findByIdAndUpdate(userId, { cartData });
        res.json({success : true , message : "item added successfully"} )
        
    }catch(error){
            console.log("Error in addUserCart" , error)
            res.json({success : false , message : "adding item failed"} )
    }
}

export const updateUserCart = async (req , res) => {
    try{
        const {userId , itemId , size , quantity } = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
             return res.status(404).json({ success: false, message: "User not found" });
        }   
        let cartData = userData.cartData;
        cartData[itemId][size] = quantity
        await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });
        res.json({success : true , message : "cart updated successfully" , cartData})
    }catch(error){
        console.log("error in updateUserCart" , error)
        res.json({success : false , message : "updating cart failed"})
    }
}

export const getUserCart = async (req , res) => {
    try{
        const {userId} = req.body
        const userData = await userModel.findById(userId)
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const cartData = userData.cartData;
        res.json({success : true , message : "cart fetched successfully" , cartData})

    }catch(error){
        console.log("error in getting cart" , error)
        res.json({success : false , message : "getting cart items failed"})
    }
}

export const deleteCartItem = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = user.cartData;

    if (cartData[itemId] && cartData[itemId][size]) {
      delete cartData[itemId][size];

      // if no sizes left , remove whole item
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
      await userModel.findByIdAndUpdate(userId, { cartData });
      return res.json({ success: true, message: "Item/size removed successfully" });
    }

    res.json({ success: false, message: "Item/size not found in cart" });
  } catch (error) {
    console.log("Error in deleteCartItem:", error);
    res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};

