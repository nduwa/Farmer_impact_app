import * as FileSystem from "expo-file-system";
import { useState, useEffect } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

export const openFile = async ({ fileName = null, filepath = null }) => {
  if (!fileName && !filepath) return;

  let fileUri = null;

  if (fileName) fileUri = `${FileSystem.documentDirectory}rtc_app/wetmill/${fileName}`;

  if (filepath) fileUri = filepath;

  FileSystem.getContentUriAsync(fileUri).then((cUri) => {
    console.log(fileUri);
    IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: cUri,
      flags: 1 | 268435456,
      type: "application/pdf",
    })
      .then((result) => {
        console.log("Intent result: ", result);
        if (result.resultCode !== 0) {
          Alert.alert(
            "Error",
            "Failed to open the PDF file. Please make sure a PDF viewer is installed."
          );
        }
      })
      .catch((error) => {
        console.log("Error launching intent: ", error);
      });
  });
};

const FileManager = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      console.log(`${FileSystem.documentDirectory}/rtc_app/wetmill`);
      const filesInDirectory = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}/rtc_app/wetmill`
      );
      setFiles(filesInDirectory);
    };

    loadFiles();
  }, []);

  return (
    <FlatList
      data={files}
      style={{ marginTop: 100 }}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openFile({ fileName: item })}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FileManager;
