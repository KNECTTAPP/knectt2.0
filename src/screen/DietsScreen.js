import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  Dimensions,
  Platform,
} from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";
import HomePlanComponent from "../component/HomePlanComponent";
import ModalTester from "../component/ModalNutrationComponent";
import OfferComponent from "../component/OfferComponent";
import EndUrl from "../api/EndUrl";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
var id = 0;
const DietsScreen = ({ navigation }) => {
  const [titleText, setTitleText] = useState(null);
  const [plan, setPlan] = useState([]);
  const [planImage, setPlanImage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [planType, setPlanType] = useState();
  const [bannerdata, setBannerData] = useState();
  const [chatNutrintion, setChatNutrintion] = useState([]);
  var width = Dimensions.get("window").width;
  var height = Dimensions.get("window").height;

  const updagradePlane = (arg) => {
    navigation.navigate("ChatbotNutrition", { id: arg });
  };

  const toggleModal = (id, planType, planImage, openModal) => {
    setLoading(openModal);
    getReadMore(id, planType, planImage);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };
  let podthrder = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };
  const getMovies = async () => {
    try {
      const response = await fetch(EndUrl.gloabalurl + "offer");
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
      let data = json.data[0];
      let offerData = {
        id: data.id,
        image: data.image,
      };
      setTitleText(offerData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("lineno 50");
      console.error(error);
    }
  };
  const getPlan = async () => {
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
      const response = await fetch(EndUrl.gloabalurl + "plans", settingsGet);
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
      setPlan(json.data);
      setLoading(false);
    } catch (error) {}
  };
  const bannerData = async () => {
    try {
      const response = await fetch(EndUrl.gloabalurl + "banner");
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
      const josnData = json.data;
      let newArray = [];
      josnData.map((item) => {
        newArray.push({ img: item.image });
        setBannerData(newArray);
        console.log("bannerData===", bannerdata);
      });
    } catch (error) {}
  };
  useEffect(() => {
    bannerData();
    getMovies();
    getPlan();
    getReadMore();
  }, []);

  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };
  const getReadMore = async (id, plan, planImage) => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await fetch(EndUrl.gloabalurl + `features/${id}`);
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
      let data = json.data;
      setRead(data);
      setPlanType(plan);
      setPlanImage(planImage);
      setId(id);
      setModalVisible(!isModalVisible);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const renderItem = ({ item }) => {
    return (
      <HomePlanComponent
        plan={item.feature_three}
        textOne={item.title}
        textTwo={item.feature_one}
        textThree={item.feature_two}
        priceOne={item.price}
        priceTwo={item.price}
        special_price={item.special_price}
        button={"Create Diet Profile and Pay"}
        loginLogo={item.image}
        onPress={() => getReadMore(item.id, item.title, item.image, true)}
        color={"#132742"}
        offer={item.discount}
        planColor={"#F79489"}
        // chatPress={() => navigation.navigate('chatbot')}
        chatPress={() => updagradePlane(item.id)}
        planheadingColor={"#999999"}
        id={item.id}
      />
    );
  };
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <Header onPress={() => navigation.pop()} chatLogo />
      <ScrollView style={{ flex: 1 }}>
        {loading == false && (
          <View
            style={{
              height: height * 0.3,
              width: width,
              alignSelf: "center",
              top: 2,
            }}
          >
            <ImageSlider
              data={bannerdata}
              autoPlay={true}
              closeIconColor="#fff"
              onClick={() => console.log("press")}
            />
          </View>
        )}
        {loading == false && (
          <OfferComponent
            source={titleText != null ? titleText.image : ""}
            discount={titleText != null ? titleText.discount : ""}
          />
        )}
        <FlatList
          data={plan}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </ScrollView>
      <ModalTester
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        data={read}
        planType={planType}
        planImage={planImage}
        loading={loading}
        modalPress={() => updagradePlane(id)}
        id={id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  titleText: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
});

export default DietsScreen;
