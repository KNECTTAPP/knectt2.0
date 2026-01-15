import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  SectionList,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { Badge } from "react-native-elements";
import FastImage from "react-native-fast-image";
import { Plus } from "react-native-feather";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import endUrls from "../../api/EndUrl";
import { ImagePath } from "../../assets";
import AlertModal from "../../component/AlertModal";
import Header from "../../component/Header";
import { ProgressLoader } from "../../component/ProgressLoader";
import ShowImageComp from "../../component/ShowImageComp";
import { apiRequest } from "../../services/apiService";
import { hitSlop } from "../../static/constant";
import colors from "../../utils/colors";
import { handleDecimalOfferings } from "../../utils/commonFunctions";
import fonts from "../../utils/fonts";

const productCategory = {
  tea_page: "tea_page",
  flour_page: "flour_page",
  drink_page: "drink_page",
  seed_page: "seed_page",
  snack_page: "snack_page",
};

// 🔹 Reusable Card Component

// 🔹 Profile Header
const ProfileHeader = () => (
  <View style={styles.profileContainer}>
    <View style={styles.labelValueWrapper}>
      <View style={styles.labelValueItemWrapper}>
        <Text style={styles.profileLabel}>Name: </Text>
        <Text style={styles.profileText}>Ankush Kumar</Text>
      </View>
      <View style={styles.labelValueItemWrapper}>
        <Text style={styles.profileLabel}>Email: </Text>
        <Text style={styles.profileText}>akvashist98@gmail.com</Text>
      </View>
    </View>
    <View style={styles.labelValueWrapper}>
      <View style={styles.labelValueItemWrapper}>
        <Text style={styles.profileLabel}>Age: </Text>
        <Text style={styles.profileText}>27</Text>
      </View>
      <View style={styles.labelValueItemWrapper}>
        <Text style={styles.profileLabel}>Gender: </Text>
        <Text style={styles.profileText}>Male</Text>
      </View>
    </View>
  </View>
);

