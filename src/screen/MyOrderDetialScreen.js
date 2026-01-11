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
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import ImageCarousel from "../component/SimilerProductCarousel";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import EndUrl from "../api/EndUrl";
import HTML from "react-native-render-html";
import ViewMoreText from "react-native-view-more-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import fonts from "../utils/fonts.js";
import { IconDownload } from "../component/IconComp.js";
import { handleDecimal } from "../utils/commonFunctions.js";
import DeviceInfo from "react-native-device-info";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const MyOrderDetialScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("View Details");
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const [order, setOrder] = useState([]);
  const [orderSummary, setOrderSummary] = useState([]);
  const [orderId, setOrderId] = useState();
  const [billingAddress, setBillingAddress] = useState([]);
  const [shippingAddress, setShippingAddress] = useState([]);
  const [invoicePdf, setInoivePdf] = useState();
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const gatlineIdset = async (id) => {
    navigation.navigate("ProductDetail", {
      proId: id,
    });
  };
  console.log("orderSummary", orderSummary);
  const getMyOrder = async () => {
    if (refresh == false) {
      try {
        let usertoken = await AsyncStorage.getItem("usertoken");
        console.log(usertoken);
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
          EndUrl.orderDetail + route.params.orderId,
          settingsGet
        );
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        setOrder(json.data);
        setOrderId(json.data[0].order_id);
        setOrderSummary(json.summary);
        setInoivePdf(json.pdf_url);
        if (json.billing_address.length > 0) {
          setBillingAddress(json.billing_address);
        } else {
          setBillingAddress(json.shipping_address);
        }
        setShippingAddress(json.shipping_address);
        setRefresh(!refresh);
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    }
  };
  useEffect(() => {
    getMyOrder();
  }, [refresh]);
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            padding: 5,
            marginTop: 10,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View style={styles.orderiTem}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.ordertxt}>Order #</Text>
              <Text style={styles.ordertxt}>{orderId}</Text>
            </View>
            <View
              style={{
                flex: 1,
                borderColor: "#ccc",
                borderTopWidth: 1,
                width: "100%",
              }}
            >
              {invoicePdf ? (
                <Text
                  style={{ padding: 5, margin: 5, fontSize: 18 }}
                  onPress={() => {
                    Linking.openURL(invoicePdf);
                  }}
                >
                  {" "}
                  Download Invoice{" "}
                  {/* <Feather
                    name={"download"}
                    style={{
                      color: "#424553",
                      width: 30,
                      fontSize: 29,
                      right: 2,
                      backgroundColor: "white",
                      fontWeight: 300,
                      paddingVertical: 6,
                    }}
                  /> */}
                  <IconDownload />
                </Text>
              ) : (
                <Text style={{ padding: 5, margin: 5, fontSize: 18 }}>
                  No Invoice
                </Text>
              )}
            </View>
          </View>
          <Text style={styles.orderDetialsep}>Shipment details</Text>
          <View style={styles.orderiTem}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <FlatList
                style={{
                  width: "100%",
                  paddingTop: 1,
                  marginTop: 1,
                  marginLeft: 0,
                  marginRight: 0,
                }}
                data={order}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <Pressable
                      type="clear"
                      onPress={() => gatlineIdset(item.product_id)}
                      title="Add"
                    >
                      <View style={styles.mYorderiTem}>
                        <View style={{ marginLeft: 2 }}>
                          <Image
                            source={{ uri: item.images }}
                            style={{ height: scale(100), width: scale(100) }}
                            resizeMode="contain"
                          />
                        </View>
                        <View>
                          <Text
                            style={{
                              width: "100%",
                              color: "#000",
                              fontWeight: "500",
                            }}
                          >
                            {item.title}
                          </Text>
                          <Text style={{ width: "100%", color: "#000" }}>
                            <Text
                              style={{
                                width: "100%",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >
                              Price :{" "}
                            </Text>{" "}
                            {"\u20B9"} {item.price}
                          </Text>
                          <Text style={{ width: "100%", color: "#000" }}>
                            <Text
                              style={{
                                width: "100%",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >
                              Quantity :{" "}
                            </Text>{" "}
                            {item.quantity}
                          </Text>
                          <Text style={{ width: "100%", color: "#000" }}>
                            <Text
                              style={{
                                width: "100%",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >
                              Order Status :{" "}
                            </Text>
                            {item.delivery_status}
                          </Text>
                          <Text style={{ width: "100%", color: "#000" }}>
                            <Text
                              style={{
                                width: "100%",
                                color: "#000",
                                fontWeight: "bold",
                              }}
                            >
                              Order Date :{" "}
                            </Text>
                            {item.created_at}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                }}
              ></FlatList>
            </View>
          </View>

          <Text style={styles.orderDetialsep}> Shipping Address</Text>
          <View style={styles.orderiTem}>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "flex-start",
              }}
            >
              <FlatList
                style={{
                  width: "100%",
                  padding: 10,
                  marginTop: 0,
                  marginLeft: 0,
                  marginRight: 0,
                }}
                data={shippingAddress}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.addressContainer}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.name}>
                          {item.first_name} {item.last_name}
                        </Text>
                      </View>
                      <View style={styles.divider}></View>
                      <Text style={styles.street}>{item.address_line_1}</Text>
                      {item.address_line_2 ? (
                        <Text style={styles.street}>{item.address_line_2}</Text>
                      ) : null}
                      <Text style={styles.street}>
                        {item.city}
                        {","}
                        {item.state} - {item.postalcode}
                      </Text>
                      <Text style={styles.street}>
                        Phone number : {item.phone}
                      </Text>
                    </View>
                  );
                }}
              ></FlatList>
            </View>
          </View>
          <Text style={styles.orderDetialsep}>Order Summary</Text>
          <View style={styles.orderiTem}>
            <View style={styles.cartBottomLeftContainer}>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>
                  Discount on MRP
                </Text>
                <Text style={styles.discountText}>
                  {"\u20B9"} {handleDecimal(orderSummary.discount)}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Subtotal</Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {handleDecimal(orderSummary.subtotal)}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>
                  Delivery Charge
                </Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {orderSummary.delivery_charge ?? "Free"}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>
                  Handling Charge
                </Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {handleDecimal(orderSummary.shipping_handling)}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Tax</Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {handleDecimal(orderSummary.tax)}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Offer Price</Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {handleDecimal(orderSummary.total)}
                </Text>
              </View>
              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Knectt Bonus</Text>
                <Text style={{ alignSelf: "center", color: "green" }}>-</Text>
                <Text style={styles.discountText}>
                  {"\u20B9"} {handleDecimal(orderSummary.knectt_bonus_amt)}
                </Text>
              </View>

              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Wallet Amount</Text>
                <Text style={{ alignSelf: "center", color: "green" }}>-</Text>
                <Text style={styles.discountText}>
                  {"\u20B9"} {handleDecimal(orderSummary.used_wallet_amount)}
                </Text>
              </View>

              <View style={styles.borderView}>
                <Text style={styles.cartBottomPrimaryText}>Grand Total</Text>
                <Text style={styles.cartBottomSecondaryText}>
                  {"\u20B9"} {handleDecimal(orderSummary.total)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  mYorderiTem: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 5,
    margin: 3,
    paddingLeft: 2,
    marginRight: 10,
  },
  orderiTem: {
    backgroundColor: "#FFF",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 5,
    margin: 3,
    paddingLeft: 2,
    marginRight: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  tagRight: {},
  orderDetialsep: {
    fontSize: 18,
    marginLeft: 10,
  },
  ordertxt: {
    fontSize: 18,
    padding: 5,
    marginLeft: 10,
    width: "45%",
    fontWeight: "400",
  },
  nameContainer: {
    fontSize: 16,
  },
  street: {
    flex: 1,
    marginBottom: 6,
    fontSize: 16,
    fontFamily: fonts.whitneySemiBold,
  },
  name: {
    flex: 1,
    marginBottom: 6,
    fontSize: 18,
    fontFamily: fonts.whitneySemiBold,
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
  },
  mobile: {
    marginTop: 10,
    fontSize: 16,
  },
  stretch: {
    flex: 1,
    margin: 4,
  },
  divider: {
    borderColor: "#ccc",
    margin: 2,
    width: "90%",
    borderBottomWidth: 1,
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
    width: "50%",
  },
  cartBottomSecondaryText: {
    fontSize: 16,
    padding: 5,
    width: "60%",
  },
  discountText: {
    fontSize: 16,
    padding: 5,
    width: "60%",
    color: "green",
  },
  borderView: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#999",
  },
});
export default MyOrderDetialScreen;
