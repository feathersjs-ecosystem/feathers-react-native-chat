import React, {Component} from 'react';
import {
  Alert,
  BackAndroid,
  StyleSheet,
  Keyboard,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-elements';
import {time, autobind} from 'core-decorators';

const baseStyles = require('../baseStyles');
const utils = require('../utils');

@autobind
export default class Signup extends React.Component {
  static navigationOptions = {
    title: 'CREATE ACCOUNT',
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
      email: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    //TODO: Back button on Android
    //BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
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

  register() {
    if (!utils.validateEmail(this.state.email) || !utils.validatePassword(this.state.password)) {
      Alert.alert('Please enter a valid email or password.');
      return;
    }

    this.setState({loading: true});
    this.store.createAccount(this.state.email, this.state.password).catch(error => {
      console.log(error);
      Alert.alert('Error', 'Please enter a valid email or password.');
      this.setState({loading: false});
    });
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={baseStyles.container}>
          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>

              <TextInput
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.emailBorder}]}
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
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
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
              <Button title='Create Account Now'
                      onPress={this.register}
                      backgroundColor='#31D8A0'
                      buttonStyle={{marginTop: 10, borderRadius: 5}}/>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}