import axios from "axios";
import { API_URL } from "@env";

const URL="https://baaa-196-12-131-214.ngrok-free.app";
// Create a new Axios instance
const api = axios.create({
  baseURL: `${URL}`,
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // You can modify the request config here if needed
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
        // window.location.href = '/error404'; //Replace with the desired URL
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
