import React, { useState } from "react";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { useFrontendAuth } from "@/context/ShopContext";

function Login() {
  const [currentState, setCurrentState] = useState("SignUp");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser, getUserData , user} = useFrontendAuth();

  const handleSuccess = (res) => {
    if (res.data?.success) {
      setUser(res.data?.user);
      setCurrentState("")
      getUserData();
      setEmail("");
      setPassword("");
      setName("");
      toast.success(res.data?.message || "Success");
    } else {
      toast.error(res.data?.message || "Unexpected error");
      setUser(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;

      if (currentState === "Login") {
        res = await axiosInstance.post(
          "/user/userLogin",
          { email, password },
          { withCredentials: true }
        );
      } else {
        res = await axiosInstance.post(
          "/user/register",
          { email, password, name },
          { withCredentials: true }
        );
      }

      handleSuccess(res);
    } catch (error) {
      toast.error(error.response?.data?.message || "Request failed!");
      console.error("Error in login/register =>", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Login" ? null : (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          required
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Username"
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        required
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
      />

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        required
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot your password?</p>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("SignUp")}
            className="cursor-pointer"
          >
            Create Account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-8 py-2 mt-4 font-light cursor-pointer flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            Please Wait
            <Loader2 className="w-4 h-4 animate-spin" />
          </>
        ) : currentState === "Login" ? (
          "Sign In"
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
}

export default Login;
