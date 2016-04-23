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

  var init = function(videoLink) {
    playerContainer = document.createElement('div');
    playerContainer.className = 'player-container';
    playerContainer.setAttribute('tabindex', 0);
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

    playerContainer.addEventListener('keypress', _keypressListener, false);

    return playerContainer;
  };

  var _keypressListener = function(event) {
    if (event.keyCode === 32) {
      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
      playerContainer.dispatchEvent(videoTogglePlayEvent);
    }
  };

  return {
    init: init
  };

})();
