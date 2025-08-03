import { createContext, useEffect, useState } from "react";
import { products } from "@/assets/frontend_assets/assets";
import { toast } from "react-toastify";
 
export const ShopContext = createContext()

const ShopContextProvider = (props)=>{

    const currency = "$"
    const delivery_fee = 10
    const [search , setSearch] = useState("")
    const [showSearch , setShowSearch] = useState(false)
    const [cartItems , setCartItems] = useState({})

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

    useEffect(()=>{
        console.log("cart items =>" ,  cartItems)
    },[cartItems])


    const value = {
        products , currency , delivery_fee , search , setSearch , showSearch , setShowSearch , addToCart , cartItems , getCartItemCount
    }

    return(
     
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    
    )
}

export default ShopContextProvider