import React, {useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import EndUrl from '../api/EndUrl';

export default function MainCategory(props) {

//console.log(route.params);


  

  return (
    <View style={styles.container}>
     <Text>this is test </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    height: 'auto',
    borderTopWidth: 20,
    borderBottomWidth: 20,
    borderColor: '#DADEE1',
  },
  });
