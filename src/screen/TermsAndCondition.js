import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  
} from "react-native";
import Header from "../component/Header";
import HTML from "react-native-render-html";
import { ProgressLoader } from "../component/ProgressLoader";
import endUrls from "../api/EndUrl";
import { SafeAreaView } from "react-native-safe-area-context";
const TermsAndCondition = () => {
  const [terms, setTerms] = useState("");
  const [loading, setLoading] = useState(true);
  const { width } = useWindowDimensions();
  const termsAndCondition = async () => {
    try {
      setLoading(true);
      const response = await fetch(endUrls.gloabalurl + "termcondition");
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
      const content = json.data[0];
      const source = {
        html: content.content,
      };
      setTerms(source);
      setLoading(false);
      console.log("response===", content.content);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    termsAndCondition();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProgressLoader isVisible={loading} />
      <Header chatLogo backButtonwithtext />
      <ScrollView style={{ margin: 10 }}>
        <HTML
          contentWidth={width}
          source={terms}
          customHTMLElementModels={{ color: "white", backgroundColor: "red" }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
// const styles = StyleSheet.create({

// })
export default TermsAndCondition;
