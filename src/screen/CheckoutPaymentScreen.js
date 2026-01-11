import React, { useState, useEffect, useRef, useCallback } from 'react'
import { StyleSheet, View, Text, SafeAreaView, TextInput, ToastAndroid } from 'react-native'
import ButtonComponent from '../component/ButtonComponent'
import Header from '../component/Header'
import EndUrl from '../api/EndUrl';
import AsyncStorage from '@react-native-async-storage/async-storage'

const CheckoutPaymentScreen = ({ route, navigation }) => {
    let textInput = useRef(null)

    return (
        <View><Text>CheckoutPayment</Text></View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    
})
export default CheckoutPaymentScreen;