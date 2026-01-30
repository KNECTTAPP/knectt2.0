import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CategoryTabScreen from "../screen/CategoryTabScreen";
import ChatbotScreen from "../screen/ChatbotScreen";
import MyOrderScreen from "../screen/MyOrderScreen";
import OfferingsScreen from "../screen/offeringPage/OfferingPage";

import BodyMatch from "../../assets/img/body_match.png";
import Category from "../../assets/img/category.png";
import CategoryPink from "../../assets/img/category_pink.png";
import menuIcon from "../../assets/img/menuIcon.png";
import Order from "../../assets/img/order.jpg";
import OrderPink from "../../assets/img/OrderPink.jpeg";
import colors from "../utils/colors";
import { openDrawer } from "./DrawerService";


const Tab = createBottomTabNavigator();

const TabNavigators = () => {
  const navigation = useNavigation();
 
  useEffect(() => {
    //setupNotificationListeners();
  }, []);

    const insets = useSafeAreaInsets();

  return (  
    <Tab.Navigator
      initialRouteName="ChatScreen"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          paddingTop: 10,
           paddingBottom: Math.max(insets.bottom, 8),
          height: 60 + insets.bottom,
        },
      }}
    >
      {/* ---------------- MENU (open drawer) ---------------- */}
      <Tab.Screen
        name="MenuTab"
        component={OfferingsScreen} // dummy component, never shown
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            openDrawer();// ← drawer opens correctly
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Image
                source={menuIcon}
                style={[styles.icon, { width: 23, height: 23 }]}
              />
              <Text
                style={[
                  styles.label,
                  { color: "grey" },
                ]}
              >
                Menu
              </Text>
            </View>
          ),
        }}
      />

      {/* ---------------- BODY MATCH PRODUCTS ---------------- */}
      <Tab.Screen
        name="Offerings Page"
        component={OfferingsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={[styles.tabItem, { marginTop: 0 }]}>
              <Image
                source={BodyMatch}
                style={{
                  width: 26,
                  height: 26,
                  marginBottom: 5,
                  tintColor: focused ? colors.primaryColor : null,
                }}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? colors.primaryColor : "grey" },
                ]}
              >
                Body Matched
              </Text>
              
            </View>
          ),
        }}
      />

      {/* ---------------- CHAT SCREEN ---------------- */}
      <Tab.Screen
        name="ChatScreen"
        component={ChatbotScreen}
        options={{
          tabBarIcon: () => (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: "#fff",
                  width: 79,
                  height: 79,
                  borderRadius: 79 / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  top: -30,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                }}
              >
                <Image
                  source={require("../assets/bgRemovedLogo.png")}
                  resizeMode="contain"
                  style={{ width: 60, height: 60 }}
                />
              </View>
            </View>
          ),
          tabBarHideOnKeyboard: true,
        }}
      />

      {/* ---------------- CATEGORY ---------------- */}
      <Tab.Screen
        name="CategoryTab"
        component={CategoryTabScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Image
                source={focused ? CategoryPink : Category}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.label,
                  { color: focused ? colors.primaryColor : "grey" },
                ]}
              >
                Category
              </Text>
            </View>
          ),
        }}
      />

      {/* ---------------- MY ORDERS ---------------- */}
      <Tab.Screen
        name="My Order"
        component={MyOrderScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Image source={focused ? OrderPink : Order} style={styles.icon} />
              <Text
                style={[
                  styles.label,
                  { color: focused ? colors.primaryColor : "grey" },
                ]}
              >
                My Order
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigators;

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
    width:100
  },
});
