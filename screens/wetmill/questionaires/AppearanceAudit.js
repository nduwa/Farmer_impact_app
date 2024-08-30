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
import Feather from "@expo/vector-icons/Feather";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import SimpleIconButton from "../../../components/SimpleIconButton";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { appearanceSchema } from "../../../validation/wetmillAuditSchema";
import { useFocusEffect } from "@react-navigation/native";

export const AppearanceAudit = ({ responses, setNextModal, setAudit }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState({
    water_sufficient_photo: null,
    water_quality_photo: null,
  });
  const [choiceQuality, setChoiceQuality] = useState(
    responses.water_quality === "yes" ? true : false
  );
  const [choiceSuffiency, setChoiceSuffiency] = useState(
    responses.water_suffient === "yes" ? true : false
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
      if (use === "quality") {
        setSelectedImage((prevState) => ({
          ...prevState,
          water_quality_photo: fileUri,
        }));
      } else if (use === "suffient") {
        setSelectedImage((prevState) => ({
          ...prevState,
          water_sufficient_photo: fileUri,
        }));
      }

      displayToast("Image saved");
      console.log("Image saved to:", fileUri);

      // Now you can use fileUri to submit to your backend or do anything else with it
    } catch (error) {
      displayToast("Error: Image not uploaded");
      console.error("Error saving image:", error);
    }
  };

  const pickImage = async (use = "") => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      saveImage(result.assets[0].uri, use);
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

    setErrors(newErrors);
    return false;
  };

  const submitForm = (values) => {
    try {
      let appearanceObj = {
        ...values,
        ...{
          water_quality: choiceQuality ? "yes" : "no",
          water_suffient: choiceSuffiency ? "yes" : "no",
          water_quality_photo:
            responses.water_quality_photo || selectedImage.water_quality_photo,
          water_suffient_photo:
            responses.water_suffient_photo ||
            selectedImage.water_sufficient_photo,
        },
      };

      if (!validateForm(appearanceObj, appearanceSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...appearanceObj }));
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
      setSelectedImage({
        water_quality_photo: responses.water_quality_photo || null,
        water_sufficient_photo: responses.water_suffient_photo || null,
      });
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            water_quality_comment: responses.water_quality_comment || "",
            water_suffient_comment: responses.water_suffient_comment || "",
          });
          setChoiceQuality(responses.water_quality === "yes" ? true : false);
          setChoiceSuffiency(responses.water_suffient === "yes" ? true : false);
          setSelectedImage({
            water_quality_photo: responses.water_quality_photo || null,
            water_sufficient_photo: responses.water_suffient_photo || null,
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
        Appearance
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
          water_quality_comment: "",
          water_suffient_comment: "",
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
                    Is the quality of water acceptable?
                  </Text>

                  <RadioButtonGroup
                    containerStyle={{
                      marginLeft: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                    selected={choiceQuality}
                    onSelected={(value) => setChoiceQuality(value)}
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
                  handleChange={handleChange("water_quality_comment")}
                  handleBlur={handleBlur("water_quality_comment")}
                  label={"Comments"}
                  value={
                    responses.water_quality_comment ||
                    values.water_quality_comment
                  }
                  active={true}
                  multiline={true}
                  error={
                    errors.water_quality_comment === "water_quality_comment"
                  }
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
                    color={
                      selectedImage.water_quality_photo
                        ? colors.green
                        : colors.blue_font
                    }
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => openCamera("quality")}
                    icon={<Entypo name="camera" size={24} color="white" />}
                  />
                  <SimpleIconButton
                    label={"Gallery"}
                    width="38%"
                    color={
                      selectedImage.water_quality_photo
                        ? colors.green
                        : colors.black
                    }
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => pickImage("quality")}
                    icon={
                      <MaterialIcons
                        name="photo-library"
                        size={24}
                        color="white"
                      />
                    }
                  />
                </View>
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
                    Is the amount of water sufficient?
                  </Text>

                  <RadioButtonGroup
                    containerStyle={{
                      marginLeft: 10,
                      marginBottom: 10,
                      gap: 5,
                    }}
                    selected={choiceSuffiency}
                    onSelected={(value) => setChoiceSuffiency(value)}
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
                  handleChange={handleChange("water_suffient_comment")}
                  handleBlur={handleBlur("water_suffient_comment")}
                  label={"Comments"}
                  value={
                    responses.water_quality_comment ||
                    values.water_suffient_comment
                  }
                  active={true}
                  multiline={true}
                  error={
                    errors.water_suffient_comment === "water_suffient_comment"
                  }
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
                    color={
                      selectedImage.water_sufficient_photo
                        ? colors.green
                        : colors.blue_font
                    }
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => openCamera("suffient")}
                    icon={<Entypo name="camera" size={24} color="white" />}
                  />
                  <SimpleIconButton
                    label={"Gallery"}
                    width="38%"
                    color={
                      selectedImage.water_sufficient_photo
                        ? colors.green
                        : colors.black
                    }
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => pickImage("suffient")}
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

              {/* validation error */}
              {validationError.message && (
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white_variant,
                    elevation: 2,
                    borderWidth: 0.7,
                    borderColor: "red",
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
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
            </ScrollView>
          </View>
        )}
      </Formik>
    </View>
  );
};
