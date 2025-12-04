import { Link, NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/frontend_assets/assets";
import { useContext, useState } from "react";
import { ShopContext } from "@/context/ShopContext";
import axiosInstance from "@/utils/axiosInstance";

export default function Navbar() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [isVisible, setVisible] = useState(false);
  const { setShowSearch, getCartItemCount, user , setUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const logout = async ()=> {
      try{
         const res = await axiosInstance.post("/user/userLogout")
         if(res.data?.message){
            setUser(null)
            console.log("user logout successfully")
         }
      }catch(error){
        console.log("error in user logout =>", error)
      }
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-white z-50 shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={assets.logo} alt="Logo" className="w-36" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-6">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `text-base transition-all duration-200 font-bold hover:opacity-70 ${
                      isActive
                        ? "text-black border-b-2 border-black"
                        : "text-gray-600"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

  
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          
          <img
            onClick={() => {
              setShowSearch(true);
              navigate("/collection");
            }}
            src={assets.search_icon}
            alt="search icon"
            className="w-5 cursor-pointer"
          />


          <div className="group relative">
            {user ? (
              <>
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={assets.profile_icon}
                    alt="profile icon"
                    className="w-5"
                  />
                  <span className="font-semibold text-gray-700 hover:text-black transition">
                    {user.name.length > 10 ? user.name.slice(0, 4) + "..." : user.name}
                  </span>
                  <img
                    src={assets.dropdown_icon}
                    alt="dropdown icon"
                    className="w-3 transform rotate-90"
                  />
                </div>

             
                <div className="absolute right-0 pt-4 hidden group-hover:block z-50">
                  <div className="transition-all duration-300 flex flex-col gap-2 w-40 py-3 px-5 bg-slate-100 text-gray-600 rounded shadow-md">
                    <p className="cursor-pointer hover:text-black">My Profile</p>
                    <p onClick={()=>navigate("/order")} className="cursor-pointer hover:text-black">Orders</p>
                    <p className="cursor-pointer hover:text-black" onClick={logout}>Logout</p>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login">
                <img
                  src={assets.profile_icon}
                  alt="profile icon"
                  className="w-5 cursor-pointer"
                />
              </Link>
            )}
          </div>

      
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              alt="cart icon"
              className="w-5 min-w-5 cursor-pointer"
            />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
              {getCartItemCount()}
            </p>
          </Link>

          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            alt="menu icon"
            className="w-5 min-w-5 cursor-pointer sm:hidden"
          />
        </div>
      </div>

      {/* Mobile Nav Overlay */} 
      <div
        className={`fixed top-0 right-0 h-full w-full bg-white transition-transform duration-300 z-50 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        } sm:hidden`}
      >
        <div className="text-gray-600 flex flex-col h-full">
          <div
            onClick={() => setVisible(false)}
            className="gap-4 p-4 flex items-center border-b"
          >
            <img
              className="h-4 rotate-180 cursor-pointer"
              src={assets.dropdown_icon}
              alt="Back"
            />
            <p className="cursor-pointer">Back</p>
          </div>

          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setVisible(false)}
              className="py-4 pl-6 border-b hover:bg-gray-100"
            >
              {link.name}
            </NavLink>
          ))}

          {user && (
            <div className="py-4 pl-6 border-b text-gray-700 font-semibold">
              👤 {user.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
