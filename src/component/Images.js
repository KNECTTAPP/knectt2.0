import React from 'react'
import { StyleSheet,View,SafeAreaView,Text, Image } from 'react-native'

const Images =({source,imageStyle})=>{
    return(
        <Image
           style={[styles.container,imageStyle]}
           source={source}
         />
    )
}
const styles=StyleSheet.create({
    container:{
        height:"10%",
        width:'50%',
        alignSelf:'center',
        
    },
    iconStyle:{
        flexDirection:'row',
        left:10
    }
})
export default Images;