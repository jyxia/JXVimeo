var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    player: './src/app.js',
    style: './src/css/style.css'
  },
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: "[name].js",
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader!postcss-loader')
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new ExtractTextPlugin('../css/style.css')
  ],
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};
