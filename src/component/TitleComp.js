import React from 'react'
import { View, Text } from 'react-native'
import { scale } from 'react-native-size-matters'

export default function TitleComp({heading, rightLabel, renderRight, subLabel}) {
    return (
        <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <View style={{}}>
        <Text style={{fontSize: scale(20), fontWeight: '600'}}>{heading}</Text>
        {subLabel &&  <Text style={{fontSize:scale(12), opacity:scale(.5), marginTop:scale(10)}}>{subLabel}</Text> }
        </View>
        {!renderRight &&rightLabel&& <Text style={{fontSize: scale(14)}}>{rightLabel}</Text>}
        {renderRight&&renderRight()}
      </View>
    )
}
