import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { colors } from "../data/colors";
import { useFocusEffect } from "@react-navigation/native";

export const InspectionQuestion = ({ data }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let multipleChoices = [];
      if (data.type === "Generic Inspection") {
        multipleChoices = [
          { label: "Yes", value: "yes" },
          { label: "No", value: "no" },
          { label: "N/A", value: "n/a" },
        ];
      } else if (data.type === "Advanced Inspection") {
        multipleChoices = [
          { label: "Compliance", value: "compliance" },
          { label: "Non compliance", value: "non-compliance" },
          { label: "Not applicable", value: "n/a" },
        ];
      } else if (data.type === "Special Inspection") {
        multipleChoices = [
          { label: "Compliance", value: "compliance" },
          { label: "Non compliance", value: "non-compliance" },
          { label: "Not applicable", value: "n/a" },
        ];
      } else if (data.type === "Cafe Inspection") {
        multipleChoices = [
          { label: "Compliance", value: "compliance" },
          { label: "Non compliance", value: "non-compliance" },
          { label: "Not applicable", value: "n/a" },
        ];
      } else if (data.type === "RFA Inspection") {
        multipleChoices = [
          { label: "Compliance", value: "compliance" },
          { label: "Non compliance", value: "non-compliance" },
          { label: "Not applicable", value: "n/a" },
        ];
      }
      setChoices(multipleChoices);
      return () => {
        // Cleanup code if needed
      };
    }, [])
  );

  return (
    <View
      style={{
        marginTop: screenHeight * 0.014,
        padding: screenHeight * 0.01,
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.01,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: screenHeight * 0.022, fontWeight: "500" }}>
        {data.index + 1}. {data.question}
      </Text>
      <View
        style={{
          marginTop: screenHeight * 0.02,
        }}
      >
        {choices.length > 0 && (
          <RadioButtonGroup
            containerStyle={{ marginBottom: 10, gap: 7 }}
            selected={answer}
            onSelected={(value) => setAnswer(value)}
            radioBackground={colors.secondary}
          >
            {choices.map((item) => (
              <RadioButtonItem
                value={item.value}
                label={
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: screenHeight * 0.02,
                      marginLeft: screenHeight * 0.01,
                      color: colors.black,
                    }}
                  >
                    {item.label}
                  </Text>
                }
              />
            ))}
          </RadioButtonGroup>
        )}
      </View>
    </View>
  );
};
