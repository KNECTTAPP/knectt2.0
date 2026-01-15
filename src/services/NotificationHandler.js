import messaging from "@react-native-firebase/messaging";
import notifee, { EventType } from "@notifee/react-native";
import { NavigationService } from "./NavigationService";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const setupNotificationListeners = (dispatch = null) => {
  // Handle notification when app is in background
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log("Notification opened from background", remoteMessage);
    handleNotificationNavigation(remoteMessage);
  });

  // Handle notification when app is opened from killed state
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log("Notification opened from killed state", remoteMessage);
        handleNotificationNavigation(remoteMessage);
      }
    });

  // Handle foreground notifications (only call displayNotification if necessary)
  messaging().onMessage(async (remoteMessage) => {
    console.log("Remote message in foreground", remoteMessage);
    if (remoteMessage?.notification) {
      displayNotification(remoteMessage?.notification, remoteMessage?.data);
    }
  });

  // Handle notification click event in the foreground
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail?.notification) {
      handleNotificationNavigation(detail?.notification);
    }
  });

  // Handle background event
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail?.notification) {
      console.log("background handler notifee")
      handleNotificationNavigation(detail?.notification);
    }
  });
};

const handleNotificationNavigation =async (notification) => {
  console.log("Handle Notification function", notification?.data);
  let routeName;
  const checkTokenAndHandleNavigation = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        return "drawer";
      } else {
        return "login";
      }
    } catch (error) {
      console.error("Error checking token", error);
      return "login";
    }
  };
  routeName =await checkTokenAndHandleNavigation();
  // Parse the notification data if available
  let notificationData = notification?.data || {};
//   if (notification?.data) {
//     try {
//       // Try parsing the data field only if it's valid
//       notificationData = JSON.parse(notification.data);
//     } catch (error) {
//       console.error("JSON Parse error:", error);
//     }
//   }

  const type = notificationData?.screen_name;
  const productId = notificationData?.product_id;

  switch (type) {
    case "product":
      NavigationService.navigate("ProductDetail", {
        proId: productId,
      });
      break;
    case "review":
      NavigationService.navigate("Reviews");
      break;
    case "affiliate":
      NavigationService.navigate("Affiliate");
      break;
    default:
      NavigationService.navigate(routeName);
      break;
  }
};

const displayNotification = async (notification, data) => {
  // To prevent multiple notifications from being shown
  if (notification && !notification.isDisplayed) {
    // Set `isDisplayed` flag to true to prevent duplicate notifications
    notification.isDisplayed = true;

    await notifee.displayNotification({
      title: notification?.title,
      body: notification?.body,
      ios: {
        sound: "default",
      },
      android: {
        channelId: "default",
        pressAction: {
          id: "default",
        },
        sound: "default",
      },
      data,
    });
  }
};
