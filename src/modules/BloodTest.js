import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Image,
  Keyboard,
  Alert,
  useWindowDimensions,
  Button,
  Platform,
} from "react-native";
import strings from "../utils/strings";
import colors from "../utils/colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import InputComp from "../component/InputComp";
import { convertIntoDateFormat } from "../utils/commonFunctions";
import AutoCompleteInput from "../component/AutoCompleteInput";
import { ButtonCustom } from "../component/ButtonCustom";
import DatePicker from "react-native-date-picker";
import ChipsContainer from "../component/ChipsContainer";
import { addBloodTestToCart, fetchAvailableSlots } from "../services";
import Header from "../component/Header";
import Divider from "../component/Divider";
import ModalCommon from "../component/ModalCommon";
import RadioModal from "../component/RadioModal";
import { ProgressLoader } from "../component/ProgressLoader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import endUrls from "../api/EndUrl";
import DeviceInfo from "react-native-device-info";

const BloodTestScreen = ({ navigation, route }) => {
  const [location, setLocation] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [houseDetails, setHouseDetails] = useState("");
  const [apartmentDetails, setApartmentDetails] = useState("");
  const [pincode, setPincode] = useState("");
  const [isHouseError, setIsHouseError] = useState(false);
  const [isApartmentError, setIsApartmentError] = useState(false);
  const [isPincodeError, setIsPincodeError] = useState(false);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [dateData, setDateData] = useState("");
  const [isDateError, setIsDateError] = useState(false);
  const [availableSlots, setAvailableSlots] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isAgeError, setIsAgeError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isMailError, setIsMailError] = useState(false);
  const [isGenderError, setIsGenderError] = useState(false);
  const [isLocationError, setIsLocationError] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showSlotButton, setShowSlotButton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCountshow, setCartCountshow] = useState();

  useEffect(() => {
    getCartcountAj();
  }, []);
  const _onPressAddress = (data, details = null) => {
    // 'details' is provided when fetchDetails = true
    setLocation(data?.description);
    setLongitude(details?.geometry?.location?.lng);
    setLatitude(details?.geometry?.location?.lat);
  };

  const _handleOnPressButton = async () => {
    if (!latitude || !longitude) {
      setIsLocationError(true);
    } else {
      setIsLocationError(false);
    }
    if (!dateData) {
      setIsDateError(true);
    } else {
      setIsDateError(false);
    }
    _fetchAvailableSlots();
    if (latitude && longitude && dateData) {
      _fetchAvailableSlots();
    }
  };

  const _fetchAvailableSlots = async () => {
    setIsLoading(true);
    const payload = `${dateData
      ?.split("-")
      ?.reverse()
      ?.join("-")}/${latitude}/${longitude}`;
    const res = await fetchAvailableSlots(payload);
    setAvailableSlots(res || []);
    setIsLoading(false);
    setShowSlotButton(false);
  };

  const _onPressAddToCart = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigation.replace("Ulogin");
    }
    if (!name) {
      setIsNameError(true);
    } else {
      setIsNameError(false);
    }
    if (!gender) {
      setIsGenderError(true);
    } else {
      setIsGenderError(false);
    }
    if (!age) {
      setIsAgeError(true);
    } else {
      setIsAgeError(false);
    }
    if (!houseDetails) {
      setIsHouseError(true);
    } else {
      setIsHouseError(false);
    }
    if (!apartmentDetails) {
      setIsApartmentError(true);
    } else {
      setIsApartmentError(false);
    }
    if (pincode?.length < 6) {
      setIsPincodeError(true);
    } else {
      setIsPincodeError(false);
    }
    if (
      houseDetails &&
      apartmentDetails &&
      pincode?.length === 6 &&
      name &&
      age &&
      gender
    ) {
      _onBook();
    }
  };

  const getCartcountAj = async () => {
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
      const response = await fetch(endUrls.getcartcount, settingsGet);
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
        const json = await response.json();
        setCartCountshow(json?.count ?? "");
        await AsyncStorage.setItem(
          "cartcount",
          JSON.stringify(json?.count ?? "")
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const _onBook = async () => {
    setIsLoading(true);
    if (!selectedSlot) {
      Alert.alert("Please select slot to proceed");
      setIsLoading(false);
      return;
    }
    const payload = {
      latitude,
      longitude,
      name,
      gender,
      age,
      price: route.params?.productDetails?.price,
      address: location,
      collection_slot_id: selectedSlot?.id,
      collection_slot: `${selectedSlot?.format_12_hrs?.start_time}-${selectedSlot?.format_12_hrs?.end_time}`,
      collection_date: dateData?.split("-")?.reverse()?.join("-"),
      product_id: route.params?.data?.proId,
      apartment_address: apartmentDetails,
      house_number: houseDetails,
      email_id: email,
      pin_code: pincode,
    };
    const res = await addBloodTestToCart(payload);
    setIsLoading(false);

    if (res?.status == 200) {
      setTimeout(() => {
        navigation.navigate("Cart");
      }, 1000);
    } else {
      Alert.alert(res.message);
    }
    getCartcountAj();
  };

  const _confirmDate = async (date) => {
    const temp = await convertIntoDateFormat(date);
    setDateData(temp);
    setIsDateModalVisible(false);
    setShowSlotButton(true);
    Keyboard.dismiss();
  };

  const _selectedChip = (item) => {
    setSelectedSlot(item);
  };

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: colors, flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={10}
    >
      <ProgressLoader isVisible={isLoading} />
      <>
        <Header
          categoryTitle={"Book Test"}
          cartCountshow={cartCountshow}
          cart
          backButtonwithtext
          // notification
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <AutoCompleteInput
              textInputProps={{
                style: styles.textInput,
                onChangeText: (e) => {
                  setLocation(e);
                },
              }}
              onPress={_onPressAddress}
              isError={isLocationError}
            />

            <InputComp
              title={strings.select_date}
              placeholder={strings.dd_mm_yyyy}
              styleTextInput={{ width: "50%" }}
              isError={isDateError}
              onPressIn={() => {
                setIsDateModalVisible(true);
                Keyboard.dismiss();
              }}
              value={dateData}
              cursorColor={"transparent"}
            />
            <DatePicker
              mode="date"
              date={new Date()}
              modal
              open={isDateModalVisible}
              onCancel={() => setIsDateModalVisible(false)}
              onConfirm={_confirmDate}
            />

            {!!availableSlots && (
              <>
                <ChipsContainer
                  data={availableSlots}
                  selectedSlot={_selectedChip}
                />
                {!!availableSlots.length && (
                  <>
                    <View style={{ marginBottom: 20 }} />
                    <Divider />
                    <InputComp
                      title={"Name"}
                      placeholder={"Name"}
                      isError={isNameError}
                      onChangeText={setName}
                      value={name}
                    />
                    <InputComp
                      title={"Email"}
                      placeholder={"Email"}
                      isError={isMailError}
                      onChangeText={setEmail}
                      value={email}
                    />

                    <View style={styles.subContainer}>
                      <InputComp
                        title={"Gender"}
                        placeholder={"M/F"}
                        // styleTextInput={{ width: "50%" }}
                        isError={isGenderError}
                        value={gender}
                        onChangeText={setGender}
                        containerStyle={{ width: "49%" }}
                      />
                      <InputComp
                        title={"Age"}
                        placeholder={"Age"}
                        // styleTextInput={{ width: "50%" }}
                        containerStyle={{ width: "49%" }}
                        isError={isDateError}
                        value={age}
                        keyboardType="number-pad"
                        maxLength={3}
                        onChangeText={setAge}
                      />
                    </View>
                    <>
                      <InputComp
                        title={strings.house_flat_floor}
                        placeholder={strings.house_flat_floor}
                        isError={isHouseError}
                        onChangeText={setHouseDetails}
                        value={houseDetails}
                      />
                      <InputComp
                        title={strings.apartment_road_area}
                        placeholder={strings.apartment_road_area}
                        isError={isApartmentError}
                        onChangeText={setApartmentDetails}
                        value={apartmentDetails}
                      />

                      <InputComp
                        title={strings.pin_code}
                        placeholder={strings.pincode_6_digits}
                        styleTextInput={{ width: "50%" }}
                        keyboardType="number-pad"
                        maxLength={6}
                        isError={isPincodeError}
                        onChangeText={setPincode}
                        value={pincode}
                      />

                      <View style={{ marginBottom: 20 }} />
                    </>
                  </>
                )}
              </>
            )}
          </View>
        </ScrollView>
        <View style={{ marginBottom: 10, marginHorizontal: 10 }}>
          {showSlotButton ? (
            <ButtonCustom
              title={strings.get_time_slot}
              onPress={_handleOnPressButton}
              disabled={isLoading}
              isLoading={isLoading}
            />
          ) : (
            <ButtonCustom
              title={strings.add_to_cart}
              onPress={_onPressAddToCart}
              disabled={isLoading}
              isLoading={isLoading}
            />
          )}
        </View>
        {/* <RadioModal/> */}
      </>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 10, paddingTop: 20 },
  textInput: {
    borderWidth: 1,
    borderColor: colors.textInputBorderColor,
    height: 50,
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default BloodTestScreen;
