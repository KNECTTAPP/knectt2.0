import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import ButtonComponent from "./ButtonComponent";
import Images from "./Images";

const HomePlanComponent = ({
  onPress,
  textOne,
  textTwo,
  plan,
  priceOne,
  priceTwo,
  button,
  loginLogo,
  color,
  offer,
  planColor,
  chatPress,
  planheadingColor,
  titleText,
  id,
  textThree,
  special_price,
}) => {
  return (
    <View
      style={[styles.container, { backgroundColor: id != 8 ? color : "white" }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 15,
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 17, color: planColor, top: 5 }}>
              {textOne}
            </Text>
            {textOne === "PREMIUM" ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={{ uri: loginLogo }}
                  style={{ height: 40, width: 40, borderRadius: 20 }}
                />
              </View>
            ) : null}
          </View>
          <View style={{ height: 10 }} />
          <View style={{ minHeight: 10 }}>
            <Text style={{ color: planheadingColor, fontSize: 14 }}>
              {textTwo}
            </Text>
            <Text style={{ color: planheadingColor, fontSize: 14, width: 230 }}>
              {textThree}
            </Text>
            <Text
              style={{ color: planheadingColor, fontSize: 14, minWidth: 20 }}
            >
              {plan}
            </Text>
          </View>
        </View>

        <View style={{ top: 5 }}>
          <Text style={{ fontSize: 17, color: "#F79489" }}>
            Rs {special_price}
          </Text>
          <Text
            style={{
              fontSize: 17,
              color: "#999999",
              right: 4,
              textDecorationLine: "line-through",
              textDecorationStyle: "solid",
              textDecorationColor: "red",
            }}
          >
            {" "}
            Rs {priceTwo}
          </Text>
          <Text style={{ fontSize: 17, color: "#F79489" }}>{offer}% OFF</Text>
        </View>
      </View>

      <ButtonComponent
        text={button}
        buttonStyle={{
          backgroundColor: "#F79489",
        }}
        textStyle={{
          color: "white",
        }}
        onPress={chatPress}
      />
      <Text
        onPress={onPress}
        style={{
          alignSelf: "flex-end",
          marginRight: 20,
          color: "#F79489",
          fontSize: 14,
          bottom: 3,
        }}
      >
        Read More
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    backgroundColor: "white",
    // alignSelf: 'center',
    elevation: 10,
    // marginTop: 10,
    // paddingTop: 10,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  mainView1: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingHorizontal: 20
  },
  mainView2: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  readStyle: {
    alignSelf: "flex-end",
    right: 10,
    color: "white",
  },
});
export default HomePlanComponent;
