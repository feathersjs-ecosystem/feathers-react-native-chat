import React, { Component } from 'react';
import {View, Text, BackAndroid} from 'react-native';
import { Actions } from 'react-native-router-flux';
import baseStyles from '../baseStyles';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Offline extends Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;
  }

  componentDidMount() {
    // BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  _close() {
    Actions.pop();
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="alert" size={80} color={baseStyles.colors.accentColor}/>
        <Text style={{marginTop: 30, fontWeight: '200', fontSize: 20}}>Please check your connection</Text>
      </View>
    );
  }
}