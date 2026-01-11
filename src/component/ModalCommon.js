import React, { Component } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import colors from "../utils/colors";

const ModalCommon = ({children}) => {
  return (
    <Modal
      style={styles.container}
      animationType="slide"
      transparent={true}
      visible={true}
    >
      <View style={styles.mainContainer}>
        <View style={styles.subContainer}>
         {children}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    backgroundColor: "rgba(1,1,1,0.5)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subContainer: { backgroundColor: "white", width: "90%" },
});

export default ModalCommon;
