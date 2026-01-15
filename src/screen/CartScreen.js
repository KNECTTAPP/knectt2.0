import AsyncStorage from "@react-native-async-storage/async-storage";
import CheckBox from "@react-native-community/checkbox";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  LayoutAnimation,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import FlashMessage, {
  showMessage
} from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import thumsImg from "../../assets/img/thumbs.png";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom";
import CartProductList from "../component/CartProductList";
import Header from "../component/Header";
import { IconArrowDown, IconClose } from "../component/IconComp";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import { handleDecimal } from "../utils/commonFunctions";
import fonts from "../utils/fonts";
const CartScreen = ({ navigation, route }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [walletBalance,setWalletBalance]=useState('0');
  const [refresh, setRefresh] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("Cart");
  const [cartproduct, setCartproduct] = useState([]);
  const [knecttBonus, setKnecttBonus] = useState([]);
  const [userdata, setUserData] = useState([]);
  const [isKnect, setIsknect] = useState();
  const [knectt_bonus_will_apply, setKnecttConusWillApply] = useState(0);
  const [cartCountshow, setCartCountshow] = useState();
  const [cartSummery, setCartsummery] = useState([]);
  const [plan, setPlan] = useState([]);
  const [planImage, setPlanImage] = useState();
  const [id, setId] = useState();
  const [activeplanindex, setActiveplanindex] = useState(0);
  const [planwidht, setPlanwidth] = useState(60);
  const [recommendation, setRecommendation] = useState();
  const [planId, setPlanId] = useState(0);
  const [planlenght, setPlanlenght] = useState(0);
  const [planType, setPlanType] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [read, setRead] = useState([]);
  const [connectexpanded, setConnectexpanded] = useState(false);
  const [on_diet, setOndiet] = useState(0);
  const [on_products, setOnProducts] = useState(0);
  const [on_bloodtest, setOnbloodtest] = useState(0);
  const [usedWalletAmount,setUsedWalletAmount]=useState('');
  const [earned_cashback, setEarnedCashback] = useState(0);
  const [on_wallet,setOnWallet]=useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [cartOffer, setCartOffer] = useState([]);
  const [bloodOffer, setBloodOffer] = useState([]);
  const [on_coupon, setOnCoupon] = useState(0);
  const [couponCodeValue, setCouponCodeValue] = useState("");
  const [isCouponModalVisible, setIsCouponModalVisible] = useState(false);

  const win = Dimensions.get("window");

  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setConnectexpanded(!connectexpanded);
  };

  const getCartOffers = async () => {
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
      const apiUrl = EndUrl.cartOffer;
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
      setCartOffer(json.data);
      console.log("resp PRODUCT OFFERS-->", json);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const getProfileData = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    // console.error(usertoken);
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
    console.log(json,'json')
    setUserData(json.data[0]);
  };

  const goToProductDetail = (arg, catename) => {
    navigation.navigate("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };
  const toggleModal = (id, planType, planImage, openModal) => {
    setLoading(openModal);
    getReadMore(id, planType, planImage);
    setLoading(false);
    setTimeout(() => {
      setModalVisible(!isModalVisible);
    }, 800);
  };
  const navigationData = () => {
    toggleModal();
    if (userdata?.body_profile == 1) {
      navigation.navigate("EditDietProfile");
    } else {
      navigation.navigate("chatbot");
    }
  };

  const RadioButton = ({ onPress, onPressTitle, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressTitle}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const getReadMore = async (id, plan, planImage) => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await fetch(EndUrl.features + id);
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
      // setModalVisible(!isModalVisible);
      setTimeout(() => {
        setModalVisible(!isModalVisible);
      }, 800);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };
  const onRadioBtnClickUp = async (id, price) => {
    setPlanId(id);
  };
  const onRadioBtnClick = async (id, price) => {
    var price = parseFloat(price.replace(/,/g, ""));
    var postpayload = {
      product_id: id,
      price: price,
      quantity: 1,
    };
    setPlanId(id);
    let usertoken = await AsyncStorage.getItem("usertoken");
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
      getCartProduct();
      showMessage({
        message: "Plan added successfully in cart list.",
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
      //setLoading(false);
    }
  };

  const createOder = async () => {
    const hasOtherCategory = cartproduct.some(
      (item) => item.category != 12 && item.category != 8
    );
    var grandtotal = 0;
    if (isKnect == 1) {
      grandtotal = knecttBonus.grand_total;
      var postpayload = {
        total_amount: knecttBonus.grand_total,
        discount: knecttBonus.discount,
        tax: knecttBonus.tax,
        knectt_bonus: knecttBonus.knectt_bonus_amt,
        shipping_charges: knecttBonus.shipping_handling,
      };
    } else {
      grandtotal = cartSummery.grand_total;
      var postpayload = {
        total_amount: cartSummery.grand_total,
        discount: cartSummery.discount,
        tax: cartSummery.tax,
        knectt_bonus: 0,
        shipping_charges: cartSummery.shipping_handling,
      };
    }
    let usertoken = await AsyncStorage.getItem("usertoken");
    try {
      const response = await fetch(EndUrl.createOrder, {
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
      console.log("json--> get order", json);
      if (json.status == 200) {
        navigation.navigate("Checkout", {
          orderId: json.order_id,
          grandTotla: grandtotal,
          hasOtherCategory: hasOtherCategory,
          razorpay_order_id: json.razorpay_order_id,
          paymentType:json?.payment_type ,
          order_expiry_time:json?.order_expiry_time,
          payment_session_id:json?.payment_session_id
        });
      }
    } catch (error) {
      showMessage({
        message: "Please try after some time",
        duration: 3000,
        type: "danger",
      });
      console.error("error-->", error);
    } finally {
      //setLoading(false);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          goToProductDetail(item?.id, item?.title);
        }}
        activeOpacity={0.8}
        style={{
          width:
            index == activeplanindex ? win.width - planwidht : win.width - 20,
          margin: 6,
          marginLeft: index == activeplanindex && index > 0 ? 5 : 0,
        }}
      >
        <View style={styles.item}>
          <View
            style={{
              width:
                index == activeplanindex
                  ? win.width - planwidht - 30
                  : win.width - 40,
            }}
          >
            <RadioButton
              onPress={() => onRadioBtnClickUp(item.id, item.price)}
              onPressTitle={() => goToProductDetail(item?.id, item?.title)}
              selected={planId == item.id ? true : false}
            >
              {item.title}
              {"\n"}
              {item.cutting_price ? (
                <Text style={{ textAlign: "left" }}>
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
            </RadioButton>
          </View>
          {/* <View style={styles.addplanbtn}>
            <View style={{ width: 80 }}> */}
          {/* <Button
                color="#F79489"
                mode="outlined"
                style={{ flex: 1, width: "auto", height: 20 }}
                uppercase={false}
                title="Add Plan"
                onPress={() => onRadioBtnClick(item.id, item.price)}
              /> */}

          <ButtonCustom
            title="Add Plan"
            onPress={() => onRadioBtnClick(item.id, item.price)}
            containerStyle={{
              paddingVertical: 7,
              width: 80,
              position: "absolute",
              right: 10,
              bottom: 10,
            }}
          />

          {/* </View> */}
          {/* <View
              style={{ width: "70%", textAlign: "right", marginVertical: 5 }}
            >
              <View style={styles.readmore}>
                <TouchableOpacity
                  onPress={() =>
                    getReadMore(item.id, item.title, item.crown_image)
                  }
                >
                  <Text>Read more </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          {/* </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  const getCartProduct = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log("usertoken", usertoken);
      const response = await fetch(EndUrl.getcartlist, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
      console.log("CART ITEMSSSS->", JSON.stringify(json));
      if (response.status == 200) {
        setWalletBalance(JSON.stringify(json.wallet_balance))
        setLoading(false);
        setCartproduct(json.data);
        setCartsummery(json.summary);
        console.log(json.summary,'my summary d')
        let lastPlan = json?.plans?.filter((e) => e?.id === 1065);
        setPlan(json?.plans);
        setKnecttBonus(json.knectt_bonus_summary);
        setKnecttConusWillApply(json.knectt_bonus_will_apply);
        setRecommendation(json.summary.recommendation);
        setPlanlenght(json.plans.length);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCartProduct();
    }, [])
  );

  const addCartItem = async (product) => {
    return (dispatch) => {
      //dispatch({ type: actions.CART_ADD, payload: product });
    };
  };

  // const removeCartItem = async (id) => {
  //   console.log("REMOVE CART ITEM", id);
  //   try {
  //     setLoading(true);
  //     let usertoken = await AsyncStorage.getItem("usertoken");
  //     const response = await fetch(EndUrl.removecart + id, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //         token: JSON.parse(usertoken),
  //         Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
  //         Platform: Platform.OS,
  //       },
  //     });

  //     const json = await response.json();
  //     console.log("REMOVEW DATA:::", json);
  //     if (response.status == 200) {
  //       showMessage({
  //         message: "Item removed from your in cart list.",
  //         duration: 2000,
  //         position: "center",
  //         icon: (props) => <Image source={thumsImg} {...props} />,
  //         type: "success",
  //       });

  //       console.log("REMOVEW DATA:::", json);
  //       setCartproduct(json.data);
  //       setCartsummery(json.summary);
  //       setPlan(json.plans);
  //       setKnecttBonus(json.knectt_bonus_summary);
  //       setKnecttConusWillApply(json.knectt_bonus_will_apply);
  //       setRecommendation(json.summary.recommendation);
  //       setPlanlenght(json.plans.length);
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const removeCartItem = async (id) => {
    console.log("REMOVE CART ITEM", id);
    try {
      setLoading(true);
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.removecart + id, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
      console.log("REMOVEW DATA:::", json);
      if (response.status == 200) {
        showMessage({
          message: "Item removed from your in cart list.",
          duration: 2000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });

        setCartproduct(json.data);
        setCartsummery(json.summary);
        console.log(json.summary,'my summary e')
        setPlan(json.plans);
        setKnecttBonus(json.knectt_bonus_summary);
        setKnecttConusWillApply(json.knectt_bonus_will_apply);
        setRecommendation(json.summary.recommendation);
        setPlanlenght(json.plans.length);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error removing cart item:", error);
    } finally {
      setLoading(false);
    }
  };

  const onApplyKneect = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    try {
      toggleExpand();
      const postpayload = {
        on_diet: on_diet,
        on_products: on_products,
        on_bloodtest: on_bloodtest,
        on_wallet:on_wallet,
        earned_cashback: on_bloodtest,
        on_coupon: !!couponCodeValue,
        coupon_code: couponCodeValue.trim().toUpperCase(),
      };
      console.log("POST PAYLOAD", postpayload);
      const response = await fetch(EndUrl.applyknectt, {
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
      console.log("JSON reseponmse", JSON.stringify(json));
      setCartproduct(json.data);
      setCartsummery(json.summary);
      console.log(json.summary,'my summary a')
      setPlan(json.plans);
      setKnecttBonus(json.knectt_bonus_summary);
      setKnecttConusWillApply(json.knectt_bonus_will_apply);
      setRecommendation(json.summary.recommendation);
      setPlanlenght(json.plans.length);
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
  };
  const increaseCartItemQuantity = async (id) => {
    try {
      var postpayload = {
        quantity: 1,
      };
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.addquantity + id.id, {
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
      console.log("INCREASE CART ITEM QUANTITY", json);
      setLoading(true);
      if (response.status == 200) {
        showMessage({
          message: "Item quantity updated successfully.",
          duration: 1000,
          type: "success",
        });
        setCartproduct(json.data);
        setCartsummery(json.summary);
        console.log(json.summary,'my summary b')
        setPlan(json.plans);
        setKnecttBonus(json.knectt_bonus_summary);
        setKnecttConusWillApply(json.knectt_bonus_will_apply);
        setRecommendation(json.summary.recommendation);
        setPlanlenght(json.plans.length);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const setCoonect = async () => {
    setIsknect(1);
  };
  const decreaseCartItemQuantity = async (id) => {
    try {
      var postpayload = {
        quantity: 1,
      };
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log("USER TOKEN", usertoken);
      const response = await fetch(EndUrl.subtractquantity + id.id, {
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
      console.log("dedd--->", JSON.stringify(json));
      if (response.status == 200) {
        showMessage({
          message: "Item quantity updated successfully.",
          duration: 2000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });
        console.log("DATAT:::", json.data);
        setCartproduct(json.data);
        setCartsummery(json.summary);
        console.log(json.summary,'my summary c')
        setPlan(json.plans);
        setKnecttBonus(json.knectt_bonus_summary);
        setKnecttConusWillApply(json.knectt_bonus_will_apply);
        setRecommendation(json.summary.recommendation);
        setPlanlenght(json.plans.length);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const emptyCart = async (type) => {
    return (dispatch) => {
      //dispatch({ type: actions.EMPTY_CART, payload: type });
    };
  };

  const deleteItem = (id) => {
    removeCartItem(id);
  };

  //method to increase the quantity of the item in(cart) redux
  const increaseQuantity = (id, quantity) => {
    //if (avaiableQuantity > quantity) {
    increaseCartItemQuantity({ id: id, type: "increase" });
    setRefresh(!refresh);
    //}
  };

  //method to decrease the quantity of the item in(cart) redux
  const decreaseQuantity = (id, quantity) => {
    if (quantity > 1) {
      decreaseCartItemQuantity({ id: id, type: "decrease" });
      setRefresh(!refresh);
    } else {
      deleteItem(id);
    }
  };

  //calcute and the set the total price whenever the value of carproduct change
  useEffect(() => {
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    getCartProduct();
    getProfileData();
    setTotalPrice(
      cartproduct.reduce((accumulator, object) => {
        return accumulator + object.applied_price;
      }, 0)
    );
  }, [refresh]);

  useEffect(() => {
    getCartOffers();
  }, []);
  const removeValue = async () => {
    setLoading(true);
    try {
      var postpayload = {
        quantity: 1,
      };
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log("USER TOKEN", usertoken);
      const response = await fetch(EndUrl.removeBonus, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
      console.log("removeValue--->", json);
      if (response.status == 200) {
        getCartProduct();
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const removeWallet = async () => {
    setLoading(true);
    try {
      var postpayload = {
        quantity: 1,
      };
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log("USER TOKEN", usertoken);
      const response = await fetch(EndUrl.removeWallet, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
      console.log("removeWallet--->", json);
      if (response.status == 200) {
        getCartProduct();
        setOnWallet(false)
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsAppChat = () => {
    const phoneNumber = "+919717490035"; // Added 91 for India country code
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;

    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          Alert.alert(
            "WhatsApp not installed",
            "Please install WhatsApp to continue chat"
          );
        }
      })
      .catch((err) => {
        console.error("Error opening WhatsApp:", err);
        Alert.alert("Error", "Could not open WhatsApp. Please try again.");
      });
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <FlashMessage />
      <Header
        categoryTitle={categoryTitle}
        cartCountshow={cartCountshow}
        backButtonwithtext
        walletAmountLeft={walletBalance}
      />
      {console.log("cartproduct==>", cartproduct)}
      <View style={styles.container}>
        {cartproduct?.length === 0 ? (
          <View style={styles.cartProductListContiainerEmpty}>
            <Text
              onPress={() => {
                // navigation.navigate("CheckoutRedirection", {
                //   orderId: 292,
                // });
              }}
              style={styles.secondaryTextSmItalic}
            >
              "Cart is empty"
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.cartProductListContiainer}>
            {cartproduct.map((item, index) => (
              <CartProductList
                key={index}
                index={index}
                id={item.id}
                image={item.image}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                onPressIncrement={() => {
                  increaseQuantity(item.id, item.quantity);
                }}
                produDetail={() => {
                  goToProductDetail(item.product_id, item.title);
                }}
                onPressDecrement={() => {
                  decreaseQuantity(item.id, item.quantity);
                }}
                handleDelete={() => {
                  deleteItem(item.id);
                }}
              />
            ))}
            {/* {recommendation ? (
              <View style={styles.recommendationText}>
                <Text style={styles.orifinalbold}>Recommendation:</Text>
                <Text style={styles.emptyView}>{recommendation}</Text>
              </View>
            ) : null}
            <FlatList
              horizontal
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              legacyImplementation={false}
              data={plan}
              onScroll={(event) => {
                const index = Math.floor(
                  Math.floor(event.nativeEvent.contentOffset.x) /
                    Math.floor(event.nativeEvent.layoutMeasurement.width)
                );
                setActiveplanindex(index);
              }}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            /> */}
            <ModalTester
              isVisible={isModalVisible}
              toggleModal={toggleModal}
              data={read}
              planType={planType}
              planImage={planImage}
              loading={loading}
              id={id}
            />
            <View style={styles.connectholder}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => toggleExpand()}
              >
                <View>
                  <Text style={[styles.title, styles.font, styles.discount]}>
                    Apply KNECTT Bonus
                  </Text>
                  {connectexpanded && (
                    <Text style={{ marginLeft: 10 }}>Multi select option</Text>
                  )}
                </View>
                {connectexpanded ? <IconClose /> : <IconArrowDown />}
              </TouchableOpacity>
              <View style={styles.parentHr} />
              {connectexpanded && (
                <View style={styles.child}>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      tintColors={{ true: "#132742",false: "#d6d9ddff" }}
                      value={on_diet}
                      onValueChange={() => {setOnWallet(false);setOndiet(!on_diet)}}
                      style={styles.checkbox}
                      boxType={"square"}
                    />
                    <View style={styles.offerView}>
                      <Text style={styles.label}>Nutrition discounts.</Text>
                      <Text style={styles.offerLabel}>
                        Apply extra pre-fed discounts
                      </Text>
                    </View>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      tintColors={{ true: "#132742",false: "#d6d9ddff" }}
                      value={on_products}
                      onValueChange={() => {setOnWallet(false);setOnProducts(!on_products)}}
                      style={styles.checkbox}
                      boxType={"square"}
                    />
                    <View style={styles.offerView}>
                      <Text style={styles.label}>Product discounts.</Text>
                      <Text style={styles.offerLabel}>
                        {cartOffer[0]?.heading}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      tintColors={{ true: "#132742",false: "#d6d9ddff" }}
                      value={on_bloodtest}
                      onValueChange={() => {setOnWallet(false);setOnbloodtest(!on_bloodtest)}}
                      style={styles.checkbox}
                      boxType={"square"}
                    />
                    <View style={styles.offerView}>
                      <Text style={styles.label}>Blood test discounts.</Text>
                      <Text style={styles.offerLabel}>
                        {cartOffer[0]?.sub_heading}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <CheckBox
                      tintColors={{ true: "#132742",false: "#d6d9ddff" }}
                      value={on_wallet}
                      onValueChange={() => {setOnbloodtest(false);setOnProducts(false);setOndiet(false);setCouponCodeValue("");setOnWallet(!on_wallet)}}
                      style={styles.checkbox}
                      boxType={"square"}
                    />
                    <View style={styles.offerView}>
                      <Text style={styles.label}>Wallet Redemption</Text>
                      <Text style={styles.offerLabel}>
                        {`Exclusive. Can't be clubbed with other offers`}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      marginLeft: 5,
                    }}
                  >
                    <CheckBox
                      tintColors={{ true: "#132742",false: "#d6d9ddff" }}
                      value={!!couponCodeValue}
                      style={{ marginTop: 5 }}
                      boxType={"square"}
                    />
                    <View
                      style={{
                        marginLeft: 15,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width - 110,
                      }}
                    >
                      <TextInput
                        placeholder="Enter Coupon"
                        value={couponCodeValue}
                        onChangeText={(text) => {setOnWallet(false);setCouponCodeValue(text)}}
                        style={{
                          borderWidth: 1,
                          borderColor: "#000",
                          width: 150,
                          fontSize: 12,
                          height: 40,
                        }}
                      />
                      <ButtonCustom
                        onPress={() => onApplyKneect()}
                        title="Apply"
                        containerStyle={{
                          paddingHorizontal: 10,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      marginVertical: 10,
                      marginHorizontal: 52,
                    }}
                  >
                    <View>
                      <Text
                        style={[
                          styles.label,
                          { fontSize: 15, marginLeft: 0, paddingLeft: 0 },
                        ]}
                      >
                        Apply Coupon Code
                      </Text>
                      <Text
                        style={[
                          styles.label,
                          { fontSize: 13, marginLeft: 0, paddingLeft: 0 },
                        ]}
                      >
                        ask for a coupon code through whatsapp chat
                      </Text>
                    </View>
                    {/* <TouchableOpacity
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 35,
                        height: 35,
                        borderRadius: 20,
                      }}
                      onPress={() => setIsCouponModalVisible(true)}
                    >
                      <Image
                        source={whatsappIcon}
                        style={{ width: 40, height: 40 }}
                      />
                    </TouchableOpacity> */}
                  </View>
                </View>
              )}
            </View>

            <Modal
              visible={isCouponModalVisible}
              transparent={true}
              onRequestClose={() => setIsCouponModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: 20,
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 40,
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "#000",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setIsCouponModalVisible(false)}
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 30,
                    }}
                  >
                    <IconClose />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    Best Price Guaranteed:
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      marginVertical: 10,
                    }}
                  >
                    Chat with us, with the following information:{" "}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginVertical: 10,
                    }}
                  >
                    1. Paste the link of the product (from an external site)
                    where you see a better price
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginVertical: 10,
                    }}
                  >
                    2. Share the price difference of the product 1 with FREE
                    delivery
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginVertical: 10,
                    }}
                  >
                    3. We will verify and then share a Best price coupon code
                    with you
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginVertical: 10,
                    }}
                  >
                    Kindly note: There could be a delay in our response during
                    non-working hours
                  </Text>
                  <ButtonCustom
                    title="Chat Now"
                    onPress={() => {
                      setIsCouponModalVisible(false);
                      openWhatsAppChat();
                    }}
                    containerStyle={{
                      marginTop: 10,
                      backgroundColor: "#0b1354",
                    }}
                    titleStyle={{
                      color: "#FFF",
                    }}
                  />
                </View>
              </View>
            </Modal>

            {cartOffer.length > 0 && (
              <View style={{ marginLeft: scale(20), marginTop: scale(10) }}>
                <Text style={{ fontSize: 16 }}>
                  {"\u2022"}
                  {"  "}
                  {cartOffer[0]?.heading}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {"\u2022"}
                  {"  "}
                  {cartOffer[0]?.sub_heading}
                </Text>
              </View>
            )}

            <View style={styles.emptyView}>
              <Text style={styles.emptyView}></Text>
            </View>
            {isKnect == 1 ? (
              <View style={styles.cartBottomContainer}>
                <Text style={styles.emptyView}>Billing Summary</Text>
                <View style={styles.cartBottomLeftContainer}>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <Text style={styles.cartBottomPrimaryText}>Discount</Text>
                    <Text
                      style={[styles.cartBottomSecondaryText, styles.discount]}
                    >
                      {"\u20B9"} {knecttBonus.discount}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                    }}
                  >
                    <Text style={styles.cartBottomPrimaryText}>Subtotal</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.subtotal}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Knectt Bonus Amount
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.knectt_bonus_amt}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>Tax</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.tax}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>Tax</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.tax}
                    </Text> */}

                    <Text style={styles.cartBottomPrimaryText}>
                      Grand Total
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.grand_total}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Grand Total
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {knecttBonus.grand_total}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>
                      Knectt Bonus Amount
                    </Text>
                    <Text
                      style={[styles.cartBottomSecondaryText, styles.discount]}
                    >
                      {"\u20B9"} {knecttBonus.knectt_bonus_amt}
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View style={styles.cartBottomContainer}>
                <View style={styles.cartBottomLeftContainer}>
                  <Text style={styles.cartTitlesum}>Billing Summary</Text>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>Subtotal</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.subtotal}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>
                      Discount on MRP
                    </Text>
                    <Text
                      style={[styles.cartBottomSecondaryText, styles.discount]}
                    >
                      {"\u20B9"} {handleDecimal(cartSummery.discount)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>Discount</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.discount}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>Subtotal</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.subtotal)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Knectt Bonus
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {" "}
                      - {"\u20B9"} {cartSummery.knectt_bonus_amt}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>
                      Delivery Charge
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.delivery_charge)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Delivery Charge
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.delivery_charge}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>
                      Handling Charge
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.shipping_handling)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Handling Charge
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.shipping_handling}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>Tax</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.tax)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    <Text style={styles.cartBottomPrimaryText}>
                      Offer Price
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.grand_total)}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: "100%",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      // borderBottomWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Grand Total
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.grand_total}
                    </Text> */}
                    <View
                      style={{
                        width: "60%",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={[
                          styles.cartBottomPrimaryText,
                          {
                            width: "60%",
                          },
                        ]}
                      >
                        Knectt Bonus
                      </Text>
                      <Text
                        style={[
                          styles.discount,
                          {
                            fontSize: 16,
                            padding: 5,
                            width: "45%",
                            alignSelf: "flex-end",
                          },
                        ]}
                      >
                        {" "}
                        - {"\u20B9"}{" "}
                        {handleDecimal(cartSummery.knectt_bonus_amt)}
                      </Text>
                    </View>

                    {cartSummery?.knectt_bonus_amt != 0 ? (
                      <TouchableOpacity
                        onPress={() => {
                          removeValue();
                        }}
                        style={{ justifyContent: "center" }}
                      >
                        <Text
                          style={{
                            color: "red",
                            marginLeft: "5%",
                            alignSelf: "center",
                            fontSize: 16,
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>Subtotal</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.subtotal}
                    </Text> */}
                    <Text style={[styles.cartBottomPrimaryText,{width:'37%'}]}>
                      Wallet Amount
                    </Text>
                    <Text
                      style={[styles.cartBottomSecondaryText, styles.discount,{width:'23%'}]}
                    >
                        - {"\u20B9"}
                        {handleDecimal(cartSummery.used_wallet_amount)}
                    </Text>
                    {cartSummery.used_wallet_amount > 0 ? (
  <TouchableOpacity onPress={removeWallet} style={{ justifyContent: "center" }}>
    <Text style={{ color: "red", marginLeft: "5%", alignSelf: "center", fontSize: 16 }}>
      Remove
    </Text>
  </TouchableOpacity>
):null}

                  </View>
                  <View
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      borderTopWidth: 1,
                      borderBottomWidth: 1,
                      borderColor: "#999",
                    }}
                  >
                    {/* <Text style={styles.cartBottomPrimaryText}>
                      Grand Total
                    </Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {cartSummery.grand_total}
                    </Text> */}
                    <Text style={styles.cartBottomPrimaryText}>Pay</Text>
                    <Text style={styles.cartBottomSecondaryText}>
                      {"\u20B9"} {handleDecimal(cartSummery.final_amount)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
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
        {cartproduct.length > 0 ? (
          // <Button
          //   color="#F79489"
          //   mode="outlined"
          //   style={{ flex: 1, width: "auto" }}
          //   uppercase={false}
          //   title="Checkout"
          //   onPress={() => createOder()}
          // />
          <ButtonCustom title="CHECKOUT" onPress={() => createOder()} />
        ) : null}
        {cartSummery.line_after_button ? (
          <Text style={styles.afterbutton}>
            {cartSummery.line_after_button}
          </Text>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  cartTitlesum: {
    fontFamily: fonts.whitneySemiBold,
    justifyContent: "flex-start",
    width: "100%",
    marginBottom: 5,
    fontSize: scale(17),
    flex: 1,
  },
  orifinalbold: {
    fontFamily: fonts.whitneySemiBold,
    justifyContent: "flex-start",
    fontSize: scale(16),
    flex: 1,
  },
  priceholder: {
    alignSelf: "flex-start",
    minHeight: 70,
    flex: 1,
    flexGrow: 1,
    height: "auto",
  },
  readmore: {
    color: "#CCC",
    alignSelf: "flex-end",
  },
  item: {
    display: "flex",
    flexDirection: "column",
    borderColor: "#ccc",
    borderWidth: 1,
    alignSelf: "flex-start",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    height: 160,
  },
  container: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: "600",
  },
  cartProductListContiainer: { width: "100%", padding: 8, margin: 2 },
  cartProductListContiainerEmpty: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  secondaryTextSmItalic: {
    fontStyle: "italic",
    fontSize: 15,
  },
  cartBottomContainer: {
    width: "100%",
    display: "flex",
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  cartBottomLeftContainer: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  cartBottomRightContainer: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },
  cartBottomPrimaryText: {
    fontSize: 16,
    padding: 5,
    width: "40%",
  },
  cartBottomSecondaryText: {
    fontSize: 16,
    padding: 5,
    width: "60%",
  },
  textRecomendation: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 5,
    flex: 1,
  },
  emptyView: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginTop: 10,
    flex: 1,
  },
  recommendationText: {
    width: "100%",
    flexDirecion: "row",
    backgroundColor: "#FFF",
    justifyContent: "flex-start",
    paddingBottom: 0,
    marginVertical: 10,
    flex: 1,
    paddingVertical: 10,
  },
  IconContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    borderRadius: 5,
  },
  cartInfoContainerTopBar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cartInfoTopBar: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginLeft: 5,
  },
  addTocart: {
    borderWidth: 1,
    textAlign: "center",
    margin: 0,
    textTransform: "uppercase",
    borderColor: "pink",
    color: "#FFF",
    borderRadius: 4,
    width: "90%",
    backgroundColor: "#FCC6C6",
  },
  radioButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 10,
  },
  radioButton: {
    height: 20,
    width: 20,
    marginLeft: 5,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#132742",
  },
  radioButtonText: {
    fontSize: 16,
    margin: 10,
    marginRight: 20,
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
  addplanbtn: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-end",
    // display: "flex",
    marginLeft: 10,
    padding: 10,
    marginTop: 10,
    bottom: 1,
  },
  afterbutton: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "flex-start",
    display: "flex",
    fontFamily: fonts.whitneyMedium,
    color: "#7e818c",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
  },
  parentHr: {
    height: 1,
    color: "#fff",
    width: "100%",
  },
  applykneectholder: {
    width: "20%",
    flexDirecion: "column",
    justifyContent: "flex-end",
  },
  checkboxContainerLeft: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-end",
    marginLeft: 15,
    marginBottom: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center",
    marginLeft: 5,
    marginBottom: 7,
    marginVertical: Platform.OS === "ios" ? 10 : 0,
  },
  checkbox: {
    alignSelf: "center",
  },
  connectholder: {
    width: Dimensions.get("window").width - 30,
    borderRadius: 10,
    marginTop: 10,
    borderColor: "#999",
    borderWidth: 1,
  },
  label: {
    marginLeft: 8,
    paddingLeft: 5,
    borderColor: "#999",
    borderWidth: 0,
    width: Dimensions.get("window").width - 150,
    fontSize: 16,
    fontFamily: fonts.whitneyMedium,
  },
  offerLabel: {
    marginLeft: 13,
    fontSize: 12,
    fontFamily: fonts.whitneyMedium,
  },
  offerView: {
    justifyContent: "center",
  },
  child: {
    flex: 1,
    flexDirection: "column",
    width: Dimensions.get("window").width - 40,
    padding: 5,
    margin: 5,
  },
  discount: { color: "green" },
});
