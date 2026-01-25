import React, { useState, Component, useEffect, useCallback } from "react";
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
  BackHandler,
  AppState,
  Modal
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import HTMLView from "react-native-htmlview";
import { format } from "date-fns";
import ChatBot from "../component/KnecttGuideChatbot.js"
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import ImageCarousel from "../component/SimilerProductCarousel";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import TestProfileScreen from "./TestProfileScreen.js";
import EndUrl from "../api/EndUrl";
import HTML from "react-native-render-html";
import ViewMoreText from "react-native-view-more-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { ButtonCustom } from "../component/ButtonCustom.js";
import DeviceInfo from "react-native-device-info";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const ChatbotScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Notification");
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);
  const [titleText, setTitleText] = useState(null);
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [cemail, setCemail] = useState();
  const [itemText, setItemText] = useState([]);
  const [notification, setNotification] = useState([]);
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  const [loadURL,setLoadURL]=useState(false);
  const [isSelected, setSelection] = useState([]);
  const [fastingSelect, setFastingSelect] = useState([]);
  const [category, setCategory] = useState([]);
  const [pin, setPin] = useState();
  //const [emailOtop, setEmailOtp] = useState();
  const [waitvalue, setWailValue] = useState();
  let email = "";
  let fastingbutton = false;
  let minorallimentbtn = false;
  let customerEmail = "";
  let emailOtop = "971110";
  let gender = "";
  let heightstatndard = "";
  let weightstandrad = "";
  let weight = "";
  let height = "";
  let page = "";
  let pname = "";
  let zippin = "";
  const getNavicuratedPro = async () => {
    //insertBodyProfile();
    setTimeout(function () {
      navigation.navigate("TabNavigators", {
        screen: "Body Matched",
      });
    }, 1000);
  };
  let weekDAyarry = [
    { id: 1, label: "Monday" },
    { id: 2, label: "Tuesday" },
    { id: 3, label: "Wednesday" },
    { id: 4, label: "Thursday" },
    { id: 5, label: "Friday" },
    { id: 5, label: "Saturday" },
    { id: 5, label: "Sunday" },
  ];
  let ailment = [];
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  const secheckbox = (value) => {
    let oldArray = isSelected;
    var index = oldArray.indexOf(value);
    if (index > -1) {
      setSelection(oldArray.pop(value));
    } else {
      setSelection(oldArray.push(value));
    }
  };

  const secheckboxFast = (value) => {
    let oldArray = fastingSelect;
    var index = oldArray.indexOf(value);
    if (index > -1) {
      setFastingSelect(oldArray.pop(value));
    } else {
      setFastingSelect(oldArray.push(value));
    }
  };
  var jcharterpush = [];
  const getSpecialcategory = async () => {
    try {
      const response = await fetch(EndUrl.getdisorder);
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
      for (var i = 0; i < json.data.length; i++) {
        jcharterpush.push({
          id: json.data[i].id,
          label: json.data[i].category,
        });
      }
      //jcharterpush.push({id:0,label:'None of these.'});
      //console.log(jcharterpush);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  const minorailment = async () => {
    try {
      const response = await fetch(EndUrl.getminorailment);
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
      for (var i = 0; i < json.data.length; i++) {
        ailment.push({ id: json.data[i].id, label: json.data[i].category });
      }
      //jcharterpush.push({id:0,label:'None of these.'});
      //console.log(jcharterpush);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          // Navigate to Offerings Page
          navigation.navigate("Offerings Page");
          return true; // prevent default back behavior
        };
  
         const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => subscription.remove();
      }, [navigation])
    );

  const sendEmailOtp = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      var postpayload = {
        email: email,
      };
      const response = await fetch(EndUrl.sendemailotp, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify(postpayload),
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
      if (response.status == 200) {
        emailOtop = json.otp;
      }
      console.log(emailOtop);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const insertBodyProfile = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      var postpayload = {
        disorder: isSelected.toString(),
        minor_ailment: fastingSelect.toString(),
        age: page,
        gender: gender,
        height: height,
        weight: weight,
        name: pname,
        pincode: zippin,
        email: email,
        height_standard: heightstatndard,
        weight_standard: weightstandrad,
      };
      console.log(postpayload);
      const response = await fetch(EndUrl.insertbodyprofile, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body: JSON.stringify(postpayload),
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
      if (response.status == 200) {
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const NextTrigger = (section, tripite, triggerNextStep) => {
    if (section == "fasting" && fastingbutton == false) {
      triggerNextStep({ trigger: tripite });
      fastingbutton = true;
    }
    if (section == "dissorder" && minorallimentbtn == false) {
      triggerNextStep({ trigger: tripite });
      minorallimentbtn = true;
    }
  };
  const Disorder = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width - 80 }}>
        <FlatList
          style={{
            width: "100%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
          numColumns={2}
          data={jcharterpush}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "100%",
                  flex: 1,
                  marginLeft: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={isSelected.indexOf(item.id) >= 0 ? true : false}
                  isChecked={isSelected.indexOf(item.id) >= 0 ? true : false}
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    secheckbox(item.id);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        {/* <Button color="#F79489" disabled={minorallimentbtn} onPress={() => NextTrigger('dissorder', 5, triggerNextStep)} title={'Next'} /> */}
        <ButtonCustom
          onPress={() => NextTrigger("dissorder", 5, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };
  const FastingVegcheckBox = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width - 80 }}>
        <FlatList
          style={{
            width: "100%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
          numColumns={2}
          data={ailment}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  flex: 1,
                  paddingLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={fastingSelect.indexOf(item.id) >= 0 ? true : false}
                  isChecked={fastingSelect.indexOf(item.id) >= 0 ? true : false}
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    secheckboxFast(item.id);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        <ButtonCustom
          color="#F79489"
          disabled={fastingbutton}
          onPress={() => NextTrigger("fasting", 7, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };

  var steps = [
    {
      id: "0",
      message: `Hi!`,
      trigger: "1",
    },
    {
      id: "1",
      message: `I shall ask you some questions to body-match health products for you`,
      trigger: "3skip",
    },
    {
      id: "3skip",
      options: [
        { value: 1, label: "Proceed", trigger: "3" },
        { value: 2, label: "Skip", trigger: "31" },
      ],
    },
    {
      id: "2",
      message: ({ steps }) => {
        return `Sounds Good! Some medical profile questions, to start.`;
      },
      trigger: "3",
    },
    {
      id: "3",
      message: ({ steps }) => {
        return `Choose any known disorder from the following?`;
      },
      trigger: "4",
    },
    {
      id: "4",
      component: <Disorder />,
      replace: false,
      waitAction: false,
      asMessage: true,
    },
    {
      id: "5",
      message: `Any known minor ailment?`,
      trigger: "6",
    },
    {
      id: "6",
      component: <FastingVegcheckBox />,
      replace: false,
      waitAction: false,
      asMessage: true,
    },
    {
      id: "7",
      message: ({ steps }) =>
        `Good! Going.Now I shall ask you some body profile questions.😃`,
      trigger: "8",
    },
    {
      id: "8",
      trigger: "9",
      message: `What is Your gender ?`,
    },
    {
      id: "9",
      options: [
        { value: 1, label: "Male", trigger: "10" },
        { value: 2, label: "Female", trigger: "10" },
      ],
    },
    {
      id: "10",
      message: ({ steps }) => {
        gender = `${steps[9].value}`;
        return `What is your Age.`;
      },
      trigger: "11",
    },
    {
      id: "11",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      validator: (number) => {
        if (isNaN(number)) {
          return "Your age should fall between 16-75.";
        } else if (number < 16 || number > 75) {
          return "Your age should fall between 16-75.";
        } else {
          setAge(number);
          page = number;
          return true;
        }
      },
      trigger: "12",
    },
    {
      id: "12",
      message: ({ steps }) => `Please select metric to enter height ?`,
      trigger: "12h",
    },
    {
      id: "12h",
      options: [
        { value: 1, label: "Feet.Inches", trigger: "13" },
        { value: 2, label: "Centimeters", trigger: "14" },
      ],
    },
    {
      id: "13",
      message: ({ steps }) => {
        heightstatndard = `${steps["12h"].value}`;
        return `Please enter your height in Feet.Inches ?.`;
      },
      trigger: "13h",
    },
    {
      id: "13h",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      trigger: "15",
      validator: (value) => {
        var numfromate = /^-?\d+\.?\d*$/;
        if (!value.match(numfromate)) {
          return "Your height should fall between 4.5-7 feet";
        } else if (value < 4.5 || value > 7) {
          return "Your height should fall between 4.5-7 feet";
        } else {
          height = value;
          return true;
        }
      },
    },
    {
      id: "14",
      message: ({ steps }) => {
        heightstatndard = `${steps["12h"].value}`;
        return `Please enter your height in Centimeters ?`;
      },
      trigger: "14h",
    },
    {
      id: "14h",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      trigger: "16",
      validator: (value) => {
        var numfromate = /^-?\d+\.?\d*$/;
        if (!value.match(numfromate)) {
          return "Your height should fall between 140-215 CMS";
        } else if (value < 140 || value > 215)
          return "Your height should fall between 140-215 CMS";
        else {
          height = value;
          return true;
        }
      },
    },
    {
      id: "15",
      message: ({ steps }) =>
        `Your height is  ${steps["13h"].value.split(".")[0]} feet and ${
          steps["13h"].value.split(".")[1]
        } inch`,
      trigger: "17",
    },
    {
      id: "16",
      message: ({ steps }) => `Your height is  ${steps["14h"].value} CMS`,
      trigger: "17",
    },
    {
      id: "17",
      message: ({ steps }) => `Please select metric to enter weight ?`,
      trigger: "18",
    },
    {
      id: "18",
      options: [
        { value: 1, label: "Kgs", trigger: "19h" },
        { value: 2, label: "Lbs", trigger: "22" },
      ],
    },
    {
      id: "19",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      trigger: "23",
      validator: (value) => {
        if (isNaN(value)) {
          return "Your weight should fall between 50-150 Kgs";
        } else if (value < 50 || value > 150)
          return "Your weight should fall between 50-150 Kgs";
        else {
          weight = value;
          return true;
        }
      },
    },
    {
      id: "19h",
      message: ({ steps }) => {
        weightstandrad = `${steps[18].value}`;
        return `Enter you weight in Kgs.`;
      },
      trigger: "19",
    },
    {
      id: "20",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      trigger: "23",
      validator: (value) => {
        if (isNaN(value)) {
          return "Your weight should fall between 110-242 LBS";
        } else if (value < 110 || value > 242)
          return "Your weight should fall between 110-242 LBS";
        else {
          weight = value;
          return true;
        }
      },
    },
    {
      id: "22",
      message: ({ steps }) => {
        weightstandrad = `${steps[18].value}`;
        return `Enter you weight in Lbs.`;
      },
      trigger: "20",
    },
    {
      id: "23",
      message: ({ steps }) =>
        `Last few profile questions while I'm analyzing your health profile`,
      trigger: "24",
    },
    {
      id: "24",
      message: `What is your Name ?`,
      trigger: "25",
    },
    {
      id: "25",
      user: true,
      inputAttributes: {
        keyboardType: "default",
      },
      trigger: "26",
      validator: (value) => {
        var nameformate = /^[a-zA-Z ]+$/;
        if (!value.match(nameformate)) return "Letters and spaces only please";
        else {
          setName(value);
          pname = value;
          return true;
        }
      },
    },
    {
      id: "26",
      message: `What is your Email id?`,
      trigger: "27",
    },
    {
      id: "27",
      user: true,
      inputAttributes: {
        keyboardType: "email-address",
      },
      validator: (value) => {
        var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!value.match(mailformat)) return "Please enter valid email address";
        else {
          email = value;
          customerEmail = value;
          return true;
        }
      },
      trigger: "28h",
    },
    {
      id: "28h",
      message: ({ steps }) => {
        sendEmailOtp();
        return `Enter the OTP from your email`;
      },
      trigger: "28top",
    },
    {
      id: "28top",
      user: true,
      inputAttributes: {
        keyboardType: "default",
      },
      trigger: "28",
      validator: (value) => {
        if (value == emailOtop) return true;
        else {
          return "Email OTP is Invalid";
        }
      },
    },
    {
      id: "28",
      message: `Plz enter your area PIN Code ?`,
      trigger: "29",
    },
    {
      id: "29",
      user: true,
      inputAttributes: {
        keyboardType: "numeric",
      },
      trigger: "30",
      validator: (number) => {
        if (number.length < 6) return "Invalid PIN code";
        else {
          setPin(number);
          zippin = number;
          return true;
        }
      },
    },
    {
      id: "30",
      message: ({ steps }) => {
        insertBodyProfile();
        return `Done! Congratulations.Your personalized products has been curated. Enjoy shopping.`;
      },
      end: true,
    },
    {
      id: "31",
      message: "Thanks",
      end: true,
    },
  ];

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getSpecialcategory();
        minorailment();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);


  // Call the version check on component mount and on focus
  useFocusEffect(
      React.useCallback(() => {
        const onBackPress = () => {
          // Show the confirmation dialog when back button is pressed on the Home screen
          // setModalVisible(true);
          BackHandler.exitApp();
          return true; // Prevent default behavior
        };
  
          const subscription = BackHandler.addEventListener(
    "hardwareBackPress",
    onBackPress
  );

  return () => subscription.remove();
      }, [])
    );

  return (
    <>
    <SafeAreaView style={{flex:1}}  edges={['top']} >
    <ChatBot
      isUpdateAvailable={newUpdate}
      setBackUpdate={()=>setNewUpdate(false)}
      handleEnd={() => {
        // getNavicuratedPro();
        setLoadURL(false)
        navigation.navigate("TabNavigators", {
            screen: "Offerings Page",
          });
      }}
    />
    {/* <UpdateApp
        isUpdateAvailable={isUpdateAvailable}
        _onPressUpdate={onPressUpdate}
      /> */}
      </SafeAreaView>
    </>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  orderiTem: {
    backgroundColor: "#FFF",
    padding: 10,
    marginLeft: 1,
    marginRight: 15,
    margin: 2,
  },
  tagRight: {},
  checlable: {
    color: "#000",
    flex: 1,
  },
  checkbox: { transform: [{ scale: 0.8 }] },
  container: {
    flex: 1,
  },
  subContainer: {
    backgroundColor: "rgba(1,1,1,0)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
  },
  descText: { marginBottom: 10 },
  titleText: { fontWeight: "bold", fontSize: 16 },
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "white",
    width: "100%",
    borderRadius: 8,
    padding: 20,
  },
});
export default ChatbotScreen;
