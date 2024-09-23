import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, { memo, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ItemPickerInput } from "./ItemPickerInput";
import { getCurrentDate } from "../helpers/getCurrentDate";

const InspectionQuestion = ({ data, question, setQnAnswer, currentAnswer }) => {
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const [date, setDate] = useState(currentAnswer?.complianceDate || new Date());
  const [answer, setAnswer] = useState({
    id: question.id,
    answer: null,
    explaination: null,
  });
  const [choices, setChoices] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [complianceLevel, setComplianceLevel] = useState();
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const complianceArr = [
    { name: "75%-100%", value: "gold", color: colors.gold_bg },
    { name: "50%-74%", value: "silver", color: colors.silver_bg },
    { name: "25%-49%", value: "bronze", color: colors.bronze_bg },
    { name: "0%-24%", value: "poor", color: colors.white },
  ];

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    handleAnswer({
      ans: answer.answer,
      compDate: getCurrentDate(currentDate),
      expl: answer.explaination,
    });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const removeDuplicates = (items) => {
    return [...new Set(items)];
  };

  const handleAnswer = ({ ans, compDate = null, expl = null }) => {
    setAnswer({
      id: question.id,
      answer: ans,
      complianceDate: compDate,
      explaination: expl || "",
    });

    setQnAnswer({
      id: question.id,
      answer: ans,
      complianceDate: compDate,
      explaination: expl || "",
    });
  };

  const getLabel = (id) => {
    let foundlabel = choices.find((item) => item.id == id);
    return foundlabel?.label;
  };

  const handleComplianceObservation = (name) => {
    for (const item of complianceArr) {
      if (item.name === name) {
        return item;
      }
    }

    return null;
  };

  const handleAnswerExpl = (value) => {
    if (
      getLabel(value) === "Compliance" ||
      getLabel(value) === "Biratunganye"
    ) {
      return "100%";
    } else if (
      getLabel(value) === "Not applicable" ||
      getLabel(value) === "Ntibimureba"
    ) {
      return "0%";
    } else {
      return answer.explaination;
    }
  };

  useEffect(() => {
    setSelectedAnswer(answer.answer);
    setComplianceLevel(
      handleComplianceObservation(answer.explaination || null)
    );
  }, [answer]);

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

      if (currentAnswer) {
        setSelectedAnswer(currentAnswer?.answer);
        setComplianceLevel(
          handleComplianceObservation(currentAnswer?.explaination)
        );
      }

      multipleChoices = setChoices(multipleChoices);
      return () => {
        setAnswer("");
        setChoices([]);
        setSelectedAnswer("");
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
            selected={selectedAnswer}
            onSelected={(value) =>
              handleAnswer({
                ans: value,
                expl: handleAnswerExpl(value),
              })
            }
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
        {(getLabel(currentAnswer?.answer || answer?.answer) ===
          "Ntibitunganye" ||
          getLabel(currentAnswer?.answer || answer?.answer) ===
            "Non Compliance") && (
          <>
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: colors.secondary_variant,
              }}
            />
            <View
              style={{
                justifyContent: "center",
                gap: screenHeight * 0.01,
                marginVertical: screenHeight * 0.02,
                paddingHorizontal: screenHeight * 0.005,
              }}
            >
              <View
                style={{
                  gap: screenHeight * 0.01,
                }}
              >
                <Text
                  style={{ fontSize: screenWidth * 0.04, fontWeight: "500" }}
                >
                  • When can the compliance be met?
                </Text>
                <View
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    gap: screenWidth * 0.02,
                    width: "100%",
                    marginTop: screenHeight * 0.01,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: screenWidth * 0.02,
                      borderRadius: 7,
                      backgroundColor: colors.white_variant,
                      elevation: 4,
                    }}
                    onPress={showDatepicker}
                  >
                    <AntDesign
                      name="calendar"
                      size={screenWidth * 0.045}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      borderWidth: 0.3,
                      borderRadius: 8,
                      borderColor: colors.bg_variant_font,
                      backgroundColor: colors.white_a,
                      paddingHorizontal: 7,
                      paddingVertical: 7,
                      width: screenWidth * 0.745,
                      fontWeight: "500",
                      fontSize: screenWidth * 0.04,
                      color: colors.blue_font,
                    }}
                  >
                    {date.toLocaleString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </Text>
                  {show && (
                    <DateTimePicker
                      testID="dateTimePicker"
                      minimumDate={new Date()}
                      value={date}
                      mode={mode}
                      is24Hour={true}
                      onChange={onChange}
                    />
                  )}
                </View>
                <ItemPickerInput
                  label={"Describe your observation on level of compliance"}
                  setChoice={(value) => {
                    handleAnswer({ ans: answer.answer, expl: value });
                  }}
                  selectedItem={complianceLevel}
                  items={complianceArr}
                />
              </View>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default memo(InspectionQuestion);
