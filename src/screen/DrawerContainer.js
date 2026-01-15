import React from 'react';
import { View, Image,StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import MenuButton from '../../components/MenuButton';

export default class DrawerContainer extends React.Component {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.content}>
        <View style={styles.container}>
          <Image style={styles.logo} source={require('./logo.jpg')} />
          <MenuButton
            title="Home"
            onPress={() => {
              navigation.navigate('Home');
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="Search"
            onPress={() => {
              navigation.navigate('Search');
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="Cart"
            onPress={() => {
              navigation.navigate('Cart');
              navigation.closeDrawer();
            }}
          />
          {/* <MenuButton
            title="Orders"
            onPress={() => {
              navigation.navigate('Orders');
              navigation.closeDrawer();
            }}
          /> */}
          <MenuButton
            title="Contact Us"
            onPress={() => {
              navigation.navigate('Contact');
              navigation.closeDrawer();
            }}
          />
          <MenuButton
            title="Log in"
            onPress={() => {
              navigation.navigate('Login');
              navigation.closeDrawer();
            }}
          />
        </View>
      </View>
    );
  }
}

DrawerContainer.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  })
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',

  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  logo: {
    height: 100,
    width: 200,
    alignSelf: 'center'
  }
});
