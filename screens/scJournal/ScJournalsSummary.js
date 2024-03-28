import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ToastAndroid,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScSummaryItem } from "../../components/ScSummaryItem";
import CustomButton from "../../components/CustomButton";
import ScTransactionItem from "../../components/ScTransactionItem";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../components/SyncModal";
import { useDispatch, useSelector } from "react-redux";
import {
  journalActions,
  scJournalSubmission,
} from "../../redux/journal/JournalSlice";
import { updateDBdata } from "../../helpers/updateDBdata";
import * as SecureStore from "expo-secure-store";

export const ScJournalsSummary = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const JournalState = useSelector((state) => state.journal);

  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [folded, setFolded] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [currentJob, setCurrentJob] = useState(null);
  const [journalUploaded, setJournalUploaded] = useState(false);

  const [journalData, setJournalData] = useState([]);
  const [journalDataUploadable, setJournalDataUploadable] = useState([]);
  const [certifiedAll, setCertifiedAll] = useState(0);
  const [unCertifiedAll, setUnCertifiedAll] = useState(0);
  const [floatersAll, setFloatersAll] = useState(0);
  const [cashAll, setCashAll] = useState(0);
  const [dateAll, setDateAll] = useState(null);
  const [recordsAll, setRecordsAll] = useState(0);
  const [userName, setUserName] = useState("");

  const { data = null } = route.params;

  const toggleFold = () => {
    setFolded(!folded);
  };

  const handleScroll = (e) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    if (offsetY > 260) setFolded(true);
  };

  const handleBackButton = () => {
    navigation.navigate("ScDailyJournal");
  };

  const handleSubmitJournal = () => {
    const journalId = data.site_day_lot;
    const currentDate = new Date();
    const twoDigitYear = currentDate.getFullYear().toString().slice(-2);
    const twoDigitMonth = ("0" + (currentDate.getMonth() + 1)).slice(-2);
    const twoDigitDay = ("0" + currentDate.getDate()).slice(-2);
    let DayLotNumber = `${twoDigitDay}${twoDigitMonth}${twoDigitYear}`;

    dispatch(
      scJournalSubmission({
        journalId,
        transactions: journalDataUploadable,
        additional: { username: userName, password: "", DayLotNumber },
      })
    );
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const removeDeletedTransaction = (id) => {
    const allTransactions = journalData.filter(
      (item) => item.paper_receipt !== id
    );

    setJournalData(allTransactions);

    setSummaryData(allTransactions);
  };

  const deleteTransaction = async () => {
    deleteDBdataAsync({
      tableName: "rtc_transactions",
      id: deleteModal.id,
    })
      .then((result) => {
        if (result.success) {
          removeDeletedTransaction(result.deletedTransaction);
          handleCloseDeleteModal();
          setCurrentJob("Transaction deleted");
        } else {
          handleCloseDeleteModal();
          setCurrentJob("Deletion failed");
        }
      })
      .catch((error) => {
        console.log("Error deleting the transaction ", error);
        handleCloseDeleteModal();
        setCurrentJob("Deletion failed");
      });
  };

  const setSummaryData = (transactions) => {
    let totalCash = 0;
    let uncertified = 0;
    let certified = 0;
    let floaters = 0;

    for (const tr of transactions) {
      if (tr.certified === 1) {
        let kgs = parseFloat(tr.kilograms) || 0;
        certified += kgs;
      } else if (tr.certified === 0) {
        let kgs = parseFloat(tr.kilograms) || 0;
        uncertified += kgs;
      }
      let kgs = parseFloat(tr.bad_kilograms) || 0;
      floaters += kgs;

      const cashPaid = parseFloat(tr.cash_paid) || 0;
      const mobilePayment = parseFloat(tr.total_mobile_money_payment) || 0;

      totalCash += cashPaid + mobilePayment;
    }

    setRecordsAll(transactions.length);
    setDateAll(data?.date);
    setCertifiedAll(certified);
    setUnCertifiedAll(uncertified);
    setFloatersAll(floaters);
    setCashAll(totalCash);
  };

  useEffect(() => {
    if (journalData.length > 0) {
      let uploadableTransactions = [];
      for (const tr of journalData) {
        if (tr.uploaded === 0) {
          uploadableTransactions.push(tr);
        }
      }
      if (uploadableTransactions.length === 0) {
        setJournalUploaded(true);
      }
      setJournalDataUploadable(uploadableTransactions);
    }
  }, [journalData.length]);

  useEffect(() => {
    if (JournalState.serverResponded) {
      const uploadDate = new Date();
      let journalId = data.site_day_lot;

      updateDBdata({
        msgNo: "Submitting failed",
        msgYes: "Journal Submitted",
        setCurrentJob,
        query: `UPDATE rtc_transactions SET uploaded=1, uploaded_at='${uploadDate}' WHERE site_day_lot='${journalId}'`,
      });
    }
  }, [JournalState.serverResponded]);

  useEffect(() => {
    setIndicatorVisibility(JournalState.loading);
  }, [JournalState.loading]);

  useEffect(() => {
    if (currentJob) {
      ToastAndroid.show(currentJob, ToastAndroid.SHORT);
    }
    if (currentJob === "Journal Submitted") {
      let newJournalData = journalData;
      let uploadableData = journalDataUploadable;
      for (const tr of newJournalData) {
        for (const item of journalDataUploadable) {
          if (tr.paper_receipt === item.paper_receipt) {
            tr.uploaded = 1;
            let newUploadable = uploadableData.filter(
              (item) => item.paper_receipt !== tr.paper_receipt
            );
            uploadableData = newUploadable;
          }
        }
      }

      setJournalUploaded(uploadableData.length < 1);
      setJournalDataUploadable(uploadableData);
      setJournalData(newJournalData);
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        let transactions = [];
        let uName = await SecureStore.getItemAsync("rtc-user-name");

        setUserName(uName);
        retrieveDBdataAsync({
          tableName: "rtc_transactions",
          filterValue: data.site_day_lot,
        })
          .then((result) => {
            transactions = [...transactions, ...result];
            setJournalData(transactions);
            setSummaryData(transactions);
          })
          .catch((error) => {
            console.log("Error getting transactions for this journal: ", error);
          });
      };

      fetchData();
      return () => {
        setJournalDataUploadable([]);
        setJournalUploaded(false);
        dispatch(journalActions.resetJournalState());
      };
    }, [])
  );
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg_variant,
        maxWidth: screenWidth,
      }}
    >
      <StatusBar style="dark" />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
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
            padding: 5,
          }}
        >
          <AntDesign name="left" size={screenWidth * 0.07} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontWeight: "700",
            fontSize: screenWidth * 0.05,
            marginLeft: screenWidth * 0.2,
          }}
        >
          SC Daily Journals
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          width: "100%",
          marginTop: screenHeight * 0.02,
          paddingHorizontal: screenWidth * 0.02,
          gap: 10,
        }}
      >
        <View
          style={{
            backgroundColor: colors.white,
            borderRadius: 20,
            padding: screenWidth * 0.035,
            width: "100%",
            minHeight: screenHeight * 0.09,
            elevation: 8,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: screenWidth * 0.05, fontWeight: "600" }}>
              Summary - {dateAll}
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
            <View
              style={{
                width: "100%",
                gap: 8,
                marginTop: screenHeight * 0.02,
                justifyContent: "center",
              }}
            >
              <ScSummaryItem header={"Date"} label={dateAll} />
              <ScSummaryItem header={"Transactions"} label={recordsAll} />
              <ScSummaryItem
                header={"Certified"}
                label={`${certifiedAll} Kg(s)`}
              />
              <ScSummaryItem
                header={"Uncertified"}
                label={`${unCertifiedAll} Kg(s)`}
              />
              <ScSummaryItem
                header={"Floaters"}
                label={`${floatersAll} Kg(s)`}
              />
              {journalUploaded && (
                <ScSummaryItem header={"Status"} label={"uploaded"} />
              )}
              <ScSummaryItem
                header={"Total Payment"}
                label={`RWF ${cashAll.toLocaleString()}`}
              />

              <CustomButton
                bg={colors.secondary}
                color={"white"}
                width="100%"
                text="Submit Journal"
                bdcolor="transparent"
                mt={8}
                mb={8}
                radius={10}
                disabled={indicatorVisible || journalUploaded}
                onPress={handleSubmitJournal}
              />
            </View>
          )}
        </View>
        <FlatList
          onScroll={handleScroll}
          initialNumToRender={5}
          contentContainerStyle={{
            width: "100%",
            padding: 5,
            gap: screenWidth * 0.03,
          }}
          data={journalData}
          renderItem={({ item }) => (
            <ScTransactionItem
              kgsGood={item.kilograms}
              kgsBad={item.bad_kilograms}
              priceGood={item.unitprice}
              priceBad={item.bad_unit_price}
              trDate={data?.date}
              cashTotal={item.cash_paid + item.total_mobile_money_payment}
              farmerId={item.farmerid === "" ? "FARMER" : item.farmerid}
              farmerNames={item.farmername}
              lotnumber={item.lotnumber}
              coffeeVal={item.kilograms * item.unitprice}
              coffeeType={item.coffee_type}
              deleteFn={setDeleteModal}
              receiptId={item.paper_receipt}
              routeData={data}
              inActive={item.uploaded === 1}
            />
          )}
          keyExtractor={(item) => item.paper_receipt}
        />
      </View>
      {deleteModal.open && (
        <SyncModal
          label={`Do you want to delete this transaction?`}
          onYes={deleteTransaction}
          OnNo={handleCloseDeleteModal}
        />
      )}
    </View>
  );
};
