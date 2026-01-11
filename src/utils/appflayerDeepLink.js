import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import appsFlyer from "react-native-appsflyer";
import { useStore } from "../state";

export const appFlayerInitialize = () => {
  appsFlyer.onDeepLink(
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
      isDebug: true,
      // appId: "6517353884",
      appId: "id6517353884",
      onInstallConversionDataListener: true,
      // onDeepLinkListener: false, // -->  you must set the onDeepLinkListener to true to get onDeepLink callbacks
      onDeepLinkListener: true, // -->  you must set the onDeepLinkListener to true to get onDeepLink callbacks
    },
    (result) => {
      console.log("appFlayerInitialize", result);
      appsFlyer.onInstallConversionData(async (res) => {
        console.log("Install conversion data:", JSON.stringify(res));
        // Alert.alert(JSON.stringify(res?.data))
        console.log(JSON.stringify(res?.data), "intallconversiondaata");
        // await AsyncStorage.setItem("appFlyaerRes", JSON.stringify(res));
        const data = res?.data;
        await AsyncStorage.setItem("appFlyaerRes1", JSON.stringify(data));
        useStore.getState().setAppsFlyerData(JSON.stringify(data));
        // Alert.alert(res?.data?.af_status)
        // Alert.alert(res?.data?.productId)

        // Alert.alert('outside')
        // if (
        //   res?.data?.is_first_launch &&
        //   res?.data?.af_status === "Non-organic"
        // ) {
        //   console.log("Non-organic install - Data:", res.data);
        // }
      });
      //onDeepLinkCanceller();
    },
    (error) => {
      console.log("appFlayerInitialize->erro", error);
    }
  );

  appsFlyer.onAppOpenAttribution((data) => {
    AsyncStorage.setItem("referer", JSON.stringify(data));
    console.log("Install conversion data:::", data);
  });
};

// const onDeepLinkCanceller = () => {
//   console.log("dep==>0");
//   appsFlyer.onDeepLink((res) => {
//     console.log("dep==>1", res);
//     if (res?.deepLinkStatus !== "NOT_FOUND") {
//       const DLValue = res?.data.deep_link_value;
//       const mediaSrc = res?.data.media_source;
//       const deepLinkSub1 = res?.data.deep_link_sub1; // get up to 10 custom OneLink params

//       const deepLinkSub10 = res?.data.deep_link_sub10; // get up to 10 custom OneLink params
//       console.log(JSON.stringify(res?.data, null, 2));
//     }
//   });
// };
