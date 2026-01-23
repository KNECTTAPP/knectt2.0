import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import Images from "../component/Images";
import loginLogo from "../../assets/img/BrandLogo.png";
import { ButtonCustom } from "../component/ButtonCustom";
import { ProgressLoader } from "../component/ProgressLoader";
import Toast from "react-native-simple-toast";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EndUrl from "../api/EndUrl";
import Header from "../component/Header";

const Fewbasicinfo = ({ route, navigation }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPhone, setConfirmPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [deviceid, setDeviceid] = useState();
  const [companyCode,setCompanyCode]=useState('');
  const [email, setEmail] = useState(
    route?.params?.email ? route?.params?.email : ""
  );
  const [userid, setuserid] = useState("");

  useEffect(() => {
    DeviceInfo.getAndroidId().then((androidId) => {
      setDeviceid(androidId);
    });
    getUserData();
    loadProfile()
  }, []);

 const loadProfile = async () => {
  try {
    const profile = await getProfileData();
    setUserData(profile);
  } catch (error) {
    console.log("Profile error:", error.message);
  }
};
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("userData");
      if (value !== null) {
        const parsedData = JSON.parse(value);
        console.log("Retrieved user data:", parsedData);

        setuserid(parsedData[0]?.user_id);
        // setEmail(parsedData[0]?.email);
        // setName(parsedData[0]?.name);
        setPhone(parsedData[0]?.mobile);
        // setConfirmPhone(parsedData[0]?.mobile);
        return parsedData;
      } else {
        console.log("No user data found");
        return null;
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      return null;
    }
  };
  const handleSubmit = () => {
    if (!name || !phone || !confirmPhone) {
      Toast.show("Please fill out all fields", Toast.SHORT);
      //   Alert.alert("Error", "Please fill out all fields");
    } else if (phone !== confirmPhone) {
      Toast.show("Phone numbers do not match", Toast.SHORT);
      //   Alert.alert("Error", "Phone numbers do not match");
    } else {
      profileValidation();
      //   navigation.replace("TabNavigators", {
      //     screen: "Home",
      //     params: {
      //       loading: loading,
      //     },
      //   });
    }
  };
  const profileValidation = async () => {
    setLoading(true);
    var body = new FormData();
    body.append("email", email);
    body.append("name", name);
    body.append("device_id", deviceid ? deviceid : "1234567890");
    body.append("mobile", phone);
    body.append("mobile_confirmation", confirmPhone);
    body.append("user_id", userid);
    body.append("corporate_code",companyCode)

    // body.append("affiliate_code", affiliateCode);
    console.log(body, "its nody");
    try {
      const response = await fetch(EndUrl.profilecomplete, {
        method: "POST",
        headers: {
          // Accept: "application/json",
          // "Content-Type":"multipart/form-data; boundary=<calculated when request is sent>",
          "X-SECURE-KEY": "Jsh8sDk28nLmPqRsWvXyZt1234567890@knectt",
          // Platform: Platform.OS,
        },
        body: body,
      });
      // const updateAvailable = response.headers.get("updateAvailable");
      // const forceUpdate = response.headers.get("forceUpdate");
      // if (updateAvailable) {
      //   await AsyncStorage.setItem("updateAvailable", "true");
      // }
      // if (forceUpdate) {
      //   await AsyncStorage.setItem("forceUpdate", "true");
      // }
      const json = await response.json();
      setLoading(false);
      console.log("response-->", JSON.stringify(response));

      if (json.status == 200) {
        console.log("dataLo-->", JSON.stringify(json));
        setLoading(false);
        await AsyncStorage.setItem(
          "usertoken",
          JSON.stringify(json.data[0].token)
        );

        // await AsyncStorage.setItem("userData", JSON.stringify(json.data));
        // global.userdata = json.data[0];
        if (!route?.params?.email) {
          Toast.show(json.message, Toast.SHORT);
          navigation.goBack();
        } else {
          navigation.replace("TabNavigators", {
        screen: "ChatScreen",
        });
        }
      } else {
        setLoading(false);
        console.log(json,'error')
        Toast.show(json.message, Toast.SHORT);
      }
    } catch (error) {
      setLoading(false);

      //console.log(error);
      //console.log(EndUrl.otp+phoneNumber+'/'+otpNumber);
    }
  };

  return (

    <View style={styles.container}>
      {loading && <ProgressLoader isVisible={loading} />}
      {!route?.params?.email && (
        <Header
          categoryTitle={"Edit Basic Info"}
          //cartCountshow={cartCountshow}
          backButtonwithtext
          // notification
          // cart
        />
      )}
      {/* <ProgressLoader isVisible={loading} /> */}

      <ScrollView
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Images
          source={loginLogo}
          imageStyle={{
            height: 200,
            width: 200,
            marginTop: "10%",
            // marginBottom: "50%",
          }}
        />
        <View style={{ justifyContent: "center", marginTop: "20%" }}>
          <Text
            style={{
              fontSize: 17,
              bottom: 10,
              marginLeft: 14,
              fontFamily: "Verdana",
              color: "#000",
            }}
          >
            Few basic info
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter Company Code"
          onChangeText={setCompanyCode}
          value={companyCode}
          returnKeyType="next"
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          onChangeText={setName}
          value={name}
          returnKeyType="next"
        />
        <View style={styles.container1}>
          <View style={styles.prefixContainer}>
            <Image
              source={{ uri: "https://flagcdn.com/w40/in.png" }}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.input1}
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            onChangeText={(text) => setPhone(text)}
            maxLength={10}
            value={phone}
            returnKeyType="done"
          />
        </View>

        {/* <TextInput
          style={styles.input}
          placeholder="Enter Phone Number"
          keyboardType="phone-pad"
          onChangeText={(text) => setPhone(text)}
          maxLength={10}
          value={phone}
          returnKeyType="done"
        /> */}
        <View style={styles.container1}>
          <View style={styles.prefixContainer}>
            <Image
              source={{ uri: "https://flagcdn.com/w40/in.png" }}
              style={styles.flag}
            />
            <Text style={styles.countryCode}>+91</Text>
          </View>
          <TextInput
            style={styles.input1}
            placeholder="Enter Confirm Phone Number"
            keyboardType="phone-pad"
            maxLength={10}
            onChangeText={(text) => setConfirmPhone(text)}
            value={confirmPhone}
            returnKeyType="done"
          />
        </View>

        <View style={styles.buttonView}>
          <ButtonCustom
            containerStyle={{
              width: "100%",
              backgroundColor: "#F79489",
              borderRadius: 8,
              // paddingVertical: 10,
              height: 48,
            }}
            titleStyle={{ fontSize: 17, color: "#fff" }}
            title={"SUBMIT"}
            onPress={() => {
              handleSubmit();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Fewbasicinfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
    marginHorizontal: 15,
    fontSize: 15,
    color: "#000",
  },
  buttonView: {
    width: "92%",
    alignSelf: "center",
    marginTop: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.65,
    marginBottom: "60%",
  },
  container1: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    // paddingVertical: 8,
    backgroundColor: "#fff",
    height: 50,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  prefixContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 4,
  },
  countryCode: {
    fontSize: 16,
  },
  input1: {
    flex: 1,
    fontSize: 16,
    // backgroundColor: "red",
    paddingVertical: 10,
  },
});
