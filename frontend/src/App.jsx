import React from 'react'
import {Routes , Route} from "react-router-dom"
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Collection from './pages/Collection'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Product from './pages/Product'
import Order from './pages/Order'
import PlaceOrder from './pages/PlaceOrder'
import Footer from './components/Footer'

function App() {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] '>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/collection' element={<Collection/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/product/:productId' element={<Product/>}/>
        <Route path='/order' element={<Order/>}/>
        <Route path='/placeorder' element={<PlaceOrder/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
