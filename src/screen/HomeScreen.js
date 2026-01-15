import React, { useState, Component, useEffect, useCallback } from "react";
import {
  Platform,
  View,
  Text,
  Image,
  Linking,
  Dimensions,
  Alert,
  StyleSheet,
  Pressable,
  
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Button,
  AppState,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
  useFocusEffect,
} from "@react-navigation/native";
import { TabNavigators } from "../../TabNavigators.js";
import Modal from "react-native-modal";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/Header";
import ImageCarousel from "../component/ImageCarousel";
import EndUrl from "../api/EndUrl";
import moment from "moment";
import { ButtonCustom } from "../component/ButtonCustom.js";
import AlertModal from "../component/AlertModal.js";
import { BackHandler } from "react-native";
import DeviceInfo from "react-native-device-info";
import checkVersion from "react-native-store-version";
import strings from "../utils/strings.js";
import icons from "../../assets/iconsIndex";
import { setupNotificationListeners } from "../services/NotificationHandler.js";
import OptionsModal from "./preHomePage/PreHomePage.js";
import FullScreenLoader from "../component/FullScreenLoader.js";
 import { SafeAreaView } from "react-native-safe-area-context";
const SLIDER_1_FIRST_ITEM = 1;
const win = Dimensions.get("window");
const width = win.width;
var id = 0;

