'use strict';

var React = require('react-native');
var {Navigator, Text, View, TouchableHighlight} = React;
var {Router, Route, Schema} = require('react-native-router-flux');
var Actions = require('react-native-router-flux').Actions;

import Launch from './components/Launch';
import Login from './components/Login';
import Signup from './components/Signup';
import Chat from './components/Chat';

export default class Application extends React.Component {
  constructor(props) {
    console.log('constructor: Application');
    super(props);
    this.signout = this.signout.bind(this);
    this.renderRightButton = this.renderRightButton.bind(this);
  }

  renderRightButton() {
    return (
      <TouchableHighlight onPress={this.signout}
                          underlayColor="transparent"
                          style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: 7}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{backgroundColor: 'transparent', textAlign: 'center',  alignItems: 'center', justifyContent: 'center', fontFamily:'HelveticaNeue-Thin', fontSize: 18}}>Logout</Text>
        </View>
      </TouchableHighlight>

    );
  }

  signout() {
    console.log('sign out!!');
    Actions.launch();
  }

  render() {
    let self = this;
    console.log('render: Application');
    return (
      <Router hideNavBar={true}>
        <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
        <Schema name="modalNoNav" sceneConfig={Navigator.SceneConfigs.FloatFromBottom} hideNavBar={true}/>
        <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
        <Schema name="withoutAnimation"/>

        <Route name="launch"
               component={Launch}
               wrapRouter={true} title="Launch"
               hideNavBar={true}
               schema="withoutAnimation"
               initial={true}

               />

        <Route name="login" component={Login} title="Login"/>
        <Route name="signup" component={Signup} title="Signup" schema="default"/>


        <Route name="chat" component={Chat} title="Feathers Chat" type="replace" schema="withoutAnimation" wrapRouter={true}
               replace={true} renderRightButton={this.renderRightButton}/>
      </Router>
    );
  }
}