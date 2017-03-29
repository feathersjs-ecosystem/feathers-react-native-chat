import React, {Component} from 'react';
import {autobind} from 'core-decorators';
import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {StackNavigator} from 'react-navigation';

import {Launch, Login, Signup, Chat, Settings} from './screens'

import Store from './store';

const App = StackNavigator({
  Launch: {screen: Launch},
  Login: {screen: Login},
  Signup: {screen: Signup},
  Chat: {screen: Chat},
  Settings: {screen: Settings},
}, {headerMode: 'screen', mode: 'modal'});

@autobind @observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  componentDidMount() {

  }
  
  render() {
    return <App screenProps={{store: this.store}}/>;
  }

}