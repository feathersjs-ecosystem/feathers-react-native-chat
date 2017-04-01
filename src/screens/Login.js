'use strict';

import React, {Component} from 'react';
import {
  Alert,
  BackAndroid,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import {time, autobind} from 'core-decorators';
import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';

const baseStyles = require('../baseStyles');
const utils = require('../utils');

@autobind
export default class Login extends Component {
  static navigationOptions = {
    title: 'Sign In',
    header: ({goBack}) => {
      const left = (<Icon name='ios-close' style={baseStyles.closeIcon} onPress={() => goBack()}/>);
      return {
        left
      };
    }
  };

  constructor(props) {
    super(props);

    this.store = this.props.screenProps.store;

    this.state = {
      emailBorder: 'transparent',
      passwordBorder: 'transparent',
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
    if (!utils.validateEmail(this.state.email) || !utils.validatePassword(this.state.password)) {
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
    if (!utils.validateEmail(text)) {
      this.setState({
        emailBorder: '#FFC200'
      })
    } else {
      this.setState({
        emailBorder: 'transparent'
      })
    }
  }

  onChangePassword(text) {
    this.setState({password: text});
    if (!utils.validatePassword(text)) {
      this.setState({
        passwordBorder: '#FFC200'
      })
    } else {
      this.setState({
        passwordBorder: 'transparent'
      })
    }
  }

 render() {

    if(this.state.loading) {
      return (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: 'white'}}>
          <Text style={{fontSize: 16}}>Signing in...</Text>
        </View>
      );
    }
    
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.container}>
          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>
              <TextInput
                style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.emailBorder}]}
                autoFocus={true}
                placeholder="Email"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
                keyBoardType='email-address'
                returnKeyType='next'
                value={this.state.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>
              <TextInput
                secureTextEntry={true}
                style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
                placeholder="Password"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
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