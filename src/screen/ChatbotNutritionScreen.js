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
  TextInput,
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
import ProcessingModal from "../component/ProcessingModal.js";
import { chatBotPImage } from "../static/constant.js";

//arrow-right
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
var width = Dimensions.get("window").width; //full width
const ChatbotNutritionScreen = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState("Notification");
  const [titleText, setTitleText] = useState(null);
  const [name, setName] = useState();
  const [age, setAge] = useState();
  const [itemText, setItemText] = useState([]);
  const [notification, setNotification] = useState([]);
  const win = Dimensions.get("window");
  const [refresh, setRefresh] = useState(false);
  const [isSelected, setSelection] = useState([]);
  const [chatNutrintion, setChatNutrintion] = useState([]);
  const [fastingSelect, setFastingSelect] = useState([]);
  const [category, setCategory] = useState([]);
  const [minserCheck, setMnerAliment] = useState([]);
  const [waitvalue, setWailValue] = useState();
  const [gender, setGender] = useState();
  const [heightstatndard, setHeightstatndard] = useState();
  const [height, setHeight] = useState();
  const [disorderarr, setDisorderarr] = useState([]);
  const [dailyactivity, setDailyactivity] = useState();
  const [lifstyStatus, setLifstyStatus] = useState();
  const [termndCondition, setTermndCondition] = useState(false);
  const [allergystatus, setAllergystatus] = useState([]);
  const [allergy, setAllergy] = useState([]);
  const [weightstandrad, setWeightstandrad] = useState([]);
  const [weight, setWeight] = useState([]);
  const [foodfrefrence, setFoodfrefrence] = useState([]);
  const [fastingstatus, setFastingstatus] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  var width = Dimensions.get("window").width; //full width
  let ailment = [];
  let email = "";
  let emailOtop = "971110";
  let fastingbutton = false;
  let minorallimentbtn = false;
  let noneVegbutton = false;
  let miniosord = false;
  //let fastingstatus;
  let customerEmail = "";
  let pgender;
  //let heightstatndard;
  //let weightstandrad;
  //let weight;
  //let height;
  let page = "";
  let pname = "";
  let zippin = "";
  //let allergy;
  //let lifstyStatus;
  //let foodfrefrence;
  let foodFreprencvalue;
  let termandcontion = false;
  //let dailyactivity = '';
  let chekstatus = true;
  let steps = [];

  const getNavicuratedPro = async (renderedSteps, steps, values) => {
    console.log(steps);
    console.log(values);
    console.log(renderedSteps);
    insertDietProfile();
    try {
      if (chatNutrintion.plan_purchase > 0 && chatNutrintion.chatdone == 1) {
        navigation.replace("ThanksDiet");
      } else {
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
          EndUrl.gloabalurl + "addtocartbyplanid/" + route.params?.id,
          settingsGet
        );
        const updateAvailable = response.headers.get("updateAvailable");
        const forceUpdate = response.headers.get("forceUpdate");
        if (updateAvailable) {
          await AsyncStorage.setItem("updateAvailable", "true");
        }
        if (forceUpdate) {
          await AsyncStorage.setItem("forceUpdate", "true");
        }
        const json = await response.json();
        navigation.replace("Cart");
      }
    } catch (error) {}
  };

  const getNavicuratedPro1 = async () => {
    //insertBodyProfile();
    // EndUrl.insertbodyprofile
    // setTimeout(function () {
    //   navigation.navigate("TabNavigators", {
    //     screen: "Body Matched",
    //   });
    // }, 1000);
    insertDietProfile();
  };

  let weekDAyarry = [
    {
      id: 1,
      label: "Monday",
    },
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
    chekstatus = false;
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
      <View style={{ width: width * 0.7 }}>
        <FlatList
          style={{
            width: "100%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
          // numColumns={2}
          data={disorderr}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  // width: "auto",
                  flex: 1,
                  marginLeft: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  tintColors={{ true: "#132742" }}
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
          containerStyle={{ width: "100%" }}
        />
      </View>
    );
  };

  const EnterAge = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.7 }}>
        <TextInput maxLength={99} />

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

  const insertDietProfile = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    var postpayload = {
      name: name,
      age: age,
      gender: gender,
      // height_type: heightstatndard,
      height_standard: heightstatndard,
      height: height,
      // weight_type: weightstandrad,
      weight_standard: weightstandrad,
      weight: weight,
      daily_activity: dailyactivity,
      life_style_status: lifstyStatus,
      food_allergy: allergy,
      food_preference: foodfrefrence,
      food_preference_value: isSelected.toString(),
      fasting_day_status: fastingstatus,
      fasting_day_value: fastingSelect.toLocaleString(),
      active_plan: route.params?.id,
      known_disease: disorderarr.toString(),
      minor_aliment: minserCheck.toString(),
    };
    console.log(postpayload, "thkspostpayload");
    // return;
    try {
      const response = await fetch(EndUrl.medicalhistory, {
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
        setShowSuccess(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate("UploadReport");
        }, 1500);
        // setTimeout(function () {
        //   navigation.navigate("TabNavigators", {
        //     screen: "Offerings Page",
        //   });
        // }, 1300);
      }
    } catch (error) {
      console.error(error);
      console.log("line no 314");
    } finally {
      setLoading(false);
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
          // numColumns={2}
          data={ailment}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  // width: "auto",
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  tintColors={{ true: "#132742" }}
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
          onPress={() => NextTrigger("minorOrd", 41, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "100%" }}
        />
      </View>
    );
  };

  useEffect(() => {
    minorailment();
    getMyOrder();
    getdisorderApi();
  }, [refresh]);

  const TermandCondition = ({ triggerNextStep }) => {
    return (
      <View
        style={{
          width: width * 0.7,
          flexDirection: "row",
          alignSelf: "flex-start",
        }}
      >
        <View style={{ width: 30 }}>
          <CheckBox
            style={styles.checkbox}
            tintColors={{ true: "#132742" }}
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
          {chatNutrintion.plan_purchase > 0 && chatNutrintion.chatdone == 1 ? (
            // <Button
            //   disabled={chekstatus}
            //   color="#F79489"
            //   onPress={() => triggerNextStep({ trigger: "43" })}
            //   title={"Accept terms & conditions"}
            // />
            <ButtonCustom
              disabled={chekstatus}
              onPress={() => triggerNextStep({ trigger: "43" })}
              title={"Accept terms & conditions"}
            />
          ) : (
            // <Button
            //   disabled={chekstatus}
            //   color="#F79489"
            //   onPress={() => triggerNextStep({ trigger: "43" })}
            //   title={"Review cart and pay"}
            // />
            <ButtonCustom
              disabled={chekstatus}
              onPress={() => triggerNextStep({ trigger: "43" })}
              title={"Review cart and pay"}
            />
          )}
        </View>
        <View></View>
      </View>
    );
  };

  const NonVegcheckBox = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.53 }}>
        <FlatList
          style={{
            width: "100%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
          // numColumns={2}
          data={weekDAyarry}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  // width: 100,
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  tintColors={{ true: "#132742" }}
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
        <ButtonCustom
          color="#F79489"
          disabled={noneVegbutton}
          onPress={() => NextTrigger("noneVeg", 33, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "100%" }}
        />
      </View>
    );
  };
  const FastingVegcheckBox = ({ triggerNextStep }) => {
    return (
      <View style={{ width: width * 0.53 }}>
        <FlatList
          style={{
            // width: "90%",
            paddingTop: 1,
            marginTop: 1,
            marginLeft: 1,
          }}
          // numColumns={2}
          data={weekDAyarry}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View
                style={{
                  // width: 100,
                  flex: 1,
                  marginLeft: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <CheckBox
                  tintColors={{ true: "#132742" }}
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
        <ButtonCustom
          color="#F79489"
          disabled={fastingbutton}
          onPress={() => NextTrigger("fasting", 36, triggerNextStep)}
          title={"Next"}
          containerStyle={{ width: "100%" }}
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

        const response = await fetch(
          EndUrl.gloabalurl + "checknutritionplan",
          settingsGet
        );
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
        setChatNutrintion(json.data);
        setRefresh(!refresh);
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    }
  };
  // if (route.params?.id == 8) {
  steps = [
    {
      id: "0",
      message: `Hi!, I shall ask you some questions to build your medical profile.`,
      trigger: "3skip",
    },
    {
      id: "3skip",
      options: [
        { value: 1, label: "Proceed", trigger: "1h" },
        { value: 2, label: "Skip", trigger: "44" },
      ],
    },
    {
      id: "1h",
      message: `Sounds Good!`,
      trigger: "2",
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
          return "Your age should fall between 16-99.";
        } else if (number < 16 || number > 99) {
          return "Your age should fall between 16-99.";
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
        {
          value: "Male",
          label: "Male",
          trigger: ({ steps }) => {
            setGender("Male");
            return 6;
          },
        },
        {
          value: "Female",
          label: "Female",
          trigger: ({ steps }) => {
            setGender("Male");
            return 6;
          },
        },
      ],
    },
    {
      id: "6",
      message: ({ steps, previousValue }) => `Great start! 😃`,
      trigger: "7",
    },
    {
      id: "7",
      message: ({ steps }) => `Choose metric from below to enter your height?`,
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
          setHeight(value);
          setHeightstatndard("Feet.inch");
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
          setHeightstatndard("Centimetres");
          setHeight(value);
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
      message: ({ steps }) => `Your height is  ${steps[10].value} Centimetres`,
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
        {
          value: 1,
          label: "Kgs",
          trigger: () => {
            setWeightstandrad("Kgs");
            return 15;
          },
        },
        {
          value: 2,
          label: "Lbs",
          trigger: () => {
            setWeightstandrad("Lbs");
            return 16;
          },
        },
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
          setWeight(value);
          setWeightstandrad("Kgs");
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
          setWeight(value);
          setWeightstandrad("Lbs");
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
          label: "Sedentary (little to no exercise & desk job)",
          trigger: ({ steps }) => {
            setDailyactivity("Sedentary (little to no exercise & desk job)");
            return 22;
          },
        },
        {
          value: 2,
          label: "Lightly Active (light exercise 1-3 days / week)",
          trigger: ({ steps }) => {
            setDailyactivity("Lightly Active (light exercise 1-3 days / week");
            return 22;
          },
        },
        {
          value: 3,
          label: "Moderately Active (moderate exercise 3-5 days / week)",
          trigger: ({ steps }) => {
            setDailyactivity(
              "Moderately Active (moderate exercise 3-5 days / week)"
            );
            return 22;
          },
        },
        {
          value: 4,
          label: "Very Active (heavy exercise 6-7 days / week)",
          trigger: ({ steps }) => {
            setDailyactivity("Very Active (heavy exercise 6-7 days / week)");
            return 22;
          },
        },
        {
          value: 5,
          label:
            "Extremely Active (very heavy exercise, hard labour job, training 2x / day)",
          trigger: ({ steps }) => {
            setDailyactivity(
              "Extremely Active (very heavy exercise, hard labour job, training 2x / day)"
            );
            return 22;
          },
        },
      ],
    },
    {
      id: "22",
      message: ({ steps }) => "What is your life style status?",
      trigger: "23",
    },
    {
      id: "23",
      options: [
        {
          value: 1,
          label: "Working",
          trigger: ({ steps }) => {
            setLifstyStatus("Working");
            return 24;
          },
        },
        {
          value: 2,
          label: "Student",
          trigger: ({ steps }) => {
            setLifstyStatus("Student");
            return 24;
          },
        },
        {
          value: 3,
          label: "Retired",
          trigger: ({ steps }) => {
            setLifstyStatus("Retired");
            return 24;
          },
        },
        {
          value: 4,
          label: "House-wife",
          trigger: ({ steps }) => {
            setLifstyStatus("House-wife");
            return 24;
          },
        },
        {
          value: 5,
          label: "Sabbatical",
          trigger: ({ steps }) => {
            setLifstyStatus("Sabbatical");
            return 24;
          },
        },
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
        {
          value: 1,
          label: "Yes",
          trigger: ({ steps }) => {
            setAllergystatus("Yes");
            return 26;
          },
        },
        {
          value: 2,
          label: "None",
          trigger: ({ steps }) => {
            setAllergystatus("None");
            return 28;
          },
        },
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
          setAllergy(value);
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
        {
          value: 1,
          label: "Vegeterian",
          trigger: () => {
            setFoodfrefrence("Vegeterian");
            return 33;
          },
        },
        {
          value: 2,
          label: "Veg with Eggs",
          trigger: () => {
            setFoodfrefrence("Veg with Eggs");
            return 30;
          },
        },
        {
          value: 2,
          label: "Non-Veg",
          trigger: () => {
            setFoodfrefrence("Non-Veg");
            return 30;
          },
        },
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
        {
          value: 1,
          label: "None",
          trigger: () => {
            setFastingstatus("None");
            return 36;
          },
        },
        {
          value: 2,
          label: "Pick fixed fasting Day",
          trigger: () => {
            setFastingstatus("Pick fixed fasting Day");
            return 35;
          },
        },
      ],
    },
    {
      id: "35",
      component: <FastingVegcheckBox />,
      replace: false,
      waitAction: false,
      asMessage: true,
    },
    // {
    //   id: "36",
    //   message: `What is your Email id?`,
    //   trigger: "41",
    // },
    // {
    //   id: "41",
    //   user: true,
    //   inputAttributes: {
    //     keyboardType: "email-address",
    //   },
    //   validator: (value) => {
    //     var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    //     if (!value.match(mailformat))
    //       return "Please enter valid email address";
    //     else {
    //       email = value;
    //       sendEmailOtp();

    //       return true;
    //     }
    //   },
    //   trigger: "41h",
    // },
    // {
    //   id: "41h",
    //   message: ({ steps }) => {
    //     return `Enter the OTP from your email`;
    //   },
    //   trigger: "41top",
    // },

    // {
    //   id: "41top",
    //   user: true,
    //   inputAttributes: {
    //     keyboardType: "default",
    //   },
    //   trigger: "42",
    //   validator: (value) => {
    //     if (value == emailOtop) return true;
    //     else {
    //       return "Email OTP is Invalid";
    //     }
    //   },
    // },
    {
      id: "36",
      message: ({ steps }) => {
        return `Choose any known disorder from the following?`;
      },
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
      message: `Any known minor ailment?`,
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
      id: "41",
      message: ({ steps }) => {
        return `Superb! I have created your medical profile and customer profile`;
      },
      trigger: "43",
    },
    // {
    //   id: "42h",
    //   component: <TermandCondition />,
    //   replace: false,
    //   waitAction: false,
    //   asMessage: true,
    // },
    {
      id: "43",
      message: `Thanks, let me take a look for you...`,
      end: true,
    },
    {
      id: "44",
      message: "Thanks",
      end: true,
    },
  ];
  // } else {
  //   steps = [
  //     {
  //       id: "0",
  //       message: `Hi! I'll help you to create your medical history.`,
  //       trigger: "1h",
  //     },
  //     {
  //       id: "1h",
  //       message: `What is your Name ?`,
  //       trigger: "1",
  //     },
  //     {
  //       id: "1",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "default",
  //       },
  //       trigger: "2",
  //       validator: (value) => {
  //         var nameformate = /^[a-zA-Z ]+$/;
  //         if (!value.match(nameformate))
  //           return "Letters and spaces only please";
  //         else {
  //           setName(value);
  //           pname = value;
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "2",
  //       message: `What is your Age ?`,
  //       trigger: "3",
  //     },
  //     {
  //       id: "3",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "numeric",
  //       },
  //       trigger: "4",
  //       validator: (number) => {
  //         if (isNaN(number)) {
  //           return "Your age should fall between 16-75.";
  //         } else if (number < 16 || number > 75) {
  //           return "Your age should fall between 16-75.";
  //         } else {
  //           setAge(number);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "4",
  //       trigger: "5",
  //       message: `What is Your gender ?`,
  //     },
  //     {
  //       id: "5",
  //       options: [
  //         {
  //           value: "Male",
  //           label: "Male",
  //           trigger: ({ steps }) => {
  //             setGender("Male");
  //             return 6;
  //           },
  //         },
  //         {
  //           value: "Female",
  //           label: "Female",
  //           trigger: ({ steps }) => {
  //             setGender("Female");
  //             return 6;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "6",
  //       message: ({ steps }) => `Great start! Just few more questions😃`,
  //       trigger: "7",
  //     },
  //     {
  //       id: "7",
  //       message: ({ steps }) =>
  //         `Choose metric from below to enter your height?`,
  //       trigger: "8",
  //     },
  //     {
  //       id: "8",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Feet.inch",
  //           trigger: () => {
  //             setHeightstatndard("Feet.inch");
  //             return "9h";
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Centimetres",
  //           trigger: () => {
  //             setHeightstatndard("Centimetres");
  //             return "10h";
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "9h",
  //       message: ({ steps }) => `Enter your height in Feet.inch`,
  //       trigger: "9",
  //     },
  //     {
  //       id: "9",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "numeric",
  //       },
  //       trigger: "11",
  //       validator: (value) => {
  //         var numfromate = /^-?\d+\.?\d*$/;
  //         if (!value.match(numfromate)) {
  //           return "Your height should fall between 4.5-7 feet";
  //         } else if (value < 4.5 || value > 7) {
  //           return "Your height should fall between 4.5-7 feet";
  //         } else {
  //           setHeight(value);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "10h",
  //       message: ({ steps }) => `Enter your height in Centimetres`,
  //       trigger: "10",
  //     },
  //     {
  //       id: "10",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "numeric",
  //       },
  //       trigger: "12",
  //       validator: (value) => {
  //         var numfromate = /^-?\d+\.?\d*$/;
  //         if (!value.match(numfromate)) {
  //           return "Your height should fall between 140-215 CMS";
  //         } else if (value < 140 || value > 215)
  //           return "Your height should fall between 140-215 CMS";
  //         else {
  //           setHeight(value);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "11",
  //       message: ({ steps }) =>
  //         `Your height is  ${steps[9].value.split(".")[0]} feet and ${
  //           steps[9].value.split(".")[1] ? steps[9].value.split(".")[1] : 0
  //         } inch`,
  //       trigger: "13",
  //     },
  //     {
  //       id: "12",
  //       message: ({ steps }) =>
  //         `Your height is  ${steps[10].value} Centimetres`,
  //       trigger: "13",
  //     },
  //     {
  //       id: "13",
  //       message: ({ steps }) => `Please select metric to enter weight ?`,
  //       trigger: "14",
  //     },
  //     {
  //       id: "14",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Kgs",
  //           trigger: () => {
  //             setWeightstandrad("Kgs");
  //             return 15;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Lbs",
  //           trigger: () => {
  //             setWeightstandrad("Lbs");
  //             return 16;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "15",
  //       message: ({ steps }) => `Enter you weight in Kgs`,
  //       trigger: "17",
  //     },
  //     {
  //       id: "17",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "numeric",
  //       },
  //       trigger: "19",
  //       validator: (value) => {
  //         if (isNaN(value)) {
  //           return "Your weight should fall between 50-150 Kgs";
  //         } else if (value < 50 || value > 150)
  //           return "Your weight should fall between 50-150 Kgs";
  //         else {
  //           setWeight(value);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "19",
  //       message: ({ steps }) => `Your weight is  ${steps[17].value} `,
  //       trigger: "20",
  //     },
  //     {
  //       id: "19h",
  //       message: ({ steps }) => `Your weight is  ${steps[18].value} `,
  //       trigger: "20",
  //     },
  //     {
  //       id: "16",
  //       message: ({ steps }) => `Enter you weight in Lbs`,
  //       trigger: "18",
  //     },
  //     {
  //       id: "18",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "numeric",
  //       },
  //       trigger: "19h",
  //       validator: (value) => {
  //         if (isNaN(value)) {
  //           return "Your weight should fall between 110-242 LBS";
  //         } else if (value < 110 || value > 242)
  //           return "Your weight should fall between 110-242 LBS";
  //         else {
  //           setWeight(value);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "20",
  //       message: ({ steps }) => `Pick your nearest daily routine`,
  //       trigger: "21",
  //     },
  //     {
  //       id: "21",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Sedentary (little /no exercise & desk job)",
  //           trigger: ({ steps }) => {
  //             setDailyactivity("Sedentary (little /no exercise & desk job)");
  //             return 22;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Lightly Active (light exercise 1-3 days / week)",
  //           trigger: ({ steps }) => {
  //             setDailyactivity(
  //               "Lightly Active (light exercise 1-3 days / week"
  //             );
  //             return 22;
  //           },
  //         },
  //         {
  //           value: 3,
  //           label: "Moderately Active (moderate exercise 3-5 days / week)",
  //           trigger: ({ steps }) => {
  //             setDailyactivity(
  //               "Moderately Active (moderate exercise 3-5 days / week)"
  //             );
  //             return 22;
  //           },
  //         },
  //         {
  //           value: 4,
  //           label: "Very Active (heavy exercise 6-7 days / week)",
  //           trigger: ({ steps }) => {
  //             setDailyactivity("Very Active (heavy exercise 6-7 days / week)");
  //             return 22;
  //           },
  //         },
  //         {
  //           value: 5,
  //           label:
  //             "Extremely Active (very heavy exercise, hard labour job, training 2x / day)",
  //           trigger: ({ steps }) => {
  //             setDailyactivity(
  //               "Extremely Active (very heavy exercise, hard labour job, training 2x / day)"
  //             );
  //             return 22;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "22",
  //       message: ({ steps }) => `What is your life style status?`,
  //       trigger: "23",
  //     },
  //     {
  //       id: "23",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Working",
  //           trigger: ({ steps }) => {
  //             setLifstyStatus("Working");
  //             return 24;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Student",
  //           trigger: ({ steps }) => {
  //             setLifstyStatus("Student");
  //             return 24;
  //           },
  //         },
  //         {
  //           value: 3,
  //           label: "Retired",
  //           trigger: ({ steps }) => {
  //             setLifstyStatus("Retired");
  //             return 24;
  //           },
  //         },
  //         {
  //           value: 4,
  //           label: "House-wife",
  //           trigger: ({ steps }) => {
  //             setLifstyStatus("House-wife");
  //             return 24;
  //           },
  //         },
  //         {
  //           value: 5,
  //           label: "Sabbatical",
  //           trigger: ({ steps }) => {
  //             setLifstyStatus("Sabbatical");
  //             return 24;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "24",
  //       message: ({ steps }) => `Name any known food allergy?`,
  //       trigger: "25",
  //     },
  //     {
  //       id: "25",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Yes",
  //           trigger: ({ steps }) => {
  //             setAllergystatus("Yes");
  //             return 26;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "None",
  //           trigger: ({ steps }) => {
  //             setAllergystatus("None");
  //             return 28;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "26",
  //       message: ({ steps }) => `Please Enter you food allergy`,
  //       trigger: "27",
  //     },
  //     {
  //       id: "27",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "default",
  //       },
  //       trigger: "28",
  //       validator: (value) => {
  //         if (!value) return "Please try again!";
  //         else {
  //           setAllergy(value);
  //           return true;
  //         }
  //       },
  //     },
  //     {
  //       id: "28",
  //       message: ({ steps }) => `Choose your food preferences?`,
  //       trigger: "29",
  //     },
  //     {
  //       id: "29",
  //       options: [
  //         {
  //           value: 1,
  //           label: "Vegeterian",
  //           trigger: () => {
  //             setFoodfrefrence("Vegeterian");
  //             return 33;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Veg with Eggs",
  //           trigger: () => {
  //             setFoodfrefrence("Veg with Eggs");
  //             return 30;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Non-Veg",
  //           trigger: () => {
  //             setFoodfrefrence("Non-Veg");
  //             return 30;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "30",
  //       message: ({ steps }) => `Eggs / Non Veg allowed Days ? `,
  //       trigger: "31",
  //     },
  //     {
  //       id: "31",
  //       options: [
  //         { value: 1, label: "All Days", trigger: "33" },
  //         { value: 2, label: "Specific Days", trigger: "32" },
  //       ],
  //     },
  //     {
  //       id: "32",
  //       component: <NonVegcheckBox />,
  //       replace: false,
  //       waitAction: false,
  //       asMessage: true,
  //     },
  //     {
  //       id: "33",
  //       message: ({ steps }) => `Choose your fasting days?`,
  //       trigger: "34",
  //     },
  //     {
  //       id: "34",
  //       options: [
  //         {
  //           value: 1,
  //           label: "None",
  //           trigger: () => {
  //             setFastingstatus("None");
  //             return 36;
  //           },
  //         },
  //         {
  //           value: 2,
  //           label: "Pick fixed fasting Day",
  //           trigger: () => {
  //             setFastingstatus("Pick fixed fasting Day");
  //             return 35;
  //           },
  //         },
  //       ],
  //     },
  //     {
  //       id: "35",
  //       component: <FastingVegcheckBox />,
  //       replace: false,
  //       waitAction: false,
  //       asMessage: true,
  //     },
  //     {
  //       id: "36",
  //       message: `Select any known disorder you may have?`,
  //       trigger: "37",
  //     },
  //     {
  //       id: "37",
  //       component: <Disorder />,
  //       replace: false,
  //       waitAction: false,
  //       asMessage: true,
  //     },
  //     {
  //       id: "38",
  //       message: `Select any known minor aliment you may have?`,
  //       trigger: "39",
  //     },
  //     {
  //       id: "39",
  //       component: <MainerAliment />,
  //       replace: false,
  //       waitAction: false,
  //       asMessage: true,
  //     },
  //     {
  //       id: "40",
  //       message: `What is your Email id?`,
  //       trigger: "41",
  //     },
  //     {
  //       id: "41",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "email-address",
  //       },
  //       validator: (value) => {
  //         var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //         if (!value.match(mailformat))
  //           return "Please enter valid email address";
  //         else {
  //           email = value;
  //           return true;
  //         }
  //       },
  //       trigger: "41h",
  //     },
  //     {
  //       id: "41h",
  //       message: ({ steps }) => {
  //         sendEmailOtp();
  //         return `Enter the OTP from your email`;
  //       },
  //       trigger: "41top",
  //     },
  //     {
  //       id: "41top",
  //       user: true,
  //       inputAttributes: {
  //         keyboardType: "default",
  //       },
  //       trigger: "42h",
  //       validator: (value) => {
  //         if (value == emailOtop) return true;
  //         else {
  //           return "Email OTP is Invalid";
  //         }
  //       },
  //     },
  //     {
  //       id: "42h",
  //       message: ({ steps }) => {
  //         return `Superb! I have created your medical profile and customer profile`;
  //       },
  //       trigger: "42",
  //     },
  //     {
  //       id: "42",
  //       component: <TermandCondition />,
  //       replace: false,
  //       waitAction: false,
  //       asMessage: true,
  //     },
  //     {
  //       id: "43",
  //       message: `Thanks, let me take a look for you...`,
  //       end: true,
  //     },
  //   ];
  // }

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
  // useEffect(() => {
  //   getMyOrder();
  // }, [refresh]);
  return (
    <>
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
        botAvatar={chatBotPImage}
        handleEnd={() => {
          // Alert.alert("END");
          setModalVisible(true);
          getNavicuratedPro1();
        }}
      />

      <ProcessingModal visible={modalVisible} showSuccess={showSuccess} />
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
  },

  checkbox: { transform: [{ scale: 0.8 }] },
});
export default ChatbotNutritionScreen;

