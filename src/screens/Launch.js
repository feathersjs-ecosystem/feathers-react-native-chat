import React, {Component} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {Button} from 'react-native-elements';
import {autobind} from 'core-decorators';

@autobind
export default class Launch extends Component {
  static navigationOptions = {
    header: null
  };

  _showLogin() {
    this.props.navigation.navigate('Login');
  }

  _showSignup() {
    this.props.navigation.navigate('Signup');
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image source={require('../../images/feathers_logo_wide.png')} style={styles.logo}/>
          <Text style={styles.tagline}>Chat Demo</Text>
        </View>
        <View style={styles.bottomSection}>
          <Button title='Sign In'
                  onPress={this._showLogin}
                  backgroundColor='#BBB'
                  buttonStyle={{borderRadius: 5}}/>
          <Button title='Create Account'
                  onPress={this._showSignup}
                  backgroundColor='#31D8A0'
                  buttonStyle={{marginTop: 10, borderRadius: 5}}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  logo: {
    resizeMode: 'contain',
    width: 280,
    height: 80
  },
  tagline: {
    marginTop: 5,
    fontSize: 28,
    fontWeight: '200',
    color: '#999'
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flex: 0,
    paddingBottom: 15
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 140
  },
});