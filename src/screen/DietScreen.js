import React, { useEffect, useState } from "react";
import {
  View,
  Animated,
  StyleSheet,
  TouchableOpacity,
  Text,
  
  FlatList,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import DietComponent from "../component/DietComponent";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { ProgressLoader } from "../component/ProgressLoader";
import CalendarStrip from "react-native-calendar-strip";
import thumsImg from "../../assets/img/thumbs.png";
import Header from "../component/Header";
import EndUrl from "../api/EndUrl";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
const DietScreen = ({ route, navigation }) => {
  const [dietlist, setDietlist] = useState(0);
  const [slctedata, setSlctedata] = useState(0);
  const [disclimiler, SetDisclimer] = useState();
  const [newUser, setNewUser] = useState();
  const [dietData, setDietData] = useState("2023-05-11");
  const [loading, setLoading] = useState(true);
  var width = Dimensions.get("window").width; //full width

  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(2, "days"),
    },
  ];
  const onDateSelected = (selectedDate) => {
    setSlctedata(selectedDate.format("YYYY-MM-DD"));
    getInputData();
  };
  var daietatarespon = [];
  const getInputData = async () => {
    try {
      setLoading(true);
      let letdata = slctedata
        ? slctedata
        : datesWhitelist[0].start.format("YYYY-MM-DD");
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.gloabalurl + "diet/" + letdata, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
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
        SetDisclimer(json.disclaimer);
        if (json.hasOwnProperty("earlymorning")) {
          var calrories = json.earlymorning.hasOwnProperty("calorie")
            ? json.earlymorning.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 1,
            data: json.earlymorning.content,
            images: json.earlymorning.picture,
            calories: calrories,
            time: "Early Morning",
          });
        }
        if (json.hasOwnProperty("breakfast")) {
          var calrories = json.breakfast.hasOwnProperty("calorie")
            ? json.breakfast.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 2,
            data: json.breakfast.content,
            images: json.breakfast.picture,
            calories: calrories,
            time: "Breakfast",
          });
        }
        if (json.hasOwnProperty("mid_morning")) {
          var calrories = json.mid_morning.hasOwnProperty("calorie")
            ? json.mid_morning.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 3,
            data: json.mid_morning.content,
            images: json.mid_morning.picture,
            calories: calrories,
            time: "Mid Morning",
          });
        }

        if (json.hasOwnProperty("lunch")) {
          var calrories = json.lunch.hasOwnProperty("calorie")
            ? json.lunch.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 4,
            data: json.lunch.content,
            images: json.lunch.picture,
            calories: calrories,
            time: "Lunch",
          });
        }

        if (json.hasOwnProperty("evening")) {
          var calrories = json.evening.hasOwnProperty("calorie")
            ? json.evening.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 5,
            data: json.evening.content,
            images: json.evening.picture,
            calories: calrories,
            time: "Evening",
          });
        }

        if (json.hasOwnProperty("predinner")) {
          var calrories = json.predinner.hasOwnProperty("calorie")
            ? json.predinner.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 6,
            data: json.predinner.content,
            images: json.predinner.picture,
            calories: calrories,
            time: "Pre Dinner",
          });
        }

        if (json.hasOwnProperty("dinner")) {
          var calrories = json.dinner.hasOwnProperty("calorie")
            ? json.dinner.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 7,
            data: json.dinner.content,
            images: json.dinner.picture,
            calories: calrories,
            time: "Dinner",
          });
        }

        if (json.hasOwnProperty("postdinner")) {
          var calrories = json.postdinner.hasOwnProperty("calorie")
            ? json.postdinner.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 7,
            data: json.postdinner.content,
            images: json.postdinner.picture,
            calories: calrories,
            time: "Post Dinner",
          });
        }

        if (json.hasOwnProperty("whole_day")) {
          var calrories = json.whole_day.hasOwnProperty("calorie")
            ? json.whole_day.calorie + " kcal"
            : 0;
          daietatarespon.push({
            id: 7,
            data: json.whole_day.content,
            images: json.whole_day.picture,
            calories: calrories,
            time: "Whole Day",
          });
        }

        setDietData(daietatarespon);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        getInputData();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressLoader isVisible={loading} />
      <Header
        chatLogo
        chat
        call="+919599225887"
        headerBackButton
        backButtonwithtext
      />
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
      {route.params ? (
        <View
          style={{
            width: "90%",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            height: "auto",
            backgroundColor: "white",
            marginTop: 10,
            marginLeft: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#99999" }}>
            Congratulations in taking your first step towards good health.
          </Text>
        </View>
      ) : null}
      <View
        style={{
          width: "90%",
          alignSelf: "center",
          justifyContent: "center",
          height: 40,
          elevation: 10,
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
        }}
      >
        <Text style={{ fontSize: 14, color: "#99999" }}>5 days left</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 25,
          marginTop: 10,
        }}
      >
        <Text style={{ fontSize: 17, color: "#99999" }}>Assigned calories</Text>
      </View>
      <FlatList
        data={dietData}
        style={{ paddingVertical: 10 }}
        keyExtractor={(item, index) => item.key}
        renderItem={({ item }) => {
          return (
            <DietComponent
              time={item.time}
              calories={item.calories}
              diet={item.data}
              images={item.images}
              quantity={""}
              apitext={"Suggested Diet"}
            />
          );
        }}
      />
      {disclimiler ? (
        <View style={styles.footertext}>
          <Image
            source={{ uri: disclimiler }}
            style={{ height: 100, width: width, paddingTop: 0, marginTop: 3 }}
          />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  calenderStyle: {
    height: "15%",
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    top: 10,
    // backgroundColor: 'white'
  },
  flatlistStyle: {
    backgroundColor: "red",
  },
});

export default DietScreen;
