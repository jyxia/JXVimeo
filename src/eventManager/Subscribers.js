'use strict';
var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

module.exports = (function() {
  var registerSubscribers = function(playButton, progress, video, playerContainer) {
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
      video.setCurrentTime(data.currentTime);
    });
    eventManager.subscribe(playerEvents.togglePlay, function() {
      video.togglePlay();
    });
  };

  var _progressSubs = function(progress) {
    eventManager.subscribe(playerEvents.videoReady, function(data) {
      progress.initTimeBox(data);
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
