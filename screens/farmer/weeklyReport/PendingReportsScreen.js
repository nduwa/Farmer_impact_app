import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  FlatList,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import {
  WeeklyReportAction,
  weeklyReportSubmit,
} from "../../../redux/farmer/ReportSlice";
import { SyncModal } from "../../../components/SyncModal";
import LottieView from "lottie-react-native";
import { InspectionHoverSubmitBtn } from "../../../components/InspectionHoverSubmitBtn";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import { updateDBdata } from "../../../helpers/updateDBdata";
import { WeeklyReportCard } from "../../../components/WeeklyReportCard";
import { deleteDBdataAsync } from "../../../helpers/deleteDBdataAsync";

const PendingReportsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const reportState = useSelector((state) => state.report);

  const dispatch = useDispatch();

  const [Submitted, setSubmitted] = useState(false);
  const [currentJob, setCurrentJob] = useState();
  const [loading, setLoading] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const [reports, setReports] = useState([]);

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const displayToast = (msg) => {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  };

  const handleUpload = () => {
    setLoading(true);
    dispatch(weeklyReportSubmit({ reports }));
    setSubmitModal(false);
  };

  const removeDeletedReport = (id) => {
    const allReports = reports.filter((item) => item.id !== id);

    setReports(allReports);
  };

  const handleDelete = () => {
    setDeleteModal((prevState) => ({ ...prevState, open: false }));

    let id = deleteModal.id;
    deleteDBdataAsync({
      tableName: "rtc_field_weekly_report",
      targetId: id,
      customQuery: `DELETE FROM rtc_field_weekly_report WHERE id = '${id}';`,
    })
      .then((result) => {
        if (result.success) {
          displayToast("Report deleted");
          removeDeletedReport(result.deletedTransaction);
        } else {
          displayToast("Deletion failed");
        }
      })
      .catch((error) => console.log(error));
  };

  const handleEdit = (data = null) => {
    navigation.navigate("EditReportScreen", { data });
  };

  useEffect(() => {
    if (reportState.serverResponded) {
      setSubmitted(true);

      if (reportState.response.status === "success") {
        let weeklyReports = reports;
        let query = "";
        let strIDs = "";
        let i = 0;

        if (weeklyReports.length > 1) {
          for (const report of weeklyReports) {
            strIDs += `'${report.id}'`;
            if (i < weeklyReports.length - 1) strIDs += ",";
            i++;
          }
          query = `UPDATE rtc_field_weekly_report SET uploaded = 1 WHERE id IN(${strIDs})`;
        } else {
          query = `UPDATE rtc_field_weekly_report SET uploaded = 1 WHERE id = '${weeklyReports[0].id}'`;
        }

        updateDBdata({
          id: 0,
          query,
          setCurrentJob,
          msgYes: "Reports uploaded",
          msgNo: "not uploaded",
        });
      }
    }
  }, [reportState.serverResponded]);

  useEffect(() => {
    if (reportState.error) {
      setLoading(false);
      displayToast("Error: reports not submitted");
      dispatch(WeeklyReportAction.resetWeeklyReportState());
    }
  }, [reportState.error]);

  useEffect(() => {
    setLoading(false);
  }, [reports]);

  useEffect(() => {
    if (currentJob === "Reports uploaded") {
      displayToast("Done");
      setLoading(false);
    } else if (currentJob === "not uploaded") {
      displayToast("Error reports not uploaded");
      setLoading(false);
    }
  }, [currentJob]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-name-full");

        if (currentUser) {
          setLoading(true);
          retrieveDBdata({
            tableName: "rtc_field_weekly_report",
            setData: setReports,
            queryArg: `SELECT * FROM rtc_field_weekly_report WHERE uploaded = 0 AND full_name = '${currentUser}' AND uploaded = 0`,
          });
        }
      };

      fetchData();
      return () => {
        setReports([]);
        setSubmitted(false);
        setLoading(false);
        setCurrentJob();
        dispatch(WeeklyReportAction.resetWeeklyReportState());
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
          Weekly Reports
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>

      {reports.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={reports}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <WeeklyReportCard
              data={item}
              EditFn={() => handleEdit(item)}
              DeleteFn={() => setDeleteModal({ id: item.id, open: true })}
              active={!Submitted}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {reports.length > 0 && (
        <InspectionHoverSubmitBtn
          topRatio={0.93}
          handlePress={() => setSubmitModal(true)}
          active={!reportState.loading && !Submitted}
        />
      )}

      {submitModal && (
        <SyncModal
          label={
            "You are about to upload all the pending weekly reports, Are you sure?"
          }
          onYes={handleUpload}
          OnNo={() => setSubmitModal(false)}
        />
      )}

      {deleteModal.open && (
        <SyncModal
          label={"You are about to delete this report, Are you sure?"}
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

export default PendingReportsScreen;
