import axios from "axios";
import { useAuth } from "../context/authContext";

const api = axios.create({
   baseURL: "http://localhost:4000/api",
  withCredentials: true,
});


// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401 && !error.config._retry) {
//       error.config._retry = true;
//       try {
//         await api.post("/user/refreshToken");
//         return api(error.config);
//       } catch (refreshError) {
//         console.log("Refresh failed, logging out");
// 
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // skip if error came from /refreshToken itself to provent infinite lOops

    if (originalRequest.url.includes("/user/refreshToken")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/user/refreshToken");
        return api(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token failed — logging out");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default api;
