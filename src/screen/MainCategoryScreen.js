import React, { useState, Component, useEffect } from "react";
import {
  Platform,
  View,
  Button,
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
import HTMLView from "react-native-htmlview";
import { Badge, Icon, withBadge } from "react-native-elements";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import NumericInput from "react-native-numeric-input";
import Header from "../component/Header";
import MainCategory from "../component/MainCategory";
import bodymatchslider from "../../assets/img/bodymatchslider.png";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts.js";
import thumsImg from "../../assets/img/thumbs.png";

import { ButtonCustom } from "../component/ButtonCustom.js";
import colors from "../utils/colors.js";
import { Plus } from "react-native-feather";
import { showMessage } from "react-native-flash-message";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";

const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const MainCategoryScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState();
  const [id, setId] = useState();
  //const {cateId} = route.params;
  const [cateId, setCateId] = useState(route.params.cateId);
  const [produuctData, setProduuctData] = useState([]);
  const isCarousel = React.useRef(null);
  const [categoryTitle, setCategoryTitle] = useState("Categories");
  const [topbanner, setTopbanner] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [homrBabber, setHomrBabber] = useState();
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [cartCountshow, setCartCountshow] = useState();
  const [page, setPage] = useState(1);
  const [isload, setIsload] = useState(true);
  const [productOffer, setProductOffer] = useState([]);
  const [bloodOffer, setBloodOffer] = useState([]);

  const getJubleCategory = async () => {
    try {
      setLoading(true);
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
      console.log(EndUrl.productCat + route.params.cateId + "?page=" + page);
      const response = await fetch(
        EndUrl.gloabalurl +
          "getspecialcategoryproducts/" +
          route.params.cateId +
          "?page=" +
          page,
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
      console.log(page);
      console.log(json.data.next_page_url);
      if (json.data.next_page_url != null) {
        if (page > 1) {
          var oldata = produuctData;
          oldata.push(...json.data.data);
          setProduuctData(oldata);
        } else {
          setProduuctData(json.data.data);
        }

        setPage((page) => page + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
      setCategoryTitle(route.params.cateName);
      setTopbanner(json.data);
      setHomrBabber(json?.fixed_banner[0]);
      setLoading(false);
      //setFooterTextdesc(json.footer_text[0].content);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
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
    });
    return unsubscribe;
    setLoading(false);
  }, [navigation]);

  useEffect(() => {
    getProductOffers();
    getBloodOffers();
  }, []);
  const getProductOffers = async () => {
    try {
      setLoading(true);
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
      const apiUrl = EndUrl.productOffer;
      const response = await fetch(apiUrl, settingsGet);
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
      setProductOffer(json.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Function to get blood offers.
   * This function will make a GET request to the EndUrl.bloodOffer API
   * and set the response to the state variable bloodOffer.
   * If there is an error, it will log the error to the console and set
   * the loading state to false.
   */
  /******  4de83848-06e3-4533-83f9-7c6a14650b8b  *******/
  const getBloodOffers = async () => {
    try {
      setLoading(true);
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
      const apiUrl = EndUrl.bloodOffer;
      const response = await fetch(apiUrl, settingsGet);
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
      setBloodOffer(json.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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
    setLoading(true);
    navigation.replace("MainCategory", {
      cateId: arg,
      cateName: catename,
    });
  };

  const goToProductDetail = (arg, catename) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };

  const win = Dimensions.get("window");

  const addProductInCart = async (productDetial) => {
    var postpayload = {
      product_id: productDetial.id,
      // offer_id: productDetial.id,
      quantity: 1,
      price: productDetial.price,
    };
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Login");
    } else {
      try {
        const response = await fetch(EndUrl.addtocart, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: JSON.parse(usertoken),
            Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
            Platform: Platform.OS,
          },
          body: JSON.stringify(postpayload),
        });
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        getCartcountAj();
        showMessage({
          message: "Item added successfully in cart list.",
          duration: 2000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });
      } catch (error) {
        showMessage({
          message: "Please try after some time",
          duration: 3000,
          type: "danger",
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
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
        <Pressable onPress={() => navigation.navigate("Chat")}>
          <Image
            source={{ uri: homrBabber.image }}
            style={{ height: 75, width: "100%", paddingTop: 30, marginTop: 3 }}
          />
        </Pressable>
      ) : null}
      <View
        style={{
          width: "100%",
          padding: 0,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          flex: 1,
        }}
      >
        {produuctData.length == 0 ? (
          <View
            style={{
              width: "100%",
              padding: 5,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <View>
              <Image
                source={bodymatchslider}
                style={{ backgroundColor: "white", height: 200, width: "100%" }}
                resizeMode={"cover"}
              />
            </View>
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
              <Text
                style={{
                  width: "100%",
                  padding: 5,
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Purchase Body-matched products in less than 15 seconds
              </Text>
              <Text
                style={{
                  width: "100%",
                  padding: 5,
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                  fontSize: 18,
                  textAlign: "center",
                }}
              >
                Plus FREE Delivery
              </Text>
            </View>
            {/* <Button
              color="#F79489"
              title="Body Match"
              onPress={() => {
                navigationData();
              }}
            /> */}
            <ButtonCustom
              title="Body Match"
              onPress={() => {
                navigationData();
              }}
            />
          </View>
        ) : null}
        <FlatList
          onEndReached={getJubleCategory}
          onEndReachedThreshold={0.1}
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
              <View style={{ width: "50%" }}>
                <View style={styles.item}>
                  <View>
                    <TouchableOpacity
                      onPress={() => goToProductDetail(item.id, item.title)}
                    >
                      <Image
                        source={{ uri: item.images }}
                        style={{ height: scale(225), width: "100%" }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                    {item?.category != 12 && (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addProductInCart(item)}
                      >
                        <Plus
                          color={"#ffffff"}
                          strokeWidth={2}
                          width={20}
                          height={20}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {item.body_match_image ? (
                    <View style={styles.bodymtch}>
                      <TouchableOpacity
                        style={{ width: "100%", display: "flex" }}
                        onPress={() => {
                          navigationData();
                        }}
                      >
                        <Image
                          source={{ uri: item.body_match_image }}
                          style={{
                            justifyContent: "center",
                            minHeight: 40,
                            alignItems: "center",
                            width: "100%",
                          }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}
                  <Text style={styles.brand}>{item.brand_name}</Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.productname}
                  >
                    {item?.title.trim()}
                  </Text>
                  <View style={styles.priceholder}>
                    {item.cutting_price ? (
                      <Text>
                        <Text style={styles.cutoffprice}>
                          {"\u20B9"}
                          {item.cutting_price}
                        </Text>{" "}
                        <Text style={styles.price}>
                          {"\u20B9"}
                          {item.price}{" "}
                        </Text>
                        <Text style={styles.discountPercentage}>
                          {" "}
                          ({item.discount} OFF){" "}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={styles.price}>
                        {"\u20B9"}
                        {item.price}{" "}
                        <Text style={styles.discountPercentage}>
                          ({item.discount} OFF)
                        </Text>
                      </Text>
                    )}
                  </View>
                  {item.category != 8 &&
                    item.category != 12 &&
                    productOffer.length > 0 && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.offerHeading}>
                          {productOffer[0]?.heading}
                        </Text>
                        <Text style={styles.offerSubHeading}>
                          {productOffer[0]?.sub_heading}
                        </Text>
                        <Text style={styles.offerFreeHeading}>
                          {productOffer[1]?.heading}
                        </Text>
                      </View>
                    )}
                  {item.category != 8 &&
                    item.category == 12 &&
                    bloodOffer.length > 0 && (
                      <View style={{ marginBottom: 10 }}>
                        <Text style={styles.offerHeading}>
                          {bloodOffer[0]?.heading}
                        </Text>
                        <Text style={styles.offerSubHeading}>
                          {bloodOffer[0]?.sub_heading}
                        </Text>
                        <Text style={styles.offerFreeHeading}>
                          {bloodOffer[1]?.heading}
                        </Text>
                      </View>
                    )}
                </View>
              </View>
            );
          }}
        ></FlatList>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  bodymtch: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    minHeight: 40,
    width: "auto",
  },
  topBannercontainer: {
    width: "100%",
    height: scale(90),
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    borderWidth: 0.2,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    flex: 1,
    borderColor: "#CCC",
  },
  discountPercentage: {
    color: "#ff905a",
    marginLeft: 5,
    padding: 5,
    fontWeight: "400",
    fontFamily: fonts.whitneyMedium,
  },
  square: {
    paddingTop: 0,
    justifyContent: "center",
    width: scale(90),
    height: scale(90),
  },
  linearGradient: {
    margin: 2,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    color: "#FFF",
    width: scale(150),
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    padding: 5,
    backgroundColor: "transparent",
  },
  imageBox: {},
  productimage: {
    width: "100%",
    height: 300,
  },
  price: {
    fontWeight: "bold",
    fontFamily: fonts.whitneyMedium,
  },
  cutoffprice: {
    marginLeft: 5,
    paddingLeft: 5,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontFamily: fonts.whitneyMedium,
    color: "#7e818c",
    marginRight: 10,
  },
  brand: {
    margin: 2,
    fontFamily: fonts.whitneyMedium,
    paddingRight: 15,
    marginLeft: 6,
    fontWeight: "400",
    color: "#282c3fba",
    fontSize: scale(15),
  },
  price: {
    color: "#282C3F",
    fontFamily: fonts.whitneyMedium,
  },
  productname: {
    color: "#535665",
    fontFamily: fonts.whitneyLight,
    fontSize: scale(12),
    lineHeight: scale(18),
    fontWeight: "400",
    marginLeft: 6,
    // margin: 2,
    paddingRight: 15,
  },
  priceholder: {
    fontSize: scale(14),
    margin: 2,
    marginBottom: 20,
    marginLeft: 6,
    fontFamily: fonts.whitneyMedium,
    paddingRight: 0,
    flex: 1,
  },
  productlayout: {},
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
  imageholder: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    margin: 5,
  },
  imagetop: {
    height: scale(85),
    width: scale(85),
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 12,
  },
  image: {
    height: 100,
    width: 100,
  },
  textFont: {
    textAlign: "center",
    width: 100,
  },
  footertext: {
    backgroundColor: "pink",
    textAlign: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    right: 10,
    zIndex: 999,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  offerHeading: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(12),
    color: "#D1A454",
    marginTop: scale(0),
  },
  offerFreeHeading: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(11),
    color: "#535665",
    marginTop: scale(10),
  },
  offerSubHeading: {
    fontFamily: fonts.whitneyBook,
    fontSize: scale(10),
    color: "#535665",
    marginTop: scale(2),
  },
});
export default MainCategoryScreen;
