import { assets } from '@/assets/frontend_assets/assets'
import { ShopContext } from '@/context/ShopContext'
import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'

function Search() {
    const{search , setSearch , showSearch , setShowSearch} = useContext(ShopContext)
    const location = useLocation()


  return showSearch && location.pathname.includes("collection") ? (
    <div className='border-t border-b bg-gray-50 text-center mt-20'>
        <div className='inline-flex items-center justify-center border border-gray-500 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2 '>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} className="flex-1 outline-none bg-inherit text-sm" type='text' placeholder='Search'/>
            <img alt="" src={assets.search_icon} className='w-4'/>
        </div>

        <img onClick={()=>setShowSearch(false)} src={assets.cross_icon} alt="" className='inline w-3 cursor-pointer'/>

    </div>
  ) : null
}

export default Search
