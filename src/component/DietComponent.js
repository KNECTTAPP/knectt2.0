import React from "react";
import { StyleSheet, View, Text, Image, FlatList } from "react-native";
import logo from "../../assets/img/morningdiet.jpg";

const DietComponent = ({ time, calories, diet, quantity, images }) => {
  return (
    <View style={styles.MorningDietStyle}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 25,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            //fontWeight: "bold",
            color: "#99999",
            marginVertical: 10,
          }}
        >
          {time}
        </Text>
        <Text style={{ color: "#132742", marginVertical: 10 }}>{calories}</Text>
      </View>
      {diet ? (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {diet.map((item, index) => {
            return (
              <View
                style={{
                  flexDirection: "column",
                  width: "95%",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    width: "90%",
                    alignItems: "center",
                    borderRadius: 10,
                    //height: 70,
                    elevation: 10,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                  }}
                >
                  <Image
                    source={{ uri: images[index] }}
                    style={{
                      height: 70,
                      width: 90,
                      borderTopLeftRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      width: "70%",
                      paddingLeft: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        //fontWeight: "bold",
                        color: "#99999",
                        flex: 1,
                      }}
                    >
                      {item}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "gray", color: "#99999" }}
                    >
                      {quantity}
                    </Text>
                  </View>
                </View>
                <View style={{ height: 10 }} />
              </View>
            );
          })}
        </View>
      ) : null}
    </View>
  );
};
const styles = StyleSheet.create({
  MorningDietStyle: {
    // justifyContent: 'space-between',
    // paddingVertical: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});
export default DietComponent;
