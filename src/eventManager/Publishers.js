var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

module.exports = (function() {
  var init = function(playButton, progress, video) {
    playbuttonPublishers(playButton);
    progressPublishers(progress);
    videoPublishers(video);
  };

  var playbuttonPublishers = function(playButton) {
    playButton.addEventListener(playerEvents.play, function() {
      eventManager.publish(playerEvents.play);
    }, false);
    playButton.addEventListener(playerEvents.pause, function() {
      eventManager.publish(playerEvents.pause);
    }, false);
  };

  var progressPublishers = function(progress) {
    progress.addEventListener(playerEvents.seek, function(data) {
      eventManager.publish(playerEvents.seek, data.detail);
    }, false);
  };

  var videoPublishers = function(video) {
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
  };

  return {
    init: init
  };

})();
