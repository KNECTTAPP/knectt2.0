import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';
import {scale} from 'react-native-size-matters';
import {appColors} from '../utils/appColors';
import Label from './Label';

export default function ProductCard({navigation, item}) {
  const {title,name, description, price, image, isNew,rating} = item;
  //console.log({item});
  return (
    <Pressable onPress={() => navigation.navigate('ProductDetails',{item})} style={{}}>
      <View
        style={{
          height: scale(200),
           width: scale(160),
          //backgroundColor:appColors.lightGray
        }}>
        <Image 
        resizeMode='contain'
        style={{height:scale(200), width:scale(180)}} 
        source={{ uri:image}} />
        {isNew && (
          <View
            style={{
              backgroundColor:appColors.red,
              position: 'absolute',
              top: scale(10),
              right: scale(20),
              padding: scale(3),
              borderRadius: scale(3),
              paddingHorizontal: scale(10),
            }}>
             
            <Label text="New" style={{fontSize:scale(10), color:appColors.white}} />
          </View>
        )}
      </View>
      <View style={{paddingVertical: scale(3)}}>
        <Text style={{fontSize: scale(18),fontWeight: '500'}}>{title?.substring(0, 20)}</Text>
      </View>

      <View style={{paddingVertical: scale(2)}}>
        <Text style={{fontSize: scale(13),fontWeight: '500'}}>{description?.substring(0, 24)}</Text>
      </View>

      <View style={{paddingVertical: scale(5)}}>
        <Text style={{fontSize: scale(18),fontWeight: '500'}}>{price}</Text>
      </View>
    </Pressable>
  );
}