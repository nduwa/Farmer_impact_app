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
import LottieView from "lottie-react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { dbQueries } from "../../data/dbQueries";
import { TrainingSessionCard } from "../../components/TrainingSessionCard";
import {
  trainingActions,
  trainingSubmission,
} from "../../redux/training/trainingSlice";
import { updateDBdata } from "../../helpers/updateDBdata";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../components/SyncModal";

export const TrainingScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const trainingState = useSelector((state) => state.training);

  const [trainings, setTrainings] = useState([]);
  const [allTrainigData, setAllTrainingData] = useState([]);
  const [currentJob, setCurrentJob] = useState(null);
  const [language, setLanguage] = useState("eng");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [trainingModal, setTrainingModal] = useState({
    open: false,
    id: null,
    data: null,
  });

  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [attendanceDeleted, setAttendanceDeleted] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const getGroups = (item) => {
    const sessions = allTrainigData.filter(
      (tr) => tr._kf_training == item._kf_training
    );
    let sessionGroups = [];
    let str = "";

    for (let session of sessions) {
      let foundItem = sessionGroups.find((item) => item === session.__kf_group);
      if (!foundItem) sessionGroups.push(session.__kf_group);
    }

    return sessionGroups.length > 1
      ? `${item.ID_GROUP} and ${sessionGroups.length - 1} more`
      : `${item.ID_GROUP}`;
  };

  const getFileName = (str) => {
    const splitStr = str.split("/");

    return splitStr[splitStr.length - 1];
  };

  const removeDeletedSession = (id) => {
    const allSessions = trainings.filter((item) => item.uuid !== id);

    setTrainings(allSessions);
  };

  const handleDelete = () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_training_attendance",
      targetId: id,
      customQuery: `DELETE FROM rtc_training_attendance WHERE uuid = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          removeDeletedSession(result.deletedTransaction);
        } else {
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleUpload = (item) => {
    setSubmitting(true);
    const dir = "file:///data/user/0/host.exp.exponent/files/";
    const formData = new FormData();
    const fileName = getFileName(item.filepath);
    let tmpObj = {};

    formData.append("attendance_sheet", {
      uri: `${dir}${fileName}`,
      name: fileName,
      type: "image/jpeg",
    });

    const trainingData = allTrainigData.filter(
      (tr) => tr._kf_training == item._kf_training
    );

    const attendanceData = trainings.filter((att) => att.uuid == item.uuid);

    if (!trainingData || !attendanceData) return;

    for (let session of trainingData) {
      let newSession = { ...attendanceData[0], ...session };
      for (const key in newSession) {
        if (newSession.hasOwnProperty(key)) {
          if (
            !tmpObj.hasOwnProperty(key) ||
            key === "__kf_farmer" ||
            key === "__kf_group"
          ) {
            formData.append(key, newSession[key]);
            tmpObj[key] = newSession[key];
          }
        }
      }
    }

    dispatch(
      trainingSubmission({
        formData,
        filepath: attendanceData[0].filepath,
      })
    );
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleServerResponse = (id) => {
    let allTrainings = trainings;

    let filtered = allTrainings.filter((item) => item._kf_training !== id);

    setTrainings(filtered);
  };

  useEffect(() => {
    if (currentJob) {
      displayToast(currentJob);
    }
    if (currentJob === "Training sessions Submitted") {
      setAttendanceSubmitted(true);
      const { _kf_training, uuid, status } = trainingState.response;

      handleServerResponse(_kf_training);
      dispatch(trainingActions.resetTrainingState());
    }
  }, [currentJob]);

  useEffect(() => {
    if (trainingState.serverResponded) {
      setSubmitting(false);
      const uploadDate = new Date();
      const { _kf_training, uuid, status } = trainingState.response;

      if (status !== "success") return;

      updateDBdata({
        msgNo: "Submitting failed",
        msgYes: "Training sessions Submitted",
        setCurrentJob,
        query: `UPDATE rtc_training_attendance SET uploaded_at = '${uploadDate}' WHERE uuid = '${uuid}';`,
      });
    }
  }, [trainingState.serverResponded]);

  useEffect(() => {
    if (trainingState.error) {
      const trainingError = trainingState.error;

      if (trainingError?.code === "ERR_BAD_RESPONSE") {
        displayToast("Error: Server error");
      } else if (trainingError?.code === "ERR_BAD_REQUEST") {
        displayToast("Error: Incomplete data");
      } else if (trainingError?.code === "ERR_NETWORK") {
        displayToast("Error: Network error");
      } else {
        displayToast("Something went wrong");
      }
    }
  }, [trainingState.error]);

  useEffect(() => {
    if (trainings.length > 0) {
      retrieveDBdata({
        tableName: "rtc_training_attendance",
        setData: setAllTrainingData,
        queryArg:
          "SELECT * FROM rtc_training_attendance WHERE uploaded_at = '0000-00-00'",
      });
    }
  }, [trainings]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        retrieveDBdata({
          tableName: "rtc_training_attendance",
          setData: setTrainings,
          queryArg: dbQueries.Q_TRAINING_LIST,
        });
      };

      fetchData();
      return () => {
        setCurrentJob(null);
        setTrainings([]);
        setAllTrainingData([]);
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
          Saved Training Inspections
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {trainings.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={trainings}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <TrainingSessionCard
              course_id={item.ID_COURSE}
              course_name={language === "eng" ? item.Name : item.Name_rw}
              participants={item.participants}
              group_id={getGroups(item)}
              onUpload={() => handleUpload(item)}
              onDelete={() => setDeleteModal({ id: item.uuid, open: true })}
              active={!submitting}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      )}

      {/* page loader */}
      {submitting && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.195,
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
              source={require("../../assets/lottie/spinner.json")}
              autoPlay
              speed={1}
              loop={true}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {/* delete modal */}
      {deleteModal.open && (
        <SyncModal
          label={"Are you sure you want to delete this session?"}
          onYes={handleDelete}
          OnNo={() =>
            setDeleteModal((prevState) => ({ ...prevState, open: false }))
          }
        />
      )}
    </View>
  );
};
