import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import CustomSidebarMenu from "../component/CustomSidebarMenu";

const { width } = Dimensions.get("window");

const CustomDrawer = ({ isOpen, onClose, onNavigate }) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -width,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <TouchableOpacity style={styles.overlay} onPress={onClose} />
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX }] }]}>
        <CustomSidebarMenu />
      </Animated.View>

    </>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1,
  },
  drawer: {
    position: "absolute",
    width: width * 0.68,
    top: 0,
    bottom: 0,      // ✅ THIS FIXES SCROLL
    backgroundColor: "#fff",
    zIndex: 2,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  item: {
    fontSize: 16,
    marginVertical: 15,
  },
});
