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

    var playedProgressData = { progress: video.currentTime };
    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
    videoContainer.dispatchEvent(videoPlayedEvent);
  };

  var _progressUpdateListener = function() {
    var buffered = video.player.buffered;
    if (buffered.length > 0) {
      var bufferedEnd = buffered.end(buffered.length - 1);
      var bufferData = { buffered: bufferedEnd };
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

  var seek = function(time) {
    video.player.currentTime = time;
    video.currentTime = time;
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
    video.playing = true;
  };

  var pause = function() {
    video.player.pause();
    video.playing = false;
  };

  var fastForward = function(steps) {
    video.currentTime += steps;
    video.player.currentTime = video.currentTime;
  };

  var rewind = function(steps) {
    video.currentTime -= steps;
    video.player.currentTime = video.currentTime;
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
    seek: seek,
    fastForward: fastForward,
    rewind: rewind
  };

})();
