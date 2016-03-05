var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var origJs = require.extensions['.js'];

require.extensions['.js'] = function (module, fileName) {
  var output;

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
    presets: [ 'es2015', "stage-0", 'react', 'react-native'],
    sourceMaps: false
  }).code;

  return module._compile(output, fileName);
};