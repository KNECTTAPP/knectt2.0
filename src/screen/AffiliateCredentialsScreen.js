import AsyncStorage from "@react-native-async-storage/async-storage";
import Clipboard from "@react-native-clipboard/clipboard";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  NativeModules,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import FlashMessage, {
  showMessage
} from "react-native-flash-message";
import RNPrint from "react-native-print";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from 'react-native-vector-icons/Feather';

import { TextInput } from "react-native-paper";
import thumsImg from "../../assets/img/thumbs.png";
import EndUrl from "../api/EndUrl";
import Header from "../component/Header";
import { ProgressLoader } from "../component/ProgressLoader";
const { PDFExporter } = NativeModules;

const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const AffiliateCredentialsScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Ambassador credentials");
  const [phone, setPhone] = useState("");
  const [phoneError, setphoneError] = useState();
  const [applink, setApplink] = useState();
  const [userid, setUserid] = useState();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState();
  const [isvalidate, setIsvalidate] = useState(1);
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAffilate();
    });
    return unsubscribe;
    setLoading(false);
  }, [navigation]);

  const win = Dimensions.get("window");

  const VideoControls = () => (
    <>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFF" />
        </View>
      )}

      <TouchableOpacity
        style={[styles.videoTouchable, !isPaused && styles.hiddenButton]}
        onPress={() => {
          setIsPaused(!isPaused);
          setIsPlaying(!isPlaying);
        }}
      >
        {isPaused && (
          <Image
            source={require("../../assets/img/poster.jpeg")}
            style={styles.thumbnail}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </>
  );

  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const copyToClipboard = () => {
    showMessage({
      message: "Copied successfully.",
      duration: 2000,
      position: "center",
      icon: (props) => <Image source={thumsImg} {...props} />,
      type: "success",
    });
    Clipboard.setString(applink);
  };

  const copyToPassword = () => {
    // Alert.alert("hi");
    showMessage({
      message: "Copied successfully.",
      duration: 2000,
      position: "center",
      icon: (props) => <Image source={thumsImg} {...props} />,
      type: "success",
    });
    Clipboard.setString(password);
  };

  const checkValidate = (filed) => {
    if (filed == "phone") {
      let phonereg = /^[0-9\b]+$/;
      if (phonereg.test(phone) === false) {
        setphoneError("Phone no. should be numeric");
        setIsvalidate(0);
      } else if (phone.length < 9) {
        setphoneError("Phone no. should be greater than 10 digit number");
        setIsvalidate(0);
      } else {
        setIsvalidate(1);
        setphoneError();
      }
    }
  };
  const onShare = async () => {
    try {
      let referenceCode = applink;
      console.log(referenceCode, "sfdkjfdfdhfdf");
      const result = await Share.share({
        message: referenceCode,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const getAffilate = async () => {
    try {
      setLoading(true);
      let usertoken = await AsyncStorage.getItem("usertoken");
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

      const response = await fetch(EndUrl.ifalreadyaffiliate, settingsGet);
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
      console.log("JSON", json);

      if (response.status == 200) {
        // setUserid(json.user_id);
        setUserid(json?.email_id || json?.user_id);
        setPassword(json.password);
        if (json?.affiliate_yes_no === 1) {
          setApplink(json.share_link);
          await AsyncStorage.setItem("shareAbleAffiliateLink", json.share_link);
        } else {
          setApplink("https://knectt.onelink.me/w0Pq/t111yzpx");
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const generatePdfios = async (link) => {
    try {
      // Resolve local logo image to a URI
      const logoSource = require('../assets/brandwithouttext.png'); // your logo
      const logoUri = Image.resolveAssetSource(logoSource).uri;

      // HTML content for PDF
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      text-align: center;
      margin-top: 20px;
      font-family: Arial, sans-serif;
    }
    .title {
      margin-bottom: 20px;
      font-size: 25px;
      font-weight: 500;
    }
    .smalltitle {
      margin-bottom: 40px;
      font-size: 25px;
      font-weight: 500;
    }
    .subtitle {
      margin-bottom: 20px;
      font-size: 15px;
      font-weight: 400;
      margin-left: 60px;
      margin-right: 60px;
    }
    img {
      object-fit: contain;
      margin-bottom: 10px;
    }
  </style>
</head>

<body>
    <div>
        <h1 class="title">KNECTT</h1>
        <h2 class="smalltitle">360° intelligent Metabolic Health Suite</h2>

        <img src="https://knectt.com/public/images/1765094166.png" width="200" height="200" />

        <h1 class="subtitle">
          Get Full Body Check-up, Predictive Health Profile, Guided Nutrition Plan, Body-Matched Multi-Brand Superfoods Delivery, AI- led Dynamic Tracking & Analysis. Pick any from exclusive discounted improvement plans.
        </h1>

        <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        link
      )}&size=350x350" />
    </div>
</body>
</html>
`;


      // Generate PDF using the native module
      const filePath = await PDFExporter.createPDF(htmlContent, 'Ambassador_QR');

      Alert.alert(
        '✅ PDF Saved!',
        'Check Files app → On My iPhone → KNECTT → Downloads → Ambassador_QR.pdf',
        [
          {
            text: 'Open Folder',
            onPress: async () => {
              await Linking.openURL('shareddocuments://');
            }
          }
        ]
      );
      console.log('PDF saved at:', filePath);
    } catch (error) {
      console.log('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };


  const generatePdf = async (link) => {
    try {
      // Resolve local logo image to a URI
      const logoSource = require('../assets/brandwithouttext.png'); // your logo
      const logoUri = Image.resolveAssetSource(logoSource).uri;

      // HTML content for PDF
      const htmlContent = `
  <div style="text-align:center; margin-top:20px; font-family: Arial, sans-serif;">
  <h1 style="margin-bottom:20px; font-size:25px; font-weight:500;">
    KNECTT
  </h1>
   <h1 style="margin-bottom:50px; font-size:25px; font-weight:500;">
    360° intelligent Metabolic Health Suite
  </h1>

  <img src="https://knectt.com/public/images/1765094166.png" 
       style="width:500px; height:220px; object-fit: contain; margin-bottom:10px;" />

  <h1 style="
  margin-bottom:20px;
  font-size:15px;
  font-weight:400;
  margin-left:60px;
  margin-right:60px;
">
  Get Full Body Check-up, Predictive Health Profile, Guided Nutrition Plan, Body-Matched Multi-Brand Superfoods Delivery, AI- led Dynamic Tracking & Analysis. Pick any from exclusive discounted improvement plans.
</h1>


  <img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
        link
      )}&size=420x420" />
</div>
`;


      // Generate PDF
      await RNPrint.print({
        html: htmlContent,
        fileName: 'Ambassador_QR',
        isLandscape: false,
      });

      Alert.alert('Success', 'PDF is ready to save/share!');
    } catch (error) {
      console.log('PDF generation error:', error);
      Alert.alert('Error', 'Failed to generate PDF');
    }
  };


  const sendSms = async () => {
    let phonereg = /^[0-9\b]+$/;
    if (phonereg.test(phone) === false) {
      setphoneError("Phone no. should be numeric");
      setIsvalidate(0);
    } else if (phone.length < 9) {
      setphoneError("Phone no. should be greater than 10 digit number");
      setIsvalidate(0);
    } else {
      try {
        setIsvalidate(1);
        setphoneError("");
        setLoading(true);
        let usertoken = await AsyncStorage.getItem("usertoken");
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

        const response = await fetch(
          EndUrl.gloabalurl + "sendlinksms/" + phone,
          settingsGet
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

        if (response.status == 200) {
          showMessage({
            message: "Your sms was sent successfully.",
            duration: 2000,
            position: "center",
            icon: (props) => <Image source={thumsImg} {...props} />,
            type: "success",
          });
          setLoading(false);
          setPhone("");
        }
      } catch (error) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer} edges={['top']}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext backButtonCustomFun={() => navigation.navigate("TabNavigators")} />
      <ScrollView style={{ flex: 1,marginHorizontal:10 }}>
        <View
          style={{
            width: "100%",
            padding: 0,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <View
            style={{
              width: "100%",
              padding: 5,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <View
              style={{
                marginBottom: 0,
                marginTop: 0,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginBottom: 0,
                  marginTop: 0,
                  // width: "100%",
                  flex: 1,
                }}
              >
                <TextInput
                  mode="outlined"                     // = filled style
                  label="Your Dedicated App link"
                  value={applink}
                  editable={false}
                  multiline
                  onChangeText={setApplink}
                  onBlur={() => checkValidate("applink")}
                  style={{
                    marginVertical: 4,
                    backgroundColor: "#FFFFFF", // ✅ force white
                  }}
                  contentStyle={{ paddingLeft: 8 }}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>
              <View style={styles.categorytext}>
                <Text style={styles.catetop}>
                  <Feather
                    name={"share-2"}
                    style={{
                      color: "#424553",
                      fontSize: 25,
                      fontWeight: 300,
                      backgroundColor: "white",
                      textAlign: "right",
                      padding: 5,
                      paddingLeft: 20,
                      paddingLeft: 0,
                    }}
                    onPress={onShare}
                  />
                </Text>
                <Text style={styles.litemtext}>
                  <Feather
                    name="copy"
                    style={{
                      color: "#424553",
                      fontSize: 25,
                      fontWeight: 300,
                      backgroundColor: "white",
                      textAlign: "right",
                      padding: 5,
                      paddingLeft: 20,
                      paddingLeft: 0,
                    }}
                    onPress={copyToClipboard}
                  />
                </Text>
              </View>
            </View>
            {/* <View style={{ marginBottom: 0, marginTop: 0 }}>
              <TextField
                variant="filled"
                label="Enter new (not saved) mobile number"
                value={phone}
                onChangeText={setPhone}
                onBlur={(e) => checkValidate("phone")}
              />
              {phoneError ? (
                <Text style={styles.error}>{phoneError}</Text>
              ) : null}
            </View> */}
            {/* <Button
              color="#F79489"
              mode="outlined"
              uppercase={false}
              title="Send link via sms"
              onPress={sendSms}
            /> */}
            {/* <ButtonCustom title="Send link via sms" onPress={sendSms} /> */}
          </View>

          <View
            style={{
              width: "100%",
              padding: 5,
              marginLeft: 0,
              marginRight: 0,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "400", marginBottom: 10 }}>
              {" "}
              You can web login to check your dashboard, with the below
              credentials:
            </Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL("https://knectt.com/")
              }
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "400",
                  marginBottom: 10,
                  color: "blue",
                }}
              >
                {" "}
                https://knectt.com/
              </Text>
            </TouchableOpacity>
            <TextInput
              mode="outlined"                     // = filled style
              label="Your User ID"
              value={userid}
              editable={false}
              onChangeText={setUserid}
              onBlur={() => checkValidate("userid")}
              style={{
                marginVertical: 4,
                backgroundColor: "#FFFFFF", // ✅ force white
              }}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
            />
            <View
              style={{
                marginBottom: 0,
                marginTop: 0,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* LEFT SIDE — PASSWORD TEXTFIELD */}
              <View
                style={{
                  marginBottom: 0,
                  marginTop: 0,
                  flex: 1,
                }}
              >
                <TextInput
                  mode="outlined"                 // = filled
                  label="Password"
                  value={password}
                  editable={false}            // ya disabled (neeche dekho)
                  secureTextEntry
                  onChangeText={setPassword}
                  onBlur={() => checkValidate("password")}
                  style={{
                    marginVertical: 4,
                    backgroundColor: "#FFFFFF", // ✅ force white
                  }}
                  underlineColor="transparent"
                  activeUnderlineColor="transparent"
                />
              </View>

              {/* RIGHT SIDE — COPY ICON */}
              <View style={styles.categorytext}>
                <Text style={styles.litemtextCop}>
                  <Feather
                    name="copy"
                    style={{
                      color: "#424553",
                      fontSize: 25,
                      fontWeight: 300,
                      backgroundColor: "white",
                      textAlign: "right",
                      padding: 5,
                    }}
                    onPress={copyToPassword}
                  />
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              {/* Logo */}
              <Text style={{
                color: '#000',
                fontWeight: '500',
                fontSize: 16, // larger text
                textAlign: 'center',
                marginHorizontal: '6%',
                marginBottom: 10
              }}>
                {`KNECTT`}
              </Text>
              <Text style={{
                color: '#000',
                fontWeight: '500',
                fontSize: 16, // larger text
                textAlign: 'center',
                marginHorizontal: '6%',
                marginBottom: 10
              }}>
                {`360° intelligent Metabolic Health Suite`}
              </Text>
              <Image
                source={require('../assets/brandwithouttext.png')} // replace with your logo
                style={{ width: 180, height: 90, marginBottom: 10 }}
                resizeMode="contain"
              />

              {/* Text */}
              <Text style={{
                color: '#000',
                fontWeight: '500',
                fontSize: 16, // larger text
                textAlign: 'center',
                marginHorizontal: '6%',
                marginBottom: 10
              }}>
                {`Get Full Body Check-up, Predictive Health Profile, Guided Nutrition Plan, Body-Matched Multi-Brand Superfoods Delivery, AI- led Dynamic Tracking & Analysis. Pick any from exclusive discounted improvement plans.`}
              </Text>

              {/* QR Code Image */}
              <Image
                source={{ uri: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(applink)}&size=200x200` }}
                style={{ width: 200, height: 200, marginBottom: 15 }}
              />

              {/* Download PDF Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: '#132742',
                  width: 250,            // make the button wider
                  paddingVertical: 15,   // taller button
                  borderRadius: 12,      // slightly more rounded
                  alignItems: 'center',  // center the text
                  marginVertical: 20,    // spacing from other elements
                  shadowColor: '#000',   // optional: adds shadow for depth
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
                  elevation: 5,          // for Android shadow
                }}
                onPress={async () => {
                  if (Platform.OS === 'ios') {
                    await generatePdfios(applink);
                  } else {
                    await generatePdf(applink);
                  }
                }}
              >
                <Text style={{
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: 18 // larger text
                }}>
                  Download QR PDF
                </Text>
              </TouchableOpacity>
              {/* <Text style={{ fontSize: 22, fontWeight: '600', marginBottom: 10 }}>
    Ambassador Link
  </Text> */}

            </View>


          </View>
        </View>
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            marginBottom: 10,
            textAlign: "center",
            marginHorizontal: 20,
          }}
        >
          Know anyone who wnats to join KNECTT BOOM affiliate program?
        </Text> */}
        {/* <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            marginBottom: 10,
            textAlign: "center",
          }}
        >
          Forward this video with your link now
        </Text> */}
        {/* <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: "https://knectt.com/knecttraw4.mp4" }}
            style={styles.video}
            controls={false}
            bufferConfig={{
              minBufferMs: 5000,
              maxBufferMs: 15000,
              bufferForPlaybackMs: 500,
              bufferForPlaybackAfterRebufferMs: 1000,
            }}
            paused={isPaused}
            resizeMode="contain"
            onError={(error) => console.log("Video Error:", error)}
            repeat={true}
            volume={1.0}
            rate={1.0}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => {
              setIsLoading(false);
              setIsPlaying(false);
            }}
            onEnd={() => {
              setIsPlaying(false);
              setIsPaused(true);
            }}
          />
          <VideoControls />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  videoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  videoControlText: {
    color: "#FFF",
    fontSize: 16,
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  categorytext: {
    // width: "25%",
    paddingTop: 3,
    // backgroundColor: "red",
    marginTop: 18,
    paddingHorizontal: 10,
  },
  catetop: {
    marginBottom: 10,
    marginTop: 0,
  },
  litemtextCop: {
    flex: 1,
    width: "100%",
    alignSelf: "flex-end",
    marginTop: 0,
  },
  error: {
    color: "red",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
export default AffiliateCredentialsScreen;
