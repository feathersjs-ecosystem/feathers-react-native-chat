'use strict';

import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import {autobind} from 'core-decorators';
import {observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';
import Utils from '../Utils';

const baseStyles = require('../baseStyles');

@autobind @observer
export default class Login extends Component {
  static navigationOptions = {
    title: 'Sign In',
    header: ({goBack}) => {
      return {
        left: NavIcons.closeButton(goBack)
      };
    }
  };

  @observable email = '';
  @observable password = '';
  @observable loading = false;

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  onChangeEmail(text) {
    this.email = text;
  }

  onChangePassword(text) {
    this.password = text;
  }

  login() {
    if (!Utils.validateEmail(this.email) || !Utils.validatePassword(this.password)) {
      Alert.alert('Error', 'Please enter a valid email or password.');
      return;
    }

    this.loading = true;
    this.store.login(this.email, this.password).catch(error => {
      this.loading = false;
      console.log('LOGIN', 'ERROR', JSON.stringify(error), error.message);
      Alert.alert('Error', 'Login failed, please check your login/password.');
    });
  }

  render() {

    if (this.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
          <Text style={{fontSize: 16}}>Signing in...</Text>
        </View>
      );
    }

    const commonInputProps = {
      style: [baseStyles.input, baseStyles.greyFont],
      underlineColorAndroid: 'transparent',
      placeholderTextColor: '#AAA',
      autoCorrect: false,
      autoCapitalize: 'none'
    };

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.container}>
          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                autoFocus={true}
                placeholder='Email'
                keyBoardType='email-address'
                returnKeyType='next'
                value={this.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                secureTextEntry={true}
                placeholder='Password'
                returnKeyType='send'
                value={this.password}
                onChangeText={this.onChangePassword}
              />
            </View>
            <View style={{height: 60}}>
              <Button title='Login'
                      onPress={this.login}
                      backgroundColor='#31D8A0'
                      buttonStyle={{marginTop: 10, borderRadius: 5}}/>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}