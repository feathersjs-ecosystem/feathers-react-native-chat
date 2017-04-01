'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';

import {time, autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {GiftedChat} from 'react-native-gifted-chat';
import NavIcons from '../NavIcons';

const maxHeight = Platform.OS === 'ios' ? Dimensions.get('window').height - 65 : Dimensions.get('window').height - 85;

@observer @autobind
export default class Chat extends Component {
  static navigationOptions = {
    title: '#feathersjs',
    cardStack: {
      gesturesEnabled: false
    },
    header: ({navigate}) => {
      return {
        right: NavIcons.settingsButton(navigate)
      };
    },
  };

  componentDidMount() {
    this.props.screenProps.store.loadMessages();
  }

  @time
  render() {
    return (
      <View style={styles.container}>
        {this.props.screenProps.store.messages.length > 0 && <GiftedChat
          ref={(c) => this._GiftedMessenger = c}
          user={{_id: this.props.screenProps.store.user._id}}
          messages={this.props.screenProps.store.messages.slice()}
          onSend={this.props.screenProps.store.sendMessage}
          loadEarlier={this.props.screenProps.store.hasMoreMessages}
          onLoadEarlier={this.props.screenProps.store.loadMessages.bind(this, true)}
          keyboardDismissMode='on-drag'
          autoFocus={false}
          maxHeight={maxHeight}
        />}
        {this.props.screenProps.store.isConnecting && <View style={styles.banner}>
          <Text style={styles.bannerText}>Reconnecting ...</Text>
        </View>}
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: '#E98B50',
    opacity: 0.8
  },
  bannerText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center'
  },
  settings: {
    marginRight: 10
  }
});


