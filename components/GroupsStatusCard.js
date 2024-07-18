import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import CustomButton from "./CustomButton";
import { useNavigation } from "@react-navigation/native";

export const GroupsStatusCard = ({
  date,
  activated,
  deactivated,
  submitFn,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        gap: screenHeight * 0.005,
        backgroundColor: colors.white,
        borderRadius: screenWidth * 0.02,
        padding: screenHeight * 0.01,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: screenWidth * 0.05,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        {`Activities - ${date}`}
      </Text>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.secondary_variant,
          height: screenHeight * 0.002,
          width: screenWidth * 0.8,
        }}
      />

      <Text
        style={{
          fontWeight: "500",
          textAlign: "center",
          fontSize: screenWidth * 0.036,
          marginVertical: screenHeight * 0.006,
        }}
      >
        {`GROUPS ACTIVATED / ${activated}`}
      </Text>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.secondary_variant,
          height: screenHeight * 0.001,
          width: screenWidth * 0.7,
        }}
      />
      <Text
        style={{
          fontWeight: "500",
          textAlign: "center",
          fontSize: screenWidth * 0.036,
          marginVertical: screenHeight * 0.006,
        }}
      >
        {`GROUPS DEACTIVATED / ${deactivated}`}
      </Text>
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.secondary_variant,
          height: screenHeight * 0.001,
          width: screenWidth * 0.7,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: screenWidth * 0.03,
          width: "100%",
        }}
      >
        <CustomButton
          bg={colors.blue_font}
          color={"white"}
          width="80%"
          text="Upload"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={false}
          fontSizeRatio={0.05}
          onPress={submitFn}
        />
      </View>
    </View>
  );
};
