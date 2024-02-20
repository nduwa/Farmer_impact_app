import * as SecureStore from "expo-secure-store";
import { decode } from "base-64";
global.atob = decode;

const tokenDecoder = async () => {
  try {
    let token = await SecureStore.getItemAsync("rtc-token");

    // Check if token is available
    if (!token) {
      return null; // or any appropriate action
    }

    // Splitting the token
    const tokenParts = token.split(".");
    if (tokenParts.length < 2) {
      return null; // Token is not in the expected format
    }

    // Decode and parse token payload
    const payload = JSON.parse(decode(tokenParts[1]));

    // Check token expiration
    if (Date.now() >= payload.exp * 1000) {
      return false; // Token expired
    }

    // Return payload if everything is fine
    return payload.user;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export default tokenDecoder;
