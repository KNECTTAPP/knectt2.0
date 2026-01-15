import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,

  FlatList,
  Text,
  Image,
  TouchableWithoutFeedback,
  TextInput,
  TouchableOpacity,
  Pressable,
  Linking,
} from "react-native";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { withNavigation } from "@react-navigation/compat";
import { Badge, Icon, withBadge } from "react-native-elements";
import { ArrowLeft, ArrowUpCircle, Menu, Search } from "react-native-feather";
import logos from "../../assets/img/BrandLogoMobileN.png";
import backarrow from "../../assets/img/back.jpeg";
import smartediet from "../../assets/img/smartediet.jpg";
import chats from "../../assets/img/chat.jpg";
import phone from "../../assets/img/phonebutton.png";
import NotificationIoc from "../../assets/img/notification.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EndUrl from "../api/EndUrl";
import {
  IconArrowLeft,
  IconBell,
  IconMenu,
  IconMessageCircle,
  IconPhoneCall,
  IconSearch,
  IconShoppingCart,
} from "./IconComp";
const Header = ({
  onPress,
  notification,
  chatLogo,
  menu,
  search,
  logo,
  backButton,
  chat,
  modal,
  props,
  navigation,
  cart,
  backButtonwithtext,
  poneverification,
  categoryTitle,
  itemText,
  cartCountshow,
  call,
  headerBackButton = true,
  walletAmountLeft=false,
  backButtonCustomFun,
}) => {
  const refSearchBox = useRef();
  const [cartCount, setCartCount] = useState();
  const [notificationCount, setNotificationCount] = useState(0);

  const handleLeftPress = () => {};
  const getstodataStorege = async () => {
    let cartCountshow = await AsyncStorage.getItem("cartcount");
    let notificationcount = await AsyncStorage.getItem("notificationcount");
    setCartCount(JSON.parse(cartCountshow));
    setNotificationCount(notificationcount);
  };
  //Call for the open
  function openSearchBox() {
    return refSearchBox.current.open();
  }
  //Call for the close
  const closeSearchBox = () => refSearchBox.current.close();

  const navigationr = useNavigation();

  const opensidebar = () => {
    navigationr.dispatch(DrawerActions.openDrawer());
  };
  const callCustomercare = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const homePage = () => {
    //navigationr.navigate('Home');
    // getstodataStorege();
    // navigationr.navigate("TabNavigators", {
    //   screen: "Home",
    // });
    navigationr.navigate('NutritionistLiveChat');
    //navigationr.popToTop();
  };
  const backButtonp = () => {
    try {
      getstodataStorege();
    } catch (error) {
      console.log(error + "home comp");
    }
    navigationr.dispatch(CommonActions.goBack());
  };

  const cartPage = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    if (!usertoken) {
      navigationr.replace("Login");
    } else {
      navigationr.navigate("Cart");
    }
  };
  const notiFication = () => {
    navigationr.navigate("Notification");
  };
  const searchPage = () => {
    navigationr.navigate("Search");
  };
  const [state, setState] = useState({ searchIconColor: "#555" });
  useEffect(() => {
    getstodataStorege();
  });
  return (
    <View style={[styles.container]}>
      {menu ? (
        <TouchableOpacity activeOpacity={1} onPress={opensidebar}>
          <IconMenu />
        </TouchableOpacity>
      ) : null}
      {backButtonwithtext && headerBackButton ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={backButtonCustomFun ?? backButtonp}
        >
          // <IconArrowLeft />
        </TouchableOpacity>
      ) : null}
      <View style={styles.iconStyle}>
        {backButtonwithtext ? (
          <TouchableOpacity
            style={{ paddingLeft: 10, paddingTop: 5 }}
            onPress={backButtonCustomFun ?? backButtonp}
          >
            <View style={styles.categorytext}>
              <Text numberOfLines={1} style={styles.catetop}>
                {categoryTitle}
              </Text>
              {itemText ? (
                <Text style={styles.litemtext}>{itemText}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ) : null}
        {backButton ? (
          <TouchableWithoutFeedback onPress={backButtonp}>
            <Image
              source={backarrow}
              style={{ height: 30, width: 30, borderRadius: 25 }}
            />
          </TouchableWithoutFeedback>
        ) : null}

        {chatLogo ? (
          <TouchableWithoutFeedback
            style={{ backgroundColor: "#000" }}
            onPress={homePage}
          >
            <Image
              source={logos}
              resizeMode={"cover"}
              style={{ height: 20, width: 75, left: 0, top: 10 }}
            />
          </TouchableWithoutFeedback>
        ) : null}
        {poneverification ? (
          <View
            style={{
              width: 200,
              height: 60,
              justifyContent: "center",
              alignItems: "center",
              right: 5,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                alignSelf: "flex-start",
                color: "black",
              }}
            >
              Register/Login
            </Text>
          </View>
        ) : null}

        {logo ? (
          <Image
            source={phone}
            style={{
              height: 30,
              width: 30,
              right: 10,
              backgroundColor: "white",
            }}
          />
        ) : modal ? (
          <Image source={phone} style={{ height: 30, width: 30, right: 10 }} />
        ) : null}
      </View>
      <View style={styles.iconStyleLeft}>
        {search ? (
          <Pressable type="clear" onPress={searchPage} title="Search">
            <IconSearch />
          </Pressable>
        ) : null}
        {notification ? (
          <Pressable
            type="clear"
            onPress={notiFication}
            title="Notification"
            //style={{ marginHorizontal: 10 }}
          >
            <IconBell />
            {notificationCount ? (
              <Badge
                value={notificationCount}
                containerStyle={{ position: "absolute", top: -3, right: 2 }}
                badgeStyle={{
                  backgroundColor: "#132742",
                }}
              />
            ) : null}
          </Pressable>
        ) : null}
        {call ? (
          <Pressable
            type="clear"
            onPress={() => callCustomercare(call)}
            title="Customer Care"
          >
            <IconPhoneCall />
            {cartCountshow ? (
              <Badge
                value={cartCountshow}
                containerStyle={{ position: "absolute", top: -3, right: 2 }}
                badgeStyle={{
                  backgroundColor: "#132742",
                }}
              />
            ) : null}
          </Pressable>
        ) : null}
        {chat ? (
          <TouchableOpacity onPress={()=>{navigationr.navigate('NutritionistLiveChat')}} type="clear" title="Customer Care">
            <IconMessageCircle />
          </TouchableOpacity>
        ) : null}
        {walletAmountLeft ? (
          <View style={{flexDirection:"row",alignItems:'center', marginTop:-5}} type="clear" title="Customer Care">
            <Text
              style={{
                fontSize: 17,
                // alignSelf: "flex-start",
                marginRight:10,
                color: "black",
              }}
            >
              {"₹ "+walletAmountLeft}
            </Text>
            <Image source={require('../../assets/icons/walletIcon.png')} 
        style={{
          height:25,width:25,
          padding: 5,
          paddingHorizontal: 0,
          paddingLeft: 20,
          paddingLeft: 20,
        }}/>
          </View>
        ) : null}
        {cart ? (
          <Pressable type="clear" onPress={cartPage} title="Add">
            <IconShoppingCart />
            {cartCountshow ? (
              <Badge
                value={cartCountshow}
                containerStyle={{ position: "absolute", top: -3, right: 2 }}
                badgeStyle={{
                  backgroundColor: "#132742",
                }}
              />
            ) : null}
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    textAlign: "left",
    opacity: 10,
   
  
    backgroundColor: "white",
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingHorizontal: 5,
    paddingVertical: 3,
 
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
  },
  categorytext: {},
  catetop: {
    // fontWeight: "bold",
    fontSize: 16,
    color: "#424553",
  },
  imageholder: {
    flex: 1,
    paddingTop: 3,
  },
  image: {
    height: 100,
    width: 100,
  },
  iconStyle: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "60%",
  },
  iconStyleLeft: {
    flex: 1,
    paddingVertical: 2,
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
});
export default Header;
