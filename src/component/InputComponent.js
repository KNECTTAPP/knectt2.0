import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity, TextInput } from 'react-native'
import Icon from '../../assets/img/large_glass.png'
import Icon1 from '../../assets/img/1.png'
import ButtonComponent from './ButtonComponent'
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import DateRangePicker from "rnv-date-range-picker";

const InputComponent = ({ show, item, userData, onfunctionCall, dateRange, inputperdata }) => {
    //const [selectedRange, setRange] = useState(dateRange);
    let selectedRange = dateRange;
    //var selectedRange = dateRange;
    const [water, setWater] = useState(0);
    const [weight, setWeight] = useState(0);
    const [sleep, setSleep] = useState(0);
    let firstDate = selectedRange.firstDate;
    let secondDate = selectedRange.secondDate;

    useEffect(() => {
        setWater('');
        setWeight('');
        setSleep('');
    }, [show]);

    const handleTextChange = (text) => {
        setWater(text)
        console.log(inputperdata.water)
        onfunctionCall(text, 'setWater', '-', 1)
    }
    const handleWight = (text) => {
        setWeight(text);
        onfunctionCall(text, 'weightQunity', '-', 2)
    }
    const handleSleep = (text) => {
        setSleep(text);
        onfunctionCall(text, '', '-', 3);
    }
    return (
        <View>
            {item.gender == 'female' ?
                <View style={styles.container}>
                    <Text style={{ fontSize: 14, margin: 10, left: 0, color: '#000' }}>{item.question} </Text>
                    {item.id == 1 ?
                        <View>
                            <View style={styles.innerView}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, width: '55%' }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <Text style={{ fontSize: 14, color: '#000' }}>{item.quantity}</Text>
                                        <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999' }}>Last entered in liters </Text>
                                        <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999' }}>{item.target}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, marginLeft: 50 }}>
                                    <TextInput style={styles.input} placeholder="In liters" value={inputperdata.water} onChangeText={(val) => handleTextChange(val)} onBlur={(val) => handleTextChange(val)} keyboardType="numeric" />
                                </View>
                            </View>
                            <View style={{ height: 25 }} />
                        </View> :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            {(item.id != 4 && item.unit) ?

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, width: '55%' }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <Text style={{ fontSize: 14, color: '#000' }}>{item.quantity} {item.unit}</Text>
                                        {item.valuedtext ? <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999', paddingBottom: 10 }}>{item.valuedtext}</Text> : null}
                                        {item.target ? <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999', paddingBottom: 10 }}>{item.target}</Text> : null}
                                    </View>
                                </View>
                                : null}
                            {
                                item.id == 4 ? <View style={styles.container}>
                                    <DateRangePicker
                                        onSelectDateRange={(range) => {
                                            //setRange(range);
                                            selectedRange = range;
                                            onfunctionCall(range, 'mensuration', range, 4);
                                        }}
                                        selectedDateContainerStyle={styles.selectedDateContainerStyle}
                                        selectedDateStyle={styles.selectedDateStyle}
                                        firstDate={firstDate}
                                        secondDate={secondDate}
                                        responseFormat="YYYY-MM-DD"
                                        maxDate={moment().add(60, "days")}
                                        minDate={moment().subtract(60, "days")}
                                    />
                                    <View style={styles.container}>
                                        <Text style={{ fontSize: 14, color: '#000', paddingLeft: 5, paddingTop: 5, paddingBottom: 5 }}>Mensturation start date: {selectedRange.firstDate}</Text>
                                        <Text style={{ fontSize: 14, color: '#000', paddingLeft: 5, paddingBottom: 5 }}>Mensturation end date: {selectedRange.secondDate}</Text>
                                    </View>
                                </View> : null
                            }
                            {
                                item.id > 4 && item.id < 8 ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', left: 80, width: '80%' }}>

                                        <ButtonComponent
                                            textStyle={(item.value == 1) ? styles.activeTextColor : styles.inactiveTextColor}
                                            buttonStyle={(item.value == 1) ? styles.activeYes : styles.activeNo}
                                            text={item.yes}
                                            onPress={() => onfunctionCall(1, 'extras', 1, item.id)}
                                        />

                                        <ButtonComponent
                                            textStyle={(item.value == 0) ? styles.activeTextColor : styles.inactiveTextColor}
                                            buttonStyle={(item.value == 0) ? styles.activeYes : styles.activeNo}
                                            onPress={() => onfunctionCall(0, 'extras', 0, item.id)}
                                            text={item.no} />

                                    </View> : null
                            }
                            {
                                item.id == 8 ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                        {
                                            item.steressvalue == 1 ? <Image
                                                source={item.imojilis[0].image1} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(1, 'stress', 1, item.id)}>
                                                    <Image
                                                        source={item.imojilis[0].image1} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 2 ? <Image
                                                source={item.imojilis[0].image2} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(2, 'stress', 1, item.id)}>
                                                    <Image
                                                        source={item.imojilis[0].image2} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 3 ? <Image
                                                source={item.imojilis[0].image3} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(3, 'stress', 1,)}>
                                                    <Image
                                                        source={item.imojilis[0].image3} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 4 ? <Image
                                                source={item.imojilis[0].image4} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(4, 'stress', 1, item.id)}>
                                                    <Image source={item.imojilis[0].image4} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 5 ? <Image
                                                source={item.imojilis[0].image5} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(5, 'stress', 1, item.id)}>
                                                    <Image source={item.imojilis[0].image5} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }

                                    </View> : null
                            }

                            {
                                item.id > 1 && item.id < 4 ?

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, marginLeft: 50 }}>
                                        {item.id == 2 ?
                                            <TextInput style={styles.input} placeholder={("In ") + item.unit} value={inputperdata.weight} onChangeText={(val) => handleWight(val)} keyboardType="numeric" />
                                            : null
                                        }
                                        {item.id == 3 ?
                                            <TextInput style={styles.input} value={inputperdata.sleep} placeholder={("In ") + item.unit} onChangeText={(val) => handleSleep(val)} keyboardType="numeric" />
                                            : null
                                        }
                                    </View>
                                    : null}
                        </View>
                    }
                </View> :
                <View style={(item.id != 4 ? styles.container : styles.containerhide)}>
                    {item.id != 4 ?
                        <Text style={{ fontSize: 14, margin: 10, left: 0, color: '#000' }}>{item.question} </Text>
                        : null
                    }
                    {item.id == 1 ?
                        <View>
                            <View style={styles.innerView}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, width: '55%' }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <Text style={{ fontSize: 14, color: '#000' }}>{item.quantity}</Text>
                                        <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999' }}>Last entered in liters </Text>
                                        <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999' }}>{item.target}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, marginLeft: 50 }}>
                                    <TextInput style={styles.input} placeholder="In liters" value={inputperdata.water} onChangeText={(val) => handleTextChange(val)} keyboardType="numeric" onBlur={(event) => onfunctionCall(water, 'setWater', '-', item.id)} />
                                </View>
                            </View>
                            <View style={{ height: 25 }} />
                        </View> :
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 10 }}>
                            {(item.id != 4 && item.unit) ?

                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, width: '55%' }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 0 }}>
                                        <Text style={{ fontSize: 14, color: '#000' }}>{item.quantity} {item.unit}</Text>
                                        {item.valuedtext ? <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999', paddingBottom: 10 }}>{item.valuedtext}</Text> : null}
                                        {item.target ? <Text style={{ fontSize: 14, color: '#000', fontStyle: 'italic', color: '#999', paddingBottom: 10 }}>{item.target}</Text> : null}
                                    </View>
                                </View>
                                : null}
                            {
                                item.id > 4 && item.id < 8 ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', left: 80, width: '80%' }}>

                                        <ButtonComponent
                                            textStyle={(item.value == 1) ? styles.activeTextColor : styles.inactiveTextColor}
                                            buttonStyle={(item.value == 1) ? styles.activeYes : styles.activeNo}
                                            text={item.yes}
                                            onPress={() => onfunctionCall(1, 'extras', 1, item.id)}
                                        />

                                        <ButtonComponent
                                            textStyle={(item.value == 0) ? styles.activeTextColor : styles.inactiveTextColor}
                                            buttonStyle={(item.value == 0) ? styles.activeYes : styles.activeNo}
                                            onPress={() => onfunctionCall(0, 'extras', 0, item.id)}
                                            text={item.no} />

                                    </View> : null
                            }
                            {
                                item.id == 8 ?
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
                                        {
                                            item.steressvalue == 1 ? <Image
                                                source={item.imojilis[0].image1} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(1, 'stress', 1, item.id)}>
                                                    <Image
                                                        source={item.imojilis[0].image1} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 2 ? <Image
                                                source={item.imojilis[0].image2} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(2, 'stress', 1, item.id)}>
                                                    <Image
                                                        source={item.imojilis[0].image2} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 3 ? <Image
                                                source={item.imojilis[0].image3} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(3, 'stress', 1, item.id)}>
                                                    <Image
                                                        source={item.imojilis[0].image3} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 4 ? <Image
                                                source={item.imojilis[0].image4} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(4, 'stress', 1, item.id)}>
                                                    <Image source={item.imojilis[0].image4} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }
                                        {
                                            item.steressvalue == 5 ? <Image
                                                source={item.imojilis[0].image5} style={styles.imageroundact} /> :
                                                <TouchableOpacity onPress={() => onfunctionCall(5, 'stress', 1, item.id)}>
                                                    <Image source={item.imojilis[0].image5} style={styles.imageround} />
                                                </TouchableOpacity>
                                        }

                                    </View> : null
                            }

                            {
                                item.id > 1 && item.id < 4 ?

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, marginLeft: 50 }}>
                                        {item.id == 2 ?
                                            <TextInput style={styles.input} placeholder={("In ") + item.unit} value={inputperdata.weight} onChangeText={(val) => handleWight(val)} keyboardType="numeric" />
                                            : null
                                        }
                                        {item.id == 3 ?
                                            <TextInput style={styles.input} value={inputperdata.sleep} onChangeText={(val) => handleSleep(val)} placeholder={("In ") + item.unit} keyboardType="numeric" />
                                            : null
                                        }
                                    </View>
                                    : null}
                        </View>
                    }
                </View>

            }
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        justifyContent: 'space-between',
        width: "95%",
        alignSelf: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        marginVertical: 5,
        elevation: 10
    },
    containerhide: {
        display: 'none'
    },
    activeTextColor: {
        color: '#fff'
    },
    inactiveTextColor: {
        color: '#000'
    },
    activeYes: {
        width: 100, borderRadius: 20, borderWidth: 1, borderColor: 'lightgray', backgroundColor: '#132742'
    },
    activeNo: {
        width: 100, borderRadius: 20, borderWidth: 1, borderColor: 'lightgray', backgroundColor: 'white'
    },
    imageround: {
        width: 55,
        height: 55,
    },
    imageroundact: {
        width: 55,
        height: 55,
        borderColor: '#ccc',
        borderWidth: 1
    },
    innerView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8
    },
    counterButtonContainer: {
        display: "flex",
        width: 30,
        height: 30,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F79489',
        borderRadius: 15,
        elevation: 2,
    },
    selectedDateStyle: {
        fontWeight: 'bold',
        color: 'white',
    },
    counterButtonText: {
        fontSize: 20,
        fontWeight: "bold",
        color: '#FFF',
    },
    counterCountText: {
        fontSize: 20,
        fontWeight: "bold",
    },
    input: {
        height: 40,
        width: '50%',
        marginTop: 10,
        fontSize: 16,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
    }
})
export default InputComponent