import AsyncStorage from "@react-native-async-storage/async-storage";

export const processUpdateHeaders = async (headers) => {
  if (!headers) {
    console.warn("No headers provided to processUpdateHeaders");
    return;
  }

  try {
    const updateAvailable = headers.get("updateAvailable");
    const forceUpdate = headers.get("forceUpdate");
    const isOldFordeUpdatePopup = headers.get("useOldFordeUpdatePopup");

    const updates = [
      { key: "updateAvailable", value: updateAvailable },
      { key: "forceUpdate", value: forceUpdate },
      { key: "useOldFordeUpdatePopup", value: isOldFordeUpdatePopup },
    ];

    await Promise.all(
      updates.map(async ({ key, value }) => {
        if (value === "1") {
          await AsyncStorage.setItem(key, "true");
        }
      })
    );
  } catch (error) {
    console.error("Error processing update headers:", error);
    // Optionally rethrow if you want to handle it in the calling code
    // throw error;
  }
};
