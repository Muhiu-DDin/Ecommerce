import React from 'react'
import ScrollToTop from './components/ScrollToTop.jsx'
import { ToastContainer } from 'react-toastify';
import {Routes , Route} from "react-router-dom"
import Navbar from './components/Navbar.jsx';
import SideBar from './components/SideBar.jsx';
import AddProduct from './pages/AddProduct.jsx';
import ListProduct from './pages/ListProduct.jsx';
import OrderProduct from './pages/OrderProduct.jsx';
import { useAuth } from './context/authContext.jsx';
import Login from './components/Login.jsx';

export const BaseUrl = import.meta.env.VITE_BACKEND_URL
export const currency = "$"

const App = () => {
 const {user} =  useAuth()
  
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer position="bottom-right" autoClose={3000} />
      {
        user === null ? <Login/> :  
        <>
          <ScrollToTop/>
            <div>
                <Navbar/>
                <hr/>
                <div className='flex w-full'>
                    <SideBar/>
                    <div className='w-[70%] mx-auto ml-[max(max(5vw,25px))] my-8 text-gray-600 text-base'>
                        <Routes>
                            <Route path='/' element={<AddProduct/>} />
                            <Route path='/add' element={<AddProduct/>} />
                            <Route path='/list' element={<ListProduct/>} />
                            <Route path='/order' element={<OrderProduct/>} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
      }
  
    </div>
  )
}

export default App
