var eventManager = require('../eventManager/PubSub');
var videoElement = require('../elements/VideoElement');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

module.exports = (function() {
  var video = {
    duration: 0,
    currentTime: 0,
    buffered: 0
  };
  var playerContainer;

  var init = function(videoLink) {
    playerContainer = videoElement.videoElement(videoLink);
    video.player = playerContainer.firstElementChild;
    video.player.addEventListener('loadeddata', function() {
      _loadeddataListener();
    }, false);
    video.player.addEventListener('timeupdate', function() {
      _timeupdateListener();
    }, false);
    video.player.addEventListener('progress', function() {
      _progressUpdateListener();
    }, false);

    return playerContainer;
  };

  var _loadeddataListener = function() {
    video.duration = video.player.duration;
    var durationData = { duration: video.duration };
    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
    playerContainer.dispatchEvent(videoReadyEvent);

    var bufferData = { buffered: video.player.buffered.end(0) / video.duration * 100 };
    var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
    playerContainer.dispatchEvent(videoBufferEvent);
  };

  var _timeupdateListener = function() {
    video.currentTime = video.player.currentTime;
    var tickData = { currentTime: video.currentTime };
    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
    playerContainer.dispatchEvent(videoTickEvent);

    var playedProgressData = { progress: video.currentTime / video.duration * 100 };
    var videoBufferEvent = createCustomEvent(playerEvents.played, playedProgressData);
    playerContainer.dispatchEvent(videoBufferEvent);
  };

  var _progressUpdateListener = function() {
    var range = 0;
    var bf = video.player.buffered;
    var time = video.player.currentTime;

    while(!(bf.start(range) <= time && time <= bf.end(range))) {
      range += 1;
    }

    if (range < bf.start.length) {
      var bufferData = { buffered: bf.end(range) / video.duration * 100 };
      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
      playerContainer.dispatchEvent(videoBufferEvent);
    }
  };

  var getCurrentTime = function() {
    return video.currentTime;
  };

  var setCurrentTime = function(currentTime) {
    video.player.currentTime = currentTime;
    video.currentTime = currentTime;
  };

  var play = function() {
    video.player.play();
  };

  var pause = function() {
    video.player.pause();
  };

  //
  // Video component public APIs
  // Outside world can change video component states by accessing to these APIs.
  //
  return {
    init: init,
    play: play,
    pause: pause,
    setCurrentTime: setCurrentTime
  };

})();
