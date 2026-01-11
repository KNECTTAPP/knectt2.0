import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import fonts from "../utils/fonts";

const BodyMatchModal = ({ isVisible, setBodyModalVisible, navigation }) => {
  //   const [visible, setVisible] = useState(true);

  return (
    <Modal transparent visible={isVisible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.message}>
            Create your body profile to access{"\n"}Body-Matching products in
            under 15 secs
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
            //   style={[styles.button, { marginRight: 80 }]}
              onPress={setBodyModalVisible}
            >
              {/* <Text style={styles.buttonText}>Skip</Text> */}
              <LinearGradient
                colors={["#F5A2A2", "#DC7D7D"]}
                style={[styles.button, { marginRight: 80 }]}
              >
                <Text style={styles.buttonText}>Skip</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
            //   style={styles.button}
              onPress={() => {
                setBodyModalVisible();
                navigation.navigate("chatbot");
              }}
            >
              {/* <Text style={styles.buttonText}>Yes</Text> */}

              <LinearGradient
                colors={["#F5A2A2", "#DC7D7D"]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BodyMatchModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#07124E", // dark blue background
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    width: "85%",
  },
  message: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    //   gap: 150,
    // justifyContent:'space-around'
    // marginTop:40
    position: "absolute",
    bottom: -10,
  },
  button: {
    backgroundColor: "linear-gradient(90deg, #F5A2A2, #DC7D7D)", // You can use a gradient library
    backgroundColor: "#F5A2A2", // fallback solid
    paddingHorizontal: 25,
    paddingVertical: 4,
    borderRadius: 20,
  },
  buttonText: {
    color: "#000",
    fontSize: 14,
    fontFamily: fonts.whitneyMedium,
    // fontWeight: "bold",
  },
});
