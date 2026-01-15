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
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import HTMLView from "react-native-htmlview";
import { format } from "date-fns";
import ChatBot from "react-native-chatbot";
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

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const EditChatbotNutritionScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Notification");
  const [titleText, setTitleText] = useState(null);
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [itemText, setItemText] = useState([]);
  const [notification, setNotification] = useState([]);
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  const [isSelected, setSelection] = useState([]);
  const [fastingSelect, setFastingSelect] = useState([]);
  const [category, setCategory] = useState([]);
  const [minserCheck, setMnerAliment] = useState([]);
  const [waitvalue, setWailValue] = useState();
  const [disorderarr, setDisorderarr] = useState([]);
  const [termndCondition, setTermndCondition] = useState(false);
  let ailment = [];
  let email = "";
  let emailOtop = "";
  let fastingbutton = false;
  let minorallimentbtn = false;
  let noneVegbutton = false;
  let miniosord = false;
  let customerEmail = "";
  let gender = "";
  let heightstatndard = "";
  let weightstandrad = "";
  let weight = "";
  let height = "";
  let page = "";
  let pname = "";
  let zippin = "";
  let termandcontion = false;
  let steps = [];

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

  const checktermp = () => {
    termandcontion = !termndCondition;
    setTermndCondition(!termndCondition);
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

  const setDisorderArrayFun = (value) => {
    let oldArray = disorderarr;
    var index = oldArray.indexOf(value);
    if (index > -1) {
      setDisorderarr(oldArray.pop(value));
    } else {
      setDisorderarr(oldArray.push(value));
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
    if (section == "noneVeg" && noneVegbutton == false) {
      triggerNextStep({ trigger: tripite });
      noneVegbutton = true;
    }
    if (section == "minorOrd" && miniosord == false) {
      triggerNextStep({ trigger: tripite });
      miniosord = true;
    }
  };

  const setMinoorArray = (value) => {
    let oldArray = minserCheck;
    var index = oldArray.indexOf(value);
    if (index > -1) {
      setMnerAliment(oldArray.pop(value));
    } else {
      setMnerAliment(oldArray.push(value));
    }
  };

  const sendEmailOtp = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const settingsGet = {
        method: "POST",
        body: JSON.stringify({ email: email }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      };
      const response = await fetch(EndUrl.sendemailotp, settingsGet);
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
      emailOtop = json.otp;
    } catch (error) {
      console.log(error);
    } finally {
      //setLoading(false);
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
          data={disorderr}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "auto",
                  flex: 1,
                  marginLeft: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={disorderarr.indexOf(item.label) >= 0 ? true : false}
                  isChecked={
                    disorderarr.indexOf(item.label) >= 0 ? true : false
                  }
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    setDisorderArrayFun(item.label);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        {/* <Button color="#F79489" disabled={minorallimentbtn} onPress={() => NextTrigger('dissorder', 38, triggerNextStep)} title={'Next'} /> */}
        <ButtonCustom
          onPress={() => NextTrigger("dissorder", 38, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };

  var disorderr = [];
  const getdisorderApi = async () => {
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
        disorderr.push({ id: json.data[i].id, label: json.data[i].category });
      }
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

  const MainerAliment = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.7 }}>
        <FlatList
          style={{
            width: "100%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 1,
          }}
          numColumns={2}
          data={ailment}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: "auto",
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={minserCheck.indexOf(item.label) >= 0 ? true : false}
                  isChecked={
                    minserCheck.indexOf(item.label) >= 0 ? true : false
                  }
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    setMinoorArray(item.label);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        {/* <Button
          color="#F79489"
          disabled={miniosord}
          onPress={() => NextTrigger("minorOrd", 40, triggerNextStep)}
          title={"Next"}
        /> */}
        <ButtonCustom
          onPress={() => NextTrigger("minorOrd", 40, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };

  useEffect(() => {
    minorailment();
    getdisorderApi();
  });

  const TermandCondition = ({ triggerNextStep }) => {
    return (
      <View
        style={{
          width: width * 0.7,
          flexDirection: "row",
          alignSelf: "flex-start",
          alignItems: "center",
        }}
      >
        <View style={{ width: 30 }}>
          <CheckBox
            style={styles.checkbox}
             tintColors={{ true: "#132742",false :"#999" }}
            onCheckColor={"#6F763F"}
            value={termandcontion}
            isChecked={termandcontion}
            onValueChange={() => {
              checktermp();
            }}
          />
        </View>
        <View style={{ backgroundColor: "#fff", padding: 4 }}>
          <Text>Disclaimer:</Text>
          <Text style={{ width: width - 150, flexDirection: "column" }}>
            Results may vary from person to person depending on age, gender,
            determination and health conditions. This is medical professionals
            led service and there are no cancellation/refunds, whatsoever.
          </Text>
          {/* <Button
            color="#F79489"
            onPress={() => triggerNextStep({ trigger: "43" })}
            title={"Review cart and pay"}
          /> */}
          <ButtonCustom
            onPress={() => triggerNextStep({ trigger: "43" })}
            title={"Review cart and pay"}
          />
        </View>
        <View></View>
      </View>
    );
  };

  const NonVegcheckBox = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.7 }}>
        <FlatList
          style={{
            width: "90%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
          numColumns={2}
          data={weekDAyarry}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: 100,
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={isSelected.indexOf(item.label) >= 0 ? true : false}
                  isChecked={isSelected.indexOf(item.label) >= 0 ? true : false}
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    secheckbox(item.label);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        {/* <Button
          color="#F79489"
          disabled={noneVegbutton}
          onPress={() => NextTrigger("noneVeg", 33, triggerNextStep)}
          title={"Next"}
        /> */}
        <ButtonCustom
          onPress={() => NextTrigger("noneVeg", 33, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };
  const FastingVegcheckBox = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.7 }}>
        <FlatList
          style={{
            width: "90%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 1,
          }}
          numColumns={2}
          data={weekDAyarry}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  width: 100,
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                   tintColors={{ true: "#132742",false :"#999" }}
                  value={fastingSelect.indexOf(item.label) >= 0 ? true : false}
                  isChecked={
                    fastingSelect.indexOf(item.label) >= 0 ? true : false
                  }
                  style={Platform.OS === "ios" ? styles.checkbox : {}}
                  onValueChange={() => {
                    secheckboxFast(item.label);
                  }}
                  boxType="square"
                />
                <Text style={styles.checlable}>{item.label}</Text>
              </View>
            );
          }}
        />
        {/* <Button
          color="#F79489"
          disabled={fastingbutton}
          onPress={() => NextTrigger("fasting", 36, triggerNextStep)}
          title={"Next"}
        /> */}
        <ButtonCustom
          onPress={() => NextTrigger("fasting", 36, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "85%" }}
        />
      </View>
    );
  };

  const getMyOrder = async () => {
    if (refresh == false) {
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

        const response = await fetch(EndUrl.getnotification);
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        console.log(json);
        setNotification(json.data);
        setRefresh(!refresh);
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    }
  };
  if (route.params.id == 8) {
    steps = [
      {
        id: "0",
        message: `Hi! Do you wish to make changes to your existing medical history profile?.---`,
        trigger: "3skip",
      },
      {
        id: "3skip",
        options: [
          { value: 1, label: "Yes, I want to.", trigger: "1h" },
          { value: 2, label: "No, I am good.", trigger: "43" },
        ],
      },
      {
        id: "1h",
        message: `What is your Name ?`,
        trigger: "1",
      },
      {
        id: "1",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "2",
        validator: (value) => {
          var nameformate = /^[a-zA-Z ]+$/;
          if (!value.match(nameformate))
            return "Letters and spaces only please";
          else {
            setName(value);
            pname = value;
            return true;
          }
        },
      },
      {
        id: "2",
        message: `What is your Age ?`,
        trigger: "3",
      },
      {
        id: "3",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "4",
        validator: (number) => {
          if (isNaN(number)) {
            return "Your age should fall between 16-75.";
          } else if (number < 16 || number > 75) {
            return "Your age should fall between 16-75.";
          } else {
            setAge(number);
            return true;
          }
        },
      },
      {
        id: "4",
        trigger: "5",
        message: `What is Your gender ?`,
      },
      {
        id: "5",
        options: [
          { value: 1, label: "Male", trigger: "6" },
          { value: 2, label: "Female", trigger: "6" },
        ],
      },
      {
        id: "6",
        message: ({ steps }) => `Great start! Just few more questions😃`,
        trigger: "7",
      },
      {
        id: "7",
        message: ({ steps }) =>
          `Choose metric from below to enter your height?`,
        trigger: "8",
      },
      {
        id: "8",
        options: [
          { value: 1, label: "Feet.inch", trigger: "9h" },
          { value: 2, label: "Centimetres", trigger: "10h" },
        ],
      },
      {
        id: "9h",
        message: ({ steps }) => `Enter your height in Feet.inch`,
        trigger: "9",
      },
      {
        id: "9",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "11",
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
        id: "10h",
        message: ({ steps }) => `Enter your height in Centimetres`,
        trigger: "10",
      },
      {
        id: "10",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "12",
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
        id: "11",
        message: ({ steps }) =>
          `Your height is  ${steps[9].value.split(".")[0]} feet and ${
            steps[9].value.split(".")[1] ? steps[9].value.split(".")[1] : 0
          } inch`,
        trigger: "13",
      },
      {
        id: "12",
        message: ({ steps }) =>
          `Your height is  ${steps[10].value} Centimetres`,
        trigger: "13",
      },
      {
        id: "13",
        message: ({ steps }) => `Please select metric to enter weight ?`,
        trigger: "14",
      },
      {
        id: "14",
        options: [
          { value: 1, label: "Kgs", trigger: "15" },
          { value: 2, label: "Lbs", trigger: "16" },
        ],
      },
      {
        id: "15",
        message: ({ steps }) => `Enter you weight in Kgs`,
        trigger: "17",
      },
      {
        id: "17",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "19",
        validator: (value) => {
          if (isNaN(value)) {
            return "Your weight should fall between 50-150 Kgs";
          } else if (value < 50 || value > 150)
            return "Your weight should fall between 50-150 Kgs";
          else {
            return true;
          }
        },
      },
      {
        id: "19",
        message: ({ steps }) => `Your weight is  ${steps[17].value} `,
        trigger: "20",
      },
      {
        id: "19h",
        message: ({ steps }) => `Your weight is  ${steps[18].value} `,
        trigger: "20",
      },
      {
        id: "16",
        message: ({ steps }) => `Enter you weight in Lbs`,
        trigger: "18",
      },
      {
        id: "18",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "19h",
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
        id: "20",
        message: ({ steps }) => `Pick your nearest daily routine`,
        trigger: "21",
      },
      {
        id: "21",
        options: [
          {
            value: 1,
            label: "Sedentary (little /no exercise & desk job)",
            trigger: "22",
          },
          {
            value: 2,
            label: "Lightly Active (light exercise 1-3 days / week)",
            trigger: "22",
          },
          {
            value: 3,
            label: "Moderately Active (moderate exercise 3-5 days / week)",
            trigger: "22",
          },
          {
            value: 4,
            label: "Very Active (heavy exercise 6-7 days / week) ",
            trigger: "22",
          },
          {
            value: 5,
            label:
              "Extremely Active (very heavy exercise, hard labour job, training 2x / day)",
            trigger: "22",
          },
        ],
      },
      {
        id: "22",
        message: ({ steps }) => `What is your life style status?`,
        trigger: "23",
      },
      {
        id: "23",
        options: [
          { value: 1, label: "Working", trigger: "24" },
          { value: 2, label: "Student", trigger: "24" },
          { value: 3, label: "Retired", trigger: "24" },
          { value: 4, label: "House-wife", trigger: "24" },
          { value: 5, label: "Sabbatical", trigger: "24" },
        ],
      },
      {
        id: "24",
        message: ({ steps }) => `Name any known food allergy?`,
        trigger: "25",
      },
      {
        id: "25",
        options: [
          { value: 1, label: "Yes", trigger: "26" },
          { value: 2, label: "None", trigger: "28" },
        ],
      },
      {
        id: "26",
        message: ({ steps }) => `Please Enter you food allergy`,
        trigger: "27",
      },
      {
        id: "27",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "28",
        validator: (value) => {
          if (!value) return "Please try again!";
          else {
            return true;
          }
        },
      },
      {
        id: "28",
        message: ({ steps }) => `Choose your food preferences?`,
        trigger: "29",
      },
      {
        id: "29",
        options: [
          { value: 1, label: "Vegeterian", trigger: "33" },
          { value: 2, label: "Veg with Eggs", trigger: "30" },
          { value: 2, label: "Non-Veg", trigger: "30" },
        ],
      },
      {
        id: "30",
        message: ({ steps }) => `Eggs / Non Veg allowed Days ? `,
        trigger: "31",
      },
      {
        id: "31",
        options: [
          { value: 1, label: "All Days", trigger: "33" },
          { value: 2, label: "Specific Days", trigger: "32" },
        ],
      },
      {
        id: "32",
        component: <NonVegcheckBox />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "33",
        message: ({ steps }) => `Choose your fasting days?`,
        trigger: "34",
      },
      {
        id: "34",
        options: [
          { value: 1, label: "None", trigger: "36" },
          { value: 2, label: "Pick fixed fasting Day", trigger: "35" },
        ],
      },
      {
        id: "35",
        component: <FastingVegcheckBox />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "36",
        message: `What is your Email id?`,
        trigger: "41",
      },
      {
        id: "41",
        user: true,
        inputAttributes: {
          keyboardType: "email-address",
        },
        validator: (value) => {
          var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (!value.match(mailformat))
            return "Please enter valid email address";
          else {
            email = value;
            sendEmailOtp();
            return true;
          }
        },
        trigger: "41h",
      },
      {
        id: "41h",
        message: ({ steps }) => {
          return `Enter the OTP from your email`;
        },
        trigger: "41top",
      },
      {
        id: "41top",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "42",
        validator: (value) => {
          if (value == emailOtop) return true;
          else {
            return "Email OTP is Invalid";
          }
        },
      },
      {
        id: "42",
        message: ({ steps }) => {
          return `Superb! I have edited your medical history profile`;
        },
        trigger: "42h",
      },
      {
        id: "42h",
        component: <TermandCondition />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "43",
        message: `Thanks, let me take a look for you...`,
        end: true,
      },
    ];
  } else {
    steps = [
      {
        id: "0",
        message: `Hi! Do you wish to make changes to your existing medical history profile?.`,
        trigger: "3skip",
      },
      {
        id: "3skip",
        options: [
          { value: 1, label: "Yes, I want to.", trigger: "1h" },
          { value: 2, label: "No, I am good.", trigger: "43" },
        ],
      },
      {
        id: "1h",
        message: `What is your Name ?`,
        trigger: "1",
      },
      {
        id: "1",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "2",
        validator: (value) => {
          var nameformate = /^[a-zA-Z ]+$/;
          if (!value.match(nameformate))
            return "Letters and spaces only please";
          else {
            setName(value);
            pname = value;
            return true;
          }
        },
      },
      {
        id: "2",
        message: `What is your Age ?`,
        trigger: "3",
      },
      {
        id: "3",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "4",
        validator: (number) => {
          if (isNaN(number)) {
            return "Your age should fall between 16-75.";
          } else if (number < 16 || number > 75) {
            return "Your age should fall between 16-75.";
          } else {
            setAge(number);
            return true;
          }
        },
      },
      {
        id: "4",
        trigger: "5",
        message: `What is Your gender ?`,
      },
      {
        id: "5",
        options: [
          { value: 1, label: "Male", trigger: "6" },
          { value: 2, label: "Female", trigger: "6" },
        ],
      },
      {
        id: "6",
        message: ({ steps }) => `Great start! Just few more questions😃`,
        trigger: "7",
      },
      {
        id: "7",
        message: ({ steps }) =>
          `Choose metric from below to enter your height?`,
        trigger: "8",
      },
      {
        id: "8",
        options: [
          { value: 1, label: "Feet.inch", trigger: "9h" },
          { value: 2, label: "Centimetres", trigger: "10h" },
        ],
      },
      {
        id: "9h",
        message: ({ steps }) => `Enter your height in Feet.inch`,
        trigger: "9",
      },
      {
        id: "9",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "11",
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
        id: "10h",
        message: ({ steps }) => `Enter your height in Centimetres`,
        trigger: "10",
      },
      {
        id: "10",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "12",
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
        id: "11",
        message: ({ steps }) =>
          `Your height is  ${steps[9].value.split(".")[0]} feet and ${
            steps[9].value.split(".")[1] == undefined
              ? steps[9].value.split(".")[1]
              : 0
          } inch`,
        trigger: "13",
      },
      {
        id: "12",
        message: ({ steps }) =>
          `Your height is  ${steps[10].value} Centimetres`,
        trigger: "13",
      },
      {
        id: "13",
        message: ({ steps }) => `Please select metric to enter weight ?`,
        trigger: "14",
      },
      {
        id: "14",
        options: [
          { value: 1, label: "Kgs", trigger: "15" },
          { value: 2, label: "Lbs", trigger: "16" },
        ],
      },
      {
        id: "15",
        message: ({ steps }) => `Enter you weight in Kgs`,
        trigger: "17",
      },
      {
        id: "17",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "19",
        validator: (value) => {
          if (isNaN(value)) {
            return "Your weight should fall between 50-150 Kgs";
          } else if (value < 50 || value > 150)
            return "Your weight should fall between 50-150 Kgs";
          else {
            return true;
          }
        },
      },
      {
        id: "19",
        message: ({ steps }) => `Your weight is  ${steps[17].value} `,
        trigger: "20",
      },
      {
        id: "19h",
        message: ({ steps }) => `Your weight is  ${steps[18].value} `,
        trigger: "20",
      },
      {
        id: "16",
        message: ({ steps }) => `Enter you weight in Lbs`,
        trigger: "18",
      },
      {
        id: "18",
        user: true,
        inputAttributes: {
          keyboardType: "numeric",
        },
        trigger: "19h",
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
        id: "20",
        message: ({ steps }) => `Pick your nearest daily routine`,
        trigger: "21",
      },
      {
        id: "21",
        options: [
          {
            value: 1,
            label: "Sedentary (little /no exercise & desk job)",
            trigger: "22",
          },
          {
            value: 2,
            label: "Lightly Active (light exercise 1-3 days / week)",
            trigger: "22",
          },
          {
            value: 3,
            label: "Moderately Active (moderate exercise 3-5 days / week)",
            trigger: "22",
          },
          {
            value: 4,
            label: "Very Active (heavy exercise 6-7 days / week) ",
            trigger: "22",
          },
          {
            value: 5,
            label:
              "Extremely Active (very heavy exercise, hard labour job, training 2x / day)",
            trigger: "22",
          },
        ],
      },
      {
        id: "22",
        message: ({ steps }) => `What is your life style status?`,
        trigger: "23",
      },
      {
        id: "23",
        options: [
          { value: 1, label: "Working", trigger: "24" },
          { value: 2, label: "Student", trigger: "24" },
          { value: 3, label: "Retired", trigger: "24" },
          { value: 4, label: "House-wife", trigger: "24" },
          { value: 5, label: "Sabbatical", trigger: "24" },
        ],
      },
      {
        id: "24",
        message: ({ steps }) => `Name any known food allergy?`,
        trigger: "25",
      },
      {
        id: "25",
        options: [
          { value: 1, label: "Yes", trigger: "26" },
          { value: 2, label: "None", trigger: "28" },
        ],
      },
      {
        id: "26",
        message: ({ steps }) => `Please Enter you food allergy`,
        trigger: "27",
      },
      {
        id: "27",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "28",
        validator: (value) => {
          if (!value) return "Please try again!";
          else {
            return true;
          }
        },
      },
      {
        id: "28",
        message: ({ steps }) => `Choose your food preferences?`,
        trigger: "29",
      },
      {
        id: "29",
        options: [
          { value: 1, label: "Vegeterian", trigger: "33" },
          { value: 2, label: "Veg with Eggs", trigger: "30" },
          { value: 2, label: "Non-Veg", trigger: "30" },
        ],
      },
      {
        id: "30",
        message: ({ steps }) => `Eggs / Non Veg allowed Days ? `,
        trigger: "31",
      },
      {
        id: "31",
        options: [
          { value: 1, label: "All Days", trigger: "33" },
          { value: 2, label: "Specific Days", trigger: "32" },
        ],
      },
      {
        id: "32",
        component: <NonVegcheckBox />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "33",
        message: ({ steps }) => `Choose your fasting days?`,
        trigger: "34",
      },
      {
        id: "34",
        options: [
          { value: 1, label: "None", trigger: "36" },
          { value: 2, label: "Pick fixed fasting Day", trigger: "35" },
        ],
      },
      {
        id: "35",
        component: <FastingVegcheckBox />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "36",
        message: `Select any known disorder you may have?`,
        trigger: "37",
      },
      {
        id: "37",
        component: <Disorder />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "38",
        message: `Select any known minor aliment you may have?`,
        trigger: "39",
      },
      {
        id: "39",
        component: <MainerAliment />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "40",
        message: `What is your Email id?`,
        trigger: "41",
      },
      {
        id: "41",
        user: true,
        inputAttributes: {
          keyboardType: "email-address",
        },
        validator: (value) => {
          var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          if (!value.match(mailformat))
            return "Please enter valid email address";
          else {
            email = value;
            return true;
          }
        },
        trigger: "41h",
      },
      {
        id: "41h",
        message: ({ steps }) => {
          sendEmailOtp();
          return `Enter the OTP from your email`;
        },
        trigger: "41top",
      },
      {
        id: "41top",
        user: true,
        inputAttributes: {
          keyboardType: "default",
        },
        trigger: "42",
        validator: (value) => {
          if (value == emailOtop) return true;
          else {
            return "Email OTP is Invalid";
          }
        },
      },
      {
        id: "42",
        message: ({ steps }) => {
          return `Superb! I have edited your medical history profile`;
        },
        trigger: "42h",
      },
      {
        id: "42h",
        component: <TermandCondition />,
        replace: false,
        waitAction: false,
        asMessage: true,
      },
      {
        id: "43",
        message: `Thanks, let me take a look for you...`,
        end: true,
      },
    ];
  }
  const theme = {
    background: "#f5f8fb",
    fontFamily: "Helvetica Neue",
    headerBgColor: "#EF6C00",
    headerFontColor: "#fff",
    headerFontSize: "15px",
    botBubbleColor: "#EF6C00",
    botFontColor: "#fff",
    userBubbleColor: "#fff",
    userFontColor: "#4a4a4a",
  };
  useEffect(() => {
    //getMyOrder();
  }, [refresh]);
  return (
    <ChatBot
      steps={steps}
      headerComponent={<Header chatLogo backButtonwithtext />}
      botFontColor={"#000"}
      userBubbleStyle={{ width: width - 90 }}
      bubbleStyle={{ width: width - 90 }}
      botBubbleColor={"#F9D1D1"}
      optionElementStyle={{ backgroundColor: "#F79489", color: "#000" }}
      userBubbleColor={"#0B1354"}
      userFontColor={"#fff"}
      botAvatar={
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABXAAAAWqCAYAAABWKkjnAAAACXBIWXMAAC4jAAAuIwF4pT92AAAgAElEQVR4nOzd+ZvUVYLn+/knbk31OEvfmb7dPXfm3q6a6ro9bVW11eVWltZiLdpViHstWioiIiKbuwiCbMmq4C6CKOACyqagQibuu4gLAgm5gWCyRG7nPpEUKJJLZGZEnJMRr9fzfH5PTwTfH97PMb7/LoTwt+YMfAd8B3wHfAd8B3wHfAd8B3wHfAd8B3wHfAd8B3wHfAd8B3wHfAdCamfwV/8uAAAAAACQooUCLgAAAABAmgRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRcAAAAAIBECbgAAAAAAIkScAEAAAAAEiXgAgAAAAAkSsAFAAAAAEiUgAsAAAAAkCgBFwAAAAAgUQIuAAAAAECiBFwAAAAAgEQJuAAAAAAAiRJwAQAAAAASJeACAAAAACRKwAUAAAAASJSACwAAAACQKAEXAAAAACBRAi4AAAAAQKIEXAAAAACARAm4AAAAAACJEnABAAAAABIl4AIAAAAAJErABQAAAABIlIALAAAAAJAoARcAAAAAIFECLgAAAABAogRc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F/WyJt5m/E2OB8Wyg7J72a6Qafre8+R42haAHyLgAgDM49xb89HTZ9Zlg75O+tSnj0x48fKxLSuKdTTKfIxkdb8GIatiLAm4M3bzIrO6/IwfODTCL0LX9aMtVPbgmOmvdntxOHTxC2e8fceCePueHPeLZCfOaH89v4Pxe8+d42lbAH6OgAsAMItzb20QPX1oieti6h5v94Vq4C77htu/xKS4jkVwvnwsbQrHInh7MD48zprjE5wLXDPL+BOt3rK96UNUmtfSeITyWOzKaaQntxP5K84/OK5ssybepjvjbYEtr2vF0yu6Wdjd+L1n9XjaFgBcCLgAALMK5qQYj37MR65Bj43adHBInaLO0oTPbHdkwssvH9v5RbHywwuMR0dm3TVYsyLeknjr3G+mTdS6+L7G46jdtyNtkErz2hoPUR5fzod6fP17v/9rjnXx9j/kuHvE1tezsvyebp0IM3/vWfa07SnTlxQA7IKACwAw58LuE+ajH/OZaxD//VKvPTLhxbEIG9cc15GxxQRTH47G/VevtSzgul5klhptPJDaed8kh6o0v6PxIGVyDy4u99u/6jgubbAm3qb9WY472fIGjsonunP6U+P3XX3G07YA8EYEXACAGZx7az54+tKShm/U2gO9axV0Vu7rq6F7zAZbZzh++eVjpqMi88w1ODImX+98PsnSgLvy4BzjkdSu25zYT6UFgcajlB12//wC5/OZfvVXHsel9Q0Pt654+yc57mTJqzgqde/cXOP3XW3G07YAUCsEXACA53Hurfng6Wv7Yf+cWh+Z0CIuzUi0bbEh03UswndLjysvkmjqj9H4q+UHLY23zo37lheZVfezvimht0oLehiPU3banZJxclQ+9Yu/9jguxloTb1P/IMetFHmrh1c36tqRD4zfe9WNp20BoE4IuAAAz+PcW/PB05eWPHmDVu8Lqt2RCas9d2TCX9emVr18LGMyxyKYjqd22KA1sZYH3E++mGb8SVe7LTa+p64W9jEeqOy42yeHyVHxwKf/6uO4uM6iePt7OW56/4vgHt/Yq2s5Hxu/95zjaVsAqDcCLgDAszj31nzw9LV9nzjRFkcm/OuK5y8fmxlX4DoWoWCE+WDI7HMNckfn6/czp1gecJ3bmFi3l/f58mIOBOtq0QDjocrOu1nUSxVlpT751x/r4u27clz/Ub6i7F62So8GGLvn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AAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJCUgAsAAAAAkJSACwAAAACQlIALAAAAAJA54P4f4x3YATtgB+yAHbADdsAO2AE7YAfsgB2wA3bADtgBO2AHIts7+Iv/D721ldr+NN+QAAAAAElFTkSuQmCC"
      }
      handleEnd={() => {
        getNavicuratedPro();
      }}
    />
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
  },

  checkbox: { transform: [{ scale: 0.8 }] },
});
export default EditChatbotNutritionScreen;
