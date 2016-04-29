'use strict';

var utility = require('../utility/Utility');
var progressWrapper = require('../elements/PlayerProgressElement.js');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

/**
 * Custom class: Progress
 * members - HTML elements
 * - this.progressBar,
 * - this.progressBarChildren - a collection of child DOMs of progressBar
 *
 * In order to access to this object, use prototype's methods (APIs)
 * @see Progress.prototype
 */

var Progress = function() {
  this.progressContainer = progressWrapper.progressWrapper();
  this.progressBar = this.progressContainer.firstElementChild;
  this.progressBarChildren = {
    buffered: this.progressBar.children[0],
    played: this.progressBar.children[1],
    hoverTimebox: this.progressBar.children[2],
    timeBox: this.progressBar.children[3]
  };

  var _this = this;
  var isMouseDown = false;

  /**
  * private methods - mainly for event listeners
  */
  var _getMousePosition = function(e, progressBar) {
    var mPosx = 0;
    var ePosx = 0;
    var obj = progressBar;

    // get mouse position on document crossbrowser
    if (!e) e = window.event;
    if (e.pageX) {
      mPosx = e.pageX;
    } else if (e.client) {
      mPosx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    while (obj.offsetParent) {
      ePosx += obj.offsetLeft;
      obj = obj.offsetParent;
    }

    var offset = mPosx - ePosx;
    var hoverPosition = offset / progressBar.offsetWidth;
    return hoverPosition;
  };

  var _dispatchSeek = function(event) {
    var hoverPosition = _getMousePosition(event, _this.progressBar);
    var data = { currentTime: _this.videoDuration * hoverPosition };
    var seekEvent = createCustomEvent(playerEvents.seek, data);
    _this.progressContainer.dispatchEvent(seekEvent);
  };

  var _mousemoveListener = function(event) {
    event.stopPropagation();
    var hoverPosition = _getMousePosition(event, _this.progressBar);
    if (hoverPosition < 0 || hoverPosition > 1) return;
    var currentTime = _this.videoDuration * hoverPosition;
    _this.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    _this.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox';
  };

  var _mouseleaveListener = function() {
    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
  };

  var _mousedownmoveListener = function(event) {
    var hoverPosition = _getMousePosition(event, _this.progressBar);
    if (hoverPosition < 0 || hoverPosition > 1) return;
    var currentTime = _this.videoDuration * hoverPosition;
    _this.progressBarChildren.played.style.width = (hoverPosition * 100).toFixed(3) + '%';
    _this.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
    _this.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    _this.progressBarChildren.timeBox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    _this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    _dispatchSeek(event);
  };

  var _mousedownListener = function(event) {
    event.preventDefault();
    isMouseDown = true;
    _this.playerContainer = _this.progressContainer.parentNode.parentNode;
    utility.addClass(_this.playerContainer, 'grabbable');
    _dispatchSeek(event);

    // only add mousemove to document when mouse down to progressBar happened
    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
    _this.progressBar.removeEventListener('mousemove', _mousemoveListener);
  };

  var _mouseupListener = function() {
    if (!isMouseDown) return;
    utility.removeClass(_this.playerContainer, 'grabbable');
    _this.progressBar.addEventListener('mousemove', _mousemoveListener, false);

    // when mouse is up remove mousemove event from documentElement
    document.documentElement.removeEventListener('mousemove', _mousedownmoveListener);
  };

  /**
  * register event listeners
  */
  this.progressBar.addEventListener('mousemove', _mousemoveListener, false);
  this.progressBar.addEventListener('mouseleave', _mouseleaveListener, false);
  this.progressBar.addEventListener('mousedown', _mousedownListener, false);
  document.documentElement.addEventListener('mouseup', _mouseupListener, false);
};

//
// Progress APIs, other elements change progress states from here.
// Also, if player expose a Progress object, then these APIs become the player's APIs.
//
Progress.prototype = {
  videoDuration: 0,

  updatePlayedProgress: function(data) {
    if (this.videoDuration <= 0) return;
    var playedPecentage = data.progress / this.videoDuration * 100;
    this.progressBarChildren.played.style.width = playedPecentage.toFixed(3) + '%';
    this.progressBarChildren.timeBox.style.left = playedPecentage.toFixed(3) + '%';
    this.progressBarChildren.played.setAttribute('aria-valuenow', data.progress);
    var playedAriaText = utility.readTime(data.progress) + ' played';
    this.progressBarChildren.played.setAttribute('aria-valuetext', playedAriaText);
  },

  updateBufferedProgress: function(data) {
    if (this.videoDuration <= 0) return;
    var bufferedPercentage = data.buffered / this.videoDuration * 100;
    this.progressBarChildren.buffered.style.width = bufferedPercentage.toFixed(3) + '%';
    this.progressBarChildren.buffered.setAttribute('aria-valuenow', data.buffered);
    var bufferedAriaText = utility.readTime(data.buffered) + ' buffered';
    this.progressBarChildren.buffered.setAttribute('aria-valuetext', bufferedAriaText);
  },

  updateTimeBox: function(data) {
    var currentTime = utility.splitTime(data.currentTime);
    this.progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
  },

  updateTick: function(data) {
    this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
  },

  updateDuration: function(data) {
    this.videoDuration = data.duration;
    // update UIs related with duation
    this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(this.videoDuration);
    this.progressBarChildren.played.setAttribute('aria-valuemax', this.videoDuration.toFixed(3));
    this.progressBarChildren.buffered.setAttribute('aria-valuemax', this.videoDuration.toFixed(3));
  },

  receivePlaying: function() {
    utility.addClass(this.progressBarChildren.hoverTimebox, 'invisible');
  }
};

module.exports = Progress;
