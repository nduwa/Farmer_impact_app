import * as SecureStore from "expo-secure-store";
import i18n from "../i18n";

export const initLanguage = async () => {
  try {
    const savedLanguage = await SecureStore.getItemAsync("rtc-user-language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
      console.log("language choice restored");
    }
  } catch (error) {
    console.error("Error retrieving user language:", error);
  }
};
