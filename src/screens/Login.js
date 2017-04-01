'use strict';

import React, {Component} from 'react';
import {
  Alert,
  BackAndroid,
  Keyboard,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import {autobind} from 'core-decorators';
import {Button} from 'react-native-elements';
import NavIcons from '../NavIcons';
import Utils from '../Utils';

const baseStyles = require('../baseStyles');

@autobind
export default class Login extends Component {
  static navigationOptions = {
    title: 'Sign In',
    header: ({goBack}) => {
      return {
        left: NavIcons.closeButton(goBack)
      };
    }
  };

  constructor(props) {
    super(props);

    this.store = this.props.screenProps.store;

    this.state = {
      email: 'cory.m.smith@gmail.com',
      password: '1234',
      loading: false
    }
  }

  componentDidMount() {
    //TODO: Get back button working on Android
    //BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  login() {
    if (!Utils.validateEmail(this.state.email) || !Utils.validatePassword(this.state.password)) {
      Alert.alert('Error', 'Please enter a valid email or password.');
      return;
    }

    this.setState({loading: true});
    this.store.login(this.state.email, this.state.password).catch(error => {
      this.setState({loading: false});
      console.log('LOGIN', 'ERROR', JSON.stringify(error), error.message);
      Alert.alert('Error', 'Login failed, please check your login/password.');
    });
  }

  onChangeEmail(text) {
    this.setState({email: text});
  }

  onChangePassword(text) {
    this.setState({password: text});
  }

  render() {

    if (this.state.loading) {
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
                value={this.state.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                {...commonInputProps}
                secureTextEntry={true}
                placeholder='Password'
                returnKeyType='send'
                value={this.state.password}
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