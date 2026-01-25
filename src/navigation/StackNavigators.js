import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BootSplash from "react-native-bootsplash";

import { navigationRef } from "../services/NavigationService";
import CustomSidebarMenu from "../component/CustomSidebarMenu";

// Screens (Example, add all screens as needed)
import LoginScreen from "../screen/LoginScreen";
import TabNavigators from "./TabNavigators";
import MainCategory from "../screen/MainCategoryScreen";
import TermsAndCondition from "../screen/TermsAndCondition";
import DrawerNavigator from "./DrawerNavigation";
import DrawerProvider from "./DrawerProvider";
import AffiliateCreateScreen from "../screen/AffiliateCreateScreen";
import ContactUsScreen from "../screen/ContactUsScreen";
import AffiliateScreen from "../screen/AffiliateScreen";
import RefeEarnScreen from "../screen/RefeEarnScreen";
import AccountProfileScreen from "../screen/AccountProfileScreen";
import ReviewsScreen from "../screen/ReviewsScreen";
import SpashScreen from "../screen/SplashScreen";
import Fewbasicinfo from "../screen/Fewbasicinfo";
import CategoryListScreen from "../screen/CategoryListScreen";
import CategoryScreen from "../screen/CategoryScreen";
import AddressScreen from "../screen/AddressScreen";
import AddEditAddressScreen from "../screen/AddEditAddressScreen";
import DetailScreen from "../screen/DetailScreen";
import CartScreen from "../screen/CartScreen";
import CheckoutScreen from "../screen/CheckoutScreen";
import AffiliateCredentialsScreen from "../screen/AffiliateCredentialsScreen";
import KnecttReport from "../screen/KnecttReport";
import ProductDetailScreen from "../screen/ProductDetailScreen";
import SearchScreen from "../screen/SearchScreen";
import MyOrderScreen from "../screen/MyOrderScreen";
import NotificationScreen from "../screen/NotificationScreen";
import ChatbotScreen from "../screen/ChatbotScreen";
import DietTrackingScreen from "../screen/DietTrackingScreen";
import MyChartScreen from "../screen/MyChartScreen";
import DietScreen from "../screen/DietScreen";
import ChatbotEditScreen from "../screen/ChatbotEditScreen";
import PolicyScreen from "../screen/PolicyScreen";
import ChatbotNutritionScreen from "../screen/ChatbotNutritionScreen";
import PoliciesScreen from "../screen/PoliciesScreen";
import OrderThanksScreen from "../screen/OrderThanksScreen";
import DietThanksScreen from "../screen/DietThanksScreen";
import DietPayScreen from "../screen/DietPayScreen";
import MyOrderDetialScreen from "../screen/MyOrderDetialScreen";
import EditChatbotNutritionScreen from "../screen/EditChatbotNutritionScreen";
import BloodTestScreen from "../modules/BloodTest";
import LearnMore from "../screen/LearnMore";
import CheckoutRedirection from "../screen/CheckoutRedirection";
import DeleteAccount from "../screen/DeleteAccount";
import PaymentWebView from "../screen/PaymentWebView";
import UploadReport from "../screen/uploadReport/UploadReport";
import MyDietScreen from "../screen/MyDietScreen";
import PreHomeKnecttGuide from "../screen/PreHomeKnecttGuide";
import NutritionistLiveChat from "../screen/NutritionistLiveChat";
import OtpScreen from "../screen/OtpScreen";

// Create Stack Navigator

const Stack = createNativeStackNavigator();
//const Drawer = createDrawerNavigator();

// ------------- Root Stack -------------
function RootStack({ initialRoute }) {

  return (
    <Stack.Navigator screen screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute == "login" ? "Login" : "TabNavigators"}
    >
      <Stack.Screen name="TabNavigators" component={TabNavigators} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="otp"
        component={OtpScreen}
      />
      <Stack.Screen name="MainCategory" component={MainCategory} />
      <Stack.Screen name="TermsAndCondition" component={TermsAndCondition} />

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
        name="AffiliateCreate"
        component={AffiliateCreateScreen}
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
        name="RCsplash"
        component={SpashScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Fewbasicinfo"
        component={Fewbasicinfo}
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

      <Stack.Screen
        name="Policies"
        component={PoliciesScreen}
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


      {/* Add all other Stack screens here */}
    </Stack.Navigator>
  );
}

// ------------- Drawer Navigator -------------

// function DrawerNavigator({initialRoute}) {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerShown: false,
//         drawerActiveTintColor: "#e91e63",
//         drawerItemStyle: { marginVertical: 5 },
//       }}
//       drawerContent={(props) => <CustomSidebarMenu {...props} />}
//     >

//        <Drawer.Screen name="RootDrawer">
//         {(props) => <RootStack {...props} initialRoute={initialRoute} />}
//       </Drawer.Screen>
//     </Drawer.Navigator>
//   );
// }


// ------------- Root Navigation -------------
function RootNavigator({ initialRoute }) {

  return (
    <NavigationContainer ref={navigationRef}>
      <DrawerProvider>

        {initialRoute === "login" ? <RootStack initialRoute={initialRoute} /> : <RootStack initialRoute={initialRoute} />}
      </DrawerProvider>
    </NavigationContainer>
  );
}

// ------------- Main Export -------------
export default function StackNavigators({ linking }) {
  const [isReady, setIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        let token = await AsyncStorage.getItem("usertoken");
        setInitialRoute(token ? "TabNavigators" : "login");
      } catch (error) {
        setInitialRoute("login");
      } finally {
        setTimeout(async () => {
          await BootSplash.hide({ fade: false });
        }, 2000);

        setIsReady(true);
      }
    };

    init();
  }, []);

  if (!isReady || !initialRoute) {
    return null; // ya Loader component
  }

  return <RootNavigator initialRoute={initialRoute} linking={linking} />;
}
