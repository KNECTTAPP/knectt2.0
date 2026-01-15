import CheckBox from '@react-native-community/checkbox';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
const SLIDER_1_FIRST_ITEM = 1;
var id = 0;
const TestProfileScreen = ({ navigation,route}) => {
    const [isSelected, setSelection] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const secheckbox =(value)=>{
        var oldArray = [];
        setSelection(oldArray.push(value));
    }
    useEffect(() => {
        setRefresh(!refresh);
      }, [refresh]);
    return (
            <View>    
                <View>
                    <CheckBox value={isSelected} onValueChange={secheckbox('sun')} style={styles.checkbox} />
                    <Text style={styles.label}>Open on Saturday</Text>
                </View>
                <View>
                    <CheckBox value={isSelected} onValueChange={secheckbox('mon')} style={styles.checkbox} />
                    <Text style={styles.label}>Open on Saturday</Text>
                </View>
            </View>
        
    )
}
export default TestProfileScreen;
const styles = StyleSheet.create({
checkboxContainer: {
    flexDirection: "row",
    marginBottom: 3,
  },
  checkbox: {
    alignSelf: "center",
  },
})