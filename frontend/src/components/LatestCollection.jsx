import { ShopContext } from '@/context/ShopContext'
import React, { useEffect, useState } from 'react' 
import { useContext } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'

function LatestCollection() {
   const {products } =  useContext(ShopContext)
  const [latestProduct , setLatestProduct] = useState([])

  useEffect(
    ()=>{
      setLatestProduct(products.slice(0,10))
    } , [products]
  )
  
  return (
    <div className='my-10'>
        <div className='text-3xl text-center py-8'>
          <Title text1={"LATEST"} text2={"COLLECTION"}/>
          <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, beatae.
          </p>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            latestProduct.map((item)=>(
              <ProductItem key={item._id} id={item._id} productName={item.productName} price={item.price} image={item.image}/>
            ))
          }

        </div>
    </div>
  )
}

export default LatestCollection
