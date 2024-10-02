import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import SimpleIconButton from "./SimpleIconButton";
import TinyIconButton from "./TinyIconButton";
import { openFile } from "../screens/wetmill/FileManager";
import { useNavigation } from "@react-navigation/native";

export const FilePendingItem = ({ data, index, date, uploadFn, deleteFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const readFile = async (uri) => {
    await openFile({ filepath: uri });
    // navigation.navigate("Filemanager");
  };
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: screenHeight * 0.02,
        }}
      >
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
            File type: pdf
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
        <View
          style={{
            position: "absolute",
            width: "100%",
            left: screenWidth * 0.61,
          }}
        >
          <TinyIconButton
            label={"Remove?"}
            width="28%"
            color={colors.red}
            labelColor="white"
            active={true}
            handlePress={() =>
              deleteFn({ id: data.id, uri: data.filepath, open: true })
            }
            icon={<Ionicons name="trash" size={24} color={"white"} />}
          />
        </View>
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
          handlePress={async () => await readFile(data.filepath)}
          label={"Preview"}
          icon={<Ionicons name="reader" size={24} color="white" />}
          color={colors.black}
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
