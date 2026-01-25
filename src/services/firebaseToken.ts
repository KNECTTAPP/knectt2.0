import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getApp } from "@react-native-firebase/app";
import messaging,{
  getMessaging,
  getToken,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";

/**
 * 🔐 Request notification permission (iOS only)
 */
export async function requestIOSPermissionAndRegister() {
  if (Platform.OS !== 'ios') return true;

  const authStatus = await getMessaging().requestPermission();

  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('❌ iOS notification permission denied');
    return false;
  }

  // 🔥 THIS IS THE MISSING STEP
  await getMessaging().registerDeviceForRemoteMessages();

  console.log('✅ iOS device registered for remote messages');
  return true;
}


import { PermissionsAndroid } from 'react-native';

export async function requestNotificationPermissionAndroid() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'App needs notification permission',
        buttonPositive: 'Allow',
      },
    );

    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // Android < 13
}

export async function requestIOSPermission() {
  const authStatus = await messaging().requestPermission();

  return (
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL
  );
}


/**
 * 🔥 Get FCM token (Android + iOS)
 */
export const getFirebaseToken = async (): Promise<string | null> => {
  try {
    // 1️⃣ Permission
    const permissionGranted = await requestIOSPermissionAndRegister();
    if (!permissionGranted) {
      console.log("🚫 Notification permission denied");
      return null;
    }

    // 2️⃣ Firebase Messaging
    const app = getApp();
    const messaging = getMessaging(app);

    // 3️⃣ Get token
    const token = await getToken(messaging);
    console.log("🔥 FCM TOKEN:", token);

    // 4️⃣ Save locally
    if (token) {
      await AsyncStorage.setItem("fcmToken", token);
    }

    return token;
  } catch (error) {
    console.log("❌ FCM TOKEN ERROR:", error);
    return null;
  }
};
