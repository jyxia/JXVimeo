'use strict';
var playerContainer = require('./components/Player');

var app = function(videoLink, width, height) {
  var player = playerContainer.init(videoLink, width, height);
  return player;
};

module.exports = app;
