'use strict';
var videoComponent = require('../components/Video');
var progressComponent = require('../components/ProgressBar');
var playButtonComponent = require('../components/PlayButton');
var publishers = require('../eventManager/Publishers');
var subscribers = require('../eventManager/Subscribers');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');
var utility = require('../utility/Utility');

module.exports = (function() {
  var playerContainer;
  var playerControls;
  var leftArrowCount = 0;
  var rightArrowCount = 0;
  var mouseStopTimer;

  var init = function(videoLink, width, height) {
    playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    var video = videoComponent.init(videoLink);
    playerContainer.style.width = width;
    playerContainer.style.height = height;
    playerContainer.appendChild(video);

    playerControls = document.createElement('div');
    playerControls.className = 'controls';
    var playBtn = playButtonComponent.init();
    playerControls.appendChild(playBtn);
    var progress = progressComponent.init();
    playerControls.appendChild(progress);
    playerContainer.appendChild(playerControls);

    // register pubs/subs here.
    publishers.init(playBtn, progress, video, playerContainer);
    subscribers.init(playButtonComponent, progressComponent, videoComponent);

    document.documentElement.addEventListener('keydown', _keydownListener, false);
    document.documentElement.addEventListener('keyup', _keyupListener, false);
    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
    playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
    playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
    playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);

    return playerContainer;
  };

  var _mouseLeaveListner = function() {
    utility.addClass(playerControls, 'hidden');
    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseLeaveListener = function() {
    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
  };

  var _controlsMouseEnterListener = function() {
    utility.removeClass(playerControls, 'hidden');
    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
    playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
  };

  var _mousemoveListner = function() {
    if (mouseStopTimer) {
      window.clearTimeout(mouseStopTimer);
      utility.removeClass(playerControls, 'hidden');
    }
    mouseStopTimer = window.setTimeout(function() {
      utility.addClass(playerControls, 'hidden');
    }, 2000);
  };

  var _keydownListener = function(event) {
    if (event.keyCode === 32) {
      event.preventDefault();
      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
      playerContainer.dispatchEvent(videoTogglePlayEvent);
    }

    if (event.keyCode === 37) {
      rightArrowCount += 1;
      var rewindData = { steps: rightArrowCount };
      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
      playerContainer.dispatchEvent(rewindEvent);
    }

    if (event.keyCode === 39) {
      leftArrowCount += 1;
      var fastForwardData = { steps: leftArrowCount };
      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
      playerContainer.dispatchEvent(fastForwardEvent);
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

  return {
    init: init
  };

})();
