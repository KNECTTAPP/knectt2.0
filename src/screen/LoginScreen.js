import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-simple-toast";
import loginLogo from "../../assets/img/BrandLogo.png";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom";
import Images from "../component/Images";
import { ProgressLoader } from "../component/ProgressLoader";
import { useStore } from "../state";
import { getAsyncValue } from "../utils/commonFunctions";
import { getFirebaseToken, requestNotificationPermissionAndroid } from "../services/firebaseToken";
const STYLES = ["default", "dark-content", "light-content"];
const TRANSITIONS = ["fade", "slide", "none"];
const LoginScreen = ({ }) => {
  const navigation = useNavigation();

  const [phoneNumber, setphoneNumber] = useState("");
  const phoneInput = useRef(null);
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceid] = useState();
  const [affiliateCode, setAffliateCode] = useState("");
  let isFocused = useIsFocused();
  const [email, setEmail] = useState("");
  const rawData = useStore((s) => s.appsFlyerData);
  const appsFlyerData = JSON.parse(rawData);
  console.log(appsFlyerData, "thisIsApsFlyerData");

  DeviceInfo.getAndroidId().then((androidId) => {
    console.log("androidId", androidId);
    setDeviceid(androidId);
  });
  const appState = useRef(AppState.currentState);

  const getProfileData = async (usertoken) => {
    // let usertoken = await AsyncStorage.getItem("usertoken");
    // console.error(usertoken);
    const settingsGet = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: JSON.parse(usertoken),
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      },
    };
    const response = await fetch(EndUrl.getprofile, settingsGet);
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
    console.log(json, 'bingo lal')
    if (json.status == 400) {
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
      return false
    }
    else {
      return true
    }
  };

  const getstodataStorege = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (usertoken) {
      const isValidProfile = await getProfileData(usertoken);

      if (isValidProfile) {
        // Token/profile valid → navigate to ChatScreen inside TabNavigators
        navigation.replace("TabNavigators", {
          screen: "ChatScreen",
        });
      }
      // navigation.replace("PreHomeKnecttGuide")
    }
  };

  const onLoginButton = () => {
    if (phoneNumber >= 10) {
      navigation.navigate("otp", { phone: phoneNumber, otp: 123456 });
    } else {
      console.log("error");
    }
  };


  let option = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
    body: JSON.stringify({ mobile: phoneNumber }),
  };
  const sum = () => {
    var i = 0;
    var sum = 0;
    while (i < 100) {
      sum = sum + i;
      sum = i + sum;
      i++;
    }
    console.log("sum===", sum);
  };
  useEffect(() => {
    getstodataStorege();
    sum();
    // setupNotificationListeners();
  }, []);

  const triggerCrash = () => {

  };

  const getAffliateLinkUrl = async () => {
    const affliateLink = await getAsyncValue("affliateLink");
    console.log(affliateLink, "thisislink");
    const affliateDataStr = await getAsyncValue("appFlyaerRes1");
    let affliateData = affliateDataStr ? JSON.parse(affliateDataStr) : null;
    console.log("Affiliate Link:", affliateLink);
    console.log("Affiliate Data:", affliateData);
    console.log(
      "Affiliate Code:",
      affliateData?.affiliateCode || affliateData?.affiliate_code
    );
    setAffliateCode(
      (affliateData?.affiliate_code || affliateData?.affiliateCode) ?? ""
    );
  };

  

