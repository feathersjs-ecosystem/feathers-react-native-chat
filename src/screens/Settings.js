import React, {Component} from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import {time, autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const baseStyles = require('../baseStyles');

import { NavigationActions } from 'react-navigation'




@autobind @observer
export default class Settings extends Component {
  static navigationOptions = {
    title: 'SETTINGS',
    header: ({goBack}) => {
      const left = (<Icon name='ios-close' style={baseStyles.closeIcon} onPress={() => goBack()}/>);
      return {
        left
      };
    }
  };

  _showSignoutPrompt() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Yes', onPress: this._signout, style: 'destructive'},
      ]
    );
  }

  _signout() {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Launch'})
      ]
    });
    // this.props.navigation.dispatch(resetAction);
    this.props.screenProps.store.logout();
  }

  render() {
    const user = this.props.screenProps.store.user;
    console.log(this.props.screenProps.store.user);

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
                  onPress={this._showSignoutPrompt}
                  backgroundColor='#777'
                  color={'white'}
                  buttonStyle={{borderRadius: 5, borderWidth: 0, borderColor: '#777'}}/>
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