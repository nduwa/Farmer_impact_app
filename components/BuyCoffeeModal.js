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
import { BuyCoffeeItem } from "./BuyCoffeeItem";

export const BuyCoffeeModal = ({ setIsBuyCoffeeModalOpen }) => {
  const [initClose, setInitClose] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const modalHeight = screenHeight * 0.5;
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
      if (initClose) setIsBuyCoffeeModalOpen(false);
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
            globalStyles.buyCoffeeModalStyles,
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
              Buy Coffee
            </Text>
          </View>

          <View style={{ flex: 1, gap: 16 }}>
            <BuyCoffeeItem
              setIsBuyCoffeeModalOpen={setIsBuyCoffeeModalOpen}
              destination={"FarmerScreen"}
              label={"Registered ATP Farmer"}
            />
            <BuyCoffeeItem
              setIsBuyCoffeeModalOpen={setIsBuyCoffeeModalOpen}
              destination={"Unregistered_ATP_Farmer"}
              label={"Unregistered ATP Farmer"}
            />
            <BuyCoffeeItem
              setIsBuyCoffeeModalOpen={setIsBuyCoffeeModalOpen}
              destination={"Unregistered_ATP_Farmer"}
              label={"Review Purchases"}
              disabled={true}
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
