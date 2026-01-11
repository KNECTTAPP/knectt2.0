import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Carousel from 'react-native-anchor-carousel';
import {SimplePaginationDot} from '../component/SimplePaginationDot';

const {width: windowWidth} = Dimensions.get('window');

const data = [
  {
    uri: 'https://divybhaskarnews.com/image/narrow_ban/narrow1.jpeg',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    uri: 'https://divybhaskarnews.com/image/narrow_ban/narrobaner.gif',
    title: 'Lorem ipsum ',
  },
  {
    uri: 'https://divybhaskarnews.com/image/narrow_ban/narrow1.jpeg',
    title: 'Lorem ipsum dolor sit amet',
  },
  {
    uri: 'https://divybhaskarnews.com/image/narrow_ban/narrobaner.gif',
    title: 'Lorem ipsum ',
  },
];

const INITIAL_INDEX = 0;
export default function ImageNarrow(props) {
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);

  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }

  function renderItem({item, index}) {
    const {uri, title, content} = item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}>
        <ImageBackground source={{uri: uri}} style={styles.imageBackground} resizeMode="cover">
          <View style={styles.rightTextContainer}>
            <Text style={styles.rightText}>{title}</Text>
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
        renderItem={renderItem}
        itemWidth={windowWidth}
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
  container: {backgroundColor: '#FFF', paddingVertical: 3,paddingTop:20},
  carousel: {
    backgroundColor: '#FFF',
    flexGrow: 0,
    height:100,
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