'use strict';

var React = require('react-native');
var {View, Text, TextInput, TouchableHighlight, Alert, BackAndroid} = React;
var Actions = require('react-native-router-flux').Actions;
var baseStyles = require('../baseStyles');
var Icon = require('react-native-vector-icons/Ionicons');
var utils = require('../utils');

//import Spinner from "../Spinner"
//import Alert from "../../../alert"

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.login = this.login.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      usernameBorder: 'transparent',
      passwordBorder: 'transparent',
      username: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  login() {
    // if(!utils.validateUsername(this.state.username) || !utils.validatePassword(this.state.password)) {
    //   Alert.alert('Error', 'Please enter a valid username or password.');
    //   return;
    // }
    this.setState({loading: true});
    
    this.app.authenticate({
      type: 'local',
      username: this.state.username,
      password: this.state.password
    }).then(response => {
      this.setState({ loading: false });
      // re-route to chat app
      Actions.main();
    }).catch(error => {
      console.log(error);
      Alert.alert('Error', 'Please enter a valid username or password.');
      this.setState({ loading: false });
      return;
    });
  }

  onChangeUsername(text) {
    this.setState({username: text});
    if (!utils.validateUsername(text)) {
      this.setState({
        usernameBorder: '#FFC200'
      })
    } else {
      this.setState({
        usernameBorder: 'transparent'
      })
    }
  }

  onChangePassword(text) {
    this.setState({password: text});
    if (!utils.validatePassword(text)) {
      this.setState({
        passwordBorder: '#FFC200'
      })
    } else {
      this.setState({
        passwordBorder: 'transparent'
      })
    }
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
        <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary]} onPress={this.login} underlayColor="transparent">
          <Text style={[baseStyles.baseButtonText, baseStyles.buttonPrimaryText]}>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={baseStyles.container}>
        <TouchableHighlight onPress={Actions.pop} underlayColor="transparent"
                            style={[baseStyles.backButtonContainer]}>
          <Icon name="close-round" size={30} color="#999"/>
        </TouchableHighlight>
        <Text style={baseStyles.welcomeText}>WELCOME BACK</Text>

        <View style={baseStyles.inputs}>
          <View style={baseStyles.inputContainer}>

            <TextInput
              style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.usernameBorder}]}
              autoFocus={true}
              placeholder="Username"
              placeholderTextColor="#AAA"
              autoCorrect={false}
              autoCapitalize='none'
              value={this.state.username}
              onChangeText={this.onChangeUsername}
            />
          </View>
          <View style={baseStyles.inputContainer}>
            <TextInput
              password={true}
              style={[baseStyles.input, baseStyles.greyFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
              placeholder="Password"
              placeholderTextColor="#AAA"
              autoCorrect={false}
              autoCapitalize='none'
              value={this.state.password}
              onChangeText={this.onChangePassword}
            />
          </View>
          {this.renderLoginButton()}
        </View>
      </View>);
  }

}