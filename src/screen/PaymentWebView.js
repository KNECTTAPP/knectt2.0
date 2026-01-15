import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "../component/Header";
import FlashMessage from "react-native-flash-message";
import WebView from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
const PaymentWebView = ({ route }) => {
  const { paymentUrl } = route.params;
  console.log(paymentUrl,'its payment url')

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
        // onNavigationStateChange={(event) => {
        //   // Optional: detect success/failure URLs
        //   if (event.url.includes("success")) {
        //     // Handle success
        //   } else if (event.url.includes("failure")) {
        //     // Handle failure
        //   }
        // }}
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
