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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/user/loginSlice";
import { useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import tokenDecoder from "../helpers/tokenDecoder";
import * as LocalAuthentication from "expo-local-authentication";
import { UserActions } from "../redux/user/UserSlice";

export const LoginScreen = ({ navigation }) => {
  const loginState = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPwd, setErrorPwd] = useState(false);
  const [accurateHeight, setAccurateHeight] = useState(0);
  const [indicatorVisible, setIndicatorVisibility] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const calculateHeight = () => {
    setAccurateHeight(0);

    let additionalHeight = 0;
    if (errorName) additionalHeight += 55;
    if (errorPwd) additionalHeight += 55;

    setAccurateHeight(screenHeight + additionalHeight);
  };

  const handleClick = () => {};

  const handleNavigation = (location) => {
    navigation.navigate(location);
  };

  const preLoadUserData = async () => {
    try {
      const userData = await tokenDecoder();
      if (userData) {
        await SecureStore.setItemAsync("rtc-name-full", userData.Name_Full);
        await SecureStore.setItemAsync("rtc-user-id", userData.__kp_User);

        dispatch(UserActions.setUserData(userData));
        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const checkBiometric = async () => {
    const compatible =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());
    if (compatible) {
      authenticateUser();
    }
  };

  const authenticateUser = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with biometrics or PIN",
        fallbackLabel: "Enter PIN", // This is the label shown if PIN is available
      });
      if (result.success) {
        setAuthenticated(true);
        let preFetchedData = preLoadUserData();
        if (preFetchedData) {
          handleNavigation("Homepage");
        }
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
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

    calculateHeight();

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [errorName, errorPwd, isKeyboardActive]);

  useEffect(() => {
    setIndicatorVisibility(loginState.loading);

    if (loginState.response !== null) {
      if (loginState.response.status === "success") {
        let preFetchedData = preLoadUserData();
        if (preFetchedData) {
          handleNavigation("Homepage");
        }
      }
    }
  }, [loginState.loading]);

  useEffect(() => {
    const validatedPreviousLogin = async () => {
      if (isFocused) {
        const userData = await tokenDecoder();
        if (userData) {
          checkBiometric();
        }
      }
    };

    validatedPreviousLogin();

    return () => {};
  }, [isFocused]);

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
                  padding: screenHeight * 0.04,
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
                {!isKeyboardActive && (
                  <Text
                    style={{
                      fontSize: screenWidth * 0.09,
                      fontWeight: "bold",
                    }}
                  >
                    Log-in
                  </Text>
                )}

                <Formik
                  initialValues={{
                    uname: "",
                    password: "",
                  }}
                  onSubmit={async (values) => {
                    dispatch(
                      login({
                        Name_User: values.uname,
                        password: values.password,
                      })
                    );
                  }}
                >
                  {({ handleChange, handleBlur, handleSubmit, values }) => (
                    <View style={{ gap: 18, marginTop: screenHeight * 0.025 }}>
                      <View
                        style={{
                          flexDirection: "column",
                          gap: screenHeight * 0.02,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: screenWidth * 0.053,
                          }}
                        >
                          User name
                        </Text>
                        <TextInput
                          placeholder="e.g jdoe"
                          placeholderTextColor={colors.black_a}
                          onChangeText={handleChange("uname")}
                          onBlur={handleBlur("uname")}
                          value={values.uname}
                          style={{
                            borderBottomColor: colors.black_a,
                            borderBottomWidth: 1.5,
                          }}
                        />
                        {errorName && (
                          <Text
                            style={{
                              fontWeight: "regular",
                              fontSize: screenWidth * 0.035,
                              color: "orange",
                              textAlign: "center",
                            }}
                          >
                            *user name is required
                          </Text>
                        )}
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          gap: screenHeight * 0.02,
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: "bold",
                            fontSize: screenWidth * 0.053,
                          }}
                        >
                          Password
                        </Text>
                        <TextInput
                          placeholder="********"
                          secureTextEntry={true}
                          placeholderTextColor={colors.black_a}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          style={{
                            borderBottomColor: colors.black_a,
                            borderBottomWidth: 1.5,
                          }}
                        />
                        {errorPwd && (
                          <Text
                            style={{
                              fontWeight: "regular",
                              fontSize: screenWidth * 0.035,
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
                        disabled={indicatorVisible}
                        onPress={handleSubmit}
                      />
                    </View>
                  )}
                </Formik>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};
