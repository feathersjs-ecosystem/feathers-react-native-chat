'use strict';

var React = require('react-native');
var Actions = require('react-native-router-flux').Actions;
var {Navigator, Text, View, TouchableHighlight, Platform, AsyncStorage} = React;
var {Router, Route, Schema} = require('react-native-router-flux');
var Icon = require('react-native-vector-icons/Ionicons');
var baseStyles = require('./baseStyles');

var EventEmitter = require('EventEmitter');

import Launch from './components/Launch';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';
import SideDrawer from './components/SideDrawer';

import feathers from 'feathers/client'
import hooks from 'feathers-hooks';
import socketio from 'feathers-socketio/client'
import authentication from 'feathers-authentication/client';
import localstorage from 'feathers-localstorage';

// This is required for socket.io-client
if (window.navigator && Object.keys(window.navigator).length == 0) {
  window = Object.assign(window, {navigator: {userAgent: 'ReactNative'}});
  // window.navigator = { userAgent: 'ReactNative' };
}

var io = require('socket.io-client/socket.io');

export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.showsidemenu = this.showsidemenu.bind(this);
    this.renderLeftButton = this.renderLeftButton.bind(this);

    this.eventEmitter = new EventEmitter();
    const options = {transports: ['websocket'], forceNew: true};
    const socket = io('http://chat.feathersjs.local:3030', options);

    this.state = {connected: false};
    this.app = feathers()
      .configure(socketio(socket))
      .configure(hooks())
      .use('storage', localstorage({storage: AsyncStorage}))
      .configure(authentication());
  }

  componentDidMount() {


    this.app.io.on('connect', () => {
      this.eventEmitter.emit('socket:connect');
      this.setState({ connected: true });
      // TODO (EK): We should disable interacting with the app if you
      // are not connected and instead show a banner.

      // Try to authenticate if there is a stored token
      this.app.service('storage').get('token').then(token => {
        if (token) {
          this.setState({ loading: true });

          this.app.authenticate({
            type: 'token',
            token: token.value
          }).then(response => {
            this.setState({ loading: false });
            Actions.main();
          }).catch(error => {
            Actions.login();
          });
        }
      });
    });

    this.app.io.on('disconnect', () => {
      this.setState({ connected: false });
      this.eventEmitter.emit('socket:disconnect');
    });
  }

  renderLeftButton() {
    if(this.state.connected) {
    return (
      <TouchableHighlight onPress={this.showsidemenu}
                          underlayColor='transparent'
                          style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginLeft: 0, width: 50, height: 50}}>
        <Icon name='ios-people' size={36} color={baseStyles.colors.accentColor}/>
      </TouchableHighlight>

    );
    } else {
      return (<View />);
    }
  }

  showsidemenu() {
    this.refs.sidedrawer.openDrawer();
  }

  render() {

    return (
      <Router hideNavBar={true}>
        <Schema name='modal' sceneConfig={Navigator.SceneConfigs.FloatFromBottom} hideNavBar={true}/>
        <Schema name='default' sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name='boot' sceneConfig={Navigator.SceneConfigs.FadeAndroid} hideNavBar={true} type='replace'/>
        <Schema name='main' sceneConfig={Navigator.SceneConfigs.FadeAndroid} hideNavBar={false}  />

        <Route name='launch' component={Launch} wrapRouter={true} title='Launch' hideNavBar={true} schema='boot' initial={true}/>

        <Route schema='main' name='main' hideNavBar={true} type='reset'>
          <SideDrawer ref='sidedrawer' app={this.app}>
            <Router sceneStyle={{flex: 1, backgroundColor: '#fff' }}>
              <Route schema='main' component={Chat} name='chat' title='Chat' renderLeftButton={this.renderLeftButton}
                     app={this.app} events={this.eventEmitter}/>
              <Route schema='main' component={Chat} name='directMessage' title='Direct Message'
                     renderLeftButton={this.renderLeftButton}/>
            </Router>
          </SideDrawer>
        </Route>

        <Route name='login' component={Login} title='Login' schema='modal' app={this.app}/>
        <Route name='signup' component={Signup} title='Signup' schema='modal' app={this.app}/>

      </Router>
    );
  }
}