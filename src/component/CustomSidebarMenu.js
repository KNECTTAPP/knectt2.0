import React, { useEffect, useEffectEvent, useState } from "react";
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import "react-native-gesture-handler";

import AsyncStorage from "@react-native-async-storage/async-storage";
import logos from "../../assets/img/BrandLogoMobile.png";
//noimageprofile.png
import { useNavigation } from "@react-navigation/native";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView } from "react-native-safe-area-context";
import EndUrl from "../api/EndUrl";
import { closeDrawer } from "../navigation/DrawerService";
import fonts from "../utils/fonts";
const CustomSidebarMenu = (props) => {

  const navigationr = useNavigation()
  const [category, setCategory] = useState([]);
  const [token, setToken] = useState();
  const [state, setState] = useState("");
  const [isMenu, setIsmenu] = useState(0);
  const [affliateCreated, setAffliateCreated] = useState(0);

  const fetCheckaffliate = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    const settingsGet = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: JSON.parse(usertoken),
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      },
    };
    try {
      const response = await fetch(EndUrl.ifalreadyaffiliate, settingsGet);
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
      // console.log("json=======>", json);

      if (response.status == 200) {
        setAffliateCreated(json.affiliate_yes_no);
      }
    } catch (error) {
    } finally {
      //setLoading(false);
    }
  };
  const getMenucategory = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    const settingsGet = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: JSON.parse(usertoken),
        Version: DeviceInfo.getVersion().replace(/(\r\n|\n|\r)/gm, ""),
        Platform: Platform.OS,
      },
    };
    try {
      const response = await fetch(EndUrl.menuCategory, settingsGet);
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
      fetCheckaffliate();
      setCategory(json.data);
      // setIsmenu(1);
      isMounted = false;
    } catch (error) {
    } finally {
      //setLoading(false);
    }
  };


  const goTtoLogout = async () => {
    AsyncStorage.getAllKeys()
      .then((keys) => AsyncStorage.multiRemove(keys))
      .then(() => console.log("logout"));
    await AsyncStorage.removeItem("usertoken");
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("updateAvailable");
    await AsyncStorage.removeItem("forceUpdate");
    await AsyncStorage.removeItem("useOldFordeUpdatePopup");
    await AsyncStorage.removeItem("affiliateCode");
    await AsyncStorage.removeItem("affiliateCreated");
    await AsyncStorage.removeItem("affiliateCredentials");
    await AsyncStorage.removeItem("affiliateCredentialsData");
    await AsyncStorage.clear();
    closeDrawer()
    navigationr.reset({
      routes: [{ name: "Login" }],
    });
  };

  const goToCategory = (arg, catename) => {
    console.log("goToCategory-->", arg, catename);
    navigationr.navigate("Category", {
      cateId: arg,
      cateName: catename,
    });
  };
  const goMenuClick = (arg) => {
     navigationr.navigate(arg);
  };

  const goToMyOrder = () => {
    navigationr.navigate("TabNavigators", {
      screen: "My Order",
    });
  };

  const goMenuClickStatick = (arg, subargu) => {
     navigationr.navigate(arg, subargu);
  };

  useEffectEvent  (() => {
    if (isMenu == 0) {
      getMenucategory();
    }
    if (affliateCreated == 0) {
      fetCheckaffliate();
    }
  });
  

  useEffect(() => {
    getMenucategory();
   
  }, []);

  useEffect(() => {
    const unsubscribe = navigationr.addListener("state", (e) => {
      getUserToken();
    });

    return unsubscribe;
  }, []);

  const getUserToken = async () => {
    let usertoken = await AsyncStorage.getItem("usertoken");
    console.log("USERTOKEN::", usertoken);
    setToken(usertoken);
  };

  // console.log("category==>", category);

  return (
   <SafeAreaView>
      {/*Top Large Image */}
      <Image source={logos} style={styles.sideMenuProfileIcon} />
        
      <ScrollView 
      showsVerticalScrollIndicator={false}
      style={{height:'81%',marginBottom:80}}>
      
        <View style={styles.customItem}>
          {!token && (
            <Text
              onPress={() => {
               closeDrawer()
                navigationr.reset({
                  routes: [{ name: "Login" }],
                });
              }}
              style={styles.menupadding}
            >
              Log In
            </Text>
          )}
          <Text
            onPress={() => {
              goToMyOrder();
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            My Orders
          </Text>
          <Text
            onPress={() => {
              Linking.openURL("https://knectt.in/");
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            Become a Partner
          </Text>
          {affliateCreated == 1 ? (
            <Text
              onPress={() => {
                goMenuClick("AffiliateCredentials");
                 closeDrawer()
              }}
              style={styles.menupadding}
            >
              Ambassador credentials
            </Text>
          ) : (
            <Text
              onPress={() => {
                goMenuClick("Affiliate");
                 closeDrawer()
              }}
              style={styles.menupadding}
            >
              Become an Ambassador
            </Text>
          )}
          <Text
            onPress={() => {
              goMenuClick("RefeEarn");
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            Refer
          </Text>
          {/* <Text
            onPress={() => {
              goMenuClick("Notification");
            }}
            style={styles.menupadding}
          >
            Notification
          </Text> */}
          <Text
            onPress={() => {
              goMenuClick("Reviews");
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            Reviews
          </Text>
          <Text
            onPress={() => {
              goMenuClick("ContactUs");
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            Contact Us
          </Text>
          {token && (
            <Text
              onPress={() => {
                goMenuClick("Fewbasicinfo");
                 closeDrawer()
              }}
              style={styles.menupadding}
            >
              Edit Basic Info
            </Text>
          )}
          <View style={styles.lineStyle} />
          <Text style={styles.menuheading}>Products</Text>
          <Text
            onPress={() =>  {closeDrawer(),goMenuClick("Address")}}
            style={styles.menupadding}
          >
            Edit Addresses
          </Text>
          {/* <Text
            onPress={() => {
              goMenuClick("EditDietProfile");
            }}
            style={styles.menupadding}
          >
            Edit Body Profile
          </Text> */}
          {/* <Text style={styles.menupadding}>Categories</Text>
          <FlatList
            data={category}
            keyExtractor={({ id }, index) => id}
            initialNumToRender={1}
            renderItem={({ item }) => (
              <Text
                onPress={() => goToCategory(item.id, item.category)}
                style={styles.menupadding}
              >
                {" "}
                - {item.category}{" "}
              </Text>
            )}
          /> */}
          <View style={styles.lineStyle} />
          <Text style={styles.menuheading}>Nutrition</Text>
          {/* <Text
            onPress={() => {
              // goMenuClick("EditDietProfile");
              goMenuClick("ChatbotNutrition");
            }}
            style={styles.menupadding}
          >
            Edit Diet Profile
          </Text> */}
          <Text
            onPress={() => {
              // goMenuClick("Diet");
              goMenuClick("My Diet");
               closeDrawer()
              // navigationr.navigate("My Diet", { showHeader: true });
            }}
            style={styles.menupadding}
          >
            Diet Plans
          </Text>
          <Text
            onPress={() => {
              // goMenuClick("Diet");
              goMenuClick("DietTrackingScreen");
               closeDrawer()
              // navigationr.navigate("My Diet", { showHeader: true });
            }}
            style={styles.menupadding}
          >
            Track Progress
          </Text>
          <Text
            onPress={() => {
              goMenuClick("KnecttReport");
               closeDrawer()
              // navigationr.navigate("My Diet", { showHeader: true });
            }}
            style={styles.menupadding}
          >
            Predictive Health Report
          </Text>
          {/* <Text
            onPress={() => {
              goMenuClick("Upgrade");
            }}
            style={styles.menupadding}
          >
            Upgrade - Diet
          </Text> */}
          <View style={styles.lineStyle} />
          <Text style={styles.menuheading}>Policy and Legal</Text>
          <Text
            onPress={() => {
               closeDrawer()
              goMenuClickStatick("Policies", {
                arg: "about_us",
                name: "About Us",
              });
            }}
            style={styles.menupadding}
          >
            About Us
          </Text>
          <Text
            onPress={() => {
              goMenuClick("Policy");
               closeDrawer()
            }}
            style={styles.menupadding}
          >
            Entire Policy
          </Text>
          <Text
            onPress={() => {
               closeDrawer()
              goMenuClickStatick("Policies", {
                arg: "contact",
                name: "Contact Policy",
              });
            }}
            style={styles.menupadding}
          >
            Contact Policy
          </Text>
          <Text
            onPress={() => {
               closeDrawer()
              goMenuClickStatick("Policies", {
                arg: "cancel_refund",
                name: "Cancellation & Refund policy",
              });
            }}
            style={styles.menupadding}
          >
            Cancellation & Refund
          </Text>
          <Text
            onPress={() => {
               closeDrawer()
              goMenuClickStatick("Policies", {
                arg: "medical_disclaimer",
                name: "Medical disclaimer",
              });
            }}
            style={styles.menupadding}
          >
            Medical disclaimer
          </Text>
          {console.log("TOKEN", token)}
          {token && (
            <Text onPress={() =>{ closeDrawer(), goTtoLogout()}} style={styles.menupadding}>
              Log Out
            </Text>
          )}
          {token && (
            <Text
              onPress={() => {
                 closeDrawer()
                goMenuClickStatick("DeleteAccount");
              }}
              style={styles.menupadding}
            >
              Delete Account
            </Text>
          )}
        </View>
    </ScrollView>
    
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: "contain",
    width: 100,
    height: 100,
    alignSelf: "center",
  },
  menuIcontext: {
    width: "80%",
    alignSelf: "left",
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
  },
  customItemh: {
    color: "#3e4152",
    fontSize: 16,
    paddingLeft: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  lineStyle: {
    marginTop: 7,
    borderWidth: 0.9,
    borderColor: "#CCC",
    marginBottom: 7,
    width: "70%",
  },
  menupadding: {
    padding: 4,
    fontSize: 14,
  },
  menuheading: {
    margin: 2,
    fontFamily: fonts.whitneySemiBold,
    paddingRight: 15,
    marginLeft: 6,
    fontWeight: "500",
    marginBottom: 10,
    color: "#282c3fba",
    fontSize: 15,
  },
});

export default CustomSidebarMenu;
