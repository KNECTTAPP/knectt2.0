import AsyncStorage from "@react-native-async-storage/async-storage";
import appsFlyer from "react-native-appsflyer";
import { useStore } from "../state";

export const appFlayerInitialize1 = () => {
  let AFGCDListener = appsFlyer.onInstallConversionData(async (res) => {
    console.log("Install conversion data:", JSON.stringify(res));
    console.log(JSON.stringify(res?.data), "intallconversiondaata");
    const data = res?.data;
    await AsyncStorage.setItem("appFlyaerRes1", JSON.stringify(data));
    useStore.getState().setAppsFlyerData(JSON.stringify(data));
  });

  let AFUDLListener = appsFlyer.onDeepLink(
    (res) => {
      console.log("onDeepLink FULL RESPONSE:", JSON.stringify(res, null, 2));
      if (res?.deepLinkStatus !== "NOT_FOUND") {
        const DLValue = res?.data.deep_link_value;
        const mediaSrc = res?.data.media_source;
        const deepLinkSub1 = res?.data.deep_link_sub1; // get up to 10 custom OneLink params
        const deepLinkSub10 = res?.data.deep_link_sub10; // get up to 10 custom OneLink params
      }
    },
    (error) => {
      console.log("appFlayerInitialize->erro", error);
    }
  );
  //appFlyer function to initialize th appFlyer or to detect the appsFlyer installation in the application
  appsFlyer.initSdk(
    {
      devKey: "7iaoAGgye8srDxYiaWdWBn",
      isDebug: false,
      // appId: "6517353884",
      appId: "id6517353884",
      onInstallConversionDataListener: true,
      // onDeepLinkListener: false, // -->  you must set the onDeepLinkListener to true to get onDeepLink callbacks
      onDeepLinkListener: true, // -->  you must set the onDeepLinkListener to true to get onDeepLink callbacks
    },
    (result) => {
      console.log("appFlayerInitialize", result);
    },
    (error) => {
      console.log("appFlayerInitialize->erro", error);
    }
  );
};
