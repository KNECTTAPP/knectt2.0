import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";
import Carousel from "react-native-anchor-carousel";
import { useNavigation } from "@react-navigation/native";
import { SimplePaginationDot } from "../component/SimplePaginationDot";
import bodyMatchbtn from "../../assets/img/bodyMatchbtn.png";
import { scale } from "react-native-size-matters";
import fonts from "../utils/fonts";

const { width: windowWidth } = Dimensions.get("window");
const itmemwidth = windowWidth - 4;

const INITIAL_INDEX = 0;
export default function PlanProductCarousel(props) {
  const { data, cateName } = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [lastIndex, setLastIndex] = useState(0);
  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }
  const navigationr = useNavigation();
  const goToProductDetail = (arg, catename) => {
    navigationr.replace("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };
  const RadioButton = ({ onPress, selected, children }) => {
    return (
      <View style={styles.radioButtonContainer}>
        <TouchableOpacity onPress={onPress} style={styles.radioButton}>
          {selected ? <View style={styles.radioButtonIcon} /> : null}
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.radioButtonText}>{children}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  function renderItem({ item, index }) {
    return (
      <TouchableOpacity style={{ width: "100%", padding: 1, flex: 1 }}>
        <View style={styles.item}>
          <View style={styles.priceholder}>
            <Text>{item.title}</Text>{" "}
            {item.cutting_price ? (
              <Text>
                <Text style={styles.cutoffprice}>
                  {"\u20B9"}
                  {item.cutting_price}
                </Text>{" "}
                <Text style={styles.price}>
                  {"\u20B9"}
                  {item.price}{" "}
                </Text>
                <Text style={styles.discountPercentage}>
                  {" "}
                  ({item.discount} OFF){" "}
                </Text>
              </Text>
            ) : (
              <Text style={styles.price}>
                {"\u20B9"}
                {item.price}{" "}
                <Text style={styles.discountPercentage}>
                  ({item.discount} OFF)
                </Text>
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
        data={data}
        renderItem={renderItem}
        itemWidth={itmemwidth}
        inActiveOpacity={0.4}
        containerWidth={windowWidth - 8}
        onScrollEnd={handleCarouselScrollEnd}
        ref={carouselRef}
      />
      <SimplePaginationDot currentIndex={currentIndex} length={data.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#FFF", paddingVertical: 2 },
  carousel: {
    flexGrow: 0,
    aspectRatio: 1,
    margin: 1,
    marginBottom: 10,
  },

  item: {
    borderWidth: 0.5,
    borderTopWidth: 0,
    flex: 1,
    marginTop: 0,
    borderColor: "#CCC",
    width: "100%",
  },
  discountPercentage: {
    color: "#ff905a",
    marginLeft: 5,
    padding: 5,
    fontWeight: "400",
    fontFamily: fonts.whitneyMedium,
  },
  buttonText: {
    textAlign: "center",
    color: "#ffffff",
    padding: 5,
    backgroundColor: "transparent",
  },
  imageBox: {},
  productimage: {
    width: "100%",
    height: 300,
  },
  price: {
    fontWeight: "bold",
    fontFamily: fonts.whitneyMedium,
  },
  cutoffprice: {
    marginLeft: 5,
    paddingLeft: 5,
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    fontFamily: fonts.whitneyMedium,
    color: "#7e818c",
    marginRight: 10,
  },
  brand: {
    margin: 2,
    fontFamily: fonts.whitneySemiBold,
    paddingRight: 15,
    marginLeft: 6,
    fontWeight: "500",
    color: "#282c3fba",
    fontSize: scale(16),
  },
  price: {
    color: "#282C3F",
    fontFamily: fonts.whitneyMedium,
  },
  productname: {
    color: "#535665",
    fontFamily: fonts.whitneyLight,
    fontSize: scale(14),
    fontWeight: "400",
    marginLeft: 6,
    margin: 2,
    paddingRight: 15,
  },
  priceholder: {
    fontSize: scale(14),
    margin: 2,
    marginBottom: 20,
    marginLeft: 6,
    fontFamily: fonts.whitneyMedium,
    paddingRight: 0,
    flex: 1,
  },
  productlayout: {},
  imageholdertop: {
    flexDirection: "column",
    width: "20%",
  },
  headertxt: {
    width: "100%",
    fontSize: 29,
    fontWeight: 500,
    textAlign: "center",
    paddingTop: 3,
    marginTop: 6,
  },
  titleText: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
  imageholder: {
    flex: 1,
    textAlign: "center",
    padding: 5,
    margin: 5,
  },
  imagetop: {
    resizeMode: "contain",
    height: 85,
    width: 85,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 3,
  },
  image: {
    height: 100,
    width: 100,
  },
  textFont: {
    textAlign: "center",
    width: 100,
  },
  footertext: {
    backgroundColor: "pink",
    textAlign: "center",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonIcon: {
    height: 14,
    width: 14,
    borderRadius: 7,
    backgroundColor: "#132742",
  },
  radioButtonText: {
    fontSize: 16,
    marginLeft: 16,
  },
});
