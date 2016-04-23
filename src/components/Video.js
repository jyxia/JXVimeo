'use strict';

var videoElement = require('../elements/VideoElement');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

module.exports = (function() {
  var video = {
    duration: 0,
    currentTime: 0,
    buffered: 0,
    playing: false
  };
  var videoContainer;

  var init = function(videoLink) {
    videoContainer = videoElement.videoElement(videoLink);
    video.player = videoContainer.firstElementChild;
    video.player.addEventListener('loadeddata', _loadeddataListener, false);
    video.player.addEventListener('timeupdate', _timeupdateListener, false);
    video.player.addEventListener('progress', _progressUpdateListener, false);
    video.player.addEventListener('playing', _playingListener, false);
    video.player.addEventListener('pause', _pauseListener, false);
    return videoContainer;
  };

  var _loadeddataListener = function() {
    video.duration = video.player.duration;
    var durationData = { duration: video.duration };
    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
    videoContainer.dispatchEvent(videoReadyEvent);

    var bufferData = { buffered: video.player.buffered.end(0) / video.duration * 100 };
    var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
    videoContainer.dispatchEvent(videoBufferEvent);
  };

  var _timeupdateListener = function() {
    video.currentTime = video.player.currentTime;
    var tickData = { currentTime: video.currentTime };
    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
    videoContainer.dispatchEvent(videoTickEvent);

    var playedProgressData = { progress: video.currentTime / video.duration * 100 };
    var videoBufferEvent = createCustomEvent(playerEvents.played, playedProgressData);
    videoContainer.dispatchEvent(videoBufferEvent);
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
      videoContainer.dispatchEvent(videoBufferEvent);
    }
  };

  var _playingListener = function() {
    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
    videoContainer.dispatchEvent(videoPlayingEvent);
  };

  var _pauseListener = function() {
    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
    videoContainer.dispatchEvent(vimeoPauseEvent);
  };

  var setCurrentTime = function(currentTime) {
    video.player.currentTime = currentTime;
    video.currentTime = currentTime;
  };

  var togglePlay = function() {
    if (video.playing) {
      video.player.pause();
      video.playing = false;
    } else {
      video.player.play();
      video.playing = true;
    }
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
    togglePlay: togglePlay,
    play: play,
    pause: pause,
    setCurrentTime: setCurrentTime
  };

})();
