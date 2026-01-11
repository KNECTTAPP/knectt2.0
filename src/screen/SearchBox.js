import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const SearchBox = () => {
  return (
    <View style={styles.container}>
      <Text>SearchBox</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SearchBox;
