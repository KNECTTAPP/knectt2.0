import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Platform,
  
  StyleSheet,
  Text,
  View,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import RNRestart from "react-native-restart";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom";
import Header from "../component/Header";
import { LOCAL_STORE_KEY } from "../utils/storeKeys";
import Toast from "react-native-simple-toast";
// import messaging from "@react-native-firebase/messaging";
import Images from "../component/Images";
import loginLogo from "../../assets/img/BrandLogo.png";
import { ProgressLoader } from "../component/ProgressLoader";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OtpScreen = ({ route, navigation }) => {
  const otpInputRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const lengthInput = 6;
  const [internalVal, setInternalVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [counter, setCounter] = useState(45);
  const [profile_complete, setprofile_complete] = useState("");
  //var otpValidation = route.params.otp
  const phoneNumber = route.params.phone;
  const affiliateCode = route.params.affiliateCode;
  // var referenceCode = route.params.referenceCode
  const [otpValidation, setOtpValidation] = useState(route.params.otp);
  const [referenceCode, setReferenceCode] = useState(
    route.params.referenceCode
  );
  const [timer, setTimer] = useState(20);
  const [timerCount, setTimerCount] = useState(false);
  const [deviceid, setDeviceid] = useState();

  const [deviceInfo, setDeviceInfo] = useState({});
  const [showModal, setShowModal] = useState(false);

  const getDeviceInfo = async () => {
    const deviceId = await DeviceInfo.getUniqueId(); // Unique Device ID
    const deviceName = await DeviceInfo.getDeviceName(); // Device Name
    const platform = Platform.OS; // Device Platform
    const deviceInfo = {
      platform: platform, //android OR ios
      device_id: deviceId, //Device ID
      name: deviceName, // Device Name
    };
    return deviceInfo;
  };
  useEffect(() => {
    return () => {
      setTimerCount(false);
    };
  }, []);

  useEffect(() => {
    DeviceInfo.getAndroidId().then((androidId) => {
      setDeviceid(androidId);
    });
  }, []);

  useEffect(() => {
    if (hiddenInputRef?.current) {
      hiddenInputRef.current.focus();
    }

    // After a short delay, switch focus to OTPInputView
    const timer = setTimeout(() => {
      if (otpInputRef?.current) {
        otpInputRef.current.focusField(1);
      }
      console.log("INSIDE HERE");
    }, 200);
    const timerFirst = setTimeout(() => {
      if (otpInputRef?.current) {
        otpInputRef.current.focusField(0);
      }
      console.log("INSIDE HERE");
    }, 400);

    return () => {
      clearTimeout(timer);
      clearTimeout(timerFirst);
    };
  }, [hiddenInputRef]);

  const resetTimer = function () {
    // Keyboard.dismiss();
    // setInternalVal("");
    setTimer(20); // Reset timer to 20 seconds
    setTimerCount(true);

    // Start a countdown
    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(countdown);
          setTimerCount(false);
          return 0;
        }
      });
    }, 1000);

    // resendOtp();
  };

  // const resendOtp = async () => {
  //   try {
  //     const response = await fetch(
  //       EndUrl.login + "/" + phoneNumber + "/" + deviceid
  //     );
  //     const updateAvailable = response.headers.get("updateAvailable");
  //     const forceUpdate = response.headers.get("forceUpdate");
  //     const isOldFordeUpdatePopup = response.headers.get(
  //       "useOldFordeUpdatePopup"
  //     );
  //     if (updateAvailable === 1) {
  //       await AsyncStorage.setItem("updateAvailable", "true");
  //     }
  //     if (forceUpdate === 1) {
  //       await AsyncStorage.setItem("forceUpdate", "true");
  //     }
  //     if (isOldFordeUpdatePopup === 1) {
  //       await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
  //     }
  //     const json = await response.json();
  //     if (response.status == 200) {
  //       setOtpValidation(json.data[0].otp);
  //       setReferenceCode(json.data[0].reference_code);
  //     }
  //   } catch (error) {}
  // };

  const OtpValidation = async (otpNumber) => {
    if (otpValidation == otpNumber) {
      setLoading(true);
      var body = new FormData();
      body.append("email", phoneNumber);
      body.append("device_id", deviceid ? deviceid : "1234567890");
      body.append("otp", otpNumber);

      body.append("affiliate_code", affiliateCode);
      console.log(body, "itsnodyehenotpverify");
      try {
        const response = await fetch(EndUrl.otp, {
          method: "POST",
          headers: {
            // Accept: "application/json",
            // "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
            "X-SECURE-KEY": "Jsh8sDk28nLmPqRsWvXyZt1234567890@knectt",
            // Platform: Platform.OS,
          },
          body: body,
        });
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        setLoading(false);
        console.log("response-->", JSON.stringify(response));

        if (json.status == 200) {
          Keyboard.dismiss();
          setInternalVal("");
          console.log("dataLo-->", JSON.stringify(json));
          setLoading(false);
          await AsyncStorage.setItem(
            "usertoken",
            JSON.stringify(json.data[0].token)
          );
          await AsyncStorage.setItem(
            "referenceCode",
            JSON.stringify(referenceCode)
          );
          await AsyncStorage.setItem(
            LOCAL_STORE_KEY.PHONE_NUMBER,
            JSON.stringify(phoneNumber)
          );
          setprofile_complete(json?.data[0]?.profile_complete);
          setShowModal(true);
          await AsyncStorage.setItem("userData", JSON.stringify(json.data));
          global.userdata = json?.data[0];
          sendDeviceInfo(json?.data[0].token);
        } else {
          setLoading(false);
          Toast.show(json.message, Toast.SHORT);
        }
      } catch (error) {
        setLoading(false);

        //console.log(error);
        //console.log(EndUrl.otp+phoneNumber+'/'+otpNumber);
      }
    } else if (otpValidation != otpNumber) {
      Toast.show("Please enter valid otp", Toast.SHORT);
    } else {
      //console.log("error")
    }
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setTimeout(() => {
      if (profile_complete === true || profile_complete === "true") {
        navigation.replace("TabNavigators", {
          screen: "ChatScreen",
          params: {
            loading: loading,
          },
        });
        // navigation.replace("PreHomeKnecttGuide")
      } else {
        navigation.navigate("Fewbasicinfo", {
          email: phoneNumber,
        });
      }
    }, 100);

    // Optionally navigate to another screen
  };

  const sendDeviceInfo = async (userToken) => {
    try {
      const info = await getDeviceInfo();
      const deviceToken = await AsyncStorage.getItem("fcmToken");
      console.log("Raw deviceToken from storage:", deviceToken); // Added for debugging

      if (!deviceToken) {
        console.log("No FCM token found, requesting new token...");
        // Try to get a new token directly
        //const newToken = await messaging().getToken();
        // if (newToken) {
        //   await AsyncStorage.setItem("fcmToken", newToken);
        //   console.log("New token generated:", newToken);
        //   info.token = newToken;
        // } else {
        //   console.warn("Could not generate new FCM token");
        // }
      } else {
        info.token = deviceToken; // Use token directly without parsing
      }

      const body = {
        device_id: info.device_id,
        name: info.name,
        platform: info.platform,
        token: info.token,
      };

      console.log("Sending device info:", body);

      const headers = {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: userToken,
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      };

      const response = await fetch(EndUrl.DEVICE_ATTACH, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      });
      const updateAvailable = response.headers.get("updateAvailable");
      const forceUpdate = response.headers.get("forceUpdate");
      const isOldFordeUpdatePopup = response.headers.get(
        "useOldFordeUpdatePopup"
      );
      if (updateAvailable === "1") {
        await AsyncStorage.setItem("updateAvailable", "true");
      }
      if (forceUpdate === "1") {
        await AsyncStorage.setItem("forceUpdate", "true");
      }
      if (isOldFordeUpdatePopup === "1") {
        await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      }

      const responseData = await response.json();
      console.log("Device info response:", JSON.stringify(responseData));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error in sendDeviceInfo:", error);
    }
    // navigation.replace("TabNavigators", {
    //   screen: "Home",
    //   params: {
    //     loading: loading,
    //   },
    // });
  };
  const resendOtp = async () => {
    setLoading(true);

    Keyboard.dismiss();
    setInternalVal("");

    try {
      var body = new FormData();
      // body.append("mobile", phoneNumber);
      // body.append("device_id", deviceid);
      body.append("email", phoneNumber);
      body.append("device_id", deviceid ? deviceid : "1234567890");
      body.append("affiliate_code", affiliateCode);
      // console.log(body,'its nody')
      // return
      const response = await fetch(EndUrl.login, {
        method: "POST",
        headers: {
          // Accept: "application/json",
          // "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
          "X-SECURE-KEY": "Jsh8sDk28nLmPqRsWvXyZt1234567890@knectt",
          // Platform: Platform.OS,
        },
        body: body,
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
      const json = await response.json();
      console.log(JSON.stringify(json), "resend");
      if (json.status == 200) {
        setLoading(false);
        resetTimer();
        setOtpValidation(json.data[0].otp);
        setReferenceCode(json.data[0].reference_code);
        Toast.show(json.message, Toast.SHORT);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const moveToHome = async () => {
    AsyncStorage.removeItem("usertoken").then(() => {
      navigation.replace("TabNavigators", {
        screen: "Home",
      });
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading && <ProgressLoader isVisible={loading} />}

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        // onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/845/845646.png",
              }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>Congratulations!</Text>
            <Text style={styles.message}>
              Your account has been created successfully.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleCloseModal}>
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <Images
          source={loginLogo}
          imageStyle={{
            height: 200,
            width: 200,
            marginTop: "10%",
            // marginBottom: "50%",
          }}
        />
        <View style={{ paddingHorizontal: 14, marginTop: "2%" }}>
          <Text
            style={{
              fontSize: 17,
              color: "#000",
              bottom: 10,
              // marginLeft: 14,
              fontFamily: "Verdana",
            }}
          >
            Register/Login
          </Text>
          {/* <Header categoryTitle={""} itemText={""} poneverification /> */}
        </View>
        <View style={{ justifyContent: "center" }}>
          {/* <View
            style={{
              width: "100%",
            }}
          > */}
          {/* <Text style={{ fontSize: 25, color: "#999999" }}>Enter OTP</Text> */}
          <Text
            style={{ fontSize: 15, color: "#999999", paddingHorizontal: 15 }}
          >
            An OTP has been sent to your email :- {route.params.phone}
          </Text>
          {/* <Text style={{ fontSize: 15, top: 10, color: "#999999" }}>
              {route.params.phone}
            </Text> */}
          {/* <Text style={{ fontSize: 15, top: 10, color: "#999999" }}>
              Please check your message box
            </Text> */}
          {/* </View> */}
          <View
            style={{
              marginTop: 30,
              // height: 100,
              justifyContent: "flex-end",
              // elevation: 10,
              // margin: 10,
              paddingHorizontal: 14,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.34,
              shadowRadius: 6.27,
            }}
          >
            {/* <TextInput
              ref={(input) => (textInput = input)}
              style={{ height: 0, width: 0 }}
              value={internalVal}
              onChangeText={(text) => focusValue(text)}
              maxLength={lengthInput}
              keyboardType="numeric"
              returnKeyType="done"
            />
            <OtpAutoFillViewManager
              fontSize={2}
              onComplete={handleComplete}
              onAndroidSignature={handleOnAndroidSignature}
              TextStyle={styles.box}
              length={6} // Define the length of OTP code. This is a must.
            /> */}
            <View style={styles.inputContainer} pointerEvents="box-none">
              <OTPInputView
                ref={otpInputRef}
                style={{ height: 50 }}
                pinCount={6}
                code={internalVal}
                onCodeChanged={(code) => {
                  setInternalVal(code);
                  if (code.length === 6) {
                    Keyboard.dismiss(); // closes the keyboard when 6 digits are typed
                  }
                }}
                autoFocusOnLoad
                // onCodeChanged={(code) => {
                //   setInternalVal(code);
                // }}
                editable={true}
                codeInputFieldStyle={styles.cellView}
                codeInputHighlightStyle={styles.cellView}
                onCodeFilled={(code) => {
                  setInternalVal(code);
                }}
                keyboardType="number-pad"
              />
            </View>
          </View>
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }}>
            {/* <Text onPress={() => resetTimer()} style={{ fontSize: 14, color: '#f79489', alignSelf: 'flex-end', right: 10 }}>Resend OTP</Text> */}
            {/* <Button color="#F79489" onPress={() => OtpValidation(internalVal)} title={"Submit"} /> */}
            <ButtonCustom
              containerStyle={{
                width: "100%",
                backgroundColor: "#F79489",
                borderRadius: 8,
                // paddingVertical: 10,
                height: 48,
              }}
              titleStyle={{ fontSize: 17, color: "#fff" }}
              title={"SUBMIT"}
              onPress={() => OtpValidation(internalVal)}
              // title={"Submit"}
            />
            <View
              style={{ marginLeft: 15, marginRight: 15, marginTop: 10 }}
            ></View>
            {timerCount && timer != 0 ? (
              <Text
                style={{
                  fontSize: 14,
                  color: "#f79489",
                  alignSelf: "center",
                  right: 10,
                  marginTop: 30,
                }}
              >
                {" "}
                Resend OTP in{" "}
                <Text style={{ color: "black" }}>
                  0:{String(timer).length < 2 ? "0" + timer : timer}
                </Text>
              </Text>
            ) : (
              <Text
                onPress={() => resendOtp()}
                style={{
                  fontSize: 14,
                  color: "#f79489",
                  alignSelf: "center",
                  right: 10,
                }}
              >
                Resend OTP
              </Text>
            )}
          </View>
          <View style={{ marginLeft: 15, marginRight: 15, marginTop: 20 }}>
            <ButtonCustom
              containerStyle={{
                width: "100%",
                backgroundColor: "#CDCED0",
                borderRadius: 8,
                // paddingVertical: 10,
                height: 48,
              }}
              titleStyle={{
                fontSize: 18,
                color: "#fff",
                textTransform: "none",
              }}
              title={"Guest Login"}
              onPress={() => {
                moveToHome();
                // triggerCrash();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  subContainer: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cellView: {
    paddingVertical: 11,
    width: 50,
    height: 50,
    margin: 5,
    color: "#000",
    justifyContent: "center",
    backgroundColor: "white",
    opacity: 1,
    elevation: 4,
  },
  box: {
    display: "none",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    elevation: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: "#555",
  },
  button: {
    backgroundColor: "#F79489",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
export default OtpScreen;
