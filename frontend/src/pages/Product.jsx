import { assets } from '@/assets/frontend_assets/assets'
import Relatedproduct from '@/components/Relatedproduct'
import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function Product() {
  const {productId} = useParams()
  const {products , currency , addToCart , cartItems} = useContext(ShopContext)
  const [productData , setProductData] = useState({})
  const [image , setImage] = useState([])
  const [size , setSize] = useState("")

  useEffect(
    ()=>{
      fetchProduct()
    } , [productId]
  )
  
  const fetchProduct = ()=>{
    products.map((item)=>{
      if(item._id === productId){
        setProductData(item)
        setImage(item.image?.[0]|| "")
      }
  })
  }


  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100 mt-20'>

        {/* product data  */}
        <div className='flex gap-12 flex-col sm:gap-12 sm:flex-row'>

          {/* product images  */}
          <div className='flex flex-1 flex-col-reverse gap-3 sm:flex-row'>
              <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
                  {
                    productData.image?.map(
                      (item , index)=>(
                        <img onClick={()=>setImage(item)} className='flex-shrink-0 sm:w-full w-[24%] sm:mb-3 cursor-pointer' key={index} alt="" src={item}/>
                      )
                    )
                  }
              </div>
              <div className='w-full sm:w-[80%]'>
                  <img className='w-full h-auto' alt="" src={image}/>
              </div>
          </div>

          {/* product detail  */}

          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className='flex items-center gap-1 mt-2 '>
                <img src={assets.star_icon} alt="" className="w-3 5" />
                <img src={assets.star_icon} alt="" className="w-3 5" />
                <img src={assets.star_icon} alt="" className="w-3 5" />
                <img src={assets.star_icon} alt="" className="w-3 5" />
                <img src={assets.star_dull_icon} alt="" className="w-3 5" />
                <p className='pl-2'>(122)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='md:w-4/5 text-gray-500 w-4/5 mt-5 '>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
                  <p>Select Size</p>
                  <div className='flex gap-2'>
                      {productData.sizes?.map((item , index)=>(
                        <button onClick={()=>setSize((prev)=>prev === item ? "" : item)} className={`cursor-pointer border py-2 px-4 bg-gray-100 ${item === size ? "border-orange-600": ""}`} key={index}>{item}</button>
                      ))}
                  </div>
            </div>
            <button onClick={()=>addToCart(productData._id , size)} className='cursor-pointer bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
            <hr className='mt-8 sm:w-4/5'/>
            <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
              <p>100% Original product.</p>
              <p>Cash on delivery is available on this product.</p>
              <p>Easy return and exchange policy within 7 days.</p>
            </div>
          </div>

        </div>

        {/* review section  */}
        <div className='mt-20'>
            <div className='flex gap-2'>
              <b className='border px-5 py-3 text-sm'>Description</b>
              <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
            </div>
            <div className='mt-5 flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
              <p>An e-commerce website is an online platform that facilitates the buying and selling of products or services over the internet. It serves as a virtual marketplace where businesses and individuals can showcase their products, interact with customers, and conduct transactions without the need for a physical presence. E-commerce websites have gained immense popularity due to their convenience, accessibility, and the global reach they offer.</p>
              <p>E-commerce websites typically display products or services along with detailed descriptions, images, prices, and any available variations (e.g., sizes, colors). Each product usually has its own dedicated page with relevant information.</p>
            </div>
        </div>

        {/* display related products  */}
          <Relatedproduct category={productData.category} subCategory={productData.subCategory}/>

    </div>


  ) : null
}

export default Product
