var videoComponent = require('../components/Video');
var progressComponent = require('../components/ProgressBar');
var playButton = require('../components/PlayButton');
var publishers = require('../eventManager/Publishers');
var subscribers = require('../eventManager/Subscribers');

module.exports = (function() {
  var playerControls = function() {
    var controls = document.createElement('div');
    controls.className = 'controls';
    var playBtn = playButton.init();
    controls.appendChild(playBtn);
    var progress = progressComponent.init();
    controls.appendChild(progress);
    return controls;
  };

  var playerContainer = function(videoLink) {
    var container = document.createElement('div');
    container.className = 'player-container';
    var video = videoComponent.init(videoLink);
    container.appendChild(video);

    var controls = document.createElement('div');
    controls.className = 'controls';
    var playBtn = playButton.init();
    controls.appendChild(playBtn);
    var progress = progressComponent.init();
    controls.appendChild(progress);
    container.appendChild(controls);

    publishers.init(playBtn, progress, video);
    subscribers.init(playBtn, progressComponent, videoComponent);

    return container;
  };

  return {
    playerContainer: playerContainer,
  };

})();