const HomeScreen = ({ route, navigation }) => {
  const [titleText, setTitleText] = useState(null);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [plan, setPlan] = useState([]);
  const [planImage, setPlanImage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [id, setId] = useState();
  const [planType, setPlanType] = useState();
  const [bannerdata, setBannerData] = useState();
  const { params } = route;
  const isCarousel = React.useRef(null);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [homeSection, setHomeSection] = useState([]);
  const [fhomeMap, setFhomeSection] = useState([]);
  const [shomeMap, setShomeSection] = useState([]);
  const [thomeMap, setThomeSection] = useState([]);
  const [sectionfive, setSectionfive] = useState([]);
  const [sectionsix, setSectionsix] = useState([]);
  const [sectionseven, setSectionseven] = useState([]);
  const [sectionEight, setSectionEight] = useState([]);
  const [sectionNine, setSectionNine] = useState([]);
  const [sectionTen, setSectionTen] = useState([]);
  const [sectionElvn, setSectionElvn] = useState([]);
  const [sectionTwl, setSectionTwl] = useState([]);
  const [usertoke, SetUsertoke] = useState();
  const [cartCount, setCartCount] = useState();
  const [notify, setNotyfy] = useState(false);
  const [isUpdateModal, setIsUpdateModal] = useState(false);
  const [isForceUpdateAvailable, setIsForceUpdateAvailable] = useState(false);
  const [showBodyLogin, setShowBodyLogin] = useState(false);
  const [isOldFordeUpdatePopup, setIsOldFordeUpdatePopup] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);
  const [optionModal, setOptionModal] = useState(true);
  const [preHomePageData, setPreHomePageData] = useState([]); 

  const handleCheckOptionModal = () => {
    setTimeout(() => {
      setOptionModal(true);
    }, 1000);
  };

  useEffect(() => {
    handleCheckOptionModal();
    getPreHomePageData()
  }, []);

  const checkForUpdate = async () => {
    console.log(
      "DeviceInfo.getVersion()",
      DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, "")
    );

    try {
      const payload = {
        version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""), // app local version
        iosStoreURL,
        androidStoreURL,
      };
      console.log("payload--->", payload);
      const check = await checkVersion(payload);
      console.log("appCu--->", check);
      if (check.result === "new") {
        // alert("NEWWWWW" + JSON.stringify(check.detail))
        setIsUpdateAvailable(true);
      } else {
        // alert("OLD")

        setIsUpdateAvailable(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const handleAppStateChange = (nextAppState) => {
  //   if (AppState.currentState === "active" && !isUpdateAvailable) {
  //     // Recheck version when the app becomes active
  //     checkForUpdate();
  //   }
  // };

  let usertoken = "";
  const getstodata = async () => {
    const keys = await AsyncStorage.getAllKeys();
    let usertoken = await AsyncStorage.getItem("usertoken");
    let closeDate = await AsyncStorage.getItem("closeDate");
    if (usertoken == null) {
      // navigation.navigate("Login");
    }
    SetUsertoke(JSON.parse(usertoken));
  };

  const checkUpdateStatus = async () => {
    try {
      // Check if user has skipped the update

      const updateAvailable = await AsyncStorage.getItem("updateAvailable");

      // const forceUpdate = await AsyncStorage.getItem("forceUpdate");
      const isOldFordeUpdatePopup = await AsyncStorage.getItem(
        "useOldFordeUpdatePopup"
      );

      const isUpdateRequired = updateAvailable === "true";
      // const isForceUpdateRequired = forceUpdate === "true";
      // console.log("isForceUpdateRequired--->", isForceUpdateRequired);
      const isOldFordeUpdatePopupRequired = isOldFordeUpdatePopup === "true";
      console.log(
        "isOldFordeUpdatePopupRequired--->",
        isOldFordeUpdatePopupRequired
      );

      if (isOldFordeUpdatePopupRequired) {
        console.log(
          "isOldFordeUpdatePopupRequired---1111111111111>",
          isOldFordeUpdatePopupRequired
        );
        setIsOldFordeUpdatePopup(true);
      } else {
        setIsOldFordeUpdatePopup(false);
      }

      // const hasSkippedUpdate = await AsyncStorage.getItem("hasSkippedUpdate");
      // console.log("hasSkippedUpdate--->", hasSkippedUpdate);
      // if (hasSkippedUpdate === "true" && isForceUpdateRequired === false) {
      //   console.log("hasSkippedUpdate--->2", hasSkippedUpdate);
      //   setIsUpdateModal(false);
      //   return;
      // }

      // Only show update modal if it's a force update or user hasn't skipped
      if (isUpdateRequired) {
        // if (isForceUpdateRequired) {
        //   console.log("isForceUpdateRequired--->3", isForceUpdateRequired);
        //   // Force updates can't be skipped, so remove the skip flag
        //   await AsyncStorage.removeItem("hasSkippedUpdate");
        //   setIsForceUpdateAvailable(true);
        // } else {
        //   setIsForceUpdateAvailable(false);
        // }
        setIsUpdateModal(true);
      } else {
        setIsUpdateModal(false);
      }
    } catch (error) {
      console.error("Error checking update status:", error);
    }
  };
  useFocusEffect(() => {
    // checkUpdateStatus();
    const handleAppStateChange = (nextAppState) => {
      if (AppState.currentState === "active" && !isUpdateAvailable) {
        // Recheck version when the app becomes active
        checkForUpdate();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  });
  const settingsGet = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: usertoken,
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };

  const getFooter = async () => {
    try {
      const resultdatap = await fetch(EndUrl.getfooter);
      const result = await resultdatap.json();
      setFooterTextdesc(result.data[0]);
    } catch (error) {
    } finally {
    }
  };
  const getHomeApi = async () => {
    setLoading(true);
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

      console.log(
        "SHBSHBDS:::",
        DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, "")
      );

      const resultdata = await fetch(EndUrl.homeApi, settingsGet);
      const result = await resultdata.json();
      const updateAvailable = resultdata.headers.get("updateAvailable");
      // const forceUpdate = resultdata.headers.get("forceUpdate");
      // console.log("forceUpdate--->2", forceUpdate);

      const isOldFordeUpdatePopup = resultdata.headers.get(
        "useOldFordeUpdatePopup"
      );
      console.log(
        "isOldFordeUpdatePopup updateAvailable:::",
        updateAvailable,
        isOldFordeUpdatePopup
      );
      if (updateAvailable == 1 || isOldFordeUpdatePopup == 1) {
        setTimeout(() => {
          setNewUpdate(true);
        }, 1000);
      } else {
        setNewUpdate(false);
      }
      // if (forceUpdate === "1") {
      //   console.log("forceUpdate--->5", forceUpdate);
      //   await AsyncStorage.setItem("forceUpdate", "true");
      // } else {
      //   await AsyncStorage.setItem("forceUpdate", "false");
      // }
      // if (isOldFordeUpdatePopup === "1") {
      //   console.log("isOldFordeUpdatePopup--->6", isOldFordeUpdatePopup);
      //   await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      // } else {
      //   await AsyncStorage.setItem("useOldFordeUpdatePopup", "false");
      // }

      setLoading(false);
      setHomeSection(result.data);
      setFhomeSection(result.data[1]);
      setShomeSection(result.data[2]);
      setThomeSection(result.data[3]);
      setSectionfive(result.data[4]);
      setSectionsix(result.data[5]);
      setSectionseven(result.data[6]);
      setSectionEight(result.data[7]);
      setSectionNine(result.data[8]);
      setSectionTen(result.data[9]);
      setSectionElvn(result.data[10]);
      setSectionTwl(result.data[11]);
    } catch (error) {
      console.error("Home API Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getHomeApi();
  }, []);
  const importData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      console.log(result);
      //return result.map(req => JSON.parse(req)).forEach(console.log);
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      getHomeApi();
      const onBackPress = () => {
        // Show the confirmation dialog when back button is pressed on the Home screen
        // setModalVisible(true);
        BackHandler.exitApp();
        return true; // Prevent default behavior
      };

     const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => subscription.remove();
    }, [])
  );

  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     handleBackPress
  //   );

  //   return () => backHandler.remove(); // Cleanup listener on unmount
  // }, []);
  const handleBackPress = () => {
    BackHandler.exitApp();
  };
  const getProfileData = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    const closeDate = await AsyncStorage.getItem("closeDate");
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
    const response = await fetch(EndUrl.getprofilenew, settingsGet);
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === "1") {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === "1") {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === "1") {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    const json = await response.json();
    console.log(JSON.stringify(json), "getProfileData>>>>>>>");
    await AsyncStorage.setItem("userData", JSON.stringify(json.data));
    global.userdata = json?.data[0];
    if (
      json.data[0].body_profile == 0 &&
      closeDate != moment(new Date()).format("DD-MM-YYYY")
    ) {
      let date = moment(new Date()).format("DD-MM-YYYY");
      setTimeout(() => {
        setNotyfy(true);
      }, 500);
    }
  };

  const Cloasenotify = async () => {
    try {
      await AsyncStorage.setItem(
        "closeDate",
        moment(new Date()).format("DD-MM-YYYY")
      ).then(() => {
        setNotyfy(false);
      });
      setNotyfy(false);
    } catch (error) {
      console.error("Close Notify Error:", error);
    }
  };

  const iosStoreURL =
    "https://apps.apple.com/in/app/knectt-health-marketplace/id6517353884";
  const androidStoreURL =
    "https://play.google.com/store/apps/details?id=com.knectt";

  const _onPressUpdate = () => {
    if (Platform.OS == "ios") {
      Linking.openURL(iosStoreURL);
    } else {
      Linking.openURL(androidStoreURL);
    }
    setNewUpdate(false);
  };

  const _onPressNotNow = async () => {
    try {
      // Store that user has skipped this update
      await AsyncStorage.setItem("hasSkippedUpdate", "true");
      setIsUpdateModal(false);
      setIsForceUpdateAvailable(false);
    } catch (error) {
      console.error("Error saving skip status:", error);
    }
  };

  const getSpecialcategory = async () => {
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
    try {
      const response = await fetch(EndUrl.homeIcone, settingsGet);
      console.log("response---> headers 2", response?.headers);
      const updateAvailable = response.headers.get("updateAvailable");
      const forceUpdate = response.headers.get("forceUpdate");
      const isOldFordeUpdatePopup = response.headers.get(
        "useOldFordeUpdatePopup"
      );
      if (updateAvailable === "1") {
        await AsyncStorage.setItem("updateAvailable", "true");
      }
      if (forceUpdate === "1") {
        await AsyncStorage.setItem("forceUpdate", "true");
      }
      if (isOldFordeUpdatePopup === "1") {
        await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      }

      const json = await response.json();
      setTopbanner(json.data);
      setHomrBabber(json?.fixed_banner[0]);
    } catch (error) {
      console.log(error);
      console.log(settingsGet);
    } finally {
      setLoading(false);
    }
  };
  const gotoSpecialCategory = async (categoryid) => {
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      let usertoken = await AsyncStorage.getItem("usertoken");
      if (usertoken) {
        navigation.navigate("chatbot");
      } else {
        setShowBodyLogin(true);
      }
    }
  };
  const onCloseModal = () => {
    setShowBodyLogin(false);
  };
  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getProfileData();
        getstodata();
        getCartcountAj();
        getSpecialcategory();

        getFooter();
        importData();
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

  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };

  const goToCategory = (arg, catename) => {
    console.log({
      cateId: arg,
      cateName: catename,
    },'blood test navigation')
    navigation.navigate("Category", {
      cateId: arg,
      cateName: catename,
    });
  };
  const goMainCategory = (arg) => {
    navigation.navigate("MainCategory", {
      cateId: arg,
    });
  };

  const getCartcountAj = async () => {
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

      const response = await fetch(EndUrl.getcartcount, settingsGet);
      console.log("response---> headers 3", response?.headers);
      const updateAvailable = response.headers.get("updateAvailable");
      const forceUpdate = response.headers.get("forceUpdate");
      const isOldFordeUpdatePopup = response.headers.get(
        "useOldFordeUpdatePopup"
      );
      if (updateAvailable === "1") {
        await AsyncStorage.setItem("updateAvailable", "true");
      }
      if (forceUpdate === "1") {
        await AsyncStorage.setItem("forceUpdate", "true");
      }
      if (isOldFordeUpdatePopup === "1") {
        await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      }

      const json = await response.json();
      if (response.status == 200) {
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(json.count ?? "")
        );
        await AsyncStorage.setItem(
          "notificationcount",
          JSON.stringify(json.notification_count)
        );
        setCartCount(json.count);
      }
      if (json.status === 400 && json.message == "unauthrise Access") {
        // navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Cart Count API Error:", error);
      AsyncStorage.removeItem("usertoken");
    }
  };


   const getPreHomePageData = async () => {
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

      const response = await fetch(EndUrl.PRE_HOMEPAGE_DATA, settingsGet);
      const json = await response.json();
      if (response.status == 200) {
        console.log("PreHomePageData", json);
       setPreHomePageData(json);
       setTimeout(()=>{
         setOptionModal(true)
       },500)
      }
    } catch (error) {
      console.error("Cart Count API Error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <ProgressLoader isVisible={loading} /> */}
      <FullScreenLoader
        visible={loading}
      />
      <Header
        categoryTitle={""}
        itemText={""}
        cartCountshow={cartCount}
        chatLogo
        menu
        search
        // notification
        cart
        navigation
      />
      {topbanner ? (
        <View style={styles.topBannercontainer}>
          <ScrollView
            style={{ height: scale(92) }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              horizontal={true}
              style={{
                width: "100%",
                paddingTop: 1,
                marginTop: 1,
                marginLeft: 5,
              }}
              initialNumToRender={4}
              refreshing={loading}
              data={topbanner}
              keyExtractor={(itemdata) => itemdata.id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.square}>
                    <Pressable
                      // onPress={() => navigation.navigate("EditDietProfile")}
                      onPress={() => gotoSpecialCategory(1)}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.imagetop}
                        resizeMode={"cover"}
                      />
                    </Pressable>
                  </View>
                );
              }}
            ></FlatList>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.topBannercontainer}></View>
      )}
      <Pressable onPress={() => gotoSpecialCategory(1)}>
        <Image
          source={{ uri: homrBabber.image }}
          style={{
            height: 75,
            width: width,
            paddingTop: 30,
            marginTop: 3,
            resizeMode: "cover",
            marginBottom: 10,
          }}
        />
      </Pressable>

      <ScrollView style={{ flex: 1 }}>
        <Pressable
          onPress={() => {
            navigation.navigate("CategoryList", {
              cateId: fhomeMap.id,
            });
          }}
        >
          <Image
            source={{ uri: fhomeMap.image }}
            style={{
              height: 250,
              width: width,
              resizeMode: "cover",
              marginBottom: 10,
            }}
          />
        </Pressable>
        <View>
          <Pressable
            onPress={() =>
              navigation.navigate("CategoryList", {
                cateId: shomeMap.id,
              })
            }
          >
            <Image
              source={{ uri: shomeMap.image }}
              style={{
                height: 90,
                width: width,
                paddingTop: 1,
                marginTop: 2,
                resizeMode: "cover",
                marginBottom: 10,
              }}
            />
          </Pressable>
          <Pressable onPress={() => gotoSpecialCategory(1)}>
            <Image
              source={{ uri: thomeMap.image }}
              style={{
                height: 90,
                width: width,
                paddingTop: 1,
                marginTop: 2,
                resizeMode: "cover",
                marginBottom: 10,
              }}
            />
          </Pressable>
        </View>
        <View style={styles.headertxt}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "#424553",
            }}
          >
            {sectionfive.title}
          </Text>
        </View>
        <FlatList
          style={{ width: "100%", paddingTop: 1, marginTop: 10, height: 600 }}
          data={sectionfive.mapped_category}
          initialNumToRender={2}
          refreshing={loading}
          scrollEnabled={false}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <View style={styles.inner}>
                <Pressable
                  onPress={() => {
                    goToCategory(item.pro_cat_id, item.pro_cat_name);
                  }}
                  style={{ width: "100%", height: 300, paddingTop: 1 }}
                >
                  <Image
                    source={{ uri: item.pro_cat_image }}
                    style={{ width: "100%", height: 300, paddingTop: 1 }}
                  />
                  <Text></Text>
                </Pressable>
              </View>
            );
          }}
        ></FlatList>
        <View>
          <Pressable onPress={() => gotoSpecialCategory(1)}>
            <Image
              source={{ uri: sectionsix.image }}
              style={{
                height: 90,
                width: width,
                paddingTop: 1,
                marginTop: 10,
                resizeMode: "cover",
              }}
            />
          </Pressable>
        </View>
        <View style={styles.headertxt}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "#424553",
            }}
          >
            {sectionseven.title}
          </Text>
        </View>
        <FlatList
          style={{ width: "100%", paddingTop: 1, marginTop: 10 }}
          data={sectionseven.mapped_category}
          numColumns={3}
          initialNumToRender={3}
          refreshing={loading}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageholder}>
                <Pressable
                  onPress={() =>
                    goToCategory(item.pro_cat_id, item.pro_cat_name)
                  }
                >
                  <Image
                    source={{ uri: item.pro_cat_image }}
                    style={styles.imageround}
                    resizeMode={"cover"}
                  />
                  <Text style={styles.textFont}>{item.pro_cat_name}</Text>
                </Pressable>
              </View>
            );
          }}
        ></FlatList>
        {sectionEight.mapped_category ? (
          <ImageCarousel data={sectionEight.mapped_category} />
        ) : null}
        <Pressable
          onPress={() =>
            navigation.navigate("CategoryList", {
              cateId: sectionNine.id,
            })
          }
        >
          <Image
            source={{ uri: sectionNine.image }}
            style={{ height: 90, width: width, paddingTop: 1, marginTop: 1 }}
          />
        </Pressable>
        <View style={styles.headertxt}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "#424553",
            }}
          >
            {sectionTen.title}
          </Text>
        </View>
        <FlatList
          style={{ width: "100%", paddingTop: 1, marginTop: 5, height: 600 }}
          data={sectionTen.mapped_category}
          initialNumToRender={2}
          scrollEnabled={false}
          refreshing={loading}
          numColumns={2}
          renderItem={({ item }) => {
            return (
              <View style={styles.inner}>
                <Pressable
                  onPress={() =>
                    goToCategory(item.pro_cat_id, item.pro_cat_name)
                  }
                  style={{
                    height: 300,
                    width: "100%",
                    paddingTop: 1,
                    marginTop: 1,
                  }}
                >
                  <Image
                    source={{ uri: item.pro_cat_image }}
                    style={{ width: "100%", height: 300, paddingTop: 1 }}
                  />
                </Pressable>
              </View>
            );
          }}
        ></FlatList>
        <View style={styles.headertxt}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 20,
              padding: 10,
              color: "#424553",
            }}
          >
            {sectionElvn.title}
          </Text>
        </View>
        <FlatList
          style={{ width: "100%", paddingTop: 1, marginTop: 10 }}
          data={sectionElvn.mapped_category}
          initialNumToRender={3}
          refreshing={loading}
          numColumns={3}
          renderItem={({ item }) => {
            return (
              <View style={styles.imageholder}>
                <Pressable
                  onPress={() =>
                    goToCategory(item.pro_cat_id, item.pro_cat_name)
                  }
                >
                  <Image
                    source={{ uri: item.pro_cat_image }}
                    style={styles.imageround}
                    resizeMode={"cover"}
                  />
                  <Text style={styles.textFont}>{item.pro_cat_name}</Text>
                </Pressable>
              </View>
            );
          }}
        ></FlatList>
        {sectionTwl.mapped_category ? (
          <ImageCarousel data={sectionTwl.mapped_category} />
        ) : null}
        {footerTextdesc.image ? (
          <View style={styles.footertext}>
            <Image
              source={{ uri: footerTextdesc.image }}
              style={{ height: 75, width: width, paddingTop: 0, marginTop: 3 }}
            />
          </View>
        ) : null}
        <View>
          <Modal isVisible={notify}>
            <View
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                paddingTop: 15,
                flexDirection: "column",
              }}
            >
              <Text style={styles.profillnoti}>
                Complete your profile now to unlock personalized health
                recommendations and exclusive features. Tap below to get
                started!
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  margin: 5,
                  width: "100%",
                  justifyContent: "space-evenly",
                  padding: 10,
                }}
              >
                <View style={{ width: "48%" }}>
                  <ButtonCustom
                    title={"Do It Now"}
                    onPress={() => {
                      setNotyfy(false);
                      navigation.navigate("EditDietProfile");
                    }}
                  />
                </View>
                <View style={{ width: "48%" }}>
                  <ButtonCustom
                    onPress={() => {
                      Cloasenotify();
                    }}
                    title="Skip It Now"
                    containerStyle={{ backgroundColor: "#132742" }}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
      {showBodyLogin && (
        <AlertModal
          isVisible={showBodyLogin}
          onClose={onCloseModal}
          navigation={navigation}
        />
      )}

      {newUpdate && (
        <Modal
          style={styles.container}
          animationType="none"
          transparent={true}
          isVisible={newUpdate}
        >
          <View style={styles.subContainer}>
            <View style={styles.mainContainer}>
              <Image
                source={icons.icon_logo}
                style={{ width: 1200, height: 200 }}
                resizeMode="contain"
              />
              <Text style={styles.titleText}>{strings.update_app_title}</Text>
              <Text style={styles.descText}>
                {strings.update_app_description}
              </Text>
              <ButtonCustom
                title={"Update App"}
                containerStyle={styles.buttonContainer}
                onPress={_onPressUpdate}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* {optionModal && (
        <OptionsModal visible={optionModal} onClose={() => setOptionModal(false)} loading={preHomePageLoading}  data={preHomePageData}/>
      )} */}
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
    height: scale(85),
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    paddingTop: 0,
    width: scale(90),
    paddingRight: 4,
    paddingLeft: 0,
    paddingBottom: 0,
    height: scale(90),
  },
  imageholdertop: {
    flexDirection: "column",
    width: "20%",
  },
  headertxt: {
    width: "100%",
    fontSize: 29,
    fontWeight: 500,
    textAlign: "center",
    paddingTop: 3,
    marginTop: 6,
  },
  titleText: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageround: {
    height: 95,
    width: 95,
    padding: 5,
  },
  imageholder: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    margin: 5,
  },
  imagetop: {
    resizeMode: "contain",
    height: scale(85),
    width: scale(85),
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 3,
  },
  image: {
    height: 100,
    width: 100,
  },
  textFont: {
    textAlign: "center",
    width: 100,
  },
  profillnoti: {
    fontSize: 17,
    color: "#000",
    fontWeight: "600",
    alignSelf: "center",
  },

  container: {
    flex: 1,
  },
  subContainer: {
    backgroundColor: "rgba(1,1,1,0)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
  },
  descText: { marginBottom: 10 },
  titleText: { fontWeight: "bold", fontSize: 16 },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 8,
    padding: 20,
  },
});

export default HomeScreen;
