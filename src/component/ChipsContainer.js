import React, { Component, useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import colors from "../utils/colors";

const ChipsContainer = ({ data, selectedSlot }) => {
  const [selectedChip, setSelectedChip] = useState(null);
  const _onPressChip = (item) => {
    selectedSlot(item);
    setSelectedChip(item);
  };
  const _renderItem = ({ item }) => {
    return (
      <Pressable style={styles.container} onPress={() => _onPressChip(item)}>
        <View
          style={[
            styles.chip,
            selectedChip?.id === item?.id
              ? styles.chipSelected
              : styles.chipUnSelected,
          ]}
        >
          <Text
            style={
              selectedChip?.id === item?.id
                ? styles.text
                : styles.textUnSelected
            }
          >
            {item?.format_12_hrs?.start_time}-{item?.format_12_hrs?.end_time}
          </Text>
        </View>
      </Pressable>
    );
  };
  const ListEmptyComponent = () => (
    <Text style={[styles.title, styles.noSlots]}>No Available Slots</Text>
  );
  return (
    <>
      <Text style={styles.title}>Available Slots</Text>
      <FlatList
        data={data}
        renderItem={_renderItem}
        numColumns={2}
        style={styles.flatList}
        //contentContainerStyle={styles.contentContainerStyle}
        columnWrapperStyle={{ justifyContent: "space-evenly" }}
        ListEmptyComponent={ListEmptyComponent}
      />
    </>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    borderRadius: 99,
  },
  text: { color: colors.white },
  textUnSelected: { color: colors.black },
  flatList: { borderWidth: 1, borderRadius: 8, padding: 10 },
  title: { marginBottom: 5, marginLeft: 5, color: colors.black },
  contentContainerStyle: { alignItems: "center" },
  chipUnSelected: { backgroundColor: "#f5f5f5" },
  chipSelected: { backgroundColor: "#0b1354" },
  container: { justifyContent: "center", alignItems: "center" },
  noSlots: { textAlign: "center", fontWeight: "bold" },
});

export default ChipsContainer;
