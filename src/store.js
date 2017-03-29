import {AsyncStorage, NetInfo, AppState} from 'react-native';
import {observable, action, computed} from 'mobx';
import {time, autobind} from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';
import Utils from './utils';
const PLACEHOLDER = 'https://raw.githubusercontent.com/feathersjs/feathers-chat/master/public/placeholder.png';

@autobind
export default class Store {

  @observable isAuthenticated = false;
  @observable socketConnected = false;
  @observable isConnecting = false;
  @observable user = null;
  @observable messages = [];
  @observable isLoadingMessages = false;
  @observable hasMoreMessages = false;
  @observable skip = 0;

  @action setUser(user) {
    console.log(JSON.stringify(user, null, 2));
    this.user = user;
  }

  @action setConnected(connected) {
    this.connected = connected;
  }

  @action setIsConnecting(isConnecting) {
    this.isConnecting = isConnecting;
  }

  @action setMessages(messages) {
    this.messages = messages;
    this.isLoadingMessages = false;
  }

  @action addMessage(message) {
    this.messages.unshift(message);
  }

  @action setHasMoreMessages(hasMoreMessages) {
    this.hasMoreMessages = hasMoreMessages;
  }

  @action setIsLoadingMessages(isLoadingMessages) {
    this.isLoadingMessages = isLoadingMessages;
  }

  @action setSkip(skip) {
    this.skip = skip;
  }

  constructor() {
    const options = {transports: ['websocket'], forceNew: true};
    const socket = io('http://localhost:3030', options);

    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      // Use AsyncStorage to store our login toke
      .configure(authentication({
        storage: AsyncStorage
      }));
    // this.setIsConnecting(true);

    this.app.io.on('connect', () => {
      this.setConnected(true);
      this.authenticate().then(() => {
        console.log('authenticated after reconnection');
      }).catch(error => {
        console.log('error authenticating after reconnection', error);
      });
    });

    this.app.io.on('disconnect', () => {
      this.setConnected(false);
      console.log('disconnected');
      //Actions.offline();
    });

    this.app.service('messages').on('created', message => {
      this.addMessage(this.formatMessage(message));
    });

    this.app.service('messages').on('removed', result => {
      this.deleteMessage(result);
    });
    // this.authenticate()
  }

  // reconnect() {
  //
  // }

  createAccount(email, password) {
    const userData = {email, password};

    return this.app.service('users').create(userData).then((result) => {
      return this.authenticate(Object.assign(userData, {strategy: 'local'}))
    });
    // this.app.service('users').create(userData).then((result) => {
    //   this.app.authenticate({
    //     strategy: 'local',
    //     email: this.state.email,
    //     password: this.state.password
    //   }).then(response => {
    //     console.log('created account');
    //     this.setState({loading: false});
    //     // re-route to main authorized chat   component
    //     // Actions.main();
    //   }).catch(error => {
    //     console.log(error);
    //     Alert.alert('Error', 'Please enter a valid email or password.');
    //     this.setState({loading: false});
    //   });
    // }).catch((err) => {
    //   console.log('err');
    //   console.log(err);
    //   self.setState({loading: false});
    //   Alert.alert('Error', err.message);
    // });
  }

  _authenticate(payload) {
    return this.app.authenticate(payload)
      .then(response => {
        return this.app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        return this.app.service('users').get(payload.userId);
      });
  }

  @time
  authenticate(options) {
    options = options ? options : undefined;

    return this._authenticate(options).then(user => {
        this.setUser(user);
        // Actions.main();
        console.log('authenticated !!');
        console.log(user);
        return user;
      }).catch(error => {
        console.log('error authenticating', error);
        // Actions.launch();
        return error;
      });
  }

  @action
  logout() {
    this.app.logout();
    this.messages = [];
    this.user = null;
  }

  @time
  loadMessages(oldestMessage, callback) {
    const query = {query: {$sort: {createdAt: -1}, $skip: this.skip}};
    this.setIsLoadingMessages(true);
    return this.app.service('messages').find(query).then(response => {
      // console.log('res');
      // console.log(response);
      const messages = [];
      const skip = response.skip + response.limit;

      for (let message of response.data) {
        messages.push(this.formatMessage(message));
      }

      console.log(JSON.stringify(messages, null, 2));
      this.setMessages(messages);
      this.setSkip(skip);
      this.setHasMoreMessages(response.skip + response.limit < response.total);

      // This was fired from the load earlier messages button
      // if (callback) {
      //   callback(messages, false);
      // } else {
      //
      // }

    }).catch(error => {
      console.log(error);
      this.setIsLoadingMessages(false);
    });
  }

  @time
  formatMessage(message) {
    // console.log(message);
    // console.log(message.user.email, this.user.email, message.user._id.toString(), this.user._id.toString());
    // console.log(message.user._id.toString() === this.user._id.toString());
    // console.log(this.user);
    // console.log(this.user.password);
    // console.log(message.user);
    // console.log(JSON.stringify(message.user));
    return {
      _id: message._id,
      text: message.text,
      position: message.user._id.toString() === this.user._id.toString() ? 'left' : 'right',
      // image: message.user.avatar ? message.user.avatar : PLACEHOLDER,
      createdAt: new Date(message.createdAt),
      user: {
        _id: message.user._id ? message.user._id : '',
        name: message.user.email ? message.user.email : message.name,
        avatar: message.user.avatar ? message.user.avatar : PLACEHOLDER,
      }
    };
  }

  @action @time
  deleteMessage(messageToRemove) {
    let messages = this.messages;
    let idToRemove = messageToRemove.id ? messageToRemove.id : messageToRemove._id;

    messages = messages.filter(function (message) {
      return message.id !== idToRemove;
    });
    // console.log(idToRemove);
    // console.log(messageToRemove);
    this.messages = messages;
  }

  @time
  sendMessage(messages = {}, rowID = null) {
    this.app.service('messages').create({text: messages[0].text}).then(result => {
      console.log('message created!');
    }).catch((error) => {
      console.log('ERROR creating message');
      console.log(error);
    });
  }


}