var eventManager = require('../EventManager/PubSub.js');
var playButtonActions = require('../Actions/PlayButtonActions.js');

module.exports = (function() {
  var state = {
    'playing': false
  };

  var playButtonClick = function(self) {
    if (state.playing) {
      state.playing = false;
      playButtonActions.publishPause();
    } else {
      playButtonActions.publishPlay();
      state.playing = true;
    }
  };

  var init = function(button) {
    this.playButton = button;
    var self = this;
    this.playButton.addEventListener('click', function() {
      playButtonClick(self);
    }, false);
  };

  return {
    init: init
  };

})();
