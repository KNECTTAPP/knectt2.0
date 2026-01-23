import React, { useEffect, useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsModal from '../screen/preHomePage/PreHomePage';
import { useNavigation } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import EndUrl from '../api/EndUrl';
import { useFocusEffect } from '@react-navigation/native';
import RNFS from "react-native-fs";
import Share from "react-native-share";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UpdateApp from '../screen/UpdateApp';


export default function ChatBot({ handleEnd }) {
  const insets = useSafeAreaInsets();
  const [userId, setUserId] = useState('');
  const [newUpdate, setNewUpdate] = useState(false);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(newUpdate ? false : true);
  const webRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [optionModal, setOptionModal] = useState(true);
  const [webKey, setWebKey] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      getHomeApi()
      setWebKey(prev => prev + 1); // Reset WebView on screen focus
      loadProfile()
      return () => { }; // no cleanup needed
    }, [])
  );


  const getProductDetails = async (id, type) => {
    try {
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
        EndUrl.proDuctdetial + id,
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

      if (type === 'details') {
        navigation.navigate("ProductDetail", {
          proId: id,
          cateName: json.data[0]?.category,
        });
      
      }
      else {
        navigation.navigate("BloodTestScreen", {
          data: { proId: id },
          productDetails: json.data[0],
        });
      }

    } catch (error) {
      console.error(error);
    }
  };

  const goTtoLogout = async () => {
    // AsyncStorage.getAllKeys()
    //   .then((keys) => AsyncStorage.multiRemove(keys))
    //   .then(() => console.log("logout"));
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
    navigation.dispatch(DrawerActions.closeDrawer());
    navigation.reset({
      routes: [{ name: "Login" }],
    });
  };

  const getHomeApi = async () => {
    setLoading(true);
    try {
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

      console.log(
        "SHBSHBDS:::",
        DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, "")
      );

      const resultdata = await fetch(EndUrl.homeApi, settingsGet);
      const result = await resultdata.json();
      const updateAvailable = resultdata.headers.get("updateAvailable");
      // const forceUpdate = resultdata.headers.get("forceUpdate");
      // console.log("forceUpdate--->2", forceUpdate);

      const isOldFordeUpdatePopup = resultdata.headers.get(
        "useOldFordeUpdatePopup"
      );
      console.log(
        "isOldFordeUpdatePopup updateAvailable:::",
        updateAvailable,
        isOldFordeUpdatePopup
      );
      if (updateAvailable == 1 || isOldFordeUpdatePopup == 1) {
        setOptionModal(false)
        setTimeout(() => {
          setNewUpdate(true);
        }, 1000);
      } else {
        setNewUpdate(false);
      }

    } catch (error) {
      console.error("Home API Error:", error);
    } finally {
      setLoading(false);
    }
  };

const loadProfile = async () => {
  try {
    const profile = await getProfileData();
    setUserData(profile);
  } catch (error) {
    console.log("Profile error:", error.message);
  }
};
 
  useEffect(() => { getUserId(); loadProfile(); getHomeApi() }, [])
  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        const parsedData = JSON.parse(value);
        const userIdFromStorage = parsedData[0]?.user_id;
        setUserId(userIdFromStorage)
        console.log("Retrieved user ID:", userIdFromStorage);
        return userId;
      } else {
        console.log("No user data found");
        return null;
      }
    } catch (error) {
      console.error("Failed to load user ID:", error);
      return null;
    }
  };

  const iosStoreURL =
    "https://apps.apple.com/in/app/knectt-health-marketplace/id6517353884";
  const androidStoreURL =
    "https://play.google.com/store/apps/details?id=com.knectt";

  const _onPressUpdate = () => {
    if (Platform.OS == "ios") {
      Linking.openURL(iosStoreURL);
    } else {
      Linking.openURL(androidStoreURL);
    }
    // setNewUpdate(false)
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : 'undefined'}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {loading && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(255,255,255,0.6)",
                zIndex: 99,
              }}
            >
              <ActivityIndicator size="large" color="#F79489" />
            </View>
          )}
          <WebView
            key={webKey}
            cacheEnabled={false}
            incognito={true}
            ref={webRef}
            originWhitelist={['*']}
            source={{ uri: `https://knectt-ai-guide.lovable.app/?customerId=${userId}&name=${userData?.first_name}&email=${userData?.email}` }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onMessage={(event) => {

              console.log("WebView Message:", event.nativeEvent.data);

              if (event.nativeEvent.data === 'endChat') {
                handleEnd()
              }
              else if (event.nativeEvent.data === 'end') {
                handleEnd()
              }
              else if (event.nativeEvent.data === 'loginApp') {
                navigation.reset({
                  routes: [{ name: "Login" }],
                });
              }
              else if (event.nativeEvent.data === 'liveChat') {
                navigation.navigate('NutritionistLiveChat')
              }
              else if (event.nativeEvent.data === 'checkDietPlans') {
                navigation.navigate('My Diet')
              }
              else if (event.nativeEvent.data === 'searchPage') {
                navigation.navigate('Search')
              }
              else if (event.nativeEvent.data === 'bodyMatchPage') {
                handleEnd()
              }
              else if (JSON.parse(event.nativeEvent.data).event === 'openBloodTestDetails') {
                getProductDetails(JSON.parse(event.nativeEvent.data).test_id, 'details')
              }
              else if (JSON.parse(event.nativeEvent.data).event === 'bookBloodTest') {
                getProductDetails(JSON.parse(event.nativeEvent.data).test_id, 'booking')
              }
              else if (JSON.parse(event.nativeEvent.data).event === 'openTrackProgress') {
                navigation.navigate('DietTrackingScreen')
              }
              else if (JSON.parse(event.nativeEvent.data).event === 'openPredictiveProfile' ||
                JSON.parse(event.nativeEvent.data).event === 'openImprovementPlan') {
                webRef.current.injectJavaScript(`
            window.location.href = "${JSON.parse(event.nativeEvent.data).url}";
            true;
          `);
              }
              else if (JSON.parse(event.nativeEvent.data).event === 'goBackToGuide') {
                webRef.current.goBack();
              }
              else if (JSON.parse(event.nativeEvent.data).type === "PDF_REPORT") {
                const data = JSON.parse(event.nativeEvent.data);
                const base64 = data.base64.replace("data:application/pdf;filename=generated.pdf;base64,", "");
                const fileName = data.fileName;
                const path =
                  Platform.OS === "android"
                    ? RNFS.DownloadDirectoryPath + "/" + fileName
                    : RNFS.DocumentDirectoryPath + "/" + fileName;

                RNFS.writeFile(path, base64, "base64")
                  .then(() => {
                    Share.open({
                      url: "file://" + path,
                      type: "application/pdf",
                      title: "Share PDF"
                    });
                  })
                  .catch(e => Alert.alert("Save Error", String(e)));
              }
              else {
                // getProductDetails(JSON.parse(event.nativeEvent.data).test_id)
                console.log(JSON.parse(event.nativeEvent.data), 'log')
              }
            }}
          />
          {/* ): (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Something went wrong. Re-try again
      </Text>
    </View>
  )} */}
          {!newUpdate ? (
            <OptionsModal visible={false} onClose={() => setOptionModal(false)} />
          ) : <UpdateApp
            isUpdateAvailable={newUpdate}
            _onPressUpdate={_onPressUpdate}
          />}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  webview: {
    width: '100%',
    marginBottom: '6%',
    // backgroundColor:'yellow'
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: '500',
  },
});
