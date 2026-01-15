import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import RNFS from "react-native-fs";
import Share from "react-native-share";


export default function KnecttReport() {
    const [userId,setUserId]=useState('');
    const [loading, setLoading] = useState(true);
    const navigation=useNavigation();
    useEffect(()=>{getUserId()},[])
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

const url = userId
  ? `https://knectt-ai-profile.lovable.app/?view360Report=yes&customerId=${userId}`
  : `https://knectt-ai-profile.lovable.app/?view360Report=yes`;

  return (
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
    {/* {userId ? ( */}
      <WebView
        originWhitelist={['*']}
        source={{ uri: url }}
        style={styles.webview}
        onFileDownload={({ nativeEvent }) => {
    // handleDownload(nativeEvent.downloadUrl); // handle download with RNFS
    console.log(nativeEvent,'download action')
  }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onMessage={(event) => {
  try {
    const message = event.nativeEvent.data;

    if(message === "end"){
      navigation?.goBack?.();
      return;
    }
    // 👉 1. FIRST check for your custom event
    else if (message === "bodyMatchPage") {
      navigation.navigate("TabNavigators", {
            screen: "Offerings Page",
          })      // Your function call
      return;           // Stop further execution
    }
    else if (message === "loginApp") {
        navigation.reset({ routes: [{ name: "Login" }] });
        return;
      }

    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "PDF_REPORT") {
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
  } catch (e) {
    Alert.alert("JSON Error", String(e));
  }
}}
      />
      {/* ): (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Unable to Load as User ID is not available
      </Text>
    </View>
  )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  webview: {
    width:'100%',
    marginBottom:'6%',
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
