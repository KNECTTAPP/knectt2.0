import React, { useState,Component,useEffect } from 'react';
import {Platform,View, Text, Image,Linking,Dimensions,Alert,StyleSheet, Pressable,  ScrollView,TouchableOpacity,FlatList, StatusBar } from 'react-native';
import { ImageSlider } from "react-native-image-slider-banner";
import {TabNavigators} from '../../TabNavigators.js';
import HomePlanComponent from '../component/HomePlanComponent';
import ModalTester from '../component/ModalComponent';
import OfferComponent from '../component/OfferComponent';
import { ProgressLoader } from '../component/ProgressLoader';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../component/Header';
import HomrBabber from '../../assets/img/homebanner.png';
import Fashionsell from '../../assets/img/fashiosell.png';
import ShopCarousel from '../component/ShopCarousel';
import { SafeAreaView } from 'react-native-safe-area-context';

const brandd = [{image:'https://divybhaskarnews.com/image/brand/301.jpg'},
{image:'https://divybhaskarnews.com/image/brand/301_2.jpg'},
{image:'https://divybhaskarnews.com/image/brand/301_3.jpg'},
{image:'https://divybhaskarnews.com/image/brand/301_4.jpg'}];

const cateGory = [
{image:'https://divybhaskarnews.com/image/category/202-modified.png',name:'T-shirt'},
{image:'https://divybhaskarnews.com/image/category/202-modified(5).png',name:'Jeans'},
{image:'https://divybhaskarnews.com/image/category/202-modified(9).png',name:'Fip-Flops'},
{image:'https://divybhaskarnews.com/image/category/202-modified(3).png',name:'Sports shoes'},
{image:'https://divybhaskarnews.com/image/category/202-modified(4).png',name:'Long Wear'},
{image:'https://divybhaskarnews.com/image/category/202-modified(5).png',name:'Track Pants'},
{image:'https://divybhaskarnews.com/image/category/202-modified(6).png',name:'Track Fragnance'},
{image:'https://divybhaskarnews.com/image/category/202-modified(7).png',name:'Bed Sheets'},
{image:'https://divybhaskarnews.com/image/category/category.png',name:'Casual Shoes'}
];



const SLIDER_1_FIRST_ITEM = 1;

var id = 0;
const HomeScreen = ({ navigation }) => {
  const [titleText, setTitleText] = useState(null);
  const [plan, setPlan] = useState([])
  const [planImage, setPlanImage] = useState()
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true)
  const [read, setRead] = useState([])
  const [id, setId] = useState()
  const [planType, setPlanType] = useState()
  const [bannerdata, setBannerData] = useState()
  const [brandata, setBrandata] = useState(brandd);
  const [category, setCategory] = useState(cateGory);
  const isCarousel = React.useRef(null)
  console.log(brandata);
  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleModal = (id,openModal) => {
    setLoading(openModal)
    setLoading(false)
    setModalVisible(!isModalVisible);
  };
  const navigationData = () => {
    toggleModal();
    navigation.navigate('chatbot')
  }
  
  return (
    <SafeAreaView style={styles.screenContainer}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#FFF" /> */}
      <ProgressLoader isVisible={loading} />
      <Header
        onPress={() => navigation.pop()}
        chatLogo menu search notification
      />
      <ScrollView style={{ flex: 1 }}>
         <Image
                        source={HomrBabber}
                        style={{ height:75, width: '100%',paddingTop:30,marginTop:10}}    />
          <Image
                        source={Fashionsell}
                        style={{ height:400, width: '100%',paddingTop:30,marginTop:10}}    />
          <FlatList style={{width: '100%',paddingTop:1,marginTop:10}}  data={brandata} numColumns={2} renderItem={({item}) => {
      return <View style={styles.inner}>      
              <Image source={{uri:item.image}} style={{width: '100%', height: 160,paddingTop:1}} resizeMode={"contain"} />
             </View>
      }}>
        </FlatList>
        <FlatList style={{width: '100%',paddingTop:1,marginTop:10,marginLeft:10}} data={category} numColumns={3} keyExtractor={(item) => item.name} renderItem={({item}) => {
      return <View style={styles.imageholder}>      
              <Image source={{uri:item.image}} style={styles.image} resizeMode={"cover"} />
              <Text style={styles.textFont}>{item.name}</Text>
             </View>
      }}>
   </FlatList>
     <ShopCarousel />
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 14,
    color: '#FFF',
    alignSelf: 'center',
  },
  inner : {
  flex: 1,
  paddingTop:3
},
imageholder :{
  flex: 1,
  paddingTop:3,
  textAlign: 'center'
},
image:{
  height:100,
  width:100,
  textAlign: 'center'
},
textFont:{
 textAlign: 'center',
 width:100
}
}
);

export default HomeScreen;
