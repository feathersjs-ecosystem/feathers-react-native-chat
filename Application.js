'use strict';

var React = require('react-native');
var {Navigator, Text, View, TouchableHighlight, Platform} = React;
var {Router, Route, Schema} = require('react-native-router-flux');
var Actions = require('react-native-router-flux').Actions;
var Icon = require('react-native-vector-icons/Ionicons');
var baseStyles = require('./baseStyles');

import Launch from './components/Launch';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';
import SideDrawer from './components/SideDrawer';

export default class Application extends React.Component {
  constructor(props) {
    console.log('constructor: Application');
    super(props);
    this.showsidemenu = this.showsidemenu.bind(this);
    this.renderLeftButton = this.renderLeftButton.bind(this);
  }

  renderLeftButton() {
    return (
      <TouchableHighlight onPress={this.showsidemenu}
                          underlayColor="transparent"
                          style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', marginLeft: 0, width: 50, height: 50}}>
        <Icon name="navicon" size={36} color={baseStyles.colors.accentColor} />
      </TouchableHighlight>

    );
  }

  showsidemenu() {
    this.refs.sidedrawer.openDrawer();
  }


  render() {
    const hideNavBar = Platform.OS === 'android';
    let self = this;
    console.log('render: Application');
    return (
      <Router hideNavBar={true}>
        <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
        <Schema name="modalNoNav" sceneConfig={Navigator.SceneConfigs.FloatFromBottom} hideNavBar={true}/>
        <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name="withoutAnimation"/>

        <Schema
          name='boot'
          sceneConfig={Navigator.SceneConfigs.FadeAndroid}
          hideNavBar={true}
          type='replace'
        />
        <Schema
          name='main'
          sceneConfig={Navigator.SceneConfigs.FadeAndroid}
          hideNavBar={hideNavBar}
        />

        <Route name="launch"
               component={Launch}
               wrapRouter={true} title="Launch"
               hideNavBar={true}
               schema="boot"
               initial={true}

               />

        <Route name='main' hideNavBar={true} type='reset'>
          <SideDrawer ref="sidedrawer">
            <Router
              sceneStyle={{flex: 1,backgroundColor: '#fff'}}
            >
              <Route schema='main' component={Chat} name='chat' title='Chat'
                     renderLeftButton={this.renderLeftButton}/>
              <Route schema='main' component={Chat} name='directMessage' title='Direct Message'
                     renderLeftButton={this.renderLeftButton}/>
            </Router>
          </SideDrawer>
        </Route>

        <Route name="login" component={Login} title="Login" schema="modal"/>
        <Route name="signup" component={Signup} title="Signup" schema="modal"/>

      </Router>
    );
  }
}