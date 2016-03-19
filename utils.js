'use strict';

module.exports = {
  validateEmail(email) {
    //TODO: Add more robust validation
    if (email.length > 0) {
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
  }
};
