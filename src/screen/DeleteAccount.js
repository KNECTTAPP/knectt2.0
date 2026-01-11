import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Platform,
} from "react-native";
import loginLogo from "../../assets/img/BrandLogo.png";
import { ButtonCustom } from "../component/ButtonCustom";
import Images from "../component/Images";
import { ProgressLoader } from "../component/ProgressLoader";
import colors from "../utils/colors";
import fonts from "../utils/fonts";
import endUrls from "../api/EndUrl";
import Header from "../component/Header";
import DeviceInfo from "react-native-device-info";

const DeleteAccount = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const reasons = [
    { id: 1, label: "Not happy with services" },
    { id: 2, label: "Non-relevant" },
    { id: 3, label: "Do not like to mention" },
  ];

  const submitDeletion = async () => {
    if (!selectedReason) {
      setErrorMessage("Please select a reason for deletion.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(endUrls.DELETE_ACCOUNT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify({
          delete_reason: selectedReason,
        }),
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

      const result = await response.json();

      setLoading(false);

      if (response.status == 200) {
        ToastAndroid.show("Account deleted successfully", ToastAndroid.SHORT);
        await AsyncStorage.removeItem("usertoken");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("updateAvailable");
    await AsyncStorage.removeItem("forceUpdate");
    await AsyncStorage.removeItem("useOldFordeUpdatePopup");
    await AsyncStorage.removeItem("affiliateCode");
    await AsyncStorage.removeItem("affiliateCreated");
    await AsyncStorage.removeItem("affiliateCredentials");
    await AsyncStorage.removeItem("affiliateCredentialsData");
    await AsyncStorage.clear();
        navigation.replace("Ulogin");
      } else {
        ToastAndroid.show(
          result.message || "Failed to delete account",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      setLoading(false);
      ToastAndroid.show(
        "An error occurred. Please try again.",
        ToastAndroid.SHORT
      );
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressLoader isVisible={loading} />
      <Header categoryTitle={"Delete Account"} backButtonwithtext />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Images
          source={loginLogo}
          imageStyle={{
            height: 200,
            width: 200,
          }}
        />
        <View style={{ justifyContent: "center" }}>
          <View>
            <Text style={styles.header}>Reason for Account Deletion</Text>
            {reasons.map((reason) => (
              <TouchableOpacity
                key={reason.id}
                style={styles.radioContainer}
                onPress={() => {
                  setSelectedReason(reason.label);
                  setErrorMessage("");
                }}
              >
                <View style={[styles.radioCircle]}>
                  <View
                    style={[
                      selectedReason === reason.label && styles.radioSelected,
                    ]}
                  ></View>
                </View>

                <Text style={styles.radioText}>{reason.label}</Text>
              </TouchableOpacity>
            ))}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
          </View>
          <View style={styles.buttonView}>
            <ButtonCustom
              containerStyle={{ width: "100%" }}
              title={"Submit"}
              onPress={submitDeletion}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    fontSize: 18,
    fontFamily: fonts.whitneySemiBold,
    marginVertical: 20,
    textAlign: "center",
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  radioCircle: {
    height: 25,
    width: 25,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#ddd",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    backgroundColor: colors.primaryColor,
    width: 18,
    height: 18,
    borderRadius: 20,
    alignSelf: "center",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
    fontFamily: fonts.whitneyMedium,
  },
  buttonView: {
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default DeleteAccount;