// 🔹 Main Screen
const OfferingsScreen = ({ navigation }) => {
  const [produuctData, setProduuctData] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [topbanner, setTopbanner] = useState([]);
  const [cartCount, setCartCount] = useState();
  const [showBodyLogin, setShowBodyLogin] = useState(false);
  const [isBodyProfile, setIsBodyProfile] = useState(false);
  const [loader, setLoader] = useState(true);
  const [showPremium, setShowPremium] = useState(false);
  const [nutritionList, setNutritionList] = useState([]);
  const [productList, setProductList] = useState({});
  const [bloodTestList, setBloodTestList] = useState({});
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [specialCatId, setSpecialCatId] = useState("");
  const [specialCatIdForSelect, setSpecialCatIdForSelect] = useState("");
  const [page, setPage] = useState(1);
  const [filterData, setFilterData] = useState([]);
  const [category, setCategory] = useState([]);
  const [usertoke, SetUsertoke] = useState();
  const [productOffer, setProductOffer] = useState([]);
  const [bloodOffer, setBloodOffer] = useState([]);
  const [value, setValue] = useState("all");
  const [isFocus, setIsFocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [is_body_profile, setIs_body_profile] = useState(false)

  const flatListRef = useRef(null);

  //Effects *********************************************

  useEffect(() => {
    getOfferingData();
  }, []);
  useEffect(() => {
    getProfile();
    //   getHomeApi();
    getCartcountAj();
    //   getProductOffers();
    //   getBloodOffers();
    getSpecialcategory("all", " ");
  }, []);

  useFocusEffect(
    useCallback(() => {
      getProfile();
      getSpecialcategory("all", " ");
      getCartcountAj();
    }, []) // Add any dependencies here if necessary
  );

  useEffect(() => { getOfferingData() }, [showPremium])

  //Helpers *********************************************
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

      const { data, status } = await apiRequest(
        endUrls.getprofile,
        settingsGet
      );

      if (status === 200) {
        let bodyProfile = data?.data[0]?.body_profile == 1 ? true : false;
        setIsBodyProfile(bodyProfile);
      }
    } catch (error) {
      console.error("Profile API Error:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        // Disable back button
        BackHandler.exitApp();
        return true; // returning true prevents default behavior
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [])
  );

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
      const url = `${endUrls.getAiCategory}?special_cat_id=${special_cat_id}`;
      const { data, status } = await apiRequest(url, settingsGet);
      console.log(status, "special response");
      console.log(`${endUrls.getAiCategory}?special_cat_id=${special_cat_id}`, settingsGet, 'curl')

      if (status === 200 /*&& data?.data !== ""*/) {
        console.log(data, 'my response')
        setProduuctData(data?.product_data);
        // console.log(data,'my topbanner data')
        setTopbanner(data?.data);
        setHomrBabber(data?.fixed_banner[0]);
        // setVisibleData(data?.product_data?.slice(0, ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Special Category API Error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
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

      const { data, status } = await apiRequest(
        endUrls.getcartcount,
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

  const getOfferingData = async (paramList) => {
    setLoader(true);
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log(usertoken, "thisiuserotken");
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
      console.log(`${endUrls.OFFERING_DATA}?${paramList}`, 'my url bill')
      const { data, status } = await apiRequest(
        `${endUrls.OFFERING_DATA}?${paramList}`,
        settingsGet
      );

      console.log(`${endUrls.OFFERING_DATA}?${paramList}`, status, 'data status kill', data)

      if (status === 200) {
        console.log('success of offering')
        let allData = data?.data;
        let profileCheck = data?.is_body_profile;
        setIs_body_profile(profileCheck);
        console.log(allData, 'my all data')
        if (allData?.nutritions) {
          const nutritionListData = [
            {
              key: "smart",
              title: allData?.nutritions?.title,
              description: allData?.nutritions?.desc,
              data: allData?.nutritions?.SmartPlan?.items ?? [],
              pagination: allData?.nutritions?.SmartPlan?.pagination ?? {
                current_page: 1,
                last_page: 1,
                next_page: null,
                next_page_url: null,
                page_key: "smart_page",
                previous_page: null,
                previous_page_url: null,
                total: 0,
              }
            },
            {
              key: "premium",
              title: allData?.nutritions?.title,
              description: allData?.nutritions?.desc,
              data: allData?.nutritions?.PremiumPlan?.items ?? [],
              pagination: allData?.nutritions?.PremiumPlan?.pagination ?? {
                current_page: 1,
                last_page: 1,
                next_page: null,
                next_page_url: null,
                page_key: "premium_page",
                previous_page: null,
                previous_page_url: null,
                total: 0,
              }
            },
          ];
          setNutritionList(nutritionListData);
          console.log('my nutrition', nutritionListData)
        }
        if (allData?.products) {
          const productData = { ...productList, ...allData?.products };
          setProductList(productData);
        }
        if (allData?.bloodTests) {
          console.log(allData?.bloodTests, 'blootest')
          setBloodTestList(allData?.bloodTests);
        }
      }
      setLoader(false);
    } catch (error) {
      console.error("Product Offers API Error:", error);
      setLoader(false);
    }
  };

  const goToBodyMatch = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (usertoken) {
      navigation.replace("TabNavigators", {
        screen: "ChatScreen",
      });
    } else {
      setShowBodyLogin(true);
    }
  };

  const onCloseModal = () => {
    setShowBodyLogin(false);
  };
  const sectionsToRender = showPremium
    ? nutritionList.filter((sec) => sec.key === "premium")
    : nutritionList.filter((sec) => sec.key === "smart");

  const handleShowNext = (acceptParamList) => {
    console.log(acceptParamList, "accepted param list");

    // Append specialCatIdForSelect if available
    if (specialCatIdForSelect && specialCatIdForSelect !== "") {
      acceptParamList.special_cat_id = specialCatIdForSelect;
    }

    const queryString = new URLSearchParams(acceptParamList).toString();
    getOfferingData(queryString);
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

  const addProductInCart = async (productDetial) => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Login");
      return;
    }

    try {
      setLoading(true);
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

      const { data, status } = await apiRequest(
        endUrls.addtocart,
        settingsPost
      );

      if (status === 200) {
        getCartcountAj();
        setLoading(false);
        showMessage({
          message: "Item added successfully in cart list.",
          duration: 2000,
          position: "center",
          icon: (props) => <Image source={ImagePath.thumsImg} {...props} />,
          type: "success",
        });
      }
    } catch (error) {
      showMessage({
        message: "Please try after some time",
        duration: 3000,
        type: "danger",
      });
      setLoading(false);
      console.error("Add to Cart API Error:", error);
    }
  };

  const goToProductDetail = (arg, catename) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };

  // components********************************************
  const OfferCard = ({ item, footer, book = false }) => (
    <TouchableOpacity onPress={() => { goToProductDetail(item?.id, item?.title) }} style={[styles.card, { alignItems: 'flex-end' }]}>
      <ShowImageComp
        source={{ uri: item?.images }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={{ flex: 1, minHeight: 120 }}>
        <Text style={[styles.cardTitle, { marginRight: 20 }]} numberOfLines={2}>
          {item?.title}
        </Text>
        <Text style={[styles.cardSubtitle, { marginRight: 20 }]} numberOfLines={2}>
          {item?.description}
        </Text>
        <Text style={styles.cardPrice}>
          {" "}
          {"\u20B9"} {handleDecimalOfferings(item?.price)}
        </Text>
        <View style={{ marginTop: 'auto' }}>
          {footer}
        </View>
      </View>
      {book ? <TouchableOpacity onPress={(event) => { event.stopPropagation(); goToProductDetail(item?.id, item?.title) }} style={[styles.addButton, { height: 30, width: 60 }]}>
        <Text style={[styles.cardTitle, { color: '#ffffff' }]}>{'Book'}</Text>
      </TouchableOpacity> :
        <TouchableOpacity
          style={styles.addButton}
          hitSlop={hitSlop}
          onPress={(event) => { event.stopPropagation(); addProductInCart(item) }}
        >
          <Plus color={"#ffffff"} strokeWidth={2} width={20} height={20} />
        </TouchableOpacity>}
    </TouchableOpacity>
  );

  const ProductList = ({ products, handleShowNext }) => {
    // Remove title & desc from categories
    const categories = Object.entries(products).filter(
      ([key]) => key !== "title" && key !== "desc"
    );

    return (
      <FlatList
        data={categories}
        keyExtractor={([category]) => category}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{products?.title}</Text>
            <Text style={styles.sectionDescription}>{products?.desc}</Text>
          </View>
        )}
        renderItem={({ item, index }) => {
          const [categoryName, categoryData] = item;
          if (!categoryData || !categoryData?.items) {
            return null; // skip empty categories
          }

          return (
            <View style={[styles.categorySection, index === categories.length - 1 && { borderBottomWidth: 3, borderBottomColor: "#CCCCCC" }]}>
              <Text style={styles.categoryTitle}>{categoryName}</Text>
              <FlatList
                data={categoryData.items}
                keyExtractor={(item, index) =>
                  item?.id?.toString() ?? index.toString()
                }
                renderItem={({ item }) => <OfferCard item={item} footer={
                  (categoryData.pagination?.next_page || categoryData.pagination?.previous_page) && (
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                      {categoryData.pagination?.current_page !== 1 ? <TouchableOpacity
                        style={styles.footer}
                        hitSlop={hitSlop}
                        onPress={() => {
                          if (categoryData.pagination?.current_page - 1 > 0) {
                            handleShowNext({
                              [categoryData.pagination?.page_key]: categoryData.pagination?.current_page - 1,
                            });
                          }
                          console.log({ [categoryData.pagination?.page_key]: categoryData.pagination?.next_page }, 'abc')
                        }}
                      >
                        <Text style={styles.footerText}>{'< Show previous'}</Text>
                      </TouchableOpacity> : <View />}
                      {categoryData.pagination?.next_page_url !== null && <TouchableOpacity
                        style={styles.footer}
                        hitSlop={hitSlop}
                        onPress={() => {
                          handleShowNext({
                            [categoryData.pagination?.page_key]: categoryData.pagination?.next_page,
                          })
                          console.log(categoryData, 'abc')
                        }}
                      >
                        <Text style={styles.footerText}>{'Show next >'}</Text>
                      </TouchableOpacity>}
                    </View>
                  )
                } />}
                ListEmptyComponent={() =>
                  !loader && (
                    <Text style={styles.empty}>No products available</Text>
                  )
                }
              />
              {/* {categoryData.pagination?.next_page && (
                <TouchableOpacity
                  style={styles.footer}
                  hitSlop={hitSlop}
                  onPress={() =>
                    handleShowNext({
                      [categoryData.pagination?.page_key]:
                        categoryData.pagination?.next_page,
                    })
                  }
                >
                  <Text style={styles.footerText}>Show next</Text>
                </TouchableOpacity>
              )} */}
            </View>
          );
        }}
      />
    );
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={['top']}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          {/* <ProfileHeader /> */}
          <Header
            categoryTitle={"Body Matched Product"}
            backButtonwithtext
            headerBackButton={false}
            cart
            cartCountshow={cartCount}
          />
          {/* {!isBodyProfile ? (
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
              <FastImage
                source={ImagePath.bodymatchslider}
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
      ) : ( */}
          <View style={{ flex: 1 }}>
            {topbanner && topbanner.length > 0 ? (
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
                            const queryString = new URLSearchParams({ special_cat_id: item.id }).toString();
                            setSpecialCatId(
                              item.category === "All" ? "all" : item.id
                            );
                            setSpecialCatIdForSelect(item.id);
                            getOfferingData(queryString)
                          }}
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
                          <FastImage
                            source={{ uri: item.image }}
                            style={[styles.imagetop, { opacity: getOpacity(item) }]}
                            resizeMode={"cover"}
                          />
                        </Pressable>
                      </View>
                    );
                  }}
                ></FlatList>
              </View>
            ) : null}
            {homrBabber && isBodyProfile ? (
              <Pressable>
                <FastImage
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
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 15,
                marginTop: 25,
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.playTypeText, !showPremium && styles.highLighted]}
              >
                Smart
              </Text>
              <Switch
                value={showPremium}
                onValueChange={setShowPremium}
                trackColor={{ false: "#d1c4e9", true: "#b39ddb" }}
                thumbColor={showPremium ? colors.white : "#f4f3f4"}
                style={{
                  transform: Platform.OS === "ios"
                    ? [{ scaleX: 1.2 }, { scaleY: 1.2 }]  // smaller on iOS
                    : [{ scaleX: 1.7 }, { scaleY: 1.7 }],
                  marginHorizontal: 20,
                }}
              />
              <Text
                style={[styles.playTypeText, showPremium && styles.highLighted]}
              >
                Premium
              </Text>
            </View>
           {isBodyProfile ? <ScrollView style={styles.container}>
              <SectionList
                sections={sectionsToRender}
                keyExtractor={(item, index) => item?.id ?? index.toString()}
                renderItem={({ item }) => (
                  <OfferCard item={item} footer={
                    (sectionsToRender[0]?.pagination?.next_page ||
                      sectionsToRender[0]?.pagination?.previous_page) ? (

                      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>

                        {/* Previous */}
                        {/* {sectionsToRender[0]?.pagination?.previous_page ? ( */}
                        {sectionsToRender[0]?.pagination?.current_page !== 1 ? <TouchableOpacity
                          style={styles.footer}
                          hitSlop={hitSlop}
                          onPress={() => {
                            if (sectionsToRender[0]?.pagination?.current_page - 1 > 0) {
                              handleShowNext({
                                [sectionsToRender[0]?.pagination?.page_key]:
                                  sectionsToRender[0]?.pagination?.previous_page,
                              })
                            }
                          }
                          }
                        >
                          <Text style={styles.footerText}>{'< Show previous'}</Text>
                        </TouchableOpacity> : <View />}
                        {/* ) : (
        <View />
      )} */}

                        {/* Next */}
                        {/* {sectionsToRender[0]?.pagination?.next_page ? ( */}
                        {sectionsToRender[0]?.pagination?.next_page_url !== null && <TouchableOpacity
                          style={styles.footer}
                          hitSlop={hitSlop}
                          onPress={() =>
                            handleShowNext({
                              [sectionsToRender[0]?.pagination?.page_key]:
                                sectionsToRender[0]?.pagination?.next_page,
                            })
                          }
                        >
                          <Text style={styles.footerText}>{'Show next >'}</Text>
                        </TouchableOpacity>}
                        {/* ) : (
        <View />
      )} */}

                      </View>

                    ) : null
                  }

                    addProductInCart={addProductInCart} />
                 )}
                 renderSectionHeader={({ section: { title, description, key } }) => (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{title + " " + key}</Text>
                    <Text style={styles.sectionDescription}>{description}</Text>
                  </View>
                )}
                renderSectionFooter={({ section }) =>
                  section.data.length === 0 ? (
                    <View style={{ padding: 20, alignItems: "center" }}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "gray",
                        }}
                      >
                        No data available
                      </Text>
                    </View>
                  ) : null
                }
                scrollEnabled={false}
              />
              <View style={{
                paddingBottom: 0, marginVertical: 10,
                borderWidth: 1,
                borderColor: '#CCCCCC',
              }}></View>
              <ProductList
                products={productList}
                handleShowNext={handleShowNext}
                addProductInCart={addProductInCart}
              />

              <FlatList
                data={Array.isArray(bloodTestList?.data) ? bloodTestList.data : []}
                keyExtractor={(item, index) =>
                  item?.id?.toString() ?? index.toString()
                }
                renderItem={({ item }) => (
                  <OfferCard item={item} book={true} footer={(bloodTestList?.pagination?.next_page || bloodTestList?.pagination?.next_page) ? (
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                      {bloodTestList?.pagination?.current_page !== 1 ? <TouchableOpacity
                        style={styles.footer}
                        hitSlop={hitSlop}
                        onPress={() => {
                          if (bloodTestList?.pagination?.current_page - 1 > 0) {
                            handleShowNext({
                              blood_page: bloodTestList?.pagination?.current_page - 1,
                            });
                          }
                        }}
                      >
                        <Text style={styles.footerText}>{'< Show previous'}</Text>
                      </TouchableOpacity> : <View />}
                      {bloodTestList?.pagination?.next_page_url !== null && <TouchableOpacity
                        style={styles.footer}
                        hitSlop={hitSlop}
                        onPress={() =>
                          handleShowNext({
                            blood_page: bloodTestList?.pagination?.next_page,
                          })
                        }
                      >
                        <Text style={styles.footerText}>{'Show next >'}</Text>
                      </TouchableOpacity>}</View>
                  ) : null} addProductInCart={addProductInCart} />
                )}
                ListHeaderComponent={() => (
                  <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Text style={styles.sectionTitle}>{bloodTestList?.title}</Text>
                    <Text style={styles.sectionDescription}>
                      {bloodTestList?.desc}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 18 }}>No data available</Text>
                  </View>
                )}
                // ListFooterComponent={() =>
                //   bloodTestList?.pagination?.next_page ? (
                //     <TouchableOpacity
                //       style={styles.footer}
                //       hitSlop={hitSlop}
                //       onPress={() =>
                //         handleShowNext({
                //           blood_page: bloodTestList?.pagination?.next_page,
                //         })
                //       }
                //     >
                //       <Text style={styles.footerText}>Show next</Text>
                //     </TouchableOpacity>
                //   ) : null
                // }
                style={{ marginBottom: 40 }}
              />
            </ScrollView>:null}
            {/* <TouchableOpacity
          style={styles.chatContainer}
          onPress={() => alert("comming soon")}
        >
          <Image source={ImagePath.premiumBrandLogo} style={styles.chatIcon} />
          <View
            style={{
              backgroundColor: "purple",
              borderRadius: 12,
              padding: 5,
              paddingRight: 16,
              width: "75%",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              right: -10,
              bottom: 0,
            }}
          >
            <Text style={styles.chatText}>GUIDE</Text>
          </View>
        </TouchableOpacity> */}
          </View>
          {/* )}  */}
          <ProgressLoader isVisible={loader || loading} />
          {showBodyLogin && (
            <AlertModal
              isVisible={showBodyLogin}
              onClose={onCloseModal}
              navigation={navigation}
            />
          )}
        </View>
      </SafeAreaView>
    </>
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: 100,
  },
  profileContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileText: {
    fontSize: 14,
    color: colors._333333,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fonts.whitneyMedium,
    color: colors.themeColor,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.textInputBorderColor,
    marginTop: 2,
    fontFamily: fonts.whitneyMedium,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f8ff",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    // padding: 12,
    // borderWidth: 1.5,
    // borderColor: colors.themeColor,
    // overflow:'hidden'
  },
  cardImage: {
    width: 105,
    height: 140,
    // aspectRatio: 1 / 1,
    // resizeMode:'cover',
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden'
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.whitneySemiBold,
    color: colors.black,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors._666666,
  },
  cardPrice: {
    fontSize: 15,
    fontFamily: fonts.whitneySemiBold,
    marginTop: 8,
    color: colors.black,
  },
  chatContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    backgroundColor: colors.white,
  },
  chatIcon: {
    width: 80,
    height: 80,
  },
  chatText: {
    fontSize: 12,
    fontFamily: fonts.whitneyMedium,
    color: colors.white,
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  labelValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelValueItemWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    flex: 1,
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: -10,
    right: -5,
    zIndex: 999,
    elevation: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  footer: {
    alignItems: "flex-end",
    paddingRight: 5,
    marginVertical: 5,
    marginBottom: 10,
    // alignSelf: "flex-end",
  },
  footerText: {
    fontSize: 15,
    fontFamily: fonts.whitneyMedium,
    marginHorizontal: 8,
    color: colors.black,
  },
  categorySection: {
    // paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors._eeeeee,
  },
  categoryTitle: {
    fontSize: 15,
    fontFamily: fonts.whitneyMedium,
    marginBottom: 8,
    color: colors.black,
    paddingHorizontal: 16,
  },
  empty: {
    fontSize: 13,
    color: "gray",
    textAlign: "center",
    marginVertical: 10,
  },
  playTypeText: {
    fontSize: 14,
    fontFamily: fonts.whitneyMedium,
    color: colors.black,
  },
  highLighted: {
    fontFamily: fonts.whitneySemiBold,
  },
});

export default OfferingsScreen;
