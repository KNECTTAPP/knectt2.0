import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomSidebarMenu from "../component/CustomSidebarMenu";
import HomeScreen from "../screen/HomeScreen";
import CategoryScreen from "../screen/CategoryScreen";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

import DetailScreen from "../screen/DetailScreen";
import SpashScreen from "../screen/SplashScreen";
import LoginScreen from "../screen/LoginScreen";
import TabNavigators from "./TabNavigators";
import OtpScreen from "../screen/OtpScreen";
import ChatBots from "../screen/ChatBots";
import MainCategory from "../screen/MainCategoryScreen";
import TermsAndCondition from "../screen/TermsAndCondition";
import Fewbasicinfo from "../screen/Fewbasicinfo";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root() {
  return (
    <Stack.Navigator>
      <Drawer.Screen name="MainCategory" component={MainCategory} />
      <Drawer.Screen name="Category" component={Category} />
    </Stack.Navigator>
  );
}
const StackNavigators = () => {
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setSplash(false);
    }, 2000);
  });
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{ headerShown: false }}
        drawerContentOptions={{
          activeTintColor: "#e91e63",
          itemStyle: { marginVertical: 5 },
        }}
        drawerContent={(props) => <CustomSidebarMenu {...props} />}
      >
        <Drawer.Screen name="TabNavigators" component={TabNavigators} />
        <Drawer.Screen name="Details" component={DetailScreen} />
        <Drawer.Screen name="chatbot" component={ChatBots} />
        <Drawer.Screen name="otp" component={OtpScreen} />
        <Drawer.Screen name="Fewbasicinfo" component={Fewbasicinfo} />

        <Drawer.Screen name="termsAndCondition" component={TermsAndCondition} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default DrawerNavigation;
