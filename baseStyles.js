var React = require('react-native');
var {StyleSheet} = React;

module.exports = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center'
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
    top: 15,
    left: 7,
    position: 'absolute'
  },
  welcomeText: {
    marginBottom: 0,
    marginTop: 50,
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 24,
    fontFamily: 'HelveticaNeue',
    color: '#777'
  },

  baseButton: {
    flex: 1,
    marginBottom: 5,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderWidth: 2,
    borderColor: 'white'
  },

  baseButtonText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'HelveticaNeue-Thin'
  },

  buttonPrimary : {
    backgroundColor: '#e2717f',
    borderColor: '#e2717f'
  },
  buttonPrimaryText : {
    color: 'white'
  },

  inputs: {
    marginTop: 30,
    marginBottom: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center'
  },
  inputContainer: {
    width: 300,
    padding: 10,
    marginBottom: 5,
    height: 40
  },
  input: {
    position: 'absolute',
    left: 5,
    top: 0,
    right: 5,
    bottom: 0,
    height: 40,
    fontSize: 18
  },

  greyFont: {
    color: '#555'
  },
  darkFont: {
    color: '#000'
  }
});

module.exports.colors = {
  accentColor: '#e2717f'
};