import React from 'react'
import { View, Text } from 'react-native'
import { scale } from 'react-native-size-matters'
import CheckBox from './CheckBox'
import TitleComp from './TitleComp'

export default function SelectAble({selected,onSelect,item}) {
    const {label,subLabel}=item
    return (
        <View style={{flex: 1,paddingVertical:scale(20)}}>
        <TitleComp heading={label} />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1, paddingVertical:scale(10)}}>
            <Text style={{fontSize:scale(13)}}>{subLabel}</Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <CheckBox onPress={()=>onSelect && onSelect(item)}  isChecked={selected}  />
          </View>
        </View>
      </View>

    )
}
