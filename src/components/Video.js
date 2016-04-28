'use strict';

var videoElement = require('../elements/VideoElement');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

/**
 * Custom Class: Video
 * @param{String} videoLink, video source link
 * members:
 * 1. DOM objects: this.videoContainer - contains video element
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
  var that = this;

  /**
  * private methods - mainly for event listeners
  */
  var _loadeddataListener = function() {
    that.video.duration = that.video.player.duration;
    var durationData = { duration: that.video.duration };
    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
    that.videoContainer.dispatchEvent(videoReadyEvent);
    _progressUpdateListener();
  };

  var _timeupdateListener = function() {
    that.video.currentTime = that.video.player.currentTime;
    var tickData = { currentTime: that.video.currentTime };
    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
    that.videoContainer.dispatchEvent(videoTickEvent);

    var playedProgressData = { progress: that.video.currentTime };
    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
    that.videoContainer.dispatchEvent(videoPlayedEvent);
  };

  var _progressUpdateListener = function() {
    var buffered = that.video.player.buffered;
    if (buffered.length > 0) {
      var bufferedEnd = buffered.end(buffered.length - 1);
      var bufferData = { buffered: bufferedEnd };
      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
      that.videoContainer.dispatchEvent(videoBufferEvent);
    }
  };

  var _playingListener = function() {
    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
    that.videoContainer.dispatchEvent(videoPlayingEvent);
  };

  var _pauseListener = function() {
    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
    that.videoContainer.dispatchEvent(vimeoPauseEvent);
  };

  var _mouseClickListner = function() {
    that.togglePlay();
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
  }
};

module.exports = Video;
