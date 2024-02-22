import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const SyncItem = ({ name, isDone = false }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        justifyContent: "flex-start",
      }}
    >
      <Text>{name}....</Text>
      {isDone ? (
        <MaterialIcons name="done" size={24} color="black" />
      ) : (
        <AntDesign name="question" size={24} color="black" />
      )}
    </View>
  );
};
