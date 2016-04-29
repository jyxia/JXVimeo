'use strict';

var videoElement = require('../elements/VideoElement');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

/**
 * Custom class: Video
 * @param{String} videoLink, video source link
 *
 * members:
 * 1. HTML element: this.videoContainer - contains video element
 * 2. Video state: this.video
 * In order to access to Video object and change states, use prototype's methods (APIs)
 * @see Video.prototype
 */

var Video = function(videoLink) {
  this.videoContainer = videoElement.videoElement(videoLink);
  this.video = {
    duration: 0,
    currentTime: 0,
    buffered: 0,
    playing: false,
    player: this.videoContainer.firstElementChild
  };
  var _this = this;

  /**
  * private methods - mainly for event listeners
  */
  var _updateProgress = function() {
    var buffered =  _this.video.player.buffered;
    if (buffered.length > 0) {
      var bufferedEnd = buffered.end(buffered.length - 1);
      var bufferData = { buffered: bufferedEnd };
      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
      _this.videoContainer.dispatchEvent(videoBufferEvent);
    }
  };

  var _loadeddataListener = function() {
    _this.video.duration = _this.video.player.duration;
    var durationData = { duration:  _this.video.duration };
    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
    _this.videoContainer.dispatchEvent(videoReadyEvent);
    _updateProgress();
  };

  var _timeupdateListener = function() {
    _this.video.currentTime =  _this.video.player.currentTime;
    var tickData = { currentTime: _this.video.currentTime };
    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
    _this.videoContainer.dispatchEvent(videoTickEvent);

    var playedProgressData = { progress:  _this.video.currentTime };
    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
    _this.videoContainer.dispatchEvent(videoPlayedEvent);
  };

  var _progressUpdateListener = function() {
    _updateProgress();
  };

  var _playingListener = function() {
    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
    _this.videoContainer.dispatchEvent(videoPlayingEvent);
  };

  var _pauseListener = function() {
    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
    _this.videoContainer.dispatchEvent(vimeoPauseEvent);
  };

  var _mouseClickListner = function() {
    _this.togglePlay();
  };

  /**
  * register event listeners
  */
  this.videoContainer.addEventListener('click', _mouseClickListner, false);
  this.video.player.addEventListener('loadeddata', _loadeddataListener, false);
  this.video.player.addEventListener('timeupdate', _timeupdateListener, false);
  this.video.player.addEventListener('progress', _progressUpdateListener, false);
  this.video.player.addEventListener('playing', _playingListener, false);
  this.video.player.addEventListener('pause', _pauseListener, false);
};

//
// Video APIs, other elements change video states from here.
// Also, if player expose a video object, then these APIs become the player's APIs.
//
Video.prototype = {
  seek: function(time) {
    this.video.player.currentTime = time;
    this.video.currentTime = time;
  },

  togglePlay: function() {
    if (this.video.playing) {
      this.video.player.pause();
      this.video.playing = false;
    } else {
      this.video.player.play();
      this.video.playing = true;
    }
  },

  play: function() {
    this.video.player.play();
    this.video.playing = true;
  },

  pause: function() {
    this.video.player.pause();
    this.video.playing = false;
  },

  fastForward: function(steps) {
    this.video.currentTime += steps;
    this.video.player.currentTime = this.video.currentTime;
  },

  rewind: function(steps) {
    this.video.currentTime -= steps;
    this.video.player.currentTime = this.video.currentTime;
  },

  isPlaying: function() {
    return this.video.playing;
  }
};

module.exports = Video;
