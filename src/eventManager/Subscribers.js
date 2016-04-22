var playerEvents = require('./PlayerEvents');
var eventManager = require('./PubSub');

module.exports = (function() {
  var registerSubscribers = function(playButton, progress, video) {
    videoSubs(video);
    progressSubs(progress);
  };

  var videoSubs = function(video) {
    eventManager.subscribe(playerEvents.play, function() {
      video.play();
    });
    eventManager.subscribe(playerEvents.pause, function() {
      video.pause();
    });
    eventManager.subscribe(playerEvents.seek, function(data) {
      video.setCurrentTime(data.currentTime);
    });
  };

  var progressSubs = function(progress) {
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

  return {
    init: registerSubscribers
  };
})();
