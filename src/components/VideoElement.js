var eventManager = require('../EventManager/PubSub');
var videoStore = require('../Stores/VideoStore');

var createElement = function(videoLink) {
  var videoContainer = document.createElement('div');
  videoContainer.className = 'video-container';
  var videoElement = document.createElement('video');
  videoElement.setAttribute('src', videoLink);
  videoStore.init(videoElement);
  videoContainer.appendChild(videoElement);

  return videoContainer;
};

var videoElement = function(videoLink) {
  var videoContainer = createElement(videoLink);
  return videoContainer;
};

module.exports = videoElement;
