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
import HTMLView from "react-native-htmlview";
import { format } from "date-fns";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import ImageCarousel from "../component/SimilerProductCarousel";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import EndUrl from "../api/EndUrl";
import HTML from "react-native-render-html";
import ViewMoreText from "react-native-view-more-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import DeviceInfo from "react-native-device-info";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const NotificationScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Notification");
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const [notification, setNotification] = useState([]);
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const getMyOrder = async () => {
    try {
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

      const response = await fetch(EndUrl.getnotification, settingsGet);
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
      setNotification(json.data);
      setRefresh(!refresh);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getMyOrder();
    });
    return unsubscribe;
    setLoading(false);
  });
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
          <FlatList
            style={{
              width: "100%",
              paddingTop: 1,
              marginTop: 1,
              marginLeft: 5,
            }}
            data={notification}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <Pressable type="clear" style={styles.orderiTem} title="Add">
                  <View style={styles.tagRight}>
                    <Text style={{ fontSize: 16, flex: 1 }}>
                      {item.notification_text}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        flex: 1,
                        fontWeight: "500",
                        marginTop: 5,
                      }}
                    >
                      {item.date_time}
                    </Text>
                  </View>
                </Pressable>
              );
            }}
          ></FlatList>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  orderiTem: {
    backgroundColor: "#FFF",
    padding: 10,
    marginLeft: 1,
    marginRight: 15,
    margin: 2,
  },
  tagRight: {},
});
export default NotificationScreen;
