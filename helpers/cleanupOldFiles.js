import * as FileSystem from "expo-file-system";

export const cleanupOldFiles = async ({
  daysAgo = 30,
  imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "webp"],
}) => {
  try {
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo); // e.g., files older than 30 days

    // Define image file extensions to look for

    for (const file of files) {
      const fileUri = `${FileSystem.documentDirectory}${file}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // Check if the file is older than the cutoff date and has an image extension
      if (
        fileInfo.modificationTime < cutoffDate.getTime() &&
        imageExtensions.includes(file.split(".").pop().toLowerCase())
      ) {
        await FileSystem.deleteAsync(fileUri);
        console.log(`Deleted old file: ${file}`);
      }
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};
