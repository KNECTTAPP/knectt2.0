import React, { useState,Component,useEffect } from 'react';
import {Platform,View,Button,Text, Image,Linking,Dimensions,TouchableWithoutFeedback,Alert,StyleSheet, Pressable,  ScrollView,TouchableOpacity,FlatList, StatusBar } from 'react-native';
import HTMLView from 'react-native-htmlview';
import {scale} from 'react-native-size-matters';
import {TextField} from "rn-material-ui-textfield";
import { ProgressLoader } from '../component/ProgressLoader';
import Header from '../component/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage,{ showMessage, hideMessage } from "react-native-flash-message";
import EndUrl from '../api/EndUrl';
const SLIDER_1_FIRST_ITEM = 1;
import CheckBox from '@react-native-community/checkbox';
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