'use strict';
var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

module.exports = (function() {
  var registerSubscribers = function(playButton, progress, video) {
    _videoSubs(video);
    _progressSubs(progress);
    _buttonSubs(playButton);
  };

  var _videoSubs = function(video) {
    eventManager.subscribe(playerEvents.play, function() {
      video.play();
    });
    eventManager.subscribe(playerEvents.pause, function() {
      video.pause();
    });
    eventManager.subscribe(playerEvents.seek, function(data) {
      video.seek(data.currentTime);
    });
    eventManager.subscribe(playerEvents.togglePlay, function() {
      video.togglePlay();
    });
    eventManager.subscribe(playerEvents.fastForward, function(data) {
      video.fastForward(data.steps);
    });
    eventManager.subscribe(playerEvents.rewind, function(data) {
      video.rewind(data.steps);
    });
  };

  var _progressSubs = function(progress) {
    eventManager.subscribe(playerEvents.videoReady, function(data) {
      progress.updateDuration(data);
    });
    eventManager.subscribe(playerEvents.playing, function() {
      progress.receivePlaying(playerEvents.playing);
    });
    eventManager.subscribe(playerEvents.buffered, function(data) {
      progress.updateBufferedProgress(data);
    });
    eventManager.subscribe(playerEvents.played, function(data) {
      progress.updatePlayedProgress(data);
    });
    eventManager.subscribe(playerEvents.tick, function(data) {
      progress.updateTick(data);
    });
  };

  var _buttonSubs = function(playButton) {
    eventManager.subscribe(playerEvents.playing, function() {
      playButton.togglePlay(playerEvents.playing);
    });
    eventManager.subscribe(playerEvents.pause, function() {
      playButton.togglePlay(playerEvents.pause);
    });
  };

  return {
    init: registerSubscribers
  };
})();
