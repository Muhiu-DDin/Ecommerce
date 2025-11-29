import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api",
//   withCredentials: true,
// });

const api = axios.create({
  baseURL: "https://foreverbackend-k8zm.onrender.com/api",
  withCredentials: true,
});


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
  
  if (originalRequest.url.includes("/user")) {
    await api.post("/user/refreshToken");
  } else if (originalRequest.url.includes("/admin")) {
    await api.post("/admin/refreshToken");
  }
  
  return api(originalRequest);
  }


    return Promise.reject(error);
  }
);


export default api;
