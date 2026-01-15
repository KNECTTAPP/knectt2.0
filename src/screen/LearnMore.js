import React, { Component } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../component/Header";
import strings from "../utils/strings";

const LearnMore = () => {
  return (
    <View style={styles.container}>
      <Header backButtonwithtext />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <Text style={styles.alertTitle}> {strings.redirect_title}</Text>
        <Text style={styles.alertDesc}>{strings.redirect_desc}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertTitle: { fontSize: 20, fontWeight: "600" },
  alertDesc: { fontSize: 14, marginTop: 10 },
  scroll: { paddingVertical: 20, paddingHorizontal: 10, marginVertical: 10 },
});

export default LearnMore;
