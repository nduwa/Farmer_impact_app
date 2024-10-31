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
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { Formik } from "formik";
import { BuyCoffeeInput } from "../../components/BuyCoffeeInput";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as SecureStore from "expo-secure-store";
import { generateID } from "../../helpers/generateID";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { dataTodb } from "../../helpers/dataTodb";
import { validateTransaction } from "../../helpers/validateTransaction";
import { getCurrentDate } from "../../helpers/getCurrentDate";
import { FontAwesome5 } from "@expo/vector-icons";
import { CoffeePurchaseSchema } from "../../validation/CoffeePurchaseSchema";

export const RegisteredFarmerScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;

  const [currentCertificationType, setCurrentCertificationType] =
    useState("CP");
  const [currentCoffeeType, setCurrentCoffeeType] = useState("Cherry");
  const [date, setDate] = useState(new Date());
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [validationError, setValidationError] = useState({
    message: null,
    type: null,
    inputBox: null,
  });
  const [transValidated, setTransValidate] = useState(false);
  const [allReceipts, setAllReceipts] = useState([]);

  const [staffId, setStaffId] = useState(null);
  const [staffKf, setStaffKf] = useState(null);
  const [seasonId, setSeasonId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [stationId, setStationId] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [submitData, setSubmitData] = useState(null);
  const [farmerSeasonTransactions, setFarmerSeasonTransactions] = useState(0);
  const [farmerSeasonWeight, setFarmerSeasonWeight] = useState(0);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [farmerCertified, setFarmerCertified] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [deliveredGender, setDeliveredGender] = useState();
  const [folded, setFolded] = useState(true);
  const [errors, setErrors] = useState({}); // validation errors

  const toggleFold = () => {
    setFolded(!folded);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const navigation = useNavigation();
  const { data } = route.params;

  const handleBackButton = () => {
    navigation.navigate("FarmerScreen");
  };

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
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

  const getInputLabel = (input) => {
    let output = "";
    let tmp = input.split("_");
    output = tmp.join(" ");

    return output;
  };

  const validateInputs = (values) => {
    if (!validateForm(values, CoffeePurchaseSchema)) {
      setValidationError({
        type: "emptyOrInvalidData",
        message: "Invalid inputs detected",
        inputBox: null,
      });
      setCurrentJob("Invalid inputs detected");
      return false;
    }

    let foundReceipt = allReceipts.find(
      (item) => item.paper_receipt === values.receiptNumber
    );

    if (foundReceipt) {
      setValidationError({
        type: "duplicateReceipt",
        message: "The receipt number is already used",
        inputBox: "receiptNumber",
      });
      setCurrentJob("The receipt number is already used");
      return false;
    }

    return true;
  };

  const submitTransaction = async (transactionData) => {
    try {
      let lotnumber = generateID({ type: "lotnumber", staffId });
      let site_day_lot = generateID({ type: "site_day_lot", staffId });
      let cherry_lot_id = generateID({
        type: "cherry_lot_id",
        supplierId: supplierData[0].Supplier_ID_t,
      });
      let parchment_lot_id = generateID({
        type: "parchment_lot_id",
        supplierId: supplierData[0].Supplier_ID_t,
      });
      let bad_cherry_lot_id = generateID({
        type: "bad_cherry_lot_id",
        supplierId: supplierData[0].Supplier_ID_t,
      });
      let bad_parch_lot_id = generateID({
        type: "bad_parch_lot_id",
        supplierId: supplierData[0].Supplier_ID_t,
      });

      let formData = {
        lotnumber,
        site_day_lot,
        cherry_lot_id,
        parchment_lot_id,
        bad_cherry_lot_id,
        bad_parch_lot_id,
        created_at: getCurrentDate(transactionData.transactionDate),
        farmerid: transactionData.farmerID,
        farmername: transactionData.farmerName,
        coffee_type: transactionData.coffeeType,
        kilograms: transactionData.kgGood,
        unitprice: transactionData.priceGood,
        transaction_date: getCurrentDate(transactionData.transactionDate),
        certification: transactionData.certificationType,
        _kf_Staff: staffKf,
        _kf_Station: stationId,
        _kf_Supplier: supplierData[0].__kp_Supplier,
        uploaded: 0,
        uploaded_at: "0000-00-00",
        paper_receipt: transactionData.receiptNumber,
        certified: transactionData.certificationType === "NC" ? 0 : 1,
        edited: 0,
        cash_paid: transactionData.cashTotal,
        traceable: 1,
        total_mobile_money_payment: transactionData.cashTotalMobile,
        bad_unit_price: transactionData.priceBad,
        bad_kilograms: transactionData.kgBad,
        _kf_Season: seasonId,
      };

      let priceGood = parseFloat(formData.unitprice) || 0;
      let priceBad = parseFloat(formData.bad_unit_price) || 0;

      // if price/kg is 0, then it makes sense to set the kgs to 0
      if (priceGood < 1) formData.kilograms = 0;
      if (priceBad < 1) formData.bad_kilograms = 0;

      setSubmitData(formData);
      setValidationError({ message: null, type: null });

      if (validateInputs(transactionData)) {
        validateTransaction({
          farmerid: formData.farmerid,
          kgsBad: formData.bad_kilograms,
          kgsGood: formData.kilograms,
          currentSeasonWeight: farmerSeasonWeight,
          setValid: setTransValidate,
          setCurrentJob,
          setError: setValidationError,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log(errors);
      setValidationError({
        type: "emptyOrInvalidData",
        message: `Invalid input at '${getInputLabel(
          Object.keys(errors)[0]
        )}', also check for any other highlighted input box`,
        inputBox: null,
      });
    }
  }, [errors]);

  useEffect(() => {
    if (transValidated) {
      dataTodb({
        tableName: "transactions",
        syncData: [submitData],
        setCurrentJob: setCurrentJob,
      });
    }
  }, [transValidated]);

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

  useEffect(() => {
    if (currentJob) {
      ToastAndroid.show(currentJob, ToastAndroid.SHORT);
    }
    if (currentJob === "Transaction saved!") {
      let usedReceipts = allReceipts;
      let newReceipt = submitData.paper_receipt;

      usedReceipts.push({ paper_receipt: newReceipt });
      setAllReceipts(usedReceipts);
      setSubmitted(true);
    }
  }, [currentJob]);

  useEffect(() => {
    if (farmerSeasonTransactions.length > 0) {
      let weight = 0;
      let subtotal = 0;
      for (const item of farmerSeasonTransactions) {
        let weight1 = parseFloat(item.kilograms) || 0;
        let weight2 = parseFloat(item.bad_kilograms) || 0;
        subtotal = weight1 + weight2;
        weight += subtotal;
      }

      setFarmerSeasonWeight(weight);
    }
  }, [farmerSeasonTransactions.length]);

  useEffect(() => {
    if (currentHousehold) {
      let certs = [{ label: "Not Certified", value: "NC" }];
      if (currentHousehold[0].InspectionStatus === "Active") {
        setFarmerCertified(true);

        certs = [
          { label: "Cafe Practices", value: "CP" },
          { label: "Rain Forest", value: "RF" },
          ...certs,
        ];
      } else {
        setCurrentCertificationType("NC");
      }

      setCertifications(certs);
    }
  }, [currentHousehold]);

  useEffect(() => {
    const fetchIds = async () => {
      let staffID = await SecureStore.getItemAsync("rtc-user-staff-id");
      let staffKF = await SecureStore.getItemAsync("rtc-user-staff-kf");
      let stationID = await SecureStore.getItemAsync("rtc-station-id");
      let names = await SecureStore.getItemAsync("rtc-name-full");
      let seasonID = await SecureStore.getItemAsync("rtc-seasons-id");

      if (stationID) {
        retrieveDBdata({
          stationId,
          tableName: "rtc_supplier",
          setData: setSupplierData,
        });
      }

      if (seasonID) {
        retrieveDBdata({
          tableName: "rtc_transactions",
          queryArg: `SELECT kilograms,bad_kilograms FROM rtc_transactions WHERE farmerid='${data.farmerid}' AND _kf_Season='${seasonID}'`,
          setData: setFarmerSeasonTransactions,
        });
      }

      retrieveDBdata({
        tableName: "rtc_transactions",
        setData: setAllReceipts,
        queryArg: "SELECT paper_receipt FROM rtc_transactions",
      });

      setStaffId(staffID);
      setStaffKf(staffKF);
      setStationId(stationID);
      setUserName(names);
      setSeasonId(seasonID);
    };

    const fetchCertification = async () => {
      retrieveDBdata({
        tableName: "rtc_households",
        setData: setCurrentHousehold,
        queryArg: `SELECT InspectionStatus FROM rtc_households WHERE farmerid='${data.farmerid}';`,
      });
    };

    fetchIds();
    fetchCertification();
  }, []);

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
          Registered ATP Farmer
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ backgroundColor: colors.bg_variant }}>
        <Formik
          initialValues={{
            farmerID: data.farmerid,
            farmerName: data.Name,
            receiptNumber: "",
            transactionDate: date,
            certificationType: currentCertificationType,
            coffeeType: currentCoffeeType,
            kgGood: "0",
            priceGood: "0",
            totalGood: "",
            kgBad: "0",
            priceBad: "0",
            totalBad: "",
            cashTotal: "0",
            cashTotalMobile: "0",
            deliveredName: "N/A",
            deliveredPhone: "N/A",
            deliveredGender: deliveredGender,
          }}
          onSubmit={async (values) => {
            submitTransaction(values);
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
                    Confirm Purchase
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerID")}
                    handleBlur={handleBlur("farmerID")}
                    label={"Farmer ID"}
                    value={values.farmerID}
                    active={false}
                    error={errors.farmerID}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("farmerName")}
                    handleBlur={handleBlur("farmerName")}
                    label={"Farmer Name"}
                    value={values.farmerName}
                    active={false}
                    error={errors.farmerName}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("receiptNumber")}
                    handleBlur={handleBlur("receiptNumber")}
                    label={"Receipt Number"}
                    value={values.receiptNumber}
                    error={
                      validationError.inputBox === "receiptNumber" ||
                      errors.receiptNumber
                    }
                  />
                  <View
                    style={{
                      gap: screenHeight * 0.01,
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
                      Transaction Date
                    </Text>
                    <View
                      style={{
                        flexDirection: "row-reverse",
                        alignItems: "center",
                        gap: screenWidth * 0.02,
                        width: "100%",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: screenWidth * 0.02,
                          borderRadius: 7,
                          backgroundColor: colors.white_variant,
                          elevation: 4,
                        }}
                        onPress={showDatepicker}
                      >
                        <AntDesign
                          name="calendar"
                          size={screenWidth * 0.06}
                          color="black"
                        />
                      </TouchableOpacity>
                      <Text
                        style={{
                          borderWidth: 0.3,
                          borderRadius: 8,
                          borderColor: colors.bg_variant_font,
                          backgroundColor: colors.white_a,
                          paddingHorizontal: 7,
                          paddingVertical: 7,
                          width: screenWidth * 0.745,
                          fontWeight: "500",
                          fontSize: screenWidth * 0.05,
                          color: colors.blue_font,
                        }}
                      >
                        {date.toLocaleString("en-US", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </Text>
                      {show && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          maximumDate={new Date()}
                          value={date}
                          mode={mode}
                          is24Hour={true}
                          onChange={onChange}
                        />
                      )}
                    </View>
                  </View>
                </View>

                {/* Certification type */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
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
                    Certification Type
                  </Text>
                  {certifications.length > 0 && (
                    <RadioButtonGroup
                      containerStyle={{ marginBottom: 10, gap: 5 }}
                      selected={currentCertificationType}
                      onSelected={(value) => setCurrentCertificationType(value)}
                      radioBackground={colors.blue_font}
                    >
                      {certifications.map((item) => (
                        <RadioButtonItem
                          key={item.value}
                          value={item.value}
                          label={
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 16,
                                marginLeft: 8,
                                color: colors.black,
                              }}
                            >
                              {item.label}
                            </Text>
                          }
                        />
                      ))}
                    </RadioButtonGroup>
                  )}
                </View>

                {/* coffee type */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
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
                    Coffee Type
                  </Text>
                  <RadioButtonGroup
                    containerStyle={{ marginBottom: 10, gap: 5 }}
                    selected={currentCoffeeType}
                    onSelected={(value) => setCurrentCoffeeType(value)}
                    radioBackground={colors.blue_font}
                  >
                    <RadioButtonItem
                      value="Cherry"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Cherry
                        </Text>
                      }
                    />
                    <RadioButtonItem
                      value="Parchment"
                      label={
                        <Text
                          style={{
                            fontWeight: "600",
                            fontSize: 16,
                            marginLeft: 8,
                            color: colors.black,
                          }}
                        >
                          Parchment
                        </Text>
                      }
                    />
                  </RadioButtonGroup>
                </View>

                {/* quantity */}
                <View
                  style={{
                    justifyContent: "space-between",
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    rowGap: screenWidth * 0.04,
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
                    Coffee Quantity
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        width: "48%",
                        gap: screenHeight * 0.01,
                        paddingBottom: screenHeight * 0.03,
                      }}
                    >
                      <BuyCoffeeInput
                        values={values}
                        handleChange={(text) => {
                          handleChange("kgGood")(text);
                          let input = parseFloat(text) || 0;
                          let totalPrice =
                            input * parseFloat(values.priceGood) || 0;

                          setFieldValue("totalGood", totalPrice);

                          let totalCash =
                            parseFloat(totalPrice) +
                            parseFloat(+values.totalBad);
                          setFieldValue("cashTotal", totalCash.toFixed(2));
                        }}
                        handleBlur={handleBlur("kgGood")}
                        label={"Kgs(Good)"}
                        radius={4}
                        value={values.kgGood}
                        keyboardType={"numeric"}
                      />
                      <View
                        style={{
                          backgroundColor: colors.bg_variant_font,
                          height: "0.5%",
                          width: "100%",
                          marginVertical: screenHeight * 0.008,
                        }}
                      />
                      <BuyCoffeeInput
                        values={values}
                        handleChange={(text) => {
                          handleChange("kgBad")(text);
                          let input = parseFloat(text) || 0;
                          let totalPrice =
                            input * parseFloat(values.priceBad) || 0;

                          setFieldValue("totalBad", totalPrice);

                          let totalCash =
                            parseFloat(totalPrice) +
                            parseFloat(+values.totalGood);
                          setFieldValue("cashTotal", totalCash.toFixed(2));
                        }}
                        handleBlur={handleBlur("kgBad")}
                        label={"Kgs(Bad)"}
                        radius={4}
                        value={values.kgBad}
                        keyboardType={"numeric"}
                      />
                    </View>
                    <View
                      style={{
                        width: "48%",
                        gap: screenHeight * 0.01,
                        paddingBottom: screenHeight * 0.03,
                      }}
                    >
                      <BuyCoffeeInput
                        values={values}
                        handleChange={(text) => {
                          handleChange("priceGood")(text);
                          let input = parseFloat(text) || 0;
                          let totalPrice =
                            input * parseFloat(values.kgGood) || 0;

                          setFieldValue("totalGood", totalPrice);

                          let totalCash =
                            parseFloat(totalPrice) +
                            parseFloat(+values.totalBad);

                          setFieldValue("cashTotal", totalCash.toFixed(2));
                        }}
                        handleBlur={handleBlur("priceGood")}
                        label={"Price/Kg"}
                        radius={4}
                        value={values.priceGood}
                        keyboardType={"numeric"}
                      />
                      <View
                        style={{
                          backgroundColor: colors.bg_variant_font,
                          height: "0.5%",
                          width: "100%",
                          marginVertical: screenHeight * 0.008,
                        }}
                      />
                      <BuyCoffeeInput
                        values={values}
                        handleChange={(text) => {
                          handleChange("priceBad")(text);
                          let input = parseFloat(text) || 0;
                          let totalPrice =
                            input * parseFloat(values.kgBad) || 0;

                          setFieldValue("totalBad", totalPrice);
                          let totalCash =
                            parseFloat(totalPrice) +
                            parseFloat(+values.totalGood);

                          setFieldValue("cashTotal", totalCash.toFixed(2));
                        }}
                        handleBlur={handleBlur("priceBad")}
                        label={"Price/Kg"}
                        radius={4}
                        value={values.priceBad}
                        keyboardType={"numeric"}
                      />
                    </View>
                  </View>
                </View>

                {/* coffee value */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
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
                    Coffee Value
                  </Text>
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cashTotal")}
                    handleBlur={handleBlur("cashTotal")}
                    label={"Total Cash Paid"}
                    radius={4}
                    active={false}
                    value={values.cashTotal}
                    keyboardType={"numeric"}
                    error={errors.cashTotal}
                  />
                  <BuyCoffeeInput
                    values={values}
                    handleChange={handleChange("cashTotalMobile")}
                    handleBlur={handleBlur("cashTotalMobile")}
                    label={"Total Paid By Mobile Payment"}
                    radius={4}
                    value={values.cashTotalMobile}
                    keyboardType={"numeric"}
                    error={errors.cashTotalMobile}
                  />
                </View>

                {/* delivery */}
                <View
                  style={{
                    width: "95%",
                    backgroundColor: colors.white,
                    elevation: 2,
                    borderRadius: 15,
                    paddingHorizontal: screenWidth * 0.04,
                    paddingVertical: screenHeight * 0.03,
                    gap: screenHeight * 0.01,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
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
                      Delivered by (optional)
                    </Text>
                    {folded ? (
                      <TouchableOpacity onPress={toggleFold}>
                        <FontAwesome5
                          name="angle-down"
                          size={screenWidth * 0.07}
                          color="black"
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity onPress={toggleFold}>
                        <FontAwesome5
                          name="angle-up"
                          size={screenWidth * 0.07}
                          color="black"
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {!folded && (
                    <>
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("deliveredName")}
                        handleBlur={handleBlur("deliveredName")}
                        label={"Names"}
                        radius={4}
                        value={values.deliveredName}
                        active={false}
                        error={errors.deliveredName}
                      />
                      <BuyCoffeeInput
                        values={values}
                        handleChange={handleChange("deliveredPhone")}
                        handleBlur={handleBlur("deliveredPhone")}
                        label={"Phone number"}
                        radius={4}
                        value={values.deliveredPhone}
                        active={false}
                        error={errors.deliveredPhone}
                      />
                      <Text
                        style={{
                          fontWeight: "400",
                          fontSize: screenWidth * 0.04,
                          color: colors.black,
                          marginLeft: screenWidth * 0.02,
                        }}
                      >
                        Gender
                      </Text>
                      <RadioButtonGroup
                        containerStyle={{ marginBottom: 10, gap: 5 }}
                        selected={deliveredGender}
                        onSelected={(value) => setDeliveredGender(value)}
                        radioBackground={colors.blue_font}
                      >
                        <RadioButtonItem
                          value="M"
                          label={
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 16,
                                marginLeft: 8,
                                color: colors.black,
                              }}
                            >
                              Male
                            </Text>
                          }
                        />
                        <RadioButtonItem
                          value="F"
                          label={
                            <Text
                              style={{
                                fontWeight: "600",
                                fontSize: 16,
                                marginLeft: 8,
                                color: colors.black,
                              }}
                            >
                              Female
                            </Text>
                          }
                        />
                      </RadioButtonGroup>
                    </>
                  )}
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

                <CustomButton
                  bg={colors.secondary}
                  color={"white"}
                  width="95%"
                  text="Confirm Purchase"
                  bdcolor="transparent"
                  mt={screenHeight * 0.017}
                  mb={
                    isKeyboardActive ? screenHeight * 0.04 : screenHeight * 0.03
                  }
                  radius={10}
                  disabled={submitted}
                  onPress={handleSubmit}
                />
              </ScrollView>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
};
