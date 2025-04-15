import axios from "axios";

import pipesConfig from "../configs/PipesConfig";
import useAuthStore from "../stores/AuthStore";

const AxiosInstance = axios.create({
  baseURL: pipesConfig.apiOrigin,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add interceptors for handling authorization and errors
AxiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken, validateToken, logout } = useAuthStore.getState();

    if (accessToken && validateToken(accessToken)) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("Interceptor - Invalid or expired token"); // Log if token is invalid
      logout();
      throw new Error("Invalid or expired token, logged out the user.");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(
            data.message || "Bad Request: Invalid data provided.",
          );
        case 401:
          throw new Error("Unauthorized: Please check your access token.");
        case 403:
          throw new Error(
            "Forbidden: You do not have permission to access this resource.",
          );
        case 404:
          throw new Error(
            data.message || "Not Found: The requested resource was not found.",
          );
        case 500:
          throw new Error(
            "Internal Server Error: Something went wrong on the server.",
          );
        case 502:
        case 503:
        case 504:
          throw new Error("Server Unavailable: Please try again later.");
        default:
          throw new Error(data.message || `Unexpected Error: ${status}`);
      }
    } else if (error.request) {
      throw new Error(
        "No response from server. Please check your network connection.",
      );
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  },
);

export default AxiosInstance;
