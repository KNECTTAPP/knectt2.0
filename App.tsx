import React, { useEffect, useRef, useState } from "react";

import {
  AppState,
  Linking,
  Platform,
  // SafeAreaView,
  StatusBar,
  StyleSheet
} from "react-native";
import FlashMessage from "react-native-flash-message";
import "react-native-gesture-handler";
import { setCustomText } from "react-native-global-props";
import StackNavigators from "./src/navigation/StackNavigators";
import { StorageProvider } from "../KnecttApp/src/storage/StorageContext";
import UpdateApp from "./src/screen/UpdateApp";
import {
  appFlayerInitialize
} from "./src/utils/appflayerDeepLink";
import fonts from "./src/utils/fonts";
// import NotificationService from "./src/services/NotificationService";
// navigator.geolocation = require("@react-native-community/geolocation");
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appsFlyer from "react-native-appsflyer";
import BootSplash from "react-native-bootsplash";
import DeviceInfo from "react-native-device-info";
import { Settings } from "react-native-fbsdk-next";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import checkVersion from "react-native-store-version";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import {
  navigationRef,
  NavigationService,
} from "./src/services/NavigationService";

global.userdata = [];
const APPSFLYER_ONE_LINK_ID = "APPSFLYER_ONE_LINK_ID";
const App = () => {


  //   import { useSelector } from "react-redux";

  // const user = useSelector((state) => state.user.userData);

  // import { useDispatch } from "react-redux";
  // import { loginSuccess, logout } from "../redux/slices/userSlice";

  // const dispatch = useDispatch();

  // dispatch(loginSuccess({ name: "Manpreet", email: "test@gmail.com" }));



  // const [navigationRef, setNavigationRef] = useState(null);
  BootSplash.isVisible().then((value) => console.log("sadfasfadfasdasdasdds" + value));
  const [deepLinkUrl, setDeepLinkUrl] = useState(null);
  const appState = useRef(AppState.currentState);
  const [hasSkippedUpdate, setHasSkippedUpdate] = useState(false);
  const [isOldFordeUpdatePopup, setIsOldFordeUpdatePopup] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  const iosStoreURL =
    "https://apps.apple.com/in/app/knectt-health-marketplace/id6517353884";
  const androidStoreURL =
    "https://play.google.com/store/apps/details?id=com.knectt";

  const customTextProps = {
    style: {
      fontFamily: fonts.whitneyMedium,
    },
  };

  setCustomText(customTextProps);

  //efffects *****************************************************
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    requestUserPermission();
    getFCMToken();
    setupNotificationChannels();
    // setupNotificationListeners();
  }, []);

  useEffect(() => {
    initializeApp();
    appFlayerInitialize();
    // appFlayerInitialize1();
  }, []);

  useEffect(() => {
    // appsFlyer.onInstallConversionData((res) => { // for code start , first start
    //   const data = res?.data;
    //   console.log(res,'its first link>>')
    //   Alert.alert('ll')
    //   if (data?.is_first_launch === true && data?.af_status === 'Non-organic') {
    //     // handleDeepLinkNavigation(data);
    //     console.log('Hi first launch ', res)
    //   Alert.alert('yes fiirstincall')
    //   }
    // });
    // Check if the app was opened with a deep link on startup
    const checkInitialLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log("App opened with deep link:", initialUrl);
        setDeepLinkUrl(initialUrl); // Store the deep link URL

        if (initialUrl?.includes("KpX8") || initialUrl?.includes("y1Mk")) {
          try {
            await AsyncStorage.setItem("affliateLink", initialUrl);
            console.log("Affiliate link saved. yyy");
          } catch (error) {
            console.error("Failed to save affiliate link:", error);
          }
        }
        handleDeeplinking(initialUrl);
      }
    };

    setTimeout(() => {
      if (navigationRef.isReady()) checkInitialLink();
    }, 1000);
  }, []);

  // useEffect(() => {
  //   // Trigger navigation if the navigationRef is ready and we have a deep link URL
  //   if (navigationRef.isReady() && deepLinkUrl) {
  //     console.log("Navigating to screen:", deepLinkUrl);
  //     if (deepLinkUrl.includes("OrderSuccess")) {
  //       Platform.OS === "ios" &&
  //         NavigationService.navigate("TabNavigators", {
  //           screen: "My Order",
  //         });
  //     }
  //   }
  // }, [deepLinkUrl]);

  //helpers function******************************************

  const initializeApp = async () => {
    try {
      // ✅ Initialize Facebook SDK
      Settings.initializeSDK();
      // Initialize notification service first
      // await NotificationService.init();
      const isOldFordeUpdatePopup = await AsyncStorage.getItem(
        "isOldFordeUpdatePopup"
      );

      if (isOldFordeUpdatePopup === "true") {
        setIsOldFordeUpdatePopup(true);
      }

      // Then set up other services
      // NotificationService.setupMessageHandlers();

      // Rest of your initialization code...
      const listener = Linking.addEventListener("url", async (event) => {
        console.log("uaska event===>", event);
        if (event?.url) {
          if (event.url.includes("KpX8") || event.url.includes("y1Mk")) {
            try {
              await AsyncStorage.setItem("affliateLink", event.url);
              console.log("Affiliate link saved.");
            } catch (error) {
              console.error("Failed to save affiliate link:", error);
            }
          }
          if (event.url.includes(`/${APPSFLYER_ONE_LINK_ID}/`)) {
            //This will process the link as a onelink if it contains the appsflyerOnelink ID.
            // This is the workaround to process both appsflyer and non appsflyer links.
            appsFlyer.performOnAppAttribution(
              event.url,
              (res) => {
                console.log("Processed a oneLink", res);
              },
              (error) => {
                console.log("Failed to process a oneLink", error);
              }
            );
          }
          handleDeeplinking(event.url);
        }
      });

      // appFlayerInitialize();

      return () => {
        listener.remove();
      };
    } catch (error) {
      console.error("Error initializing app:", error);
    }
  };

  const requestUserPermission = async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
      // getFCMToken(); // Only get the FCM token if the permission is granted
    } else {
    }
  };

  const setupNotificationChannels = async () => {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      sound: "default",
      importance: AndroidImportance.HIGH,
    });
  };

  const getFCMToken = async () => {
    try {
      let fcmToken = await AsyncStorage.getItem("fcmToken");
      if (!fcmToken) {
        fcmToken = 'sdfsdfdsfsdf';
        if (fcmToken) await AsyncStorage.setItem("fcmToken", fcmToken);
      }
      // console.log("FCM Token:", fcmToken || "Not Found");
      return fcmToken;
    } catch (error) {
      console.error("Error retrieving FCM token:", error);
      return null;
    }
  };

  const checkForUpdate = async () => {
    try {
      const payload = {
        version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""), // app local version
        iosStoreURL,
        androidStoreURL,
      };
      const check = await checkVersion(payload);
      if (check.result === "new") {
        setIsUpdateAvailable(true);
      } else {
        setIsUpdateAvailable(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Listen to AppState changes
  const handleAppStateChange = (nextAppState) => {
    if (AppState.currentState === "active" && !isUpdateAvailable) {
      // Recheck version when the app becomes active
      checkForUpdate();
    }
  };

  const handleDeeplinking = (url) => {
    console.log("Navigating with deep link:", url, navigationRef);

    if (!url) return; // Ensure URL is not undefined or null

    // Extract the query string from the URL
    const queryString = url.split("?")[1] || "";
    let productId = null;

    // Manually parse query parameters (alternative to URLSearchParams)
    queryString.split("&").forEach((param) => {
      const [key, value] = param.split("=");
      if (key === "productId") {
        productId = decodeURIComponent(value || "");
      }
    });

    // Check if a productId is present and navigate to the ProductDetail screen
    if (productId) {
      console.log(`Navigating to ProductDetail with productId: ${productId}`);
      NavigationService.navigate("ProductDetail", { proId: productId });
    } else {
      // Handle other deep link cases (e.g., "OrderSuccess")
      if (url.includes("OrderSuccess")) {
        console.log("Navigating to My Order screen");
        NavigationService.navigate("TabNavigators", { screen: "My Order" });
      }
    }

    // Optionally, store the deep link for later use
    setDeepLinkUrl(url);
  };

  const linking = {
    prefixes: ["knectt://", "https://knectt.onelink.me"],
    config: {
      screens: {
        OrderThanks: "OrderThanksScreen", // Define your screens and paths here
        ProductDetail: "productDetail/:proId",
      },
    },
  };

  const onPressUpdate = () => {
    if (Platform.OS === "ios") {
      Linking.openURL(iosStoreURL); // Open iOS App Store
    } else if (Platform.OS === "android") {
      Linking.openURL(androidStoreURL); // Open Google Play Store
    }
  };

  return (
    <Provider store={store}>
      <MenuProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF" />


           <StorageProvider>
            <StackNavigators linking={linking} />
           </StorageProvider>
            <FlashMessage position={"top"} />
            <UpdateApp
              isUpdateAvailable={isUpdateAvailable}
              _onPressUpdate={onPressUpdate}
            />
          </SafeAreaView>
        </SafeAreaProvider>
      </MenuProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
