// import messaging from "@react-native-firebase/messaging";
// import PushNotification from "react-native-push-notification";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { NavigationService } from "./NavigationService";
// import { Alert, Linking, PermissionsAndroid, Platform } from "react-native";

// class NotificationService {
//   async init() {
//     try {
//       console.log("Initializing Notification Service...");
//       const hasShownAlert =
//         (await AsyncStorage.getItem("hasShownNotificationAlert")) === "true";

//       // Request permissions and determine if granted
//       const hasPermissions = await this.requestPermissions();

//       if (!hasPermissions && !hasShownAlert) {
//         console.log("Notification permissions not granted");
//         Alert.alert(
//           "Enable Notifications",
//           Platform.OS === "ios"
//             ? "Notifications are disabled. To receive updates, go to Settings > Notifications > Your App and enable Allow Notifications."
//             : "Notifications are disabled. To enable them:\n\n1. Open Settings\n2. Tap 'Notifications'\n3. Enable 'Allow Notifications'",
//           [
//             { text: "Cancel", style: "cancel" },
//             {
//               text: "Open Settings",
//               onPress: () => Linking.openSettings(),
//             },
//           ]
//         );

//         // Store that the alert has been shown
//         await AsyncStorage.setItem("hasShownNotificationAlert", "true");
//       }

//       if (Platform.OS === "android") await this.createNotificationChannel();
//       this.setupMessageHandlers();
//       console.log("Notification Service Initialized Successfully.");
//       return true;
//     } catch (error) {
//       console.error("Error initializing Notification Service:", error);
//       return false;
//     }
//   }

//   async requestPermissions() {
//     try {
//       console.log("Requesting notification permissions...");
//       if (Platform.OS === "ios") {
//         return await this.requestIosPermissions();
//       }
//       return await this.requestAndroidPermissions();
//     } catch (error) {
//       console.error("Error requesting notification permissions:", error);
//       return false;
//     }
//   }

//   async requestIosPermissions() {
//     const authStatus = await messaging().requestPermission({
//       alert: true,
//       badge: true,
//       sound: true,
//     });
//     const enabled = [
//       messaging.AuthorizationStatus.AUTHORIZED,
//       messaging.AuthorizationStatus.PROVISIONAL,
//     ].includes(authStatus);
//     console.log(
//       "iOS Notification Permissions:",
//       enabled ? "Granted" : "Denied"
//     );
//     return enabled;
//   }

//   async requestAndroidPermissions() {
//     if (Platform.Version >= 33) {
//       if (!PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS) {
//         console.log(
//           "POST_NOTIFICATIONS permission is not available on this RN version."
//         );
//         return false;
//       }
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//       );
//       if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("Android 13+ notification permission denied.");
//         return false;
//       }
//     }
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//     if (enabled) {
//       const token = await this.getFcmToken();
//       console.log(
//         "Android notification permissions granted, FCM Token obtained:",
//         token ? "Yes" : "No"
//       );
//     } else {
//       console.log("Android notification permissions denied.");
//     }

//     return enabled;
//   }

//   createNotificationChannel() {
//     return new Promise((resolve) => {
//       PushNotification.createChannel(
//         {
//           channelId: "default",
//           channelName: "Default",
//           channelDescription: "Default notifications channel",
//           importance: 4,
//           vibrate: true,
//           playSound: true,
//           soundName: "default",
//         },
//         (created) => resolve(created)
//       );
//     });
//   }

//   async getFcmToken() {
//     try {
//       let fcmToken = await AsyncStorage.getItem("fcmToken");
//       if (!fcmToken) {
//         fcmToken = await messaging().getToken();
//         if (fcmToken) await AsyncStorage.setItem("fcmToken", fcmToken);
//       }
//       console.log("FCM Token:", fcmToken || "Not Found");
//       return fcmToken;
//     } catch (error) {
//       console.error("Error retrieving FCM token:", error);
//       return null;
//     }
//   }

//   setupMessageHandlers() {
//     messaging().setBackgroundMessageHandler(this.handleRemoteMessage);
//     messaging().onMessage(this.handleRemoteMessage);
//     messaging().onNotificationOpenedApp(this.handleNotificationOpened);
//     messaging().getInitialNotification().then(this.handleInitialNotification);
//     messaging().onTokenRefresh(this.handleTokenRefresh);
//   }

//   async handleRemoteMessage(remoteMessage) {
//     if (!remoteMessage) return;
//     console.log("Received Remote Message:", remoteMessage);
//     NotificationService.displayNotification(remoteMessage);
//   }

//   handleNotificationOpened(remoteMessage) {
//     console.log("Notification opened:", remoteMessage);
//     if (remoteMessage?.data?.product_id) {
//       NavigationService.navigate("ProductDetail", {
//         proId: remoteMessage.data.product_id,
//       });
//     } else {
//       NavigationService.navigate("Home");
//     }
//   }

//   handleInitialNotification(remoteMessage) {
//     if (remoteMessage) {
//       console.log(
//         "App opened from quit state via notification:",
//         remoteMessage
//       );
//       NavigationService.navigate("Home");
//     }
//   }

//   async handleTokenRefresh(newToken) {
//     try {
//       await AsyncStorage.setItem("fcmToken", newToken);
//       console.log("FCM Token Refreshed:", newToken);
//     } catch (error) {
//       console.error("Error saving refreshed token:", error);
//     }
//   }

//   static displayNotification(remoteMessage) {
//     if (!remoteMessage?.notification && !remoteMessage?.data) return;
//     const { title, body } = remoteMessage.notification || {};
//     const data = remoteMessage.data || {};
//     PushNotification.localNotification({
//       channelId: "default",
//       title: title || "Notification",
//       message: body || "You have a new message",
//       playSound: true,
//       soundName: "default",
//       importance: "max",
//       vibrate: true,
//       userInfo: data,
//       priority: "max",
//       smallIcon: "ic_notification",
//     });
//   }
// }

// export default new NotificationService();
