import Icon from './react-native-vector-icons';
import Drawer from './react-native-drawer';

console.log('Setting up mocks for:');
console.log('\t- react-native');
require('react-native-mock/mock.js');

// Add our mocks
createMock('react-native-vector-icons/FontAwesome', require('./react-native-vector-icons'));
createMock('react-native-vector-icons/Ionicons', Icon);
createMock('react-native-router-flux', require('./react-native-router-flux'));
createMock('react-native-drawer', Drawer);
createMock('react-native-gifted-messenger', require('./react-native-gifted-messenger'));

function createMock(moduleName, mock) {

  // the cache key that the module would normally resolve
  var key = require.resolve(moduleName);
  console.log('\t- ' + moduleName);
  //console.log(JSON.stringify(moduleName) + ' : ' + key);

  // make sure the cache is filled with our lib
  require.cache[key] = {
    id: key,
    filename: key,
    loaded: true,
    exports: mock
  };
}