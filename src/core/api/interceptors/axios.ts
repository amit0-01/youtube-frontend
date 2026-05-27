import axios from "axios";
import { storageService } from "../../../Service/storageService";
import { authService } from "../../../Service/auth.service";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, // if you later use cookies
});

// ✅ Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor (refresh token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user : any = storageService.getItem("userInfo");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/v1/users/refresh-token`,
          { refreshToken: user.refreshToken }
        );

        user.accessToken = res.data.accessToken;
        storageService.setItem("userInfo", user);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;

        return api(originalRequest); // retry
      } catch (err) {
        // storageService.removeItem("userInfo");
        // window.location.href = "/sign-in";
        // return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
