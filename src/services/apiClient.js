import AsyncStorage from "@react-native-async-storage/async-storage";
import DeviceInfo from "react-native-device-info";
import { Platform } from "react-native";
import { handleUpdateFlags } from "./storageFlags";

export const apiClient = async (
  url,
  { method = "GET", body = null, headers = {} } = {}
) => {
  const usertoken = await AsyncStorage.getItem("usertoken");

  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    token: usertoken ? JSON.parse(usertoken) : "",
    Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
    Platform: Platform.OS,
  };

  const response = await fetch(url, {
    method,
    headers: { ...defaultHeaders, ...headers },
    body: body ? JSON.stringify(body) : null,
  });

  // 🔥 common update/force logic
  await handleUpdateFlags(response);

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Something went wrong");
  }

  return json;
};
