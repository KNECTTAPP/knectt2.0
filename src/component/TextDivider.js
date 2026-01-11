import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const TextDivider = ({ title }) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.line} />
      <Text
        style={[
          styles.text,
          { fontSize: width * 0.05, marginHorizontal: width * 0.02 },
        ]}
      >
        {title}
      </Text>
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
    fontWeight: "bold",
    textAlign: "center",
  },
  line: {
    height: 1,
    backgroundColor: "black",
    flex: 1, // Make the line take up the remaining space
  },
});

export default TextDivider;
