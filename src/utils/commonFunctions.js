import axios from "axios";
import { configs } from "./configs";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { upiRegex } from "../static/constant";

export const helperGetLatLongFromAddress = async (address) => {
  try {
    const params = {
      key: configs.GOOGLE_PLACES_KEY,
      fields: "geometry",
      language: "en",
      address,
    };
    //   const response = await fetch(url);
    const result = await axios.get(configs.REVERSE_GEOCODING_URL, {
      params,
    });

    console.log("add==>", params, result);
  } catch (error) {}
};

export const convertIntoDDMMYYYY = async (str) => {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth, day].join("-");
};

export const convertIntoDateFormat = async (str, isYYYMMDD) => {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);

  return isYYYMMDD
    ? [date.getFullYear(), mnth, day].join("-")
    : [day, mnth, date.getFullYear()].join("-");
};

export const sendMail = (subject, body) => {
  const mailStr = `mailto:${configs.SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  Linking.openURL(mailStr);
};

export const handleDecimalOfferings = (value = "") => {
  if (value === "Free") {
    return value;
  }

  // Remove commas and trim whitespace
  const cleanedValue = value.replace(/,/g, "").trim();

  // Convert to number
  const num = Number(cleanedValue);

  // If it's not a valid number, return the original value or handle gracefully
  if (isNaN(num)) {
    return value;
  }

  return num.toFixed(2);
};

export const handleDecimal = (value = "") => {
  if (value === "Free") {
    return value;
  }
  let temp = Number(value);
  return temp.toFixed(2);
};

export const removeHtmlTags = (text) => {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace("\n", " ");
};
export const validateIFSC = (ifscCode) => {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/; // Regex for valid IFSC code
  return regex.test(ifscCode);
};

export const getAsyncValue = async (keyName) => {
  try {
    const value = await AsyncStorage.getItem(keyName);
    if (value !== null) {
      console.log("Retrieved affiliate link:", value);
      return value;
    } else {
      console.log("No affiliate link found.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving affiliate link:", error);
    return null;
  }
};

export const isValidUpiFormat = (upi) => {
  return upiRegex.test(upi.trim());
};