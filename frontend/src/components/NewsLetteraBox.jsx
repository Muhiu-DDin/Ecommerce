import React from 'react'

function NewsLetteraBox() {

  function submitHandler(e){
      e.preventDefault()
  }

  return (
    <div className='text-center'>
      <p className='text-2xl font-medium text-gray-800'>Subscribe now and get 20% off</p>
      <p className='text-gray-400 mt-3'> Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate, recusandae? </p>

      <form onSubmit={submitHandler} className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3'>
        <input type="email" required={true} className='sm:flex-1 w-full outline-none' placeholder='enter you email'/>
        <button className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
      </form>
    </div>
  )
}

export default NewsLetteraBox
