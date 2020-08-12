/* global __dirname, require, module*/
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const fs = require('fs')

var NAMESPACE = 'sphinx'

module.exports = {
  entry: './dist/index.js',
  mode:'production',
  output: {
    path: path.resolve(__dirname, NAMESPACE),
    filename: 'sphinx.min.js',
    library:['sphinx'],
  },
  target:'web',
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  node: {fs: "empty"}
}


