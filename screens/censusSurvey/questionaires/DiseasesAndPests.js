import { Dimensions, Keyboard, ScrollView, Text, View } from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import SimpleIconButton from "../../../components/SimpleIconButton";
import { useFocusEffect } from "@react-navigation/native";
import { RadioInput } from "../../../components/RadioInput";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export const DiseasesAndPests = ({
  setNextModal,
  setSurvey,
  responses,
  setPestsModal,
  removePestFn,
  pestsAdded = [],
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [answers, setAnswers] = useState(responses.pests_and_diseases || []);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);

  const answerOps = [
    { id: 1, label: "More than half of the farm" },
    { id: 2, label: "Half of the farm" },
    { id: 3, label: "1/3 of the farm" },
    { id: 4, label: "Only a few trees" },
    { id: 5, label: "N/A" },
  ];

  const getPrevChoice = (id) => {
    if (!responses.pests_and_diseases) return null;
    const prevChoices = responses.pests_and_diseases;
    for (const ans of prevChoices) {
      if (ans.id === id) {
        return ans.answer;
      }
    }
  };

  const handleNewInput = () => {
    setPestsModal(true);
  };

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

  const handleRemoval = (id) => {
    removePestFn(id);

    let filteredAnswers = answers.filter((item) => item.id !== id);

    setAnswers(filteredAnswers);
  };

  const submitForm = (values) => {
    try {
      let pestsObj = {
        pests_and_diseases: answers,
      };

      setSurvey((prevState) => ({ ...prevState, ...pestsObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
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
            pests_and_diseases: "",
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
        Diseases and Pests
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
          pests_and_diseases: "",
        }}
        innerRef={formRef}
        onSubmit={async (values) => {
          submitForm(values);
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
                  What diseases / pests have been found in your coffee farm in
                  the past year?
                </Text>
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />

                {pestsAdded.length > 0 ? (
                  pestsAdded.map((item) => (
                    <View key={item.id}>
                      <RadioInput
                        label={item.name}
                        id={item.id}
                        setChoice={handleAnswer}
                        options={answerOps}
                        setRemoval={handleRemoval}
                        removable={true}
                        selectedAnswer={getPrevChoice(item.id)}
                      />
                      <View
                        style={{
                          width: "100%",
                          height: 1,
                          backgroundColor: colors.secondary_variant,
                          marginVertical: screenHeight * 0.01,
                        }}
                      />
                    </View>
                  ))
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: screenHeight * 0.017,
                        fontWeight: "500",
                      }}
                    >
                      - No diseases or pests found on the coffee farm -
                    </Text>
                    <View
                      style={{
                        width: "100%",
                        height: 1,
                        backgroundColor: colors.secondary_variant,
                        marginVertical: screenHeight * 0.01,
                      }}
                    />
                  </View>
                )}

                <SimpleIconButton
                  label={"Add pest or disease"}
                  width="100%"
                  color={colors.black}
                  labelColor="white"
                  active={pestsAdded.length < 4}
                  handlePress={handleNewInput}
                  icon={
                    <MaterialIcons
                      name="playlist-add-circle"
                      size={24}
                      color="white"
                    />
                  }
                />

                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: colors.secondary_variant,
                    marginVertical: screenHeight * 0.01,
                  }}
                />

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
