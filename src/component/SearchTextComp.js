import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import iconsIndex from "../../assets/iconsIndex";

const SearchTextComp = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={iconsIndex.icon_search} style={styles.icon} />
      <View style={styles.titleContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#808080",
    padding: 10,
  },
  titleContainer: {
    flex: 1,
    overflow: "hidden",
  },
  icon: { height: 25, width: 25, tintColor: "#808080" },
  title: {
    fontSize: 20,
    marginLeft: 10,
    fontWeight: "100",
  },
});

export default SearchTextComp;
