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
} from "react-native";
import strings from "../utils/strings";
import colors from "../utils/colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import InputComp from "../component/InputComp";
import { convertIntoDateFormat } from "../utils/commonFunctions";
import AutoCompleteInput from "../component/AutoCompleteInput";
import { ButtonCustom } from "../component/ButtonCustom";

import ChipsContainer from "../component/ChipsContainer";
import { addBloodTestToCart, fetchAvailableSlots } from "../services";
import Header from "../component/Header";

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

  const _onPressAddress = (data, details = null) => {
    // 'details' is provided when fetchDetails = true
    console.log("onPressAddress->", data, details);
    setLocation(data?.description);
    setLongitude(details?.geometry?.location?.lng);
    setLatitude(details?.geometry?.location?.lat);
  };
  const _handleOnPressButton = async () => {
    // showMessage({ message: "hey" });
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
    if (!dateData) {
      setIsDateError(true);
    } else {
      setIsDateError(false);
    }
    if (!name) {
      setIsNameError(true);
    } else {
      setIsNameError(false);
    }
    if (!age) {
      setIsAgeError(true);
    } else {
      setIsAgeError(false);
    }
    if (!gender) {
      setIsGenderError(true);
    } else {
      setIsGenderError(false);
    }
    if (!latitude || !longitude) {
      setIsLocationError(true);
    } else {
      setIsLocationError(false);
    }

    if (
      houseDetails &&
      apartmentDetails &&
      pincode?.length === 6 &&
      dateData &&
      name &&
      age &&
      gender &&
      latitude &&
      longitude
    ) {
      // const payload = {
      //   collection_date: dateData?.split("-")?.reverse()?.join("-"),
      //   latitude: latitude,
      //   longitude: longitude,
      // };
      //   const payload = {
      //     collection_date: "2024-08-25",
      //     latitude: "28.596588",
      //     longitude: "77.082603",
      //   };
      const payload = `${dateData
        ?.split("-")
        ?.reverse()
        ?.join("-")}/${latitude}/${longitude}`;
      const res = await fetchAvailableSlots(payload);
      setAvailableSlots(res || []);
      setShowSlotButton(false);
      console.log("res->", res);
    }
  };

  const _onPressBook = async () => {
    if (!selectedSlot) {
      Alert.alert("Please select slot to proceed");
      return;
    }
    const payload = {
      latitude,
      longitude,
      pincode,
      name,
      gender,
      age,
      price: route.params?.productDetails?.price,
      address: location,
      collection_slot_id: selectedSlot?.id,
      collection_slot: `${selectedSlot?.format_12_hrs?.start_time}-${selectedSlot?.format_12_hrs?.end_time}`,
      collection_date: dateData?.split("-")?.reverse()?.join("-"),
      product_id: route.params?.data?.proId,
    };
    console.log("booktest-->", payload);
    const res = await addBloodTestToCart(payload);
    if (res?.status === "200") {
      setTimeout(() => {
        navigation.navigate("Cart");
      }, 1000);
    }

    console.log("booktest-->0", res);
  };

  console.log("ro=>", route.params);

  const _confirmDate = async (date) => {
    const temp = await convertIntoDateFormat(date);
    setDateData(temp);
    setIsDateModalVisible(false);
    setShowSlotButton(true);
  };

  const _selectedChip = (item) => {
    console.log("selectedChip->", item);
    setSelectedSlot(item);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ backgroundColor: colors, flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <Header
            categoryTitle={"Book Test"}
            //cartCountshow={cartCountshow}
            backButtonwithtext
            // notification
            // cart
          />

          <View style={styles.container}>
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

            <InputComp
              title={"Gender"}
              placeholder={"M/F"}
              styleTextInput={{ width: "50%" }}
              isError={isGenderError}
              value={gender}
              onChangeText={setGender}
            />

            <InputComp
              title={"Age"}
              placeholder={"Age"}
              styleTextInput={{ width: "50%" }}
              isError={isDateError}
              value={age}
              keyboardType="number-pad"
              maxLength={3}
              onChangeText={setAge}
            />

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

            {/* {!!location && ( */}
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
              />
             
              {!!availableSlots && (
                <ChipsContainer
                  data={availableSlots}
                  selectedSlot={_selectedChip}
                />
              )}

              <View style={{ marginBottom: 20 }} />
              {showSlotButton ? (
                <ButtonCustom
                  title={strings.get_time_slot}
                  onPress={_handleOnPressButton}
                />
              ) : (
                <ButtonCustom
                  title={strings.add_to_cart}
                  onPress={_onPressBook}
                />
              )}
            </>
            {/* )} */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
});

export default BloodTestScreen;
