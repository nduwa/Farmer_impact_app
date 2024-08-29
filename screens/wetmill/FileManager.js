import * as FileSystem from "expo-file-system";
import { useState, useEffect } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import * as IntentLauncher from "expo-intent-launcher";

const FileManager = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const loadFiles = async () => {
      console.log(`${FileSystem.documentDirectory}/Download`);
      const filesInDirectory = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}/Download`
      );
      setFiles(filesInDirectory);
    };

    loadFiles();
  }, []);

  const openFile = async (fileName) => {
    const fileUri = `${FileSystem.documentDirectory}Download/${fileName}`;
    FileSystem.getContentUriAsync(fileUri).then((cUri) => {
      console.log(cUri);
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: cUri,
        flags: 1,
        type: "application/pdf",
      });
    });
  };

  return (
    <FlatList
      data={files}
      style={{ marginTop: 100 }}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => openFile(item)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default FileManager;
