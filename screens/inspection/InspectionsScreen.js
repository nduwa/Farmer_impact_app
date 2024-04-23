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
import { InspectionModal } from "../../components/InspectionModal";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";
import { useDispatch, useSelector } from "react-redux";
import {
  inspectionAction,
  inspectionSubmission,
} from "../../redux/inspection/inspectionSlice";
import { updateDBdata } from "../../helpers/updateDBdata";

export const InspectionsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inspectionState = useSelector((state) => state.inspection);

  const [inspections, setInspections] = useState([]);
  const [responses, setResponses] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [inspectionModal, setInspectionModal] = useState({
    open: false,
    id: null,
    data: null,
  });
  const [currentJob, setCurrentJob] = useState(null);
  const [inspectionDeleted, setInspectionDeleted] = useState(false);

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

  const handleSubmitInspections = async (id) => {
    retrieveDBdataAsync({
      tableName: "inspection_responses",
      filterCol: "rtc_inspections_id",
      filterValue: id,
    })
      .then((result) => {
        if (result.length > 0) {
          setResponses(result);
        }
      })
      .catch((error) => console.log(error));
  };

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
          setInspectionDeleted(true);
        } else {
          handleCloseDeleteModal();
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleServerResponse = () => {
    displayToast("Inspection Submitted");

    let allInspections = inspections;

    let filtered = allInspections.filter(
      (item) => item.id !== inspectionModal.id
    );

    setInspectionModal((prevState) => ({ ...prevState, open: false }));

    setInspections(filtered);
  };

  useEffect(() => {
    if (inspectionDeleted) {
      deleteDBdataAsync({
        tableName: "inspection_responses",
        targetCol: "rtc_inspections_id",
        targetId: deleteModal.id,
      })
        .then((result) => {
          if (result.success) {
            displayToast("Inspection deleted");
          } else {
            displayToast("Deletion failed");
          }
        })
        .catch((error) => console.log(error));
    }
  }, [inspectionDeleted]);

  useEffect(() => {
    if (inspectionState.serverResponded) {
      const uploadDate = new Date();
      let inspectionId = inspectionModal.id;

      updateDBdata({
        msgNo: "Submitting failed",
        msgYes: "Inspection Submitted",
        setCurrentJob,
        query: `UPDATE rtc_inspections SET uploaded=1, uploaded_at='${uploadDate}' WHERE id='${inspectionId}'`,
      });

      handleServerResponse();
      setResponses([]);
      dispatch(inspectionAction.resetInspectionState());
    }
  }, [inspectionState.serverResponded]);

  useEffect(() => {
    if (responses.length > 0) {
      dispatch(
        inspectionSubmission({
          inspection: inspectionModal.data,
          responses: responses,
        })
      );
    }
  }, [responses.length]);

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
        setCurrentJob(null);
        setInspections([]);
        setResponses([]);
        setDeleteModal({ open: false, id: null });
        setInspectionModal({
          open: false,
          id: null,
          data: null,
        });
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
              handlePress={() =>
                setInspectionModal({ open: true, id: item.id, data: item })
              }
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

      {/* inspection modal */}
      {inspectionModal.open && (
        <InspectionModal
          data={{
            inspection_id: inspectionModal.id,
            inspectionData: inspectionModal.data,
          }}
          active={!inspectionState.loading}
          DeleteFn={() => {
            setInspectionModal((prevState) => ({ ...prevState, open: false }));
            setDeleteModal({ id: inspectionModal.id, open: true });
          }}
          UploadFn={() => handleSubmitInspections(inspectionModal.id)}
          CloseFn={() =>
            setInspectionModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}
    </View>
  );
};
