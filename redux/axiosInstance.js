import axios from "axios";
import { API_URL } from "@env";

// Create a new Axios instance
const api = axios.create({
  baseURL: `https://2c77-196-12-131-214.ngrok-free.app`,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.log("Something went wrong");
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response;
  },
  (error) => {
    // Handle response errors (e.g., 404, 500, etc.)
    if (error.response) {
      const { status } = error.response;

      if (status === 404) {
        console.log("Server Error: The requested resource is not available");
      } else if (status === 401) {
        console.log("Server Error: Unauthorised request");
      } else if (status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Server Error: Something went wrong");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
