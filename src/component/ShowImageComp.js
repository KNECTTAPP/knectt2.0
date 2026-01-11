import React, { useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import FastImage from "react-native-fast-image";
import LinearGradient from "react-native-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
// import colors from '../styles/colors';
import { colorsArray, colorsArray1 } from "../static/entries";
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ShowImageComp = ({ source, style, resizeMode = "cover" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { width, height } = useWindowDimensions();

  return (
    <View style={[styles.container, style]}>
      {/* Shimmer effect while the image is loading */}
      {isLoading && (
        <ShimmerPlaceholder
          width={width}
          duration={2000}
          shimmerStyle={[styles.shimmer, style]}
          shimmerColors={colorsArray1}
        >
          <View style={[styles.shimmerBackground, style]} />
        </ShimmerPlaceholder>
      )}

      {/* FastImage component */}
      <FastImage
        style={style}
        source={source}
        onLoadEnd={() => setIsLoading(false)} // Hide shimmer after image loads
        resizeMode={resizeMode}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    overFlow: "hidden",
    borderRadius: 12,
  },
  shimmer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  shimmerBackground: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10, // Optional: Add border radius if needed
  },
});

export default ShowImageComp;
