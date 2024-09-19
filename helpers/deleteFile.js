import * as FileSystem from "expo-file-system";

export const deleteFile = async (fileUri) => {
  try {
    await FileSystem.deleteAsync(fileUri);
    console.log(`File ${fileUri} deleted`);
  } catch (error) {
    console.error("Error uploading or cleaning up file:", error);
  }
};
