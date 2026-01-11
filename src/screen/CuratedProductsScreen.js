import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Badge } from "react-native-elements";
import { Plus } from "react-native-feather";
import { showMessage } from "react-native-flash-message";
import { scale } from "react-native-size-matters";
import bodymatchslider from "../../assets/img/bodymatchslider.png";
import thumsImg from "../../assets/img/thumbs.png";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom.js";
import Header from "../component/Header";
import fonts from "../utils/fonts.js";
import AlertModal from "../component/AlertModal.js";
import { Dropdown } from "react-native-element-dropdown";
import { ca } from "date-fns/locale";
import { ProgressLoader } from "../component/ProgressLoader.js";
import colors from "../utils/colors.js";
import DeviceInfo from "react-native-device-info";
import { apiRequest } from "../services/apiService";

const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const CuratedProductsScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [specialCatId, setSpecialCatId] = useState("");
  const [specialCatIdForSelect, setSpecialCatIdForSelect] = useState("");
  const [page, setPage] = useState(1);
  const [produuctData, setProduuctData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [category, setCategory] = useState([]);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("Body Matched Product");
  const [usertoke, SetUsertoke] = useState();
  const [visibleData, setVisibleData] = useState([]);
  const [productOffer, setProductOffer] = useState([]);
  const [bloodOffer, setBloodOffer] = useState([]);
  const [cartCount, setCartCount] = useState();
  const [showBodyLogin, setShowBodyLogin] = useState(false);
  const [value, setValue] = useState("all");
  const [isFocus, setIsFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isBodyProfile, setIsBodyProfile] = useState(false);

  const data = [{ label: "Loading categories...", value: "0" }];
  const ITEMS_PER_PAGE = 20;
  const flatListRef = useRef(null);
  const getstodata = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    usertoken = JSON.parse(usertoken);
    SetUsertoke(usertoken);
  };

  useEffect(() => {
    getProfile();
    getHomeApi();
    getCartcountAj();
    getProductOffers();
    getBloodOffers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log(
        "INSIDE HEREEEE================================================",
        produuctData?.length
      );
      if (isBodyProfile) {
        getProfile();
        getSpecialcategory("all", " ");
        getCartcountAj();
      }
      return () => {
        // Cleanup code if necessary
      };
    }, [isBodyProfile]) // Add any dependencies here if necessary
  );

  const getProfile = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const settingsGet = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      };

      const { data, status } = await apiRequest(EndUrl.getprofile, settingsGet);

      if (status === 200) {
        let bodyProfile = data.data[0].body_profile == 1 ? true : false;
        setIsBodyProfile(bodyProfile);
      }
    } catch (error) {
      console.error("Profile API Error:", error);
    }
  };

  const getProductOffers = async () => {
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
        EndUrl.productOffer,
        settingsGet
      );

      if (status === 200) {
        setProductOffer(data.data);
      }
    } catch (error) {
      console.error("Product Offers API Error:", error);
    }
  };

  const getBloodOffers = async () => {
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

      const { data, status } = await apiRequest(EndUrl.bloodOffer, settingsGet);

      if (status === 200) {
        setBloodOffer(data.data);
      }
    } catch (error) {
      console.error("Blood Offers API Error:", error);
    }
  };

  const onCloseModal = () => {
    setShowBodyLogin(false);
  };

  const getSpecialcategory = async (special_cat_id, pro_cat_id) => {
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

      const url = `${EndUrl.getAiCategory}?special_cat_id=${special_cat_id}&pro_cat_id=${pro_cat_id}`;
      const { data, status } = await apiRequest(url, settingsGet);

      if (status === 200 && data?.data !== "") {
        setProduuctData(data?.product_data);
        setTopbanner(data?.data);
        setHomrBabber(data?.fixed_banner[0]);
        setVisibleData(data?.product_data?.slice(0, ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Special Category API Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    const nextData = produuctData.slice(0, nextPage * ITEMS_PER_PAGE);
    setVisibleData(nextData);
    setPage(nextPage);
  };

  useEffect(() => {
    getstodata();
  }, []);

  const goToProductDetail = (arg, catename) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };

  const goMenuClick = (arg) => {
    navigation.navigate(arg);
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

  const addProductInCart = async (productDetial) => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Ulogin");
      return;
    }

    try {
      const postpayload = {
        product_id: productDetial.id,
        quantity: 1,
        price: productDetial.price,
      };

      const settingsPost = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify(postpayload),
      };

      const { data, status } = await apiRequest(EndUrl.addtocart, settingsPost);

      if (status === 200) {
        getCartcountAj();
        showMessage({
          message: "Item added successfully in cart list.",
          duration: 2000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: "Please try after some time",
        duration: 3000,
        type: "danger",
      });
      console.error("Add to Cart API Error:", error);
    }
  };

  const goToBodyMatch = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (usertoken) {
      goMenuClick("chatbot");
    } else {
      setShowBodyLogin(true);
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

      const { data, status } = await apiRequest(EndUrl.homeApi, settingsGet);

      if (status === 200) {
        const dropdownData =
          data?.data?.[6]?.mapped_category?.map((item) => ({
            label: item.pro_cat_name,
            value: item.pro_cat_id,
          })) || [];

        setCategory([
          { label: "All categories", value: "all" },
          ...dropdownData,
        ]);
      }
    } catch (error) {
      console.error("Home API Error:", error);
    }
  };

  const handleCategoryFilter = (special_cat_id, category) => {
    if (flatListRef.current) {
      flatListRef?.current?.scrollToOffset({ animated: false, offset: 0 });
    }
    if (special_cat_id == "all") {
      getSpecialcategory("all", category == "all" ? " " : category);
    } else {
      getSpecialcategory(special_cat_id, category == "all" ? " " : category);
    }
  };

  const onRefresh = () => {
    console.log("Refreshing data...");
    setRefreshing(true);
    try {
      getSpecialcategory(specialCatId, value == "all" ? " " : value);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getOpacity = (category) => {
    if (specialCatIdForSelect == "" && category.category == "All") {
      return 1;
    } else if (specialCatIdForSelect == category?.id) {
      return 1;
    } else {
      return 0.7;
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <Header
        categoryTitle={categoryTitle}
        backButtonwithtext
        search
        headerBackButton={false}
        cart
        cartCountshow={cartCount}
      />
      {!isBodyProfile ? (
        <View>
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
                style={{
                  backgroundColor: "white",
                  height: 200,
                  width: "100%",
                }}
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
                Purchase Body Matched products in less than 15 seconds
              </Text>
            </View>
            <ButtonCustom
              color="#F79489"
              title="Body MATCH"
              onPress={() => {
                goToBodyMatch();
              }}
            />
          </View>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {topbanner ? (
            <View style={styles.topBannercontainer}>
              <FlatList
                // initialNumToRender={6}
                horizontal={true}
                style={{
                  paddingTop: 1,
                  marginTop: 1,
                }}
                contentContainerStyle={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                showsHorizontalScrollIndicator={false}
                data={topbanner}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.square}>
                      <Pressable
                        onPress={() => {
                          setSpecialCatId(
                            item.category === "All" ? "all" : item.id
                          );
                          setSpecialCatIdForSelect(item.id);
                          handleCategoryFilter(
                            item.category === "All" ? "all" : item.id,
                            value
                          );
                        }}
                      >
                        {console.log("item.image", item.image)}
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
                          style={[
                            styles.imagetop,
                            { opacity: getOpacity(item) },
                          ]}
                          resizeMode={"cover"}
                        />
                      </Pressable>
                    </View>
                  );
                }}
              ></FlatList>
            </View>
          ) : null}
          {homrBabber ? (
            <Pressable>
              <Image
                source={{ uri: homrBabber.image }}
                style={{
                  height: 65,
                  width: "100%",
                }}
              />
            </Pressable>
          ) : (
            ""
          )}

          <>
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor:
                    value != "all" ? colors.themeColor : colors.white,
                },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {
                  color: value != "all" ? colors.white : colors.black,
                },
              ]}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={[styles.iconStyle, {}]}
              data={category.length > 0 ? category : data}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!isFocus ? "All Categories" : "..."}
              value={value}
              iconColor={value != "all" ? colors.white : colors.black}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setValue(item.value);
                setIsFocus(false);
                handleCategoryFilter(specialCatId, item.value);
              }}
            />
          </>

          <View style={{ flex: 1 }}>
            <View
              style={{
                width: "100%",
                padding: 0,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
              }}
            >
              <FlatList
                ref={flatListRef}
                style={{
                  width: "100%",
                  padding: 0,
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      onRefresh();
                    }}
                    tintColor={colors.primaryColor} // iOS indicator color
                    colors={[colors.primaryColor]} // Android indicator color
                  />
                }
                data={visibleData ?? []}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => goToProductDetail(item.id, categoryTitle)}
                      style={{ width: "50%", padding: 1 }}
                    >
                      <View style={styles.item}>
                        <View>
                          <Image
                            source={{ uri: item.images }}
                            style={{ height: scale(225), width: "100%" }}
                            resizeMode="contain"
                          />
                          <View
                            style={{ position: "absolute", top: 5, left: 5 }}
                          >
                            {item?.offer_image_name !== "" && (
                              <Image
                                source={{ uri: item?.offer_image_name }}
                                style={{ height: 100, width: 80 }}
                                resizeMode="contain"
                              />
                            )}
                          </View>
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

                        <View style={styles.bodymtch}>
                          <Image
                            source={{ uri: item.body_match_image }}
                            style={{
                              justifyContent: "center",
                              minHeight: 40,
                              alignItems: "center",
                              width: "100%",
                            }}
                          />
                        </View>

                        <Text style={styles.brand}>{item.brand_name}</Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={styles.productname}
                        >
                          {item.title}
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
                    </TouchableOpacity>
                  );
                }}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={() => {
                  return (
                    <View
                      style={{
                        width: "100%",
                        height: 300,
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <Text>No Product Found</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </View>
      )}

      {showBodyLogin && (
        <AlertModal
          isVisible={showBodyLogin}
          onClose={onCloseModal}
          navigation={navigation}
        />
      )}
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
    width: scale(70),
    height: scale(75),
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
    height: scale(70),
    width: scale(70),
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
  container: {
    backgroundColor: "white",
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
export default CuratedProductsScreen;
