var videoElement = require('./VideoElement');
var playerControls = require('./PlayerControls');

var playerContainer = function(videoLink) {
  var container = document.createElement('div');
  container.className = 'player-container';
  var video = videoElement(videoLink);
  container.appendChild(video);
  var controls = playerControls();
  container.appendChild(controls);

  return container;
};

module.exports = playerContainer;
