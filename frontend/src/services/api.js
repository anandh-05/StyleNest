import axios from "axios";

import { clearStoredAuth, getStoredAuth, setStoredAuth } from "../utils/storage";

const rawBaseURL = import.meta.env.VITE_API_URL || "";
const baseURL = rawBaseURL.replace(/\/$/, "");

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

let refreshPromise = null;

api.interceptors.request.use((config) => {
  const { access } = getStoredAuth();

  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const { refresh, user } = getStoredAuth();

      if (!refresh) {
        clearStoredAuth();
        window.dispatchEvent(new Event("auth:expired"));
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        refreshPromise =
          refreshPromise || axios.post(`${baseURL}/auth/refresh`, {
            refresh
          });

        const refreshResponse = await refreshPromise;
        refreshPromise = null;

        setStoredAuth({
          access: refreshResponse.data.access,
          refresh,
          user
        });

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        clearStoredAuth();
        window.dispatchEvent(new Event("auth:expired"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

