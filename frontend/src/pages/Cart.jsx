import ProductItem from '@/components/ProductItem'
import Title from '@/components/Title'
import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect, useState } from 'react'

function Cart() {
  const{products , cartItems} = useContext(ShopContext)
  const [cartItemsData , setCartItemsData] = useState([])

// cartItem structure
// {
//   "aaaab": {
//     "S": 2,
//     "M": 1
//   },
//   "aaaac": {
//     "L": 1
//   }
// }


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
    <div className='border-t pt-12'>
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
                      <img src={data.image[0]} alt="" className='w-16 sm:w-20'/>
                      <div>
                        <p className='text-xs sm:text-lg font-medium'>{data.name}</p>
                      </div>
                    </div>
                </div>
              )
            })
          }
        </div>
    </div>
  )
}

export default Cart
