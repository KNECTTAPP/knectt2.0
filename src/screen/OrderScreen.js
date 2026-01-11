import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Icon1 from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

var id = 0;
const OrderScreen = () => {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [discription, setDiscription] = useState("");
  const [modal, setModal] = useState(false);

  const storeData = async () => {
    try {
      let newArray = [...list];
      if (newArray.length >= 10) {
        newArray.splice(0, 1);
      }
      newArray.push({ id: ++id, title: title, discription: discription });
      setTitle("");
      setDiscription("");
      setList(newArray);
      await AsyncStorage.setItem("MyKey", JSON.stringify(newArray));
    } catch (e) {
      console.log(e);
    }
  };

  const getData = async () => {
    try {
      let newList = JSON.parse(await AsyncStorage.getItem("MyKey"));
      setList(newList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.viewData}>
        <View style={styles.viewBox}>
          <Text style={styles.textHeading}>Title</Text>
          <Text style={styles.subHeading}>{item.title}</Text>
        </View>
        <View style={styles.viewBox}>
          <Text style={styles.textHeading}>Discription</Text>
          <Text style={styles.subHeading}>{item.discription}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#6a51ae" /> */}
      <View style={styles.headinngContainer}>
        <View style={styles.menuView}>
          <Icon name="menu" size={30} color="#fff" />
          <Text style={styles.headingText}>Todo List</Text>
          <Icon1 name="logout" size={30} color="#fff" />
        </View>
        <View style={styles.logoContainer}>
          <Image
            style={styles.images}
            source={{
              uri: "https://static.wixstatic.com/media/94d30a_0c1b579d643e4831856d6cafa5388618~mv2.jpg/v1/fill/w_340,h_170,al_c,q_80,usm_0.66_1.00_0.01/Todo%20Logo.webp",
            }}
          />
          <TouchableOpacity
            style={styles.touchables}
            onPress={() => setModal(true)}
          >
            <Text>Add New</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bodyContainer}>
        <FlatList
          data={list}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModal(!modal);
          }}
        >
          <View style={styles.modalView}>
            <TextInput
              placeholder="Title"
              value={title}
              style={styles.textInput}
              onChangeText={(text) => setTitle(text)}
            />
            <TextInput
              placeholder="Discription"
              value={discription}
              style={styles.textInput}
              onChangeText={(text) => setDiscription(text)}
            />
            <View style={styles.buttonView}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setModal(!modal)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  storeData(), setModal(!modal);
                }}
              >
                <Text style={styles.buttonText}>Store Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6a51ae",
  },
  headinngContainer: {
    flex: 2,
    backgroundColor: "#6a51ae",
    justifyContent: "space-around",
  },
  bodyContainer: {
    flex: 6,
    backgroundColor: "white",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  menuView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headingText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  images: {
    height: 60,
    width: 130,
  },
  touchables: {
    height: 40,
    width: 140,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textInput: {
    height: 60,
    width: 280,
    padding: 10,
    margin: 6,
    elevation: 2,
  },
  buttonView: {
    flexDirection: "row",
    width: "65%",
    justifyContent: "space-around",
    alignSelf: "flex-end",
  },
  buttonText: {
    fontSize: 17,
    color: "white",
  },
  button: {
    backgroundColor: "gray",
    width: 80,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  viewData: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    margin: 10,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  viewstore: {
    flexDirection: "row",
    width: 250,
    justifyContent: "space-around",
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  textHeading: {
    fontSize: 20,
    color: "#262626",
    fontWeight: "bold",
  },
  subHeading: {
    fontSize: 15,
    fontWeight: "700",
    color: "gray",
  },
  viewBox: {
    alignItems: "center",
  },
  icon: {
    alignSelf: "flex-end",
    bottom: 10,
  },
});
export default OrderScreen;
