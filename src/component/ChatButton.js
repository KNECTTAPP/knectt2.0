import React from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'

const ChatButton = ({ data, containerStyle, onPress, disabled }) => {
    // var onPress = {
    //     style: isPress ? styles.conatiner : styles.colorContainer,
    //     onPress
    // }
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.container, containerStyle]}>
            <Text style={{ fontSize: 15, color: 'black' }}>{data}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    colorContainer: {
        backgroundColor: 'white',
        height: 30,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    }

})
export default ChatButton