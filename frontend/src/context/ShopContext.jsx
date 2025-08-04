import { createContext, useEffect, useState } from "react";
import { products } from "@/assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
 
export const ShopContext = createContext()

const ShopContextProvider = (props)=>{

    const currency = "$"
    const delivery_fee = 10
    const [search , setSearch] = useState("")
    const [showSearch , setShowSearch] = useState(false)
    const [cartItems , setCartItems] = useState({})
    const navigate = useNavigate()

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

    const addToCart = (id , size)=>{
        if(!size){
            toast.error("please select the size")
            return
        }
        // created deep copy so that original data does not alter 
        let cartItemCopy = structuredClone(cartItems)
        if(cartItemCopy[id]){
            if(cartItemCopy[id][size]){
                cartItemCopy[id][size]+=1
            }else{
             cartItemCopy[id][size] = 1
        }
        }else{
            cartItemCopy[id] = {};
            cartItemCopy[id][size] = 1
        }
        setCartItems(cartItemCopy)
        toast.success("item added successfully")
    }

    const getCartItemCount = ()=>{
        let cartItemCopy = structuredClone(cartItems)
        let count = 0 
        for(let id in cartItemCopy){
            for(let size in cartItemCopy[id]){
                count += cartItems[id][size];
            }
        }
        return count
    }
      const handleQuantityChange = (id , size , delta) => {
      setCartItems((prev)=>{
        let updated = {...prev}
        if(!updated[id] || updated[id][size] < 1) return prev
        updated[id][size] += delta
        return updated
      })
     }

     const getCartAmount = ()=>{
        let totalAmount = 0
        if(cartItems){
            for (let id in cartItems){
                 let product = products.find((item)=>item._id === id)
                 if(!product) return null;
                  for(let size in cartItems[id]){
                   totalAmount += cartItems[id][size] * product.price
                  }
                }
        }
        return totalAmount
     }

    const value = {
        products , currency , delivery_fee , search , setSearch , showSearch , setShowSearch , addToCart , cartItems , getCartItemCount , 
        setCartItems , handleQuantityChange , getCartAmount , navigate
    }

    return(
     
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    
    )
}

export default ShopContextProvider