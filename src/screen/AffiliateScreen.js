import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import DeviceInfo from "react-native-device-info";
import RenderHTML from "react-native-render-html";
import Video from "react-native-video";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom.js";
import Header from "../component/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";


const SLIDER_1_FIRST_ITEM = 1;
var id = 0;

const AffiliateScreen = ({ navigation, route }) => {
  const { width } = useWindowDimensions();
  const [titleText, setTitleText] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [produuctData, setProduuctData] = useState([]);
  const isCarousel = React.useRef(null);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState("Affiliate");
  const [itemText, setItemText] = useState([]);
  const [affiliateText, setAffiliateText] = useState("");
  const [usertoke, SetUsertoke] = useState();
  const [cartCountshow, setCartCountshow] = useState();
  const [isPaused, setIsPaused] = useState(true);
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  console.log("asdasdasdasdasdsadsad", affiliateText)



  const getAffliate = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.getaffiliatetext, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
      if (json.status == 200) {
        setAffiliateText(json.data[0].content);
      }
    } catch (error) {
      console.log(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getAffliate();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  const toggleModal = (id, openModal) => {
    setLoading(openModal);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };

  const createAlliiate = () => {
    toggleModal();
    navigation.navigate("AffiliateCreate");
  };

  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };

  const win = Dimensions.get("window");

  // Add this component for video controls
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

  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header categoryTitle={categoryTitle} backButtonwithtext />

      <ScrollView
        style={{ flex: 1 }}
        
        contentContainerStyle={{ paddingBottom: 100 }} // 👈 button space
        showsVerticalScrollIndicator={false}
      >
        {/* VIDEO */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: "https://knectt.com/knecttraw4.mp4" }}
            style={styles.video}
            resizeMode="contain"
            paused={isPaused}
            repeat
          />
          <VideoControls />
        </View>

        {/* WEBVIEW */}
        <View style={{ minHeight: 370 }}>
          <WebView
            originWhitelist={["*"]}
            javaScriptEnabled
            domStorageEnabled
            textZoom={80}
            nestedScrollEnabled={true}   // 👈 IMPORTANT
            source={{
              html: `
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-size: 12px;
                    padding: 12px;
                  }
                </style>
              </head>
              <body>
                ${affiliateText}
              </body>
            </html>
          `,
            }}
            style={{ width: "90%", alignSelf: "center" }}
          />
        </View>
      </ScrollView>

      {/* FIXED BOTTOM BUTTON */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 10,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#eee",
        }}
      >
        <ButtonCustom title="Create an Account" onPress={createAlliiate} />
      </View>
    </SafeAreaView>


  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  topBannercontainer: {
    width: "100%",

    justifyContent: "center",
    alignItems: "center",
  },
  affliatedef: {
    textAlign: "center",
    fontSize: 19,
    marginBottom: 5,
  },
  buttoholder: {
    padding: 10,
  },
  affiliateHead: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 10,
    marginBottom: 5,
    textDecorationLine: "underline",
  },
  videoContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    padding: 20,
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  hiddenButton: {
    backgroundColor: "transparent",
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
  playIcon: {
    opacity: 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
export default AffiliateScreen;
