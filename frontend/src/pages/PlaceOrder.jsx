import { assets } from '@/assets/frontend_assets/assets'
import CartTotal from '@/components/CartTotal'
import Title from '@/components/Title'
import React, { useState } from 'react'
import { useFrontendAuth } from '@/context/ShopContext'
import axiosInstance from '@/utils/axiosInstance'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from "lucide-react";
import { toast } from 'react-toastify'

function PlaceOrder() {
  const [method, setMethod] = useState("COD")
  const [loading, setLoading] = useState(false);
  const { products , currency , delivery_fee , cartItems , user , getCartAmount , setCartItems} = useFrontendAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    phoneNumber: ""
  })

  const onHandleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{

      if (!user){
        toast("please login before placing order")
        navigate("/login");
      }

        let orderItems = [] 

        for(let id in cartItems){
          for(let size in cartItems[id]){
            const itemInfo = structuredClone(products.find((item)=>item._id === id))

            // the founded obj have no size and quantity keys so we assign them it automatically created these keys as this is not nested structure like in addToCart function in context file 

            itemInfo.size = size
            itemInfo.quantity = cartItems[id][size]
            orderItems.push(itemInfo)
          }
        }

        const orderData = {
          userId : user._id ,
          address : formData , 
          amount : getCartAmount() + delivery_fee ,
          items : orderItems
        }

        switch(method){
          case "COD":
            const res = await axiosInstance.post("/order/placeOrder", orderData)

            if (res.data?.success) {
              setCartItems({});
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                street: "",
                city: "",
                state: "",
                country: "",
                zipCode: "",
                phoneNumber: ""
              });
              console.log("orderItems =>" , orderItems)
              navigate("/order");

            }else{
                console.log("error while placing order" , res.data?.message)
            }
            break ;

            case("stripe"):
              const stripeRes = await axiosInstance.post("/order/stripe" , orderData )
              // it is the success of the request to create a Stripe session, not the success of the payment itself.
              if(stripeRes.data?.success){
                  window.location.replace(stripeRes.data?.session_url)
              }else{
                toast.error(stripeRes.data?.message)
              }
              break;
          default :
            break ;
        }
    }catch(error){
      console.log("error in onSubmit in placeOrder.js" , error)
    }finally{
      setLoading(false)
    }

  }

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-20 sm:pt-14 min-h-[80vh] border-t">
      {/* left side ................. */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 w-full sm:max-w-[480px]"
      >
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input
            name="firstName"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="text"
            placeholder="First name"
          />
          <input
            name="lastName"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="text"
            placeholder="Last name"
          />
        </div>

        <input
          name="email"
          required
          onChange={onHandleChange}
          className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
          type="email"
          placeholder="Email address"
        />

        <input
          name="street"
          required
          onChange={onHandleChange}
          className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
          type="text"
          placeholder="Street"
        />

        <div className="flex gap-3">
          <input
            name="city"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="text"
            placeholder="City"
          />
          <input
            name="state"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="text"
            placeholder="State"
          />
        </div>

        <div className="flex gap-3">
          <input
            name="zipCode"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="number"
            placeholder="Zipcode"
          />
          <input
            name="country"
            required
            onChange={onHandleChange}
            className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
            type="text"
            placeholder="Country"
          />
        </div>

        <input
          name="phoneNumber"
          required
          onChange={onHandleChange}
          className="border border-gray-300 py-1.5 px-3.5 rounded w-full"
          type="number"
          placeholder="Phone number"
        />

        {/* Submit button inside form */}
        <div className="w-full text-end mt-8">

        <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-16 py-3 text-sm cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span>Please Wait</span>
                <Loader2 className="w-4 h-4 animate-spin" />
              </>
            ) : (
              "PLACE ORDER"
            )}
        </button>

        </div>
      </form>

      {/* right side.......... */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12 ">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
        </div>

        {/* payment method */}
        <div className="flex gap-3 flex-col lg:flex-row">
          <div
            onClick={() => setMethod("stripe")}
            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
          >
            <p
              className={`min-w-3.5 h-3.5 rounded-full ${
                method === "stripe" ? "bg-green-500" : "border"
              }`}
            ></p>
            <img src={assets.stripe_logo} alt="" className="mx-5 h-4" />
          </div>

          {/* <div
            onClick={() => setMethod("razorpay")}
            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
          >
            <p
              className={`min-w-3.5 h-3.5 rounded-full ${
                method === "razorpay" ? "bg-green-500" : "border"
              }`}
            ></p>
            <img src={assets.razorpay_logo} alt="" className="mx-5 h-4" />
          </div> */}

          <div
            onClick={() => setMethod("COD")}
            className="flex items-center gap-3 border p-2 px-3 cursor-pointer"
          >
            <p
              className={`min-w-3.5 h-3.5 rounded-full ${
                method === "COD" ? "bg-green-500" : "border"
              }`}
            ></p>
            <p className="text-gray-500 font-medium text-sm mx-4">
              CASH ON DELIVERY
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
