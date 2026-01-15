import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  
  ImageBackground,
} from "react-native";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import logo from "../../assets/img/BrandLogo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SplashScreen from "react-native-bootsplash";
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
          navigation.replace("Login");
        }
      }, 3000);
    } catch (error) {
      console.error("Error fetching token:", error);
      navigation.replace("Login");
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
