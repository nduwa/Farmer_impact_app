import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  Dimensions,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../data/colors";
import { AntDesign } from "@expo/vector-icons";
import { InspectionCourseCard } from "../../components/InspectionCourseCard";
import React, { useEffect, useState } from "react";
import { retrieveDBdataAsync } from "../../helpers/retrieveDBdataAsync";

export const InspectionCoursesScreen = ({ route }) => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const { data } = route.params;

  const [courses, setCourses] = useState([]);
  const [language, setLanguage] = useState("kiny");

  const handleBackButton = () => {
    navigation.navigate("inspectionFarmer", {
      data: data.inspectionType,
    });
  };

  const handleCourseLabel = (item) => {
    let str =
      language === "kiny"
        ? item.Name_rw
        : language === "eng"
        ? item.Name
        : item.Name_fr;

    if (str.length < 1) {
      if (item.Name.length > 0) str = item.Name;
      if (item.Name_rw.length > 0) str = item.Name_rw;
      if (item.Name_fr.length > 0) str = item.Name_fr;
    }

    return str;
  };

  useEffect(() => {
    if (courses.length > 0) {
      console.log("All courses retrieved");
    }
  }, [courses.length]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        retrieveDBdataAsync({
          tableName: "trainingModules",
        })
          .then((results) => {
            if (results.length > 0) {
              let allCourses = results.filter(
                (item) => item.__kp_Course.length > 0
              );
              setCourses(allCourses);
            }
          })
          .catch((err) => console.log(err));
      };

      fetchData();
      return () => {
        // Cleanup code if needed
      };
    }, [route.params.data])
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
          Choose Courses
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          contentContainerStyle={{
            padding: screenWidth * 0.02,
            gap: screenHeight * 0.01,
          }}
          data={courses}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <InspectionCourseCard
              data={{
                label: handleCourseLabel(item),
                code: item.ID_COURSE,
                id: item.__kp_Course,
                destination: data.inspectionType,
                farmerId: data.farmerId,
                farmerName: data.farmerName,
              }}
            />
          )}
          keyExtractor={(item) => item.__kp_Course}
        />
      </View>
    </View>
  );
};
