import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import strings from "../utils/strings";
import colors from "../utils/colors";

const InputComp = ({
  title,
  placeholder,
  styleTextInput,
  keyboardType = "default",
  maxLength,
  disableDivider,
  isError,
  onChangeText,
  onPressIn,
  value,
  cursorColor,
  containerStyle,
}) => {
  return (
    <View style={containerStyle}>
      <Text style={styles.text}>{title}</Text>
      <TextInput
        placeholder={placeholder}
        style={[styles.textInput, styleTextInput]}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        onPressIn={onPressIn}
        value={value}
        cursorColor={cursorColor}
      />
      {isError && (
        <Text style={styles.error}>{strings.please_enter_this_filed}</Text>
      )}
      {!disableDivider && <View style={styles.divider} />}
    </View>
  );
};

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: colors.textInputBorderColor,
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  text: { marginBottom: 5, marginLeft: 5, color: colors.black },
  divider: { marginBottom: 20 },
  error: { color: colors.error },
});

export default InputComp;
