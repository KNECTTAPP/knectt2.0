import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import {SimplePaginationDot} from '../component/SimplePaginationDot';

const {width: windowWidth} = Dimensions.get('window');
const {width:pwindowWidth} = Dimensions.get('window')%4;
console.log(windowWidth);
const SLIDE_WIDTH = Math.round(windowWidth / 4.5);
const ITEM_HORIZONTAL_MARGIN = 1;
const ITEM_WIDTH = windowWidth*0.25;
console.log(windowWidth*0.25);
console.log(ITEM_WIDTH);

const data = [
  {image:'https://divybhaskarnews.com/image/topbaner/bp.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-1.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-2.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-3.png'},
{image:'https://divybhaskarnews.com/image/topbaner/bp.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-1.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-2.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-3.png'},
{image:'https://divybhaskarnews.com/image/topbaner/bp.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-1.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-2.png'},
{image:'https://divybhaskarnews.com/image/topbaner/Untitled-3.png'}
];

const INITIAL_INDEX = 0;
export default function TopNavSlider(props) {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);

  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }

  function renderItem({item, index}) {
    const {image} = item;
    return (
      <TouchableOpacity
        activeOpacity={4}
        style={styles.item}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}>
        <View style={styles.square}> 
              <Image source={{uri:image}}  style={styles.imagetop} resizeMode={"cover"} />
             </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        style={styles.carousel}
         itemWidth={windowWidth * 0.8}
        inactiveSlideScale={4}
        data={data}
        renderItem={renderItem}
        containerWidth={windowWidth}
        onScrollEnd={handleCarouselScrollEnd}
        ref={carouselRef}
      />
      <SimplePaginationDot currentIndex={currentIndex} length={data.length} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: '#FFF', paddingVertical: 3,paddingTop:20},
  carousel: {
    backgroundColor: '#FFF',
    flexGrow: 0,
    height:100,
    marginBottom: 20,
  },
  imagetop:{
    resizeMode: 'contain',
    height:85,
    width:ITEM_WIDTH,
    marginTop:3,
    textAlign: 'center'
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
    backgroundColor: '#FFF',
    borderWidth: 5,
    backgroundRepeat: 'no-repeat',
    resizeMode:'cover',
    borderColor: 'white',
    transform: [{ scale:1 }]
  },
  rightTextContainer: {
    marginLeft: 'auto',
    marginRight: -2,
    backgroundColor: 'rgba(49, 49, 51,0.5)',
    padding: 3,
    marginTop: 3,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightText: {color: 'white'},
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