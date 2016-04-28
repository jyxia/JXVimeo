'use strict';
var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

/**
 * Place all publishers here. It also makes logging esay.
 * Register the DOM elements by calling init();
 *
 */

module.exports = (function() {
  /**
  * @param{Object} playButton (DOM Object): playpause button
  * @param{Object} progress (DOM Object): progress bar
  * @param{Object} video (DOM Object): vidoe element
  * @param{Object} playerContainer (DOM Object): a container element contains all elements
  *
  */
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
    playerContainer.addEventListener(playerEvents.fastForward, function(data) {
      eventManager.publish(playerEvents.fastForward, data.detail);
    }, false);
    playerContainer.addEventListener(playerEvents.rewind, function(data) {
      eventManager.publish(playerEvents.rewind, data.detail);
    }, false);
  };

  return {
    init: init
  };

})();
