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

export const PendingSurveyScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const [surveys, setSurveys] = useState([]);

  const [currentJob, setCurrentJob] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setLoading(false);
    console.log(surveys);
  }, [surveys]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoading(true);

        retrieveDBdata({
          tableName: "rtc_trees_survey",
          setData: setSurveys,
          queryArg: "SELECT * FROM rtc_trees_survey WHERE uploaded=0;",
        });
      };

      fetchData();
      return () => {
        setCurrentJob(null);
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
            <View>
              <Text>{item.id}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}

      {loading && (
        <View
          style={{
            position: "absolute",
            marginTop: screenHeight * 0.195,
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
