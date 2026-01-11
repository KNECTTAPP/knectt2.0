import React from 'react';
import { TouchableHighlight, Image, Text, View,StyleSheetj} from 'react-native';
import PropTypes from 'prop-types';
export default class MenuButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        onPress={this.props.onPress}
        style={styles.btnClickContain}
        underlayColor="#fee"
      >
        <View style={styles.btnContainer}>
          <Image source={this.props.source} style={styles.btnIcon} />
          <Text style={styles.btnText}>{this.props.title}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
const styles = StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btnIcon: {
    height: 25,
    width: 25
  },
  btnText: {
    fontSize: 20,
    fontFamily:'comic-bold',
    fontWeight:'500',
    marginLeft: 15,
    marginTop: 4
  }
});
MenuButton.propTypes = {
  onPress: PropTypes.func,
  source: PropTypes.number,
  title: PropTypes.string
};
