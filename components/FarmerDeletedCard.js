import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const FarmerDeletedCard = ({ data, deleteDate, restoreFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleRestore = () => {
    restoreFn({ open: true, id: data.__kp_Farmer });
  };

  return (
    <View
      style={{
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: screenHeight * 0.02,
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.015,
        padding: screenWidth * 0.03,
        elevation: 3,
      }}
    >
      <View style={{ gap: screenHeight * 0.008 }}>
        <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
          {data.Name}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Gender: {data.Gender}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Phone: {data.Phone.length > 0 ? data.Phone : "N/A"}
        </Text>

        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Date of birth: {data.Year_Birth}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Pending since: {deleteDate}
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.secondary_variant,
          height: screenHeight * 0.002,
          width: screenWidth * 0.7,
          alignSelf: "center",
        }}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={handleRestore}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: screenWidth * 0.03,
            backgroundColor: colors.blue_font,
            height: screenHeight * 0.045,
            borderRadius: screenHeight * 0.045,
            width: "70%",
            elevation: 3,
          }}
        >
          <MaterialIcons
            name="settings-backup-restore"
            size={24}
            color="white"
          />
          <Text
            style={{
              fontSize: screenHeight * 0.023,
              fontWeight: "600",
              color: "white",
            }}
          >
            Restore farmer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
