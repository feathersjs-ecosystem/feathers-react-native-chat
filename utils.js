'use strict';

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
  }
};
