import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ModalCommon from "./ModalCommon";

const RadioModal = () => {
  return (
    <ModalCommon>
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text>Male</Text>
          <View
            style={{
              borderColor: "red",
              borderWidth: 1,
              borderRadius: 99,
              height: 20,
              width: 20,
            }}
          />
        </TouchableOpacity>
      </View>
    </ModalCommon>
  );
};

const RadioComp = ({ title }) => {
  return (
    <TouchableOpacity
      style={{ flexDirection: "row", justifyContent: "space-between" }}
    >
      <Text>Male</Text>
      <View
        style={{
          borderColor: "red",
          borderWidth: 1,
          borderRadius: 99,
          height: 20,
          width: 20,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignContent: "space-around",
    // backgroundColor:'green'
    padding: 20,
  },
});

export default RadioModal;
