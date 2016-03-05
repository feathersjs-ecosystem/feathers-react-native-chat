import React, { View, Text, StyleSheet, TextInput, ListView } from 'react-native';
import SideDrawer from '../../components/SideDrawer';
import { shallow, mount, render } from 'enzyme';

var sinon = require('sinon');

require('sinon-as-promised');

export class DataSource {
  constructor() {

  }

  cloneWithRows() {

  }
}

describe('<SideDrawer />', () => {
  ListView.DataSource = DataSource;

  var mockFeathersApp;

  beforeEach((done) => {

    mockFeathersApp = {
      service: function () {
        return {
          find: sinon.stub().resolves({
            total: 1, data: [{
              username: 'ekryski'
            }]
          })
        }
      },
      authenticate: sinon.stub().resolves({'token': "TOKEN"}),
      logout: sinon.stub().resolves({}),
      user: sinon.stub().resolves({})
    };
    done();
    });

  afterEach((done) => {
    done();
  });

  it('render the # of users online', () => {
    const wrapper = mount(<SideDrawer app={mockFeathersApp}/>);
    let items = wrapper.findWhere((component) => {
      return false;//component.props().children === "No one's online.";
    });

    wrapper.setState({'onlineUserCount': 10});
  });

  it('renders a list of users', () => {
    const wrapper = mount(<SideDrawer app={mockFeathersApp}/>);

    });

  it('logs out', () => {
    const wrapper = mount(<SideDrawer app={mockFeathersApp}/>);
    wrapper.node._signOut();
    expect(mockFeathersApp.logout.calledOnce).to.equal(true);
  });
});
