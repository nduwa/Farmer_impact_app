import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../../data/colors";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { GroupMgtHomeItem } from "../../../components/GroupMgtHomeItem";
import React, { useEffect, useState } from "react";
import { retrieveDBdata } from "../../../helpers/retrieveDBdata";
import LottieView from "lottie-react-native";

export const PendingGroupsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();

  const handleBackButton = () => {
    navigation.navigate("Homepage", { data: null });
  };

  const [groupChanges, setGroupChanges] = useState([]);
  const [groupAssignments, setGroupAssignments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setLoadingData(false);
    retrieveDBdata({
      tableName: "tmp_farmer_group_assignment",
      setData: setGroupAssignments,
      queryArg: `SELECT * FROM tmp_farmer_group_assignment WHERE uploaded = 0`,
    });
  }, [groupChanges]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        setLoadingData(true);
        retrieveDBdata({
          tableName: "tmp_group_activate",
          setData: setGroupChanges,
          queryArg: `SELECT * FROM tmp_group_activate WHERE uploaded = 0`,
        });
      };

      fetchData();
      return () => {
        setLoadingData(false);
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
          Pending Groups Actions
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
        <ScrollView>
          <View
            style={{
              padding: screenWidth * 0.02,
              gap: screenHeight * 0.014,
            }}
          >
            <GroupMgtHomeItem
              label={"Pending Status changes"}
              destination={"UploadGroupChangesScreen"}
              use={"pending"}
              active={groupChanges.length > 0}
              badgeNum={groupChanges.length}
              data={groupChanges}
            />
            <GroupMgtHomeItem
              label={"Pending Farmer Assignments"}
              destination={"UploadGroupAssignments"}
              use={"pending"}
              active={groupAssignments.length > 0}
              badgeNum={groupAssignments.length}
            />
          </View>
        </ScrollView>
      </View>

      {/* page loader */}
      {loadingData && (
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
