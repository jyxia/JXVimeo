'use strict';
var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

/**
* Place all publishers here. It also makes logging esay.
*
*/

module.exports = (function() {
  var init = function(playButton, progress, video, playerContainer) {
    _playbuttonPublishers(playButton);
    _progressPublishers(progress);
    _videoPublishers(video);
    _playerContainerPubs(playerContainer);
  };

  var _playbuttonPublishers = function(playButton) {
    playButton.addEventListener(playerEvents.play, function() {
      eventManager.publish(playerEvents.play);
    }, false);
    playButton.addEventListener(playerEvents.pause, function() {
      eventManager.publish(playerEvents.pause);
    }, false);
  };

  var _progressPublishers = function(progress) {
    progress.addEventListener(playerEvents.seek, function(data) {
      eventManager.publish(playerEvents.seek, data.detail);
    }, false);
  };

  var _videoPublishers = function(video) {
    video.addEventListener(playerEvents.videoReady, function(data) {
      eventManager.publish(playerEvents.videoReady, data.detail);
    }, false);
    video.addEventListener(playerEvents.buffered, function(data) {
      eventManager.publish(playerEvents.buffered, data.detail);
    }, false);
    video.addEventListener(playerEvents.played, function(data) {
      eventManager.publish(playerEvents.played, data.detail);
    }, false);
    video.addEventListener(playerEvents.tick, function(data) {
      eventManager.publish(playerEvents.tick, data.detail);
    }, false);
    video.addEventListener(playerEvents.playing, function() {
      eventManager.publish(playerEvents.playing);
    }, false);
    video.addEventListener(playerEvents.pause, function() {
      eventManager.publish(playerEvents.pause);
    }, false);
  };

  var _playerContainerPubs = function(playerContainer) {
    playerContainer.addEventListener(playerEvents.togglePlay, function() {
      eventManager.publish(playerEvents.togglePlay);
    }, false);
  };

  return {
    init: init
  };

})();
