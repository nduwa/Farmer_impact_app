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
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { ScSummaryItem } from "../../components/ScSummaryItem";
import CustomButton from "../../components/CustomButton";
import { ScTransactionItem } from "../../components/ScTransactionItem";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../components/SyncModal";

export const ScJournalsSummary = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [indicatorVisible, setIndicatorVisibility] = useState(false);
  const [folded, setFolded] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [currentJob, setCurrentJob] = useState(null);

  const [journalData, setJournalData] = useState([]);
  const [certifiedAll, setCertifiedAll] = useState(0);
  const [unCertifiedAll, setUnCertifiedAll] = useState(0);
  const [floatersAll, setFloatersAll] = useState(0);
  const [cashAll, setCashAll] = useState(0);
  const [dateAll, setDateAll] = useState(null);
  const [recordsAll, setRecordsAll] = useState(0);

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

  const handleSubmit = () => {};

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
    if (currentJob) {
      ToastAndroid.show(currentJob, ToastAndroid.SHORT);
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        let transactions = [];
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
        // Cleanup code if needed
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
              <ScSummaryItem
                header={"Total Payment"}
                label={`RWF ${cashAll.toLocaleString()}`}
              />

              <CustomButton
                bg={colors.secondary}
                color={"white"}
                width="100%"
                text="Submmit Journal"
                bdcolor="transparent"
                mt={8}
                mb={8}
                radius={10}
                disabled={indicatorVisible}
                onPress={handleSubmit}
              />
            </View>
          )}
        </View>
        <FlatList
          onScroll={handleScroll}
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
              farmerId={item.farmerid}
              farmerNames={item.farmername}
              lotnumber={item.lotnumber}
              coffeeVal={item.kilograms * item.unitprice}
              coffeeType={item.coffee_type}
              deleteFn={setDeleteModal}
              receiptId={item.paper_receipt}
              routeData={data}
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
