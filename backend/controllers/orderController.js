import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrderOnCOD = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;

    const orderObject = {
      userId,
      items,
      address,
      amount,
      payment: false,
      paymentMethod: "COD",
    };

    await orderModel.create(orderObject);
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    console.log("Order request received:", req.body);
    res.json({ success: true, message: "Order placed successfully" });
  } catch (error) {
    console.log("Error in placeOrderOnCOD", error);
    res.json({ success: false, message: "Error in placing order" });
  }
};


const placeOrderOnRazorPay = async (req , res) =>{

}

const placeOrderOnStripe = async (req , res) =>{

}

// orders to show on frontend 
const allUserOrders = async (req, res) => {
  try {
   
    const ordersRes = await orderModel.find({ userId: req.user._id });

    if (ordersRes && ordersRes.length > 0) {
      return res.json({
        success: true,
        message: "User orders fetched successfully",
        orders: ordersRes,
      });
    } else {
      return res.json({
        success: true,
        message: "No orders found for this user",
        orders: [],
      });
    }

  } catch (error) {
    console.log("error in allUserOrders", error);
    return res.json({
      success: false,
      message: "Unable to fetch user orders",
    });
  }
};


// orders for admin panel 
const allAdminOrders = async (req , res) =>{
    try{
       const allOrders = await orderModel.find({})
       if(allOrders){
        return res.json({success : true , message : "orders fetched!" , orders : allOrders})
       }
    }catch(error){
        console.log("error in admin orders" , error)
         return res.json({success : false , message : "error in allAdminOrders!"})
    }
}

// updating status ,  for admin 
const updateStatus = async (req , res) =>{

}

export {placeOrderOnCOD , placeOrderOnRazorPay , placeOrderOnStripe , allAdminOrders , allUserOrders , updateStatus}

