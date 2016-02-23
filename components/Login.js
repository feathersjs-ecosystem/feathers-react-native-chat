'use strict';

var React = require('react-native');
var {View, Text, TextInput, TouchableHighlight} = React;
var Actions = require('react-native-router-flux').Actions;
var baseStyles = require('../baseStyles');
var Button = require('react-native-button');
var Icon = require('react-native-vector-icons/Ionicons');

//import Spinner from "../Spinner"
//import Alert from "../../../alert"

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    this.login = this.login.bind(this);

    this.state = {
      username: 'feathersuser',
      password: 'pw',
      loading: false
    }
  }

  login() {
    let self = this;
    this.setState({loading: true});
    let loginData = {username: this.state.username.toLowerCase(), password: this.state.password};
    Actions.chat({username: this.state.username});

    //Authentication.login(loginData).then((result) => {
    //  self.setState({loading: false});
    //  Actions.tabbar();
    //}).catch((error) => {
    //  self.setState({loading: false});
    //  console.log(error);
    //  Alert(error + "");
    //});
  }

  render() {
    return (
      <View style={baseStyles.container}>
        <TouchableHighlight onPress={Actions.pop} underlayColor="transparent"
                            style={[baseStyles.backButtonContainer, {top:10, left: 10}]}>
          <Icon name="close-round" size={30} color="#777" />
        </TouchableHighlight>
        <Text style={baseStyles.welcomeText}>Welcome back</Text>

        <View style={baseStyles.inputs}>
          <View style={baseStyles.inputContainer}>

            <TextInput
              style={[baseStyles.input, baseStyles.greyFont]}
              autoFocus={true}
              placeholder="Username"
              placeholderTextColor="#AAA"
              value={this.state.username}
              onChangeText={(text) => this.setState({username: text})}
            />
          </View>
          <View style={baseStyles.inputContainer}>
            <TextInput
              password={true}
              style={[baseStyles.input, baseStyles.greyFont]}
              placeholder="Password"
              placeholderTextColor="#AAA"
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
            />
          </View>
          {this.renderLoginButton()}
        </View>
      </View>);
  }

  renderLoginButton() {
    if (this.state.loading) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text>Logging in...</Text>
        </View>
      );
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Button style={[baseStyles.baseButton, baseStyles.primaryButton]} onPress={this.login}>Login</Button>
      </View>
    );
  }
}