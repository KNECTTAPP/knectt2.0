import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import endPoints from "./utils/endPoints";
import endUrls from "./api/EndUrl";
import { showMessage } from "react-native-flash-message";
import { Image, Platform } from "react-native";
import thumsImg from "../assets/img/thumbs.png";
import DeviceInfo from "react-native-device-info";

const commonHeader = {
  method: "get",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
const getDataFromApi = async function (endUrl, payload, method = "get") {
  let usertoken = await AsyncStorage.getItem("usertoken");
  let header = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      //token: JSON.parse(usertoken),
      key: "RDEotoX0QlOmER8WFcDKmTw5YK99IVZd",
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };

  // For GET requests, append payload as query parameters
  if (method.toLowerCase() === "get" && payload) {
    const query = new URLSearchParams(payload).toString();
    endUrl += `?${query}`;
  }

  console.log("red-->0", payload);

  try {
    const response = await fetch(
      endUrl,
      method.toLowerCase() === "post"
        ? { ...header, body: JSON.stringify(payload) }
        : header
    );
    console.log("red-->", payload, response);
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === 1) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === 1) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === 1) {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    const json = await response.json();
    console.log("api->", json);
    return json;
  } catch (error) {
    console.log("apiError->", error);
  }
};

const getDataFromApi2 = async function (endUrl, payload, method = "get") {
  let usertoken = await AsyncStorage.getItem("usertoken");
  let header = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: JSON.parse(usertoken),
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };

  // For GET requests, append payload as query parameters
  if (method.toLowerCase() === "get" && payload) {
    const query = new URLSearchParams(payload).toString();
    if (typeof payload === "string") {
      endUrl += `/${payload}`;
    } else {
      endUrl += `?${query}`;
    }
  }

  try {
    const response = await fetch(
      endUrl,
      method.toLowerCase() === "post"
        ? { ...header, params: JSON.stringify(payload) }
        : header
    );
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === 1) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === 1) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === 1) {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    const json = await response.json();
    console.log("api->1", json);
    return json;
  } catch (error) {
    console.log("apiError->", error);
  }
};

export const fetchAvailableSlots = async (payload) => {
  // const res = await getDataFromApi(endPoints.APP_URL_GET_TIME_SLOT, payload);
  const res = await getDataFromApi2(endUrls.API_NAME_GET_TIME_SLOT, payload);
  return res?.results;
};

export const fetchSearchList = async (payload) => {
  // const res = await getDataFromApi2(endUrls.API_NAME_GET_SEARCH_LIST, payload);
  const res = await getDataFromApi3(endUrls.API_NAME_GET_SEARCH_LIST, payload);
  return res?.data;
};

export const fetchPaymentStatus = async (payload) => {
  const res = await getDataFromApi2(endUrls.PAYMENT_STATUS, payload);
  return res;
};

export const addBloodTestToCart = async (payload) => {
  let usertoken = await AsyncStorage.getItem("usertoken");
  let header = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      token: JSON.parse(usertoken),
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };
  console.log("dddd-->", payload);
  const body = new FormData();
  for (const key in payload) {
    body.append(key, payload[key]);
  }
  console.log("dddd-->1", body);
  try {
    const response = await fetch(endUrls.API_NAME_ADD_BLOOD_TEST_TO_CART, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        token: JSON.parse(usertoken),
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      },
      body,
    });
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === 1) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === 1) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === 1) {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    console.log("red0-->", payload, response);
    const json = await response.json();
    console.log("api0->", json);
    showMessage({
      message: "Item added successfully in cart list.",
      duration: 2000,
      position: "center",
      icon: (props) => <Image source={thumsImg} {...props} />,
      type: "success",
    });
    return json;
  } catch (error) {
    console.log("apiError->", error);
  }
};


const getDataFromApi3 = async function (endUrl, payload, method = "get") {
  let usertoken = await AsyncStorage.getItem("usertoken");
  let header = {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      token: JSON.parse(usertoken),
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };

  // For GET requests, append payload as query parameters
  if (method.toLowerCase() === "get" && payload) {
    // const query = new URLSearchParams(payload).toString();
    // console.log(query,'its query')
    // if (typeof payload === "string") {
    //   endUrl += `/${payload}`;
    // } else {
    //   endUrl += `?${query}`;
    // }
    endUrl+=`/${payload?.text}?product_character=${payload?.product_character}`
  }
console.log(endUrl,'this is endreu')
//   return
  try {
    const response = await fetch(
      endUrl,
      method.toLowerCase() === "post"
        ? { ...header, params: JSON.stringify(payload) }
        : header
    );
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    const isOldFordeUpdatePopup = response.headers.get(
      "useOldFordeUpdatePopup"
    );
    if (updateAvailable === 1) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate === 1) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    if (isOldFordeUpdatePopup === 1) {
      await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
    }
    const json = await response.json();
    console.log("api->1", json);
    return json;
  } catch (error) {
    console.log("apiError->", error);
  }
};