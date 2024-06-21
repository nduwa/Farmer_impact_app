import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../data/colors";
import CustomButton from "./CustomButton";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export const UserModal = ({ data, CloseFn, AccessCtrlFn }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const handleClose = () => {
    CloseFn(false);
  };
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: 10,
        backgroundColor: colors.black_a,
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: "83%",
          alignItems: "center",
          gap: screenHeight * 0.02,
          borderRadius: 15,
          backgroundColor: colors.white,
          padding: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleClose}
          style={{
            position: "absolute",
            top: -screenHeight * 0.015,
            left: screenWidth * 0.74,
            backgroundColor: colors.white,
            borderRadius: 100,
            padding: screenHeight * 0.004,
            elevation: 4,
          }}
        >
          <AntDesign
            name="closecircleo"
            size={screenHeight * 0.035}
            color="black"
          />
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            gap: screenHeight * 0.01,
          }}
        >
          <Text
            style={{
              fontSize: screenWidth * 0.05,
              fontWeight: "600",
            }}
          >
            Current Session
          </Text>
          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.002,
              width: screenWidth * 0.7,
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
            {`USER / ${data.names.toUpperCase()}`}
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
            {`ROLE / ${data.role.toUpperCase()}`}
          </Text>
          {data.station && (
            <>
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
                {`STATION / ${data?.station?.name.toUpperCase()}`}
              </Text>
            </>
          )}
          <View
            style={{
              backgroundColor: colors.secondary_variant,
              height: screenHeight * 0.001,
              width: screenWidth * 0.6,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              width: "75%",
              gap: screenWidth * 0.02,
            }}
          >
            <MaterialIcons
              name="error"
              size={screenHeight * 0.04}
              color={colors.black_letter}
            />
            <Text
              style={{
                textAlign: "left",
                color: colors.black_letter,
              }}
            >
              In case your permissions have been updated, use the button below
              to refresh the app for the new changes. This action needs internet
              connectivity.
            </Text>
          </View>
          <Text
            style={{
              textAlign: "left",
              fontWeight:"600",
              color: colors.black_letter,
              fontSize: screenWidth * 0.029,
            }}
          >
            This action requires internet connectivity.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "center",
              width: screenWidth * 0.6,
            }}
          >
            <CustomButton
              bg={colors.blue_font}
              color={"white"}
              width="90%"
              text="Refresh Access Control"
              bdcolor="transparent"
              mt={8}
              mb={8}
              radius={7}
              paddingRatio={0.01}
              disabled={false}
              fontSizeRatio={0.04}
              onPress={AccessCtrlFn}
            />
          </View>
        </View>

        <View style={{ alignItems: "center" }}></View>
      </View>
    </View>
  );
};
