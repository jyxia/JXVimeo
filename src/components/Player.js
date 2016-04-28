'use strict';
var Video = require('../components/Video');
var Progress = require('../components/ProgressBar');
var PlayButton = require('../components/PlayButton');
var publishers = require('../eventManager/Publishers');
var subscribers = require('../eventManager/Subscribers');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');
var utility = require('../utility/Utility');

/**
 * Custom Class: Player
 * @param{String} videoLink: video link
 * @param{String} width: player's width
 * @param{String} height: player's height
 * members:
 * 1. DOM objects: this.playerContainer - contains all elements
 * 2. Video object: this.video, it opens Player's APIs.
 */

var Player = function(videoLink, width, height) {
  this.video = new Video(videoLink);
  var container = document.createElement('div');
  var randomId = utility.generateRandomId(10);
  container.className = 'player-container';
  container.setAttribute('id', randomId);
  container.setAttribute('tabindex', 0);

  container.style.width = width;
  container.style.height = height;
  container.appendChild(this.video.videoContainer);

  var controls = document.createElement('div');
  controls.className = 'controls';
  var playBtn = new PlayButton();
  controls.appendChild(playBtn.playbuttonElem);
  var progress = new Progress();
  controls.appendChild(progress.progressContainer);
  container.appendChild(controls);

  this.playerControls = controls;
  this.playerContainer = container;

  // register pubs/subs here.
  publishers.init(playBtn.playbuttonElem, progress.progressContainer, this.video.videoContainer, this.playerContainer);
  subscribers.init(playBtn, progress, this.video);

  var that = this;
  var isMouseDown = false;
  var leftArrowCount = 0;
  var rightArrowCount = 0;
  var mouseStopTimer = null;

  var _resetMouseStopTimer = function() {
    if (mouseStopTimer) {
      window.clearTimeout(mouseStopTimer);
    }
    if (utility.hasClass(that.playerControls, 'invisible')) {
      utility.removeClass(that.playerControls, 'invisible');
    }
    mouseStopTimer = window.setTimeout(function() {
      utility.addClass(that.playerControls, 'invisible');
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
      utility.addClass(that.playerControls, 'invisible');
    }
    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseLeaveListener = function() {
    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseEnterListener = function() {
    utility.removeClass(that.playerControls, 'invisible');
    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
    that.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
  };

  var _keydownListener = function(event) {
    _resetMouseStopTimer();
    if (event.keyCode === 32) {
      event.preventDefault();
      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
      that.playerContainer.dispatchEvent(videoTogglePlayEvent);
    }

    if (event.keyCode === 37) {
      rightArrowCount += 1;
      var rewindData = { steps: rightArrowCount };
      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
      that.playerContainer.dispatchEvent(rewindEvent);
    }

    if (event.keyCode === 39) {
      leftArrowCount += 1;
      var fastForwardData = { steps: leftArrowCount };
      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
      that.playerContainer.dispatchEvent(fastForwardEvent);
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

  this.playerContainer.addEventListener('keydown', _keydownListener, false);
  this.playerContainer.addEventListener('keyup', _keyupListener, false);
  this.playerContainer.addEventListener('mousedown', _mousedownListener, false);
  this.playerContainer.addEventListener('mouseup', _mouseupListener, false);

  this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  this.playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
  this.playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
  this.playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
};

module.exports = Player;
