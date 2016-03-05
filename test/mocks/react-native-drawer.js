require('react-native-mock/mock.js');

var React = require('react-native');

export default class Drawer extends React.Component  {
  static tweenPresets = {parallax : 0 };
  constructor() {
    super();
    this.tweenPresets = {parallax : 0 };
  }
  render() {
    return (<React.View />);
  }
}