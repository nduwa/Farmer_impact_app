import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import SimpleIconButton from "../../../components/SimpleIconButton";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { QalQatSchema } from "../../../validation/wetmillAuditSchema";
import { useFocusEffect } from "@react-navigation/native";

export const QualityQuantityAudit = ({ responses, setNextModal, setAudit }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState(responses.leftover_photo);
  const [choice, setChoice] = useState(
    responses.leftover_beans === "yes" ? true : false
  );
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errors, setErrors] = useState({}); // validation errors
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const androidVersion =
    Platform.OS === "android" ? Platform.Version : "Not Android";

  const openCamera = async (use = "") => {
    if (Platform.OS !== "web") {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
        return;
      }
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // If you want to enable image editing
      aspect: [1, 1.414],
      quality: 1, // Image quality (0 to 1)
    });

    if (!result.canceled) {
      saveImage(result.assets[0].uri, use);
    }
  };

  const saveImage = async (uri, use = "") => {
    try {
      const fileExt = await getFileExtension(uri);
      const fileName = generateFileName();
      const fileNameFull = `${fileName}.${fileExt}`; // You can customize the file name and extension here
      const directory = FileSystem.documentDirectory;
      const fileUri = `${directory}${fileNameFull}`;

      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Image saved successfully
      setSelectedImage(fileUri);

      displayToast("Image saved");
      console.log("Image saved to:", fileUri);

      // Now you can use fileUri to submit to your backend or do anything else with it
    } catch (error) {
      displayToast("Error: Image not uploaded");
      console.error("Error saving image:", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      saveImage(result.assets[0].uri);
    }
  };

  const getFileExtension = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const uriParts = fileInfo.uri.split(".");
    return uriParts[uriParts.length - 1];
  };

  const generateFileName = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    return `wetmillaudit-${timestamp}`;
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const validateForm = (data, schema) => {
    const { error } = schema.validate(data, { abortEarly: false });
    if (!error) {
      setErrors({});
      setValidationError({
        type: null,
        message: null,
        inputBox: null,
      });

      return true;
    }

    const newErrors = {};
    error.details.forEach((detail) => {
      newErrors[detail.path[0]] = detail.message;
    });

    console.log(newErrors);
    setErrors(newErrors);
    return false;
  };

  const submitForm = (values) => {
    try {
      let qalQatObj = {
        ...values,
        ...{
          leftover_beans: choice ? "yes" : "no",
          leftover_photo: responses.leftover_photo || selectedImage,
        },
      };

      if (!validateForm(qalQatObj, QalQatSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...qalQatObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "cheeries_books") output = "Cherries reported in books";
    if (input === "discrepancy_reason_cherries") output = "Discrepancy reason";

    return output;
  };

  useEffect(() => {
    let i = 0;
    if (Object.keys(errors).length > 0) {
      if (Object.keys(errors)[i] === "leftover_photo") {
        setValidationError({
          type: "emptyOrInvalidData",
          message: `No photo provided for Beans left over`,
          inputBox: null,
        });
        i++;
      } else {
        setValidationError({
          type: "emptyOrInvalidData",
          message: `Invalid input at '${getInputLabel(
            Object.keys(errors)[0]
          )}', also check for any other highlighted input box`,
          inputBox: null,
        });
      }
    }
  }, [errors]);

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
        setSelectedImage(null);
        if (formRef.current) {
          formRef.current.setValues({
            leftover_comment: responses.leftover_comment || "",
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
        elevation: 5,
      }}
    >
      <Text
        style={{
          fontSize: screenHeight * 0.022,
          fontWeight: "600",
          marginVertical: screenHeight * 0.01,
        }}
      >
        Quality Quantity
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
          leftover_beans: choice ? "yes" : "no",
          leftover_comment: responses.leftover_comment || "",
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
                <View
                  style={{
                    gap: screenHeight * 0.015,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "400",
                      fontSize: screenWidth * 0.04,
                      color: colors.black,
                      marginLeft: screenWidth * 0.02,
                    }}
                  >
                    Are there any leftover beans in the machine?
                  </Text>

                  <RadioButtonGroup
                    containerStyle={{
                      marginLeft: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                    selected={choice}
                    onSelected={(value) => setChoice(value)}
                    radioBackground={colors.secondary}
                  >
                    <RadioButtonItem
                      value={true}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Yes
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value={false}
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          No
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("leftover_comment")}
                  handleBlur={handleBlur("leftover_comment")}
                  label={"Describe what is left"}
                  value={responses.leftover_comment || values.leftover_comment}
                  active={true}
                  multiline={true}
                  error={errors.leftover_comment}
                />
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <SimpleIconButton
                    label={"Take picture"}
                    width="60%"
                    color={selectedImage ? colors.green : colors.blue_font}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={openCamera}
                    icon={<Entypo name="camera" size={24} color="white" />}
                  />
                  <SimpleIconButton
                    label={"Gallery"}
                    width="38%"
                    color={selectedImage ? colors.green : colors.black}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={pickImage}
                    icon={
                      <MaterialIcons
                        name="photo-library"
                        size={24}
                        color="white"
                      />
                    }
                  />
                </View>

                {androidVersion < 34 ? (
                  <>
                    <View
                      style={{
                        width: screenWidth * 0.3,
                        height: screenHeight * 0.002,
                        backgroundColor: colors.secondary,
                      }}
                    />
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: colors.black_letter,
                        }}
                      >
                        Taking photo might not work on this device due to the
                        platform version, it is recommended to choose the image
                        from the gallery.
                      </Text>
                    </View>
                  </>
                ) : (
                  <View
                    style={{
                      height: screenHeight * 0.01,
                    }}
                  />
                )}

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
