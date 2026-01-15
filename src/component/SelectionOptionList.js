import { View, Text, TouchableOpacity, SectionList } from 'react-native';
import React from 'react';
const SelectOptionList = ({ data, heading, selectItem, list, occcasionHeading, selectedOccasion, onChangeText, feet, measure }) => {
  console.log("measure==", measure)
  return (
    <View style={{ margin: 30 }}>
      <Text>{feet}</Text>
      {data.map((item) => {
        return (
          <TouchableOpacity onPress={() => selectItem(item.id, feet)}>
            <Text
              style={{ fontSize: 20, color: item.id === measure ? "#F79489" : 'black' }}
            >
              {item.id}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
export default SelectOptionList