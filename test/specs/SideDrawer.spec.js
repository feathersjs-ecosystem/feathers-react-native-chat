import React, { View, Text, StyleSheet, TextInput, ListView } from 'react-native';
import SideDrawer from '../../components/SideDrawer';
import { shallow, mount, render } from 'enzyme';

var sinon = require('sinon');

require('sinon-as-promised');

//TODO: Find a better way to mock / stub this out
export class DataSource {
  constructor() {

  }

  cloneWithRows() {

  }
}

describe('<SideDrawer />', () => {
  ListView.DataSource = DataSource;
  //var stubListView = sinon.spy(ListView.DataSource, '');

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
      logout: sinon.stub().resolves({}),
      user: sinon.stub().resolves({})
    };
    done();
  });

  afterEach((done) => {
    done();
  });

  it('render the # of users online', () => {
    expect(false).to.equal(true);
  });

  it('renders a list of users', () => {
    expect(false).to.equal(true);
  });

  it('logs out', () => {
    const wrapper = mount(<SideDrawer app={mockFeathersApp}/>);
    wrapper.node._signOut();
    expect(mockFeathersApp.logout.calledOnce).to.equal(true);
    //TODO: verify that Actions.launch was called
  });
});
