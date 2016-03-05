import React, { View, Text, StyleSheet, TextInput } from 'react-native';
import Chat from '../../components/Chat';
import { shallow, mount } from 'enzyme';

var sinon = require('sinon');

require('sinon-as-promised');

describe('<Chat />', () => {

  it('renders messages', () => {
    const wrapper = shallow(<Chat />);

  });

  it('hides the chat interface when offline', () => {
    const wrapper = shallow(<Chat />);

  });

  it('shows the chat interface when online', () => {
    const wrapper = shallow(<Chat />);

  });

});
