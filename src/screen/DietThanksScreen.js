import React, { useState, Component, useEffect, useCallback } from "react";
import {
  Platform,
  View,
  Button,
  Text,
  Image,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import { scale } from "react-native-size-matters";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import EndUrl from "../api/EndUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { IconCheck } from "../component/IconComp";
import { ButtonCustom } from "../component/ButtonCustom";
import DeviceInfo from "react-native-device-info";
//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const DietThanksScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Order Thanks");
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const [order, setOrder] = useState([]);
  const [userData, setUserData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const gatlineIdset = async (id) => {
    navigation.navigate("ProductDetail", {
      proId: id,
    });
  };

  const startDiet = async () => {
    navigation.replace("Diet", { id: "new" });
  };
  const createDiet = async () => {
    navigation.replace("ChatbotNutrition", { id: route.params.plan_type });
  };
  const getProfileData = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    const settingsGet = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: JSON.parse(usertoken),
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      },
    };
    const response = await fetch(EndUrl.getprofile, settingsGet);
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === 1) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === 1) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === 1) {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    const json = await response.json();
    setUserData(json.data[0]);
  };

  useEffect(() => {
    getProfileData();
  }, [refresh]);
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            padding: 5,
            marginTop: 10,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View style={styles.backgroundColor}>
            <Text style={styles.title}>
              {/* <Feather
                name={"check"}
                style={{
                  color: "#424553",
                  width: 30,
                  fontSize: 29,
                  right: 2,
                  fontWeight: 600,
                  paddingVertical: 6,
                }}
              /> */}
              <IconCheck /> Thank You!
            </Text>
            <Text style={styles.heading}>
              Congratulations on your payment success! 🎉
            </Text>
            <Text style={styles.heading}>
              Now, let's kickstart your journey towards a healthier you by
              creating your personalized diet profile.
            </Text>
          </View>
          {userData.nutrition_chatbot ? (
            // <Button
            //   color="#F79489"
            //   title={"Start Diet"}
            //   onPress={() => startDiet()}
            <ButtonCustom title={"Start Diet"} onPress={() => startDiet()} />
          ) : (
            // />
            // <Button
            //   color="#F79489"
            //   title={"Create Diet"}
            //   onPress={() => createDiet()}
            // />
            <ButtonCustom title={"Create Diet"} onPress={() => createDiet()} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  backgroundColor: {
    backgroundColor: "#FFF",
    padding: 5,
    flexDirection: "column",
    flexWrap: "wrap",
    padding: 20,
    margin: 5,
    alignItems: "flex-start",
    borderRadius: 10,
    marginTop: "10%",
  },
  heading: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 16,
    alignItems: "flex-start",
  },
  subheading: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 16,
    alignItems: "flex-start",
    marginTop: 10,
  },
  title: {
    width: "100%",
    fontSize: 33,
    textAlign: "center",
  },
  mYorderiTem: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 5,
    margin: 3,
    paddingLeft: 2,
    marginRight: 10,
  },
});
export default DietThanksScreen;
