import React, { useEffect, useState } from "react";
import { colors } from "../../data/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { InspectionRecordItems } from "../../components/InspectionRecordItem";
import { SyncModal } from "../../components/SyncModal";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { InspectionHoverSubmitBtn } from "../../components/InspectionHoverSubmitBtn";

export const InspectionsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [inspections, setInspections] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  const removeDeletedInspection = (id) => {
    const allInspections = inspections.filter((item) => item.id !== id);

    setInspections(allInspections);
  };

  function formatDate(date) {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    let theDate = new Date(date);

    return theDate.toLocaleDateString("en-US", options);
  }

  const handleSubmitInspections = () => {};

  const handleDelete = async () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_inspections",
      targetCol: "id",
      targetId: id,
    })
      .then((result) => {
        if (result.success) {
          removeDeletedInspection(result.deletedTransaction);
          handleCloseDeleteModal();
          displayToast("Inspection deleted");
        } else {
          handleCloseDeleteModal();
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        retrieveDBdata({
          tableName: "rtc_inspections",
          setData: setInspections,
          queryArg: "SELECT * FROM rtc_inspections WHERE uploaded=0 ;",
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
          Pending Inspections
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {inspections.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={inspections}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <InspectionRecordItems
              data={{
                date: formatDate(item.inspection_at),
                type: item.Score_n,
                householdid: item._kf_Household,
              }}
              deleteFn={() => setDeleteModal({ open: true, id: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* delete modal */}
      {deleteModal.open && (
        <SyncModal
          label={"Are you sure you want to delete this inspection?"}
          onYes={handleDelete}
          OnNo={() =>
            setDeleteModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}

      <InspectionHoverSubmitBtn
        active={inspections.length > 0}
        handlePress={handleSubmitInspections}
      />
    </View>
  );
};
