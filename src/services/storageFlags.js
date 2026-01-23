import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleUpdateFlags = async (response) => {
  const updateAvailable = response.headers.get("updateAvailable");
  const forceUpdate = response.headers.get("forceUpdate");
  const isOldFordeUpdatePopup = response.headers.get(
    "useOldFordeUpdatePopup"
  );

  if (updateAvailable == 1) {
    await AsyncStorage.setItem("updateAvailable", "true");
  }

  if (forceUpdate == 1) {
    await AsyncStorage.setItem("forceUpdate", "true");
  }

  if (isOldFordeUpdatePopup == 1) {
    await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
  }
};
