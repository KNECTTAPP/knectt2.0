import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { SearchBar } from "react-native-elements";
import { Plus } from "react-native-feather";
import Feather from 'react-native-vector-icons/Feather';
import FlashMessage, { showMessage } from "react-native-flash-message";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-simple-toast";
import { scale } from "react-native-size-matters";
import thumsImg from "../../assets/img/thumbs.png";
import EndUrl from "../api/EndUrl";
import BodyMatchModal from "../component/CreateProfileModal";
import Header from "../component/Header";
import { ProgressLoader } from "../component/ProgressLoader";
import SearchTextComp from "../component/SearchTextComp";
import { fetchSearchList } from "../services";
import colors from "../utils/colors";
import fonts from "../utils/fonts";

const SearchScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Search");
  const [produuctData, setProduuctData] = useState([]);
  const [searchValue, setSearchValue] = useState();
  const [lastPage, setLastPage] = useState(null);
  const [page, setPage] = useState(1);
  const [userdata, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchList, setSearchList] = useState([]);
  const [productOffer, setProductOffer] = useState([]);
  const [bloodOffer, setBloodOffer] = useState([]);
  const [cartCount, setCartCount] = useState();
  const [visibleData, setVisibleData] = useState([]);
  const ITEMS_PER_PAGE = 20;
  const [hideSearchList, setHideSearchList] = useState(false);
  const timeoutId = useRef(null);
  const [bodyModalVisible, setBodyModalVisible] = useState(false);
  const [bodyMatchImage, setBodyMatchImage] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const gotoSpecialCategory = (categoryid) => {
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      navigation.navigate("chatbot");
    }
  };

  const win = Dimensions.get("window");
  var serachdata = [];
  var i = 0;

  useEffect(() => {
    getProductOffers();
    getBloodOffers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getCartcountAj();
    }, [])
  );

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
      console.log("resp PRODUCT OFFERS-->", json);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
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
      console.log("resp BLOOD PRODUCT OFFERS-->", json.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const searchFunction = async (text, page) => {
    setSearchValue(text);
    setLoading(true);
    setHideSearchList(false);
    const productCharacter = ["products", "blood_test", "nutrition"];
    i++;
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      var body = new FormData();
      body.append("search", text);
      body.append("name", "search");
      body.append("product_character", productCharacter[selectedFilter]);
      console.log(body, "its body h");
      const response = await fetch(EndUrl.getsearchproducts + "?page=" + page, {
        method: "POST",
        headers: {
          Accept: "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body,
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
      setLoading(false);
      if (json?.status == 200) {
        console.log("AHVHAVSHAS:::", JSON.stringify(json));
        //setLoading(false);
        if (bodyMatchImage == null) {
          setBodyMatchImage(json);
        }
        serachdata.push(json?.data?.data);
        console.log("Resu==>", json);
        if (page == 1) {
          setProduuctData(json?.data?.data);
          setVisibleData(json?.data?.data);
        } else {
          setProduuctData((prevData) => [...prevData, ...json?.data?.data]);
          setVisibleData((prevData) => [...prevData, ...json?.data?.data]);
        }

        setLastPage(json?.data?.last_page);
        if (json?.data?.data?.length == 0) {
          Toast.show("No Data Found", Toast.SHORT);
        }
      } else {
        Toast.show(json?.message, Toast.SHORT);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const searchDebounce = async (text) => {
    // setLoading(true);
    const productCharacter = ["products", "blood_test", "nutrition"];
    setHideSearchList(true);
    setSearchValue(text);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(async () => {
      const res = await fetchSearchList({
        text: text,
        product_character: productCharacter[selectedFilter],
      });
      setSearchList(res);
      console.log("dd-->", res);
    }, 300);
  };

  const loadMore = () => {
    console.log("INSIDE LOAD MORE", page, lastPage);
    // const nextPage = page + 1;
    // const nextData = produuctData.slice(0, nextPage * ITEMS_PER_PAGE);

    // setVisibleData(nextData);
    // setPage(nextPage);
    if (page < lastPage) {
      setPage((prevPage) => prevPage + 1); // Increment the page number
      searchFunction(searchValue, page + 1);
    }
  };
  const goMenuClick = (arg) => {
    navigation.navigate(arg);
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
    if (updateAvailable) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    const json = await response.json();
    setUserData(json.data[0]);
  };
  const getCartcountAj = async () => {
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
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(json.count ?? "")
        );
        setCartCount(json.count);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
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

  useEffect(() => {
    setLoading(false);
    getProfileData();
  }, [navigation]);

  const onMomentumScrollEnd = async ({ nativeEvent }) => {
    // the current offset, {x: number, y: number}
    const position = nativeEvent.contentOffset;
    // page index
    const index = Math.round(nativeEvent.contentOffset.y);

    if (win.height < index - 600) {
    }
  };
  const goToProductDetail = (arg) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
    });
  };
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const _renderItem = ({ item }) => {
    return (
      <SearchTextComp
        title={item}
        onPress={() => {
          Keyboard.dismiss();
          setPage(1);
          setProduuctData([]);
          setVisibleData([]);
          searchFunction(item, page);
        }}
      />
    );
  };

  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text>Data not available</Text>
      </View>
    );
  };

  const checkBodyMatchProduct = async (productID) => {
    setLoading(true);
    var postpayload = {
      product_id: productID,
    };

    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Login");
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
        console.log(response, "its json data");
        const json = await response.json();
        if (response?.status == 200 && json?.body_match_profile) {
          const oldData = [...visibleData];
          const newData = oldData.map((item) => {
            if (item.id == productID) {
              return { ...item, bodyMatchDetail: json };
            }
            return item;
          });
          setVisibleData(newData || []);
        }
        if (response?.status === 200 && !json?.body_match_profile) {
          setTimeout(() => {
            setBodyModalVisible(!json?.body_match_profile);
          }, 500);
        }
        // setProduuctData(newData || []);
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

  const buttonList = [
    {
      action: () => setSelectedFilter(0),
      text: "Products",
    },
    {
      action: () => setSelectedFilter(1),
      text: "Blood Tests",
    },
    {
      action: () => setSelectedFilter(2),
      text: "Nutrition Plans",
    },
  ];

  // useEffect(() => {
  //   if (selectedFilter != null && selectedFilter != undefined) {
  //     Keyboard.dismiss();
  //     setPage(1);
  //     setProduuctData([]);
  //     setVisibleData([]);
  //     searchFunction("", page);
  //     // Alert.alert(selectedFilter.toString())
  //   }
  // }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <FlashMessage />
      <Header
        categoryTitle={categoryTitle}
        backButtonwithtext
        cartCountshow={cartCount}
        cart
        backButtonCustomFun={() => {
          if (selectedFilter != null) {
            Keyboard.dismiss();
            setSelectedFilter(null);
            setProduuctData([]);
            setVisibleData([]);
            setPage(1);
            setSearchValue("");
          } else {
            navigation.goBack();
          }
        }}
      />
      {selectedFilter == null || selectedFilter == undefined ? (
        <View style={styles.searchFilterWrapper}>
          <Text style={styles.searchTextStyle}>Search In</Text>
          <View style={styles.filterbuttonStyle}>
            {buttonList.map((item, index) => {
              const islast = index == buttonList?.length - 1;
              const isSelectedThisItem = selectedFilter == index;
              return (
                <TouchableOpacity
                  onPress={item?.action}
                  style={[
                    styles.optionButtonStyle,
                    index == 0 && { marginRight: 10 },
                    islast && { marginBottom: 0 },
                    isSelectedThisItem && {
                      backgroundColor: colors.themeColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionButtonTextStyle,
                      isSelectedThisItem && { color: "white" },
                    ]}
                  >
                    {item?.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <>
          {/* <ScrollView style={{ flex: 1 }} onMomentumScrollEnd={onMomentumScrollEnd}> */}

          <View
            style={{
              width: "100%",
              marginTop: 5,
              marginLeft: 0,
              marginRight: 0,
              padding: 10,
            }}
          >
            <SearchBar
              placeholder="Search Here..."
              lightTheme
              round
              barStyle="black"
              searchIcon={<Feather
                name={"search"}
                style={{
                  color: "#424553",
                  fontSize: 18,
                }}
              />}
              clearIcon={{ name: "x-circle", type: "feather", color: "#424553" }}

               platform="default"
               onClear={() => setSearchValue("")}
              inputStyle={{ backgroundColor: "white" }}
              containerStyle={{
                backgroundColor: "white",
                borderRadius: 50,
                elevation: 10,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                borderColor: "#000",
              }}
              inputContainerStyle={{ backgroundColor: "white" }}
              placeholderTextColor={"#g5g5g5"}
              value={searchValue}
              onChangeText={(text) => searchDebounce(text)}
              autoCorrect={true}
              onEndEditing={() => {
                setPage(1);
                searchFunction(searchValue, 1);
              }}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            {hideSearchList && (
              <FlatList
                data={searchList}
                renderItem={_renderItem}
                keyExtractor={(item, index) => index.toString()}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>

          <FlatList
            style={{
              width: "100%",
              padding: 10,
            }}
            data={visibleData ?? []}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => {
              return (
                <View
                  style={{
                    width: "50%",
                    padding: 1,
                  }}
                >
                  <View style={styles.item}>
                    <View>
                      <TouchableOpacity
                        onPress={() => goToProductDetail(item.id)}
                      >
                        <Image
                          source={{ uri: item.images }}
                          style={{ height: scale(225), width: "100%" }}
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
                      {item?.category != 12 && (
                        <TouchableOpacity
                          style={styles.addButton}
                          onPress={() => addProductInCart(item)}
                        >

                          <Feather
                            name={"plus"}
                            style={{
                              fontSize: 24,
                              color: "#fff",
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>

                    {item?.body_match_image ? (
                      <View style={styles.bodymtch}>
                        <TouchableOpacity
                          style={{ width: "100%", display: "flex" }}
                          onPress={() => {
                            gotoSpecialCategory(1);
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
                      {item?.title}
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
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
          />
        </>
      )}
      {bodyModalVisible && (
        <BodyMatchModal
          visible={bodyModalVisible}
          setBodyModalVisible={() => setBodyModalVisible(!bodyModalVisible)}
          navigation={navigation}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
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
    fontWeight: "400",
    marginLeft: 6,
    margin: 2,
    paddingRight: 15,
  },
  priceholder: {
    fontSize: scale(14),
    margin: 2,
    marginBottom: 10,
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
  emptyContainer: {
    flex: 1,
    height: 400,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: fonts.whitneySemiBold,
    fontSize: scale(10),
    color: "#535665",
  },
  searchFilterWrapper: {
    borderRadius: 20,
    padding: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    marginHorizontal: 10,
    alignItems: "center",
    borderColor: colors.themeColor,
    marginTop: 15,
  },
  searchTextStyle: {
    fontSize: scale(14),
    color: "#000",
    fontFamily: fonts.whitneyMedium,
    marginBottom: 10,
  },
  filterbuttonStyle: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  optionButtonStyle: {
    width: "48%",
    borderWidth: 1,
    borderColor: "green",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    marginBottom: 10,
  },
  optionButtonTextStyle: {
    fontSize: scale(13),
    color: "#000",
    fontFamily: fonts.whitneyMedium,
  },
});
