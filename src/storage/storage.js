import AsyncStorage from "@react-native-async-storage/async-storage";

export const StorageKeys = {
  CART_COUNT: "cartcount",
};

export const setStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.log("Storage set error:", e);
  }
};

export const getStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e) {
    console.log("Storage get error:", e);
    return null;
  }
};
