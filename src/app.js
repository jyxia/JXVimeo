'use strict';
var Player = require('./components/Player');
var EventManager = require('./eventManager/PubSub');
var registerPubs = require('./eventManager/Publishers');
var registerSubs = require('./eventManager/Subscribers');

/**
 * Custom Class: Player
 * @param{String} videoLink: video link
 * @param{String} width: player's width
 * @param{String} height: player's height
 *
 * members:
 * 1. HTML element: this.playerContainer - contains all elements in the player
 */
var app = function(videoLink, width, height) {
  var player = new Player(videoLink, width, height);
  var playButton = player.playerButton;
  var progress = player.progress;
  var video = player.video;
  this.playerContainer = player.playerContainer;
  // register pubs/subs here.
  var eventManager = new EventManager();
  registerPubs(eventManager, playButton.playbuttonElem, progress.progressContainer,video.videoContainer, this.playerContainer);
  registerSubs(eventManager, playButton, progress, video);
};

module.exports = app;
