'use strict';
var utility = require('../utility/Utility');

/**
 * @return{Function} createPlayer() create a HTML DOM element (div) for player
 */

module.exports = (function() {
  /**
  * @param{Object} videoContainer, videoWrapper div HTML element
  * @param{Object} playbuttonElem, playbutton div HTML element
  * @param{Object} progressContainer, progressContainer div HTML element
  * @return{Object} container, player's wrapper HTML element
  */
  var createPlayer = function(videoContainer, playbuttonElem, progressContainer) {
    var container = document.createElement('div');
    var randomId = utility.generateRandomId(10);
    container.className = 'player-container';
    container.setAttribute('id', randomId);
    container.setAttribute('tabindex', 0);
    container.style.width = videoContainer.width;
    container.style.height = videoContainer.height;
    container.appendChild(videoContainer.videoContainer);

    var controls = document.createElement('div');
    controls.className = 'controls';
    controls.appendChild(playbuttonElem);
    controls.appendChild(progressContainer);
    container.appendChild(controls);

    var player = {
      container: container,
      controls: controls,
      video: videoContainer.videoContainer
    };
    return player;
  };

  return {
    createPlayer: createPlayer
  };

})();
