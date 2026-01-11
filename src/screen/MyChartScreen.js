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
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import ImageCarousel from "../component/SimilerProductCarousel";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import chartGraph from "../../assets/img/Graphs.jpg";
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
const MyChartScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Chart");
  const screenWidth = Dimensions.get("window").width;
  const screenheight = Dimensions.get("window").height;
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const [order, setOrder] = useState([]);
  const win = Dimensions.get("window");
  const [lineData, setLineData] = useState();
  const [lineData2, setLineData2] = useState();
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({});
  const [refresh, setRefresh] = useState(false);
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const getMyGraph = async () => {
    setLoading(false);
    if (refresh == false) {
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

        const response = await fetch(
          EndUrl.gloabalurl + "getcustomergraph",
          settingsGet
        );
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        setGraphData(json);
        console.log(json);
        setRefresh(!refresh);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    getMyGraph();
  }, [refresh]);
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <ProgressLoader isVisible={loading} />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            padding: 0,
            marginTop: 2,
            marginLeft: 0,
            marginRight: 0,
          }}
          horizontal={true}
        >
          {/* {
            graphData.image?<Image
            source={{uri:graphData.image}}
            style={{ height:scale(250), width:width,justifyContent: 'center',
            alignItems: 'center'}} resizeMode = 'cover' />:null
          } */}
          <Image
            source={chartGraph}
            style={{
              height: scale(screenheight),
              width: width,
              justifyContent: "center",
              alignItems: "center",
            }}
            resizeMode="cover"
          />
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
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 5,
    margin: 3,
    paddingLeft: 2,
    marginRight: 10,
  },
  tagRight: {},
});
export default MyChartScreen;
