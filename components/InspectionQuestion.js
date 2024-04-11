import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, { memo, useEffect, useState } from "react";
import { Dimensions, FlatList, Text, View } from "react-native";
import { colors } from "../data/colors";
import { useFocusEffect } from "@react-navigation/native";

const InspectionQuestion = ({ data, question, setQnAnswer }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [answer, setAnswer] = useState("");
  const [choices, setChoices] = useState([]);

  const removeDuplicates = (items) => {
    return [...new Set(items)];
  };

  const handleAnswer = (value) => {
    console.log(value);
    setAnswer(value);
    setQnAnswer({ id: question.id, answer: value });
  };

  useFocusEffect(
    React.useCallback(() => {
      let multipleChoices = [];
      let labels = [];
      let ids = [];
      let allChoices = "";
      let allIDs = "";

      if (data.language === "kiny") {
        allChoices = question?.answers_kiny;
      } else {
        allChoices = question?.answers_eng;
      }
      allIDs = question?.answers_ids;

      labels = removeDuplicates(allChoices.split(","));
      ids = removeDuplicates(allIDs.split(","));

      for (const label of labels) {
        let obj = {
          label,
          id: ids[labels.indexOf(label)],
        };

        multipleChoices.push(obj);
      }

      multipleChoices = setChoices(multipleChoices);
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
        {data.index + 1}.{" "}
        {data.language === "kiny" ? question.Kiny_phrase : question.Eng_phrase}
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
            onSelected={(value) => handleAnswer(value)}
            radioBackground={colors.secondary}
          >
            {choices.map((item) => (
              <RadioButtonItem
                key={item.id}
                value={item.id}
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

export default memo(InspectionQuestion);
