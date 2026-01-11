import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const Divider = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.line} />
      <Text style={[styles.text, { marginHorizontal: width * 0.02 }]}>Enter the required details</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: "100%", // Ensures the container spans full width of the screen
  },
  text: {
    textAlign: "center",
  },
  line: {
    height: 1,
    backgroundColor: "black",
    flex: 1, // Make the line take up the remaining space
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default Divider;
