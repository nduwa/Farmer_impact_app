import * as FileSystem from "expo-file-system";

const generateFileName = () => {
  const timestamp = Math.floor(Date.now() / 1000);
  return `census-survey-${timestamp}`;
};

export const saveDataToFile = async (data) => {
  try {
    // Convert the data to a JSON string
    const jsonData = JSON.stringify(data);
    const directory = `${FileSystem.documentDirectory}rtc_app/survey/`;
    const fileName = generateFileName();
    // Define the file path

    // Check if the directory exists, if not, create it
    if (!directory.exists) {
      await FileSystem.makeDirectoryAsync(directory, {
        intermediates: true,
      });
    }

    const fileUri = `${directory}${fileName}.json`;

    // Write data to the file
    await FileSystem.writeAsStringAsync(fileUri, jsonData);
    console.log(`Data saved to ${fileUri}`);

    return fileUri;
  } catch (error) {
    console.error("Error saving data to file:", error);
  }
};
