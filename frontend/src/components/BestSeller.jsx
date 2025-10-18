import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect, useState } from 'react'
import ProductItem from './ProductItem'
import Title from './Title'

function BestSeller() {
    const {products} = useContext(ShopContext)
    const [bestSeller , setBestSeller] = useState([])

    useEffect(() => {
    const bestProduct = products.filter((item) => item.bestseller);
    setBestSeller(bestProduct.slice(0, 5));
    }, [products]);


  return (

    <div className='my-10'>
        <div className='text-3xl py-8 text-center'>
            <Title text1={'BEST'} text2={"SELLER"}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, beatae.
            </p>
        </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
          {
            bestSeller.map((item)=>(
              <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image}/>
            ))
          }

        </div>
      
    </div>
  )
}

export default BestSeller
