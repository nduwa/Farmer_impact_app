import * as SecureStore from "expo-secure-store";
import { decode } from "base-64";
global.atob = decode;

const tokenDecoder = async () => {
  const token = await SecureStore.getItemAsync("rtc-token");
  return new Promise((resolve, reject) => {
    if (!token) resolve(false);
    const decoded = JSON.parse(decode(token.split(".")[1]));
    const payload = decoded;
    if (Date.now() >= decoded.exp * 1000) {
      resolve(false);
    }
    resolve(payload);
  });
};

export default tokenDecoder;
