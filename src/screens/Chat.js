'use strict';
import React, {Component} from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableHighlight,
  Alert
} from 'react-native';

import {time, autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

const maxHeight = Platform.OS === 'ios' ? Dimensions.get('window').height - 65 : Dimensions.get('window').height - 85;

@observer @autobind
export default class Chat extends Component {
  static navigationOptions = {
    cardStack: {
      gesturesEnabled: false
    },
    header: ({navigate}) => {
      const right = (<Icon name='ios-settings'
                           size={28}
                           color='#aaa'
                           style={{marginRight: 10}}
                           onPress={() => {navigate('Settings');}}/>);
      return {
        left: null,
        right,
        // ...NAV_STYLES,
      };
    },
  };

  constructor(props) {
    super(props);
    this.store = this.props.screenProps.store;
  }

  componentDidMount() {
    this.store.loadMessages();
  }

  @time
  render() {
    const messages = this.store.messages.slice();

    return (
      <View style={styles.container}>
        <GiftedChat
          ref={(c) => this._GiftedMessenger = c}
          messages={messages}
          onSend={this.store.sendMessage}
          //onMessageLongPress={this.promptToDeleteMessage.bind(this)}
          //onLoadEarlierMessages={this.loadMessages}
          //loadEarlierMessagesButton={this.state.hasMoreMessages}
          keyboardDismissMode="on-drag"
          autoFocus={false}
          maxHeight={maxHeight}
          styles={chatStyles}
        />
        {this.store.isLoadingMessages && <View style={{alignItems: 'center', ...StyleSheet.absoluteFillObject, backgroundColor: 'red'}}>
          <Text>Loading ...</Text>
        </View>}
      </View>);
  }
}

const chatStyles = {
  // bubbleLeft: {
  //   backgroundColor: '#999',
  //   marginRight: 70
  // },
  // bubbleRight: {
  //   backgroundColor: '#31D8A0',
  //   marginLeft: 70
  // },
  // listView: {
  //   paddingTop: 5
  // }
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccc'
    // flex: 1,
    // marginTop: Platform.OS === 'ios' ? 65 : 55
  },
  settings: {
    marginRight: 10
  }
});


