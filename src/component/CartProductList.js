import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { Minus, Plus } from "react-native-feather";
import { IconTrash } from "./IconComp";
import { handleDecimal } from "../utils/commonFunctions";
const CartProductList = ({
  image,
  title,
  price,
  quantity = 1,
  handleDelete,
  onPressDecrement,
  produDetail,
  onPressIncrement,
}) => {
  const rightSwipe = () => {
    return (
      <View style={styles.deleteButtonContainer}>
        <TouchableOpacity onPress={handleDelete}>
          {/* <Feather name="trash-2" size={25} /> */}
          <IconTrash />
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <GestureHandlerRootView>
      <View style={styles.containerOuter}>
        <Swipeable renderRightActions={rightSwipe}>
          <View style={styles.container}>
            <View style={styles.fixeddeleteicon}>
              <TouchableOpacity onPress={handleDelete}>
                {/* <Feather
                    style={{color:'#F79489',fontWeight:'bold'}}
                    name="trash-2"
                    size={25}
                  /> */}
                <IconTrash />
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={produDetail}>
                <Image source={{ uri: image }} style={styles.productImage} />
              </TouchableOpacity>
            </View>
            <View style={styles.productInfoContainer}>
              <View style={styles.titleholder}>
                <Text numberOfLines={2} style={styles.productTitle}>
                  {title}
                </Text>
              </View>
              <View style={styles.productListBottomContainer}>
                <View style={styles.productpo}>
                  <Text style={styles.productPrice}>
                    {"\u20B9"} {handleDecimal(price * quantity)}
                  </Text>
                </View>
                <View style={styles.counter}>
                  <TouchableOpacity
                    style={styles.counterButtonContainer}
                    onPress={onPressDecrement}
                  >
                    <Minus
                      color={"#ffffff"}
                      strokeWidth={2}
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                  <Text style={styles.counterCountText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.counterButtonContainer}
                    onPress={onPressIncrement}
                  >
                    <Plus
                      color={"#ffffff"}
                      strokeWidth={2}
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    </GestureHandlerRootView>
  );
};
export default CartProductList;

const styles = StyleSheet.create({
  fixeddeleteicon: {
    position: "absolute",
    right: 5,
    top: 5,
    display: "flex",
    color: "#F79489",
    zIndex: 1,
  },
  productpo: {
    width: "50%",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#CCC",
    borderRadius: 5,
    backgroundColor: "#FFF",
    height: 100,
    width: "96%",
    padding: 2,
    margin: 2,
    marginBottom: 2,
  },
  titleholder: {
    display: "flex",
    flexDirection: "row",
    width: "90%",
  },
  containerOuter: {
    height: 120,
    width: "100%",
    paddingTop: 2,
    paddingBottom: 2,
  },
  productImage: {
    width: 90,
    height: 90,
  },
  imageContainer: {
    backgroundColor: "#EFF",
    borderRadius: 10,
  },
  productInfoContainer: {
    padding: 5,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 30,
    flex: 1,
  },
  productQuantitySm: {
    fontSize: 15,
    fontWeight: "bold",
  },
  productPrice: {
    fontSize: 15,
    color: "#000",
  },
  deleteButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#CCF",
    borderTopEndRadius: 15,
    borderBottomRightRadius: 15,
    marginBottom: 10,
    width: 70,
  },
  productListBottomContainer: {
    width: "auto",
    paddingRight: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: {
    backgroundColor: "#FFF",
    width: "30%",
    padding: 5,
    borderRadius: 5,
    borderBottomRightRadius: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  counterButtonContainer: {
    display: "flex",
    width: 30,
    height: 30,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F79489",
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  counterButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  counterCountText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
