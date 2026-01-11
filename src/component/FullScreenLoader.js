// FullScreenLoader.js
import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const FullScreenLoader = ({
  visible = false,
  color = "#F79489",
  size = "large",
  backgroundColor = "rgba(0,0,0,0.5)",
  containerStyle = {},
}) => {
  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor }, containerStyle]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999, // stays on top
  },
});

export default FullScreenLoader;
