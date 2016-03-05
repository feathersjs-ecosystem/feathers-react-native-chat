var ReactNativeMock = {
  Actions: {
    main: function () {

    }
  }
};

// the cache key that real react native would get
var key = require.resolve('react-native-router-flux');

// make sure the cache is filled with our lib
require.cache[key] = {
  id: key,
  filename: key,
  loaded: true,
  exports: ReactNativeMock,
};
