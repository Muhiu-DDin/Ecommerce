import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useState, useEffect } from "react";
import { currency } from "../App";

const ListProduct = () => {
  const [loading, setLoading] = useState(true);
  const [listItems, setListItems] = useState([]);

  const listProduct = async () => {
    try {
      const res = await api.get("/product/list");
      if (res.data?.success) {
        setListItems(res.data?.products);
        console.log("products=>" , res.data?.products)
      }
    } catch (error) {
      console.log("error in list products", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async(id)=>{
    try{
      const res = await api.delete(`/product/remove/${id}`)
      if(res.data?.success){
        toast.success(res.data?.message)
        listProduct()
      }
    }catch(error){
        toast.error(error.message)
    }
  }

  useEffect(() => {
    listProduct();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <p className="mb-4 text-lg font-semibold">All Products List</p>

      <div className="flex flex-col gap-2">
   
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center px-4 py-2 bg-gray-100 border text-sm font-semibold">
          <span>Image</span>
          <span>Name</span>
          <span>Category</span>
          <span>Price</span>
          <span className="text-center">Action</span>
        </div>

  
        {listItems.length > 0 ? (
          listItems.map((item, index) => (

          <div
          key={index}
          className="flex flex-col md:grid md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border rounded-md hover:bg-gray-50 transition"
          >
 
          <div className="flex items-center gap-3 w-full md:w-auto">
            <img className="w-14 h-14 object-cover rounded" src={item.image[0]} alt="" />
            <div>
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-gray-500 md:hidden">{item.category}</p>
            </div>
          </div>

          {/* Desktop Columns */}

          <p className="hidden md:block truncate">{item.productName}</p>
          <p className="hidden md:block">{item.category}</p>
          <p className="w-full md:w-auto">
            {currency} {item.price}
          </p>
          <button onClick={()=>removeProduct(item._id)} className="text-red-500 md:text-center cursor-pointer text-lg font-bold hover:text-red-700">
            Delete
          </button>
        </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No products found.</p>
                )}
              </div>
            </div>
          );
        };

export default ListProduct;
