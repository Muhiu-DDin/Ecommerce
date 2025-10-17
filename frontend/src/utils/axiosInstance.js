import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
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
        await axiosInstance.post("/user/refreshUserToken");
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token failed — logging out");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
