import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import InputComponent from "../component/InputComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import thumsImg from "../../assets/img/thumbs.png";
import Header from "../component/Header";
import moment from "moment";
import CalendarStrip from "react-native-calendar-strip";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts";
import { ButtonCustom } from "../component/ButtonCustom";
import DeviceInfo from "react-native-device-info";

const InputScreen = ({ navigation, route }) => {
  const [inputData, setInputData] = useState(0);
  const [weightQunityr, setWeightQunityr] = useState(0);
  const [sleephour, setSleephour] = useState(0);
  const [intakeWater, setIntakeWather] = useState(0);
  const [water, setWater] = useState(0);
  const [loading, setLoading] = useState(true);
  const [targetwater, setTargetWater] = useState(0);
  const [takemedicine, setTakemadicine] = useState("");
  const [bing, setBing] = useState();
  const [eatout, setEatOut] = useState();
  const [stress, setStress] = useState();
  const [sleephourConvert, setSleephourConvert] = useState(0);
  const [slctedata, setSlctedata] = useState(0);
  const [userdata, setUserData] = useState([]);
  const [usergender, setUserGender] = useState([]);
  const [dateRange, setDateRange] = useState({});
  const [finalData, setFinalData] = useState();
  const [listp, setListp] = useState([]);
  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(2, "days"),
    },
  ];
  function returnIndex(id) {
    var irt = 0;

    listp.map(function (index) {
      console.log(parseInt(index.id) + "===" + id);
      if (parseInt(index.id) === parseInt(id)) {
        return irt;
      } else {
        irt++;
      }
      console.log(irt);
    });
  }
  const [inputPostData, setInputPostData] = useState({
    input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
    water: water,
    stress: stress,
    sleep: sleephourConvert,
    medicine: takemedicine,
    binging: bing,
    eat_out: eatout,
    menstrual_start: dateRange.firstDate,
    menstrual_end: dateRange.secondDate,
    weight: weightQunityr,
    diabetes: "",
  });
  const smilylist = [
    {
      image1: require("../../assets/img/1.png"),
      image2: require("../../assets/img/2.png"),
      image3: require("../../assets/img/3.png"),
      image4: require("../../assets/img/4.png"),
      image5: require("../../assets/img/5.png"),
    },
  ];
  FlashMessage.setColorTheme({
    success: "#132742",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  let quantity = weightQunityr;
  let sleeph = sleephour;
  let gender = usergender;

  let state = {
    startDate: null,
    endDate: null,
    displayedDate: moment(),
  };

  const onDateSelected = (selectedDate) => {
    //setSlctedata(selectedDate.format('YYYY-MM-DD'));
    getInputData(selectedDate.format("YYYY-MM-DD"));
  };
const loadProfile = async () => {
  try {
    const profile = await getProfileData();
    setUserData(profile);
  } catch (error) {
    console.log("Profile error:", error.message);
  }
};

  const submitInput = async () => {
    setLoading(true);
    var postpayload = {
      input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
      water: water,
      stress: stress,
      sleep: sleephourConvert,
      medicine: takemedicine,
      binging: bing,
      eat_out: eatout,
      menstrual_start: dateRange.firstDate,
      menstrual_end: dateRange.secondDate,
      weight: weightQunityr,
      diabetes: "",
    };
    let usertoken = await AsyncStorage.getItem("usertoken");
    console.log(usertoken);
    console.log(postpayload);
    try {
      const response = await fetch(EndUrl.gloabalurl + "savedailyinput", {
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
      if (response.status == 200) {
        setLoading(false);
        const json = await response.json();
        showMessage({
          message: "Your daily activity saved successfully.",
          duration: 4000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });
        setTimeout(function () {
          navigation.navigate("Chart");
        }, 1000);
      }
    } catch (error) {
      showMessage({
        message: "Please try after some time",
        duration: 3000,
        type: "danger",
      });
      setLoading(false);
    } finally {
      setLoading(false);
      setLoading(false);
    }
  };

  const getInputData = async (date) => {
    setFinalData(false);
    try {
      setLoading(true);
      console.log(date);

      let letdata = date ? date : datesWhitelist[0].start.format("YYYY-MM-DD");
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log(usertoken);
      console.log(EndUrl.gloabalurl + "getinputdata/" + letdata);
      const response = await fetch(
        EndUrl.gloabalurl + "getinputdata/" + letdata,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: JSON.parse(usertoken),
            Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
            Platform: Platform.OS,
          },
        }
      );
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
      if (response.status == 200) {
        setLoading(false);
        const json = await response.json();
        setTargetWater(parseFloat(json.watertarget));

        console.log(json);
        setFinalData(true);
        if (json.data.length > 0) {
          setIntakeWather(json.data[0].water);
          setTakemadicine(json.data[0].medicine);
          setBing(json.data[0].binging);
          setEatOut(json.data[0].eat_out);
          setStress(json.data[0].stress);
          setSleephour(json.data[0].sleep);
          setWeightQunityr(json.data[0].weight);
          setDateRange({
            firstDate: json.data[0].menstrual_start,
            secondDate: json.data[0].menstrual_end,
          });
          setInputData(json.data[0]);
          var Listp = [
            {
              id: 1,
              question: "What is your water intake today?",
              quantity: json.data[0].water + " litre",
              value: json.data[0].water,
              unit: "litres",
              target: "Target " + parseFloat(json.watertarget) + " litre",
              quantityOne: "200 ml",
              quantityTwo: "500 ml",
              gender: gender,
            },
            {
              id: 2,
              question: "What is your weight today?",
              valuedtext: "Last entered in kgs",
              unit: "kgs",
              gender: gender,
              quantity: json.data[0].weight,
            },
            {
              id: 3,
              question: "How many hour`s did you sleep?",
              quantity: json.data[0].sleep,
              gender: gender,
              valuedtext: "Last entered in hrs",
              unit: "hrs",
            },
            {
              id: 4,
              question: "Mensturation cycle?",
              quantity: "15-17",
              gender: gender,
            },
            {
              id: 5,
              question: "Did you take medicines?",
              yes: "Yes",
              valuedtext: "",
              unit: "",
              no: "No",
              gender: gender,
              value: takemedicine,
            },
            {
              id: 6,
              question: "Did you bing?",
              valuedtext: "",
              unit: "",
              yes: "Yes",
              no: "No",
              value: json.data[0].binging,
              gender: gender,
            },
            {
              id: 7,
              question: "Did you eat out?",
              yes: "Yes",
              no: "No",
              valuedtext: "",
              unit: "",
              gender: gender,
              value: json.data[0].eat_out,
            },
            {
              id: 8,
              question: "Stress level?",
              valuedtext: "",
              unit: "",
              gender: gender,
              imojilis: smilylist,
              steressvalue: json.data[0].stress,
            },
          ];
          setListp(Listp);
        } else {
          var Listp = [
            {
              id: 1,
              question: "What is your water intake today?",
              quantity: 0 + " litre",
              value: water,
              unit: "litres",
              target: "Target " + parseFloat(json.watertarget) + " litre",
              quantityOne: "200 ml",
              quantityTwo: "500 ml",
              gender: gender,
            },
            {
              id: 2,
              question: "What is your weight today?",
              valuedtext: "Last entered in kgs",
              unit: "kgs",
              gender: gender,
              quantity: 0,
            },
            {
              id: 3,
              question: "How many hour`s did you sleep?",
              quantity: 0,
              gender: gender,
              valuedtext: "Last entered in hrs",
              unit: "hrs",
            },
            {
              id: 4,
              question: "Mensturation cycle?",
              quantity: "15-17",
              gender: gender,
            },
            {
              id: 5,
              question: "Did you take medicines?",
              yes: "Yes",
              valuedtext: "",
              unit: "",
              no: "No",
              gender: gender,
              value: takemedicine,
            },
            {
              id: 6,
              question: "Did you bing?",
              valuedtext: "",
              unit: "",
              yes: "Yes",
              no: "No",
              value: "",
              gender: gender,
            },
            {
              id: 7,
              question: "Did you eat out?",
              yes: "Yes",
              no: "No",
              valuedtext: "",
              unit: "",
              gender: gender,
              value: "",
            },
            {
              id: 8,
              question: "Stress level?",
              valuedtext: "",
              unit: "",
              gender: gender,
              imojilis: smilylist,
              steressvalue: 0,
            },
          ];
          setListp(Listp);
        }
        setInputPostData({
          input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
          water: water,
          stress: stress,
          sleep: sleephourConvert,
          medicine: takemedicine,
          binging: bing,
          eat_out: eatout,
          menstrual_start: dateRange.firstDate,
          menstrual_end: dateRange.secondDate,
          weight: weightQunityr,
          diabetes: "",
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onfunctionCall = (textvalue, arg, value, id, textvalu) => {
    if (id == 2) {
      console.log(textvalue + "id 2");
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: textvalue,
        diabetes: "",
      });
      setWeightQunityr(textvalue);
    }
    if (id == 3) {
      //inputsleephour(value);
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: textvalue,
        medicine: takemedicine,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      setSleephourConvert(textvalue);
    }
    if (id == 1) {
      console.log(textvalue + " water");
      setWater(textvalue);
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: textvalue,
        stress: stress,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      setIntakeWather(textvalue);
    }
    if (id == 5) {
      setTakemadicine(textvalue);
      let listrt = listp;
      listrt[4].value = textvalue;
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: sleephourConvert,
        medicine: textvalue,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      //submitInput('Insertmedicineinput',{input_date:datesWhitelist[0].start.format('YYYY-MM-DD'),medicine:value});
    }
    if (id == 6) {
      setBing(textvalue);
      let listrt = listp;
      listrt[5].value = textvalue;
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: textvalue,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      //submitInput('insertbinginput',{input_date:datesWhitelist[0].start.format('YYYY-MM-DD'),binging:value});
    }
    if (id == 7) {
      setEatOut(textvalue);
      let listrt = listp;
      listrt[6].value = textvalue;
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: bing,
        eat_out: textvalue,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      //submitInput('inserteatoutinput',{input_date:datesWhitelist[0].start.format('YYYY-MM-DD'),eat_out:value});
    }
    if (id == 8) {
      setStress(textvalue);
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: textvalue,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      //submitInput('insertstressinput',{input_date:datesWhitelist[0].start.format('YYYY-MM-DD'),stress:value});
    }

    if (id == 4) {
      setInputPostData({
        input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
        water: water,
        stress: stress,
        sleep: sleephourConvert,
        medicine: takemedicine,
        binging: bing,
        eat_out: eatout,
        menstrual_start: dateRange.firstDate,
        menstrual_end: dateRange.secondDate,
        weight: weightQunityr,
        diabetes: "",
      });
      setDateRange(textvalue);
    }
    console.log({
      input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
      water: water,
      stress: stress,
      sleep: sleephourConvert,
      medicine: takemedicine,
      binging: bing,
      eat_out: eatout,
      menstrual_start: dateRange.firstDate,
      menstrual_end: dateRange.secondDate,
      weight: weightQunityr,
      diabetes: "",
    });
  };
  let List = [
    {
      id: 1,
      question: "What is your water intake today?",
      quantity: intakeWater + " litre",
      unit: "litres",
      target: "Target " + targetwater + " litre",
      quantityOne: "200 ml",
      quantityTwo: "500 ml",
      gender: gender,
    },
    {
      id: 2,
      question: "What is your weight today?",
      valuedtext: "Last entered in kgs",
      unit: "kgs",
      gender: gender,
      quantity: weightQunityr,
    },
    {
      id: 3,
      question: "How many hour`s did you sleep?",
      quantity: sleephourConvert,
      gender: gender,
      valuedtext: "Last entered in hrs",
      unit: "hrs",
    },
    {
      id: 4,
      question: "Mensturation cycle?",
      quantity: "15-17",
      gender: gender,
    },
    {
      id: 5,
      question: "Did you take medicines?",
      yes: "Yes",
      valuedtext: "",
      unit: "",
      no: "No",
      gender: gender,
      value: takemedicine,
    },
    {
      id: 6,
      question: "Did you bing?",
      valuedtext: "",
      unit: "",
      yes: "Yes",
      no: "No",
      value: bing,
      gender: gender,
    },
    {
      id: 7,
      question: "Did you eat out?",
      yes: "Yes",
      no: "No",
      valuedtext: "",
      unit: "",
      gender: gender,
      value: eatout,
    },
    {
      id: 8,
      question: "Stress level?",
      valuedtext: "",
      unit: "",
      gender: gender,
      imojilis: smilylist,
      steressvalue: stress,
    },
  ];
  const CustomeInput = () => {
    return (
      <FlatList
        data={List}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <InputComponent
              show={inputData}
              item={item}
              userData={userdata}
              onfunctionCall={onfunctionCall}
              dateRange={dateRange}
              inputperdata={inputPostData}
            />
          );
        }}
      />
    );
  };
  const CustomeInputLoad = () => {
    return (
      <FlatList
        data={listp}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <InputComponent
              show={inputData}
              item={item}
              userData={userdata}
              onfunctionCall={onfunctionCall}
              dateRange={dateRange}
              inputperdata={inputPostData}
            />
          );
        }}
      />
    );
  };
  useEffect(() => {
    loadProfile();
    getInputData();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlashMessage />
      <Header chatLogo backButtonwithtext />
      <ProgressLoader isVisible={loading} />
      <View style={styles.calenderStyle}>
        <View style={{ height: 10, width: "100%" }}>
          <CalendarStrip
            datesWhitelist={datesWhitelist}
            onDateSelected={onDateSelected}
            calendarAnimation={{ type: "sequence", duration: 30 }}
            daySelectionAnimation={{
              type: "background",
              duration: 200,
              borderWidth: 1,
              borderHighlightColor: "#132742",
              color: "#FFF",
              highlightColor: "#132742",
            }}
            style={{ height: 100 }}
            calenderHeaderStyle={{ color: "#F79489" }}
            calendarColor={{ color: "#F79489" }}
            dateNumberStyle={{ color: "#F79489" }}
            dateNameStyle={{ color: "#F79489" }}
            iconContainer={{ flex: 0.1 }}
            highlightDateNumberStyle={{ color: "#FFF" }}
            highlightDateNameStyle={{ color: "#FFF" }}
            disabledDateNumberStyle={"pink"}
            dateContainerStyle={{ color: "#F79489" }}
          />
        </View>
      </View>
      <View>
        <Text
          style={{
            fontSize: 16,
            fontFamily: fonts.whitneySemiBold,
            marginLeft: 15,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          Input your health parameters{" "}
        </Text>
      </View>
      {finalData ? <CustomeInputLoad /> : <CustomeInput />}
      <View style={{ width: "100%", padding: 5, justifyContent: "center" }}>
        {/* <Button
          color="#F79489" mode="outlined" style={{ flex: 1, width: 'auto' }}
          uppercase={false} title="Submit" onPress={() => submitInput()} /> */}
        <ButtonCustom title="Submit" onPress={() => submitInput()} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 1,
    backgroundColor: "white",
  },
  calenderStyle: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    top: 10,
    marginBottom: 15,
  },
});

export default InputScreen;
