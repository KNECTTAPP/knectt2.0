import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { ImagePath } from "../assets";
import colors from "../utils/colors";
import fonts from "../utils/fonts";

const ProcessingModal = ({ visible, children, showSuccess=false }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {showSuccess ? (
            <>
              <Image source={ImagePath.checkFill} style={styles.checkIcon} />
              <Text style={styles.subText}>Medical profile submitted.</Text>
            </>
          ) : (
            <>
              <Image
                source={ImagePath.premiumBrandLogo}
                style={styles.birdIcon}
              />
              <Text style={styles.processingText}>Processing data…</Text>
              <ActivityIndicator
                size="large"
                color={colors.themeColor}
                style={{ marginTop: 10 }}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ProcessingModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  container: {
    width: "80%",
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a237e",
    minHeight: "40%",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  checkIcon: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    marginBottom: 30,
    color: colors.black,
    fontFamily: fonts.whitneySemiBold,
  },
  birdIcon: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  processingText: {
    fontSize: 16,
    color: colors.black,
    fontFamily: fonts.whitneyMedium,
    marginBottom: 15,
    marginTop: -15,
  },
});
