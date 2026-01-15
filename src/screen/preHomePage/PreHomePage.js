// OptionsModal.js
import React, { useEffect, useState } from "react";
import { Modal, View, TouchableOpacity, StyleSheet, Image, Text, ActivityIndicator } from "react-native";
import fonts from '../../utils/fonts';
import colors from '../../utils/colors';
import { useNavigation } from "@react-navigation/native";
import ShowImageComp from "../../component/ShowImageComp";
import { ButtonCustom } from "../../component/ButtonCustom";

export default function OptionsModal({ visible, onClose, data, loading }) {
  const navigation = useNavigation();

  const handleNavigate = (type) => {
    onClose();

    // switch (type) {
    //   case 0:
    //     navigation.navigate("Category",{"cateId": "12", "cateName": "Blood Test"});
    //     break;
    //   case 1:
    //     // Do nothing or add logic for type 2 if needed
    //     navigation.navigate('UploadReport')
    //     break;
    //   case 2:
    //     // Add navigation or action for type 3 as needed, for example:
    //     navigation.navigate("TabNavigators", { screen: "Home" });
    //     break;
    //   default:
    //     // Default action if none of the above cases match
    //     navigation.navigate("TabNavigators", { screen: "Home" });
    //     break;
    // }
  };


  // const cards = [
  //   {
  //     id: "KNECTT_PLUS",
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: "KNECTT_PREMIUM",
  //     image: "https://picsum.photos/200/300",
  //   },
  //   {
  //     id: "DIY",
  //     image: "https://picsum.photos/200/300",
  //   },
  // ];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/brandwithouttext.png')}
            resizeMode="contain"
            style={{ width: 150, height: 150 }}
          />
          <Text style={{ marginTop: 10, marginBottom: 20, fontSize: 20 }}><Text style={{ color: "#3696dd" }}>intelligent</Text> 360° Metabolic Health Suite</Text>
          <ButtonCustom title="Upgrade Your Urban Health" titleStyle={{ textTransform: "none", fontSize: 18 }} containerStyle={{ width: '90%', paddingVertical: 20, borderRadius: 30, backgroundColor: '#3696dd' }} onPress={() => { onClose() }} />
        </View>
      </View>
      {/* {!loading?<View style={styles.overlay}>
        <View style={styles.container}>
          <Text numberOfLines={2} style={styles.headerText}>{data.pre_home_page_top_text}</Text>
          {data?.data?.slice(0, 3).map((card, index) => (
            <TouchableOpacity
              key={card?.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => handleNavigate(index)}
            >
              <ShowImageComp
                source={{ uri: card?.pre_home_images?.[0]?.image_path }}
                style={[styles.image,{aspectRatio: data?.data?.length===2?16 / 14:16 / 9,}]}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={()=>{navigation.navigate('chatbot')}} style={{alignItems:'center'}}>
                                        <View
                                          style={{
                                            backgroundColor: '#fff',
                                            width: 79,
                                            height: 79,
                                            borderRadius: 38,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            shadowColor: '#000',
                                            shadowOffset: {
                                              width: 0,
                                              height: 1,
                                            },
                                            shadowOpacity: 0.18,
                                            shadowRadius: 1.0,
                                            elevation: 1,
                                          }}>
                                          <Image
                                            source={require('../../assets/bgRemovedLogo.png')}
                                            resizeMode="contain"
                                            style={{width:60,height:60}}
                                          />
                                        </View>
                        </TouchableOpacity>
        </View>
      </View>:<ActivityIndicator size="large" color="#000" style={{alignSelf:'center',alignItems:'center',justifyContent:'center',flex:1}} />} */}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(251, 247, 247, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    // flex:1,
    width: "100%",
    height: "100%",
    // paddingVertical: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "95%",
    marginVertical: 5,
  },
  image: {
    width: "100%",
    aspectRatio: 16 / 14, // keep images 16:9
    // height: 230,
    borderRadius: 15,
  },
  headerText: {
    fontSize: 18,
    color: colors.themeColor,
    textAlign: "center",
    marginHorizontal: 10,
    marginTop: 30,
    marginBottom: 10,
    fontFamily: fonts.whitneyMedium,
  },
});
