import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { assets } from "../assets/admin_assets/assets";
import { currency } from "../App";

const OrderProduct = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

  // 🧩 Fetch all orders for admin
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

  useEffect(() => {
    fetchAllOrders();
  }, [user]);

  return (
  <div className="order-container">
  {orders.map((order, index) => (
    <div key={index} className="border rounded-lg p-4 mb-4">
      <div className="flex items-start gap-4">
       
        <img
          src={assets.parcel_icon}
          alt="product"
          className="w-16 h-16 object-cover rounded-md"
        />

        <div className="flex-1">
          <div className="font-semibold text-gray-900 mb-1">
            {order.items?.map((item, i) => (
              <div key={i}>
                {item.name} × {item.quantity}{" "}
                <span className="text-gray-500">({item.size})</span>
              </div>
            ))}
          </div>

      
          <div className="text-sm text-gray-600">
            {order.address.street}, {order.address.city}, {order.address.state},{" "}
            {order.address.country}, {order.address.zipcode}
            <br />
            {order.address.phone}
          </div>

  
          <div className="flex justify-between items-center mt-2 text-sm text-gray-700">
            <span>Items: {order.items.length}</span>
            <span>${order.amount}</span>
          </div>

          <div className="flex justify-between items-center mt-1 text-sm text-gray-500">
            <span>Method: {order.paymentMethod}</span>
            <span>Payment: {order.payment ? "Paid" : "Pending"}</span>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
          </div>

        
          <div className="mt-3">
            <select
              className="border border-gray-300 rounded-md p-1 text-sm"
              value={order.status}
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>

  );
};

export default OrderProduct;
