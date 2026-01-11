import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge } from "react-native-elements";
import { showMessage } from "react-native-flash-message";
import { scale } from "react-native-size-matters";
import { Plus } from "react-native-feather";
import thumsImg from "../../assets/img/thumbs.png";
import not_match from "../../assets/img/not_match.jpeg";
import EndUrl from "../api/EndUrl";
import Header from "../component/Header";
import { ProgressLoader } from "../component/ProgressLoader";
import colors from "../utils/colors.js";
import fonts from "../utils/fonts.js";
import { useFocusEffect } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import BodyMatchModal from "../component/CreateProfileModal.js";

const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const CategoryScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [produuctData, setProduuctData] = useState(null);
  const isCarousel = React.useRef(null);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState();
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState([]);
  const [itemText, setItemText] = useState();
  const [bodyMatchbtn, setBbodyMatchbtn] = useState();
  const [userdata, setUserData] = useState([]);
  const [usertoke, SetUsertoke] = useState();
  const [cartCountshow, setCartCountshow] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [nextpage, setNextPage] = useState();
  const [page, setPage] = useState(1);
  const [isload, setIsload] = useState(true);
  const [productOffer, setProductOffer] = useState([]);
  const [bodyMatchImage, setBodyMatchImage] = useState(null);
  const getstodata = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    SetUsertoke(usertoken);
  };
  const [bodyModalVisible, setBodyModalVisible] = useState(false);

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
    const responseuser = await fetch(EndUrl.getprofile, settingsGet);
    const updateAvailable = responseuser.headers.get("updateAvailable");
    const forceUpdate = responseuser.headers.get("forceUpdate");
    if (updateAvailable) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    const jsonuser = await responseuser.json();
    setUserData(jsonuser.data[0]);
  };

  const getSpecialcategory = async () => {
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
      setTopbanner(json.data);
      setHomrBabber(json?.fixed_banner[0]);
      setBbodyMatchbtn(json?.body_match[0]?.image);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCartcountAj();
    }, [])
  );
  const getCategory = async () => {
    console.log("CAT ID:::::", route.params.cateId);
    console.log(EndUrl.productCat + route.params.cateId);
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
      console.log(
        "paylod==>",
        EndUrl.productCat + route.params.cateId + "?page=" + page
      );
      const response = await fetch(
        EndUrl.productCat + route.params.cateId + "?page=" + page,
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
      if (bodyMatchImage == null) {
        setBodyMatchImage(json);
      }

      console.log("resp-->", json);

      if (json.data.to <= json.data.total) {
        if (page > 1) {
          var oldata = produuctData;
          oldata.push(...json.data.data);
          setProduuctData(oldata || []);
        } else {
          setProduuctData(json?.data?.data || []);
        }
        setNextPage(json.data.next_page_url);

        setCategoryTitle(route.params.cateName);
        setItemText(json.summary.total_products + " items");
        setPage((page) => page + 1);
      } else {
        setIsload(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

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
      const apiUrl =
        route.params.cateId == 12 ? EndUrl.bloodOffer : EndUrl.productOffer;
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
      console.log("resp PRODUCT OFFERS-->", json);
      setLoading(false);
    } catch (error) {
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

        console.log("CARETD SMDJSNDBJS DCOUNR:::::", json);
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
    // const unsubscribe = navigation.addListener("focus", () => {
    //   getstodata();
    //   getProfileData();
    //   getCategory();
    //   getSpecialcategory();
    //   getCartcountAj();
    // });
    // return unsubscribe;
    //setLoading(false);

    getstodata();
    getProfileData();
    getCategory();
    getSpecialcategory();
    getCartcountAj();
    if (route.params.cateId == 8) {
      setProductOffer([]);
    } else {
      getProductOffers();
    }
  }, []);

  // const toggleModal = (id, openModal) => {
  //   setLoading(openModal);
  //   setLoading(false);
  //   setModalVisible(!isModalVisible);
  // };

  const goMenuClick = (arg) => {
    navigation.navigate(arg);
  };

  const goToProductDetail = (arg, catename) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };

  const goToCategory = (arg, catename) => {
    navigation.navigate("MainCategory", {
      cateId: arg,
      cateName: catename,
    });
  };

  // const fetchMore = async () => {
  //   if (nextpage) {
  //     try {
  //       setLoading(true);
  //       let usertoken = await AsyncStorage.getItem("usertoken");
  //       const settingsGet = {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //           "Content-Type": "application/json",
  //           token: JSON.parse(usertoken),
  //         },
  //       };
  //       const response = await fetch(nextpage, settingsGet);
  //       const json = await response.json();
  //       const newData = json.data.data;
  //       console.log(newData);

  //       //setProduuctData(json.data.data);
  //       //setProduuctData({...produuctData, ...newData});
  //       setNextPage(json.data.next_page_url);

  //       setCategoryTitle(route.params.cateName);
  //       setItemText(json.summary.total_products + " items");
  //       setLoading(false);
  //     } catch (error) {
  //       console.log(error);
  //       setLoading(false);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  // };

  const navigationData = () => {
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      navigation.navigate("chatbot");
    }
  };

  const win = Dimensions.get("window");
  const height = win.height;
  console.log("categoryTitle->", categoryTitle);

  const _onEndReached = () => {
    console.log("onEndReached");
    getCategory();
  };

  const addProductInCart = async (productDetial) => {
    var postpayload = {
      product_id: productDetial.id,
      // offer_id: productDetial.id,
      quantity: 1,
      price: productDetial.price,
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
        getCartcountAj();

        console.log("SHVDHVSDHVSHS:::", json);
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

  const checkBodyMatchProduct = async (productID) => {
    setLoading(true);
    var postpayload = {
      product_id: productID,
    };

    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Ulogin");
    } else {
      try {
        const response = await fetch(EndUrl.CHECK_BODY_MATCH, {
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
        if (response?.status == 200 && json?.body_match_profile) {
          const oldData = [...produuctData];
          const newData = oldData.map((item) => {
            if (item.id == productID) {
              return { ...item, bodyMatchDetail: json };
            }
            return item;
          });
          setProduuctData(newData || []);
        }
        if (response?.status === 200 && !json?.body_match_profile) {
          setTimeout(() => {
            setBodyModalVisible(!json?.body_match_profile);
          }, 500);
        }
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
        categoryTitle={categoryTitle}
        itemText={itemText}
        search
        cartCountshow={cartCountshow}
        backButtonwithtext
        // notification
        cart
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
                        source={{ uri: item?.image }}
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
        <Pressable onPress={() => navigationData()}>
          <Image
            source={{ uri: homrBabber?.image }}
            style={{ height: 75, width: "100%", paddingTop: 10, marginTop: 3 }}
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
        {/* {produuctData?.length == 0 ? (
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
                Purchase AI-matched products in less than 15 seconds
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

            <ButtonCustom
              title="Body Match"
              onPress={() => {
                navigationData();
              }}
            />
          </View>
        ) : null} */}

        <FlatList
          //p={getCategory}
          onEndReachedThreshold={0.5}
          onEndReached={_onEndReached}
          style={{
            width: "100%",
            paddingHorizontal: 10,
          }}
          data={produuctData}
          numColumns={2}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={{ width: "50%" }}>
                <View style={styles.item}>
                  <View>
                    <TouchableOpacity
                      onPress={() => goToProductDetail(item.id, item.title)}
                    >
                      <Image
                        source={{ uri: item?.images }}
                        style={{ height: scale(200), width: "100%" }}
                        resizeMode="contain"
                      />
                      <View style={{ position: "absolute", top: 5, left: 5 }}>
                        {item?.offer_image_name !== "" && (
                          <Image
                            source={{ uri: item?.offer_image_name }}
                            style={{ height: 100, width: 80 }}
                            resizeMode="contain"
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                    {item?.product_character !== "blood_test" && (
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

                  {/* {item.body_match_image ? (
                  <View style={styles.bodymtch}>
                    <TouchableOpacity
                      style={{ width: "100%", display: "flex" }}
                      onPress={() => {
                        navigationData();
                      }}
                    >
                      <View style={styles.bodyMatchTextWrapper}>
                        <View style={styles.bodyMatchTextSecondWrapper}>
                          <Text style={styles.bodyMatchTextStyle}>
                            Body Match Product
                          </Text>
                        </View>
                      </View>
                      <Image
                        source={{ uri: item?.body_match_image }}
                        style={{
                          justifyContent: "center",
                          minHeight: 40,
                          alignItems: "center",
                          width: "100%",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                   ) : null}  */}
                  {item?.product_character == "products" &&
                    (item?.bodyMatchDetail &&
                    item?.bodyMatchDetail?.response_image_text ? (
                      <View style={[styles.bodymtch]}>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 40,
                          }}
                        >
                          <View style={styles.bodyMatchTextWrapper}>
                            <View style={styles.bodyMatchTextSecondWrapper}>
                              <Text style={styles.bodyMatchTextStyle}>
                                {item?.bodyMatchDetail?.response_image_text}
                              </Text>
                            </View>
                          </View>
                          <Menu>
                            <MenuTrigger>
                              <Image
                                source={{
                                  uri: item?.bodyMatchDetail?.info_icon,
                                }}
                                style={{
                                  height: 38,
                                  width: 38,
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
                                      fontFamily: fonts.whitneySemiBold,
                                      lineHeight: 14.5,
                                    },
                                  ]}
                                >
                                  {item?.bodyMatchDetail?.response_info}
                                </Text>
                              </MenuOption>
                            </MenuOptions>
                          </Menu>
                        </View>
                      </View>
                    ) : bodyMatchImage?.body_match_this_pro_image ? (
                      <View style={[styles.bodymtch]}>
                        <TouchableOpacity
                          style={{
                            alignItems: "center",
                            height: 40,
                            transform: [
                              {
                                scale: 1.3,
                              },
                            ],
                          }}
                          onPress={() => checkBodyMatchProduct(item?.id)}
                        >
                          <Image
                            source={{
                              uri: bodyMatchImage?.body_match_this_pro_image,
                            }}
                            style={{ height: 40, width: "100%" }}
                            resizeMode="cover"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null)}
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
                    {productOffer.length > 0 && (
                      <View>
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
                  </View>
                </View>
              </View>
            );
          }}
        ></FlatList>
      </View>
      <BodyMatchModal
        isVisible={bodyModalVisible}
        setBodyModalVisible={() => setBodyModalVisible(!bodyModalVisible)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  bodymtch: {
    // justifyContent: "center",
    // alignItems: "center",
    // flex: 1,
    // minHeight: 40,
    // width: "auto",
    // marginHorizontal: 6,

    width: "100%",
    marginTop: 10,
    marginBottom: 5,
  },
  bodyMatchTextWrapper: {
    borderRadius: 30,
    backgroundColor: "#fff",
    backgroundColor: "#F79489",
    // width: "50%",
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
    marginBottom: 2,
    marginHorizontal: 2,
    marginTop: -2,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyMatchTextStyle: {
    fontSize: scale(10),
    // fontFamily: fonts.whitneySemiBold,
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(10),
    color: "#535665",
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
    marginTop: 5,
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
    marginBottom: 15,
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
  addToCart: {
    width: "90%",
    height: scale(35),
    borderColor: colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 10,
    borderWidth: 1.5,
  },
  cartText: {
    color: colors.primaryColor,
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(13),
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
  addIconTxt: {
    fontSize: scale(20),
    color: "white",
    fontFamily: fonts.whitneyMedium,
  },
  offerHeading: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(12),
    color: "#D1A454",
    marginTop: scale(10),
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
export default CategoryScreen;
