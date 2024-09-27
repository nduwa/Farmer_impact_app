import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleIconButton from "./SimpleIconButton";
import TinyIconButton from "./TinyIconButton";

export const FilePendingItem = ({ data, index, date, uploadFn, deleteFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white_variant,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: "row", gap: screenHeight * 0.02 }}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="file-pdf"
            size={screenWidth * 0.12}
            color={colors.blue_font}
          />
        </View>
        <View style={{ gap: screenHeight * 0.008 }}>
          <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
            Audit report file [{index + 1}]
          </Text>
          <Text
            style={{
              fontSize: screenWidth * 0.035,
              color: colors.black_letter,
            }}
          >
            Pending since: {date}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: screenHeight * 0.04,
            gap: screenWidth * 0.01,
            padding: screenWidth * 0.01,
            borderWidth: screenWidth * 0.003,
            borderColor: colors.black_a,
            borderRadius: screenWidth * 0.02,
            marginLeft: screenWidth * 0.04,
          }}
        >
          <AntDesign
            name="folderopen"
            size={screenWidth * 0.04}
            color={colors.black_letter}
          />
          <Text
            style={{
              fontSize: screenWidth * 0.03,
              fontWeight: "600",
              color: colors.black_letter,
            }}
          >
            Open File?
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: screenWidth * 0.05,
          width: "100%",
          marginTop: screenHeight * 0.025,
        }}
      >
        <SimpleIconButton
          handlePress={() => deleteFn(data.id, data.filepath)}
          label={"Delete"}
          icon={<Ionicons name="trash" size={24} color="white" />}
        />
        <SimpleIconButton
          handlePress={() => uploadFn(data.filepath)}
          label={"Upload"}
          color={colors.blue_font}
          icon={<Ionicons name="cloud-upload" size={24} color="white" />}
        />
      </View>
    </View>
  );
};
