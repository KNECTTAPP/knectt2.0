import React, { useState, Component, useEffect, useCallback } from "react";
import {
  Platform,
  View,
  Button,
  Animated,
  Text,
  Image,
  TextInput,
  Linking,
  Dimensions,
  TouchableHighlight,
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
Animated.Text.propTypes = Animated.Text.propTypes || Text.propTypes;
import CheckBox from "@react-native-community/checkbox";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import Header from "../component/Header";
//import Feather from "react-native-feather1s";
import { TextField } from "react-native-materialui-textfield";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import noProfile from "../../assets/icons/noimageprofile.png";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts.js";
import DeviceInfo from "react-native-device-info";
const theme = "default";
const AccountProfileScreen = ({ navigation, route }) => {
  const active = true;
  const [titleText, setTitleText] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("Edit Profile");
  const [itemText, setItemText] = useState([]);
  const win = Dimensions.get("window");
  const [showBox, setShowBox] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState();
  const [lastnameError, setLastnameError] = useState();
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [addreassid, setAddressId] = useState();
  const [emailError, setEmailError] = useState();
  const [phone, setPhone] = useState("");
  const [phoneError, setphoneError] = useState();
  const [address_1, setAddress_1] = useState("");
  const [address_2, setAddress_2] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isSelected, setSelection] = useState(false);
  const [isSunSelected, setSundSelection] = useState(false);
  const [disableColer, setDisableColer] = useState("#CCC");
  const [ismodesection, setIshomesection] = useState(true);
  const [isvalidate, setIsvalidate] = useState(0);
  const [homeradiSelcted, setHomeradiSelcted] = useState(false);
  const [officeradiSelcted, setOfficeradiSelcted] = useState(false);
  const [usertoken, setUsertoken] = useState();
  const [useriamge, setUseriamge] = useState();
  const [photo, setPhoto] = React.useState(null);

  const handleChoosePhoto = async () => {
    launchImageLibrary({ noData: true }, (response) => {
      console.log(response);
      try {
        if (response) {
          //setPhoto(response.assets[0]);
          handleUploadPhoto(response.assets[0]);
        }
      } catch (error) {
        console.log("error", error);
      }
    });
  };

  const handleUploadPhoto = async (photo) => {
    try {
      console.log(photo);
      let usertoken = await AsyncStorage.getItem("usertoken");
      //const data = new FormData();
      const file = {
        uri: photo.uri,
        name: photo.fileName,
        type: photo.type,
      };
      const body = new FormData();
      body.append("image", file);
      const response = await fetch(EndUrl.updateprofile, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
        body,
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
      if (json.status == 200) {
        getProfile();
      }
      showMessage({
        message: "Your Profile picture was Update successfully",
        duration: 2000,
        type: "success",
      });
      console.log(json);
    } catch (error) {
      console.log("error", error);
    }
  };

  const _onPressButton = async () => {
    if (isvalidate == 1) {
      var postpayload = {
        email: email,
        first_name: firstname,
        last_name: lastname,
      };
      let usertoken = await AsyncStorage.getItem("usertoken");
      try {
        //console.log(JSON.stringify(postpayload));
        const response = await fetch(EndUrl.updateprofile, {
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
        console.log(json);
        if (json.status == 200) {
          showMessage({
            message: "Your profile details has been updated successfully",
            duration: 2000,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        //setLoading(false);
      }
    }
  };

  const checkValidate = (filed) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (filed == "email") {
      if (reg.test(email) === false) {
        setEmailError("Email is Not Correct");
        setIsvalidate(0);
      } else {
        setEmailError();
      }
    }
    if (filed == "firstname") {
      if (firstname.trim() == "") {
        setFirstnameError("This is required field");
        setIsvalidate(0);
      } else {
        setFirstnameError();
      }
    }
    if (filed == "lastname") {
      if (lastname.trim() == "") {
        setLastnameError("This is required field");
        setIsvalidate(0);
      } else {
        setLastnameError();
      }
    }
    if (firstname.trim() != "" && lastname.trim() != "" && email.trim() != "") {
      setDisableColer("#F79489");
      setIsvalidate(1);
    }
  };

  const _onPresCancle = () => {
    navigation.goBack();
  };

  const getProfile = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    try {
      const response = await fetch(EndUrl.getprofile, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
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
      const json = await response.json();
      if (json.status == 200) {
        console.log(json);
        setUseriamge(json.data[0].image);
        setEmail(json.data[0].email);
        setFirstname(json.data[0].first_name);
        setLastname(json.data[0].last_name);
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  const addRessload = async () => {
    try {
      setCategoryTitle(route.params.menuTitle);
      console.log(route.params);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
    //getAddressByid();
  }, []);

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
          <View style={{ width: "100%", marginRight: 5 }}>
            <View style={styles.profileholder}>
              
              {useriamge ? (
                <Image source={{ uri: useriamge }} style={styles.userimagepo} />
              ) : (
                <Image source={noProfile} style={styles.sideMenuProfileIcon} />
              )}
            </View>
          </View>
          <View style={styles.halfholder}>
            <View style={{ width: "45%", marginRight: 5 }}>
              <TextField
                required
                label="First Name *"
                value={firstname}
                onChangeText={setFirstname}
                onBlur={(e) => checkValidate("firstname")}
              />
              {firstnameError ? (
                <Text style={styles.error}>{firstnameError}</Text>
              ) : null}
            </View>
            <View style={{ width: "50%" }}>
              <TextField
                required
                variant="filled"
                label="Last Name *"
                value={lastname}
                onChangeText={setLastname}
                style={{ width: "50%" }}
                onBlur={(e) => checkValidate("state")}
              />
              {lastnameError ? (
                <Text style={styles.error}>{lastnameError}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.addressHolder}>
            <View style={styles.addressbox}>
              <View>
                <TextField
                  label="Email *"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={(e) => checkValidate("email")}
                />
                {emailError ? (
                  <Text style={styles.error}>{emailError}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.butnActionholder}>
        <View style={{ width: "50%", padding: 5 }}>
          <Text style={{ width: "100%", textAlign: "center" }}>
            <TouchableHighlight
              onPress={_onPresCancle}
              style={{ width: "100%" }}
            >
              <Text style={{ fontFamily: fonts.whitneySemiBold, fontSize: 20 }}>
                CANCEL
              </Text>
            </TouchableHighlight>
          </Text>
        </View>
        <View
          style={{ width: "50%", padding: 10, backgroundColor: disableColer }}
        >
          <Text style={{ width: "100%", textAlign: "center" }}>
            <TouchableHighlight
              onPress={isvalidate == 1 ? _onPressButton : null}
              style={{ width: "100%" }}
            >
              <Text
                style={{
                  fontFamily: fonts.whitneySemiBold,
                  fontSize: 20,
                  color: "#FFF",
                }}
              >
                SAVE
              </Text>
            </TouchableHighlight>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  editIcon: {
    position: "absolute",
    color: "#F79489",
    right: 10,
    top: 30,
    fontWeight: 700,
    fontSize: 30,
  },
  profileholder: {
    width: 200,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    height: 200,
    marginBottom: 0,
    alignSelf: "center",
  },
  userimagepo: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  sideMenuProfileIcon: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  addressTypeholder: {
    marginTop: 3,
    flex: 1,
    backgroundColor: "#FFF",
  },
  addressbox: {
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingLeft: 5,
  },
  addressHolder: {
    marginTop: 10,
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
  },
  butnActionholder: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    marginTop: 5,
    justifyContent: "center", //Centered horizontally
    alignItems: "center", //Centered vertically
    height: 45,
  },
  halfholder: {
    flexDirection: "row",
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: "#FFF",
  },
  inptutfull: {
    flex: 1,
    width: "100%",
  },
  inputtxt: {
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    paddingBottom: 1,
  },
  fullbox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#132742",
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  error: {
    color: "red",
  },
});
export default AccountProfileScreen;
