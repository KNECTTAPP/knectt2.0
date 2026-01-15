import React from "react";
import Modal from "react-native-modal";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { commonComponentStyle as style } from "../../assets/styles";
import { Color } from "../../assets/colors";
const { width, height } = Dimensions.get("window");
const ProgressLoader = ({ isVisible }) => {
  return (
    <Modal deviceHeight={height} isVisible={isVisible}>
      <View style={styles.loaderCenterContainer}>
        <ActivityIndicator size="large" color={"#F79489"} />
        {/* "#999999" */}
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  loaderCenterContainer: {
    flex: 1,
    justifyContent: "center",
    flexGrow: 1,
    alignItems: "center",
  },
});
export { ProgressLoader };
