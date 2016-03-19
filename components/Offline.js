var React = require('react-native');
var { View, Text, BackAndroid } = React;
var Actions = require('react-native-router-flux').Actions;
var baseStyles = require('../baseStyles');
var Icon = require('react-native-vector-icons/Ionicons');

export default class Offline extends React.Component {

  constructor(props) {
    super(props);
    this.app = this.props.app;
  }

  componentDidMount() {
    // BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  _close() {
    Actions.pop();
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Icon name="alert" size={80} color={baseStyles.colors.accentColor}/>
        <Text style={{marginTop: 30, fontWeight: '200', fontSize: 20}}>Please check your connection</Text>
      </View>
    );
  }
}