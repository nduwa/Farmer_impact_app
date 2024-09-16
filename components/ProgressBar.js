import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { colors } from "../data/colors";

const ProgressBar = ({ progress }) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress, // Between 0 and 1
      duration: 500,
      useNativeDriver: false, // Must be false for width animation
    }).start();
  }, [progress]);

  return (
    <View style={styles.progressBarContainer}>
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: animation.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    width: "100%",
    backgroundColor: colors.white_a,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.secondary,
    borderRadius: 10,
  },
});

export default ProgressBar;
