var path = require('path');

module.exports = {
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js'
  },
  module: {
    loader: [
      { test: /\.css$/, loader:'style!css!' }
    ]
  },
  devtool: 'inline-source-map'
};
