import React, {Component} from 'react';
import {
  Alert,
  BackAndroid,
  Keyboard,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';


import {Button} from 'react-native-elements';
import {autobind} from 'core-decorators';
import NavIcons from '../NavIcons';
const baseStyles = require('../baseStyles');
import Utils from '../Utils';

@autobind
export default class Signup extends React.Component {
  static navigationOptions = {
    title: 'Create Account',
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
  }

  onChangePassword(text) {
    this.setState({password: text});
  }

  register() {
    if (!Utils.validateEmail(this.state.email) || !Utils.validatePassword(this.state.password)) {
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
                style={[baseStyles.input, baseStyles.darkFont]}
                autoFocus={true}
                placeholder='Email'
                placeholderTextColor='#AAA'
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
                style={[baseStyles.input, baseStyles.darkFont]}
                placeholder='Password'
                placeholderTextColor='#AAA'
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