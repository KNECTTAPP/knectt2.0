import React, { useState, Component, useEffect } from "react";
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
  ImageBackground,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Badge, Icon, withBadge } from "react-native-elements";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import NumericInput from "react-native-numeric-input";
import Header from "../component/Header";
import MainCategory from "../component/MainCategory";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts.js";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const CategoryListScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState();
  const [id, setId] = useState();
  //const {cateId} = route.params;
  const [cateId, setCateId] = useState(route.params.cateId);
  const [produuctData, setProduuctData] = useState();
  const isCarousel = React.useRef(null);
  const [categoryTitle, setCategoryTitle] = useState("Categories");
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState();
  const [userdata, setUserData] = useState([]);
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [cartCountshow, setCartCountshow] = useState();
  const getJubleCategory = async () => {
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
        EndUrl.jumbelCate + route.params.cateId,
        settingsGet
      );
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
      console.log(json.data);
      setProduuctData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  const getSpecialcategory = async () => {
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
      const response = await fetch(EndUrl.secondCategory, settingsGet);
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
      setTopbanner(json?.data);
      setHomrBabber(json?.fixed_banner[0]);
      setFooterTextdesc(json?.footer_text[0].content);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
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
      if (response.status == 200) {
        const json = await response.json();
        setCartCountshow(json.count);
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(json.count ?? "")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  useEffect(() => {
    getSpecialcategory();
    const unsubscribe = navigation.addListener("focus", () => {
      getJubleCategory();
      getCartcountAj();
      getProfileData();
    });
    return unsubscribe;
    setLoading(false);
  }, [navigation]);

  const gotoSpecialCategory = (categoryid) => {
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      navigation.navigate("chatbot");
    }
  };

  const goToCategory = (arg, catename) => {
    navigation.navigate("Category", {
      cateId: arg,
      cateName: catename,
    });
  };

  const win = Dimensions.get("window");

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <Header
        cartCountshow={cartCountshow}
        categoryTitle={categoryTitle}
        backButtonwithtext
        search
      />
      {topbanner?.length > 0 ? (
        <View style={styles.topBannercontainer}>
          <ScrollView
            horizontal={true}
            style={{ height: scale(100) }}
            showsHorizontalScrollIndicator={false}
          >
            <FlatList
              horizontal={true}
              style={{
                width: "100%",
                paddingTop: 1,
                marginTop: 1,
                marginLeft: 15,
              }}
              data={topbanner}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.square}>
                    <Pressable
                      onPress={() => goToCategory(item.id, item.category)}
                    >
                      <Badge
                        value={item.count}
                        containerStyle={{
                          width: "100%",
                          top: 3,
                          textAlign: "center",
                          zIndex: 1000,
                          position: "absolute",
                        }}
                        badgeStyle={{
                          backgroundColor: "#132742",
                        }}
                      />
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
      ) : null}
      {homrBabber ? (
        <Pressable onPress={() => gotoSpecialCategory(1)}>
          <Image
            source={{ uri: homrBabber.image }}
            style={{ height: 75, width: "100%", paddingTop: 30, marginTop: 3 }}
          />
        </Pressable>
      ) : null}

      <ScrollView style={{ flex: 1 }}>
        <FlatList
          style={{
            width: "100%",
            padding: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
          data={produuctData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => goToCategory(item.pro_cat_id, item.pro_cat_name)}
              >
                <ImageBackground
                  source={{ uri: item.pro_cat_image }}
                  style={styles.imageBackground}
                >
                  <View style={styles.rightTextContainer}>
                    <Text style={styles.rightText}>{item.pro_cat_name}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
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
    height: scale(90),
    justifyContent: "center",
    alignItems: "center",
  },
  productnotaion: {
    backgroundColor: "pink",
    color: "#fff",
    width: scale(100),
    position: "absolute",
    marginBottom: 10,
    padding: scale(2),
    borderRadius: 5,
    top: scale(155),
    marginLeft: 6,
  },
  imagetop: {
    height: scale(85),
    width: scale(85),
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 12,
  },
  imageBox: {},
  productimage: {
    width: "100%",
    height: 300,
  },
  price: {},
  cutoffprice: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    color: "#7e818c",
    marginRight: 10,
  },
  brand: {
    fontWeight: "bold",
    color: "#282c3f",
    fontSize: scale(16),
  },
  price: {
    color: "#282c3f",
  },
  productname: {
    color: "#535766",
    fontFamily: fonts.whitneyLight,
    fontSize: scale(14),
    fontWeight: "400",
  },
  priceholder: {
    fontSize: scale(14),
  },
  productlayout: {
    height: "auto",
    padding: 2,
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
  item: {
    borderWidth: 0.2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    flex: 1,
    borderColor: "#CCC",
  },
  imageBackground: {
    flex: 1,
    height: scale(180),
    backgroundColor: "#EBEBEB",
    borderWidth: 0,
  },
  rightTextContainer: {
    width: "100%",
    position: "absolute",
    backgroundColor: "rgba(49, 49, 51,0.5)",
    paddingBottom: 1,
    marginBottom: 1,
    bottom: 1,
    textAlign: "center",
    borderRadius: 5,
    textAlignVertical: "bottom",
  },
  rightText: { color: "white", textAlign: "center" },
  footertext: {
    backgroundColor: "pink",
    textAlign: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategoryListScreen;
