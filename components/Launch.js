var React = require('react-native');
var {View, Text, StyleSheet, Image, Linking} = React;
var Button = require('react-native-button');
var Actions = require('react-native-router-flux').Actions;

var baseStyles = require('../baseStyles');

export default class Launch extends React.Component {

  constructor(props) {
    super(props);

    this.props = props;
    this.styles = StyleSheet.create({
      appName: {
        marginTop: 3,
        fontSize: 44,
        color: 'black',
        //fontFamily: 'HelveticaNeue-Thin',
        fontWeight: "200"
      },
      tagLine: {
        marginTop: 40,
        fontSize: 20,
        //fontFamily: 'HelveticaNeue-Thin',
        fontWeight: "200",
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
          <Image source={{uri: 'https://camo.githubusercontent.com/3bd70abb39b3a3c35252e873685ce0d4dd15aab2/687474703a2f2f66656174686572736a732e636f6d2f696d616765732f66656174686572732d6c6f676f76322e706e67'}} style={{width:295, height: 50}}/>
          <Text style={this.styles.tagLine}>CHAT DEMO</Text>
        </View>
        <View style={this.styles.bottomSection}>
          <Button style={[baseStyles.baseButton, baseStyles.button]} containerStyle={{alignItems: 'center', justifyContent: 'center'}} onPress={Actions.login}>Login</Button>
          <Button style={[baseStyles.baseButton, baseStyles.primaryButton]} containerStyle={{alignItems: 'center', justifyContent: 'center'}} onPress={Actions.signup}>Sign Up</Button>
        </View>
      </View>
    );
  }
}