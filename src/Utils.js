export default class Utils {

  static validateEmail(email) {
    //TODO: Add more robust validation
    if (email.length > 0) {
      return true;
    }
    return false;
  }

  static validatePassword(password) {
    //TODO: Add more robust validation
    if (password.length > 0) {
      return true;
    }
    return false;
  }
}
