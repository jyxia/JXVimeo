'use strict';
var videoComponent = require('../components/Video');
var progressComponent = require('../components/ProgressBar');
var playButtonComponent = require('../components/PlayButton');
var publishers = require('../eventManager/Publishers');
var subscribers = require('../eventManager/Subscribers');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

module.exports = (function() {
  var playerContainer;
  var leftArrowCount = 0;
  var rightArrowCount = 0;

  var init = function(videoLink) {
    playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    var video = videoComponent.init(videoLink);
    playerContainer.appendChild(video);

    var controls = document.createElement('div');
    controls.className = 'controls';
    var playBtn = playButtonComponent.init();
    controls.appendChild(playBtn);
    var progress = progressComponent.init();
    controls.appendChild(progress);
    playerContainer.appendChild(controls);

    // register pubs/subs here.
    publishers.init(playBtn, progress, video, playerContainer);
    subscribers.init(playButtonComponent, progressComponent, videoComponent, playerContainer);

    document.documentElement.addEventListener('keydown', _keydownListener, false);
    document.documentElement.addEventListener('keyup', _keyupListener, false);

    return playerContainer;
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
