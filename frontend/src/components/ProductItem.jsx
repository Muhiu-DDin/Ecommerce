import { ShopContext } from '@/context/ShopContext'
import React, { useContext } from 'react'
import { Link} from "react-router-dom";

function ProductItem({id , image , price , name}) {

    const {currency} = useContext(ShopContext)

  return (
   <Link className="text-gray-700 cursor-pointer" to={`product/${id}`} >
        <div className='overflow-hidden'>
            <img className='hover:scale-110 transition ease-in-out' src={image[0]} alt=""/>
        </div>
        <p className='pt-3 pb-1 text-sm'>{name}</p>
        <p className='font-medium text-sm'>{currency}{price}</p>
   </Link>
  )
}

export default ProductItem