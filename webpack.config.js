var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var libraryName = 'player';
var dev = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    player: './src/app.js',
    style: './src/css/style.css'
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename:  dev ? '[name].js' : '[name].min.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "jshint-loader"
      }
    ],
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
      }
    ]
  },
  devtool: dev ? 'inline-source-map': null,
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  },
  plugins:
    dev ? [new ExtractTextPlugin('../css/style.css')] : [
      new ExtractTextPlugin('../css/style.min.css'),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
  postcss: [
    autoprefixer({ browsers: ['last 2 versions'] })
  ]
};
