var path = require('path');
var webpack = require('webpack');


var DIST_DIR = path.resolve(__dirname, 'dist');
var SRC_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: SRC_DIR + '/index.js',
  output: {
    path: DIST_DIR,
    filename: 'image-story.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    loaders: [
      {
        test: /.js?$/,
        include: SRC_DIR,
        loader: 'babel',
        exclude: /node_modules/,
      },
    ],
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
};


module.exports = [config];
