'use strict';
import React, {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  View
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


class featherschat extends Component {
  constructor(props) {
    super(props);
    this.messages = [];
    this.username = 'featherschat';
  }

  componentDidMount() {
    this.loadMessages();

    messageService.on('created', message => {
      this._GiftedMessenger.appendMessage(this.formatMessage(message));
    });
  }

  formatMessage(message) {
    return {
      name: message.name,
      text: message.body,
      position: message.name !== this.username ? 'left' : 'right',
      image: message.name !== this.username ? {uri: 'https://facebook.github.io/react/img/logo_og.png'} : null,
      date: new Date(message.created_at)
    };
  }

  loadMessages() {
    messageService.find({}).then(messages => {
      this.messages = [];
      for (var message of messages) {
        this.messages.push(this.formatMessage(message));
      }
      this._GiftedMessenger.appendMessages(this.messages);
    });
  }

  sendMessage(message = {}, rowID = null) {
    messageService.create({name: 'featherschat', body: message}).then(result => {
      console.log('created!');
    });
  }

  render() {
    return (
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}
        messages={this.messages}
        handleSend={this.sendMessage}
        maxHeight={Dimensions.get('window').height - 64} // 64 for the navBar

        styles={{
          bubbleLeft: {
            backgroundColor: '#e6e6eb',
            marginRight: 70,
          },
          bubbleRight: {
            backgroundColor: '#007aff',
            marginLeft: 70,
          }
        }}
      />
    );
  }
}

AppRegistry.registerComponent('featherschat', () => featherschat);
