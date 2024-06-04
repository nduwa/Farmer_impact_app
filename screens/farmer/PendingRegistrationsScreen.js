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
import { useDispatch, useSelector } from "react-redux";
import { FarmerPendingCard } from "../../components/FarmerPendingCard";
import { retrieveDBdata } from "../../helpers/retrieveDBdata";

export const PendingRegistrationsScreen = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [registrations, setRegistrations] = useState([]);

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

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const currentUser = await SecureStore.getItemAsync("rtc-user-name");

        if (currentUser) {
          retrieveDBdata({
            tableName: "rtc_farmers",
            setData: setRegistrations,
            queryArg: `SELECT * FROM rtc_farmers WHERE sync = 0 AND created_by = '${currentUser}' ;`,
          });
        }
      };

      fetchData();
      return () => {
        setRegistrations([]);
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
          Pending Registration
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      {registrations.length > 0 && (
        <FlatList
          contentContainerStyle={{ padding: 12, gap: 9 }}
          data={registrations}
          initialNumToRender={10}
          renderItem={({ item }) => (
            <FarmerPendingCard
              data={item}
              registrationDate={formatDate(item.registered_at)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};
