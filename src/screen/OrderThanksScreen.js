import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import FlashMessage from "react-native-flash-message";
import Header from "../component/Header";
import { IconCheck } from "../component/IconComp";
import fonts from "../utils/fonts";
import { ro } from "date-fns/locale";
//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const OrderThanksScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Order Thanks");
  const [titleText, setTitleText] = useState(null);
  const [itemText, setItemText] = useState([]);
  const [order, setOrder] = useState([]);
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

  useEffect(() => {
    setTimeout(function () {
      navigation.replace("TabNavigators", {
        screen: "My Order",
      });
    }, 3500);
  }, [refresh]);
  return (
    <SafeAreaView style={styles.screenContainer}>
      <View
        style={{
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <View style={styles.backgroundColor}>
          <Image
            source={require("../../assets/img/check.png")}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
          <Text style={styles.title}>Payment Successful</Text>
          <Text style={styles.payment}>
            Your payment ID is{" "}
            <Text
              style={[
                styles.payment,
                {
                  fontFamily: fonts.whitneySemiBold,
                },
              ]}
            >
              {route?.params?.paymentId}
            </Text>
          </Text>
          <Text style={styles.payment}>
            We received your purchase request. We'll be in touch shortly!
          </Text>
        </View>
        <View
          style={[
            styles.backgroundColor,
            {
              paddingVertical: 40,
              marginTop: 10,
            },
          ]}
        >
          <View style={styles.refreshView}>
            <Text style={styles.refreshText}>
              Please refresh the KNECTT app to view your orders.
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  backgroundColor: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  heading: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 16,
    alignItems: "flex-start",
  },
  subheading: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 16,
    alignItems: "flex-start",
    marginTop: 10,
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
  title: {
    fontSize: 20,
    fontFamily: fonts.whitneySemiBold,
    marginTop: 30,
  },
  payment: {
    fontSize: 15,
    fontFamily: fonts.whitneyBook,
    marginTop: 15,
    textAlign: "center",
  },
  refreshView: {
    width: "95%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#2BB06A",
    borderRadius: 10,
    padding: 10,
  },
  refreshText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: fonts.whitneyMedium,
    textAlign: "center",
  },
});
export default OrderThanksScreen;
