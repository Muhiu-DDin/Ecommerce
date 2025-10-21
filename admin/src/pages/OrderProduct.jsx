import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { assets } from "../assets/admin_assets/assets";
import { currency } from "../App";

const OrderProduct = () => {
  const [orders , setOrders] = useState([]);
  const { user } = useAuth();

  const fetchAllOrders = async () => {
    try {
      if (!user) return;
      const res = await api.get("/admin/orderList");
      if (res.data?.success) {
        setOrders(res.data.orders);
        console.log("Fetched Orders:", res.data.orders);
      } else {
        toast.error(res.data?.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.log("Error in fetchAllOrders:", error);
      toast.error("Something went wrong while fetching orders");
    }
  };

  const statusHandler = async (event , orderId)=>{
    try{
        const res = await api.post("/admin/updateStatus" , {orderId , status : event.target.value})
        if(res.data?.success){
          await fetchAllOrders()
        }
    }catch(error){
        console.log("error in statusHandler" , error)
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [user]);

  return (
    <div className="p-6">
      <h3 className="text-2xl font-semibold mb-6">Order Page</h3>

      {orders.map((order, index) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-[0.6fr_2fr_1fr_1fr_1fr] gap-4 border border-gray-300 py-10 rounded-xl p-6 mb-6 shadow-sm text-sm text-gray-800"
        >
          <div className="flex justify-center md:justify-start">
            <img
              src={assets.parcel_icon}
              alt="Order"
              className="w-14 h-14 object-contain"
            />
          </div>

          <div className="flex flex-col gap-1">
            {order.items?.map((item, i) => (
              <p key={i}>
                {item.productName} × {item.quantity}{" "}
                <span className="text-gray-500">({item.size})</span>
              </p>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <p className="font-semibold">
              {order.address.firstName} {order.address.lastName}
            </p>
            <p>
              {order.address.street}, {order.address.city},{" "}
              {order.address.state}, {order.address.country} -{" "}
              {order.address.zipCode}
            </p>
            <p>{order.address.phoneNumber}</p>
          </div>

          <div className="flex flex-col gap-1">
            <p>Items: {order.items.length}</p>
            <p>Method: {order.paymentMethod}</p>
            <p>
              Payment: {order.payment ? "Done" : "Pending"}
            </p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="flex flex-col justify-between items-end md:items-start">
            <p className="text-lg font-semibold">
              {currency}{order.amount}
            </p>
            <select
              className="border border-gray-300 rounded-md p-2 text-sm mt-2"
              value={order.status} onChange={(e)=>statusHandler(e , order._id)}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderProduct;
