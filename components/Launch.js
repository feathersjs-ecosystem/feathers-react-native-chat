var React = require('react-native');
var {View, Text, StyleSheet} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;

var baseStyles = require('../baseStyles');

export default class Launch extends React.Component {

  constructor(props) {
    super(props);

    this.props = props;
    this.styles = StyleSheet.create({
      appName: {
        marginTop: 160,
        fontSize: 44,
        color: 'black',
        fontFamily: 'HelveticaNeue-Thin',
        fontWeight: "200"
      },
      tagLine: {
        fontSize: 18,
        fontFamily: 'HelveticaNeue-Thin',
        color: '#333'
      },
      bottomSection: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 160
      },
      topSection: {
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        //height: 160
      }
    });
  }

  render() {
    return (
      <View style={baseStyles.container}>
        <View style={this.styles.topSection}>
          <Text style={this.styles.appName}>Feathers</Text>
          <Text style={this.styles.tagLine}>Chat Example</Text>
        </View>
        <View style={this.styles.bottomSection}>
          <Button style={[baseStyles.baseButton, baseStyles.button]} onPress={Actions.login}>Login</Button>
          <Button style={[baseStyles.baseButton, baseStyles.primaryButton]} onPress={Actions.signup}>Sign Up</Button>
        </View>
      </View>
    );
  }
}