import React, { useState, Component, useEffect } from "react";
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
import RenderHTML from "react-native-render-html";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import NumericInput from "react-native-numeric-input";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import bodymatchslider from "../../assets/img/bodymatchslider.png";
import EndUrl from "../api/EndUrl";
import DeviceInfo from "react-native-device-info";
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const PolicyScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [produuctData, setProduuctData] = useState([]);
  const isCarousel = React.useRef(null);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("Policy & Legal");
  const [itemText, setItemText] = useState([]);
  const [affiliateText, setAffiliateText] = useState("");
  const [usertoke, SetUsertoke] = useState();
  const [cartCountshow, setCartCountshow] = useState();

  const getAffliate = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.policy, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      });
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
      if (json.status == 200) {
        setAffiliateText(json.data[0].content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getAffliate();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  const toggleModal = (id, openModal) => {
    setLoading(openModal);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };

  const createAlliiate = () => {
    toggleModal();
    navigation.navigate("AffiliateCreate");
  };

  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };

  const win = Dimensions.get("window");

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ProgressLoader isVisible={loading} />
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            padding: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              padding: 5,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <View
              style={{
                width: "100%",
                padding: 5,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
                textAlign: "center",
              }}
            >
              <RenderHTML source={{ html: affiliateText }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topBannercontainer: {
    width: "100%",
    height: 92,
    justifyContent: "center",
    alignItems: "center",
  },
  affliatedef: {
    textAlign: "center",
    fontSize: 19,
    marginBottom: 5,
  },
  buttoholder: {
    padding: 10,
  },
  affiliateHead: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
});
export default PolicyScreen;
