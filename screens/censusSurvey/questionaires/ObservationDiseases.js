import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { RadioInput } from "../../../components/RadioInput";

export const ObservationDiseases = ({ setNextModal, setSurvey, responses }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [answers, setAnswers] = useState(
    responses.observation_on_diseases || []
  );
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const answerOps = [
    { id: 1, label: "More than half of the farm" },
    { id: 2, label: "Half of the farm" },
    { id: 3, label: "1/3 of the farm" },
    { id: 4, label: "Only a few trees" },
    { id: 5, label: "N/A" },
  ];

  const handleAnswer = (answer) => {
    let allAnswers = answers;

    let foundItem = allAnswers.find((item) => item.id === answer.id);

    if (foundItem) {
      for (let ans of allAnswers) {
        if (ans.id === foundItem.id) {
          ans.answer = answer.answer;
        }
      }
    } else {
      allAnswers.push(answer);
    }

    setAnswers(allAnswers);
  };

  const submitForm = (values) => {
    try {
      let observObj = {
        observation_on_diseases: answers,
      };

      if (answers.length < 8) {
        setValidationError({
          type: "emptyOrInvalidData",
          message: `Some information is missing, please fill in all required information`,
          inputBox: null,
        });

        return;
      }

      setSurvey((prevState) => ({ ...prevState, ...observObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getPrevChoice = (id) => {
    if (!responses.observation_on_diseases) return null;
    const prevChoices = responses.observation_on_diseases;
    for (const ans of prevChoices) {
      if (ans.id === id) {
        return ans.answer;
      }
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardActive(true);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardActive(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [isKeyboardActive]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            observation_on_diseases: "",
          });
        }
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        maxWidth: screenWidth,
        alignItems: "center",
        borderRadius: screenWidth * 0.04,
        padding: 8,
        elevation: 8,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.022,
          fontWeight: "600",
          marginVertical: screenHeight * 0.01,
        }}
      >
        Observation on Diseases and Pests
      </Text>
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: colors.secondary_variant,
        }}
      />
      <Formik
        initialValues={{
          observation_on_diseases: "",
        }}
        innerRef={formRef}
        onSubmit={async (values) => {
          submitForm();
        }}
      >
        {({
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
          values,
        }) => (
          <View
            style={{
              gap: 18,
            }}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                height: "94%",
                width: screenWidth,
              }}
              contentContainerStyle={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: screenHeight * 0.01,
              }}
            >
              <View
                style={{
                  width: "95%",
                  backgroundColor: colors.white,
                  borderRadius: 15,
                  paddingHorizontal: screenWidth * 0.04,
                  paddingVertical: screenHeight * 0.03,
                  gap: screenHeight * 0.01,
                }}
              >
                <Text
                  style={{
                    fontWeight: "500",
                    fontSize: screenWidth * 0.04,
                    color: colors.black,
                    marginLeft: screenWidth * 0.02,
                  }}
                >
                  Best implemented courses, least implemented courses
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />

                <RadioInput
                  label={"Leaf rust"}
                  id={1}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(1)}
                />

                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Coffee berry borer"}
                  id={2}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(2)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Coffee berry disease"}
                  id={3}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(3)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"White Stem borer"}
                  id={4}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(4)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Scares and mealy bugs"}
                  id={5}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(5)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Antestia"}
                  id={6}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(6)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Traps"}
                  id={7}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(7)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                <RadioInput
                  label={"Leaf miner"}
                  id={8}
                  setChoice={handleAnswer}
                  options={answerOps}
                  selectedAnswer={getPrevChoice(8)}
                />
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />
                {/* validation error */}
                {validationError.message && (
                  <View
                    style={{
                      width: "100%",
                      backgroundColor: colors.white_variant,
                      elevation: 2,
                      borderWidth: 0.7,
                      borderColor: "red",
                      borderRadius: 15,
                      paddingHorizontal: screenWidth * 0.02,
                      paddingVertical: screenHeight * 0.02,
                      gap: screenHeight * 0.01,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.05,
                        color: colors.secondary,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      Validation Error
                    </Text>
                    <Text
                      style={{
                        fontWeight: "400",
                        fontSize: screenWidth * 0.04,
                        color: colors.black_letter,
                        marginLeft: screenWidth * 0.02,
                      }}
                    >
                      {validationError.message}
                    </Text>
                  </View>
                )}

                <SimpleIconButton
                  label={"Save"}
                  width="100%"
                  color={colors.secondary}
                  labelColor="white"
                  active={true}
                  handlePress={handleSubmit}
                  icon={<Feather name="save" size={24} color="white" />}
                />
              </View>
            </ScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};
