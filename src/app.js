'use strict';
var Player = require('./components/Player');

var app = function(videoLink, width, height) {
  var player = new Player(videoLink, width, height);
  return player;
};

module.exports = app;
