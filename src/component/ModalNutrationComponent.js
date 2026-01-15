import React, { useState } from "react";
import {
  Button,
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  modalPress,
  Image,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import { ProgressLoader } from "./ProgressLoader";
import { SafeAreaView } from "react-native-safe-area-context";
const ModalNutration = ({
  isVisible,
  toggleModal,
  data,
  modalPress,
  planType,
  loading,
  planImage,
  id,
}) => {
  const { width } = useWindowDimensions();
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          paddingVertical: 0,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "80%", marginLeft: 10 }}>
          <View style={styles.highlight}>
            <View style={styles.helighttext}>
              <Text>
                {"\u2B24"} {item.feature}
              </Text>
            </View>
          </View>
        </View>

        <Image
          style={{ height: 40, width: 40 }}
          source={{
            uri: item.image,
          }}
        />
      </View>
    );
  };
  return (
    <Modal
      animationIn="slideInUp"
      style={{ zIndex: 99, flex: 1 }}
      isVisible={isVisible}
    >
      <SafeAreaView style={{flex:1}}>
        <View
          style={{
            backgroundColor: id == 8 ? "white" : "white",
            borderRadius: 20,
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              height: 40,
              alignItems: "center",
              backgroundColor: id == 1 ? "white" : "white",
              borderTopEndRadius: 20,
              borderTopLeftRadius: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ fontSize: 18, fontWeight: "600", color: "#F79489" }}
              >
                {planType}
              </Text>
              <Image
                style={{ height: 40, width: 40, right: 10, bottom: 5 }}
                source={{
                  uri: planImage,
                }}
              />
            </View>
            <TouchableOpacity
              style={{ padding: 2, height: 30, width: 30 }}
              onPress={toggleModal}
            >
              <Text style={{ fontSize: 25, color: "#F79489" }}>X</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.container,
              { backgroundColor: id == 8 ? "white" : "white" },
            ]}
          >
            <FlatList
              data={data}
              initialNumToRender={1}
              refreshing={loading}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
            />
          </View>
          <View style={{ height: 10 }} />
          <TouchableOpacity onPress={modalPress} style={[styles.dietStyle]}>
            <Text style={{ color: "white" }}>Create Diet Profile and Pay</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7F7F7",
    flexDirection: "row",
    borderRadius: 20,
  },
  dietStyle: {
    minHeight: 40,
    width: "96%",
    backgroundColor: "#F79489",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});

export default ModalNutration;
