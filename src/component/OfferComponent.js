import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'

const OfferComponent = ({ offer_name, discount, source }) => {
    return (
        <View style={styles.container}>
            <Image style={{ height: "100%", width: "100%", borderRadius: 7 }} source={{ uri: source }} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 60,
        alignSelf: 'center',
        borderRadius: 7,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        elevation: 5,
        margin: 8,
        top: 5
    },
    textStyle: {
        fontSize: 14,
        color: '#999999'
    }

})
export default OfferComponent;