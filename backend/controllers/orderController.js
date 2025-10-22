import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const currency = "PKR"
const deliveryCharge = 10

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


const placeOrderOnStripe = async (req, res) => {
  try {
    const { userId, items, address, amount } = req.body;
    const { origin } = req.headers;

    const orderObject = {
      userId,
      items,
      address,
      amount,
      payment: false,
      paymentMethod: "Stripe",
    };

    const newOrder = await orderModel.create(orderObject);

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.productName,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charge as separate item
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items, 
      mode: "payment",
    });

    return res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log("error in placeOrderOnStripe", error);
    return res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    let { userId, orderId, success } = req.body;
    success = success === "true"; // string to boolean

    if (success) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true, message: "Payment verified!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Unable to verify payment" });
    }
  } catch (error) {
    console.log("error in verifyStripe", error);
    res.json({ success: false, message: "Error in payment verification" });
  }
};



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
    try{
        const {orderId , status} = req.body
        const response = await orderModel.findByIdAndUpdate(orderId , {status})
        return res.json({success : true , message : "status updated successfully"})
    }catch(error){
      console.log("error in updateStatus" , error)
       return res.json({success : false , message : "error in updating status"})
    }
}

export {placeOrderOnCOD  , placeOrderOnStripe , allAdminOrders , allUserOrders , updateStatus , verifyStripe}

