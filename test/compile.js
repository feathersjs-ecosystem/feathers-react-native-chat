var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var origJs = require.extensions['.js'];

require.extensions['.js'] = function (module, fileName) {
  var output;

   //check if we are loading react-native, if so replace it with a mock file
  if (fileName.indexOf('/node_modules/react-native/Libraries/react-native/react-native.js') > -1) {
    fileName = path.resolve('./test/mocks/react-native.js');
  }

  if (fileName.indexOf('/node_modules/react-native-router-flux/index.js') > -1) {
    fileName = path.resolve('./test/mocks/react-native-router-flux.js');
  }

    // don't transpile files from node_modules
  if (fileName.indexOf('node_modules/') >= 0) {
    return (origJs || require.extensions['.js'])(module, fileName);
  }

  var src = fs.readFileSync(fileName, 'utf8');
  output = babel.transform(src, {
    filename: fileName,
    sourceFileName: fileName,
    // load transform that will allow us to use spread operator in our mock
    plugins: [
      "transform-object-rest-spread"
    ],
    presets: [ 'es2015', "stage-0", 'react'],
    //ignore: ['/node_modules/react-native-router-flux/**/*'],
    sourceMaps: false
  }).code;

  return module._compile(output, fileName);
};