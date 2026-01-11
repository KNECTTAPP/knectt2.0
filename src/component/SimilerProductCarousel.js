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
import { scale } from "react-native-size-matters";
import fonts from "../utils/fonts";

const { width } = Dimensions.get("window");
const windowWidth = width;
//const itmemwidth = windowWidth - 2;

const INITIAL_INDEX = 0;
export default function SimilerProductCarousel(props) {
  const { data, cateName, bodyMatchbtn } = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [lastIndex, setLastIndex] = useState(0);
  const handleCarouselScrollEnd = (item, index) => {
    let newIdx = 0;
    if (!index || index == -1) {
      newIdx = 0;
    } else {
      newIdx = index;
    }
    setCurrentIndex(newIdx);
  };
  const navigationr = useNavigation();
  const goToProductDetail = (arg, catename) => {
    navigationr.replace("ProductDetail", {
      proId: arg,
      cateName: catename,
    });
  };

  function renderItem({ item, index }) {
    return (
      <TouchableOpacity
        onPress={() => goToProductDetail(item.id, cateName)}
        style={{ width: "100%", padding: 1, flex: 1 }}
      >
        <View style={styles.item}>
          <Image
            source={{ uri: item.images }}
            style={{
              height: scale(200),
              width: "95%",
              marginBottom: 2,
              padding: 6,
              margin: 4,
            }}
          />
          <View style={styles.bodymtch}>
            <Image
              source={{ uri: bodyMatchbtn }}
              style={{
                justifyContent: "center",
                minHeight: 40,
                alignItems: "center",
                width: "100%",
              }}
            />
          </View>
          <Text style={styles.brand}>{item.brand_name}</Text>
          <Text style={styles.productname}>
            {item.title.length < 22
              ? `${item.title}`
              : `${item.title.substring(0, 19)}...`}
          </Text>
          <View style={styles.priceholder}>
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
      {console.log("DJNBASNABSBASA", windowWidth / 2, windowWidth - 8)}
      <Carousel
        style={styles.carousel}
        data={data}
        renderItem={renderItem}
        itemWidth={Math.floor(windowWidth / 2)}
        containerWidth={365}
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
  bodymtch: {
    justifyContent: "center",
    alignItems: "center",
    margin: 3,
    padding: 2,
    flex: 1,
    width: "100%",
  },
  rightTextContainer: {
    width: "100%",
    position: "absolute",
    paddingBottom: 3,
    marginBottom: 3,
    bottom: 1,
    textAlign: "center",
    borderRadius: 5,
    textAlignVertical: "bottom",
  },
  rightText: { color: "white", textAlign: "center" },
  lowerContainer: {
    flex: 1,
    margin: 10,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
  },
  contentText: {
    marginTop: 10,
    fontSize: 12,
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
  square: {
    borderColor: "black",
    paddingTop: 0,
    paddingRight: 4,
    paddingLeft: 4,
    paddingBottom: 0,
    height: 90,
  },
  linearGradient: {
    margin: 2,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    color: "#FFF",
    width: scale(150),
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
});
