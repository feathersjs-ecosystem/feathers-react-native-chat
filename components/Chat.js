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
      online: true,
      messages: [],
      skip: 0
    }

    this.formatMessage = this.formatMessage.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
  }

  //componentWillUpdate(nextProps, nextState) {
  //  console.log('componentWillUpdate');
  //  console.log(nextProps);
  //  console.log(nextState);
  //}
  //
  //componentWillReceiveProps (nextProps) {
  //  console.log('componentWillReceiveProps', nextProps);
  //  //this.setState({
  //  //  likesIncreasing: nextProps.likeCount > this.props.likeCount
  //  //});
  //}

  componentDidMount(props) {
    console.log('componentDidMount chat props', props);
    var self = this;

    if (this.props.events) {
      this.props.events.addListener('socket:disconnect', () => {
        console.log('socket:disconnect!');
        self.setState({online: false});
      });

      this.props.events.addListener('socket:connect', () => {
        console.log('socket:connect!');
        var prevState = this.state.online;
        self.setState({online: true});
        if(!prevState)
          this.loadMessages();
      });
    }

    this.app.user().then(user => {
      this.user = user;
      this.loadMessages();
    });

    this.app.service('messages').on('created', message => {
      const messages = this.state.messages;
      messages.push(this.formatMessage(message));

      this.setState({ messages });
    });

    this.app.service('messages').on('deleted', message => {
      let messages = this.state.messages;

      messages = messages.filter(function (item) {
        return item.id != message.id;
      });

      this.setState({ messages });
    });
  }

  componentWillUnmount() {
    this.props.events.removeAllListeners('socket:connect');
    this.props.events.removeAllListeners('socket:disconnect');
  }


  formatMessage(message) {
    //console.log('Message', message);

    var isCurrentUser = false;
    if(typeof message.sentBy !== 'string') {
      isCurrentUser = message.sentBy._id === this.user._id;
    } else {
      isCurrentUser = message.sentBy === this.user._id;
    }

    return {
      id: message._id,
      name: message.sentBy.username,
      text: message.text,
      position: isCurrentUser ? 'left' : 'right',
      image: {uri: message.sentBy.photoURL},
      date: new Date(message.createdAt)
    };
  }

  loadMessages() {
    if (!this.state.online) {
      return;
    }

    const query = { query: { $sort: { updatedAt: -1 }, $skip: this.state.skip }};

    this.app.service('messages').find(query).then(response => {
      const messages = [];
      const skip = response.skip;

      for (var message of response.data) {
        messages.unshift(this.formatMessage(message));
      }

      this.setState({ messages, skip });
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
            let messages = this.state.messages;

            messages = messages.filter(function (message) {
              return message.id != messageData.id;
            });

            this.setState({ messages });
          }).catch((error) => {
            console.log(error);
          });
        }
        }
      ]
    )
  }

  render() {
    if (!this.state.online) {
      return (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="warning" size={80} color={baseStyles.colors.accentColor}/>
        <Text style={{marginTop: 30, fontWeight: '200', fontSize: 20}}>Please check your connection</Text>
      </View>);
    }
    
    return (
      <View style={{flex: 1, marginTop: Platform.OS === 'ios' ? 65 : 55}}>
      <GiftedMessenger
        ref={(c) => this._GiftedMessenger = c}
        messages={this.state.messages}
        handleSend={this.sendMessage.bind(this)}
        onMessageLongPress={this.longPressMessage.bind(this)}
        loadEarlierMessagesButton={true}
        onLoadEarlierMessages={this.loadMessages.bind(this)}
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
      </View>);
  }
}

