import { useEffect, useState } from "react";
import {
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  View,
  Animated,
  Easing,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { colors } from "../data/colors";
import { globalStyles } from "../data/globalStyles";
import { SheetItem } from "./SheetItem";
import { useSelector } from "react-redux";

export const AttendanceSheetModal = ({
  setModal,
  setSelectedImage,
  setToast,
}) => {
  const [initClose, setInitClose] = useState(false);
  const [heightRatio, setHeightRatio] = useState(0.4);
  const userId = useSelector((state) => state.user.userData.staff.userID);

  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const modalHeight = screenHeight * 0.5;
  const animation = new Animated.Value(0);
  const androidVersion =
    Platform.OS === "android" ? Platform.Version : "Not Android";

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

  const generateFileName = () => {
    const timestamp = Math.floor(Date.now() / 1000);
    return `${userId}-${timestamp}`;
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
      setSelectedImage(fileNameFull);
      setToast("Image saved");
      console.log("Image saved to:", fileUri);

      // Now you can use fileUri to submit to your backend or do anything else with it
    } catch (error) {
      setToast("Error: Image not uploaded");
      console.error("Error saving image:", error);
    }
  };

  const getFileExtension = async (uri) => {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    const uriParts = fileInfo.uri.split(".");
    return uriParts[uriParts.length - 1];
  };

  const handleClick = () => {
    setInitClose(true);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [initClose ? 0 : modalHeight, initClose ? modalHeight : 0],
  });

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      easing: initClose ? Easing.linear : Easing.back(),
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      if (initClose) setModal(false);
    });
  }, [initClose]);

  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View
        style={{
          flex: 1,
          position: "absolute",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          backgroundColor: colors.black_a,
          //   padding: 10,
          zIndex: 10,
        }}
      >
        <Animated.View
          style={[
            globalStyles.attendanceSheetModalStyles,
            { transform: [{ translateY }] },
          ]}
        >
          <View
            style={{ justifyContent: "center", alignItems: "center", gap: 20 }}
          >
            <View
              style={{
                backgroundColor: colors.secondary,
                height: 6,
                width: 85,
                borderRadius: 20,
              }}
            />
            <Text
              style={{
                fontWeight: "700",
                fontSize: 23,
                color: colors.secondary,
              }}
            >
              Add attendance sheets
            </Text>
          </View>

          <View style={{ flex: 1, gap: 16, width: "90%" }}>
            <SheetItem
              setModal={setModal}
              destination={null}
              label={"Take photo"}
              Fn={openCamera}
              supportedVersion={androidVersion >= 34}
            />
            <SheetItem
              setModal={setModal}
              destination={null}
              label={"Choose from gallery"}
              Fn={pickImage}
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
                  Taking photo might not work on this device due to the platform
                  version, it is recommended to choose the image from the
                  gallery.
                </Text>
              </View>
            </>
          ) : (
            <View
              style={{
                height: screenHeight * 0.04,
              }}
            />
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};
