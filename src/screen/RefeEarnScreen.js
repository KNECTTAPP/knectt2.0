// import React, { useState, Component, useEffect } from "react";
// import {
//   Platform,
//   View,
//   Button,
//   Text,
//   Share,
//   Image,
//   Linking,
//   Dimensions,
//   TouchableWithoutFeedback,
//   Alert,
//   StyleSheet,
//   Pressable,
//   SafeAreaView,
//   ScrollView,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
// } from "react-native";
// import HTMLView from "react-native-htmlview";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { scale } from "react-native-size-matters";
// import { TabNavigators } from "../../TabNavigators.js";
// import ModalTester from "../component/ModalComponent";
// import { ProgressLoader } from "../component/ProgressLoader";
// import LinearGradient from "react-native-linear-gradient";
// import NumericInput from "react-native-numeric-input";
// import { TextField } from "react-native-materialui-textfield";
// import Header from "../component/Header";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import referandearn from "../../assets/icons/refer_and_earn.jpg";

// import FlashMessage, {
//   showMessage,
//   hideMessage,
// } from "react-native-flash-message";
// import EndUrl from "../api/EndUrl";
// import fonts from "../utils/fonts.js";
// import { IconIosCheckMark } from "../component/IconComp.js";
// import { ButtonCustom } from "../component/ButtonCustom.js";
// const RefeEarnScreen = ({ navigation, route }) => {
//   const [titleText, setTitleText] = useState(null);
//   const [categoryTitle, setCategoryTitle] = useState("Refer & Earn");
//   const [itemText, setItemText] = useState([]);
//   const [state, setState] = useState({ starCount: 3.5 });
//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState("");
//   const win = Dimensions.get("window");
//   const onStarRatingPress = (rating) => {
//     setState({ starCount: rating });
//   };

