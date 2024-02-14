import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import bgImage from "../assets/image_login_1.jpg";
import { globalStyles } from "../data/globalStyles";
import { colors } from "../data/colors";
import { Formik } from "formik";
import CustomButton from "../components/CustomButton";

export const LoginScreen = ({ navigation }) => {
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPwd, setErrorPwd] = useState(false);
  const [accurateHeight, setAccurateHeight] = useState(0);
  const screenHeight = Dimensions.get("window").height;

  const calculateHeight = () => {
    setAccurateHeight(0);

    let additionalHeight = 0;
    if (errorName) additionalHeight += 55;
    if (errorPwd) additionalHeight += 55;

    setAccurateHeight(screenHeight + additionalHeight);
  };

  const handleClick = () => {};

  const handleSubmit = () => {};

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

    calculateHeight();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [errorName, errorPwd, isKeyboardActive]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      on
    >
      <StatusBar style={isKeyboardActive ? "dark" : "light"} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {!isKeyboardActive && (
            <ImageBackground
              source={bgImage}
              resizeMode="cover"
              style={globalStyles.image}
            />
          )}

          <KeyboardAvoidingView
            style={{
              position: "absolute",
              flexGrow: 1,
              bottom: 0,
              minHeight: accurateHeight * 0.52,
              width: "100%",
              backgroundColor: "transparent",
            }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  width: "100%",
                  padding: 30,
                  backgroundColor: colors.white,
                  borderTopLeftRadius: 35,
                  borderTopRightRadius: 35,
                  ...Platform.select({
                    ios: {
                      shadowColor: "black",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    },
                    android: {
                      elevation: 9,
                    },
                  }),
                }}
              >
                <Text
                  style={{
                    fontSize: 33,
                    fontWeight: "bold",
                  }}
                >
                  Log-in
                </Text>
                <Formik>
                  <View style={{ gap: 18, marginTop: 23 }}>
                    <View style={{ flexDirection: "column", gap: 13 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        User name
                      </Text>
                      <TextInput
                        placeholder="e.g jdoe"
                        placeholderTextColor={colors.black_a}
                        style={{
                          borderBottomColor: colors.black_a,
                          borderBottomWidth: 1.5,
                        }}
                      />
                      {errorName && (
                        <Text
                          style={{
                            fontWeight: "regular",
                            fontSize: 12,
                            color: "orange",
                            textAlign: "center",
                          }}
                        >
                          *user name is required
                        </Text>
                      )}
                    </View>
                    <View style={{ flexDirection: "column", gap: 13 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                        Password
                      </Text>
                      <TextInput
                        placeholder="********"
                        secureTextEntry={true}
                        placeholderTextColor={colors.black_a}
                        style={{
                          borderBottomColor: colors.black_a,
                          borderBottomWidth: 1.5,
                        }}
                      />
                      {errorPwd && (
                        <Text
                          style={{
                            fontWeight: "regular",
                            fontSize: 12,
                            color: "orange",
                            textAlign: "center",
                          }}
                        >
                          *Password is required
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity onPress={handleClick}>
                      <Text style={globalStyles.labelNormal}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                    <CustomButton
                      bg={colors.black}
                      color={colors.white}
                      width="100%"
                      text="Login"
                      bdcolor="transparent"
                      mt={5}
                      disabled={false}
                      onPress={handleSubmit}
                    />
                  </View>
                </Formik>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
