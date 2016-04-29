'use strict';
var Video = require('../components/Video');
var Progress = require('../components/ProgressBar');
var PlayButton = require('../components/PlayButton');
var PlayerElem = require('../elements/PlayerElement');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');
var utility = require('../utility/Utility');

/**
 * Custom class: Player
 *
 * @param{String} videoLink: video link
 * @param{String} width: player's width
 * @param{String} height: player's height
 *
 * members:
 * 1. HTML object: this.playerContainer - contains all elements
 * 2. Video object: this.video, it opens Player's APIs.
 */

var Player = function(videoLink, width, height) {
  this.playerButton = new PlayButton();
  this.progress = new Progress();
  this.video = new Video(videoLink);
  var playbuttonElem = this.playerButton.playbuttonElem;
  var progressContainer = this.progress.progressContainer;
  var videoContainer = this.video.videoContainer;
  var videoWrapper = {
    videoContainer: videoContainer,
    width: width,
    height: height
  };
  var playerElem = PlayerElem.createPlayer(videoWrapper, playbuttonElem, progressContainer);
  var playerControls = playerElem.controls;
  this.playerContainer = playerElem.container;

  var _this = this;
  var isMouseDown = false;
  var leftArrowCount = 0;
  var rightArrowCount = 0;
  var mouseStopTimer = null;

  /**
  * private methods - mainly for event listeners
  */
  var _resetMouseStopTimer = function() {
    if (mouseStopTimer) {
      window.clearTimeout(mouseStopTimer);
    }
    if (utility.hasClass(playerControls, 'invisible')) {
      utility.removeClass(playerControls, 'invisible');
    }
    mouseStopTimer = window.setTimeout(function() {
      utility.addClass(playerControls, 'invisible');
    }, 3000);
  };

  var _mousemoveListner = function() {
    _resetMouseStopTimer();
  };

  var _mousedownListener = function() {
    isMouseDown = true;
  };

  var _mouseupListener = function() {
    isMouseDown = false;
  };

  var _mouseLeaveListner = function() {
    if (!isMouseDown) {
      utility.addClass(playerControls, 'invisible');
    }
    _this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseLeaveListener = function() {
    _this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseEnterListener = function() {
    utility.removeClass(playerControls, 'invisible');
    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
    _this.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
  };

  var _keydownListener = function(event) {
    _resetMouseStopTimer();
    if (event.keyCode === 32) {
      event.preventDefault();
      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
      _this.playerContainer.dispatchEvent(videoTogglePlayEvent);
    }

    if (event.keyCode === 37) {
      rightArrowCount += 1;
      var rewindData = { steps: rightArrowCount };
      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
      _this.playerContainer.dispatchEvent(rewindEvent);
    }

    if (event.keyCode === 39) {
      leftArrowCount += 1;
      var fastForwardData = { steps: leftArrowCount };
      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
      _this.playerContainer.dispatchEvent(fastForwardEvent);
    }
  };

  var _keyupListener = function(event) {
    if (event.keyCode === 37) {
      rightArrowCount = 0;
    }

    if (event.keyCode === 39) {
      leftArrowCount = 0;
    }
  };

  var _clickEventListener = function() {
    _this.playerContainer.focus();
  };

  /**
  * Add eventlisteners here
  */
  this.playerContainer.addEventListener('keydown', _keydownListener, false);
  this.playerContainer.addEventListener('keyup', _keyupListener, false);
  this.playerContainer.addEventListener('mousedown', _mousedownListener, false);
  this.playerContainer.addEventListener('mouseup', _mouseupListener, false);
  this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  this.playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
  this.playerContainer.addEventListener('click', _clickEventListener, false);

  playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
  playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
};

Player.prototype.receivePlaying = function() {
  var playingEvent = createCustomEvent('playing');
  this.playerContainer.dispatchEvent(playingEvent);
};

module.exports = Player;
