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
  Share,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import { ImageSlider } from "react-native-image-slider-banner";
import Header from "../component/Header";
import ImageCarousel from "../component/SimilerProductCarousel";
import EndUrl from "../api/EndUrl";
import HTML from "react-native-render-html";
import ViewMoreText from "react-native-view-more-text";
import thumsImg from "../../assets/img/thumbs.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import fonts from "../utils/fonts.js";
import { ButtonCustom } from "../component/ButtonCustom.js";
import { fetchAvailableSlots } from "../services.js";
import { useFocusEffect } from "@react-navigation/native";
import { el } from "date-fns/locale";
import Feather from "react-native-vector-icons/Feather";
import DeviceInfo from "react-native-device-info";
import { IconShare } from "../component/IconComp.js";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import BodyMatchModal from "../component/CreateProfileModal.js";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const ProductDetailScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productDetial, setProductDetial] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState([]);
  const [bannerdata, setBannerData] = useState();
  const [desheight, SetDesheight] = useState(35);
  const [prodetialheight, SetProdetialheight] = useState(70);
  const [offerList, setOfferList] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [similerProduct, setSimilerProduct] = useState([]);
  const [extras, setExtras] = useState([]);
  const [tag, setTag] = useState();
  const [cartCountshow, setCartCountshow] = useState();
  const [bodyMatchbtn, setBbodyMatchbtn] = useState();
  const [applink, setApplink] = useState();
  const [allDeatil, setAllDetail] = useState({});
  const [bodyMatchDetail, setBodyMatchDetail] = useState(null);

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const [bodyModalVisible, setBodyModalVisible] = useState(false);

  useEffect(()=>{
console.log(bodyModalVisible.toString(),'hyeeheheh')
  }),[bodyModalVisible]

  const getAffilate = async () => {
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

      const response = await fetch(EndUrl.ifalreadyaffiliate, settingsGet);
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
      // console.log("JSON  product detail", json);

      if (response.status === 200) {
        if (json?.affiliate_yes_no === 1) {
          setApplink(json.share_link);
        } else {
          setApplink("https://knectt.onelink.me/w0Pq/t111yzpx");
          // setApplink("https://knectt.onelink.me/w0Pq/t111yzpx");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getCartcountAj();
      getAffilate();
    }, [])
  );

  const onShare = async () => {
    try {
      let referenceCode = `${applink}?productId=${route.params.proId}`;
      const result = await Share.share({
        message: referenceCode,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
  };
  // console.log("route->", route);
  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
    //console.log(e.nativeEvent);
  }, []);

  console.log(route.params.proId, "it product id");
  const getProductDetail = async () => {
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
      const response = await fetch(
        EndUrl.proDuctdetial + route.params.proId,
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
      // console.log("pp->", json);
      const imageJson = json?.images;
      let newArray = [];
      if (imageJson && imageJson?.length > 0) {
        imageJson?.map((item) => {
          newArray.push({ img: item?.image_name });
          setBannerData(newArray);
        });
      }

      setProductDetial(json.data[0]);
      setOfferList(json.offers);
      setHighlights(json.highlights);
      setCategoryTitle(productDetial?.title);
      setSimilerProduct(json.related_products);
      setExtras(json.extra_products);
      getCartcountAj();
      setAllDetail(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  console.log(productDetial, "this is product detail");

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
      setBbodyMatchbtn(json?.body_match[0]?.image);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductDetail();
    getSpecialcategory();
    // setLoading(false);
  }, [cartCountshow, route]);

  const toggleModal = (id, openModal) => {
    setLoading(openModal);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };
  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };

  const showDescription = () => {
    SetDesheight("auto");
  };
  const hideDescription = () => {
    SetDesheight(35);
  };

  const gatlineIdset = (id) => {
    if (id == tag) {
      setTag(null);
    } else {
      setTag(id);
    }
  };
  const addProductInCart = async () => {
    var postpayload = {
      product_id: productDetial?.id,
      offer_id: tag,
      quantity: 1,
      price: productDetial?.price,
    };
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Ulogin");
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
  const getCartcountAj = async () => {
    try {
      // setLoading(true);
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
        setLoading(false);
        const json = await response.json();
        setCartCountshow(json.count);
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(json.count ?? "")
        );
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const checkBodyMatchProduct = async () => {
    setLoading(true);
    var postpayload = {
      product_id: productDetial?.id,
    };
    let usertoken = await AsyncStorage.getItem("usertoken");
    console.log(usertoken, "its totken");
    if (!usertoken) {
      navigation.replace("Ulogin");
    } else {
      try {
        const header = {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        };
        console.log(header, "its header", postpayload);
        const response = await fetch(EndUrl.CHECK_BODY_MATCH, {
          method: "POST",
          headers: header,
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
        console.log(response, "its respnose");
        const json = await response.json();
        console.log(json, "this is the data i got");
        // if(json?.)
        if (response?.status == 200 && json?.body_match_profile) {
          setBodyMatchDetail(json);
        }
        if (response?.status === 200 && !json?.body_match_profile) {
          // Alert.alert(json?.body_match_profile.toString())
          setTimeout(()=>{
            setBodyModalVisible(true);
          },500)
        }
        // showMessage({
        //   message: "Item added successfully in cart list.",
        //   duration: 2000,
        //   position: "center",
        //   icon: (props) => <Image source={thumsImg} {...props} />,
        //   type: "success",
        // });
      } catch (error) {
        showMessage({
          message: "Please try after some time",
          duration: 3000,
          type: "danger",
        });
        console.error(error, "its error");
      } finally {
        setLoading(false);
      }
    }
  };

  const showHeight = () => {
    SetProdetialheight("100%");
  };
  const hideEight = () => {
    SetProdetialheight(60);
  };

  const win = Dimensions.get("window");

  // console.log("categoryTitle->PD", categoryTitle);

  const _onPressBook = () => {
    navigation.navigate("BloodTestScreen", {
      data: route.params,
      productDetails: productDetial,
    });
  };

  return (
    <View style={{flex:1}}>
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <ProgressLoader isVisible={loading} />
      <Header
        categoryTitle={categoryTitle}
        cartCountshow={cartCountshow}
        backButtonwithtext
        // notification
        cart
      />
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View
          style={{
            width: "100%",
            padding: 5,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.topimage}>
              <ImageSlider
                data={bannerdata}
                autoPlay={false}
                preview={false}
                activeIndicatorStyle={{
                  backgroundColor: "#F79489",
                  width: 10,
                  height: 10,
                }}
                inActiveIndicatorStyle={{
                  backgroundColor: "#fff",
                  width: 10,
                  height: 10,
                }}
                caroselImageStyle={{ resizeMode: "cover", height: scale(400) }}
                closeIconColor="#fff"
                onClick={() => console.log("press")}
              />
              <TouchableOpacity
                onPress={onShare}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  backgroundColor: "#dcdcdc",
                  padding: 10,
                  borderRadius: 50,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                {Platform.OS === "ios" ? (
                  <IconShare />
                ) : (
                  <Feather name="share-2" size={24} color="black" />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.vlaydescript}>
              {productDetial?.product_character == "products" && (
                <View style={[styles.bodymtch]}>
                  {bodyMatchDetail && bodyMatchDetail?.response_image_text ? (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View style={styles.bodyMatchTextWrapper}>
                        <View style={styles.bodyMatchTextSecondWrapper}>
                          <Text style={styles.bodyMatchTextStyle}>
                            {bodyMatchDetail?.response_image_text}
                          </Text>
                        </View>
                      </View>
                      <Menu>
                        <MenuTrigger>
                          <Image
                            source={{ uri: bodyMatchDetail?.info_icon }}
                            style={{
                              height: 43,
                              width: 43,
                            }}
                            resizeMode="cover"
                          />
                        </MenuTrigger>
                        <MenuOptions
                          style={{ minHeight: 30, borderRadius: 10 }}
                        >
                          <MenuOption>
                            <Text
                              style={[
                                styles.productname,
                                {
                                  fontSize: 14,
                                  lineHeight: 14.5,
                                  fontFamily: fonts.whitneySemiBold,
                                },
                              ]}
                            >
                              {bodyMatchDetail?.response_info}
                            </Text>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={{
                        alignItems: "center",
                      }}
                      onPress={checkBodyMatchProduct}
                    >
                      <Image
                        source={{ uri: allDeatil?.body_match_this_pro_image }}
                        style={{
                          height: 40,
                          width: "70%",
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              <Text style={styles.brand}>{productDetial?.brand_name}</Text>
              <Text style={styles.productname}>{productDetial?.title}</Text>
              <View style={styles.priceholder}>
                {productDetial?.cutting_price ? (
                  <Text>
                    <Text style={styles.boldtext}>Special Price </Text>
                    <Text style={styles.cutoffprice}>
                      {"\u20B9"}
                      {productDetial?.cutting_price}
                    </Text>{" "}
                    <Text style={styles.price}>
                      {"\u20B9"}
                      {productDetial?.price}{" "}
                    </Text>
                    <Text style={styles.discountPercentage}>
                      {" "}
                      ({productDetial?.discount} OFF){" "}
                    </Text>
                  </Text>
                ) : (
                  <Text style={styles.price}>
                    {"\u20B9"}
                    {productDetial?.price}{" "}
                  </Text>
                )}
              </View>
              <Text style={styles.brand}>{productDetial?.seller_name}</Text>
              {productDetial?.disclaimer ? (
                <Text style={styles.productdesclimiler}>
                  {productDetial?.disclaimer}*
                </Text>
              ) : null}
              {productDetial?.warranty_details ? (
                <Text style={styles.productnameDescli}>
                  {productDetial?.warranty_details}{" "}
                  {productDetial?.warranty_address ? (
                    <Text
                      onPress={() => {
                        Linking.openURL(productDetial?.warranty_address);
                      }}
                      style={{ textDecorationLine: "underline" }}
                    >
                      {" "}
                      Click here{" "}
                    </Text>
                  ) : null}{" "}
                </Text>
              ) : null}
              {offerList ? (
                <FlatList
                  style={{
                    width: "100%",
                    paddingTop: 1,
                    marginTop: 1,
                    marginLeft: 5,
                    marginRight: 10,
                    paddingRight: 10,
                  }}
                  data={offerList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <Pressable
                        type="clear"
                        onPress={() => gatlineIdset(item.id)}
                        style={
                          item.id == tag ? styles.actoffetag : styles.offetag
                        }
                        title="Add"
                      >
                        <View style={styles.tagRight}>
                          <Text
                            style={
                              item.id == tag
                                ? styles.activetagtext
                                : styles.offetagtext
                            }
                          >
                            {item.tag_line}
                          </Text>
                        </View>
                      </Pressable>
                    );
                  }}
                ></FlatList>
              ) : (
                ""
              )}
            </View>
            <View style={styles.descripholder}>
              <View>
                <Text style={styles.orifinalbold}>Description:</Text>
              </View>
              <View style={{ height: "100%", margin: 2 }}>
                <Text>{productDetial?.description}</Text>
              </View>
              <View>
                {/* {desheight < 37 ? (
                  <Text
                    style={{
                      padding: 6,
                      alignSelf: "flex-end",
                      justifyContent: "center",
                    }}
                    onPress={showDescription}
                  >
                    {" "}
                    Read more..
                  </Text>
                ) : (
                  <Text
                    style={{ adding: 6, alignSelf: "flex-end", height: 40 }}
                    onPress={hideDescription}
                  >
                    Show less
                  </Text>
                )} */}
              </View>
            </View>
          </View>
          <View style={styles.mainContainer}>
            <View>
              <Text style={styles.orifinalbold}>Product Highlights:</Text>
              <View style={{ height: "100%", flex: 1 }}>
                <FlatList
                  style={{
                    width: "100%",
                    paddingTop: 1,
                    marginTop: 1,
                    marginLeft: 5,
                  }}
                  data={highlights}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <View style={styles.highlight}>
                        <View style={styles.helighttext}>
                          <Text>
                            {Platform.OS === "ios" ? (
                              <Text style={{ fontSize: 11 }}>{"\u2B24"}</Text>
                            ) : (
                              "\u2B24"
                            )}{" "}
                            {item.highlight}
                          </Text>
                        </View>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
              {/* {prodetialheight < 67 ? (
                <Text
                  style={{ margin: 4, padding: 6, alignSelf: "flex-end" }}
                  onPress={showHeight}
                >
                  Read more..
                </Text>
              ) : (
                <Text
                  style={{ margin: 4, padding: 6, alignSelf: "flex-end" }}
                  onPress={hideEight}
                >
                  Show less{" "}
                </Text>
              )} */}
            </View>
          </View>
          {/* {console.log("BSBSBSABSNABSNA::::", similerProduct)} */}
          {/* {console.log("categoryTitle::::", categoryTitle)} */}
          {/* {console.log("bodyMatchbtn::::", bodyMatchbtn)} */}

          {similerProduct.length > 0 ? (
            <View>
              <Text style={styles.orifinalbold}>Similar Products:</Text>
              {similerProduct ? (
                <ImageCarousel
                  data={similerProduct}
                  cateName={categoryTitle}
                  bodyMatchbtn={bodyMatchbtn}
                />
              ) : null}
            </View>
          ) : null}
          {extras.length > 0 ? (
            <View>
              <Text style={styles.orifinalbold}>Extra Products:</Text>
              {extras ? (
                <ImageCarousel
                  data={extras}
                  cateName={categoryTitle}
                  bodyMatchbtn={bodyMatchbtn}
                />
              ) : null}
            </View>
          ) : null}
        </View>
        {/* {productDetial?.product_character === "blood_test" && (
          <BloodTestScreen />
        )} */}
      </ScrollView>
      <View
        style={{
          width: "100%",
          padding: 5,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: "2%",
          marginBottom: "2%",
        }}
      >
        {/* <Button
          color="#F79489" mode="outlined" style={{ flex: 1, width: 'auto' }}
          uppercase={false} title="add to cart" onPress={() => addProductInCart()} /> */}

        {productDetial?.product_character === "blood_test" ? (
          <ButtonCustom title="Book" onPress={_onPressBook} />
        ) : (
          <ButtonCustom
            title="Add to cart"
            onPress={() => addProductInCart()}
          />
        )}
      </View>
    </SafeAreaView>
    <BodyMatchModal
     isVisible={bodyModalVisible}
     setBodyModalVisible={() => setBodyModalVisible(!bodyModalVisible)}
     navigation={navigation}
   />
   </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  linetxt: {
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
  },
  tagRight: {
    width: width - 60,
  },
  tagLeft: {
    width: 30,
  },
  topimage: {
    width: "100%",
    height: scale(400),
  },
  brand: {
    margin: 2,
    fontFamily: fonts.whitneyMedium,
    paddingRight: 15,
    marginLeft: 6,
    fontWeight: "500",
    color: "#282c3fba",
    fontSize: scale(16),
  },
  nutiholder: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#000",
    padding: 5,
    flexDirection: "row",
    margin: 4,
    marginTop: 0,
    marginLeft: 2,
    marginRight: 0,
    width: width - 10,
  },
  upwraptx: {},
  highlight: {
    padding: 3,
    margin: 2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  offetag: {
    padding: 5,
    marginVertical: 10,
    backgroundColor: "#cd9f15",
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#FFF",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  activetagtext: {
    color: "#FFF",
  },
  offetagtext: {},
  actoffetag: {
    padding: 5,
    marginVertical: 10,
    backgroundColor: "#132742",
    width: width - 40,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#FFF",
    borderRadius: 2,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
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
  productname: {
    color: "#535665",
    fontFamily: fonts.whitneyLight,
    fontSize: scale(14),
    fontWeight: "400",
    marginLeft: 6,
    margin: 2,
    paddingRight: 15,
  },
  productnameDescli: {
    color: "#535665",
    fontFamily: fonts.whitneyLight,
    fontStyle: "italic",
    fontSize: scale(14),
    fontWeight: "400",
    marginLeft: 6,
    margin: 2,
    paddingRight: 15,
  },
  productdesclimiler: {
    color: "#535665",
    fontFamily: fonts.whitneyLight,
    fontStyle: "italic",
    fontSize: scale(10),
    fontWeight: "400",
    marginLeft: 6,
    margin: 2,
    paddingRight: 15,
  },
  priceholder: {
    fontSize: scale(14),
    margin: 2,
    marginBottom: 6,
    marginLeft: 6,
    fontFamily: fonts.whitneyMedium,
    paddingRight: 0,
    width: "100%",
    flex: 1,
  },
  orifinalbold: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(16),
    flex: 1,
    width: width - 10,
  },
  mainContainer: {
    width: width - 10,
    padding: 6,
    margin: 4,
  },
  descripholder: {
    flex: 1,
    width: width - 10,
    marginTop: 6,
    paddingLeft: 5,
    paddingRight: 5,
  },
  boldtext: {
    fontFamily: fonts.whitneyMedium,
    fontSize: scale(14),
    fontWeight: "800",
    borderColor: "#CCC",
    flex: 1,
    marginLeft: 300,
    padding: 20,
  },
  vlaydescript: {
    flex: 1,
    paddingBottom: 10,
    marginTop: 0,
    width: "100%",
  },
  taglinearrow: {
    alignItems: "flex-end",
    backgroundColor: "#FFF",
    textAlign: "left",
    flex: 1,
  },
  taglinearrowact: {
    alignItems: "flex-end",
    backgroundColor: "#cd9f15",
    textAlign: "left",
    flex: 1,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    borderWidth: 1,
    padding: 5,
    margin: 4,
    fontSize: 18,
    borderColor: "pink",
    color: "#FFF",
    borderRadius: 4,
    backgroundColor: "#FCC6C6",
  },
  addTocart: {
    borderWidth: 1,
    padding: 2,
    textAlign: "center",
    margin: 2,
    borderColor: "pink",
    color: "#FFF",
    borderRadius: 4,
    backgroundColor: "#FCC6C6",
  },
  discountPercentage: {
    color: "#ff905a",
    marginLeft: 5,
    padding: 5,
    fontWeight: "400",
    fontFamily: fonts.whitneyMedium,
  },
  bodymtch: {
    // justifyContent: "center",
    // alignItems: "center",
    // flex: 1,
    // minHeight: 40,
    // width: "auto",
    // marginHorizontal: 6,
    width: "100%",
    // borderWidth: 1,
    marginTop: 10,
    marginBottom: 5,
    // position: "absolute",
    // bottom: 5,
    // left: 20,
    // backgroundColor: "#dcdcdc",
    // padding: 10,
    // borderRadius: 50,
    // elevation: 10,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
  },

  bodyMatchTextWrapper: {
    borderRadius: 30,
    backgroundColor: "#fff",
    backgroundColor: "#F79489",
    width: "50%",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bodyMatchTextSecondWrapper: {
    backgroundColor: "#F8F8F8",
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 3,
    marginHorizontal: 2,
    marginTop: -2,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyMatchTextStyle: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(12),
    color: "#535665",
  },
});
export default ProductDetailScreen;

const optionsStyles = {
  optionsContainer: {
    backgroundColor: "green",
    padding: 5,
  },
  optionsWrapper: {
    backgroundColor: "purple",
  },
  optionWrapper: {
    backgroundColor: "yellow",
    margin: 5,
  },
  optionTouchable: {
    underlayColor: "gold",
    activeOpacity: 70,
  },
  optionText: {
    color: "brown",
  },
};
