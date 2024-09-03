import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import Entypo from "@expo/vector-icons/Entypo";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import React, { useEffect, useRef, useState } from "react";
import { Formik } from "formik";
import { FontAwesome6 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import SimpleIconButton from "../../../components/SimpleIconButton";
import Feather from "@expo/vector-icons/Feather";
import { conclusionSchema } from "../../../validation/wetmillAuditSchema";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect } from "@react-navigation/native";

export const ConclusionAudit = ({
  setNextModal,
  setChoice,
  choice,
  setModalOpen,
  setAudit,
  responses,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const formRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState({
    drying_congestion_photo1: null,
    drying_congestion_photo2: null,
  });
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
      if (use === "1") {
        setSelectedImage((prevState) => ({
          ...prevState,
          drying_congestion_photo1: fileUri,
        }));
      } else if (use === "2") {
        setSelectedImage((prevState) => ({
          ...prevState,
          drying_congestion_photo2: fileUri,
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
      let conclObj = {
        ...values,
        ...{
          drying_congestion: responses.drying_congestion || choice.name,
          drying_congestion_photo1:
            responses.drying_congestion_photo1 ||
            selectedImage.drying_congestion_photo1,
          drying_congestion_photo2:
            responses.drying_congestion_photo2 ||
            selectedImage.drying_congestion_photo2,
        },
      };

      if (!validateForm(conclObj, conclusionSchema)) return;

      setAudit((prevState) => ({ ...prevState, ...conclObj }));
      setNextModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const getInputLabel = (input) => {
    let output = "";

    if (input === "drying_congestion_comment")
      output = "comments on the drying tables congestion";
    if (input === "drying_congestion_comment2") output = "other notes";

    return output;
  };

  useEffect(() => {
    let i = 0;
    if (Object.keys(errors).length > 0) {
      if (Object.keys(errors)[i] === "drying_congestion_photo1") {
        setValidationError({
          type: "emptyOrInvalidData",
          message: `Not enough photos provided for drying tables congestion`,
          inputBox: null,
        });
        i++;
      } else if (Object.keys(errors)[i] === "drying_congestion_photo2") {
        setValidationError({
          type: "emptyOrInvalidData",
          message: `Not enough photos provided for drying tables congestion`,
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
      setChoice(responses.drying_congestion || null);
      setSelectedImage({
        drying_congestion_photo1: responses.drying_congestion_photo1 || null,
        drying_congestion_photo2: responses.drying_congestion_photo2 || null,
      });
      return () => {
        if (formRef.current) {
          formRef.current.setValues({
            drying_congestion: responses.drying_congestion || "",
            drying_congestion_comment:
              responses.drying_congestion_comment || "",
            drying_congestion_comment2:
              responses.drying_congestion_comment2 || "",
          });
          setChoice(responses.drying_congestion || null);
          setSelectedImage({
            drying_congestion_photo1:
              responses.drying_congestion_photo1 || null,
            drying_congestion_photo2:
              responses.drying_congestion_photo2 || null,
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
        Conclusion
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
          drying_congestion: responses.drying_congestion || "",
          drying_congestion_comment: responses.drying_congestion_comment || "",
          drying_congestion_comment2:
            responses.drying_congestion_comment2 || "",
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
              height: "94%",
              width: screenWidth,
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
              <View>
                <BuyCoffeeInput
                  values={values}
                  handleChange={handleChange("drying_congestion")}
                  handleBlur={handleBlur("drying_congestion")}
                  label={"How much congestion is on the drying tables?"}
                  value={responses.drying_congestion || choice?.name}
                  error={errors.drying_congestion}
                  active={false}
                />
                <TouchableOpacity
                  onPress={() => setModalOpen(true)}
                  style={{
                    position: "absolute",
                    left: screenWidth * 0.775,
                    top: screenHeight * 0.045,
                    backgroundColor: "white",
                    borderRadius: screenWidth * 0.009,
                    padding: screenHeight * 0.007,
                    elevation: 3,
                  }}
                >
                  <FontAwesome6
                    name="expand"
                    size={screenWidth * 0.05}
                    color="black"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setFieldValue("drying_congestion", "");
                    setChoice(null);
                  }}
                  style={{
                    position: "absolute",
                    left: screenWidth * 0.68,
                    top: screenHeight * 0.045,
                    backgroundColor: "white",
                    borderRadius: screenWidth * 0.009,
                    padding: screenHeight * 0.007,
                    elevation: 3,
                  }}
                >
                  <MaterialIcons
                    name="clear"
                    size={screenWidth * 0.05}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
              <BuyCoffeeInput
                values={values}
                handleChange={handleChange("drying_congestion_comment")}
                handleBlur={handleBlur("drying_congestion_comment")}
                label={"Comments"}
                value={values.drying_congestion_comment}
                active={true}
                error={errors.drying_congestion_comment}
              />
              <Text
                style={{
                  fontSize: screenWidth * 0.04,
                  marginLeft: screenWidth * 0.02,
                }}
              >
                Please take a good photo, which shows strengths.
              </Text>
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
                    selectedImage.drying_congestion_photo1
                      ? colors.green
                      : colors.blue_font
                  }
                  labelColor="white"
                  active={true}
                  mv={screenHeight * 0.01}
                  handlePress={() => openCamera("1")}
                  icon={<Entypo name="camera" size={24} color="white" />}
                />
                <SimpleIconButton
                  label={"Gallery"}
                  width="38%"
                  color={
                    selectedImage.drying_congestion_photo1
                      ? colors.green
                      : colors.black
                  }
                  labelColor="white"
                  active={true}
                  mv={screenHeight * 0.01}
                  handlePress={() => pickImage("1")}
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
                handleChange={handleChange("drying_congestion_comment2")}
                handleBlur={handleBlur("drying_congestion_comment2")}
                label={"Do you have any other notes?"}
                value={values.drying_congestion_comment2}
                active={true}
                error={errors.drying_congestion_comment2}
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
                    selectedImage.drying_congestion_photo2
                      ? colors.green
                      : colors.blue_font
                  }
                  labelColor="white"
                  active={true}
                  mv={screenHeight * 0.01}
                  handlePress={() => openCamera("2")}
                  icon={<Entypo name="camera" size={24} color="white" />}
                />
                <SimpleIconButton
                  label={"Gallery"}
                  width="38%"
                  color={
                    selectedImage.drying_congestion_photo2
                      ? colors.green
                      : colors.black
                  }
                  labelColor="white"
                  active={true}
                  mv={screenHeight * 0.01}
                  handlePress={() => pickImage("2")}
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
          </View>
        )}
      </Formik>
    </View>
  );
};
