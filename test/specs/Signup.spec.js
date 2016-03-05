import React, { View, Text, StyleSheet, TextInput } from 'react-native';
import Signup from '../../components/Signup';
import { shallow, mount } from 'enzyme';

var sinon = require('sinon');

require('sinon-as-promised');

describe('<Signup />', () => {

  var alert;

  beforeEach((done) => {
    alert = sinon.spy(React.Alert, 'alert');

    done();
  });

  afterEach((done) => {
    alert.restore();
    done();
  });

  it('it should render 2 text inputs and a create account', () => {
    const wrapper = shallow(<Signup />);
    expect(wrapper.find(TextInput)).to.have.length(2);

    let items = wrapper.findWhere((component) => {
      return component.props().children === "Create Account";
    });
    expect(items.length).to.equal(1);
  });

  describe('Validation and error handling', () => {


    it('validates username', () => {
      const wrapper = mount(<Signup />);

      // login without setting a username
      wrapper.node.setState({password: 'test'});
      wrapper.node.signup();

      expect(alert.calledWith('Error', 'Please enter a valid username.')).to.be.ok;
    });

    it('validates password', () => {
      const wrapper = mount(<Signup />);

      // login without setting a password
      wrapper.node.setState({username: 'test'});
      wrapper.node.signup();

      expect(alert.calledWith('Error', 'Please enter a valid password.')).to.be.ok;
    });
  });

  describe('Creating account', () => {

    var mockFeathersApp;
    var createUser;
    var authenticate;

    beforeEach((done) => {
      authenticate = sinon.stub().resolves('go');
      mockFeathersApp = {
        service: function () {
          return {
            create: function () {
              return new Promise(function(resolve,reject){
               resolve('12324');
              });
            }
          }
        },
        authenticate : authenticate
      };
      createUser = sinon.spy(mockFeathersApp.service('users'), 'create');//.resolves('fuck');
      done();
    });

    afterEach((done) =>{
      createUser.restore();
      done();
    });
    it('calls create() when input valid', () => {
      const wrapper = mount(<Signup app={mockFeathersApp}/>);
      wrapper.node.setState({username: 'test', password: 'test'});
      wrapper.node.signup();

      expect(authenticate.calledOnce).to.equal(true);
      expect(authenticate.calledWith({type: 'local', username: 'test', password: 'test'})).to.be.ok;
    });
  });
});
