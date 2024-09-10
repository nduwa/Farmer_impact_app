import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { colors } from "../data/colors";
import { Dimensions, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import TinyIconButton from "./TinyIconButton";
import { useState } from "react";

export const RadioInput = ({
  options = [],
  label,
  setChoice,
  id,
  setRemoval = null,
  removable = false,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [answer, setAnswer] = useState("");

  const handleRemoval = (id) => {
    setRemoval(id);
  };

  const handleChoice = (answerObj) => {
    setAnswer(answerObj.answer);

    setChoice({
      id: answerObj.id,
      answer: getLabel(answerObj.answer),
      label,
    });
  };

  const getLabel = (id) => {
    let foundlabel = options.find((item) => item.id == id);
    return foundlabel?.label;
  };

  return (
    <View
      style={{
        gap: screenHeight * 0.015,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          gap: screenWidth * 0.03,
        }}
      >
        <Text
          style={{
            fontWeight: "400",
            fontSize: screenWidth * 0.05,
            color: colors.black,
            marginLeft: screenWidth * 0.02,
          }}
        >
          {label}
        </Text>
        {removable && (
          <TinyIconButton
            label={"Remove?"}
            width="30%"
            color={colors.red}
            labelColor="white"
            active={true}
            handlePress={() => handleRemoval(id)}
            icon={
              <MaterialCommunityIcons
                name="delete-forever"
                size={20}
                color="white"
              />
            }
          />
        )}
      </View>

      <RadioButtonGroup
        containerStyle={{
          marginLeft: 10,
          marginBottom: 10,
          gap: 5,
        }}
        selected={answer}
        onSelected={(value) => handleChoice({ id, answer: value })}
        radioBackground={colors.secondary}
      >
        {options.map((op) => (
          <RadioButtonItem
            key={op.id}
            value={op.id}
            label={
              <Text
                style={{
                  fontWeight: "600",
                  fontSize: 16,
                  marginLeft: 8,
                  color: colors.black,
                }}
              >
                {op.label}
              </Text>
            }
          />
        ))}
      </RadioButtonGroup>
    </View>
  );
};
