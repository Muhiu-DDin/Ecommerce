import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await api.post("/user/refreshToken");
        return api(error.config);
      } catch (refreshError) {
        console.log("Refresh failed, logging out");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
