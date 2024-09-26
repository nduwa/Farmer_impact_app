import * as FileSystem from "expo-file-system";

export const readDataFromFile = async (fileUri) => {
  try {
    // Read the file contents
    console.log(fileUri);
    const jsonData = await FileSystem.readAsStringAsync(fileUri);
    // Convert JSON string back to an object
    const data = JSON.parse(jsonData);

    return data;
  } catch (error) {
    console.error("Error reading data from file:", error);
  }
};
