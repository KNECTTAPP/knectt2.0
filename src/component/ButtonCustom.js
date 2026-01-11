import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import colors from "../utils/colors";

export const ButtonCustom = ({
  titleStyle,
  title,
  containerStyle,
  onPress,
  disabled,
  isLoading
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <Text style={[styles.titleStyle, titleStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    paddingVertical: 10,
  },
  titleStyle: {
    color: colors.white,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});
