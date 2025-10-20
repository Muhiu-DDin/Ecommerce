import { assets } from '@/assets/frontend_assets/assets'
import CartTotal from '@/components/CartTotal'
import Title from '@/components/Title'
import { ShopContext } from '@/context/ShopContext'
import axiosInstance from '@/utils/axiosInstance'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Cart() {
  const{products , cartItems , currency , setCartItems , handleQuantityChange  , user} = useContext(ShopContext)
  const [cartItemsData , setCartItemsData] = useState([])
  const navigate = useNavigate()

// cartItem structure---------
// {
//   "aaaab": {
//     "S": 2,
//     "M": 1
//   },
//   "aaaac": {
//     "L": 1
//   }
// }

// cartItemsData structure---------
// [
//   {
//     _id : "abcc",
//     size : "M",
//     quantity : 2
//   } , 
//   {
//     _id : "abcc" ,
//     size : "L",
//     quantity : 4
//   } , 
// ]


  useEffect(
    ()=>{ 
      let cartItemsCopy = structuredClone(cartItems)
      let temp = []
      for(let id in cartItemsCopy){
        for(let size in cartItemsCopy[id]){
          if(cartItemsCopy[id][size] > 0){
            temp.push({
              _id : id ,
              size , 
              quantity : cartItemsCopy[id][size]

            })
          }
        }
      }

      setCartItemsData(temp)

    }, [cartItems]
  )


  
  return (
    <div className='border-t sm:pt-15 pt-20'>
        <div className='text-2xl mb-3'>
            <Title text1={"YOUR"} text2={"CART"}/>
        </div>
        <div>
          {
            cartItemsData.map((item , index)=>{
              const data = products.find((product)=>item._id === product._id)

              return(
                <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                    <div className='flex items-start gap-6'>
                      <img onClick={()=>navigate(`/product/${data._id}`)} src={data.image[0]} alt="" className='w-16 cursor-pointer sm:w-20'/>
                      <div>
                        <p className='text-xs sm:text-lg font-medium'>{data.name}</p>
                        <div className='flex items-center gap-5 mt-2'>
                            <p>{currency}{data.price}</p>
                            <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50'>{item.size}</p>
                        </div>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 border rounded px-2 py-1 max-w-fit'>
                        <button 
                          className='text-lg px-2 hover:text-red-500'
                          onClick={() => handleQuantityChange(item._id, item.size, -1)}
                        >−</button>
                        <span className='min-w-[24px] text-center'>{item.quantity}</span>
                        <button 
                          className='text-lg px-2 hover:text-green-500'
                          onClick={() => handleQuantityChange(item._id, item.size, 1)}
                        >+</button>
                    </div>

                    <img onClick={
                      async ()=>{
                         setCartItems((prev)=>{
                         let updated = {...prev}
                         delete updated[item._id][item.size]
                         return updated
                         })
                        const res = await axiosInstance.post("/cart/delete" , {userId : user._id , itemId : item._id , size : item.size })
                        if(res.data?.success) console.log("item updated")
                      }  
                    }
                     src={assets.bin_icon} alt="" className='w-4 mr-4  sm:w-5 cursor-pointer' />
                </div>
              ) 
            })
          }
        </div>

        <div className='flex justify-end my-20'>
            <div className='w-full sm:w-[450px]'>
                <CartTotal/>
                <div className='w-full text-end'>
                    <button onClick={()=>navigate("/PlaceOrder")}className='bg-black text-white text-sm my-8 px-8 py-3 cursor-pointer'>PROCEED TO CHECKOUT</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Cart
