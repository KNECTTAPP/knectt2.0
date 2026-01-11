import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CustomSidebarMenu from "../component/CustomSidebarMenu";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "../screen/HomeScreen";
import EndUrl from "../api/EndUrl";
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
import MyChartScreen from "../screen/MyChartScreen";
import MainCategory from "../screen/MainCategoryScreen";
import ProductDetailScreen from "../screen/ProductDetailScreen";
import TermsAndCondition from "../screen/TermsAndCondition";
import AddressScreen from "../screen/AddressScreen";
import AddEditAddressScreen from "../screen/AddEditAddressScreen";
import CartScreen from "../screen/CartScreen";
import AccountProfileScreen from "../screen/AccountProfileScreen";
import AffiliateCreateScreen from "../screen/AffiliateCreateScreen";
import ContactUsScreen from "../screen/ContactUsScreen";
import ReviewsScreen from "../screen/ReviewsScreen";
import RefeEarnScreen from "../screen/RefeEarnScreen";
import AffiliateScreen from "../screen/AffiliateScreen";
import CheckoutScreen from "../screen/CheckoutScreen";
import AffiliateCredentialsScreen from "../screen/AffiliateCredentialsScreen";
import SearchScreen from "../screen/SearchScreen";
import MyOrderScreen from "../screen/MyOrderScreen";
import NotificationScreen from "../screen/NotificationScreen";
import ChatbotScreen from "../screen/ChatbotScreen";
import MyOrderDetialScreen from "../screen/MyOrderDetialScreen";
import DietUpgradScreen from "../screen/DietUpgradScreen";
import DietScreen from "../screen/DietScreen";
import ChatbotEditScreen from "../screen/ChatbotEditScreen";
import PolicyScreen from "../screen/PolicyScreen";
import DietThanksScreen from "../screen/DietThanksScreen";
import ChatbotNutritionScreen from "../screen/ChatbotNutritionScreen";
import PoliciesScreen from "../screen/PoliciesScreen";
import OrderThanksScreen from "../screen/OrderThanksScreen";
import EditChatbotNutritionScreen from "../screen/EditChatbotNutritionScreen";
import CategoryListScreen from "../screen/CategoryListScreen";
import DietPayScreen from "../screen/DietPayScreen";
import BloodTestScreen from "../modules/BloodTest";
import LearnMore from "../screen/LearnMore";
import CheckoutRedirection from "../screen/CheckoutRedirection";
import { Linking } from "react-native";
import DeleteAccount from "../screen/DeleteAccount";
import SplashScreen from "react-native-splash-screen";
import { navigationRef } from "../services/NavigationService";
import PaymentWebView from "../screen/PaymentWebView";
import Fewbasicinfo from "../screen/Fewbasicinfo";
import PreHomeKnecttGuide from "../screen/PreHomeKnecttGuide"
import DietTrackingScreen from '../screen/DietTrackingScreen';
import NutritionistLiveChat from '../screen/NutritionistLiveChat';
import { PreHomePageModalProvider } from "../context/PreHomePageContext";
import UploadReport from "../screen/uploadReport/UploadReport";
import MyDietScreen from "../screen/MyDietScreen";
import KnecttReport from "../screen/KnecttReport";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function Root({ initialRoute }) {
  // const [splash, setSplash] = useState(true);

  // async function requestUserPermission() {
  //   const authorizationStatus = await messaging().requestPermission();

  //   if (authorizationStatus) {
  //     console.log("Permission status:", authorizationStatus);
  //   }
  // }
  // async function fetchInitialNotifications() {
  //   const initialNotification = await messaging().getInitialNotification();
  //   if (initialNotification != null) {
  //     let validateJson = JSON.stringify(initialNotification);
  //     let validateObject = JSON.parse(validateJson);
  //     //await messaging().cancelNotification(validateObject.notification.id);
  //     //await messaging().cancelDisplayedNotification(validateObject.notification.id);
  //   }
  // }

  // const displayFirebaseNotifications = async (remoteMessage) => {
  //   console.log("remoteMessage--on message--", remoteMessage);
  //   try {
  //     // await messaging().displayNotification({
  //     //   title: remoteMessage.notification.title,
  //     //   body: remoteMessage.data.notify_message,
  //     //   data: {
  //     //     'scenario': remoteMessage.data.module,
  //     //     'scenarioId': remoteMessage.data.mobile_scenario_id,
  //     //     'notificationId': remoteMessage.data.id
  //     //   }
  //     // })
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // async function fetchFirebaseToken() {
  //   // await messaging().requestPermission();
  //   const FirebaseFcmToken = await messaging().getToken();
  //   console.log("FirebaseFcmToken--", FirebaseFcmToken);
  //   if (FirebaseFcmToken != null) {
  //     await AsyncStorage.setItem("fcmToken", JSON.stringify(FirebaseFcmToken));
  //   }
  //   const fireBasePayloadData = messaging().onMessage(async (remoteMessage) => {
  //     displayFirebaseNotifications(remoteMessage);
  //     return remoteMessage;
  //   });
  // }
  // useEffect(() => {
  //   // fetchInitialNotifications();
  //   fetchFirebaseToken();
  //   // requestUserPermission();
  // }, []);
  return (
    <Stack.Navigator
      initialRouteName={initialRoute == "login" ? "login" : "TabNavigators"}
      options={{ headerShown: false }}
    >
      <Stack.Screen
        name="TabNavigators"
        component={TabNavigators}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AffiliateCreate"
        component={AffiliateCreateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Affiliate"
        component={AffiliateScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RefeEarn"
        component={RefeEarnScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AccountProfile"
        component={AccountProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ulogin"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RCsplash"
        component={SpashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="otp"
        component={OtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Fewbasicinfo"
        component={Fewbasicinfo}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainCategory"
        component={MainCategory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Category"
        component={CategoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Address"
        component={AddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddEditAddress"
        component={AddEditAddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={DetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AffiliateCredentials"
        component={AffiliateCredentialsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="KnecttReport"
        component={KnecttReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyOrder"
        component={MyOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chatbot"
        component={ChatbotScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="chat"
        component={ChatbotScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DietTrackingScreen"
        component={DietTrackingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chart"
        component={MyChartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Diet"
        component={DietScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditDietProfile"
        component={ChatbotEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Policy"
        component={PolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatbotNutrition"
        component={ChatbotNutritionScreen}
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="Upgrade"
        component={DietUpgradScreen}
        options={{ headerShown: false }}
      /> */}
      <Stack.Screen
        name="Policies"
        component={PoliciesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TermsAndCondition"
        component={TermsAndCondition}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderThanks"
        component={OrderThanksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DietThanks"
        component={DietThanksScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DietPay"
        component={DietPayScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={MyOrderDetialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditChatbotNutrition"
        component={EditChatbotNutritionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BloodTestScreen"
        component={BloodTestScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LearnMore"
        component={LearnMore}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CheckoutRedirection"
        component={CheckoutRedirection}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeleteAccount"
        component={DeleteAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentWebView"
        component={PaymentWebView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UploadReport"
        component={UploadReport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="My Diet"
        component={MyDietScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreHomeKnecttGuide"
        component={PreHomeKnecttGuide}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NutritionistLiveChat"
        component={NutritionistLiveChat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function DrawerNavigator({ initialRoute }) {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContentOptions={{
        activeTintColor: "#e91e63",
        itemStyle: { marginVertical: 5 },
      }}
      drawerContent={(props) => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen name="RootDrawer">
        {(props) => <Root {...props} initialRoute={initialRoute} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
}

function RootNavigator({ initialRoute, linking }) {
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      {/* <PreHomePageModalProvider> */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* {initialRoute === "login" ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        )} */}
          <Stack.Screen name="Drawer">
            {(props) => (
              <DrawerNavigator {...props} initialRoute={initialRoute} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      {/* </PreHomePageModalProvider> */}
    </NavigationContainer>
  );
}

const StackNavigators = ({ linking }) => {
  // useEffect(() => {
  //   // Setting the navigation reference to handle deep link navigation
  //   const navigation = setNavigationRef;
  //   if (navigation) {
  //     // Now you have the navigation reference available, you can use it.
  //   }
  // }, [setNavigationRef]);

  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  console.log("I AM HERSSSSS");
  // Handle token logic during splash screen
  useEffect(() => {
    const checkTokenAndHandleNavigation = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setInitialRoute("drawer");
        } else {
          setInitialRoute("login");
        }
      } catch (error) {
        console.error("Error checking token", error);
        setInitialRoute("login");
      } finally {
        setTimeout(() => {
          SplashScreen.hide();
        }, 3000);

        setIsReady(true);
      }
    };

    checkTokenAndHandleNavigation();
  }, []);

  if (!isReady) return null;

  return <RootNavigator initialRoute={initialRoute} linking={linking} />;
};

export { DrawerNavigator }

export default StackNavigators;
