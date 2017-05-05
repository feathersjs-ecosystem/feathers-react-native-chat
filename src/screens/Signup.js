import React, {Component} from 'react';
import {
  Alert,
  Keyboard,
  TextInput,
  View,
  TouchableWithoutFeedback
} from 'react-native';

import {autobind} from 'core-decorators';
import {observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {Button} from 'react-native-elements';
import NavIcons from '../components/NavIcons';
const baseStyles = require('../baseStyles');
import Utils from '../Utils';

@autobind @observer
export default class Signup extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Create Account',
    headerLeft: NavIcons.closeButton(navigation.goBack)
  });

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

  register() {
    if (!Utils.validateEmail(this.email) || !Utils.validatePassword(this.password)) {
      Alert.alert('Please enter a valid email or password.');
      return;
    }

    this.loading = true;
    this.store.createAccount(this.email, this.password).catch(error => {
      console.log(error);
      Alert.alert('Error', 'Please enter a valid email or password.');
      this.loading = false;
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
                value={this.email}
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
                value={this.password}
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