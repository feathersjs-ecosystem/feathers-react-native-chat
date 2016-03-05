import React, { View, Text, StyleSheet, TextInput } from 'react-native';
var Actions = require('react-native-router-flux').Actions;
import Login from '../../components/Login';
import { shallow, mount } from 'enzyme';

var sinon = require('sinon');

require('sinon-as-promised');

describe('<Login />', () => {

  var alert;
  beforeEach(() =>{
    alert = sinon.spy(React.Alert, 'alert');
  });

  afterEach(() =>{
    alert.restore();
  });

  it('it should render 2 text inputs and a login button', () => {
    const wrapper = shallow(<Login />);
    expect(wrapper.find(TextInput)).to.have.length(2);

    let items = wrapper.findWhere((component) => {
      return component.props().children === "Login";
    });
    expect(items.length).to.equal(1);
  });

  describe('Validation and error handling', () => {

    it('validates username', () => {
      const wrapper = mount(<Login />);

      // login without setting a username
      wrapper.node.setState({password: 'test'});
      wrapper.node.login();

      expect(alert.calledWith('Error', 'Please enter a valid username.')).to.be.ok;
    });

    it('validates password', () => {
      const wrapper = mount(<Login />);

      // login without setting a password
      wrapper.node.setState({username: 'test'});
      wrapper.node.login();

      expect(alert.calledWith('Error', 'Please enter a valid password.')).to.be.ok;
    });
  });

  describe('Logging in', () => {
    it('calls authenticate() when input valid', (done) => {
      var mainAction = sinon.spy(Actions, 'main');
      var authenticate = sinon.stub().resolves({token: "AUTH_TOKEN"});
      const wrapper = mount(<Login app={{authenticate: authenticate}}/>);
      wrapper.node.setState({username: 'test', password: 'test'});
      wrapper.node.login();

      expect(authenticate.calledOnce).to.equal(true);
      expect(authenticate.calledWith({type: 'local', username: 'test', password: 'test'})).to.be.ok;

      // Check that Actions.main is fired
      setTimeout(function(){
        expect(mainAction.calledOnce).to.equal(true);
        done();
      }, 1000);

    });

    it('shows an alert when authentication fails', (done) => {
      var authenticate = sinon.stub().rejects({error: "ERROR_MESSAGE"});
      const wrapper = mount(<Login app={{authenticate: authenticate}}/>);
      wrapper.node.setState({username: 'test', password: 'test'});
      wrapper.node.login();

      expect(authenticate.calledOnce).to.equal(true);
      expect(authenticate.calledWith({type: 'local', username: 'test', password: 'test'})).to.be.ok;

      setTimeout(function(){
        expect(alert.calledWith('Error', 'Please enter a valid username or password.')).to.be.ok;
        done();
      }, 1000);
    });
  });
});
