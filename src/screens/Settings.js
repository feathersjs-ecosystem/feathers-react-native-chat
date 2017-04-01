import React, {Component} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {autobind} from 'core-decorators';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../NavIcons';

const baseStyles = require('../baseStyles');

import { NavigationActions } from 'react-navigation'

@autobind @observer
export default class Settings extends Component {
  static navigationOptions = {
    title: 'Settings',
    header: ({goBack}) => {
      return {
        left : NavIcons.closeButton(goBack)
      }
    }
  };

  render() {
    const user = this.props.screenProps.store.user;

    if(!user) {
      return null;
    }

    return (
      <View style={baseStyles.container}>
        <View style={styles.topSection}>
          <Image source={{uri: user.avatar}} style={styles.avatar} />
          <Text style={styles.email}>{user.email}</Text>
        </View>
        <View style={styles.bottomSection}>
          <Button title='Sign Out'
                  onPress={this.props.screenProps.store.promptForLogout}
                  backgroundColor='#777'
                  color={'white'}
                  buttonStyle={styles.signoutButton}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  avatar: {
    resizeMode: 'contain',
    width: 100,
    height: 100,
    borderRadius: 50
  },
  email: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: "200",
    color: '#333'
  },
  bottomSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 15,
  },
  signoutButton: {
    borderRadius: 5,
    borderWidth: 0,
    borderColor: '#777'
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
  }
});