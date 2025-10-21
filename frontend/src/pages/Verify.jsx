import axiosInstance from '@/utils/axiosInstance'
import React, { use, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useFrontendAuth } from '@/context/ShopContext'

function Verify() {
   const [searchParams , setSearchParams] = useSearchParams()
   const success = searchParams.get("success")
   const orderId = searchParams.get("orderId")
   const [loading , setLoading] = useState(false)
   const {user , setCartItems} = useFrontendAuth()
   const navigate = useNavigate()

   const verifyPayment = async ()=>{
        try{
            setLoading(true)
            if(!user) return null
            const res = await axiosInstance.post("/order/verifyStripe" , {success , orderId , userId : user._id })
            if(res.data?.success){
                setCartItems({})
                navigate("/order")
            }else{
                navigate("/cart")
            }
        }catch(error){
            console.log("error in verifyPayment" , error)
        }finally{
            setLoading(false)
        }
   }

   useEffect(()=>{
    if (user?._id) {
    verifyPayment();
  }
   } , [user])
  return (
    <div>
        {
        success &&
         (
        <span>{loading ? "Verifying payment..." : "Payment Done"}</span>
        )
        }

    </div>
  )
}

export default Verify
