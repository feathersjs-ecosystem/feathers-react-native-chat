'use strict';
import React, {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight
} from 'react-native';


import GiftedMessenger from 'react-native-gifted-messenger'
import feathers from 'feathers/client'
import socketio from 'feathers-socketio/client'

// This is required for socket.io-client
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window.navigator.userAgent = 'ReactNative';
}

var options = {transports: ['websocket'], forceNew: true};
var io = require('socket.io-client/socket.io')('http://chat.donejs.com', options);

var app = feathers().configure(socketio(io));
var messageService = app.service('messages');

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.messages = [];
    this.username = this.props.username ? this.props.username : 'demouser';
    console.log('Constructor: Chat');
  }

  componentDidMount() {
    if (this.props.user)
      return;
    this.loadMessages();

    messageService.on('created', message => {
      this._GiftedMessenger.appendMessage(this.formatMessage(message));
    });
  }

  formatMessage(message) {
    var formattedMessage =
    {
      name: message.name,
      text: message.body,
      position: message.name !== this.username ? 'left' : 'right',
      image: {uri: 'http://feathersjs.com/images/logo.png'},//message.name !== this.username ? {uri: 'https://facebook.github.io/react/img/logo_og.png'} : {uri: 'http://feathersjs.com/images/logo.png' },
      date: new Date(message.created_at)
    };
    return formattedMessage;
  }

  loadMessages() {
    messageService.find({}).then(messages => {
      console.log('found ' + messages.length + " messages");
      this.messages = [];
      for (var message of messages) {
        this.messages.push(this.formatMessage(message));
      }
      this._GiftedMessenger.appendMessages(this.messages);
    });
  }

  sendMessage(message = {}, rowID = null) {
    messageService.create({name: this.username, body: message}).then(result => {
      console.log('message created!');
    }).catch((error) => {
      console.log('ERROR creating message');
      console.log(error);
    });
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 65 : 55}}>
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}
        messages={this.messages}
        handleSend={this.sendMessage}
          maxHeight={Platform.OS === 'ios' ? Dimensions.get('window').height -  65 : Dimensions.get('window').height - 85 }

        styles={{
          bubbleLeft: {
            backgroundColor: '#e6e6eb',
            marginRight: 70,
          },
          bubbleRight: {
            backgroundColor: '#e2717f',
            marginLeft: 70,
          }
        }}
      />
      </View>
    );
  }
}

