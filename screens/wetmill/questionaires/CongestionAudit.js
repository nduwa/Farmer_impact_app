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
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import Feather from "@expo/vector-icons/Feather";
import SimpleIconButton from "../../../components/SimpleIconButton";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { congestionSchema } from "../../../validation/wetmillAuditSchema";
import { useFocusEffect } from "@react-navigation/native";

export const CongestionAudit = ({ stationName, setNextModal, setAudit }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState({
    smell_photo: null,
    appearance_photo: null,
  });
  const [loading, setLoading] = useState(false);
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
      if (use === "smell") {
        setSelectedImage((prevState) => ({
          ...prevState,
          smell_photo: fileUri,
        }));
      } else if (use === "appearance") {
        setSelectedImage((prevState) => ({
          ...prevState,
          appearance_photo: fileUri,
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
    console.log(newErrors);
    setErrors(newErrors);
    return false;
  };

  const submitForm = (values) => {
    try {
      let congestionObj = {
        ...values,
        ...{
          color_smell_tanks_photo: selectedImage.smell_photo,
          parchment_appearance_photo: selectedImage.appearance_photo,
        },
      };

      if (!validateForm(congestionObj, congestionSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...congestionObj }));
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
            color_smell_tanks: "",
            parchment_appearance: "",
          });
          setSelectedImage({
            smell_photo: null,
            appearance_photo: null,
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
        Congestion
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
          color_smell_tanks: "",
          parchment_appearance: "",
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
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("color_smell_tanks")}
                  handleBlur={handleBlur("color_smell_tanks")}
                  label={
                    "How would you describe the color and smell of the coffee in the tanks?"
                  }
                  value={values.color_smell_tanks}
                  active={true}
                  error={errors.color_smell_tanks === "color_smell_tanks"}
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
                    color={colors.blue_font}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => openCamera("smell")}
                    icon={<Entypo name="camera" size={24} color="white" />}
                  />
                  <SimpleIconButton
                    label={"Gallery"}
                    width="38%"
                    color={colors.black}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => pickImage("smell")}
                    icon={
                      <MaterialIcons
                        name="photo-library"
                        size={24}
                        color="white"
                      />
                    }
                  />
                </View>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("parchment_appearance")}
                  handleBlur={handleBlur("parchment_appearance")}
                  label={"What is the general appearance of the parchment?"}
                  value={values.parchment_appearance}
                  active={true}
                  error={errors.parchment_appearance === "parchment_appearance"}
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
                    color={colors.blue_font}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => openCamera("appearance")}
                    icon={<Entypo name="camera" size={24} color="white" />}
                  />
                  <SimpleIconButton
                    label={"Gallery"}
                    width="38%"
                    color={colors.black}
                    labelColor="white"
                    active={true}
                    mv={screenHeight * 0.01}
                    handlePress={() => pickImage("appearance")}
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
