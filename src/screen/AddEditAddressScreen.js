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
  
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  FlatList,
  StatusBar,
} from "react-native";
Animated.Text.propTypes = Animated.Text.propTypes || Text.propTypes;
import CheckBox from "@react-native-community/checkbox";
import HTMLView from "react-native-htmlview";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import Header from "../component/Header";
import { TextField } from "rn-material-ui-textfield";
import PlacesAutocomplete from "../component/GoogleAutoCompleteComponent.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-simple-toast';
import AutoCompleteInput from "../component/AutoCompleteInput.js";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import EndUrl from "../api/EndUrl";
import fonts from "../utils/fonts.js";
import DeviceInfo from "react-native-device-info";
import { configs } from "../utils/configs.js";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const theme = "default";

const AddEditAddressScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const active = true;
  const [titleText, setTitleText] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState([]);
  const [itemText, setItemText] = useState([]);
  const [latLong, setLatLong] = useState(null);

  const win = Dimensions.get("window");
  const [showBox, setShowBox] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState();

  const [latLongError,setLatlongError]=useState();

  const [lastname, setLastname] = useState("");
  const [lastnameError, setLastnameError] = useState();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState();

  const [phone, setPhone] = useState("");
  const [phoneError, setphoneError] = useState();

  const [addreassid, setAddressId] = useState();

  const [address_1, setAddress_1] = useState("");
  const [address_2, setAddress_2] = useState("");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [isSelected, setSelection] = useState(false);
  const [isSunSelected, setSundSelection] = useState(false);
  const [disableColer, setDisableColer] = useState("#F79489");

  const [ismodesection, setIshomesection] = useState(true);
  const [isvalidate, setIsvalidate] = useState(0);

  const [homeradiSelcted, setHomeradiSelcted] = useState(false);
  const [officeradiSelcted, setOfficeradiSelcted] = useState(false);

  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });

  // ------------------------------------------------------------------
  //  UPDATED VALIDATION LOGIC
  // ------------------------------------------------------------------
 const checkValidate = () => {
  let valid = true;
  let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  let phoneReg = /^[0-9]+$/;

  // Reset all errors first
  setFirstnameError(null);
  setLastnameError(null);
  setEmailError(null);
  setphoneError(null);

  // FIRST NAME
  if (!firstname.trim()) {
    setFirstnameError("First name is required");
    valid = false;
  }

  // LAST NAME
  if (!lastname.trim()) {
    setLastnameError("Last name is required");
    valid = false;
  }

  // EMAIL
  if (!email.trim()) {
    setEmailError("Email is required");
    valid = false;
  } else if (!emailReg.test(email)) {
    setEmailError("Invalid email format");
    valid = false;
  }

  // PHONE
  if (!phone.trim()) {
    setphoneError("Phone number is required");
    valid = false;
  } else if (!phoneReg.test(phone)) {
    setphoneError("Phone must be numeric");
    valid = false;
  } else if (phone.length < 10) {
    setphoneError("Phone number should be at least 10 digits");
    valid = false;
  }

  // STATE
  if (!state.trim()) {
    valid = false;
  }

  // PINCODE
  if (!postalCode.trim()) {
    valid = false;
  }

  // ADDRESS LINE 1
  if (!address_1.trim()) {
    valid = false;
  }

  // LAT/LNG
  if (!latLong || !latLong.lat || !latLong.lng) {
    setLatlongError("Please select a valid location ");
    valid = false;
  }

  // Update button color and isvalidate
  if (valid) {
    setDisableColer("#F79489");
    setIsvalidate(1);
  } else {
    setDisableColer("#F79489");
    setIsvalidate(0);
  }

  return valid;
};



  const validateForm = () => {
    return checkValidate();
  };
  // ------------------------------------------------------------------


  const _updateAddress = async () => {
    if (!validateForm()) return;

    var postpayload = {
      address_type: ismodesection,
      address_1: address_1,
      address_2: address_2,
      country: "India",
      state: state,
      city: city,
      postalCode: postalCode,
      email: email,
      phone: phone,
      first_name: firstname,
      address_id: addreassid,
      last_name: lastname,
      landmark: locality,
      home_office: ismodesection,
      open_on_saturday: isSelected,
      open_on_sunday: isSunSelected,
      latitude: latLong?.lat,
      longitude: latLong?.lng
    };

    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.updateaddress, {
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

      const json = await response.json();
      if (json.status == 200) {
        showMessage({
          message: "Your address was updated successfully",
          duration: 5000,
          type: "success",
        });
        navigation.goBack()
      }
    } catch (error) {
      console.error(error);
    }
  };

  const _onPressButton = async () => {
    if (!validateForm()) return;

    var postpayload = {
      address_type: ismodesection,
      address_1: address_1,
      address_2: address_2,
      country: "India",
      state: state,
      city: city,
      postalCode: postalCode,
      email: email,
      phone: phone,
      first_name: firstname,
      last_name: lastname,
      landmark: locality,
      home_office: ismodesection,
      open_on_saturday: isSelected,
      open_on_sunday: isSunSelected,
      latitude: latLong?.lat,
      longitude: latLong?.lng
    };

    let usertoken = await AsyncStorage.getItem("usertoken");

    try {
      const response = await fetch(EndUrl.addaddress, {
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

      const json = await response.json();

      if (json.status == 200) {
        showMessage({
          message: "Your address was added successfully",
          duration: 5000,
          type: "success",
        });
        if (route.params.redication) {
          navigation.goBack();
        } else {
          navigation.replace("Address");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAddressByid = async () => {
    if (route.params.action?.toLowerCase() === "edit") {
      let usertoken = await AsyncStorage.getItem("usertoken");
      try {
        const response = await fetch(EndUrl.editaddress + route.params.id, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            token: JSON.parse(usertoken),
            Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
            Platform: Platform.OS,
          },
        });

        const json = await response.json();
        if (json.status == 200) {
          let customeAddress = json.data[0];
          setFirstname(customeAddress.first_name);
          setLastname(customeAddress.last_name);
          setEmail(customeAddress.email);
          setAddressId(customeAddress.id);
          setPhone(customeAddress.phone);
          setAddress_1(customeAddress.address_line_1);
          setAddress_2(customeAddress.address_line_2);
          setState(customeAddress.state);
          setCity(customeAddress.city);
          setLocality(customeAddress.landmark);
          setPostalCode(customeAddress.postalcode);

          if (customeAddress.open_on_sunday == 1) setSundSelection(true);
          if (customeAddress.open_on_saturday == 1) setSelection(true);
          setIshomesection(customeAddress.home_office);

          if (customeAddress.home_office == 0) setHomeradiSelcted(true);
          if (customeAddress.home_office == 1) setOfficeradiSelcted(true);

          setIsvalidate(1);
          setDisableColer("#F79489");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onRadioBtnClick = (id) => {
    if (id == 1) {
      setHomeradiSelcted(true);
      setOfficeradiSelcted(false);
      setIshomesection(0);
    }
    if (id == 2) {
      setHomeradiSelcted(false);
      setOfficeradiSelcted(true);
      setIshomesection(1);
    }
  };

  const RadioButton = ({ onPress, selected, children }) => (
    <View style={styles.radioButtonContainer}>
      <TouchableOpacity onPress={onPress} style={styles.radioButton}>
        {selected ? <View style={styles.radioButtonIcon} /> : null}
      </TouchableOpacity>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.radioButtonText}>{children}</Text>
      </TouchableOpacity>
    </View>
  );

  const _onPresCancle = () => navigation.goBack();

  const addRessload = async () => {
    try {
      setCategoryTitle(route.params.menuTitle);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    addRessload();
    getAddressByid();
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer}>
      <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
              keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0} 
            >
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
           <View style={styles.addressbox}>
              <PlacesAutocomplete
        apiKey={configs.GOOGLE_PLACES_KEY}
        onPlaceSelected={(placeItem) => {
  console.log(placeItem, "placeItem");
  setLatlongError()

  // --- DETAILS EXIST CHECK ---
  const details = placeItem?.details ?? {};

  // LAT/LNG
  if (details.location) {
    setLatLong(details.location);
  }

  // MAIN TEXT (Street)
  // if (placeItem?.mainText) {
  //   setAddress_1(placeItem.mainText);
  // }

  // // SECONDARY TEXT (Area, locality)
  // if (placeItem?.secondaryText) {
  //   setAddress_2(placeItem.secondaryText);
  // }

  // // POSTAL CODE
  // if (details.postalCode) {
  //   setPostalCode(details.postalCode);
  // }

  // // STATE
  // if (details.state) {
  //   setState(details.state);
  // }

  // // CITY
  // if (details.city) {
  //   setCity(details.city);
  // }
}}

        placeholder="Search Location"
      />
      {latLongError ? (
                <Text style={styles.error}>{latLongError}</Text>
              ) : null}
            </View>
          <View style={styles.halfholder}>
            <View style={{ width: "45%", marginRight: 5 }}>
              <TextField
                tintColor={"#999"}
                required
                label="First Name *"
                value={firstname}
                onChangeText={setFirstname}
              />
              {firstnameError ? (
                <Text style={styles.error}>{firstnameError}</Text>
              ) : null}
            </View>
            <View style={{ width: "50%" }}>
              <TextField
                required
                tintColor={"#999"}
                variant="filled"
                label="Last Name *"
                value={lastname}
                onChangeText={setLastname}
                style={{ width: "50%" }}
              />
              {lastnameError ? (
                <Text style={styles.error}>{lastnameError}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.addressHolder}>
            <View style={styles.addressbox}>
              <TextField
                variant="filled"
                tintColor={"#999"}
                label="Phone Number *"
                value={phone}
                onChangeText={setPhone}
              />
              {phoneError ? (
                <Text style={styles.error}>{phoneError}</Text>
              ) : null}
              <TextField
                tintColor={"#999"}
                label="Email *"
                value={email}
                onChangeText={setEmail}
              />
              {emailError ? (
                <Text style={styles.error}>{emailError}</Text>
              ) : null}
            </View>

           

            <View style={styles.halfholder}>
              <View style={{ width: "45%", marginRight: 5 }}>
                <TextField
                  tintColor={"#999"}
                  required
                  label="Pincode"
                  value={postalCode}
                  onChangeText={setPostalCode}
                />
              </View>
              <View style={{ width: "50%" }}>
                <TextField
                  tintColor={"#999"}
                  required
                  variant="filled"
                  label="State"
                  value={state}
                  onChangeText={setState}
                  style={{ width: "50%" }}
                />
              </View>
            </View>

            <View style={styles.addressbox}>
              <TextField
                required
                tintColor={"#999"}
                variant="filled"
                label="Address"
                value={address_1}
                onChangeText={setAddress_1}
              />
              <TextField
                required
                tintColor={"#999"}
                variant="filled"
                label=""
                value={address_2}
                onChangeText={setAddress_2}
              />
              <TextField
                required
                tintColor={"#999"}
                variant="filled"
                label="City/ District *"
                value={city}
                onChangeText={setCity}
              />
              <TextField
                required
                tintColor={"#999"}
                label="Landmark"
                value={locality}
                onChangeText={setLocality}
              />
            </View>

            <View style={styles.addressTypeholder}>
              <View style={{ paddingRight: 5, paddingLeft: 5 }}>
                <Text style={{ marginBottom: 5, marginTop: 4 }}>
                  Type of Address *
                </Text>
                <View style={styles.halfholder}>
                  <RadioButton
                    onPress={() => onRadioBtnClick(1)}
                    selected={homeradiSelcted}
                  >
                    Home
                  </RadioButton>
                  <RadioButton
                    onPress={() => onRadioBtnClick(2)}
                    selected={officeradiSelcted}
                  >
                    Office
                  </RadioButton>
                </View>
                {ismodesection ? (
                  <View>
                    <Text>Is your office open on weekends ? </Text>
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        tintColors={{ true: "#132742" }}
                        value={isSelected}
                        onValueChange={setSelection}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>Open on Saturday</Text>
                    </View>
                    <View style={styles.checkboxContainer}>
                      <CheckBox
                        tintColors={{ true: "#132742" }}
                        value={isSunSelected}
                        onValueChange={setSundSelection}
                        style={styles.checkbox}
                      />
                      <Text style={styles.label}>Open on Sunday</Text>
                    </View>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* FOOTER BUTTONS */}
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

        <TouchableHighlight
          onPress={() => {
            if (checkValidate()) {
              // All fields valid → proceed
              route.params.action?.toLowerCase() === "edit" ? _updateAddress() : _onPressButton();
            } else {
              // At least one error → errors already set, shown below fields
              Toast.show("Please fix all errors", Toast.SHORT);
            }
          }}
          style={{ width: "50%", padding: 10, backgroundColor: disableColer }}
        >
          <Text
            style={{
              width: "100%",
              textAlign: "center",
              fontFamily: fonts.whitneySemiBold,
              fontSize: 20,
              color: "#FFF",
            }}
          >
            SAVE
          </Text>
        </TouchableHighlight>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
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
    justifyContent: "center",
    alignItems: "center",
    height: 45,
  },
  halfholder: {
    flexDirection: "row",
    paddingRight: 5,
    paddingLeft: 5,
    backgroundColor: "#FFF",
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

export default AddEditAddressScreen;
