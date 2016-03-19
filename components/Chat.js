'use strict';
import React, {
  AppRegistry,
  Component,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  Alert
} from 'react-native';

var Icon = require('react-native-vector-icons/FontAwesome');
var baseStyles = require('../baseStyles');

const PLACEHOLDER = 'https://raw.githubusercontent.com/feathersjs/feathers-chat/master/public/placeholder.png';

import GiftedMessenger from 'react-native-gifted-messenger'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.state = {
      messages: [],
      skip: 0,
      hasMoreMessages : false
    };

    this.formatMessage = this.formatMessage.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount(props) {
    var self = this;

    this.loadMessages();

    this.app.service('messages').on('created', message => {
      const messages = this.state.messages;
      messages.push(this.formatMessage(message));

      this.setState({messages});
    });

    this.app.service('messages').on('removed', result => {
      this.deleteMessage(result);
    });
  }

  formatMessage(message) {
    return {
      id: message._id,
      name: message.sentBy.username,
      text: message.text,
      position: message.sentBy._id === this.app.get('user')._id ? 'left' : 'right',
      image: {uri: message.sentBy.avatar ? message.sentBy.avatar : PLACEHOLDER },
      date: new Date(message.createdAt)
    };
  }

  deleteMessage(messageToRemove) {
    console.log(messageToRemove);
    let messages = this.state.messages;
    let idToRemove = messageToRemove.id ? messageToRemove.id : messageToRemove._id;

    console.log(idToRemove);
    messages = messages.filter(function (message) {
      return message.id !== idToRemove;
    });

    console.log(messageToRemove);

    this.setState({messages});
  }

  loadMessages(oldestMessage, callback) {
    const query = {query: {$sort: {updatedAt: -1}, $skip: this.state.skip}};

    return this.app.service('messages').find(query).then(response => {
      const messages = [];
      const skip = response.skip + response.limit;

      for (var message of response.data) {
        messages.unshift(this.formatMessage(message));
      }

      // This was fired from the load earlier messages button
      if (callback) {
        this.setState({skip, hasMoreMessages: response.skip + response.limit < response.total});
        callback(messages, false);
      } else {
        this.setState({messages, skip, hasMoreMessages: response.skip + response.limit < response.total});
      }
    }).catch(error => {
      console.log(error);
    });
  }

  sendMessage(message = {}, rowID = null) {
    this.app.service('messages').create({text: message.text}).then(result => {
      console.log('message created!');
    }).catch((error) => {
      console.log('ERROR creating message');
      console.log(error);
    });
  }

  promptToDeleteMessage(messageData, rowId) {
    //TODO: Validate that this is a message created by this user before showing alert
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Yes, Delete It!', onPress: () => {
          this.app.service('messages').remove(messageData.id).then(result => {
            this.deleteMessage(messageData);
          }).catch((error) => {
            console.log('ERROR deleting message');
            console.log(error);
          });
        }
        }
      ]
    )
  }

  render() {
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 65 : 55}}>
        <GiftedMessenger
          ref={(c) => this._GiftedMessenger = c}
          messages={this.state.messages}
          handleSend={this.sendMessage.bind(this)}
          onMessageLongPress={this.promptToDeleteMessage.bind(this)}
          onLoadEarlierMessages={this.loadMessages}
          loadEarlierMessagesButton={this.state.hasMoreMessages}
          keyboardDismissMode="on-drag"
          autoFocus={false}
          maxHeight={Platform.OS === 'ios' ? Dimensions.get('window').height -  65 : Dimensions.get('window').height - 85 }
          styles={{
          bubbleLeft: {
            backgroundColor: '#F1F1F1',
            marginRight: 70
          },
          bubbleRight: {
            backgroundColor: '#31D8A0',
            marginLeft: 70
          },
          listView: {
            paddingTop: 5
          }
        }}
        />
      </View>);
  }
}

