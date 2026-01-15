import React, { useState, Component, useEffect } from "react";
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
  Keyboard,
  Animated,
 useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TextField } from "rn-material-ui-textfield";
import { ProgressLoader } from "../component/ProgressLoader";
import DropdownComponent from "../component/DropdownComponent";
import { launchImageLibrary } from "react-native-image-picker";
import Header from "../component/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import EndUrl from "../api/EndUrl";
import { IconPaperClip } from "../component/IconComp";
import { ButtonCustom } from "../component/ButtonCustom";
import Loader from "../component/Loader";
import appsFlyer from "react-native-appsflyer";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import { isValidUpiFormat } from "../utils/commonFunctions";
import { is } from "date-fns/locale";
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const AffiliateCreateScreen = ({ navigation, route }) => {
  const referralBase = "https://knectt.onelink.me/y1Mk/39b38ytg";
  const active = true;
  const [titleText, setTitleText] = useState(null);
  const [perfix, setPerfix] = useState("mr");
  const [showBox, setShowBox] = useState(true);
  const [firstname, setFirstname] = useState("");
  const [firstnameError, setFirstnameError] = useState();
  const [lastnameError, setLastnameError] = useState();
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [confirmEmailError, setConfirmEmailError] = useState();
  const [addreassid, setAddressId] = useState();
  const [emailError, setEmailError] = useState();
  const [phone, setPhone] = useState("");
  const [phoneError, setphoneError] = useState();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [read, setRead] = useState([]);
  const [id, setId] = useState();
  const [produuctData, setProduuctData] = useState([]);
  const isCarousel = React.useRef(null);
  const [topbanner, setTopbanner] = useState([]);
  const [homrBabber, setHomrBabber] = useState([]);
  const [footerTextdesc, setFooterTextdesc] = useState([]);
  const [categoryTitle, setCategoryTitle] = useState(
    "Affiliate Account Creation"
  );
  const [acnumber, setAcnumber] = useState("");
  const [acNumnerError, setAcNumnerError] = useState("");
  const [itemText, setItemText] = useState([]);
  const [usertoke, SetUsertoke] = useState();
  const [bankName, setBankName] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [upi, setUpi] = useState("");
  const [bankNameError, setBankNameError] = useState();
  const [acHolderErr, setAcHolderError] = useState();
  const [ifc, setIfc] = useState("");
  const [ifcError, setIfcError] = useState();
  const [kycError, setKycError] = useState();
  const [cityError, setCityError] = useState();
  const [city, setCity] = useState([]);
  const [state, setState] = useState("");
  const [stateError, setStateError] = useState();
  const [cityValue, setCityValue] = useState(0);
  const [stateValue, setStateValue] = useState(0);
  const [branchName, setBranchName] = useState("");
  const [branchNameError, setBranchNameError] = useState();
  const [cartCountshow, setCartCountshow] = useState();
  const [gender, setGender] = useState("Male");
  const [genderError, setGenderError] = useState();
  const [verifyOtpfiled, setVerifyOtpfiled] = useState();
  const [verifyError, setVerifyError] = useState();
  const [accountType, setAccountType] = useState("upi");
  const [upiError, setUpiError] = useState();
  const [isIFSCVerified, setIsIfscVerified] = useState(false);
  const [isUPIVerified, setIsUPIVerified] = useState(false);
  const keyboardMargin = useSharedValue(0);

  const [isLiked, setIsLiked] = useState([
    { id: "m", value: true, name: "Male", selected: true },
    { id: "f", value: false, name: "Female", selected: false },
  ]);

  const [title, setTitle] = useState([
    { id: "mr", value: true, name: "Mr.", selected: true },
    { id: "ms", value: false, name: "Ms.", selected: false },
    { id: "dr", value: false, name: "Dr.", selected: false },
    { id: "fos", value: false, name: "FOS", selected: false },
  ]);

  const [photo, setPhoto] = useState();
  const handleChoosePhoto = async (response) => {
    launchImageLibrary({ noData: true }, (response) => {
      if (response.didCancel != true) {
        setPhoto(response.assets[0]);
      }
    });
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      keyboardMargin.value = withTiming(e.endCoordinates.height, {
        duration: 250,
      });
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      keyboardMargin.value = withTiming(0, { duration: 200 });
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    marginBottom: keyboardMargin.value,
  }));

  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });
  // const getCity = async () => {
  //   try {
  //     const response = await fetch(EndUrl.getallcity, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const json = await response.json();
  //     // console.log(json);
  //     var citylist = json.data;
  //     var clitylistarr = [];

  //     {
  //       citylist.map((item, i) =>
  //         clitylistarr.push({ label: item.city, value: item.id })
  //       );
  //     }
  //     setCity(clitylistarr);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     //setLoading(false);
  //   }
  // };
  const getStates = async () => {
    setLoading(true);
    const formData = new URLSearchParams();
    formData.append("country", "India");
    try {
      const response = await fetch(EndUrl.STATES_API, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
      console.log("json", JSON.stringify(json));
      var citylist = json.data;
      var clitylistarr = [];

      {
        citylist.map((item, i) =>
          clitylistarr.push({ label: item.name, value: item.id })
        );
      }
      console.log("clitylistarr", clitylistarr);

      setCity(clitylistarr);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSetAccountType = (accounttype) => {
    setAccountType(accounttype);
  };
  const onRadioBtnClick = (item) => {
    setGender(item.name);
    let updatedState = isLiked.map((isLikedItem) =>
      isLikedItem.id === item.id
        ? { ...isLikedItem, selected: true }
        : { ...isLikedItem, selected: false }
    );
    setIsLiked(updatedState);
  };

  const onRadioBtnClickTitle = (item) => {
    setPerfix(item.name);
    let updatedState = title.map((isLikedItem) =>
      isLikedItem.id === item.id
        ? { ...isLikedItem, selected: true }
        : { ...isLikedItem, selected: false }
    );
    setTitle(updatedState);
  };

  const checkValidate = async (filed) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (filed == "email") {
      if (email.trim() == "") {
        setEmailError("This is required field");
      } else {
        if (reg.test(email) === false) {
          setEmailError("Email is Not Correct");
        } else {
          setEmailError();
        }
      }
    }
    if (filed == "confirmEmail") {
      if (confirmEmail.trim() == "") {
        setConfirmEmailError("This is required field");
      } else {
        if (reg.test(confirmEmail) === false) {
          setConfirmEmailError("Confirm Email is Not Correct");
        } else {
          setConfirmEmailError();
        }
      }
    }
    if (email && confirmEmail) {
      if (email != confirmEmail) {
        setConfirmEmailError("Email and Confirm Email must be same");
      } else {
        setConfirmEmailError();
      }
    }

    if (filed == "gender") {
      if (gender.trim() == "") {
        setGenderError("This is required field");
      } else {
        setGenderError();
      }
    }
    // if (filed == "city") {
    //   if (cityValue == 0) {
    //     setCityError("Please Select City");
    //
    //   } else {
    //     setCityError();
    //   }
    // }
    if (filed == "state") {
      if (!state) {
        setStateError("Please Select State");
      } else {
        setStateError();
      }
    }
    if (filed == "firstname") {
      if (firstname.trim() == "") {
        setFirstnameError("This is required field");
      } else {
        setFirstnameError();
      }
    }
    if (filed == "lastname") {
      if (lastname.trim() == "") {
        setLastnameError("This is required field");
      } else {
        setLastnameError();
      }
    }
    if (filed == "phone") {
      let phonereg = /^[0-9\b]+$/;
      if (phonereg.test(phone) === false) {
        setphoneError("Phone no. should be numeric");
      } else if (phone.length < 9) {
        setphoneError("phone no. should be greater than 10 digit number");
      } else {
        setphoneError();
      }
    }
    if (filed == "acnumber") {
      if (acnumber.trim() == "") {
        setAcNumnerError("This is required field");
      } else {
        setAcNumnerError();
      }
    }
    if (filed == "upi") {
      if (upi.trim() == "") {
        setUpiError("This is required field");
      } else {
        setUpiError();
      }
    }
    if (filed == "acHolder") {
      if (!accountHolderName) {
        setAcHolderError("This is required field");
      } else {
        setAcHolderError("");
      }
    }
    if (filed == "bankName") {
      if (bankName.trim() == "") {
        setBankNameError("This is required field");
      } else {
        setBankNameError();
      }
    }
    if (filed == "ifc") {
      if (!ifc) {
        setIfcError("Please enter IFSC ");
      } else if (!isIFSCVerified && ifc) {
        setIfcError("Please verify IFSC ");
      } else {
        setIfcError("");
      }
    }

    if (filed == "branchName") {
      if (branchName.trim() == "") {
        setBranchNameError("This is required field");
      } else {
        setBranchNameError();
      }
    }

    // if (accountType == "upi") {
    //   if (firstname.trim() != "" && lastname.trim() != "" && upi.trim() != "") {
    //     setIsvalidate(1);
    //   }
    // }

    // if (accountType == "account") {
    //   if (
    //     firstname.trim() != "" &&
    //     lastname.trim() != "" &&
    //     ifc.trim() != "" &&
    //     acnumber?.trim() != "" &&
    //     branchName.trim() != "" &&
    //     bankName.trim() != ""

    //   ) {
    //     setIsvalidate(1);
    //   }
    // }
  };
  const verifyOtp = async () => {
    checkValidate("email");
    if (!emailError) {
      alert("ok");
    }
  };
  const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    {
      const unsubscribe = navigation.addListener("focus", () => {
        // getCity();
        getStates();
        appsFlyer.setAppInviteOneLinkID("y1Mk", null);
      });

      // Return the function to unsubscribe from the event so it gets removed on unmount
      return unsubscribe;
    }
  }, [navigation]);

  const toggleModal = (id, openModal) => {
    setLoading(openModal);
    setLoading(false);
    setModalVisible(!isModalVisible);
  };

  const updateAffiliate = async (link, message) => {
    console.log("ebnterrer");

    var body = new FormData();
    body.append("share_link", link);
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.saveaffiliate, {
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
      console.log(json);

      if (json?.status == 200) {
        showMessage({
          message: message?.message,
          duration: 2000,
          type: "success",
        });
        await AsyncStorage.removeItem("referer");
        navigation.replace("AffiliateCredentials");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createAlliiate = async () => {
    const referData = await AsyncStorage.getItem("referer");
    const data = JSON.parse(referData);
    console.log("ss");

    checkValidate("firstname");
    checkValidate("lastname");
    checkValidate("email");
    checkValidate("confirmEmail");
    // checkValidate("city");
    checkValidate("state");
    if (accountType == "upi") {
      checkValidate("upi");
    } else {
      checkValidate("acHolder");
      checkValidate("acnumber");
      checkValidate("bankName");
      checkValidate("ifc");
      checkValidate("branchName");
    }
    // if (
    //   firstname &&
    //   lastname &&
    //   email &&
    //   state &&
    //   accountHolderName &&
    //   bankName &&
    //   acnumber &&
    //   ifc &&
    //   branchName &&
    //   isIFSCVerified
    // ) {
    setLoading(true);
    var body = new FormData();

    // if (photo) {
    //   const file = {
    //     uri: photo.uri,
    //     name: photo.fileName,
    //     type: photo.type,
    //   };
    //   body.append("kyc_image", file);
    // }

    if (accountType == "upi") {
      body.append("upi", upi);
    }
    body.append("first_name", firstname);
    body.append("last_name", lastname);
    body.append("gender", gender);
    body.append("email", email);
    body.append("title", perfix);
    body.append("state_id", state);

    if (accountType == "account") {
      body.append("bank_name", bankName);
      body.append("ifsc", ifc);
      body.append("branch", branchName);
      body.append("account_number", acnumber);
      body.append("account_holder_name", accountHolderName);
    }
    if (data) {
      body.append("affiliate_code", data?.data?.custom_param);
    }
    //
    console.log("body======>", body);
    // //saveaffiliate
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.saveaffiliate, {
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
      console.log(json);

      if (json.status == 200) {
        // appsFlyer.generateInviteLink(
        //   {
        //     channel: json?.affiliate_code,
        //     campaign: "myCampaign",
        //     customerID: "1234",
        //     userParams: {
        //       deep_link_value: "value", // Deep link param
        //       deep_link_sub1: "sub1", // Deep link param
        //       custom_param: json?.affiliate_code,
        //       brandDomain: "myexample.com",
        //     },
        //   },
        //   (link) => {
        //     updateAffiliate(link, json);
        //     console.log("link", link);
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );
        let referenceLink = `${referralBase}?ac=${json?.affiliate_code ?? ""}`;
        console.log(referenceLink, "thisisreferencelinkgenerateebyme");
        updateAffiliate(referenceLink, json);
      } else {
        showMessage({
          message: json.message,
          duration: 2000,
          type: "warning",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  // };
  const checkIfUserLogin = async () => {
    setLoading(true);
    const isLogin = await AsyncStorage.getItem("usertoken");
    if (isLogin) {
      createAlliiate();
    } else {
      alert("Please login to make affiliate");
    }
    setLoading(false);
  };
  const handleVerifyIfc = () => {
    let ifcReg = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (ifc.trim() == "") {
      setIfcError("This is required field");

      setIsIfscVerified(false);
    } else {
      if (ifcReg.test(ifc) === false) {
        setIfcError("IFC is not correct format");

        setIsIfscVerified(false);
      } else {
        setIfcError();
        setIsIfscVerified(true);
      }
    }
  };

  const handleValidateUpi = (text) => {
    if (upi?.trim() === "") {
      setUpiError("This is required field");
      setIsUPIVerified(false);
    } else {
      if (!isValidUpiFormat(upi?.trim())) {
        setUpiError("UPI is not correct format");
        setIsUPIVerified(false);
      } else {
        setUpiError();
        setIsUPIVerified(true);
      }
    }
  };
  const navigationData = () => {
    toggleModal();
    navigation.navigate("chatbot");
  };

  const win = Dimensions.get("window");

  return (
    <SafeAreaView style={[styles.screenContainer]}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <Loader loading={loading} />
      <FlashMessage />
      <Header categoryTitle={categoryTitle} backButtonwithtext />
      <ScrollView style={{ flex: 1 }}>
        <Animated.View
          style={[
            {
              width: "100%",
              padding: 0,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            animatedStyle,
          ]}
        >
          <View
            style={{
              width: "100%",
              padding: 5,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
          >
            <View>
              <Text style={styles.text}>Title</Text>
            </View>
            <View style={styles.halfholder}>
              {title.map((item) => (
                <RadioButton
                  onPress={() => onRadioBtnClickTitle(item)}
                  selected={item.selected}
                  key={item.id}
                >
                  {item.name}
                </RadioButton>
              ))}
            </View>
            <View style={{ marginLeft: 4 }}>
              <TextField
                required
                label="First Name *"
                value={firstname || ""}
                onChangeText={setFirstname}
                onBlur={(e) => checkValidate("firstname")}
              />
              {firstnameError ? (
                <Text style={styles.error}>{firstnameError}</Text>
              ) : null}
            </View>
            <View style={{ marginBottom: 0, marginTop: 0 }}>
              <TextField
                required
                variant="filled"
                label="Last Name *"
                value={lastname || ""}
                onChangeText={setLastname}
                onBlur={(e) => checkValidate("lastname")}
              />
              {lastnameError ? (
                <Text style={styles.error}>{lastnameError}</Text>
              ) : null}
            </View>
            <View style={{ marginBottom: 0, marginTop: 0 }}>
              <TextField
                required
                variant="filled"
                label="Email *"
                value={email || ""}
                onChangeText={setEmail}
                autoCapitalize="none"
                onBlur={(e) => checkValidate("email")}
              />
              {emailError ? (
                <Text style={styles.error}>{emailError}</Text>
              ) : null}
            </View>
            <View style={{ marginBottom: 0, marginTop: 0 }}>
              <TextField
                required
                variant="filled"
                label="Confirm Email *"
                value={confirmEmail || ""}
                onChangeText={setConfirmEmail}
                autoCapitalize="none"
                onBlur={(e) => checkValidate("confirmEmail")}
              />
              {confirmEmailError ? (
                <Text style={styles.error}>{confirmEmailError}</Text>
              ) : null}
            </View>
            <View>
              <Text style={styles.text}>Gender</Text>
            </View>
            <View style={styles.halfholder}>
              {isLiked.map((item) => (
                <RadioButton
                  onPress={() => onRadioBtnClick(item)}
                  selected={item.selected}
                  tintColors={{ true: "#132742" }}
                  key={item.id}
                >
                  {item.name}
                </RadioButton>
              ))}
            </View>
            <View style={styles.addressHolder}>
              <View>
                <View>
                  <DropdownComponent
                    data={city}
                    state={state}
                    setState={setState}
                  />
                  {!state && stateError ? (
                    <Text style={styles.error}>{stateError}</Text>
                  ) : null}
                </View>
                {/* <View
                  style={{
                    paddingLeft: 2,
                    marginBottom: 5,
                    marginTop: 5,
                    paddingBottom: 10,
                  }}
                >
                  <TouchableWithoutFeedback onPress={handleChoosePhoto}>
                    <Text style={{ fontSize: 16, padding: 10 }}>
                      {" "}
                       <Feather name={"paperclip"} style={styles.editIcon} /> 
                      <IconPaperClip />
                      Upload Photo id(KYC)*
                    </Text>
                  </TouchableWithoutFeedback>
                  {kycError ? (
                    <Text style={styles.error}>{kycError}</Text>
                  ) : null}
                </View> */}
                <View style={styles.addressTypeholder}>
                  <View style={{ paddingRight: 5, paddingLeft: 5 }}>
                    <Text style={{ marginBottom: 5, marginTop: 4 }}>
                      Payment mode *
                    </Text>
                    <View style={styles.halfholder}>
                      <RadioButton
                        onPress={() => onSetAccountType("upi")}
                        selected={accountType == "upi" ? true : false}
                      >
                        UPI
                      </RadioButton>
                      <RadioButton
                        onPress={() => onSetAccountType("account")}
                        selected={accountType == "account" ? true : false}
                        // selected={true}
                      >
                        Bank Account
                      </RadioButton>
                    </View>
                  </View>
                </View>
                {accountType == "upi" ? (
                  <View>
                    <View
                      style={{ flex: 1, flexDirection: "row", width: "100%" }}
                    >
                      <View
                        style={{ justifyContent: "flex-end", width: "68%" }}
                      >
                        <TextField
                          variant="filled"
                          label="UPI"
                          value={upi || ""}
                          onChangeText={setUpi}
                          onBlur={(e) => handleValidateUpi("upi")}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: "30%",
                          marginBottom: 10,
                        }}
                      >
                        <ButtonCustom
                          title="Verify"
                          onPress={handleValidateUpi}
                        />
                      </View>
                    </View>
                    {upiError ? (
                      <Text style={[styles.error, { marginBottom: 15 }]}>
                        {upiError}
                      </Text>
                    ) : null}
                    {isUPIVerified && (
                      <Text style={{ color: "green", marginBottom: 15 }}>
                        {"Verified"}
                      </Text>
                    )}
                  </View>
                ) : (
                  <View>
                    <TextField
                      variant="filled"
                      label="A/C Holder Name"
                      value={accountHolderName || ""}
                      onChangeText={setAccountHolderName}
                      onBlur={(e) => checkValidate("acHolder")}
                    />
                    {acHolderErr ? (
                      <Text style={styles.error}>{acHolderErr}</Text>
                    ) : null}
                    <TextField
                      variant="filled"
                      label="Bank A/C number"
                      value={acnumber || ""}
                      onChangeText={setAcnumber}
                      keyboardType="numeric"
                      onBlur={(e) => checkValidate("acnumber")}
                    />
                    {acNumnerError ? (
                      <Text style={styles.error}>{acNumnerError}</Text>
                    ) : null}
                    <TextField
                      variant="filled"
                      label="Bank Name"
                      value={bankName || ""}
                      onChangeText={setBankName}
                      onBlur={(e) => checkValidate("bankName")}
                    />
                    {bankNameError ? (
                      <Text style={styles.error}>{bankNameError}</Text>
                    ) : null}
                    <View
                      style={{ flex: 1, flexDirection: "row", width: "100%" }}
                    >
                      <View
                        style={{ justifyContent: "flex-end", width: "68%" }}
                      >
                        <TextField
                          variant="filled"
                          label="IFSC"
                          value={ifc || ""}
                          onChangeText={(item) => {
                            setIfc(item?.trim()?.toUpperCase());
                            setIsIfscVerified(false);
                          }}
                          trim
                          onBlur={(e) => checkValidate("ifc")}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: "30%",
                          marginBottom: 10,
                        }}
                      >
                        {/* <Button
                          title="Verify"
                          color="#F79489"
                          mode="outlined"
                        /> */}
                        <ButtonCustom
                          title="Verify"
                          onPress={handleVerifyIfc}
                        />
                      </View>
                    </View>
                    {ifcError ? (
                      <Text style={styles.error}>{ifcError}</Text>
                    ) : null}
                    {isIFSCVerified && (
                      <Text style={{ color: "green" }}>{"Verified"}</Text>
                    )}
                    <TextField
                      variant="filled"
                      label="Branch Name"
                      value={branchName || ""}
                      onChangeText={setBranchName}
                      // onBlur={(e) => checkValidate("branchName")}
                    />
                    {branchNameError ? (
                      <Text style={styles.error}>{branchNameError}</Text>
                    ) : null}
                  </View>
                )}
              </View>
            </View>
            {/* <Button
              color="#F79489"
              mode="outlined"
              uppercase={false}
              title="Submit"
              onPress={createAlliiate}
            /> */}
            <ButtonCustom title="Submit" onPress={createAlliiate} />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
    flexGrow: 1,
  },
  addressTypeholder: {
    marginTop: 3,
    flex: 1,
    backgroundColor: "#FFF",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    marginLeft: 5,
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
  text: {
    lineHeight: 30,
    fontSize: 16,
    marginVertical: 5,
  },
  editIcon: {
    fontSize: 16,
    marginRight: 5,
    fontWeight: "bold",
  },
  halfholder: {
    flexDirection: "row",
    paddingRight: 5,
    paddingLeft: 5,
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
  error: {
    color: "red",
  },
});
export default AffiliateCreateScreen;
