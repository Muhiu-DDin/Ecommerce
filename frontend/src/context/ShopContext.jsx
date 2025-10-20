import { createContext, useContext, useEffect, useState } from "react";
// import {products} from "@/assets/frontend_assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";


 
export const ShopContext = createContext()

const ShopContextProvider = (props)=>{

    const currency = "$"
    const delivery_fee = 10
   const backendURL = import.meta.env.VITE_BACKEND_URL

    const [search , setSearch] = useState("")
    const [showSearch , setShowSearch] = useState(false)
    const [cartItems , setCartItems] = useState({})
    const [loading , setLoading] = useState(false)
    const [user , setUser] = useState(null)
    const [products , setProducts] = useState([])

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

    async function getUserData() {
        setLoading(true)
        try {
            // this ensure that the user is login and have valid tokens as this route alse have middleware attached 
            const res = await axiosInstance.get("/user/getUser");
            setUser(res.data?.user);
            console.log("Fetched user:", res.data?.user);
        } catch (err) {
            if (err.response?.status !== 401) {
            console.error("Error fetching user:", err);
            } else {
            console.log("User not logged in (no cookies yet)");
            }
            setUser(null);
        } finally {
            setLoading(false);
        }
    }
    

    const getProductsData = async ()=>{
        try{
            const res = await axiosInstance.get("/admin/product/list")
            if(res.data?.success){
                setProducts(res.data?.products)
            }else{
                toast.error(res.data?.message)
            }
        }catch(error){
                toast.error(error.message)
        }
    }

    const getCartItemsData = async () => {
        try{
        const res = await axiosInstance.post("/cart/get" , {userId : user._id})
        if(res.data?.success){
            setCartItems(res.data?.cartData)
        }
        }catch(error){
            console.log("error in getCartItemsData" , error)
        }
    }


    useEffect(() => {
        const fetchUser = async () => {
            try {
            await getUserData();
            } catch (err) {
            console.log("User not logged in");
            } finally {
            setLoading(false);
            }
        };
        fetchUser();
        getProductsData()
    }, []);

    useEffect(() => {
        if (user?._id) {
            getCartItemsData();
        }
    }, [user]);


    const addToCart = async (id , size)=>{
        if(!size){
            toast.error("please select the size")
            return
        }
        // created deep copy (as there is nested object) so that original data does not alter 
        let cartItemCopy = structuredClone(cartItems)
        if(cartItemCopy[id]){
            if(cartItemCopy[id][size]){
                cartItemCopy[id][size]+=1
            }else{
             cartItemCopy[id][size] = 1
        }
        }else{ 
        // we have to first initialize an empty object for nested structure if id key is not exist 
            cartItemCopy[id] = {};
            cartItemCopy[id][size] = 1
        }
        setCartItems(cartItemCopy)
        if(user){
            try{
                await axiosInstance.post("/cart/add" , {userId : user._id , itemId : id , size})
                console.log("item added to db")
            }catch(error){
                console.log("error in addToCart" , error.message)
            }
        }else{
            console.log("user =>" , user)
            console.log("user not define")
        }
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

    const handleQuantityChange = async (id , size , delta) => {
         let updatedCart;
        setCartItems((prev)=>{
        let updated = {...prev}
        if(!updated[id] || updated[id][size] < 1) return prev
        if (delta > 0){
            updated[id][size] += delta
        }
        if(delta < 0 && updated[id][size] > 1 ) updated[id][size] += delta
        updatedCart = updated
        return updated
      })
        if(user){
            try{
               const res = await axiosInstance.post("/cart/update" , {userId : user._id , itemId : id , size , quantity : updatedCart[id][size] })
               if(res.data.success) console.log("quantity changed successfully")
            }catch(error){
                console.log("error in handleQuantityChange" , error)
            }
        }

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
        products , currency , backendURL , delivery_fee , search , setSearch , showSearch , setShowSearch , addToCart , cartItems , getCartItemCount , 
        setCartItems , handleQuantityChange , getCartAmount , navigate , getProductsData , user , getUserData , setUser
    }

    return(
     
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    
    )
}

export const useFrontendAuth = ()=> useContext(ShopContext)

export default ShopContextProvider