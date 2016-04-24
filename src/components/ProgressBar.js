'use strict';

var utility = require('../utility/Utility');
var progressWrapper = require('../elements/PlayerProgressElement.js');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

module.exports = (function() {
  var progressBarChildren = {};
  var videoDuration = 0;
  var progressBar;
  var progressContainer;
  var playerContainer;
  var isMouseDown = false;

  var init = function() {
    progressContainer = progressWrapper.progressWrapper();
    progressBar = progressContainer.firstElementChild;
    progressBarChildren.buffered = progressBar.children[0];
    progressBarChildren.played = progressBar.children[1];
    progressBarChildren.hoverTimebox = progressBar.children[2];
    progressBarChildren.timeBox = progressBar.children[3];

    progressBar.addEventListener('mousemove', _mousemoveListener, false);
    progressBar.addEventListener('mouseleave', _mouseleaveListener, false);
    progressBar.addEventListener('mousedown', _mousedownListener, false);
    document.documentElement.addEventListener('mouseup', _mouseupListener, false);
    return progressContainer;
  };

  var _mousemoveListener = function(event) {
    event.stopPropagation();
    var hoverPosition = _getMousePosition(event, progressBar);
    if (hoverPosition < 0 || hoverPosition > 1) return;
    var currentTime = videoDuration * hoverPosition;
    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    progressBarChildren.hoverTimebox.className = 'hover-timebox';
  };

  var _mouseleaveListener = function() {
    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
  };

  var _mousedownListener = function(event) {
    isMouseDown = true;
    event.preventDefault();
    playerContainer = progressContainer.parentNode.parentNode;
    utility.addClass(playerContainer, 'grabbable');
    _dispatchSeek(event);

    // only add mousemove to document when mouse down to progressBar happened
    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
    progressBar.removeEventListener('mousemove', _mousemoveListener);
  };

  var _mouseupListener = function() {
    if (!isMouseDown) return;
    utility.removeClass(playerContainer, 'grabbable');
    progressBar.addEventListener('mousemove', _mousemoveListener, false);

    // when mouse is up remove mousemove event from documentElement
    document.documentElement.removeEventListener('mousemove', _mousedownmoveListener);
  };

  var _mousedownmoveListener = function(event) {
    var hoverPosition = _getMousePosition(event, progressBar);
    if (hoverPosition < 0 || hoverPosition > 1) return;
    var currentTime = videoDuration * hoverPosition;
    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    progressBarChildren.timeBox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(currentTime);
    _dispatchSeek(event);
  };

  var _dispatchSeek = function(event) {
    var hoverPosition = _getMousePosition(event, progressBar);
    var data = { currentTime: videoDuration * hoverPosition };
    var seekEvent = createCustomEvent(playerEvents.seek, data);
    progressContainer.dispatchEvent(seekEvent);
  };

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

  var updatePlayedProgress = function(data) {
    if (videoDuration <= 0) return;
    var playedPecentage = data.progress / videoDuration * 100;
    progressBarChildren.played.style.width = playedPecentage.toFixed(3) + '%';
    progressBarChildren.timeBox.style.left = playedPecentage.toFixed(3) + '%';
    progressBarChildren.played.setAttribute('aria-valuenow', data.progress);
    var playedAriaText = utility.readTime(data.progress) + ' played';
    progressBarChildren.played.setAttribute('aria-valuetext', playedAriaText);
  };

  var updateBufferedProgress = function(data) {
    if (videoDuration <= 0) return;
    var bufferedPercentage = data.buffered / videoDuration * 100;
    progressBarChildren.buffered.style.width = bufferedPercentage.toFixed(3) + '%';
    progressBarChildren.buffered.setAttribute('aria-valuenow', data.buffered);
    var bufferedAriaText = utility.readTime(data.buffered) + ' buffered';
    progressBarChildren.buffered.setAttribute('aria-valuetext', bufferedAriaText);
  };

  var updateTimeBox = function(data) {
    var currentTime = utility.splitTime(data.currentTime);
    progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
  };

  var updateTick = function(data) {
    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
  };

  var updateDuration = function(data) {
    videoDuration = data.duration;
    // update UIs related with duation
    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(videoDuration);
    progressBarChildren.played.setAttribute('aria-valuemax', videoDuration.toFixed(3));
    progressBarChildren.buffered.setAttribute('aria-valuemax', videoDuration.toFixed(3));
  };

  var receivePlaying = function() {
    utility.addClass(progressBarChildren.hoverTimebox, 'invisible');
  };

  //
  // Progress component public APIs
  // Outside world can change progress states by accessing to these APIs.
  //
  return {
    init: init,
    updatePlayedProgress: updatePlayedProgress,
    updateBufferedProgress: updateBufferedProgress,
    updateTimeBox: updateTimeBox,
    updateTick: updateTick,
    updateDuration: updateDuration,
    receivePlaying: receivePlaying,
    isMouseDown: isMouseDown
  };

})();
