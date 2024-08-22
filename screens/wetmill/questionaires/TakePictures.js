import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import Feather from "@expo/vector-icons/Feather";
import { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import SimpleIconButton from "../../../components/SimpleIconButton";
import Entypo from "@expo/vector-icons/Entypo";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "@expo/vector-icons/AntDesign";

export const TakePictures = ({ stationName, setNextModal, setAudit }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const androidVersion =
    Platform.OS === "android" ? Platform.Version : "Not Android";

  const [images, setImages] = useState([]);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [errors, setErrors] = useState({}); // validation errors
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });

  const openCamera = async () => {
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
      saveImage(result.assets[0].uri);
    }
  };

  const saveImage = async (uri) => {
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
      setImages([...images, fileUri]);

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

  const handlePress = (uri) => {
    const filteredImages = images.filter((imageUri) => imageUri !== uri);
    setImages(filteredImages);
  };

  const handleSubmit = () => {
    setAudit((prevState) => ({ ...prevState, ...{ siteImages: images } }));
    setNextModal(true);
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
        Take four pictures
      </Text>
      <View
        style={{
          width: "100%",
          height: 2,
          backgroundColor: colors.secondary_variant,
        }}
      />
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
            paddingVertical: screenHeight * 0.02,
            gap: screenHeight * 0.01,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: screenWidth * 0.03,
              marginVertical: screenHeight * 0.01,
            }}
          >
            {images.length > 0 ? (
              images.map((imageUri, index) => (
                <View
                  key={imageUri}
                  style={{
                    padding: screenWidth * 0.015,
                    backgroundColor: "white",
                    borderRadius: screenHeight * 0.01,
                    elevation: 3,
                  }}
                >
                  <View
                    style={{
                      position: "absolute",
                      top: -screenHeight * 0.01,
                      left: screenWidth * 0.28,
                      zIndex: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handlePress(imageUri)}
                      style={{
                        backgroundColor: "white",
                        borderRadius: 100,
                        padding: screenHeight * 0.003,
                        elevation: 4,
                      }}
                    >
                      <AntDesign
                        name="closecircleo"
                        size={screenHeight * 0.03}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                  <Image
                    key={index}
                    source={{ uri: imageUri }}
                    style={{
                      width: screenHeight * 0.15,
                      height: screenHeight * 0.15,
                    }}
                  />
                </View>
              ))
            ) : (
              <Text>No pictures taken yet</Text>
            )}
          </View>
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
              active={images.length < 4}
              mv={screenHeight * 0.01}
              handlePress={openCamera}
              icon={<Entypo name="camera" size={24} color="white" />}
            />
            <SimpleIconButton
              label={"Gallery"}
              width="38%"
              color={colors.black}
              labelColor="white"
              active={images.length < 4}
              mv={screenHeight * 0.01}
              handlePress={pickImage}
              icon={
                <MaterialIcons name="photo-library" size={24} color="white" />
              }
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: screenHeight * 0.01,
              marginBottom: screenHeight * 0.02,
            }}
          >
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
                Having trouble taking images by opening the camera? you can take
                the pictures before starting the audit and then select from the
                gallery when on this stage
              </Text>
            </View>
          </View>

          <SimpleIconButton
            label={"Save"}
            width="100%"
            color={colors.secondary}
            labelColor="white"
            active={images.length == 4}
            handlePress={handleSubmit}
            icon={<Feather name="save" size={24} color="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
};
