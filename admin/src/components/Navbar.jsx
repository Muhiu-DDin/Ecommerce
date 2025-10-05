import { assets } from '../assets/admin_assets/assets'
import api from '../lib/axios'
import { useAuth } from '../context/authContext'

const Navbar = () => {

  const {setUser} = useAuth()

  const logoutFunc = async ()=>{
      try{  
        const res = await api.post("/user/logout")
        setUser(null)
        console.log("response of getUser" , res.data?.message)
      }catch(error){
        console.log("Error in logout", error)
      }
  }

  return (
    <div className='flex items-center px-[4%] py-2 justify-between'>
        <img className="w-[max(10%,80px)]" src={assets.logo} alt="logo" />
        <button onClick={logoutFunc} className='cursor-pointer bg-gray-600 text-white px-5 py-2 rounded-full text-xs sm:text-sm'>logout</button>
    </div>
  )
}

export default Navbar
