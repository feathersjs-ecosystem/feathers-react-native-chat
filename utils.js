'use strict';

var React = require('react-native');
var { Platform, ToastAndroid } = React;

module.exports = {
  validateUsername(name) {
    //TODO: Add more robust validation
    if (name.length > 0) {
      return true;
    }
    return false;
  },

  validatePassword(password) {
    //TODO: Add more robust validation
    if (password.length > 0) {
      return true;
    }
    return false;
  },
  showAlert: function (message) {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG)
    } else {
      alert(message);
    }
  }

};
