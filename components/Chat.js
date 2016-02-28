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

import GiftedMessenger from 'react-native-gifted-messenger'

export default class Chat extends Component {
  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.state = {
      online: true
    };
    this.messages = [];

    this.formatMessage = this.formatMessage.bind(this);
  }


  componentDidMount(props) {
    console.log('componentDidMount chat props', props);
    var self = this;

    if(this.props.events) {
      this.props.events.addListener('socket:disconnect', () => {
        self.setState({online: false});
      });

      this.props.events.addListener('socket:connect', () => {
        console.log('socket:connect!');
        self.setState({online: true});
      });
    }

    this.app.user().then(user => {
      this.user = user;
      this.loadMessages();
    });

    this.app.service('messages').on('created', message => {
      this._GiftedMessenger.appendMessage(this.formatMessage(message));
    });
  }

  formatMessage(message) {
    console.log('Message', message);
    return {
      id: message._id,
      name: message.sentBy.username,
      text: message.text,
      position: message.sentBy.username !== this.user.username ? 'left' : 'right',
      image: {uri: message.sentBy.photoURL},
      date: new Date(message.createdAt)
    };
  }

  loadMessages() {
    this.app.service('messages').find({}).then(response => {
      this.messages = [];
      for (var message of response.data) {
        this.messages.push(this.formatMessage(message));
      }
      this._GiftedMessenger.appendMessages(this.messages);
    }).catch(error => {
      console.log(error);
    });
  }

  sendMessage(message = {}, rowID = null) {
    console.log(message);
    this.app.service('messages').create({text: message.text}).then(result => {
      console.log('message created!');
    }).catch((error) => {
      console.log('ERROR creating message');
      console.log(error);
    });
  }

  longPressMessage(messageData, rowId) {
    //TODO: Validate that this is a message created by this user before showing alert
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {
          text: 'Yes, Delete It!', onPress: () => {
          this.app.service('messages').remove(messageData.id).then(result => {
            // TODO(EK): Remove message from this.messages
            console.log('message deleted!');
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
      console.log('render chat', this.props);
      if(this.state.online) {
        return (<View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 65 : 55}}>
          <GiftedMessenger
            ref={(c) => this._GiftedMessenger = c}
            messages={this.messages}
            handleSend={this.sendMessage.bind(this)}
            onMessageLongPress={this.longPressMessage.bind(this)}
            maxHeight={Platform.OS === 'ios' ? Dimensions.get('window').height -  65 : Dimensions.get('window').height - 85 }

            styles={{
          bubbleLeft: {
            backgroundColor: '#e6e6eb',
            marginRight: 70
          },
          bubbleRight: {
            backgroundColor: '#e2717f',
            marginLeft: 70
          }
        }}
          />
        </View>)
      } else {
        return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Icon name="warning" size={60} color={baseStyles.colors.accentColor} />
          <Text>Offline</Text>
        </View>);
      }

  }
}

