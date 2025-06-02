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
  async (config) => {
    try {
      const { getAccessToken, validateToken, logout } = useAuthStore.getState();

      await validateToken();

      const accessToken = await getAccessToken();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn("Interceptor - No access token available");
        logout();
        throw new Error("No access token available, logged out the user.");
      }

      return config;
    } catch (error) {
      console.warn("Interceptor - Token validation failed:", error);
      useAuthStore.getState().logout();
      throw new Error("Invalid or expired token, logged out the user.");
    }
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

      // Create custom error but preserve the response
      const customError = new Error(
        status === 400 ? (data.detail || data.message || "Bad Request: invalid data provided.") :
        status === 401 ? "Unauthorized: Please check your access token." :
        status === 403 ? "Forbidden: You do not have permission to access this resource." :
        status === 404 ? (data.message || "Not Found: The requested resource was not found.") :
        status === 500 ? "Internal Server Error: Something went wrong on the server." :
        (status >= 502 && status <= 504) ? "Server Unavailable: Please try again later." :
        (data.message || `Unexpected Error: ${status}`)
      );

      // Copy the response to our custom error
      customError.response = error.response;
      customError.status = status;
      customError.serverData = data;

      return Promise.reject(customError);
    } else if (error.request) {
      const networkError = new Error(
        "No response from server. Please check your network connection."
      );
      networkError.request = error.request;
      return Promise.reject(networkError);
    } else {
      return Promise.reject(error);
    }
  },
);

export default AxiosInstance;
