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
  
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CheckBox from "@react-native-community/checkbox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import ModalTester from "../component/ModalComponent";
import Header from "../component/Header";
import HomePlanComponent from "../component/HomePlanComponent";
import { scale } from "react-native-size-matters";
import RazorpayCheckout from "react-native-razorpay";
import EndUrl from "../api/EndUrl";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
const { height } = Dimensions.get("window");
var width = Dimensions.get("window").width;
const DietUpgradScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("Upgrade Plan");
  const [plan, setPlan] = useState([]);
  const [planImage, setPlanImage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [planType, setPlanType] = useState();
  const [userdata, setUserData] = useState([]);
  const [bannerdata, setBannerData] = useState();

  const toggleModal = (id, planType, planImage, openModal) => {
    setLoading(openModal);
    getReadMore(id, planType, planImage);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };

  const updagradePlane = (arg) => {
    navigation.navigate("EditChatbotNutrition", { id: arg });
  };
const loadProfile = async () => {
  try {
    const profile = await getProfileData();
    setUserData(profile);
  } catch (error) {
    console.log("Profile error:", error.message);
  }
};
  const getPlan = async () => {
    try {
      const response = await fetch(EndUrl.gloabalurl + "plans");
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
    } catch (error) {
      console.error(error);
    }
  };

  const navigationData = () => {
    toggleModal();
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      navigation.navigate("chatbot");
    }
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
        button={"Upgrade & Add to Cart"}
        loginLogo={item.image}
        chatPress={() => updagradePlane(item.id)}
        onPress={() => getReadMore(item.id, item.title, item.image, true)}
        color={"#132742"}
        offer={item.discount}
        planColor={"#F79489"}
        planheadingColor={"#999999"}
        id={item.id}
      />
    );
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getPlan();
        loadProfile();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      {/* <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View>
          <Text
            style={{
              fontSize: 16,
              textAlign: "left",
              marginTop: 7,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            Ask your nutritionist to apply your discount code during upgradation{" "}
          </Text>
        </View>
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
        modalPress={() => navigationData()}
        id={id}
      /> */}
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

export default DietUpgradScreen;
