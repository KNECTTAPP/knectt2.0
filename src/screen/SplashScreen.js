import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import logo from "../../assets/img/BrandLogo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-splash-screen";
const SpashScreen = ({ navigation }) => {
  const navigateToNextScreen = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      setTimeout(() => {
        if (usertoken) {
          navigation.replace("TabNavigators", {
            screen: "Home",
          });
        } else {
          navigation.replace("Ulogin");
        }
      }, 3000);
    } catch (error) {
      console.error("Error fetching token:", error);
      navigation.replace("Ulogin");
    } finally {
      SplashScreen.hide();
    }
  };

  useEffect(() => {
    navigateToNextScreen();
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
      }}
    ></View>
  );
};
export default SpashScreen;
