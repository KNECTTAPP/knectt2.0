import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../component/Header";
import FlashMessage from "react-native-flash-message";
import WebView from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
const PaymentWebView = ({ route }) => {
  const { paymentUrl } = route.params;
  console.log(paymentUrl, 'its payment url')

  const navigation = useNavigation()

  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <View style={styles.container}> */}
      <FlashMessage />
      <Header categoryTitle={"Confirm Payment"} backButtonwithtext />
      <WebView
        source={{ uri: paymentUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onNavigationStateChange={(event) => {
          console.log("asdasdasdasdasdasdasd", event)
          // Optional: detect success/failure URLs
          if (event.title.includes("Payment Cancelled")) {
            // Handle Cancel
            navigation.navigate('Cart')
          } else if (event.title.includes("Payment Successful")) {
            navigation.navigate('OrderThanks')
            // Handle Success
          }
        }}
      />
      {/* </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default PaymentWebView;