//   const onShare = async () => {
//     try {
//       let referenceCode = await AsyncStorage.getItem("referenceCode");
//       const result = await Share.share({
//         message: referenceCode,
//       });
//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // shared with activity type of result.activityType
//         } else {
//           // shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // dismissed
//       }
//     } catch (error) {
//       Alert.alert(error.message);
//     }
//   };
//   return (
//     <SafeAreaView style={styles.screenContainer}>
//       {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
//       <FlashMessage />
//       <Header categoryTitle={categoryTitle} backButtonwithtext />
//       <ScrollView style={{ flex: 1 }}>
//         <View
//           style={{
//             width: "100%",
//             padding: 1,
//             marginTop: 0,
//             marginLeft: 0,
//             marginRight: 0,
//           }}
//         >
//           <View>
//             <Image
//               source={referandearn}
//               style={{ height: scale(180), width: "auto" }}
//             />
//             <View>
//               <Text style={{ padding: 10, fontSize: 14, fontStyle: "italic" }}>
//                 *The cash back can be redeemed under KNECTT BONUS in your cart
//                 page, next time you place an order, through your verified
//                 payment mode.
//               </Text>
//               <Text
//                 style={{
//                   padding: 10,
//                   fontSize: 14,
//                   paddingTop: 0,
//                   fontStyle: "italic",
//                 }}
//               >
//                 ** 7 days free will be added next time you make a payment for
//                 any Smart e-Diet nutrition plan.
//               </Text>
//             </View>
//           </View>
//           <View
//             style={{
//               marginBottom: 0,
//               alignSelf: "center",
//               justifyContent: "center",
//               flex: 1,
//               marginTop: 10,
//               flexDirection: "row",
//             }}
//           >
//             <View style={{ width: "10%" }}>
//               <View style={styles.iconCompleted}>
//                 {/* <Ionicons name='ios-checkmark-circle' size={16} color={'#132742'}/> */}
//                 <IconIosCheckMark />
//                 <Text color={"#132742"} style={styles.dash}></Text>
//                 {/* <Ionicons
//                   name="ios-checkmark-circle"
//                   size={16}
//                   color={"#132742"}
//                 /> */}
//                 <IconIosCheckMark />
//                 <Text color={"#132742"} style={styles.dash}></Text>
//                 {/* <Ionicons
//                   name="ios-checkmark-circle"
//                   size={16}
//                   color={"#132742"}
//                 /> */}
//                 <IconIosCheckMark />
//                 <Text color={"#132742"} style={styles.dash}></Text>
//                 {/* <Ionicons
//                   name="ios-checkmark-circle"
//                   size={16}
//                   color={"#132742"}
//                 /> */}
//                 <IconIosCheckMark />
//                 <Text color={"#132742"} style={styles.dash}></Text>
//                 {/* <Ionicons
//                   name="ios-checkmark-circle"
//                   size={16}
//                   color={"#132742"}
//                 /> */}
//                 <IconIosCheckMark />
//               </View>
//             </View>
//             <View style={{ width: "90%" }}>
//               <View style={{ marginBottom: 10 }}>
//                 <Text style={styles.referhead}>Invite your friend</Text>
//                 <Text style={styles.referdef}>
//                   To install the app with the link
//                 </Text>
//               </View>
//               <View style={{ marginBottom: 10 }}>
//                 <Text style={styles.referhead}>Friend places an order</Text>
//                 <Text style={styles.referdef}>Minimum Rs 500</Text>
//               </View>
//               <View style={{ marginBottom: 7 }}>
//                 <Text style={[styles.referhead, { marginTop: 4 }]}>
//                   You get Rs 100
//                 </Text>
//                 <Text style={styles.referdef}>
//                   48 hours after the product is delivered
//                 </Text>
//               </View>
//               <View style={{ marginBottom: 9 }}>
//                 <Text style={[styles.referhead, { marginTop: 5 }]}>
//                   Friend buys a Nutrition plan
//                 </Text>
//                 <Text style={styles.referdef}>Any Plan</Text>
//               </View>
//               <View style={{ marginBottom: 10 }}>
//                 <Text style={[styles.referhead, { marginTop: 4 }]}>
//                   You get 7 days FREE diet
//                 </Text>
//                 <Text style={styles.referdef}>When you purchase any plan</Text>
//               </View>
//             </View>
//           </View>
//           <View style={{ width: "100%", paddingLeft: 5, paddingRight: 5 }}>
//             {/* <Button color="#F79489" title="Refer Now" onPress={onShare} /> */}
//             <ButtonCustom title="Refer Now" onPress={onShare} />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
// const styles = StyleSheet.create({
//   iconCompleted: {
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   dash: {
//     width: 1,
//     height: 55,
//     top: 0,
//     color: "#132742",
//     borderLeftColor: "#132742",
//     borderLeftWidth: 2,
//     alignContent: "center",
//     alignSelf: "center",
//     flexDirection: "column",
//   },
//   referdef: {
//     fontSize: 17,
//     marginTop: 5,
//     marginBottom: 10,
//     color: "#CCC",
//   },
//   referhead: {
//     fontFamily: fonts.whitneySemiBold,
//     fontSize: 18,
//   },
//   screenContainer: {
//     flex: 1,
//     backgroundColor: "white",
//   },
// });
// export default RefeEarnScreen;

import React, { useState, Component, useEffect } from "react";
import {
  Platform,
  View,
  Button,
  Text,
  Share,
  Image,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import HTMLView from "react-native-htmlview";
import Ionicons from "react-native-vector-icons/Ionicons";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import LinearGradient from "react-native-linear-gradient";
import NumericInput from "react-native-numeric-input";
import { TextField } from "react-native-materialui-textfield";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import referandearn from "../../assets/icons/refer_earn.png";

import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts.js";
import { IconIosCheckMark } from "../component/IconComp.js";
import { ButtonCustom } from "../component/ButtonCustom.js";
import { getAsyncValue } from "../utils/commonFunctions.js";
import FastImage from "react-native-fast-image";
const RefeEarnScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("Refer & Earn");
  const [itemText, setItemText] = useState([]);
  const [state, setState] = useState({ starCount: 3.5 });
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const win = Dimensions.get("window");
  const onStarRatingPress = (rating) => {
    setState({ starCount: rating });
  };
  const [shareAbleAffiliateLink, setShareAbleAffiliateLink] = useState(null);
  const [isLoading, setIsLoading]=useState(true)

  const getAffiliateLinkUrl = async () => {
    const affiliateLink = await getAsyncValue("shareAbleAffiliateLink");
    console.log(affiliateLink, "thisislink");
    setShareAbleAffiliateLink(affiliateLink);
    setIsLoading(false)
  };

  useEffect(() => {
    getAffiliateLinkUrl();
  }, []);

  const onShare = async () => {
    try {
      // let referenceCode = await AsyncStorage.getItem("referenceCode");
      const shareMsg = `KNECTT app download link: ${shareAbleAffiliateLink ?  shareAbleAffiliateLink: "https://knectt.onelink.me/w0Pq/t111yzpx"}`;
      const result = await Share.share({
        message: shareMsg,
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
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            width: "100%",
            padding: 1,
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
        >
            <FastImage
              source={require('../../assets/icons/refer_earn.png')}
              style={{
                height: scale(350),
                width: "100%",
              }}
              resizeMode="contain"
            />
          <View
            style={{
              width: "100%",
              paddingLeft: 5,
              paddingRight: 5,
              marginTop: 20,
            }}
          >
            {/* <Button color="#F79489" title="Refer Now" onPress={onShare} /> */}
            <ButtonCustom title="Refer Now" onPress={onShare} />
          </View>
          <Text style={{ paddingHorizontal: 10, marginTop: 10, fontSize: 15 }}>
            Instead, register as an affiliate, under menu and share your custom
            app link to your saved contacts or sms to non saved numbers, to earn
            5% cash back on every purchase by your referral.
          </Text>
        </View>
      </ScrollView>
       {isLoading && <ProgressLoader isVisible={isLoading} />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  iconCompleted: {
    flexDirection: "column",
    alignItems: "center",
  },
  dash: {
    width: 1,
    height: 55,
    top: 0,
    color: "#132742",
    borderLeftColor: "#132742",
    borderLeftWidth: 2,
    alignContent: "center",
    alignSelf: "center",
    flexDirection: "column",
  },
  referdef: {
    fontSize: 17,
    marginTop: 5,
    marginBottom: 10,
    color: "#CCC",
  },
  referhead: {
    fontFamily: fonts.whitneySemiBold,
    fontSize: 18,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
export default RefeEarnScreen;
