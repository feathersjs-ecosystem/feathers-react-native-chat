var React = require('react-native');
var {StyleSheet, Dimensions, Platform} = React;


module.exports = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    // alignItems: 'center'
  },

  closeIcon: {
    marginLeft: 10,
    fontSize: 44,
    color: '#555'
  },
  backButton: {
    width: 50,
    height: 50,
    fontFamily: 'HelveticaNeue-Thin'
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'HelveticaNeue-Thin'
  },
  backButtonContainer: {
    width: 50,
    height: 50,
    top: Platform.OS === 'ios' ? 25 : 10,
    left: 7,
    position: 'absolute'
  },
  welcomeText: {
    marginBottom: 0,
    marginTop: 50,
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    letterSpacing: 1,
    fontFamily: 'HelveticaNeue',
    color: '#333'
  },

  baseButton: {
    flex: 0.8,
    flexDirection: 'column',
    marginBottom: 5,
    width: Dimensions.get('window').width - 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8
  },

  baseButtonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'HelveticaNeue-Thin'
  },

  buttonDefault: {
    backgroundColor: '#DDD',
    borderColor: '#DDD'
  },
  buttonDefaultText: {
    color: 'white'
  },

  buttonPrimary: {
    backgroundColor: '#31D8A0',
    borderColor: '#31D8A0',
    marginTop: 10
  },
  buttonPrimaryText: {
    color: 'white'
  },

  inputs: {
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    paddingLeft: 5
  },
  inputContainer: {
    width: Dimensions.get('window').width - 30,
    padding: 10,
    marginBottom: 5,
    height: 40,
    borderBottomWidth: Platform.OS === 'ios' ? 1 : 0,
    borderColor: Platform.OS === 'ios' ? '#DDD' : 'transparent'
  },
  input: {
    position: 'absolute',
    left: 5,
    top: 0,
    right: 5,
    bottom: 0,
    height: 40,
    fontSize: 18,
    padding: 5
  },

  greyFont: {
    color: '#555'
  },
  darkFont: {
    color: '#000'
  }
});

module.exports.colors = {
  accentColor: '#31D8A0'
};