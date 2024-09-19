import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect } from "react";

export const ItemPickerInput = ({
  label,
  items = [],
  selectedItem,
  setChoice,
}) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  return (
    <View
      style={{
        gap: screenHeight * 0.02,
        marginVertical: screenHeight * 0.008,
      }}
    >
      <Text
        style={{
          fontSize: screenWidth * 0.04,
          fontWeight: "500",
        }}
      >
        • {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: screenHeight * 0.01,
          width: "100%",
        }}
      >
        {selectedItem && (
          <View style={{ flexDirection: "row", gap: screenHeight * 0.01 }}>
            <TouchableOpacity
              disabled={true}
              style={{
                backgroundColor: selectedItem.color || "transparent",
                padding: screenWidth * 0.015,
                borderRadius: screenWidth * 0.02,
                borderColor: colors.black_letter,
                borderWidth: screenWidth * 0.002,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: colors.black_letter,
                  fontSize: screenWidth * 0.035,
                  fontWeight: "700",
                }}
              >
                {selectedItem.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setChoice(null);
              }}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: screenWidth * 0.01,
                backgroundColor: "white",
                paddingHorizontal: screenWidth * 0.02,
                borderRadius: screenWidth * 0.03,
                elevation: 3,
              }}
            >
              <AntDesign name="close" size={18} color={colors.black_letter} />
              <Text
                style={{
                  color: colors.black_letter,
                  fontSize: screenWidth * 0.035,
                }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {!selectedItem &&
          items.map((item) => (
            <TouchableOpacity
              key={item.value}
              onPress={() => {
                setChoice(item.name);
              }}
              style={{
                backgroundColor: item.color || "transparent",
                padding: screenWidth * 0.015,
                borderRadius: screenWidth * 0.02,
                borderColor: colors.black_letter,
                borderWidth: screenWidth * 0.002,
                elevation: 3,
              }}
            >
              <Text
                style={{
                  color: colors.black_letter,
                  fontSize: screenWidth * 0.035,
                  fontWeight: "700",
                }}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
};
