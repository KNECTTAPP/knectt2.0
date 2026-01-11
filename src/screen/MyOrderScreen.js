import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler
} from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { scale } from "react-native-size-matters";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom.js";
import Header from "../component/Header";
import { ProgressLoader } from "../component/ProgressLoader";
import colors from "../utils/colors.js";
import fonts from "../utils/fonts.js";
import DeviceInfo from "react-native-device-info";
import { useFocusEffect } from "@react-navigation/native";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var { width, height } = Dimensions.get("window"); //full width
const MyOrderScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Order");
  const [loading, setLoading] = useState(true);
  const [userData, setUserdData] = useState([]);
  const [cancelVisibility, setCancelVisibility] = useState({});
  const [order, setOrder] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });
  const gatlineIdset = (id) => {
    navigation.navigate("OrderDetail", {
      orderId: id,
    });
  };

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

  const getMyOrder = async () => {
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
      const userresponse = await fetch(EndUrl.getprofile, settingsGet);
      const userResponse = await userresponse.json();
      setUserdData(userResponse.data[0]);
      const response = await fetch(EndUrl.myorders, settingsGet);
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
      console.log("ORDER DATA:::", json);
      setOrder(json);
      setRefreshing(false);
    } catch (error) {
      setLoading(false);
      setRefreshing(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const contiNueshoping = async () => {
    navigation.navigate("Offerings Page");
  };

  const cancleOrder = async (orderId, id) => {
    console.log("orderId", orderId);
    console.log("id", id);
    try {
      setLoading(true);
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.REMOVE_CART_ITEM, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify({ order_id: orderId, order_item_id: id }),
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
      console.log("json cancel order", json);
      setLoading(false);
      showMessage({
        message: "The order has been successfully cancelled.",
        duration: 2000,
        type: "success",
      });

      if (json.status == 200) {
        getMyOrder();
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const showConfirmDialog = (orderId, id) => {
    return Alert.alert("Are you sure you want to cancel this order?", "", [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          cancleOrder(orderId, id);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]);
  };
  useEffect(() => {
    getMyOrder();
  }, []);

  useEffect(() => {
    // Set timers for orders where the cancel button should be visible
    let timers = null;
    if (order && order?.length > 0) {
      timers = order.map((orderItem) => {
        if (orderItem.delivery_status === "Order Received") {
          const timerId = setTimeout(() => {
            setCancelVisibility((prevState) => ({
              ...prevState,
              [orderItem.id]: false, // Hide the cancel button for this order
            }));
          }, 60000); // 60 seconds

          // Initialize visibility state as true
          setCancelVisibility((prevState) => ({
            ...prevState,
            [orderItem.id]: true,
          }));

          return { orderId: orderItem.id, timerId };
        }
        return null;
      });
    }

    // Cleanup timers on component unmount
    return () => {
      if (timers) {
        timers.forEach((timer) => {
          if (timer) clearTimeout(timer.timerId);
        });
      }
    };
  }, [order]);

  const onRefresh = () => {
    console.log("Refreshing data...");
    setRefreshing(true);
    try {
      // Replace this with your actual data-fetching logic
      getMyOrder();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderOrderItems = ({ item }) => {
    // console.log("item Order", item);
    const isCancelVisible = cancelVisibility[item.id] ?? false;
    return (
      <View style={styles.orderiTem}>
        <View style={{ marginLeft: 2 }}>
          <Pressable
            type="clear"
            onPress={() => gatlineIdset(item.id)}
            title="View order Detail"
          >
            <Image
              source={{ uri: item.images }}
              style={{ height: scale(100), width: scale(100) }}
              resizeMode="contain"
            />
          </Pressable>
        </View>
        <View style={{ width: "69%" }}>
          <Pressable
            type="clear"
            onPress={() => gatlineIdset(item.id)}
            title="View order Detail"
          >
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
            {/* <Text style={{ width: '100%', color: '#000' }}><Text style={{ width: '100%', color: '#000', fontWeight: 'bold' }}>Order Date : </Text>{item.order_date}</Text> */}
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
          </Pressable>
          <View style={styles.row}>
            {item.report_url !== null && (
              <TouchableOpacity
                onPress={() => {
                  Linking.openURL(item.report_url)
                    .then((res) => {
                      console.log("res", res);
                    })
                    .catch((err) => {
                      console.log("err", err);
                    });
                }}
                style={{}}
              >
                <Text style={styles.downloadButtonText}>Download report</Text>
              </TouchableOpacity>
            )}
            {item.delivery_status === "Order Received" &&
            isCancelVisible &&
            item.is_time_exceeded != "1" &&
            item.report_url === null ? (
              <Pressable
                type="clear"
                onPress={() => showConfirmDialog(item.order_id, item.id)}
                title="Cancel"
                style={{ fontSize: 16, width: "auto", width: "100%" }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    lineHeight: 18,
                    color: "#1D2359",
                    textAlign: "right",
                    //fontWeight: "bold",
                    marginRight: 20,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <ProgressLoader isVisible={loading} />
      <FlashMessage />
      <Header
        categoryTitle={categoryTitle}
        backButtonwithtext
      />
      <View style={styles.listView}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
              tintColor={colors.primaryColor}
              colors={[colors.primaryColor]}
            />
          }
          style={styles.orderCardStyle}
          contentContainerStyle={{
            paddingBottom: Platform.OS == "android" ? 0 : 60,
          }}
          data={order ? order?.data?.sort((a, b) => b.id - a.id) : []}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderOrderItems}
          ListHeaderComponent={() => (
            <View>
            <View style={styles.refreshView}>
              <Text style={styles.pullDown}>Pull-down to refresh page</Text>
              </View>
              <Text style={{fontSize:14,
                    color: colors.themeColor, 
                    marginHorizontal:10,
                    marginBottom: 10,
                    fontFamily: fonts.whitneyMedium,}}>{order.my_order_text}</Text>
            </View>
          )}
        />
      </View>
      {/* </ScrollView> */}
      <View
        style={{
          width: "100%",
          padding: 5,
          position: "absolute",
          bottom: 5,
        }}
      >
        {/* <Button
          color="#F79489" mode="outlined" style={{ flex: 1, width: 'auto' }}
          uppercase={false} title="Continue shopping" onPress={() => contiNueshoping()} /> */}
        <ButtonCustom
          title="Continue shopping"
          onPress={() => contiNueshoping()}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  row: {
    width: "100%",
    marginTop: 10,
  },
  downloadButton: {
    width: "90%",
    height: scale(34),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F79489",
    borderRadius: 5,
    marginVertical: 5,
  },
  cancelButton: {
    width: "90%",
    height: scale(34),
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#F79489",
    borderRadius: 5,
    borderWidth: 1.5,
    marginBottom: 5,
  },
  downloadButtonText: {
    fontSize: 14,
    fontFamily: fonts.whitneySemiBold,
    color: "#F79489",
    textAlign: "right",
    marginRight: 20,
  },
  cancelText: {
    fontSize: 14,
    fontFamily: fonts.whitneySemiBold,
    color: "#F79489",
    textAlign: "center",
  },
  orderiTem: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    padding: 5,
    margin: 3,
    paddingLeft: 2,
    marginRight: 0,
  },
  tagRight: {},
  orderCardStyle: {
    width: width - 10,
    paddingTop: 1,
    marginTop: 1,
  },
  refreshView: {
    width: width - 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#dddddd",
    marginBottom: 10,
  },
  pullDown: {
    fontSize: 14,
    fontFamily: fonts.whitneyMedium,
  },
  listView: {
    width: width,
    paddingRight: 0,
    marginTop: 10,
    marginLeft: 0,
    marginRight: 0,
    height: height - 200,
    padding: 5,
  },
});
export default MyOrderScreen;
