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
import LottieView from "lottie-react-native";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { SurveyPendingCard } from "../../components/SurveyPendingCard";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../components/SyncModal";
import { deleteFile } from "../../helpers/deleteFile";
import { useDispatch, useSelector } from "react-redux";
import { updateDBdata } from "../../helpers/updateDBdata";
import { generateFileName } from "../../helpers/prepareWetmillReport";
import {
  auditActions,
  auditSubmission,
} from "../../redux/wetmillAudit/WetmillSlice";
import { FilePendingItem } from "../../components/FilePendingItem";

export const PendingAuditScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const auditState = useSelector((state) => state.audit);

  const [audits, setAudits] = useState([]);

  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState({
    open: false,
    id: null,
    uri: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    id: null,
    uri: null,
  });

  const handleBackButton = () => {
    navigation.navigate("WetmillHomeScreen", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
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

  const removeAudit = (id) => {
    const allAudits = audits.filter((item) => item.id !== id);

    setAudits(allAudits);
  };

  const handleUpload = () => {
    let fileUri = uploadModal.uri;
    setLoading(true);

    const formData = new FormData();
    const fileName = generateFileName();

    formData.append("wetmillaudit_file", {
      uri: fileUri,
      name: fileName,
      type: "application/pdf",
    });

    dispatch(auditSubmission(formData));
  };

  const handleDelete = async () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));
    setLoading(true);

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "tmp_wetmill_audit",
      targetCol: "id",
      targetId: id,
    })
      .then((result) => {
        if (result.success) {
          removeAudit(result.deletedTransaction);
          setCurrentJob("record deleted");
        } else {
          console.log(result);
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setLoading(false);
  }, [audits]);

  useEffect(() => {
    if (auditState.error) {
      setLoading(false);
      const surveyError = auditState.error;

      if (surveyError?.code === "ERR_BAD_RESPONSE") {
        displayToast("Error: Server error");
      } else if (surveyError?.code === "ERR_BAD_REQUEST") {
        displayToast("Error: Incomplete data");
      } else if (surveyError?.code === "ERR_NETWORK") {
        displayToast("Error: Network error");
      } else {
        displayToast("Something went wrong");
      }

      setUploadModal((prevState) => ({ ...prevState, open: false }));
    }
  }, [auditState.error]);

  useEffect(() => {
    if (auditState.serverResponded) {
      let surveyId = uploadModal.id;

      if (!surveyId) return;

      updateDBdata({
        msgNo: "Upload failed",
        msgYes: "Audit uploaded",
        setCurrentJob,
        query: `UPDATE tmp_wetmill_audit SET uploaded = 1 WHERE id= ${surveyId}`,
      });
    }
  }, [auditState.serverResponded]);

  useEffect(() => {
    if (currentJob === "record deleted") {
      deleteFile(deleteModal.uri).then(() => {
        setLoading(false);
        displayToast("Audit deleted");
        setCurrentJob();
      });
    } else if (currentJob === "Audit uploaded") {
      removeAudit(uploadModal.id);
      deleteFile(uploadModal.uri).then(() => {
        setLoading(false);
        displayToast("Audit uploaded");
        dispatch(auditActions.resetAuditState());
        setUploadModal({ open: false, id: null, uri: null });
        setCurrentJob();
      });
    } else if (currentJob === "Deletion failed") {
      setLoading(false);
      displayToast("Error: Deleting failed");
      dispatch(auditActions.resetAuditState());
      setUploadModal({ open: false, id: null, uri: null });
      setCurrentJob();
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);

        retrieveDBdata({
          tableName: "tmp_wetmill_audit",
          setData: setAudits,
          queryArg: "SELECT * FROM tmp_wetmill_audit WHERE uploaded=0;",
        });
      };

      fetchData();
      return () => {
        setCurrentJob();
        dispatch(auditActions.resetAuditState());
        setAudits([]);
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
          Pending Audits
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {audits.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={audits}
          initialNumToRender={10}
          renderItem={({ item, index }) => (
            <FilePendingItem
              data={{ filepath: item.filepath, id: item.id }}
              date={formatDate(item.created_at)}
              index={index}
              deleteFn={setDeleteModal}
              uploadFn={handleUpload}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {uploadModal.open && (
        <SyncModal
          label={"You are about to upload this survey, proceed?"}
          onYes={handleUpload}
          OnNo={() => {
            setUploadModal({
              open: false,
              id: null,
              uri: null,
            });
            setLoading(false);
          }}
        />
      )}

      {deleteModal.open && (
        <SyncModal
          label={"You are about to delete this survey, are you sure?"}
          onYes={handleDelete}
          OnNo={() => {
            setDeleteModal({
              open: false,
              id: null,
              uri: null,
            });
            setLoading(false);
          }}
        />
      )}

      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.095,
            width: "100%",
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11,
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
              source={require("../../assets/lottie/spinner.json")}
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
