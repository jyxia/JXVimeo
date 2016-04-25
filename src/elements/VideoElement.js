'use strict';

/**
 * @return { Function } videoElement() create a DOM element (wrapper div) for video
 */

module.exports = (function() {
  var createVideoElement = function(videoLink) {
    var videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    var videoElement = document.createElement('video');
    videoElement.setAttribute('src', videoLink);
    videoContainer.appendChild(videoElement);
    return videoContainer;
  };

  return {
    videoElement: createVideoElement
  };

})();
