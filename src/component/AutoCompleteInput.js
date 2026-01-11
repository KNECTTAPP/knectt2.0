//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import strings from "../utils/strings";
import { helperGetLatLongFromAddress } from "../utils/commonFunctions";
import colors from "../utils/colors";

// create a component
const AutoCompleteInput = ({ onPress, textInputProps, isError }) => {
  return (
    <>
      <Text style={styles.text}>{strings.location}</Text>
      <GooglePlacesAutocomplete
        placeholder={strings.search_your_location}
        onPress={onPress}
        query={{
          key: "AIzaSyAEHAfHRqLVnlaVZQ2GbR-C74fnGHoHiRY",
          language: "en",
          components: "country:in",
        }}
        fetchDetails={true}
        textInputProps={textInputProps}
        enablePoweredByContainer={false}
      />
      {isError && (
        <Text style={styles.error}>{strings.please_enter_this_filed}</Text>
      )}
      <View style={styles.divider} />
    </>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.textInputBorderColor,
    height: 50,
    width: "100%",
    borderRadius: 8,
  },
  text: { marginBottom: 5, marginLeft: 5, color: colors.black },
  divider: { marginBottom: 20 },
  error: { color: colors.error },
});

export default AutoCompleteInput;
