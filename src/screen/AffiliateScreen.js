import React, { useState, Component, useEffect, useRef } from "react";
import {
  Platform,
  View,
  Button,
  Text,
  Image,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  Pressable,
  
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import HTMLView from "react-native-htmlview";
import RenderHTML from "react-native-render-html";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import NumericInput from "react-native-numeric-input";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import bodymatchslider from "../../assets/img/bodymatchslider.png";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom.js";
import Video from "react-native-video";
import Icon from "react-native-vector-icons/Ionicons";
import DeviceInfo from "react-native-device-info";
import { IconPlayCircle } from "../component/IconComp.js";

const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const AffiliateScreen = ({ navigation, route }) => {
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
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: "https://knectt.com/knecttraw4.mp4" }}
            bufferConfig={{
              minBufferMs: 2000,
              maxBufferMs: 10000,
              bufferForPlaybackMs: 500,
              bufferForPlaybackAfterRebufferMs: 1000,
            }}
            style={styles.video}
            controls={false}
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
        </View>

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
                width: "100%",
                padding: 5,
                marginTop: 0,
                marginLeft: 0,
                marginRight: 0,
                textAlign: "center",
              }}
            >
              <RenderHTML source={{ html: affiliateText }} />
            </View>
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          width: "100%",
          padding: 5,
          marginTop: 0,
          marginLeft: 0,
          marginRight: 0,
          marginTop: "2%",
          marginBottom: "2%",
        }}
      >
        {/* <Button
            color="#F79489" mode="outlined"
            uppercase={false} title="Create an Account" onPress={createAlliiate} /> */}
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
    height: 92,
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
