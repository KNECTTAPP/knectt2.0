import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import {
  View
} from "react-native";
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
