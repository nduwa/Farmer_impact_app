import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Keyboard,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../../components/BuyCoffeeInput";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomButton from "../../../components/CustomButton";
import { FarmerTressSchema } from "../../../validation/FarmerTreesSchema";
import LottieView from "lottie-react-native";
import { updateDBdataAsync } from "../../../helpers/updateDBdataAsync";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../../components/SyncModal";

export const EditTreesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const { data } = route.params;

  const [errors, setErrors] = useState({}); // validation errors
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("PendingTreesScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const submitTreesDetails = (formData) => {
    try {
      let submitData = {
        _kf_Staff: data.farmerData._kf_Staff,
        _kf_User: data.farmerData._kf_User,
        Group_ID: data.farmerData.Group_ID,
        farmer_ID: data.farmerData.farmer_ID,
        farmer_name: data.farmerData.farmer_name,
        national_ID: data.farmerData.national_ID,
        full_name: data.farmerData.full_name,
        created_at: data.farmerData.created_at,
        received_seedling: formData.nmbrReceivedSeedlings,
        survived_seedling: formData.nmbrSurvivedSeedlings,
        planted_year: formData.yearPlantedReceivedSeedlings,
        old_trees: formData.nmbrOldTrees,
        old_trees_planted_year: formData.yearPlantedOldTrees,
        coffee_plot: formData.nmbrCoffeeFarms,
        nitrogen: formData.totalNitrogenFixingShadeTrees,
        natural_shade: formData.totalNaturalShadeTrees,
        shade_trees: formData.totalNbrShadeTrees,
      };

      if (!validateInputs(submitData, FarmerTressSchema)) return;

      let updateQuery = `UPDATE rtc_household_trees SET received_seedling = '${submitData.received_seedling}', survived_seedling='${submitData.survived_seedling}', planted_year='${submitData.planted_year}', old_trees='${submitData.old_trees}',old_trees_planted_year='${submitData.old_trees_planted_year}', coffee_plot = '${submitData.coffee_plot}', nitrogen = '${submitData.nitrogen}', natural_shade = '${submitData.natural_shade}',shade_trees = '${submitData.shade_trees}' WHERE id = '${data.farmerData.id}' `;

      updateDBdataAsync({ id: data.farmerData.id, query: updateQuery })
        .then((result) => {
          if (result.success) {
            setCurrentJob("trees details updated");
          } else {
            setCurrentJob("Failed to update trees details");
          }
        })
        .catch((error) => {
          setCurrentJob("Failed to update trees details");
          console.log("Failed to update trees details: ", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const validateInputs = (data, schema) => {
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

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    if (input === "received_seedling") output = "received seedlings";
    if (input === "survived_seedling") output = "Survived seedlings";
    if (input === "planted_year")
      output = "Year planted of the received seedlings";
    if (input === "old_trees") output = "Old trees";
    if (input === "old_trees_planted_year") output = "Year of the old trees";
    if (input === "coffee_plot") output = "Number of coffee plots";
    if (input === "nitrogen") output = "Total of nitrogen  fixing shade trees";
    if (input === "natural_shade") output = "Total of natural shade";
    if (input === "shade_trees") output = "Total number of shade trees";

    return output;
  };

  const handleDelete = () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_household_trees",
      targetId: id,
      customQuery: `DELETE FROM rtc_household_trees WHERE id = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          displayToast("record deleted");
          setCurrentJob("record deleted");
        } else {
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input in '${getInputLabel(
          Object.keys(errors)[0]
        )}', check the inputs highlighted in red`,
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (currentJob === "trees details updated") {
      displayToast("Tree Details updated, pending upload");
      setLoading(false);
      setFormSubmitted(true);
    } else if (currentJob === "Failed to update trees details") {
      displayToast("Failed to update trees details");
      setLoading(false);
    } else if (currentJob === "record deleted") {
      displayToast("Trees Details deleted");
      navigation.navigate("PendingTreesScreen");
    }
  }, [currentJob]);

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
        setLoading(false);
        setFormSubmitted(false);
        setErrors({});
      };
    }, [])
  );

  return (
    <View
      style={{
        flex: 1,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          height: screenHeight * 0.11,
          backgroundColor: colors.white,
          paddingTop: screenHeight * 0.042,
          padding: 10,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          onPress={handleBackButton}
          style={{
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "transparent",
            padding: screenWidth * 0.005,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: 19,
          }}
        >
          Update Trees
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            farmerID: data.farmerData.farmer_ID,
            farmerName: data.farmerData.farmer_name,
            nationalID: data.farmerData.national_ID,
            groupID: data.farmerData.Group_ID,
            nmbrReceivedSeedlings: data.farmerData.received_seedling,
            nmbrSurvivedSeedlings: data.farmerData.survived_seedling,
            yearPlantedReceivedSeedlings: data.farmerData.planted_year,
            nmbrOldTrees: data.farmerData.old_trees,
            yearPlantedOldTrees: data.farmerData.old_trees_planted_year,
            nmbrCoffeeFarms: data.farmerData.coffee_plot,
            totalNitrogenFixingShadeTrees: data.farmerData.nitrogen,
            totalNaturalShadeTrees: data.farmerData.natural_shade,
            totalNbrShadeTrees: data.farmerData.shade_trees,
          }}
          onSubmit={async (values) => {
            submitTreesDetails(values);
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
                }}
                contentContainerStyle={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: screenHeight * 0.01,
                  paddingVertical: screenHeight * 0.005,
                }}
              >
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    marginTop: screenHeight * 0.025,
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
                    Fill the form accordingly
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerID")}
                    handleBlur={handleBlur("farmerID")}
                    label={"Farmer ID"}
                    value={values.farmerID}
                    active={false}
                    error={errors.farmer_ID === "farmer_ID"}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer name"}
                    value={values.farmerName}
                    active={false}
                    error={errors.farmer_name}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nationalID")}
                    handleBlur={handleBlur("nationalID")}
                    label={"National ID"}
                    value={values.nationalID}
                    active={false}
                    error={errors.national_ID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("groupID")}
                    handleBlur={handleBlur("groupID")}
                    label={"Group ID"}
                    value={values.groupID}
                    active={false}
                    error={errors.Group_ID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrReceivedSeedlings")}
                    handleBlur={handleBlur("nmbrReceivedSeedlings")}
                    label={"Number of received seedlings"}
                    value={values.nmbrReceivedSeedlings}
                    error={errors.received_seedling}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrSurvivedSeedlings")}
                    handleBlur={handleBlur("nmbrSurvivedSeedlings")}
                    label={"Number of survived seedlings"}
                    value={values.nmbrSurvivedSeedlings}
                    error={errors.survived_seedling}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedReceivedSeedlings")}
                    handleBlur={handleBlur("yearPlantedReceivedSeedlings")}
                    label={"Year planted of the received seedlings"}
                    value={values.yearPlantedReceivedSeedlings}
                    error={errors.planted_year}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrOldTrees")}
                    handleBlur={handleBlur("nmbrOldTrees")}
                    label={"Number of old trees"}
                    value={values.nmbrOldTrees}
                    error={errors.old_trees}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("yearPlantedOldTrees")}
                    handleBlur={handleBlur("yearPlantedOldTrees")}
                    label={"Year of planted for the old trees"}
                    value={values.yearPlantedOldTrees}
                    error={errors.old_trees_planted_year}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("nmbrCoffeeFarms")}
                    handleBlur={handleBlur("nmbrCoffeeFarms")}
                    label={"Number of coffee plots/Farms in general"}
                    value={values.nmbrCoffeeFarms}
                    error={errors.coffee_plot}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNitrogenFixingShadeTrees")}
                    handleBlur={handleBlur("totalNitrogenFixingShadeTrees")}
                    label={"Total of nitrogen fixing shade trees"}
                    value={values.totalNitrogenFixingShadeTrees}
                    error={errors.nitrogen}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNaturalShadeTrees")}
                    handleBlur={handleBlur("totalNaturalShadeTrees")}
                    label={"Total of natural shade trees"}
                    value={values.totalNaturalShadeTrees}
                    error={errors.natural_shade}
                  />

                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("totalNbrShadeTrees")}
                    handleBlur={handleBlur("totalNbrShadeTrees")}
                    label={"Total number of shade trees"}
                    value={values.totalNbrShadeTrees}
                    error={errors.shade_trees}
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

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: screenWidth * 0.98,
                  }}
                >
                  <CustomButton
                    bg={colors.secondary}
                    color={"white"}
                    width="48%"
                    text="Delete"
                    bdcolor="transparent"
                    fontSizeRatio={0.043}
                    mt={screenHeight * 0.017}
                    mb={
                      isKeyboardActive
                        ? screenHeight * 0.04
                        : screenHeight * 0.03
                    }
                    radius={10}
                    disabled={formSubmitted}
                    onPress={() =>
                      setDeleteModal({
                        id: data?.farmerData?.id,
                        open: true,
                      })
                    }
                  />
                  <CustomButton
                    bg={colors.blue_font}
                    color={"white"}
                    width="48%"
                    text="Edit"
                    bdcolor="transparent"
                    fontSizeRatio={0.043}
                    mt={screenHeight * 0.017}
                    mb={
                      isKeyboardActive
                        ? screenHeight * 0.04
                        : screenHeight * 0.03
                    }
                    radius={10}
                    disabled={formSubmitted}
                    onPress={handleSubmit}
                  />
                </View>
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>

      {deleteModal.open && (
        <SyncModal
          label={"Are you sure you want to delete this record?"}
          onYes={handleDelete}
          OnNo={() =>
            setDeleteModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}

      {/* loader */}
      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.12,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
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
              source={require("../../../assets/lottie/spinner.json")}
              autoPlay
              speed={1}
              loop={true}
              resizeMode="cover"
            />
          </View>
        </View>
      )}
    </View>
  );
};
