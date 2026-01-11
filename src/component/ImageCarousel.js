import React, {useRef, useState,useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import { useNavigation } from '@react-navigation/native';
import {SimplePaginationDot} from '../component/SimplePaginationDot';

const {width: windowWidth} = Dimensions.get('window');

const INITIAL_INDEX = 0;
export default function ImageCarousel(props) {
  const {data} = props;
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);
  const [lastIndex,setLastIndex] = useState(0);
  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }
  const navigationr = useNavigation();
  const goToCategory = (arg,catename) => {
    navigationr.navigate('Category', {
      cateId: arg,
      cateName:catename
    });
  };

  function renderItem({item, index}) {
    return (
      <TouchableOpacity
        activeOpacity={.5}
        style={styles.item}
        onPress={() => goToCategory(item.pro_cat_id,item.pro_cat_name)}>
        <ImageBackground source={{uri: item.pro_cat_image}} style={styles.imageBackground}>
          <View style={styles.rightTextContainer}>
            <Text style={styles.rightText}>{item.pro_cat_name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
        data={data}
        initialNumToRender={1}
        renderItem={renderItem}
        itemWidth={0.7 * windowWidth}
        inActiveOpacity={0.3}
        containerWidth={windowWidth}
        onScrollEnd={handleCarouselScrollEnd}
        ref={carouselRef}
      />
      <SimplePaginationDot currentIndex={currentIndex} length={data.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#FFF', paddingVertical: 20},
  carousel: {
    backgroundColor: '#CCC',
    aspectRatio: 1.5,
    flexGrow: 0,
    marginBottom: 20,
  },
  item: {
    borderWidth: 2,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    borderColor: 'white',
    elevation: 3,
  },
  imageBackground: {
    flex: 1,
    backgroundColor: '#EBEBEB',
    borderWidth: 5,
    borderColor: 'white',
  },
  rightTextContainer: {
    width:'100%',
    position:'absolute',
    backgroundColor: 'rgba(49, 49, 51,0.5)',
    paddingBottom: 3,
    marginBottom: 3,
    bottom:1,
    textAlign: 'center',
    borderRadius: 5,
    textAlignVertical:'bottom'
  },
  rightText: {color: 'white',textAlign:'center'},
  lowerContainer: {
    flex: 1,
    margin: 10,
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentText: {
    marginTop: 10,
    fontSize: 12,
  },
});