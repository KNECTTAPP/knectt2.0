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
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Button,
  BackHandler
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
  useFocusEffect
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
import DeviceInfo from "react-native-device-info";
import FastImage from "react-native-fast-image";
import { apiRequest } from "../services/apiService.js";
const SLIDER_1_FIRST_ITEM = 1;
const win = Dimensions.get("window");
const width = win.width;
var id = 0;

const CategoryTabScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [cartCount,setCartCount]=useState()
  const [sectionseven, setSectionseven] = useState([]);

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

      const { data, status } = await apiRequest(
        EndUrl.getcartcount,
        settingsGet
      );

      if (status === 200) {
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(data.count ?? "")
        );
        setCartCount(data.count);
      }
    } catch (error) {
      console.error("Cart Count API Error:", error);
    }
  };

  const getHomeApi = async () => {
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
      const resultdata = await fetch(EndUrl.homeApi, settingsGet);
      const result = await resultdata.json();
      setSectionseven(result.data[6]);
    } catch (error) {
      console.log("error", error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getHomeApi();
        getCartcountAj()
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Navigate to Offerings Page
        navigation.navigate("Offerings Page");
        return true; // prevent default back behavior
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [navigation])
  );

  const goToCategory = (arg, catename) => {
    navigation.navigate("Category", {
      cateId: arg,
      cateName: catename,
    });
  };
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="#FFF" /> */}
      <Header
        categoryTitle={"Category"}
        search
        backButtonwithtext
        // notification
        navigation
        cart
        cartCountshow={cartCount}
      />
      {/* <ScrollView style={{ flex: 1 }}> */}
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
                onPress={() => {
                  goToCategory(item.pro_cat_id, item.pro_cat_name);
                }}
              >
                <FastImage
                  source={{ uri: item.pro_cat_image }}
                  style={styles.imageround}
                  resizeMode={"cover"}
                />
                <Text style={styles.textFont}>{item.pro_cat_name}</Text>
              </Pressable>
            </View>
          );
        }}
      />
      {/* </ScrollView> */}
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
});

export default CategoryTabScreen;