// else {
//     steps = [
//       {
//         id: "0",
//         message: `Hi! I'll help you to create your medical history.`,
//         trigger: "1h",
//       },
//       {
//         id: "1h",
//         message: `What is your Name ?`,
//         trigger: "1",
//       },
//       {
//         id: "1",
//         user: true,
//         inputAttributes: {
//           keyboardType: "default",
//         },
//         trigger: "2",
//         validator: (value) => {
//           var nameformate = /^[a-zA-Z ]+$/;
//           if (!value.match(nameformate))
//             return "Letters and spaces only please";
//           else {
//             setName(value);
//             pname = value;
//             return true;
//           }
//         },
//       },
//       {
//         id: "2",
//         message: `What is your Age ?`,
//         trigger: "3",
//       },
//       {
//         id: "3",
//         user: true,
//         inputAttributes: {
//           keyboardType: "numeric",
//         },
//         trigger: "4",
//         validator: (number) => {
//           if (isNaN(number)) {
//             return "Your age should fall between 16-75.";
//           } else if (number < 16 || number > 75) {
//             return "Your age should fall between 16-75.";
//           } else {
//             setAge(number);
//             return true;
//           }
//         },
//       },
//       {
//         id: "4",
//         trigger: "5",
//         message: `What is Your gender ?`,
//       },
//       {
//         id: "5",
//         options: [
//           {
//             value: "Male",
//             label: "Male",
//             trigger: ({ steps }) => {
//               setGender("Male");
//               return 6;
//             },
//           },
//           {
//             value: "Female",
//             label: "Female",
//             trigger: ({ steps }) => {
//               setGender("Female");
//               return 6;
//             },
//           },
//         ],
//       },
//       {
//         id: "6",
//         message: ({ steps }) => `Great start! Just few more questions😃`,
//         trigger: "7",
//       },
//       {
//         id: "7",
//         message: ({ steps }) =>
//           `Choose metric from below to enter your height?`,
//         trigger: "8",
//       },
//       {
//         id: "8",
//         options: [
//           {
//             value: 1,
//             label: "Feet.inch",
//             trigger: () => {
//               setHeightstatndard("Feet.inch");
//               return "9h";
//             },
//           },
//           {
//             value: 2,
//             label: "Centimetres",
//             trigger: () => {
//               setHeightstatndard("Centimetres");
//               return "10h";
//             },
//           },
//         ],
//       },
//       {
//         id: "9h",
//         message: ({ steps }) => `Enter your height in Feet.inch`,
//         trigger: "9",
//       },
//       {
//         id: "9",
//         user: true,
//         inputAttributes: {
//           keyboardType: "numeric",
//         },
//         trigger: "11",
//         validator: (value) => {
//           var numfromate = /^-?\d+\.?\d*$/;
//           if (!value.match(numfromate)) {
//             return "Your height should fall between 4.5-7 feet";
//           } else if (value < 4.5 || value > 7) {
//             return "Your height should fall between 4.5-7 feet";
//           } else {
//             setHeight(value);
//             return true;
//           }
//         },
//       },
//       {
//         id: "10h",
//         message: ({ steps }) => `Enter your height in Centimetres`,
//         trigger: "10",
//       },
//       {
//         id: "10",
//         user: true,
//         inputAttributes: {
//           keyboardType: "numeric",
//         },
//         trigger: "12",
//         validator: (value) => {
//           var numfromate = /^-?\d+\.?\d*$/;
//           if (!value.match(numfromate)) {
//             return "Your height should fall between 140-215 CMS";
//           } else if (value < 140 || value > 215)
//             return "Your height should fall between 140-215 CMS";
//           else {
//             setHeight(value);
//             return true;
//           }
//         },
//       },
//       {
//         id: "11",
//         message: ({ steps }) =>
//           `Your height is  ${steps[9].value.split(".")[0]} feet and ${
//             steps[9].value.split(".")[1] ? steps[9].value.split(".")[1] : 0
//           } inch`,
//         trigger: "13",
//       },
//       {
//         id: "12",
//         message: ({ steps }) =>
//           `Your height is  ${steps[10].value} Centimetres`,
//         trigger: "13",
//       },
//       {
//         id: "13",
//         message: ({ steps }) => `Please select metric to enter weight ?`,
//         trigger: "14",
//       },
//       {
//         id: "14",
//         options: [
//           {
//             value: 1,
//             label: "Kgs",
//             trigger: () => {
//               setWeightstandrad("Kgs");
//               return 15;
//             },
//           },
//           {
//             value: 2,
//             label: "Lbs",
//             trigger: () => {
//               setWeightstandrad("Lbs");
//               return 16;
//             },
//           },
//         ],
//       },
//       {
//         id: "15",
//         message: ({ steps }) => `Enter you weight in Kgs`,
//         trigger: "17",
//       },
//       {
//         id: "17",
//         user: true,
//         inputAttributes: {
//           keyboardType: "numeric",
//         },
//         trigger: "19",
//         validator: (value) => {
//           if (isNaN(value)) {
//             return "Your weight should fall between 50-150 Kgs";
//           } else if (value < 50 || value > 150)
//             return "Your weight should fall between 50-150 Kgs";
//           else {
//             setWeight(value);
//             return true;
//           }
//         },
//       },
//       {
//         id: "19",
//         message: ({ steps }) => `Your weight is  ${steps[17].value} `,
//         trigger: "20",
//       },
//       {
//         id: "19h",
//         message: ({ steps }) => `Your weight is  ${steps[18].value} `,
//         trigger: "20",
//       },
//       {
//         id: "16",
//         message: ({ steps }) => `Enter you weight in Lbs`,
//         trigger: "18",
//       },
//       {
//         id: "18",
//         user: true,
//         inputAttributes: {
//           keyboardType: "numeric",
//         },
//         trigger: "19h",
//         validator: (value) => {
//           if (isNaN(value)) {
//             return "Your weight should fall between 110-242 LBS";
//           } else if (value < 110 || value > 242)
//             return "Your weight should fall between 110-242 LBS";
//           else {
//             setWeight(value);
//             return true;
//           }
//         },
//       },
//       {
//         id: "20",
//         message: ({ steps }) => `Pick your nearest daily routine`,
//         trigger: "21",
//       },
//       {
//         id: "21",
//         options: [
//           {
//             value: 1,
//             label: "Sedentary (little /no exercise & desk job)",
//             trigger: ({ steps }) => {
//               setDailyactivity("Sedentary (little /no exercise & desk job)");
//               return 22;
//             },
//           },
//           {
//             value: 2,
//             label: "Lightly Active (light exercise 1-3 days / week)",
//             trigger: ({ steps }) => {
//               setDailyactivity(
//                 "Lightly Active (light exercise 1-3 days / week"
//               );
//               return 22;
//             },
//           },
//           {
//             value: 3,
//             label: "Moderately Active (moderate exercise 3-5 days / week)",
//             trigger: ({ steps }) => {
//               setDailyactivity(
//                 "Moderately Active (moderate exercise 3-5 days / week)"
//               );
//               return 22;
//             },
//           },
//           {
//             value: 4,
//             label: "Very Active (heavy exercise 6-7 days / week)",
//             trigger: ({ steps }) => {
//               setDailyactivity("Very Active (heavy exercise 6-7 days / week)");
//               return 22;
//             },
//           },
//           {
//             value: 5,
//             label:
//               "Extremely Active (very heavy exercise, hard labour job, training 2x / day)",
//             trigger: ({ steps }) => {
//               setDailyactivity(
//                 "Extremely Active (very heavy exercise, hard labour job, training 2x / day)"
//               );
//               return 22;
//             },
//           },
//         ],
//       },
//       {
//         id: "22",
//         message: ({ steps }) => `What is your life style status?`,
//         trigger: "23",
//       },
//       {
//         id: "23",
//         options: [
//           {
//             value: 1,
//             label: "Working",
//             trigger: ({ steps }) => {
//               setLifstyStatus("Working");
//               return 24;
//             },
//           },
//           {
//             value: 2,
//             label: "Student",
//             trigger: ({ steps }) => {
//               setLifstyStatus("Student");
//               return 24;
//             },
//           },
//           {
//             value: 3,
//             label: "Retired",
//             trigger: ({ steps }) => {
//               setLifstyStatus("Retired");
//               return 24;
//             },
//           },
//           {
//             value: 4,
//             label: "House-wife",
//             trigger: ({ steps }) => {
//               setLifstyStatus("House-wife");
//               return 24;
//             },
//           },
//           {
//             value: 5,
//             label: "Sabbatical",
//             trigger: ({ steps }) => {
//               setLifstyStatus("Sabbatical");
//               return 24;
//             },
//           },
//         ],
//       },
//       {
//         id: "24",
//         message: ({ steps }) => `Name any known food allergy?`,
//         trigger: "25",
//       },
//       {
//         id: "25",
//         options: [
//           {
//             value: 1,
//             label: "Yes",
//             trigger: ({ steps }) => {
//               setAllergystatus("Yes");
//               return 26;
//             },
//           },
//           {
//             value: 2,
//             label: "None",
//             trigger: ({ steps }) => {
//               setAllergystatus("None");
//               return 28;
//             },
//           },
//         ],
//       },
//       {
//         id: "26",
//         message: ({ steps }) => `Please Enter you food allergy`,
//         trigger: "27",
//       },
//       {
//         id: "27",
//         user: true,
//         inputAttributes: {
//           keyboardType: "default",
//         },
//         trigger: "28",
//         validator: (value) => {
//           if (!value) return "Please try again!";
//           else {
//             setAllergy(value);
//             return true;
//           }
//         },
//       },
//       {
//         id: "28",
//         message: ({ steps }) => `Choose your food preferences?`,
//         trigger: "29",
//       },
//       {
//         id: "29",
//         options: [
//           {
//             value: 1,
//             label: "Vegeterian",
//             trigger: () => {
//               setFoodfrefrence("Vegeterian");
//               return 33;
//             },
//           },
//           {
//             value: 2,
//             label: "Veg with Eggs",
//             trigger: () => {
//               setFoodfrefrence("Veg with Eggs");
//               return 30;
//             },
//           },
//           {
//             value: 2,
//             label: "Non-Veg",
//             trigger: () => {
//               setFoodfrefrence("Non-Veg");
//               return 30;
//             },
//           },
//         ],
//       },
//       {
//         id: "30",
//         message: ({ steps }) => `Eggs / Non Veg allowed Days ? `,
//         trigger: "31",
//       },
//       {
//         id: "31",
//         options: [
//           { value: 1, label: "All Days", trigger: "33" },
//           { value: 2, label: "Specific Days", trigger: "32" },
//         ],
//       },
//       {
//         id: "32",
//         component: <NonVegcheckBox />,
//         replace: false,
//         waitAction: false,
//         asMessage: true,
//       },
//       {
//         id: "33",
//         message: ({ steps }) => `Choose your fasting days?`,
//         trigger: "34",
//       },
//       {
//         id: "34",
//         options: [
//           {
//             value: 1,
//             label: "None",
//             trigger: () => {
//               setFastingstatus("None");
//               return 36;
//             },
//           },
//           {
//             value: 2,
//             label: "Pick fixed fasting Day",
//             trigger: () => {
//               setFastingstatus("Pick fixed fasting Day");
//               return 35;
//             },
//           },
//         ],
//       },
//       {
//         id: "35",
//         component: <FastingVegcheckBox />,
//         replace: false,
//         waitAction: false,
//         asMessage: true,
//       },
//       {
//         id: "36",
//         message: `Select any known disorder you may have?`,
//         trigger: "37",
//       },
//       {
//         id: "37",
//         component: <Disorder />,
//         replace: false,
//         waitAction: false,
//         asMessage: true,
//       },
//       {
//         id: "38",
//         message: `Select any known minor aliment you may have?`,
//         trigger: "39",
//       },
//       {
//         id: "39",
//         component: <MainerAliment />,
//         replace: false,
//         waitAction: false,
//         asMessage: true,
//       },
//       {
//         id: "40",
//         message: `What is your Email id?`,
//         trigger: "41",
//       },
//       {
//         id: "41",
//         user: true,
//         inputAttributes: {
//           keyboardType: "email-address",
//         },
//         validator: (value) => {
//           var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//           if (!value.match(mailformat))
//             return "Please enter valid email address";
//           else {
//             email = value;
//             return true;
//           }
//         },
//         trigger: "41h",
//       },
//       {
//         id: "41h",
//         message: ({ steps }) => {
//           sendEmailOtp();
//           return `Enter the OTP from your email`;
//         },
//         trigger: "41top",
//       },
//       {
//         id: "41top",
//         user: true,
//         inputAttributes: {
//           keyboardType: "default",
//         },
//         trigger: "42h",
//         validator: (value) => {
//           if (value == emailOtop) return true;
//           else {
//             return "Email OTP is Invalid";
//           }
//         },
//       },
//       {
//         id: "42h",
//         message: ({ steps }) => {
//           return `Superb! I have created your medical profile and customer profile`;
//         },
//         trigger: "42",
//       },
//       {
//         id: "42",
//         component: <TermandCondition />,
//         replace: false,
//         waitAction: false,
//         asMessage: true,
//       },
//       {
//         id: "43",
//         message: `Thanks, let me take a look for you...`,
//         end: true,
//       },
//     ];
//   }
