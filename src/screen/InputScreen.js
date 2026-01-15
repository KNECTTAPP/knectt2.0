import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import moment from "moment";
import DateRangePicker from "rnv-date-range-picker";
import InputComponent from "../component/InputComponent";
import ButtonComponent from "../component/ButtonComponent";
import { ProgressLoader } from "../component/ProgressLoader";
import thumsImg from "../../assets/img/thumbs.png";
import Header from "../component/Header";
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
  let selectedRange = dateRange;
  let firstDate = selectedRange.firstDate;
  let secondDate = selectedRange.secondDate;
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
    setIntakeWather(0);
    setTakemadicine();
    setBing();
    setEatOut();
    setStress();
    setSleephour(0);
    setSleephourConvert(0);
    setWeightQunityr(0);
    getInputData(selectedDate.format("YYYY-MM-DD"));
  };

  const getProfileData = async () => {
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
    const response = await fetch(EndUrl.getprofile, settingsGet);
    const updateAvailable = response.headers.get("updateAvailable");
    const forceUpdate = response.headers.get("forceUpdate");
    if (updateAvailable) {
      await AsyncStorage.setItem("updateAvailable", "true");
    }
    if (forceUpdate) {
      await AsyncStorage.setItem("forceUpdate", "true");
    }
    const json = await response.json();
    setUserData(json.data[0]);
    setUserGender(json.data[0].gender);
  };

  const submitInput = async () => {
    setLoading(true);
    var postpayload = {
      input_date: datesWhitelist[0].start.format("YYYY-MM-DD"),
      water: intakeWater,
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
        getProfileData();
        getInputData();
        showMessage({
          message: "Your daily activity saved successfully.",
          duration: 4000,
          position: "center",
          icon: (props) => <Image source={thumsImg} {...props} />,
          type: "success",
        });
        // setTimeout(function () {
        //   navigation.navigate("Chart");
        // }, 1000);
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
      let letdata = date ? date : datesWhitelist[0].start.format("YYYY-MM-DD");
      let usertoken = await AsyncStorage.getItem("usertoken");
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
        setFinalData(true);
        if (json.data.length > 0) {
          setIntakeWather(json.data[0].water);
          setTakemadicine(json.data[0].medicine);
          setBing(json.data[0].binging);
          setEatOut(json.data[0].eat_out);
          setStress(json.data[0].stress);
          setSleephour(json.data[0].sleep);
          setSleephourConvert(json.data[0].sleep);
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
              value: json.data[0].weight,
              gender: gender,
              quantity: json.data[0].weight,
            },
            {
              id: 3,
              question: "How many hour`s did you sleep?",
              quantity: json.data[0].sleep,
              gender: gender,
              value: json.data[0].sleep,
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
              quantity: intakeWater + " litre",
              value: intakeWater,
              unit: "litres",
              target: "Target " + parseFloat(intakeWater) + " litre",
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
          water: intakeWater,
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
  const onfunctionCall = (textvalue, arg, value, id, textvalu) => {
    if (id == 5) {
      setTakemadicine(textvalue);
    }
    if (id == 6) {
      setBing(textvalue);
    }
    if (id == 7) {
      setEatOut(textvalue);
    }
    if (id == 8) {
      setStress(textvalue);
    }

    if (id == 4) {
      setDateRange(textvalue);
    }
  };
  useEffect(() => {
    getProfileData();
    getInputData();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <FlashMessage />
      <Header chatLogo backButtonwithtext headerBackButton={false} />
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
      {listp.length > 0 ? (
        <FlatList
          data={List}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View key={item.id}>
                {usergender != "female" && item.id != 4 ? (
                  <View style={styles.containerq}>
                    <Text
                      style={{
                        fontSize: 14,
                        margin: 10,
                        left: 0,
                        color: "#000",
                      }}
                    >
                      {item.question}{" "}
                    </Text>
                    {item.id == 1 ? (
                      <View>
                        <View style={styles.innerView}>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingHorizontal: 0,
                              width: "55%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                paddingHorizontal: 0,
                              }}
                            >
                              <Text style={{ fontSize: 14, color: "#000" }}>
                                {item.quantity}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#000",
                                  fontStyle: "italic",
                                  color: "#999",
                                }}
                              >
                                Last entered in liters{" "}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#000",
                                  fontStyle: "italic",
                                  color: "#999",
                                }}
                              >
                                {item.target}
                              </Text>
                            </View>
                          </View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingHorizontal: 0,
                              marginLeft: 50,
                            }}
                          >
                            <TextInput
                              style={styles.input}
                              placeholder="In liters"
                              value={intakeWater}
                              onChangeText={setIntakeWather}
                              keyboardType="numeric"
                            />
                          </View>
                        </View>
                        <View style={{ height: 25 }} />
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          margin: 10,
                        }}
                      >
                        {item.id != 4 && item.unit ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingHorizontal: 0,
                              width: "55%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "column",
                                justifyContent: "space-between",
                                paddingHorizontal: 0,
                              }}
                            >
                              <Text style={{ fontSize: 14, color: "#000" }}>
                                {item.quantity} {item.unit}
                              </Text>
                              {item.valuedtext ? (
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "#000",
                                    fontStyle: "italic",
                                    color: "#999",
                                    paddingBottom: 10,
                                  }}
                                >
                                  {item.valuedtext}
                                </Text>
                              ) : null}
                              {item.target ? (
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: "#000",
                                    fontStyle: "italic",
                                    color: "#999",
                                    paddingBottom: 10,
                                  }}
                                >
                                  {item.target}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                        ) : null}
                        {item.id == 4 ? (
                          <View style={styles.container}>
                            <DateRangePicker
                              onSelectDateRange={(range) => {
                                //setRange(range);
                                selectedRange = range;
                                onfunctionCall(range, "mensuration", range, 4);
                              }}
                              selectedDateContainerStyle={
                                styles.selectedDateContainerStyle
                              }
                              selectedDateStyle={styles.selectedDateStyle}
                              firstDate={firstDate}
                              secondDate={secondDate}
                              responseFormat="YYYY-MM-DD"
                              maxDate={moment().add(60, "days")}
                              minDate={moment().subtract(60, "days")}
                            />
                            <View style={styles.container}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#000",
                                  paddingLeft: 5,
                                  paddingTop: 5,
                                  paddingBottom: 5,
                                }}
                              >
                                Mensturation start date:{" "}
                                {selectedRange.firstDate}
                              </Text>
                              <Text
                                style={{
                                  fontSize: 14,
                                  color: "#000",
                                  paddingLeft: 5,
                                  paddingBottom: 5,
                                }}
                              >
                                Mensturation end date:{" "}
                                {selectedRange.secondDate}
                              </Text>
                            </View>
                          </View>
                        ) : null}
                        {item.id > 4 && item.id < 8 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              left: 80,
                              width: "80%",
                            }}
                          >
                            <ButtonComponent
                              textStyle={
                                item.value == 1
                                  ? styles.activeTextColor
                                  : styles.inactiveTextColor
                              }
                              buttonStyle={
                                item.value == 1
                                  ? styles.activeYes
                                  : styles.activeNo
                              }
                              text={item.yes}
                              onPress={() =>
                                onfunctionCall(1, "extras", 1, item.id)
                              }
                            />

                            <ButtonComponent
                              textStyle={
                                item.value == 0
                                  ? styles.activeTextColor
                                  : styles.inactiveTextColor
                              }
                              buttonStyle={
                                item.value == 0
                                  ? styles.activeYes
                                  : styles.activeNo
                              }
                              onPress={() =>
                                onfunctionCall(0, "extras", 0, item.id)
                              }
                              text={item.no}
                            />
                          </View>
                        ) : null}
                        {item.id == 8 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-around",
                              width: "100%",
                            }}
                          >
                            {item.steressvalue == 1 ? (
                              <Image
                                source={item.imojilis[0].image1}
                                style={styles.imageroundact}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onfunctionCall(1, "stress", 1, item.id)
                                }
                              >
                                <Image
                                  source={item.imojilis[0].image1}
                                  style={styles.imageround}
                                />
                              </TouchableOpacity>
                            )}
                            {item.steressvalue == 2 ? (
                              <Image
                                source={item.imojilis[0].image2}
                                style={styles.imageroundact}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onfunctionCall(2, "stress", 1, item.id)
                                }
                              >
                                <Image
                                  source={item.imojilis[0].image2}
                                  style={styles.imageround}
                                />
                              </TouchableOpacity>
                            )}
                            {item.steressvalue == 3 ? (
                              <Image
                                source={item.imojilis[0].image3}
                                style={styles.imageroundact}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() => onfunctionCall(3, "stress", 1)}
                              >
                                <Image
                                  source={item.imojilis[0].image3}
                                  style={styles.imageround}
                                />
                              </TouchableOpacity>
                            )}
                            {item.steressvalue == 4 ? (
                              <Image
                                source={item.imojilis[0].image4}
                                style={styles.imageroundact}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onfunctionCall(4, "stress", 1, item.id)
                                }
                              >
                                <Image
                                  source={item.imojilis[0].image4}
                                  style={styles.imageround}
                                />
                              </TouchableOpacity>
                            )}
                            {item.steressvalue == 5 ? (
                              <Image
                                source={item.imojilis[0].image5}
                                style={styles.imageroundact}
                              />
                            ) : (
                              <TouchableOpacity
                                onPress={() =>
                                  onfunctionCall(5, "stress", 1, item.id)
                                }
                              >
                                <Image
                                  source={item.imojilis[0].image5}
                                  style={styles.imageround}
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        ) : null}

                        {item.id > 1 && item.id < 4 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              paddingHorizontal: 0,
                              marginLeft: 50,
                            }}
                          >
                            {item.id == 2 ? (
                              <TextInput
                                style={styles.input}
                                placeholder={"In " + item.unit}
                                value={weightQunityr}
                                onChangeText={setWeightQunityr}
                                keyboardType="numeric"
                              />
                            ) : null}
                            {item.id == 3 ? (
                              <TextInput
                                style={styles.input}
                                value={sleephourConvert}
                                placeholder={"In " + item.unit}
                                onChangeText={setSleephourConvert}
                                keyboardType="numeric"
                              />
                            ) : null}
                          </View>
                        ) : null}
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            );
          }}
        />
      ) : null}
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

  containerq: {
    backgroundColor: "white",
    justifyContent: "space-between",
    width: "95%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "white",
    marginVertical: 5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  containerhide: {
    display: "none",
  },
  activeTextColor: {
    color: "#fff",
  },
  inactiveTextColor: {
    color: "#000",
  },
  activeYes: {
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgray",
    backgroundColor: "#132742",
  },
  activeNo: {
    width: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "lightgray",
    backgroundColor: "white",
  },
  imageround: {
    width: 55,
    height: 55,
  },
  imageroundact: {
    width: 55,
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  innerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  counterButtonContainer: {
    display: "flex",
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F79489",
    borderRadius: 15,
    elevation: 2,
  },
  selectedDateStyle: {
    fontWeight: "bold",
    color: "white",
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  counterCountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    width: "50%",
    marginTop: 10,
    fontSize: 16,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
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
