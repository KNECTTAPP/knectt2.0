import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  BackHandler,
  Modal,
} from "react-native";
import icons from "../../assets/iconsIndex";
import { ButtonCustom } from "../component/ButtonCustom";
import strings from "../utils/strings";

const UpdateApp = ({ isUpdateAvailable, _onPressUpdate }) => {
  
  // Disable Android Back button when update is required
  useEffect(() => {
    if (isUpdateAvailable) {
      const backAction = () => true; // Block back press
      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => subscription.remove();
    }
  }, [isUpdateAvailable]);

  if (!isUpdateAvailable) return null;

  return (
    <Modal
      transparent
      visible={isUpdateAvailable}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}} // Disable modal dismissal
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          
          <Image
            source={icons.icon_logo}
            style={{ width: 250, height: 180 }}
            resizeMode="contain"
          />

          <Text style={styles.titleText}>{strings.update_app_title}</Text>
          <Text style={styles.descText}>{strings.update_app_description}</Text>

          <ButtonCustom
            title={"Update App"}
            containerStyle={styles.buttonContainer}
            onPress={_onPressUpdate}
          />
          
        </View>
      </View>
    </Modal>
  );
};

export default UpdateApp;


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  descText: {
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 10,
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
  },
});
