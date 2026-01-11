import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ImageTitleSubtitle = ({
  image,
  title,
  subtitle,
  titleStyles,
  subtitleStyle,
}) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      {title && <Text style={[styles.title, titleStyles]}>{title}</Text>}
      {subtitle ? (
        <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
});

export default ImageTitleSubtitle;
