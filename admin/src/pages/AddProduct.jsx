import { useState } from "react"
import {assets} from "../assets/admin_assets/assets"
import api from "../lib/axios"
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddProduct = () => {

  const[image1 , setImage1] = useState("")
  const[image2 , setImage2] = useState("")
  const[image3 , setImage3] = useState("")
  const[image4 , setImage4] = useState("")
  const[loading , setLoading] = useState(false)

  const[productName , setProductName] = useState("")
  const[description, setDescription] = useState("")
  const[price , setPrice] = useState("")
  const[category, setCategory] = useState("Men")
  const[subCategory , setSubCategory] = useState("Topwear")
  const[bestSeller , setBestSeller] = useState(false)
  const[size , setSize] = useState([])

  const handleSubmit  = async (e)=>{
    e.preventDefault();
      try{
          setLoading(true)
          const formData = new FormData()

          formData.append("productName" , productName)
          formData.append("description" , description)
          formData.append("price" , price)
          formData.append("category" , category)
          formData.append("subCategory" , subCategory)
          formData.append("bestSeller", bestSeller)
          formData.append("size" , JSON.stringify(size))

          image1 && formData.append("image1" , image1)
          image2 && formData.append("image2" , image2)
          image3 && formData.append("image3" , image3)
          image4 && formData.append("image4" , image4)

          const res = await api.post("/admin/product/add" , formData)
          console.log("response of AddProduct =>" , res.data?.message)

          if(res.data?.success){
              toast.success("Product added successfully")

              setImage1("");
              setImage2("");
              setImage3("");
              setImage4("");
              setProductName("");
              setDescription("");
              setPrice("");
              setCategory("Men");
              setSubCategory("Topwear");
              setBestSeller(false);
              setSize([]);
          }else{
            toast.error(res.data?.message)
          }

      }catch(error){
          console.log("error in AddProduct" , error)
          toast.error(error.message)
      }finally{
        setLoading(false)
      }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-3">
      <div>
          <p className="mb-2">Upload Image</p>

          <div className="flex gap-2">
              <label htmlFor='image1'>
                <img className="w-20" alt="" src={image1 ? URL.createObjectURL(image1) : assets.upload_area} />
                <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
              </label>

              <label htmlFor='image2'>
                <img className="w-20" alt=""  src={image2 ? URL.createObjectURL(image2) : assets.upload_area}/>
                <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
              </label>

              <label htmlFor='image3'>
                <img className="w-20" alt=""  src={image3 ? URL.createObjectURL(image3) : assets.upload_area}/>
                <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
              </label>

              <label htmlFor='image4'>
                <img className="w-20" alt=""  src={image4 ? URL.createObjectURL(image4) : assets.upload_area}/>
                <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
              </label>
          </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product name</p>
        <input onChange={(e)=>setProductName(e.target.value)} value={productName} type="text" placeholder="Type here" className="w-full max-w-[500px] px-3 py-2" required/>
      </div>

       <div className="w-full">
        <p className="mb-2">Product description</p>
        <textarea onChange={(e)=>setDescription(e.target.value)} value={description} type="text" placeholder="Type here" className="w-full max-w-[500px] px-3 py-2" required/>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kid">Kid</option>
          </select>
        </div>

         <div>
          <p className="mb-2">Product Sub Category</p>
          <select value={subCategory} onChange={(e)=>setSubCategory(e.target.value)} className="w-full px-3 py-2">
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input type="number" value={price} onChange={(e)=>setPrice(e.target.value)} className="px-3 py-2 w-full sm:w-[120px]" placeholder="25"/>
        </div>
      </div>


      <div>
        <p className="mb-2 ">Product Size</p>

        <div className="flex gap-3">
          <div onClick={(e)=>setSize((prev)=>prev.includes("S")? prev.filter((item)=>item !== "S") : [...prev , "S"])}>
            <p className={`${size.includes("S")? "bg-pink-100" : "bg-slate-200"} cursor-pointer px-3 py-1`}>S</p>
          </div>

          <div  onClick={(e)=>setSize((prev)=>prev.includes("M")? prev.filter((item)=>item !== "M") : [...prev , "M"])}>
            <p className={`${size.includes("M")? "bg-pink-100" : "bg-slate-200"} cursor-pointer px-3 py-1`}>M</p>
          </div>

          <div  onClick={(e)=>setSize((prev)=>prev.includes("L")? prev.filter((item)=>item !== "L") : [...prev , "L"])} >
            <p className={`${size.includes("L")? "bg-pink-100" : "bg-slate-200"} cursor-pointer px-3 py-1`}>L</p>
          </div>
          
          <div  onClick={(e)=>setSize((prev)=>prev.includes("XL")? prev.filter((item)=>item !== "XL") : [...prev , "XL"])}>
            <p className={`${size.includes("XL")? "bg-pink-100" : "bg-slate-200"} cursor-pointer px-3 py-1`}>XL</p>
          </div>

          <div  onClick={(e)=>setSize((prev)=>prev.includes("XXL")? prev.filter((item)=>item !== "XXL") : [...prev , "XXL"])}>
            <p className={`${size.includes("XXL")? "bg-pink-100" : "bg-slate-200"} cursor-pointer px-3 py-1`}>XXL</p>
          </div>
        </div>
      </div>


      <div className="flex gap-2 mt-2">
          <input onChange={()=>setBestSeller((prev)=>!prev)} type="checkbox" checked={bestSeller} id="BestSeller"/>
          <label className="cursor-pointer" htmlFor="BestSeller">Add to BestSeller</label>
      </div>
      
      <button  className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer flex justify-center items-center gap-2"
          disabled={loading} type="submit">

      {
        loading ? 
        ( 
          <>
            please Wait
            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          </>
        ) : 
        (
            "Add to Store" 
        )
      }

      </button>
      
    </form>
  )
}

export default AddProduct
