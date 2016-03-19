var React = require('react-native');

var Actions = require('react-native-router-flux').Actions;
var { View, Text, TextInput, TouchableHighlight, Alert, BackAndroid } = React;
var TouchableWithoutFeedback = require('TouchableWithoutFeedback');
var baseStyles = require('../baseStyles');
var utils = require('../utils');
var Icon = require('react-native-vector-icons/Ionicons');

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.register = this.register.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);

    this.state = {
      emailBorder: 'transparent',
      passwordBorder: 'transparent',
      email: '',
      password: '',
      loading: false
    }
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  onChangeEmail(text) {
    this.setState({email: text});
    if (!utils.validateEmail(text)) {
      this.setState({
        emailBorder: '#FFC200'
      })
    } else {
      this.setState({
        emailBorder: 'transparent'
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

    if(!utils.validateEmail(this.state.email) || !utils.validatePassword(this.state.password)) {
      Alert.alert('Please enter a valid email or password.');
      return;
    }

    this.setState({loading: true});

    var userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.app.service('users').create(userData).then((result) => {
      this.app.authenticate({
        type: 'local',
        email: this.state.email,
        password: this.state.password
      }).then(response => {
        this.setState({ loading: false });
        // re-route to main authorized chat   component
        Actions.main();
      }).catch(error => {
        console.log(error);
        Alert.alert('Error', 'Please enter a valid email or password.');
        this.setState({ loading: false });
      });
    }).catch((err) => {
      console.log('err');
      console.log(err);
      self.setState({loading: false});
      Alert.alert('Error', err.message);
    });
  }

  _close() {
    this._dismissKeyboard();
    Actions.pop();
  }

  _dismissKeyboard(el) {
    TextInput.State.blurTextInput(TextInput.State.currentlyFocusedField())
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
      <View style={{justifyContent: 'center', alignItems: 'center', height: 50, flexDirection: 'column'}}>
        <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary]} onPress={this.register} underlayColor="transparent">
          <Text style={[baseStyles.baseButtonText, baseStyles.buttonPrimaryText]}>Create Account</Text>
        </TouchableHighlight>
      </View>
    )
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={this._dismissKeyboard.bind(this)}>
        <View style={baseStyles.container}>
          <TouchableHighlight style={[baseStyles.backButtonContainer, {padding: 10}]} onPress={this._close.bind(this)} underlayColor="transparent">
            <Icon name="close-round" size={30} color="#333" />
          </TouchableHighlight>
          <Text style={baseStyles.welcomeText}>Create Account</Text>

          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>

              <TextInput
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.emailBorder}]}
                autoFocus={true}
                placeholder="Email"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
                keyBoardType='email-address'
                returnKeyType='next'
                value={this.state.email}
                onChangeText={this.onChangeEmail}
              />
            </View>
            <View style={baseStyles.inputContainer}>

              <TextInput
                secureTextEntry={true}
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
                placeholder="Password"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
                returnKeyType='send'
                value={this.state.password}
                onChangeText={this.onChangePassword}
              />
            </View>
            {this.renderButton()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}