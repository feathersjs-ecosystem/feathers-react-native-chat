import {Alert, AsyncStorage, NetInfo, AppState} from 'react-native';
import {observable, action, computed} from 'mobx';
import {time, autobind} from 'core-decorators';
import io from 'socket.io-client';
import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication-client';
const PLACEHOLDER = 'https://raw.githubusercontent.com/feathersjs/feathers-chat/master/public/placeholder.png';
const API_URL = 'http://localhost:3030';

@autobind
export default class Store {

  @observable isAuthenticated = false;
  @observable isConnecting = false;
  @observable user = null;
  @observable messages = [];
  @observable isLoadingMessages = false;
  @observable hasMoreMessages = false;
  @observable skip = 0;

  @action setIsAuthenticated(isAuthenticated) {
    this.isAuthenticated = isAuthenticated;
  }

  @time
  @action setUser(user) {
    this.isAuthenticated = true;
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
    const options = {transports: ['websocket'], forceNew: true, pingTimeout: 3000, pingInterval: 5000};
    const socket = io(API_URL, options);

    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      // Use AsyncStorage to store our login toke
      .configure(authentication({
        storage: AsyncStorage
      }));
    this.setIsConnecting(true);

    this.app.io.on('connect', () => {
      this.setIsConnecting(false);
      this.setConnected(true);
      this.authenticate().then(() => {
        console.log('authenticated after reconnection');
      }).catch(error => {
        console.log('error authenticating after reconnection', error);
      });
    });

    this.app.io.on('disconnect', () => {
      console.log('disconnected');
      this.setConnected(false);
      this.setIsConnecting(true);
    });

    this.app.service('messages').on('created', message => {
      this.addMessage(this.formatMessage(message));
    });

    this.app.service('messages').on('removed', result => {
      this.deleteMessage(result);
    });

    if (this.app.get('accessToken')) {
      this.setIsAuthenticated(this.app.get('accessToken'));
    }
  }

  createAccount(email, password) {
    const userData = {email, password};
    return this.app.service('users').create(userData).then((result) => {
      return this.authenticate(Object.assign(userData, {strategy: 'local'}))
    });
  }

  _authenticate(payload) {
    return this.app.authenticate(payload)
      .then(response => {
        return this.app.passport.verifyJWT(response.accessToken);
      })
      .then(payload => {
        return this.app.service('users').get(payload.userId);
      }).catch(e => Promise.reject(e));
  }

  login(email, password) {
    const payload = {
      strategy: 'local',
      email,
      password
    };
    return this.authenticate(payload);
  }

  authenticate(options) {
    options = options ? options : undefined;
    return this._authenticate(options).then(user => {
      console.log('authenticated successfully', user._id, user.email);
      this.setUser(user);
      return Promise.resolve(user);
    }).catch(error => {
      console.log('authenticated failed', error.message);
      console.log(error);
      return Promise.reject(error);
    });
  }

  promptForLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel', onPress: () => {
        }, style: 'cancel'
        },
        {text: 'Yes', onPress: this.logout, style: 'destructive'},
      ]
    );
  }

  @action
  logout() {
    this.app.logout();
    this.skip = 0;
    this.messages = [];
    this.user = null;
    this.isAuthenticated = false;
  }

  @action addMessages(messages) {
    this.messages = this.messages.concat(messages);
  }

  @time @action
  loadMessages(loadNextPage) {
    let $skip = this.skip;

    const query = {query: {$sort: {createdAt: -1}, $skip}};

    if (!loadNextPage) {
      // this.setIsLoadingMessages(true);
    }
    return this.app.service('messages').find(query).then(response => {
      const messages = [];
      const skip = response.skip + response.limit;

      for (let message of response.data) {
        messages.push(this.formatMessage(message));
      }

      console.log('loaded messages from server', JSON.stringify(messages, null, 2));
      if (!loadNextPage) {
        this.setMessages(messages);
      } else {
        this.addMessages(messages)
      }
      this.setSkip(skip);
      this.setHasMoreMessages(response.skip + response.limit < response.total);
      this.setIsLoadingMessages(false);

    }).catch(error => {
      console.log(error);
      this.setIsLoadingMessages(false);
    });
  }

  @time
  formatMessage(message) {
    return {
      _id: message._id,
      text: message.text,
      position: message.user._id.toString() === this.user._id.toString() ? 'left' : 'right',
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