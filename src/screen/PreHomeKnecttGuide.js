import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OptionsModal from "./preHomePage/PreHomePage.js";
import { useNavigation } from '@react-navigation/native';


export default function ChatBot() {
    const [userId,setUserId]=useState('');
    const [loading, setLoading] = useState(true);
    const navigation=useNavigation();
    const [optionModal,setOptionModal]=useState(true);
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
    {userId ? (
      <WebView
        originWhitelist={['*']}
        source={{ uri:`https://knectt-ai-guide.lovable.app/?customerId=${userId}` }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onMessage={(event) => {
          if (event.nativeEvent.data === 'endChat') {
             navigation.replace("TabNavigators", {
             screen: "Offerings Page",
      });
          }
        }}
      />): (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>
        Unable to Load as User ID is not available
      </Text>
    </View>
  )}
  <OptionsModal visible={optionModal} onClose={() => setOptionModal(false)}/>
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
