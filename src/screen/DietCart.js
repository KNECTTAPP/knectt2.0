import React, { useState } from 'react'
import { StyleSheet, View, Text,  FlatList, TouchableOpacity } from 'react-native'
import CheckBox from 'react-native-check-box'
import Header from '../component/Header'
import { SafeAreaView } from 'react-native-safe-area-context'

const DietCart = () => {
    const List = [
        {
            id: 1,
            diet: 'Jashmine Tea',
            cart: 'Add To Cart'
        },
        {
            id: 2,
            diet: 'Slim juice',
            cart1: 'Buy From Outside'
        },
        {
            id: 3,
            diet: 'White Bran Atta',
            cart: 'Add To Cart'
        },
    ]
    const [checked, setChecked] = useState(false);
    return (
        <SafeAreaView style={styles.container}>
            <Header
                onPress={() => navigation.pop()}
                chatLogo
                modal
                chat
            />

            <View style={{ flex: 1 / 2, justifyContent: 'space-around', paddingHorizontal: 20, backgroundColor: 'white', margin: 10, borderRadius: 20, opacity: 20, elevation: 10 }}>
                <Text style={{ fontSize: 17, color: '#F79489' }}>Congratulations in taking your first step towards good health.</Text>
                <Text style={{ fontSize: 17, }}>Welcome to Slim/Premium.</Text>
                <Text style={{ fontSize: 17 }}>Your program will start when you receive your first set of diet plan</Text>
                <Text style={{ fontSize: 17 }}>Our diet team has recommended the following items which would be needed in the course of the program.</Text>
            </View>
            <View style={{ flex: 2 / 3, justifyContent: 'space-evenly' }}>
                <FlatList
                    data={List}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, height: 50, alignItems: 'center', backgroundColor: 'white', marginHorizontal: 20, borderRadius: 10, elevation: 5, opacity: 10, paddingHorizontal: 10 }}>
                                <Text style={{ fontSize: 14 }}>{item.id}</Text>
                                <Text style={{ fontSize: 14 }}>{item.diet}</Text>
                                {
                                    !item.cart1 ?
                                        <TouchableOpacity style={{ backgroundColor: '#F79489', width: "40%", height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10, opacity: 10 }}>
                                            <Text style={{ fontSize: 14, color: 'white' }}>{item.cart}</Text>
                                        </TouchableOpacity> :
                                        <View style={{ backgroundColor: '#F79489', width: "40%", height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 10, opacity: 10 }}>
                                            <Text style={{ fontSize: 14, color: 'white' }}>{item.cart1}</Text>
                                        </View>
                                }

                            </View>
                        )
                    }}
                />
                <View style={{ height: "30%", width: '100%', justifyContent: 'space-evenly', backgroundColor: 'white', opacity: 10, paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10 }}>
                        <CheckBox
                            style={{ flex: 1 }}
                            onClick={() => {
                                setChecked({
                                    checked: !checked
                                })
                            }}
                            checked={checked}
                        />
                        <Text numberOfLines={2} style={{ fontSize: 15, alignSelf: 'center' }}>Hereby I confirm that the above items are arranged</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <TouchableOpacity style={{ backgroundColor: '#F79489', width: "47%", height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 10 }}>
                            <Text style={{ fontSize: 14, color: 'white' }}>Review Cart and Pay</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ backgroundColor: '#F79489', width: "47%", justifyContent: 'center', alignItems: 'center', borderRadius: 10, height: 40 }}>
                            <Text style={{ fontSize: 14, color: 'white' }}>Start Diet</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }

})
export default DietCart