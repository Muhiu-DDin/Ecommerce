import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getUserData() {
  try {
    const res = await api.get("/user/getUser");
    setUser(res.data?.user);
    console.log("Fetched user:", res.data?.user);
  } catch (err) {
    if (err.response?.status !== 401) {
      console.error("Error fetching user:", err);
    } else {
      console.log("User not logged in (no cookies yet)");
    }
    setUser(null);
  } finally {
    setLoading(false);
  }
}


useEffect(() => {
  const fetchUser = async () => {
    try {
      await getUserData();
    } catch (err) {
      console.log("User not logged in");
    } finally {
      setLoading(false);
    }
  };
  fetchUser();
}, []);


  return (
    <AuthContext.Provider value={{ user, setUser, getUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
