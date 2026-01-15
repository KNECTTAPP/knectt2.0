import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'

const DropDown = ({ navigation }) => {
    const countries = ["Egypt", "Canada", "Australia", "Ireland"]
    return (
        <View style={styles.screenContainer}>
            <SelectDropdown
                data={countries}
                onSelect={(selectedItem, index) => {
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
    },
});

export default DropDown;