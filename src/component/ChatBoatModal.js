import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";

const ChatBoatModal = ({
  isVisible,
  toggleModal,
  data,
  onPressdata,
  addItem,
  heading,
}) => {
  const inputAge = (item) => {
    toggleModal();
    addItem(item);
  };
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => inputAge(item.id)}
        style={{ backgroundColor: "white", marginVertical: 4, elevation: 10 }}
      >
        <Text style={{ fontSize: 25, marginLeft: 10 }}>{item.id}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <Modal isVisible={isVisible}>
      <View
        style={{
          backgroundColor: "white",
          width: "75%",
          height: 400,
          alignSelf: "center",
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            height: 40,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 20 }}>{heading}</Text>
          <Text style={{ fontSize: 28, color: "pink" }} onPress={toggleModal}>
            X
          </Text>
        </View>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          // style={{ marginLeft: 20 }}
        />
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({});
export default ChatBoatModal;
