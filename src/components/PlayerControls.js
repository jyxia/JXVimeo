var playButton = require('./PlayButton');
var progressWrapper = require('./PlayerProgress');

var playerControls = function() {
  var controls = document.createElement('div');
  controls.className = 'controls';
  var playBtn = playButton();
  controls.appendChild(playBtn);
  var progress = progressWrapper();
  controls.appendChild(progress);
  return controls;
};

module.exports = playerControls;
