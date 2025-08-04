import React, { useState } from 'react'

function Login() {
  const[currentState , setCurrentState] = useState("SignUp")

  const onSubmit = (e)=>{
      e.preventDefault()
  }

  return (
    <form  onSubmit={onSubmit} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20 gap-4 text-gray-800'>
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl '>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800'/>
      </div>
      {currentState === "Login" ? "" : 
      <input type="text" required={true} className='w-full px-3 py-2 border border-gray-800' placeholder='username' />
      }
      <input type="email" required={true}  className='w-full px-3 py-2 border border-gray-800' placeholder='email' />
      <input type="password" required={true} className='w-full px-3 py-2 border border-gray-800' placeholder='password' />
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
          <p className='cursor-pointer'>Forgot your password ?</p>
          {
            currentState === "Login" ? 
            <p onClick={()=>setCurrentState("SignUp")} className='cursor-pointer'>Create Account</p> :
            <p onClick={()=>setCurrentState("Login")} className='cursor-pointer'>Login</p>
          }
      </div>
      <button type="submit" className='bg-black text-white px-8 py-2 mt-4 font-light cursor-pointer'>{currentState === "Login" ? "Sign In" : "Sign Up"}</button>
    </form>
  )
}

export default Login
