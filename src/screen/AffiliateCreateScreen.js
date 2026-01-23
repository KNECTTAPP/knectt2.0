import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import appsFlyer from "react-native-appsflyer";
import DeviceInfo from "react-native-device-info";
import FlashMessage, {
  showMessage
} from "react-native-flash-message";
import { launchImageLibrary } from "react-native-image-picker";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import EndUrl from "../api/EndUrl";
import { ButtonCustom } from "../component/ButtonCustom";
import DropdownComponent from "../component/DropdownComponent";
import Header from "../component/Header";
import Loader from "../component/Loader";
import { isValidUpiFormat } from "../utils/commonFunctions";


const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const AffiliateCreateScreen = ({ route }) => {
  const navigation = useNavigation()
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
  const valueRef = useRef(0);


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
      Animated.timing(keyboardMargin, {
        toValue: e.endCoordinates.height,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(keyboardMargin, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const keyboardMargin = useRef(new Animated.Value(0)).current;
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
    <SafeAreaView style={styles.screenContainer}>
      <Loader loading={loading} />
      <FlashMessage />
      <Header categoryTitle="Affiliate Account Creation" backButtonwithtext />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
      >
        <Text style={styles.sectionTitle}>Title</Text>
        <View style={styles.halfholder}>
          {title.map((item) => (
            <RadioButton
              key={item.id}
              selected={item.selected}
              onPress={() => onRadioBtnClickTitle(item)}
            >
              {item.name}
            </RadioButton>
          ))}
        </View>

        <TextInput
          label="First Name *"
          mode="flat"                // 👈 underline style
          underlineColor="#999"
          activeUnderlineColor="#4649b0"

          style={{
            backgroundColor: "#fff", // 👈 white bg
            paddingHorizontal: 0,
          }}

          contentStyle={{
            paddingHorizontal: 0,
          }}

          theme={{
            colors: {
              background: "#fff",
              surface: "#fff",
              onSurfaceVariant: "#999", // label color (inactive)
              primary: "#6e5af4",          // label + underline active
            },
          }} value={firstname} onChangeText={setFirstname} />
        {firstnameError && <Text style={styles.error}>{firstnameError}</Text>}

        <TextInput label="Last Name *" value={lastname} onChangeText={setLastname} style={styles.input} />
        {lastnameError && <Text style={styles.error}>{lastnameError}</Text>}

        <TextInput label="Email *" value={email} onChangeText={setEmail} style={styles.input} />
        {emailError && <Text style={styles.error}>{emailError}</Text>}

        <TextInput label="Confirm Email *" value={confirmEmail} onChangeText={setConfirmEmail} style={styles.input} />
        {confirmEmailError && <Text style={styles.error}>{confirmEmailError}</Text>}

        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.halfholder}>
          {isLiked.map((item) => (
            <RadioButton
              key={item.id}
              selected={item.selected}
              onPress={() => onRadioBtnClick(item)}
            >
              {item.name}
            </RadioButton>
          ))}
        </View>

        <DropdownComponent data={city} state={state} setState={setState} />
        {stateError && <Text style={styles.error}>{stateError}</Text>}

        <Text style={styles.sectionTitle}>Payment Mode</Text>
        <View style={styles.halfholder}>
          <RadioButton selected={accountType === "upi"} onPress={() => setAccountType("upi")}>
            UPI
          </RadioButton>
          <RadioButton selected={accountType === "account"} onPress={() => setAccountType("account")}>
            Bank Account
          </RadioButton>
        </View>

        {accountType === "upi" ? (
          <>
            <View style={styles.row}>
              <TextInput label="UPI" value={upi} onChangeText={setUpi} style={[styles.input, { flex: 1 }]} />
              <ButtonCustom title="Verify" onPress={handleValidateUpi} containerStyle={{padding:20}} />
            </View>
            {upiError && <Text style={styles.error}>{upiError}</Text>}
            {isUPIVerified && <Text style={styles.success}>Verified</Text>}
          </>
        ) : (
          <>
            <TextInput label="A/C Holder Name" value={accountHolderName} onChangeText={setAccountHolderName} style={styles.input} />
            <TextInput label="Bank A/C Number" value={acnumber} onChangeText={setAcnumber} style={styles.input} />
            <View style={styles.row}>
              <TextInput label="IFSC" value={ifc} onChangeText={(t) => setIfc(t.toUpperCase())} style={[styles.input, { flex: 1 }]} />
              <ButtonCustom title="Verify" onPress={handleVerifyIfc}containerStyle={{padding:20}}/>
            </View>
            {isIFSCVerified && <Text style={styles.success}>Verified</Text>}
            <TextInput label="Branch Name" value={branchName} onChangeText={setBranchName} style={styles.input} />
          </>
        )}

        <View style={{ marginVertical: 24 }}>
          <ButtonCustom title="Submit" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff", // 👈 white bg
    paddingHorizontal: 0,
  },
  halfholder: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonIcon: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#132742",
  },
  radioButtonText: {
    marginLeft: 8,
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  error: {
    color: "red",
    marginBottom: 6,
  },
  success: {
    color: "green",
    marginBottom: 6,
  },
});

export default AffiliateCreateScreen;
