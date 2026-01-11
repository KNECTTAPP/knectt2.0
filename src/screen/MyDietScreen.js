import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from "react-native";
import { ImageSlider } from "react-native-image-slider-banner";
import CalendarStrip from "react-native-calendar-strip";
import { useNavigation, useRoute } from '@react-navigation/native';
import DietComponent from "../component/DietComponent";
import moment from "moment";
import HomePlanComponent from "../component/HomePlanComponent";
import ModalTester from "../component/ModalNutrationComponent";
import OfferComponent from "../component/OfferComponent";
import EndUrl from "../api/EndUrl";
import { ProgressLoader } from "../component/ProgressLoader";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { convertIntoDateFormat } from "../utils/commonFunctions";
import DeviceInfo from "react-native-device-info";
import fonts from "../utils/fonts";
import colors from "../utils/colors";
var id = 0;
const MyDietScreen = ({ navigation, route }) => {
  const [titleText, setTitleText] = useState(null);
  const [plan, setPlan] = useState([]);
  const [planImage, setPlanImage] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState([]);
  const [datesWhitelist,setDatesWhitelist]=useState([]);
  const [id, setId] = useState();
  const [planType, setPlanType] = useState();
  const [bannerdata, setBannerData] = useState();
  const [chatNutrintion, setChatNutrintion] = useState([]);
  const [daysLeft, setDaysLeft] = useState(0);
  var width = Dimensions.get("window").width;
  var height = Dimensions.get("window").height;

  const [dietlist, setDietlist] = useState(0);
  const [slctedata, setSlctedata] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [disclimiler, SetDisclimer] = useState();
  const [noData, setNoData] = useState(false);
  const [totalcalories, setTotalcalories] = useState();
  const [dietData, setDietData] = useState("2023-05-11");
  var width = Dimensions.get("window").width; //full width

  const updagradePlane = (arg) => {
    navigation.navigate("ChatbotNutrition", { id: arg });
  };

  const toggleModal = (id, planType, planImage, openModal) => {
    setLoading(openModal);
    getReadMore(id, planType, planImage);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };
  let podthrder = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
      Platform: Platform.OS,
    },
  };
  const getMovies = async () => {
    try {
      const response = await fetch(EndUrl.gloabalurl + "offer");
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
      let data = json.data[0];
      let offerData = {
        id: data.id,
        image: data.image,
      };
      setTitleText(offerData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("lineno 50");
      console.error(error);
    }
  };
  const getPlan = async () => {
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
      const response = await fetch(EndUrl.gloabalurl + "plans", settingsGet);
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
      console.log("data--->", json.data);
      setPlan(json.data);
      setLoading(false);
    } catch (error) {}
  };
  const bannerData = async () => {
    try {
      const response = await fetch(EndUrl.gloabalurl + "banner");
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
      const josnData = json.data;
      let newArray = [];
      josnData.map((item) => {
        newArray.push({ img: item.image });
        setBannerData(newArray);
        console.log("bannerData===", newArray);
      });
    } catch (error) {}
  };

  // let datesWhitelist = [
  //   {
  //     start: moment(),
  //     end: moment().add(2, "days"),
  //   },
  // ];
  const onDateSelected = (selectedDate) => {
    setSlctedata(selectedDate.format("YYYY-MM-DD"));

    getInputData(selectedDate.format("YYYY-MM-DD"));
  };

  var daietatarespon = [];
  const getInputData = async (dateSelected) => {
    try {
      // setLoading(true);
      // let letdata = slctedata
      //   ? slctedata
      //   : datesWhitelist[0].start.format("YYYY-MM-DD");
      let letdata = dateSelected
        ? dateSelected
        : moment().format("YYYY-MM-DD");
      let usertoken = await AsyncStorage.getItem("usertoken");
      console.log(EndUrl.gloabalurl + "diet/" + letdata,'my diet',{
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      })
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
      // let r = await convertIntoDateFormat(letdata, true);
      console.log("deit->", letdata, response);
      if (response.status == 200) {
        setLoading(false);
        const json = await response.json();
        setChatNutrintion(json.calendarOrDietShow)
        if(json.datesList.length===0){
          setNoData(true)
        }
        // if(json.message==='Diet Not found!!'){
        //   setNoData(true)
        //   console.log('going here')
        // }
        console.log("deit->data", json);
        setTotalcalories(json?.total_calorie);
        SetDisclimer(json?.disclaimer);
        setDaysLeft(json?.days_left);
        setDatesWhitelist(json?.datesList?.map(d => ({
          start: d,
          end: d,
        }))
        )
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
        console.log("diet==>", daietatarespon);
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
        getInputData(slctedata);
        bannerData();
        getMovies();
        getPlan();
        getMyOrder();
        getReadMore();
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [route, slctedata]);

  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };
  const getMyOrder = async () => {
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
      // setChatNutrintion(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const getReadMore = async (id, plan, planImage) => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await fetch(EndUrl.gloabalurl + `features/${id}`);
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
      let data = json.data;
      setRead(data);
      setPlanType(plan);
      setPlanImage(planImage);
      setId(id);
      setTimeout(() => {
        setModalVisible(!isModalVisible);
      }, 800);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

const CustomeHeader = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const showBack = route?.params?.showHeader ?? true;

  if (chatNutrintion) {
    return (
      <Header
        chatLogo
        backButtonwithtext={showBack}
        headerBackButton={true}
        chat
        navigation={navigation}
      />
    );
  } else {
    return (
      <Header
        chatLogo
        backButtonwithtext={showBack}
        headerBackButton={true}
        navigation={navigation}
        backButtonCustomFun={() => navigation.navigate("TabNavigators", {
            screen: "Offerings Page",
          })}
      />
    );
  }
};

  const renderItem = ({ item }) => {
    return (
      <HomePlanComponent
        plan={item.feature_three}
        textOne={item.title}
        textTwo={item.feature_one}
        textThree={item.feature_two}
        priceOne={item.price}
        priceTwo={item.price}
        special_price={item.special_price}
        button={"Create Diet Profile and Pay"}
        loginLogo={item.image}
        onPress={() => getReadMore(item.id, item.title, item.image, true)}
        color={"#132742"}
        offer={item.discount}
        planColor={"#F79489"}
        // chatPress={() => navigation.navigate('chatbot')}
        chatPress={() => updagradePlane(item.id)}
        planheadingColor={"#999999"}
        id={item.id}
      />
    );
  };
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <CustomeHeader />
      {chatNutrintion &&
      loading == false && !noData ? (
        <View
          style={{ display: "flex", width: "100%", flex: 1, height: height }}
        >
          <View style={styles.calenderStyle}>
            <View style={{ height: 10, width: "100%" }}>
              <CalendarStrip
                datesWhitelist={datesWhitelist}
                onDateSelected={onDateSelected}
                //calendarAnimation={{ type: "sequence", duration: 30 }}
                daySelectionAnimation={{
                  type: "background",
                  duration: 200,
                  borderWidth: 1,
                  borderHighlightColor: "#132742",
                  color: "#FFF",
                  highlightColor: "#132742",
                }}
                selectedDate={slctedata}
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
                scrollable
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
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: 10,
              marginTop: 5,
              elevation: 10,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
            }}
          >
            <Text style={{ fontSize: 14, color: "#99999" }}>
              {daysLeft} days left
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 25,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 17, color: "#99999" }}>
              Assigned calories
            </Text>
            <Text>{totalcalories} kcal</Text>
          </View>
          <FlatList
            extraData={dietData}
            data={dietData}
            initialNumToRender={4}
            style={{ paddingVertical: 0, marginBottom: 0, height: "100%" }}
            keyExtractor={(item, index) => item.key}
            ListEmptyComponent={() => (
                <Text style={[{ marginTop:30,marginBottom: 5, marginLeft: 5, color: "#000", textAlign: "center", fontSize:22 }]}>No Diets Available</Text>
              )}
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
                style={{
                  height: 100,
                  width: width,
                  paddingTop: 0,
                  marginTop: 3,
                }}
              />
            </View>
          ) : null}
        </View>
      ) : (/*null*/
        <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
          <Image
            source={require('../../assets/icons/dietIcon.png')}
            resizeMode="contain"
            style={{width:160,height:160, marginBottom:20}}
          />
          <Text style={{fontSize: 22,
              fontFamily: fonts.whitneyMedium,
              color: colors.themeColor,}}>Enroll for an improvement plan</Text>
        </View>
        // <ScrollView style={{ flex: 1 }}>
        //   {loading == false && (
        //     <View
        //       style={{
        //         height: height * 0.3,
        //         width: width,
        //         alignSelf: "center",
        //         top: 2,
        //       }}
        //     >
        //       <ImageSlider
        //         data={bannerdata}
        //         autoPlay={true}
        //         closeIconColor="#fff"
        //         onClick={() => console.log("press")}
        //       />
        //     </View>
        //   )}
        //   {loading == false && (
        //     <OfferComponent
        //       source={titleText != null ? titleText.image : ""}
        //       discount={titleText != null ? titleText.discount : ""}
        //     />
        //   )}
        //   {loading == false && (
        //     <FlatList
        //       data={plan}
        //       keyExtractor={(item) => item.id}
        //       renderItem={renderItem}
        //     />
        //   )}
        // </ScrollView>
      )}
      <ModalTester
        isVisible={isModalVisible}
        toggleModal={toggleModal}
        data={read}
        planType={planType}
        planImage={planImage}
        loading={loading}
        modalPress={() => updagradePlane(id)}
        id={id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  titleText: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
  calenderStyle: {
    height: 110,
    width: "100%",
    alignItems: "center",
    alignSelf: "center",
    top: 10,
    // backgroundColor: 'white'
  },
  footertext: {
    flex: 1,
    marginTop: 10,
    height: 100,
    width: "100%",
    color: "black",
    backgroundColor: "red",
    marginBottom: 10,
  },
  flatlistStyle: {
    backgroundColor: "red",
  },
});

export default MyDietScreen;
