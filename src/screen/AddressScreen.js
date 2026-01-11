import "react-native-gesture-handler";
import React, { useState, Component, useEffect, useCallback } from "react";
import {
  Platform,
  View,
  Button,
  Text,
  Image,
  Linking,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from "react-native";
import HTMLView from "react-native-htmlview";
import { scale } from "react-native-size-matters";
import { TabNavigators } from "../../TabNavigators.js";
import ModalTester from "../component/ModalComponent";
import Header from "../component/Header";
import EndUrl from "../api/EndUrl";
const theme = "default";
var width = Dimensions.get("window").width;
import AsyncStorage from "@react-native-async-storage/async-storage";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import add_address from "../../assets/icons/add_address.jpg";
import fonts from "../utils/fonts.js";
import { IconArrowRight } from "../component/IconComp.js";
import { ButtonCustom } from "../component/ButtonCustom.js";
import DeviceInfo from "react-native-device-info";
const AddressScreen = ({ navigation, route }) => {
  const active = true;
  const [titleText, setTitleText] = useState(null);
  const [categoryTitle, setCategoryTitle] = useState("Address List");
  const [itemText, setItemText] = useState([]);
  const win = Dimensions.get("window");
  const [showBox, setShowBox] = useState(true);
  const [addressData, setAddressData] = useState();
  const addressAction = (arg, addressid, title) => {
    navigation.navigate("AddEditAddress", {
      action: arg,
      id: addressid,
      menuTitle: "Address",
    });
  };
  FlashMessage.setColorTheme({
    success: "#808080",
    color: "#FFF",
    info: "#75a4f6",
    warning: "#ff9398",
    danger: "#d990fb",
  });
  const deleteAddress = async (arg) => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.deleteaddress + arg, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      });
      const updateAvailable = response.headers.get("updateAvailable");
      const forceUpdate = response.headers.get("forceUpdate");
      const isOldFordeUpdatePopup = response.headers.get(
        "useOldFordeUpdatePopup"
      );
      if (updateAvailable === 1) {
        await AsyncStorage.setItem("updateAvailable", "true");
      }
      if (forceUpdate === 1) {
        await AsyncStorage.setItem("forceUpdate", "true");
      }
      if (isOldFordeUpdatePopup === 1) {
        await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      }
      const json = await response.json();
      console.log(json);
      showMessage({
        message: "Your address was removed successfully",
        duration: 2000,
        type: "success",
      });
      if (json.status == 200) {
        getAddress();
      }
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  const getAddress = async () => {
    try {
      let usertoken = await AsyncStorage.getItem("usertoken");
      const response = await fetch(EndUrl.getalladdress, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          token: JSON.parse(usertoken),
          Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
          Platform: Platform.OS,
        },
      });
      const updateAvailable = response.headers.get("updateAvailable");
      const forceUpdate = response.headers.get("forceUpdate");
      const isOldFordeUpdatePopup = response.headers.get(
        "useOldFordeUpdatePopup"
      );
      if (updateAvailable === 1) {
        await AsyncStorage.setItem("updateAvailable", "true");
      }
      if (forceUpdate === 1) {
        await AsyncStorage.setItem("forceUpdate", "true");
      }
      if (isOldFordeUpdatePopup === 1) {
        await AsyncStorage.setItem("useOldFordeUpdatePopup", "true");
      }
      const json = await response.json();
      setAddressData(json.data);
    } catch (error) {
      console.error(error);
    } finally {
      //setLoading(false);
    }
  };
  useEffect(() => {
    getAddress();
  }, []);
  const showConfirmDialog = (id) => {
    return Alert.alert(
      "Are you sure you want to delete this address?",
      "Please note: Deleting this address will not delete any pending orders being shipped to this address. To ensure uninterrupted fulfillment of future orders, please update any wishlists, subscribe and save settings and periodical subscriptions using this address.",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            deleteAddress(id);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <FlashMessage />
      <Header
        categoryTitle={categoryTitle}
        onPress={() => navigation.pop()}
        backButtonwithtext
      />
      <ScrollView style={{ flex: 1 }}>
        <Image
          source={add_address}
          style={{ height: scale(180), width: "auto" }}
        />
        <View style={styles.addressHolder}>
          <Pressable
            type="clear"
            onPress={() => addressAction("add", "", "Address")}
            style={styles.adddressbox}
            title="Add"
          >
            <View style={styles.tagRight}>
              <Text style={{ fontSize: 18, fontFamily: fonts.whitneySemiBold }}>
                Add New address
              </Text>
            </View>
            <View style={styles.tagLeft}>
              <Text style={styles.upwraptx}>
                <Text style={styles.taglinearrow}>
                  {/* <Feather
                    name={"arrow-right"}
                    style={{
                      color: "#F79489",
                      width: 30,
                      right: 2,
                      fontSize: 20,
                      fontWeight: 100,
                      position: "absolute",
                    }}
                  /> */}
                  <IconArrowRight />
                </Text>
              </Text>
            </View>
          </Pressable>
          <FlatList
            style={{
              width: "100%",
              padding: 10,
              marginTop: 0,
              marginLeft: 0,
              marginRight: 0,
            }}
            data={addressData}
            renderItem={({ item }) => {
              return (
                <View style={styles.addressContainer}>
                  <View style={styles.nameContainer}>
                    <Text style={styles.name}>
                      {item.first_name} {item.last_name}
                    </Text>
                  </View>
                  <View style={styles.divider}></View>
                  <Text style={styles.street}>{item.address_line_1}</Text>
                  {item.address_line_2 ? (
                    <Text style={styles.street}>{item.address_line_2}</Text>
                  ) : null}
                  <Text>
                    {item.city}
                    {","}
                    {item.state} - {item.postalcode}
                  </Text>
                  <Text style={styles.mobile}>Phone number : {item.phone}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ width: "40%" }}>
                      {/* <Button
                        color="#F79489"
                        mode="outlined"
                        uppercase={false}
                        title="Edit"
                        onPress={() => addressAction("Edit", item.id, "")}
                      /> */}
                      <ButtonCustom
                        title="Edit"
                        onPress={() => {console.log(item.id,'myid');addressAction("Edit", item.id, "")}}
                      />
                    </View>
                    <View style={{ width: "40%", marginLeft: 5 }}>
                      <Pressable
                        style={styles.button}
                        onPress={() => showConfirmDialog(item.id, "")}
                      >
                        <Text style={styles.textbtn}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              );
            }}
          ></FlatList>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  adddressbox: {
    padding: 5,
    margin: 4,
    padding: 5,
    margin: 4,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    width: width - 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addressHolder: {
    padding: 5,
    margin: 4,
  },
  box: {
    width: 300,
    height: 300,
    backgroundColor: "red",
    marginBottom: 30,
  },
  container: {
    marginBottom: 10,
  },
  addressContainer: {
    flex: 1,
    padding: 10,
    margin: 10,
    width: "95%",
    color: "green",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    marginTop: 2,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  nameContainer: {
    flexDirection: "row",
    fontFamily: 14,
  },
  name: {
    flex: 1,
    marginBottom: 6,
    fontFamily: fonts.whitneySemiBold,
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
  },
  mobile: {
    marginTop: 10,
  },
  stretch: {
    flex: 1,
    margin: 4,
  },
  actionbutton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
    marginLeft: 10,
    margin: 3,
    elevation: 3,
    backgroundColor: "#FFF",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: fonts.whitneySemiBold,
    letterSpacing: 0.25,
  },
  divider: {
    borderColor: "#ccc",
    margin: 2,
    width: "90%",
    borderBottomWidth: 1,
  },
  tagLeft: {
    width: 30,
  },
  tagRight: {
    fontSize: 18,
    width: width - 40,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 2,
    elevation: 3,
    backgroundColor: "#FFF",
  },
  textbtn: {
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 0.2,
    textTransform: "uppercase",
    color: "#999",
  },
});
export default AddressScreen;
