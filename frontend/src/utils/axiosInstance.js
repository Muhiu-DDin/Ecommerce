import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/user",
  withCredentials: true,
});


axiosInstance.interceptors.response.use(
    // if access token is not expire then return the response 
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        //If you used axiosInstance, and your refresh token is also invalid, your interceptor would catch the 401 again, and try to refresh again, causing a retry looait 
       axios.post(  
          "http://localhost:5000/api/user/refreshToken",
          {},
          { withCredentials: true }
        );

    //   after refreshing the access token retry the request 
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("Refresh failed. Logging out...");

     await axiosInstance.post("/logout");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