useEffect(() => {
  const init = async () => {
    const hasPermission = await requestNotificationPermissionAndroid();

    if (!hasPermission) {
      console.log('❌ Notification permission denied');
      return;
    }

    const token = await getFirebaseToken();
    console.log('✅ FINAL TOKEN:', token);

    if (token) {
      await AsyncStorage.setItem('fcmToken', token);
    }
  };

  init();
}, []);


  useEffect(() => {
    // if (isFocused) {
    //   setTimeout(() => {
    //     getAffliateLinkUrl();
    //   }, 1000);
    // }
    setAffliateCode((appsFlyerData?.ac || appsFlyerData?.aff_code) ?? "");
  }, [appsFlyerData]);

  // const mobileOtpValidation = async (phoneNumber) => {
  //   if (phoneNumber.length < 13) {
  //     setLoading(false);
  //     Toast.show("Please enter valid phone number", Toast.SHORT);
  //   } else {
  //     try {
  //       setLoading(true);
  //       console.log(EndUrl.login + "/" + phoneNumber + "/" + deviceid);
  //       console.log("deviceid,", deviceid);
  //       // setLoading(true)
  //       const response = await fetch(
  //         EndUrl.login + "/" + phoneNumber + "/" + deviceid
  //       );

  //       const updateAvailable = response.headers.get("updateAvailable");
  //       const forceUpdate = response.headers.get("forceUpdate");
  //       const isOldFordeUpdatePopup = response.headers.get(
  //         "useOldFordeUpdatePopup"
  //       );
  //       if (updateAvailable === "1") {
  //         await AsyncStorage.setItem("updateAvailable", "true");
  //       }
  //       if (forceUpdate === "1") {
  //         await AsyncStorage.setItem("forceUpdate", "true");
  //       }
  //       if (isOldFordeUpdatePopup === "1") {
  //         await AsyncStorage.setItem("isOldFordeUpdatePopup", "true");
  //       }

  //       // setLoading(false)
  //       const json = await response.json();
  //       console.log(json, 'its response')
  //       if (response.status == 200 && phoneNumber.length == 13) {
  //         setLoading(false);
  //         navigation.navigate("otp", {
  //           phone: phoneNumber,
  //           otp: json.data[0].otp,
  //           referenceCode: json.data[0].reference_code,
  //         });
  //       } else if (phoneNumber.length < 13) {
  //         setLoading(false);
  //         Toast.show("Please enter valid phone number", Toast.SHORT);
  //       }
  //     } catch (error) {
  //       setLoading(false);
  //       console.error(error);
  //     }
  //   }
  // };

  //new method with post
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const emailValidation = async (phoneNumber) => {
    // if (phoneNumber.length < 13) {
    //   setLoading(false);
    //   Toast.show("Please enter valid phone number", Toast.SHORT);
    // }
    if (!email) {
      setLoading(false);
      Toast.show("Please enter your email", Toast.SHORT);
    } else if (!validateEmail(email)) {
      setLoading(false);
      Toast.show("Please enter a valid email", Toast.SHORT);
    } else {
      try {
        setLoading(true);
        var body = new FormData();
        body.append("email", email);
        body.append("device_id", deviceid ? deviceid : "1234567890");
        body.append(
          "affiliate_code",
          appsFlyerData?.ac || appsFlyerData?.aff_code || affiliateCode
        );
        console.log(body, "bodywhenloginnody");
        const response = await fetch(
          // "https://www.knectt.com/api/v2/mobile/check",
          EndUrl.login,
          {
            method: "POST",
            headers: {
              // Accept: "application/json",
              // "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
              "X-SECURE-KEY": "Jsh8sDk28nLmPqRsWvXyZt1234567890@knectt",
              // Platform: Platform.OS,
            },
            body: body,
          }
        );
        console.log(JSON.stringify(response), "its data hhhh");
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
          await AsyncStorage.setItem("isOldFordeUpdatePopup", "true");
        }
        // setLoading(false)
        const json = await response.json();
        console.log(json, "its data hhhhjjj");
        console.log(json.message, "json.message");

        if (response.status == 200) {
          setLoading(false);
          Toast.show(json.message, Toast.SHORT);

          navigation.navigate("otp", {
            phone: email,
            otp: json.data[0].otp,
            referenceCode: json.data[0].reference_code,
            affiliateCode: (appsFlyerData?.ac || appsFlyerData?.aff_code) ?? "",
          });
          setLoading(false);
        } else {
          setLoading(false);
          Toast.show(json.message, Toast.SHORT);
        }
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
      // try {
      //   setLoading(true);
      //   var body = new FormData();
      //   body.append("mobile", phoneNumber);
      //   body.append("device_id", deviceid);
      //   body.append("affiliate_code", affiliateCode);
      //   console.log(body, "its nody");
      //   const response = await fetch(
      //     // "https://www.knectt.com/api/v2/mobile/check",
      //     EndUrl.login,
      //     {
      //       method: "POST",
      //       headers: {
      //         // Accept: "application/json",
      //         // "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
      //         "X-SECURE-KEY": "Jsh8sDk28nLmPqRsWvXyZt1234567890@knectt",
      //         // Platform: Platform.OS,
      //       },
      //       body: body,
      //     }
      //   );
      //   // console.log(response, "its data hhhh");
      //   const updateAvailable = response.headers.get("updateAvailable");
      //   const forceUpdate = response.headers.get("forceUpdate");
      //   const isOldFordeUpdatePopup = response.headers.get(
      //     "useOldFordeUpdatePopup"
      //   );
      //   if (updateAvailable === "1") {
      //     await AsyncStorage.setItem("updateAvailable", "true");
      //   }
      //   if (forceUpdate === "1") {
      //     await AsyncStorage.setItem("forceUpdate", "true");
      //   }
      //   if (isOldFordeUpdatePopup === "1") {
      //     await AsyncStorage.setItem("isOldFordeUpdatePopup", "true");
      //   }
      //   // setLoading(false)
      //   const json = await response.json();
      //   console.log(json, "its data hhhhjjj");
      //   if (response.status == 200 && phoneNumber.length == 13) {
      //     setLoading(false);
      //     navigation.navigate("otp", {
      //       phone: phoneNumber,
      //       otp: json.data[0].otp,
      //       referenceCode: json.data[0].reference_code,
      //       affiliateCode: affiliateCode,
      //     });
      //   } else if (phoneNumber.length < 13) {
      //     setLoading(false);
      //     Toast.show("Please enter valid phone number", Toast.SHORT);
      //   }
      // } catch (error) {
      //   setLoading(false);
      //   console.error(error);
      // }
    }
  };


  const moveToHome = async () => {
    AsyncStorage.removeItem("usertoken").then(() => {
      navigation.replace("TabNavigators", {
        screen: "ChatScreen",
      });
      // navigation.replace("PreHomeKnecttGuide")
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && <ProgressLoader isVisible={loading} />}
      <View style={{ flex: 1 }}>
        <ScrollView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          {/* <StatusBar barStyle="light-content" backgroundColor="#FFFFFF" /> */}
          <Images
            source={loginLogo}
            imageStyle={{
              height: 200,
              width: 200,
              marginTop: "15%",
              // marginBottom: "50%",
            }}
          />
          <View style={{ justifyContent: "center", marginTop: "20%" }}>
            <View style={{}}>
              <Text
                style={{
                  fontSize: 17,
                  color: "#000",
                  bottom: 10,
                  marginLeft: 14,
                  fontFamily: "Verdana",
                }}
              >
                Register/Login
              </Text>

              {/* <CountryCodePickerComponent
              phoneInput={phoneInput}
              phoneNumber={phoneNumber}
              onPress={() => mobileOtpValidation(phoneNumber)}
              onChangeFormattedText={(text) => {
                console.log("ssss", text);

                setphoneNumber(text);
              }}
              // loading={loading}
            /> */}
              <TextInput
                style={styles.input}
                placeholder="Enter Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(text) => setEmail(text)}
                value={email}
              />
              <View style={styles.buttonView}>
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
                  onPress={() => {
                    emailValidation(email);
                    // triggerCrash();
                  }}
                />
              </View>
            </View>
            <View style={styles.tccontainer}>
              <Text style={styles.privacy}>
                By continuing, I agree to the{" "}
                <Text
                  onPress={() => navigation.navigate("TermsAndCondition")}
                  style={{ color: "#F79489" }}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </View>

            <View style={styles.buttonView}>
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
              <Text style={styles.guestTxt}>
                Visibility purposes with limited access
              </Text>

            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: 100,
    width: 100,
  },
  privacy: {
    fontSize: 14,
    fontFamily: "Verdana",
    marginHorizontal: 10,
    color: "#999999",
    left: 8,
  },
  tccontainer: {
    width: 320,
    marginTop: 10,
  },
  buttonView: {
    width: "92%",
    alignSelf: "center",
    marginTop: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
  },
  guestTxt: {
    fontSize: 14,
    fontFamily: "Verdana",
    color: "#999999",
    marginTop: 10,
  },

  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    fontSize: 15,
    color: "#000",
  },
});
export default LoginScreen;
