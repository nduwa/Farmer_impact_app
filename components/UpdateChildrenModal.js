import { Formik } from "formik";
import {
  Dimensions,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../data/colors";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";

export const UpdateChildrenModal = ({ data, setModal }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [error, setError] = useState(false);

  const validateInputs = (input) => {
    if (input.numberChildren === "" || !input.numberChildren) {
      setError(true);
      ToastAndroid.show("Invalid input", ToastAndroid.SHORT);
      return false;
    }

    return true;
  };

  const handleProceed = (formValues) => {
    setError(false);
    if (validateInputs(formValues)) {
      setModal((prevState) => ({
        ...prevState,
        open: false,
      }));
      ToastAndroid.show("Children updated", ToastAndroid.SHORT);
    }
  };
  const handleClose = () => {
    setModal((prevState) => ({
      ...prevState,
      open: false,
    }));
  };
  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        padding: screenHeight * 0.005,
        backgroundColor: colors.black_a,
        zIndex: 11,
      }}
    >
      <View
        style={{
          width: "75%",
          alignItems: "center",
          borderRadius: 15,
          backgroundColor: colors.white,
          padding: screenHeight * 0.012,
          gap: screenHeight * 0.02,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text
            style={{
              fontWeight: "600",
              textAlign: "center",
              fontSize: screenWidth * 0.04,
              marginVertical: screenHeight * 0.001,
            }}
          >
            {data.farmerName}
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Entypo name="circle-with-cross" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: screenHeight * 0.02 }}>
          Please specify the number of children below 18 years to be registered
        </Text>
        <Formik
          initialValues={{
            numberChildren: "",
          }}
          onSubmit={async (values) => {
            handleProceed(values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
          }) => (
            <View
              style={{
                flexDirection: "row",
                gap: screenWidth * 0.02,
                alignItems: "center",
                width: "100%",
              }}
            >
              <TextInput
                placeholderTextColor={colors.black_a}
                placeholder="Number of children"
                onBlur={handleBlur("numberChildren")}
                onChangeText={handleChange("numberChildren")}
                value={values.numberChildren}
                style={{
                  backgroundColor: colors.white_variant,
                  padding: screenWidth * 0.01,
                  fontWeight: "400",
                  fontSize: screenWidth * 0.04,
                  color: colors.blue_font,
                  borderRadius: screenHeight * 0.01,
                  width: "60%",
                  borderWidth: error ? 1 : 0.3,
                  borderColor: error ? "red" : colors.bg_variant_font,
                }}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  paddingVertical: screenHeight * 0.009,
                  paddingHorizontal: screenWidth * 0.05,
                  backgroundColor: colors.secondary,
                  borderRadius: screenHeight * 0.01,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: screenWidth * 0.04,
                    fontWeight: "700",
                  }}
                >
                  Proceed
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
