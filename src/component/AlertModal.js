import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { ButtonCustom } from "./ButtonCustom";

const AlertModal = ({ isVisible, navigation, onClose }) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      {/* Backdrop */}

      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              In order to use this feature, you have to register.
            </Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <ButtonCustom
                  title="Okay"
                  onPress={() => {
                    navigation.navigate("Login");
                    onClose();
                  }}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <ButtonCustom
                  onPress={onClose}
                  title="Deny"
                  containerStyle={{ backgroundColor: "#132742" }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Modal Content */}
    </Modal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
