import { useState , useRef} from "react";
import { toast } from "react-toastify";
import api from "../lib/axios"
import { useAuth } from "../context/authContext";
import { Loader2 } from "lucide-react";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null)
  const {getUserData , setUser} = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await api.post("/user/admin",
      { email, password } , { withCredentials: true } );

      if(response.data?.success){
       setUser(response.data.adminData);
        await getUserData()
        setEmail("")
        setPassword("")
        console.log(response.data?.message)
      }else{
        toast.error("Login Failed!");
      }
    } catch (err) {
       toast.error("Login Failed!");
      console.error("Error in admin login =>", err.message);
    }finally{
      setLoading(false)
    }
  };


  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
        <form ref={formRef} onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-gray-700 font-medium text-sm mb-2">Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="enter admin email"
              className="w-full rounded-md px-3 py-2 border border-gray-300 outline-none"
              required
            />
          </div>

          <div className="mb-3 min-w-72">
            <p className="text-gray-700 font-medium text-sm mb-2">Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter admin password"
              className="w-full rounded-md px-3 py-2 border border-gray-300 outline-none"
              required
            />
          </div>

      <button
          className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer flex justify-center items-center gap-2"
          disabled={loading}
      >
          {loading ? (
            <>
              Please Wait
              
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            
            </>
          ) : (
            "Login"
          )}
      </button>

        </form>
      </div>
    </div>
  );
};

export default Login;
