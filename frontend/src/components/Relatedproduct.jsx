import { ShopContext } from '@/context/ShopContext'
import React, { useContext, useEffect, useState } from 'react'
import Title from './Title'
import ProductItem from './ProductItem'

function Relatedproduct({category , subCategory}) {
   const{products} =  useContext(ShopContext)
   const [relatedProduct , setRelatedProduct] = useState([])

    useEffect(() => {
    if (products.length > 0) {
        let productCopy = products.slice()
        productCopy = productCopy.filter(item => item.category === category)
        productCopy = productCopy.filter(item => item.subCategory === subCategory)
        setRelatedProduct(productCopy.slice(0, 5))
    }
    }, [products, category, subCategory])


  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text1={"RELATED"} text2={"PRODUCTS"}/>
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                relatedProduct.map((item , index)=>(
                    <ProductItem key={index} id={item._id} productName={item.productName} price={item.price} image={item.image}/>
                ))
            }
        </div>
      
    </div>
  )
}

export default Relatedproduct
