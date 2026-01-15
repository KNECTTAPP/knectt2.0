import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import RazorpayCheckout from "react-native-razorpay";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom";
import Header from "../component/Header";
import { IconMapPin } from "../component/IconComp";
import fonts from "../utils/fonts";
import { ProgressLoader } from "../component/ProgressLoader";
import DeviceInfo from "react-native-device-info";
import {
  CFErrorResponse,
  CFPaymentGatewayService,

  
} from 'react-native-cashfree-pg-sdk';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  CFEnvironment,
  CFSession,
  CFPaymentComponentBuilder,
  CFPaymentModes,
  CFThemeBuilder,
  CFDropCheckoutPayment,
} from 'cashfree-pg-api-contract';
import Toast from 'react-native-simple-toast';

const { height } = Dimensions.get("window");
var width = Dimensions.get("window").width;



const CheckoutScreen = ({ navigation, route }) => {
  const [isSelected, setSelection] = useState(false);
  const [active, setActive] = useState(0);
  const [razropay, setRazropay] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("Checkout");
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const win = Dimensions.get("window");
  const hasOtherCategory = route.params.hasOtherCategory;
  const [showBox, setShowBox] = useState(true);
  const [addressData, setAddressData] = useState([]);
  const [addressDataOri, setAddressDataOri] = useState();
  const [addreSelect, setAddreSelect] = useState();
  const [billingSelect, setBillingSelect] = useState(hasOtherCategory);
  const [showPayment, setShowPayment] = useState(false);
  const [billingaddress, setBillingaddress] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("credit-card");
  const onFinish = () => {
    navigation.navigate("Summary");
    //Summary
  };

  const onAdddress = () => {
    navigation.navigate("AddEditAddress", {
      action: "add",
      id: "",
      menuTitle: "Shipping Address",
      redication: "Checkout",
      orderId: route.params.orderId,
    });
  };
  console.log("route.params.orderId-->", route.params.orderId);
  const getRazorpay = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.getrazorpaydetails, {
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
      setRazropay(json.data[0]);
      console.log(route.params.grandTotla);
      console.log("pau=L>", json.data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  const onRadioBtnClick = async (id, addresdata) => {
    setAddreSelect(id);
    setBillingSelect(true);
    setShowPayment(true);
    var addaressnew = [];
    addaressnew.push(addresdata);
    setAddressData(addaressnew);
    setCategoryTitle("Payments");
    var postpayload = { order_id: route.params.orderId, shipping_address: id };
    let usertoken = await AsyncStorage.getItem("usertoken");
    try {
      const response = await fetch(EndUrl.updateaddresstoorder, {
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

  const onBilingAsshipingClick = async (id, addresdata) => {
    setBillingSelect(true);
    setShowPayment(true);
    var addaressnew = [];
    addaressnew.push(addresdata);
    setBillingaddress(addaressnew);
    setSelection(!isSelected ? true : false);
    if (isSelected == true) {
      setBillingaddress(addressDataOri);
    } else {
      var postpayload = { order_id: route.orderId, billing_address: id };
      let usertoken = await AsyncStorage.getItem("usertoken");
      try {
        const response = await fetch(EndUrl.updateaddresstoorder, {
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
    }
  };

  const onBilingClick = async (id, addresdata) => {
    setBillingSelect(true);
    setShowPayment(true);
    var addaressnew = [];
    addaressnew.push(addresdata);
    setBillingaddress(addaressnew);
    var postpayload = { order_id: route.orderId, billing_address: id };
    let usertoken = await AsyncStorage.getItem("usertoken");
    try {
      const response = await fetch(EndUrl.updateaddresstoorder, {
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

  const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const paymentStart = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      var postpayload = {
        order_id: route.params.orderId,
      };
      const response = await fetch(EndUrl.paymentstart, {
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
      if (response.status == 200) {
        await AsyncStorage.removeItem("cartcount");
        const json = await response.json();
        //updatePayment();
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const updatePayment = async (data) => {
    console.log("updatePayment", data);
    setLoading(true);
    try {
      const paymentID = data.razorpay_payment_id;
      let usertoken = await AsyncStorage.getItem("usertoken");
      var postpayload = {
        order_id: route.params.orderId,
        payment_method: "razorpay",
        payment_id: paymentID,
        status: "success",
      };
      const response = await fetch(EndUrl.updatepaymentid, {
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
      setLoading(false);
      if (json?.plan_purchased == 1) {
        navigation.replace("DietThanks", { plan_type: json.plan_type });
      } else {
        navigation.replace("OrderThanks", {
          paymentId: paymentID,
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };
  const getAddress = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.getalladdress, {
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
      console.log("ADDRESS JSON:::", json);
      setAddressData(json.data);
      setAddressDataOri(json.data);
      setBillingaddress(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getAddress();
        getRazorpay();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  const _iOSCheckout = () => {
    navigation.navigate("CheckoutRedirection", {
      orderId: route.params?.orderId,
    });
  };

  useEffect(() => {}, []);

  // useEffect(() => {
  //   const onReceivedEvent = (eventName, map) => {
  //     console.log(
  //       'Event recieved on screen: ' +
  //         eventName +
  //         ' map: ' +
  //         JSON.stringify(map),
  //     );
  //   };

  //   const onVerify = orderId => {
  //     console.log('orderId is :' + orderId);
  //     // console.log("RazorpayCheckout", data);
  //           // if (orderId) {
  //           //   updatePayment1(orderId);
  //           // }
  //     // updateStatus(orderId);
  //   };

  //   const onError = (error, orderId) => {
  //     console.log(
  //       'exception is : ' + JSON.stringify(error) + '\norderId is :' + orderId,
  //     );
  //     // updateStatus(JSON.stringify(error));
  //   };
  //   CFPaymentGatewayService.setEventSubscriber({onReceivedEvent});
  //   CFPaymentGatewayService.setCallback({onVerify, onError});
  //   return () => {
  //     console.log('UNMOUNTED');
  //     CFPaymentGatewayService.removeCallback();
  //     CFPaymentGatewayService.removeEventSubscriber();
  //   };
  // }, []);

  const handlePayment=async()=>{
    if(route.params?.paymentType=='cashfree'||route.params?.paymentType=='wallet'){
      console.log('Cashfree payment', route?.params);
      // return
      try {
        const session = new CFSession(
          route.params?.payment_session_id,
          route.params?.orderId?.toString(),
          CFEnvironment.SANDBOX
        );
        // const paymentModes = new CFPaymentComponentBuilder()
        //   .add(CFPaymentModes.CARD)
        //   .add(CFPaymentModes.UPI)
        //   .add(CFPaymentModes.NB)
        //   .add(CFPaymentModes.WALLET)
        //   .add(CFPaymentModes.PAY_LATER)
        //   .build();
        // const theme = new CFThemeBuilder()
        //   .setNavigationBarBackgroundColor('#E64A19')
        //   .setNavigationBarTextColor('#FFFFFF')
        //   .setButtonBackgroundColor('#FFC107')
        //   .setButtonTextColor('#FFFFFF')
        //   .setPrimaryTextColor('#212121')
        //   .setSecondaryTextColor('#757575')
        //   .build();
        // const dropPayment = new CFDropCheckoutPayment(
        //   session
        //   // paymentModes,
        //   // theme
        // );
        // console.log(JSON.stringify(dropPayment), 'payment object');
        // return
        // CFPaymentGatewayService.doPayment(session);
        CFPaymentGatewayService.doWebPayment(JSON.stringify(session));
      } catch (e) {
        alert('hi')
        console.log(JSON.stringify(e.message), JSON.stringify(e), 'cash free error message');
      }
    }
    // else{
    //   var options = {
    //     description: razropay.description,
    //     currency: "INR",
    //     // key: razropay.razor_key, // Your api key
    //     key: "rzp_test_098qq5oMaVfFY6",
    //     amount: route.params.grandTotla * 100,
    //     name: "KNECTT",
    //     prefill: {
    //       email: billingaddress[0].email,
    //       contact: billingaddress[0].phone,
    //       name:
    //         billingaddress[0].first_name +
    //         " " +
    //         billingaddress[0].last_name,
    //     },
    //     notes: {
    //       order_id: route.params?.orderId,
    //     },
    //     theme: { color: razropay.color },
    //     order_id: route.params?.razorpay_order_id,
    //   };
    //   console.log("kul->", options);
    //   RazorpayCheckout.open(options)
    //     .then((data) => {
    //       // handle success
    //       //alert(`Success: ${data.razorpay_payment_id}`);
    //       console.log("RazorpayCheckout", data);
    //       if (data) {
    //         updatePayment(data);
    //       }
    //     })
    //     .catch((error) => {
    //       // handle failure
    //       alert(`Payment cancelled`);
    //     });
    // }
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <ProgressLoader isVisible={isLoading} />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.addressHolder}>
          {billingSelect && (
            <Pressable
              type="clear"
              onPress={() => onAdddress()}
              title="Add Address"
            >
              <View
                style={[
                  styles.actionbutton,
                  styles.textbtn,
                  { marginLeft: 10, marginRight: 10, marginTop: 20 },
                ]}
              >
                <Text style={styles.textbtn}>
                  {/* <Feather
                  name="map-pin"
                  size={16}
                  color="#000"
                  style={{ marginRight: 10 }}
                /> */}
                  <IconMapPin /> add new address
                </Text>
              </View>
            </Pressable>
          )}
          {addressData.length > 0 && billingSelect ? (
            <View>
              <Text
                style={[
                  {
                    fontFamily: fonts.whitneySemiBold,
                    fontSize: 16,
                    marginLeft: 0,
                  },
                  styles.headeing,
                ]}
              >
                {addreSelect > 0
                  ? "Delivery Address"
                  : "Select Delivery Address"}
              </Text>
              <FlatList
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                }}
                data={addressData}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.addressContainer}>
                      <TouchableOpacity
                        onPress={() => {
                          if (
                          item.latitude == null || item.latitude === "" ||
                          item.longitude == null || item.longitude === ""
                        ){
                          Toast.show('Please update your Address before proceeding.',Toast.SHORT)
                          navigation.navigate("AddEditAddress", {
                            action: "edit",
                            id: item.id,
                            menuTitle: "Update Address",
                            redication: "Checkout",       // so user returns to checkout after update
                            orderId: route.params.orderId // needed if updating order's shipping address
                          });
                          return;
                        }
                        onRadioBtnClick(item.id, item)
                        }
                      }
                      >
                        <View style={styles.nameContainer}>
                          <Text style={styles.name}>
                            {item.first_name} {item.last_name}
                          </Text>
                          <RadioButton
                            onPress={() => {
                          if (
                          item.latitude == null || item.latitude === "" ||
                          item.longitude == null || item.longitude === ""
                        ){
                          Toast.show('Please update your Address before proceeding.',Toast.SHORT)
                          navigation.navigate("AddEditAddress", {
                            action: "edit",
                            id: item.id,
                            menuTitle: "Update Address",
                            redication: "Checkout",       // so user returns to checkout after update
                            orderId: route.params.orderId // needed if updating order's shipping address
                          });
                          return;
                        }
                        onRadioBtnClick(item.id, item)
                        }
                      }
                            selected={addreSelect == item.id ? true : false}
                          ></RadioButton>
                        </View>
                        <View style={styles.divider}></View>
                        <Text style={styles.street}>{item.address_line_1}</Text>
                        {item.address_line_2 ? (
                          <Text style={styles.street}>
                            {item.address_line_2}
                          </Text>
                        ) : null}
                        <Text>
                          {item.state}
                          {","}
                          {item.city} - {item.postalcode}
                        </Text>
                        <Text style={styles.mobile}>
                          Phone number : {item.phone}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              ></FlatList>
            </View>
          ) : null}
        </View>
        {showPayment || !billingSelect ? (
          <View style={styles.addressHolder}>
            <Text
              style={[
                {
                  fontFamily: fonts.whitneySemiBold,
                  fontSize: 16,
                  marginLeft: 0,
                },
                styles.headeing,
              ]}
            >
              Payments
            </Text>
            {Platform.OS === "ios" && (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  marginHorizontal: 60,
                  paddingVertical: 10,
                  paddingHorizontal: 5,

                  borderBottomWidth: 2,
                }}
              >
                <Text
                  style={{ textAlign: "center" }}
                >{`You'll be now redirected to \n www.knectt.com/checkout`}</Text>
              </View>
            )}
            <View style={{ margin: 10 }}>
              <ButtonCustom
                color="#F79489"
                title={Platform.OS === "ios" ? "Pay Now" : "Pay Now"}
                onPress={() => {
                  paymentStart();
                  if (Platform.OS === "ios") {
                    _iOSCheckout();
                  } else {
                    if(route.params?.paymentType=='cashfree'||route.params?.paymentType=='wallet'){
                        const url = `https://www.knectt.com/checkout/${route.params.orderId}`;
                        // const url = `https://dev.knectt.com/checkout/${route.params.orderId}`;
                        navigation.navigate("PaymentWebView", {paymentUrl: url})
                        if(route.params?.paymentType=='wallet'){
                          Toast.show('Your order has been placed successfully')
                        }
                    }
                    else{
                    var options = {
                      description: razropay.description,
                      currency: "INR",
                      // key: razropay.razor_key, // Your api key
                      key: "rzp_test_098qq5oMaVfFY6",
                      amount: route.params.grandTotla * 100,
                      name: "KNECTT",
                      prefill: {
                        email: billingaddress[0].email,
                        contact: billingaddress[0].phone,
                        name:
                          billingaddress[0].first_name +
                          " " +
                          billingaddress[0].last_name,
                      },
                      notes: {
                        order_id: route.params?.orderId,
                      },
                      theme: { color: razropay.color },
                      order_id: route.params?.razorpay_order_id,
                    };
                    console.log("kul->", options);
                    RazorpayCheckout.open(options)
                      .then((data) => {
                        // handle success
                        //alert(`Success: ${data.razorpay_payment_id}`);
                        console.log("RazorpayCheckout", data);
                        if (data) {
                          updatePayment(data);
                        }
                      })
                      .catch((error) => {
                        // handle failure
                        alert(`Payment cancelled`);
                      });
                  }
                }
                }}
              />
            </View>
          </View>
        ) : null}
        {/* <ModalCommon /> */}
      </ScrollView>
    </SafeAreaView>
  );
};
export default CheckoutScreen;
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  checkboxContainer: {
    flexDirection: "row",
    marginLeft: 15,
    marginBottom: 10,
  },
  adddressbox: {
    padding: 5,
    margin: 4,
    borderColor: "#000",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    padding: 5,
    margin: 4,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    width: width - 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressHolder: {
    padding: 0,
    margin: 0,
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    marginBottom: 30,
  },
  container: {
    marginBottom: 10,
  },
  addressContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    width: "95%",
    color: "green",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    marginTop: 2,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  nameContainer: {
    flexDirection: "row",
    fontFamily: 14,
  },
  name: {
    flex: 1,
    marginBottom: 6,
    fontFamily: fonts.whitneySemiBold,
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
  },
  mobile: {
    marginTop: 10,
  },
  stretch: {
    flex: 1,
    margin: 4,
  },
  actionbutton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    margin: 3,
    elevation: 3,
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "#000",
  },
  divider: {
    borderColor: "#ccc",
    margin: 2,
    width: "90%",
    borderBottomWidth: 1,
  },
  tagLeft: {
    width: 30,
  },
  tagRight: {
    fontSize: 18,
    width: width - 40,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
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
    marginLeft: 16,
  },
  textbtn: {
    textTransform: "uppercase",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  headeing: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "#F0F0F0",
    padding: 10,
  },
});
