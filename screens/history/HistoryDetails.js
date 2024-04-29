import { StatusBar } from "expo-status-bar";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../data/colors";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import ScTransactionItem from "../../components/ScTransactionItem";
import { InspectionRecordItems } from "../../components/InspectionRecordItem";

export const HistoryDetails = () => {
  const screenHeight = Dimensions.get("window").height;
  const screenWidth = Dimensions.get("window").width;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleBackButton = () => {
    navigation.navigate("HistoryScreen", { data: null });
  };

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
          History Details
        </Text>
        <View
          style={{ width: screenWidth * 0.07, backgroundColor: "transparent" }}
        />
      </View>
      <View style={{ padding: 12, gap: 9 }}>
        <ScTransactionItem
          kgsGood={12}
          kgsBad={25}
          priceGood={123}
          priceBad={43}
          trDate={"12/03/2023"}
          cashTotal={"45678"}
          farmerId={"F3456A"}
          farmerNames={"NTUZA JOHN"}
          lotnumber={"FNE9392039392"}
          coffeeVal={"3457"}
          coffeeType={"Cherry"}
          deleteFn={null}
          receiptId={"12345678"}
          routeData={{ hehe: "hehe" }}
          inActive={true}
        />
        <View
          style={{
            width: "100%",
            // height: screenHeight * 0.36,
            alignItems: "center",
            gap: screenHeight * 0.02,
            borderRadius: 15,
            backgroundColor: colors.white,
            padding: 10,
            elevation: 3,
          }}
        >
          <View
            style={{
              alignItems: "center",
              gap: screenHeight * 0.01,
            }}
          >
            <Text
              style={{
                fontSize: screenWidth * 0.05,
                fontWeight: "600",
              }}
            >
              Inspection
            </Text>
            <View
              style={{
                backgroundColor: colors.secondary_variant,
                height: screenHeight * 0.002,
                width: screenWidth * 0.8,
              }}
            />
          </View>

          <View style={{ alignItems: "center" }}>
            <Text
              style={{
                fontWeight: "500",
                textAlign: "center",
                fontSize: screenWidth * 0.035,
                marginVertical: screenHeight * 0.006,
              }}
            >
              {`FE34-457D-454E-213F-58DC-8110`}
            </Text>

            <View
              style={{
                backgroundColor: colors.secondary_variant,
                height: screenHeight * 0.001,
                width: screenWidth * 0.7,
              }}
            />
            <Text
              style={{
                fontWeight: "500",
                textAlign: "center",
                fontSize: screenWidth * 0.04,
                marginVertical: screenHeight * 0.006,
              }}
            >
              {`TYPE / GENERIC`}
            </Text>
            <View
              style={{
                backgroundColor: colors.secondary_variant,
                height: screenHeight * 0.001,
                width: screenWidth * 0.7,
              }}
            />
            <Text
              style={{
                fontWeight: "500",
                textAlign: "center",
                fontSize: screenWidth * 0.04,
                marginVertical: screenHeight * 0.006,
              }}
            >
              {`DATE / 12/04/2023`}
            </Text>
            <View
              style={{
                backgroundColor: colors.secondary_variant,
                height: screenHeight * 0.001,
                width: screenWidth * 0.7,
              }}
            />
            <Text
              style={{
                fontWeight: "500",
                textAlign: "center",
                fontSize: screenWidth * 0.04,
                marginVertical: screenHeight * 0.006,
              }}
            >
              {`STATUS / UPLOADED`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
