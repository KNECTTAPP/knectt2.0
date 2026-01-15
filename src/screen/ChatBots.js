import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text,  Image, FlatList, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import Header from '../component/Header';
import Inputtext from '../component/InputText';
// import ChatBot from 'react-native-chatbot';
import logo from '../../assets/img/forwardarrow.jpg'
import ChatButton from '../component/ChatButton';
import ChatBotComponent from '../component/ChatBotComponent';
import DropDown from '../component/DropDown';
import ChatBoatModal from '../component/ChatBoatModal';
import brandlogo from '../../assets/img/BrandLogo.png'
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomPopUp from '../component/BottomPopUp';
import SelectOptionList from '../component/SelectionOptionList';
import { Question } from '../Array/ArrayList';
import { SafeAreaView } from "react-native-safe-area-context";
// var ids = 0;
const ChatBots = ({ navigation }) => {

    const [ques, setQues] = useState(Question)

    const [select2, setSelect2] = useState('')
    const [food, setFood] = useState()
    const [toggleData, settoggleData] = useState()
    const [ans, setAnswer] = useState([])
    const [count, setCount] = useState(0)
    const [decrimentCount, setDecrimentCount] = useState(0)
    const [quesData, setQuestData] = useState('')
    const [id, setId] = useState()
    const [value, setValue] = useState('')
    const [idDecrease, setIdDecrease] = useState(0)
    const [toValue, setToValue] = useState(0)
    const [listItem, setListItem] = useState()
    const [selectedData, setSelectedData] = useState('')
    const [heading, setHeading] = useState('')
    const [feet, setFeet] = useState('')
    const [inch, setInch] = useState('')
    const [measure, setMeasure] = useState('')

    const countQuestion = async () => {
        ques.map((item, index) => {
            if (count === index) {
                let newArray = [...ans]
                if (value != '') {
                    newArray.push({ id: index, answer: value })
                    setAnswer(newArray)
                    AsyncStorage.setItem("MyKey", JSON.stringify(newArray))
                }
                setQuestData(item.message)
                setSelect1(item.select1)
                setSelect2(item.select2)
                setId(item.id)
                settoggleData(item.data)
                setFood(item.preferece)
                console.log("question===", count, id)
            }
            if (count === item.id) {
                setCount(count + 1)
            }
            setValue('')
        })
    }
    const getData = async () => {
        try {
            let newList = JSON.parse(await AsyncStorage.getItem('MyKey'))
            console.log('newList===', newList)
            setAnswer(newList);
            console.log("newList===", newList)
        } catch (e) {
            console.log(e)
        }
    }
    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem('MyKey')
        } catch (e) {
            // remove error
        }

        console.log('Done.')
    }
    useEffect(() => {
        // getData();
        countQuestion();
        // backQuestion()
    }, [])
    const handleClose = () => {
        toValue == 1 && setToValue({ toValue: 0, openModal: false })
    }
    const backQuestion = (countDecrease, idDec) => {
        console.log("ajkjs===", countDecrease, idDec)
        // setCount(countDecrease)
        // setId(idDec)
        // ques.map((item, index) => {
        //     if ((count === index) && id != 4) {
        //         let newArray = [...ans]
        //         if (value != '') {
        //             newArray.push({ id: index, answer: value })
        //             setAnswer(newArray)
        //             AsyncStorage.setItem("MyKey", JSON.stringify(newArray))
        //         }
        //         setQuestData(item.message)
        //         setSelect1(item.select1)
        //         setSelect2(item.select2)
        //         setId(item.id)
        //         settoggleData(item.data)
        //         setFood(item.preferece)
        //     }
        // })
    }
    const ShowpopUp = (list, select) => {
        setHeading(select)
        setListItem(list)
        setToValue(1)
    }
    const selectItem = async (item, feet) => {
        if (heading === 'feet.inch') {
            let data = []
            if (feet === 'feet') {
                var feets = item
                // setMeasure(feets)
                setValue(feets)
                await AsyncStorage.setItem("MyKey", JSON.stringify(feets))
                setToValue(1)
            } else {
                var inches = item
                let newList = JSON.parse(await AsyncStorage.getItem('MyKey'))
                setValue(newList + "." + inches)
                console.log("data===", data)
                // setMeasure(item)
                // setMeasure(feets)
                setToValue(0)

            }
            setSelectedData(item)

        } else {
            setSelectedData(item)
            setValue(item)
            // setMeasure(item)
            setToValue(0)

        }

    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            {/* {
                console.log("newArray==", ans)
            } */}
            {/* {console.log("countDecrease==", count)} */}
            <Header
                onPress={() => navigation.pop()}
                logo
                chatLogo
                backButton
                chat
            />
            {/* <ScrollView> */}
            <View style={{ flex: 1 / 4, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={brandlogo}
                    style={{ height: 150, width: 150 }}
                />
            </View>
            <View style={{ flex: 2 / 3, alignItems: 'center', bottom: 10 }}>
                <Text style={{ alignSelf: 'flex-start', margin: 10, left: 17, color: '#99999', fontSize: 17 }}>Diet Profile Creations</Text>
                <ChatBotComponent
                    count={count}
                    decrimentCount={decrimentCount}
                    id={id}
                    message={quesData}
                    select1={select1}
                    select2={select2}
                    countQuestion={countQuestion}
                    onChangeText={(text) => setValue(text)}
                    value={value}
                    toggleData={toggleData}
                    food={food}
                    backQuestion={backQuestion}
                    toValue={toValue}
                    ShowpopUp={ShowpopUp}
                    selectedData={selectedData || ''}
                    setSelectedData={setSelectedData}
                />
            </View>
            <BottomPopUp closeModal={handleClose} isVisible={toValue == 1 ? true : false} >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 17, color: '#F79489' }}>{heading}</Text>
                    <Text onPress={() => setToValue(0)} style={{ fontSize: 22, color: '#F79489' }}>X</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <SelectOptionList
                        data={listItem}
                        selectItem={selectItem}
                        feet={heading === "feet.inch" ? "feet" : ''}
                    />
                    {
                        heading === 'feet.inch' &&
                        <SelectOptionList
                            data={listItem}
                            selectItem={selectItem}
                            feet={heading === "feet.inch" ? "inch" : ''}
                        />
                    }
                </View>
            </BottomPopUp>
            {/* </ScrollView> */}
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({

})
export default ChatBots;