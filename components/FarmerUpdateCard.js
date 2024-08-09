import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export const FarmerUpdateCard = ({ data, destination, pending = false }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleNavigation = () => {
    navigation.navigate(destination, {
      data: { farmerData: data, destination: destination },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleNavigation}
      disabled={pending}
      style={{
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between",
        width: "100%",
        backgroundColor: colors.white_variant,
        borderRadius: screenHeight * 0.015,
        borderRadius: screenHeight * 0.015,
        borderLeftColor: pending ? colors.primary : "transparent",
        borderLeftWidth: pending ? screenWidth * 0.02 : 0,
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
          Phone: {data.Phone.length > 0 ? data.Phone : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Gender: {data.Gender}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          National ID:{" "}
          {data.National_ID_t.length > 0 ? data.National_ID_t : "N/A"}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          ID: {data.farmerid}
        </Text>
        <Text
          style={{ fontSize: screenWidth * 0.035, color: colors.black_letter }}
        >
          Date of birth: {data.Year_Birth}
        </Text>
        {pending && (
          <Text
            style={{
              fontSize: screenWidth * 0.03,
              fontWeight: "800",
              color: colors.primary,
            }}
          >
            Pending update
          </Text>
        )}
      </View>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!pending && (
          <AntDesign name="right" size={screenHeight * 0.034} color="black" />
        )}
      </View>
    </TouchableOpacity>
  );
};
