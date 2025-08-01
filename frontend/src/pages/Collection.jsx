import { assets } from '@/assets/frontend_assets/assets'
import ProductItem from '@/components/ProductItem'
import Title from '@/components/Title'
import { ShopContext } from '@/context/ShopContext'
import React, {useContext, useEffect, useState } from 'react'

function Collection() {
  const [showFilter , setShowFilter] = useState(false)
  const [filterProducts , setFilterProducts] = useState([])
  const [categories , setCategories] = useState([])
  const [subCategories , setSubCategories] = useState([])
  const [sortType , setSortType] = useState("relevant")

  const {search , showSearch , products} = useContext(ShopContext)


  useEffect(()=>{
    applyFilter()
  }, [categories , subCategories , search , showSearch])

  useEffect(()=>{
      sortProduct()
  } , [sortType])

  const toggleCategory = (e)=> {
    // switches the value in/out of the categories array. 
      if(categories.includes(e.target.value)){
          setCategories((prev)=>prev.filter((item)=>item !== e.target.value))
       }else{
        setCategories((prev)=>[...prev , e.target.value])
       }
  }

    const toggleSubCategory = (e)=> { 
      if(subCategories.includes(e.target.value)){
          setSubCategories((prev)=>prev.filter((item)=>item !== e.target.value))
       }else{
        setSubCategories((prev)=>[...prev , e.target.value])
       }
  }

  const applyFilter = ()=>{
    let productCopy = products.slice()
    if(search && showSearch){
      productCopy = productCopy.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if(categories.length > 0){
      productCopy = productCopy.filter((item)=>categories.includes(item.category))
    }
    if(subCategories.length > 0){
      productCopy = productCopy.filter((item)=>subCategories.includes(item.subCategory))
    }
    setFilterProducts(productCopy)
  }

  const sortProduct = ()=>{
      const filterProductCopy = filterProducts.slice()
      switch(sortType){

        case "low-high": 
        setFilterProducts(filterProductCopy.sort((a , b)=>a.price - b.price))
        break

        case "high-low":
          setFilterProducts(filterProductCopy.sort((a , b)=>b.price - a.price))
          break

        default :
          break
      }
  }


  return (
    <div className='flex flex-col sm:flex-row gap-1 sm-gap-10 pt-10 border-t mt-20'>
      {/* left side  */}
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter((prev)=>!prev)} className='my-2 text-xl flex items-center gap-2 cursor-pointer'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} src={assets.dropdown_icon}/>
        </p>
          {/* categories  */}
         <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}> 
            <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                <p className='flex gap-2'>
                  <input id="men" type="checkbox" onChange={toggleCategory} className='w-3' value={"Men"}/> 
                  <label htmlFor="men" >Men</label>
                </p>

                <p className='flex gap-2'>
                  <input id="women" onChange={toggleCategory} type="checkbox" className='w-3' value={"Women"}/>
                  <label htmlFor="women" >Women</label>
                </p>

                <p className='flex gap-2'>
                  <input id="kid" type="checkbox" onChange={toggleCategory} className='w-3' value={"Kids"}/>
                  <label htmlFor="kid" >Kid</label>
                </p>
            </div>
         </div>
            {/* subcategory */}
          <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? "" : "hidden"} sm:block`}> 
            <p className='mb-3 text-sm font-medium'>TYPES</p>
            <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                <p className='flex gap-2'>
                  <input id="Topwear"  onChange={toggleSubCategory} type="checkbox" className='w-3' value={"Topwear"}/> 
                  <label htmlFor="Topwear" >Topwear</label>
                </p>

                <p className='flex gap-2'>
                  <input id="Bottomwear" onChange={toggleSubCategory} type="checkbox" className='w-3' value={"Bottomwear"}/>
                  <label htmlFor="Bottomwear" >Bottomwear</label>
                </p>

                <p className='flex gap-2'>
                  <input id="winterwear" onChange={toggleSubCategory} type="checkbox" className='w-3' value={"winterwear"}/>
                  <label htmlFor="winterwear" >winterwear</label>
                </p>
            </div>
         </div>
      </div>

      {/* right side  */}
      <div className='flex-1'>

          <div className='flex justify-between text-base sm:text-2xl mb-4'>
              <Title text1={"ALL"} text2={"COLLECTIONS"}/>
              <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 px-2 text-sm'>
                  <option value={"relevant"}>Sort by: Relevant</option>
                  <option value={"low-high"}>Sort by: Low to High</option>
                  <option value={"high-low"}>Sort by: High to Low</option>
              </select>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
              {
                filterProducts.map((item , index)=>(
                  <ProductItem key={index} image={item.image} name={item.name} id={item._id} price={item.price}/>
                ))
              }
          </div>
      </div>



    </div>
  )
}

export default Collection
