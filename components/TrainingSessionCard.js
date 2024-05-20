import { Dimensions, Text, View } from "react-native";
import { colors } from "../data/colors";
import CustomButton from "../components/CustomButton";

export const TrainingSessionCard = ({
  course_id,
  course_name,
  participants,
  group_id,
  onUpload,
  onDelete,
  active = true,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  return (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        gap: screenHeight * 0.01,
        borderRadius: 15,
        backgroundColor: colors.white,
        padding: 10,
        elevation: 3,
      }}
    >
      <View
        style={{
          alignItems: "center",
          gap: screenHeight * 0.01,
        }}
      >
        <Text
          style={{
            fontSize: screenWidth * 0.045,
            fontWeight: "600",
          }}
        >
          Training session
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.002,
            width: screenWidth * 0.7,
          }}
        />
      </View>

      <View style={{ alignItems: "center" }}>
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`COURSE ID  /  ${course_id}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.6,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`COURSE  /  ${course_name}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.6,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`PARTICIPANTS  /  ${participants}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.6,
          }}
        />
        <Text
          style={{
            fontWeight: "500",
            textAlign: "center",
            fontSize: screenWidth * 0.04,
            marginVertical: screenHeight * 0.006,
          }}
        >
          {`GROUP ID  /  ${group_id}`}
        </Text>
        <View
          style={{
            backgroundColor: colors.secondary_variant,
            height: screenHeight * 0.001,
            width: screenWidth * 0.6,
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: screenWidth * 0.03,
          width: "95%",
          paddingHorizontal: screenWidth * 0.05,
          marginTop: screenHeight * 0.01,
        }}
      >
        <CustomButton
          bg={colors.secondary}
          color={"white"}
          width="45%"
          text="Delete"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={!active}
          fontSizeRatio={0.04}
          onPress={onDelete}
        />
        <CustomButton
          bg={colors.black}
          color={"white"}
          width="45%"
          text="Upload"
          bdcolor="transparent"
          mt={8}
          mb={8}
          radius={7}
          paddingRatio={0.01}
          disabled={!active}
          fontSizeRatio={0.04}
          onPress={onUpload}
        />
      </View>
    </View>
  );
};
