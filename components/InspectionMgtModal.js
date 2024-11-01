import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
} from "react-native";
import { colors } from "../data/colors";
import { globalStyles } from "../data/globalStyles";
import { ModalMenuItem } from "./ModalMenuItem";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export const InspectionMgtModal = ({ setIsInspectionModalOpen }) => {
  const [initClose, setInitClose] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const modalHeight = screenHeight * 0.4;
  const animation = new Animated.Value(0);

  const handleClick = () => {
    setInitClose(true);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [initClose ? 0 : modalHeight, initClose ? modalHeight : 0],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      easing: initClose ? Easing.linear : Easing.back(),
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (initClose) setIsInspectionModalOpen(false);
    });
  }, [initClose]);

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          backgroundColor: colors.black_a,
          padding: 10,
          zIndex: 10,
        }}
      >
        <Animated.View
          style={[
            globalStyles.inspectionMgtModalStyles,
            { transform: [{ translateY }] },
          ]}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 20 }}
          >
            <View
              style={{
                backgroundColor: colors.secondary,
                height: 6,
                width: 85,
                borderRadius: 20,
              }}
            />
            <Text
              style={{
                fontWeight: "700",
                fontSize: 23,
                color: colors.secondary,
              }}
            >
              Inspection
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              gap: 16,
              width: "80%",
            }}
          >
            <ModalMenuItem
              setIsModalOpen={setIsInspectionModalOpen}
              destination={"chooseInspection"}
              label={"New Inspection"}
              icon={
                <Foundation name="clipboard-notes" size={24} color="black" />
              }
            />
            <ModalMenuItem
              setIsModalOpen={setIsInspectionModalOpen}
              destination={"chooseInspection"}
              label={"Re-inspection"}
              isActive={false}
              icon={
                <MaterialCommunityIcons
                  name="reload-alert"
                  size={24}
                  color="black"
                />
              }
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
