import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
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
import { login, loginActions } from "../redux/user/loginSlice";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import tokenDecoder from "../helpers/tokenDecoder";
import * as LocalAuthentication from "expo-local-authentication";
import * as Location from "expo-location";
import { UserActions } from "../redux/user/UserSlice";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { deleteDBdataAsync } from "../helpers/deleteDBdataAsync";
import { dropTableAsync } from "../helpers/dropTableAsync";
import LottieView from "lottie-react-native";

export const LoginScreen = ({ navigation }) => {
  const loginState = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const formRef = useRef(null);

  const [pwdVisible, setPwdVisible] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPwd, setErrorPwd] = useState(false);
  const [accurateHeight, setAccurateHeight] = useState(0);
  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [forwardData, setForwardData] = useState({ nameFull: false });
  const [userDataPreloaded, setUserDataPreloaded] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(false);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const pwdInput = useRef();

  const calculateHeight = () => {
    setAccurateHeight(0);

    let additionalHeight = 0;
    if (errorName) additionalHeight += 55;
    if (errorPwd) additionalHeight += 55;

    setAccurateHeight(screenHeight + additionalHeight);
  };

  const preLoadUserData = async () => {
    await tokenDecoder()
      .then(async (userData) => {
        if (userData) {
          await SecureStore.setItemAsync(
            "rtc-name-full",
            userData.user.Name_Full
          );
          await SecureStore.setItemAsync(
            "rtc-user-name",
            userData.user.Name_User
          );
          await SecureStore.setItemAsync(
            "rtc-user-id",
            userData.user.__kp_User
          );
          await SecureStore.setItemAsync(
            "rtc-user-staff-id",
            userData.staff.userID
          );
          await SecureStore.setItemAsync(
            "rtc-user-staff-kf",
            userData.staff.__kp_Staff
          );
          await SecureStore.setItemAsync(
            "rtc-station-id",
            userData.staff._kf_Station
          );

          setForwardData({
            nameFull: userData.user.Name_Full,
            userId: userData.user.__kp_User,
            staffId: userData.staff.userID,
            staffKf: userData.staff.__kp_Staff,
            stationId: userData.staff._kf_Station,
          });

          setUserDataPreloaded(true);

          dispatch(UserActions.setUserData(userData));
        }
      })
      .catch((error) => console.log(error));
  };

  const checkBiometric = async () => {
    const compatible =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());
    if (compatible) {
      authenticateUser();
    } else {
      console.log("not compatible");
    }
  };

  const handleNavigation = (location, data) => {
    navigation.navigate(location, { data });
  };

  const authenticateUser = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with biometrics or PIN",
        fallbackLabel: "Enter PIN", // This is the label shown if PIN is available
      });
      if (result.success) {
        setAuthenticated(true);
        finalizeLogin();
      } else {
        setAuthenticated(false);
      }
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const finalizeLogin = async () => {
    await preLoadUserData();
  };

  const validateInputs = (inputData) => {
    let name = inputData.name.replace(/\s+/g, " ").trim();
    let pwd = inputData.pwd.replace(/\s+/g, " ").trim();

    let regexName = /^[a-zA-Z0-9_-]+$/;
    let regexPwd = /^.{3,}$/;

    setErrorName(!regexName.test(name));
    setErrorPwd(!regexPwd.test(pwd));

    return regexName.test(name) && regexPwd.test(pwd);
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleHidepwd = () => {
    setPwdVisible(!pwdVisible);
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

    if (isFocused) {
      if (loginState.response !== null) {
        if (loginState.response.status === "success") {
          setAuthenticated(true);
          finalizeLogin();
        }
      }

      if (loginState.error) {
        let loginError = loginState.error;
        let errMsg = loginError?.message;
        let BAD_REQUEST = "400";
        let SERVER_ERROR = "500";
        let NOT_FOUND = "404";

        if (errMsg.includes(BAD_REQUEST)) {
          displayToast("Login failed, invalid credentials");
        } else if (errMsg.includes(SERVER_ERROR)) {
          displayToast("Login failed, server error");
        } else if (errMsg.includes(NOT_FOUND)) {
          displayToast("Login failed, network error");
        } else {
          displayToast("Something went wrong, contact support");
        }

        dispatch(loginActions.resetLoginState());
      }
    }
  }, [loginState.loading]);

  useEffect(() => {
    if (userDataPreloaded) {
      if (forwardData.nameFull) {
        handleNavigation("Homepage", forwardData);
      }
    }
  }, [userDataPreloaded]);

  useFocusEffect(
    React.useCallback(() => {
      const validatedPreviousLogin = async () => {
        const userData = await tokenDecoder();
        if (userData) {
          checkBiometric();
        } else {
          console.log("no previous user data");
        }
      };

      const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          displayToast("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});

        dispatch(UserActions.setUserLocation(location));
      };

      const wipeData = async (tableName, type) => {
        if (type === "drop") {
          dropTableAsync({ tableName })
            .then((result) => console.log("reset: ", result))
            .catch((error) => console.log(error));
        } else if (type === "clean") {
          deleteDBdataAsync({
            tableName,
            id: 1,
            customQuery: `SELECT * FROM ${tableName};`,
          })
            .then((result) => {
              console.log(result);
            })
            .catch((err) => console.log(err));
        }
      };

      validatedPreviousLogin();
      getLocation();

      //////////////////////// RESETTING THE APP DATABASE - FOR DEVELOPMENT PURPOSES ONLY ///////////////////////
      // wipeData("rtc_inspections", "clean");
      //////////////////////////////// CAUTION //////////////////////////////////////////////////////////////////

      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            uname: "",
            password: "",
          });
        }

        setErrorName(false);
        setErrorPwd(false);
        setForwardData({ nameFull: false });
        setAuthenticated(false);
        setUserDataPreloaded(false);
        dispatch(loginActions.resetLoginState());
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      on
    >
      <StatusBar style={isKeyboardActive ? "dark" : "light"} />

      {/* loader */}
      {indicatorVisible && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.07,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99,
          }}
        >
          <View
            style={{
              width: "auto",
              backgroundColor: "white",
              borderRadius: screenHeight * 0.5,
              elevation: 4,
            }}
          >
            <LottieView
              style={{
                height: screenHeight * 0.05,
                width: screenHeight * 0.05,
                alignSelf: "center",
              }}
              source={require("../assets/lottie/spinner.json")}
              autoPlay
              speed={1}
              loop={true}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

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
                  innerRef={formRef}
                  onSubmit={async (values) => {
                    if (
                      validateInputs({
                        name: values.uname,
                        pwd: values.password,
                      })
                    ) {
                      dispatch(
                        login({
                          Name_User: values.uname,
                          password: values.password,
                        })
                      );
                    }
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
                          returnKeyType="next"
                          onSubmitEditing={() => {
                            pwdInput.current.focus();
                          }}
                          blurOnSubmit={false}
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
                              color: colors.secondary,
                            }}
                          >
                            *Invalid user name
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
                        <View>
                          <TextInput
                            placeholder="********"
                            secureTextEntry={!pwdVisible}
                            ref={pwdInput}
                            returnKeyType="done"
                            placeholderTextColor={colors.black_a}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            value={values.password}
                            style={{
                              borderBottomColor: colors.black_a,
                              borderBottomWidth: 1.5,
                            }}
                          />
                          <TouchableOpacity
                            onPress={handleHidepwd}
                            style={{
                              position: "absolute",
                              marginLeft: screenWidth * 0.75,
                            }}
                          >
                            {pwdVisible ? (
                              <Ionicons
                                name="eye-off"
                                size={24}
                                color="black"
                              />
                            ) : (
                              <AntDesign name="eye" size={24} color="black" />
                            )}
                          </TouchableOpacity>
                        </View>

                        {errorPwd && (
                          <Text
                            style={{
                              fontWeight: "regular",
                              fontSize: screenWidth * 0.035,
                              color: colors.secondary,
                            }}
                          >
                            *Invalid password
                          </Text>
                        )}
                      </View>

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
