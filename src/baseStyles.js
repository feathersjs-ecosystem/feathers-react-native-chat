var React = require('react-native');
var {StyleSheet, Dimensions, Platform} = React;


module.exports = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  inputs: {
    marginTop: 15,
    flex: 1,
  },
  inputContainer: {
    padding: 10,
    marginHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
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