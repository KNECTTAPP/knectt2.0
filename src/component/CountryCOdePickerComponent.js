import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import ButtonComponent from "./ButtonComponent";
import { ProgressLoader } from "./ProgressLoader";
import { ButtonCustom } from "./ButtonCustom";

const CountryCodePickerComponent = ({
  onPress,
  onChangeFormattedText,
  phoneInput,
  phoneNumber,
  loading,
}) => {
  return (
    <View style={styles.container}>
      {/* <ProgressLoader isVisible={loading} /> */}
      <PhoneInput
        ref={phoneInput}
        defaultValue={phoneNumber}
        placeholder={"Mobile number *"}
        defaultCode="IN"
        layout="first"
        withShadow
        //autoFocus
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.textInput}
        onChangeFormattedText={onChangeFormattedText}
        number={13}
        // autoFocus
        textInputProps={{
          returnKeyType: "done",
        }}
        flagButtonStyle={{ paddingRight:0 }}
        countryPickerButtonStyle={{
          // backgroundColor:'yellow',
          //  width:70,
          //  paddingHorizontal:0
          }}
        disableCountryPicker
        pointerEvents="none"
        // layout="second"
        // countryPickerProps={PointerEvent:'none'}
        disableArrowIcon
      />
      <View style={styles.buttonholder}>
        {/* <Button color="#F79489"  onPress={onPress} title={"Login"} /> */}
        <ButtonCustom title={"LOGIN"} onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-evenly",
    borderRadius: 7,
    padding: 10,
  },
  phoneContainer: {
    backgroundColor: "white",
    borderRadius: 7,
    alignSelf: "center",
    width: "95%",
  },
  buttonholder: {
    margin: 10,
  },
  button: {
    marginTop: 20,
    height: 40,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F79489",
    borderRadius: 7,
  },
  textInput: {
    paddingVertical: 0,
    backgroundColor: "white",
    borderRadius: 7,
    color: "black",
  },
  continueText: {
    color: "white",
    fontSize: 14,
  },
});

export default CountryCodePickerComponent;
