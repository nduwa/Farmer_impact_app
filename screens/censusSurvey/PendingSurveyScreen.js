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
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";
import { SurveyPendingCard } from "../../components/SurveyPendingCard";
import { deleteDBdataAsync } from "../../helpers/deleteDBdataAsync";
import { SyncModal } from "../../components/SyncModal";
import { deleteFile } from "../../helpers/deleteFile";
import { useDispatch, useSelector } from "react-redux";
import { readDataFromFile } from "../../helpers/readDataFromFile";
import {
  surveyAction,
  surveyUpload,
} from "../../redux/censusSurvey/CensusSurveySlice";
import { updateDBdata } from "../../helpers/updateDBdata";

export const PendingSurveyScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const surveyState = useSelector((state) => state.survey);

  const [surveys, setSurveys] = useState([]);

  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
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
    navigation.navigate("Homepage", { data: null });
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

  const removeSurvey = (id) => {
    const allSurveys = surveys.filter((item) => item.id !== id);

    setSurveys(allSurveys);
  };

  const handleUpload = () => {
    let fileUri = uploadModal.uri;
    setLoading(true);

    readDataFromFile(fileUri).then((data) => {
      if (data) {
        dispatch(surveyUpload({ surveydata: data, token }));
        console.log("data extracted from the file successfully");
      }
    });
  };
  const handleDelete = async () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));
    setLoading(true);

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "tmp_census_survey",
      targetCol: "id",
      targetId: id,
    })
      .then((result) => {
        if (result.success) {
          removeSurvey(result.deletedTransaction);
          setCurrentJob("record deleted");
        } else {
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setLoading(false);
  }, [surveys]);

  useEffect(() => {
    if (surveyState.error) {
      setLoading(false);
      const surveyError = surveyState.error;

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
  }, [surveyState.error]);

  useEffect(() => {
    if (surveyState.serverResponded) {
      let surveyId = uploadModal.id;

      if (!surveyId) return;

      console.log(surveyState);

      updateDBdata({
        msgNo: "Upload failed",
        msgYes: "Survey uploaded",
        setCurrentJob,
        query: `UPDATE tmp_census_survey SET uploaded = 1 WHERE id= ${surveyId}`,
      });
    }
  }, [surveyState.serverResponded]);

  useEffect(() => {
    if (currentJob === "record deleted") {
      deleteFile(deleteModal.uri).then(() => {
        setLoading(false);
        displayToast("Survey deleted");
        setCurrentJob();
      });
    } else if (currentJob === "Survey uploaded") {
      removeSurvey(uploadModal.id);
      deleteFile(uploadModal.uri).then(() => {
        setLoading(false);
        displayToast("Survey uploaded");
        dispatch(surveyAction.resetSurveyState());
        setUploadModal({ open: false, id: null, uri: null });
        setCurrentJob();
      });
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const authToken = await SecureStore.getItemAsync("rtc-token");

        if (authToken) {
          setToken(authToken);
        }

        retrieveDBdata({
          tableName: "tmp_census_survey",
          setData: setSurveys,
          queryArg: "SELECT * FROM tmp_census_survey WHERE uploaded=0;",
        });
      };

      fetchData();
      return () => {
        setCurrentJob();
        dispatch(surveyAction.resetSurveyState());
        setSurveys([]);
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
          Pending Surveys
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {surveys.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={surveys}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <SurveyPendingCard
              data={item}
              surveyDate={formatDate(item.created_at)}
              uploadFn={() =>
                setUploadModal({ open: true, id: item.id, uri: item.filepath })
              }
              deleteFn={() =>
                setDeleteModal({ open: true, id: item.id, uri: item.filepath })
              }
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
