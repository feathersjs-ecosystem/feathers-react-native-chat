var React = require('react-native');

var Actions = require('react-native-router-flux').Actions;
var { View, Text, TextInput, TouchableHighlight } = React;
var Button = require('react-native-button');
var baseStyles = require('../baseStyles');
var utils = require('../utils');
var Icon = require('react-native-vector-icons/Ionicons');

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
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

  register() {
    var self = this;
    if(!utils.validateUsername(this.state.username) || !utils.validatePassword(this.state.password)) {
      utils.showAlert('Please enter a valid username or password.');
      return;
    }

    this.setState({loading: true});

    var userData = {
      username: this.state.username,
      password: this.state.password
    };

    Actions.main({username: this.state.username});

    //Authentication.register(userData).then((result) => {
    //  self.setState({loading: false});
    //  Actions.tabbar();
    //}).catch((err) => {
    //  self.setState({loading: false});
    //  Alert(err.message);
    //});
  }

  render() {
    return (
      <View style={baseStyles.container}>
        <TouchableHighlight onPress={Actions.pop} underlayColor="transparent"
                            style={[baseStyles.backButtonContainer, {top:10, left: 10}]}>
          <Icon name="close-round" size={30} color="#999" />
        </TouchableHighlight>
        <Text style={baseStyles.welcomeText}>CREATE ACCOUNT</Text>

        <View style={baseStyles.inputs}>
          <View style={baseStyles.inputContainer}>

            <TextInput
              style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.usernameBorder}]}
              autoFocus={true}
              placeholder="Username"
              placeholderTextColor="#AAA"
              value={this.state.username}
              onChangeText={this.onChangeUsername}
            />
          </View>
          <View style={baseStyles.inputContainer}>

            <TextInput
              password={true}
              style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
              placeholder="Password"
              placeholderTextColor="#AAA"
              value={this.state.password}
              onChangeText={this.onChangePassword}
            />
          </View>
          {this.renderButton()}
        </View>
      </View>);
  }

  renderButton() {
    if (this.state.loading) {
      return (
        <View style={{alignItems: 'center'}}>
          <Text>Creating account...</Text>
        </View>
      );
    }
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Button style={[baseStyles.baseButton, baseStyles.primaryButton]} onPress={this.register}>Let's Go!</Button>
      </View>
    )
  }
}