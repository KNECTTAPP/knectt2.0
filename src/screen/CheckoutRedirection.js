import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  AppState,
} from "react-native";
import { ButtonCustom } from "../component/ButtonCustom";
import icons from "../../assets/iconsIndex";
import strings from "../utils/strings";
import colors from "../utils/colors";
import { Linking } from "react-native";
import { fetchPaymentStatus } from "../services";

const CheckoutRedirection = ({ navigation, route }) => {
  console.log("NSHBSH SH SHS::::", route.params);
  const timeId = useRef(null);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const POLLING_INTERVAL = 2000;
  const pollingIntervalRef = useRef(null);

  const checkPaymentStatus = useCallback(async () => {
    try {
      const res = await fetchPaymentStatus(String(route.params.orderId));
      console.log("payment status-->", res);
      if (res?.status == 200 && res?.payment_status == "success") {
        clearInterval(pollingIntervalRef.current); // Stop polling on success
        navigation.replace("OrderThanks");
      }
    } catch (error) {
      console.error("Error fetching payment status", error);
    }
  }, [route.params.orderId, navigation]);

  const startPolling = useCallback(() => {
    // Ensure no duplicate intervals
    if (!pollingIntervalRef.current) {
      pollingIntervalRef.current = setInterval(
        checkPaymentStatus,
        POLLING_INTERVAL
      );
    }
  }, [checkPaymentStatus]);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);
  // useEffect(() => {
  //   const handleAppStateChange = (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       startPolling(); // Start polling when app returns to the foreground
  //     } else {
  //       stopPolling(); // Stop polling when app goes to the background
  //     }
  //     appState.current = nextAppState;
  //   };

  //   const subscription = AppState.addEventListener(
  //     "change",
  //     handleAppStateChange
  //   );

  //   // Start polling immediately when the component mounts
  //   startPolling();

  //   return () => {
  //     subscription.remove();
  //     stopPolling(); // Clean up polling on unmount
  //   };
  // }, [startPolling, stopPolling]);

  const _onPressContinue = () => {
    const url = `https://www.knectt.com/checkout/${route.params.orderId}`;
    // const url = `https://dev.knectt.com/checkout/${route.params.orderId}`;
// console.log(url, 'hey url bro')
    // Linking.openURL(url);

    navigation.navigate("PaymentWebView", {paymentUrl: url})
  };
  const _onPressLearnMore = () => {
    const url = `https://apps.apple.com/in/story/id1614232807`;
    Linking.openURL(url);
  };
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        <Image source={icons.icon_app_store} style={styles.img} />
        <Text style={styles.title}>App Store</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.alertTitle}>{strings.payment_alert_title}</Text>
        <Text style={styles.alertDesc}>{strings.payment_alert_desc}</Text>
        <Text
          //   onPress={() => navigation.navigate("LearnMore")}
          onPress={_onPressLearnMore}
          style={styles.learnMore}
        >
          Learn More
        </Text>
      </ScrollView>
      <ButtonCustom
        containerStyle={{ backgroundColor: colors.themeColor }}
        title={"Continue"}
        onPress={_onPressContinue}
      />

      <View style={{ marginBottom: 10 }} />
      <ButtonCustom
        title={"Cancel"}
        containerStyle={styles.cancel}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  img: {
    height: 30,
    width: 30,
    resizeMode: "contain",
  },
  imgContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 18, marginLeft: 5, fontWeight: "600" },
  alertTitle: { fontSize: 40, fontWeight: "500" },
  alertDesc: { fontSize: 16, marginTop: 10 },
  scroll: { paddingVertical: 20, paddingHorizontal: 10, marginVertical: 10 },
  cancel: { backgroundColor: "grey" },
  learnMore: {
    marginBottom: 60,
    textAlign: "center",
    marginTop: 30,
    color: colors.primaryColor,
    textDecorationLine: "underline",
  },
});

export default CheckoutRedirection;
