import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet, View, Text, ActivityIndicator,KeyboardAvoidingView,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function DietTrackingScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const [userToken, setUserToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserId();
  }, []);

  const getUserId = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        const parsedData = JSON.parse(value);
        setUserToken(parsedData);
        console.log('Retrieved user ID:', parsedData);
        return parsedData;
      } else {
        console.log('No user data found');
        return null;
      }
    } catch (error) {
      console.error('Failed to load user ID:', error);
      return null;
    }
  };

  return (
    <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
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
      {userToken ? (
        <WebView
          originWhitelist={['*']}
          source={{ uri:`https://knectt.com/appLoginForNutritionChat?token=${userToken}` }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoadStart={() => {console.log(`https://dev.knectt.com/appLoginForNutritionChat?token=${userToken}`);setLoading(true)}}
        onLoadEnd={() => {console.log(`https://dev.knectt.com/appLoginForNutritionChat?token=${userToken}`);setLoading(false)}}
          onMessage={(event) => {
            if (event.nativeEvent.data === 'end') {
                navigation?.goBack?.();
            }
          }}
        />
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Unable to Load as User ID is not available
          </Text>
        </View>
      )}
    </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    width: '100%',
    marginBottom: '6%',
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
