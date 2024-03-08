import * as SecureStore from "expo-secure-store";
import { decode } from "base-64";
global.atob = decode;

const tokenDecoder = async () => {
  try {
    const token = await SecureStore.getItemAsync("rtc-token");

    const decoded = JSON.parse(decode(token.split(".")[1]));
    const payload = decoded;
    if (Date.now() >= decoded.exp * 1000) {
      return false;
    }
    return payload;
  } catch (error) {
    return null;
  }
};

export default tokenDecoder;
