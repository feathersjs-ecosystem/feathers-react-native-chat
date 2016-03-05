var React = require('react-native');

var Actions = require('react-native-router-flux').Actions;
var { View, Text, TextInput, TouchableHighlight, Alert, BackAndroid, TouchableWithoutFeedback } = React;
var baseStyles = require('../baseStyles');
var utils = require('../utils');
var Icon = require('react-native-vector-icons/Ionicons');

export default class Signup extends React.Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;

    this.signup = this.signup.bind(this);
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

  signup() {
    var self = this;

    if (!utils.validateUsername(this.state.username)) {
      Alert.alert('Error', 'Please enter a valid username.');
      return;
    } else if(!utils.validatePassword(this.state.password)) {
      Alert.alert('Error', 'Please enter a valid password.');
      return;
    }

    this.setState({loading: true});

    var userData = {
      username: this.state.username,
      password: this.state.password
    };

    this.app.service('users').create(userData).then((result) => {
      this.app.authenticate({
        type: 'local',
        username: this.state.username,
        password: this.state.password
      }).then(response => {
        this.setState({ loading: false });
        // re-route to main authorized chat   component
        Actions.main();
      }).catch(error => {
        console.log(error);
        Alert.alert('Error', 'Please enter a valid username or password.');
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
        <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary]} onPress={this.signup} underlayColor="transparent">
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
            <Icon name="close-round" size={30} color="#999" />
          </TouchableHighlight>
          <Text style={baseStyles.welcomeText}>Signup to chat</Text>

          <View style={baseStyles.inputs}>
            <View style={baseStyles.inputContainer}>

              <TextInput
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.usernameBorder}]}
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
                style={[baseStyles.input, baseStyles.darkFont, {borderWidth: 1, borderColor: this.state.passwordBorder}]}
                placeholder="Password"
                placeholderTextColor="#AAA"
                autoCorrect={false}
                autoCapitalize='none'
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