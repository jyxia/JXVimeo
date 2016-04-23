'use strict';

var playButtonElement = require('../elements/PlayButtonElement');
var createCustomEvent = require('../utility/CreateCustomEvent');
var playerEvents = require('../eventManager/PlayerEvents');

module.exports = (function() {
  var state = {
    'playing': false
  };
  var playbutton;

  var init = function() {
    playbutton = playButtonElement.createPlayButton();
    playbutton.addEventListener('click', _buttonClickListener, false);
    return playbutton;
  };

  var _buttonClickListener = function() {
    if (state.playing) {
      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
      playbutton.dispatchEvent(vimeoPauseEvent);
      state.playing = false;
    } else {
      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
      playbutton.dispatchEvent(vimeoPlayEvent);
      state.playing = true;
    }
  };

  var toggle = function(eventName) {
    var playIcon = playbutton.children[0];
    var pauseIcon = playbutton.children[1];
    if (eventName === playerEvents.pause) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      state.playing = false;
      playbutton.setAttribute('aria-label', 'play');
      // playbutton.setAttribute('title', 'play');
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      state.playing = true;
      playbutton.setAttribute('aria-label', 'pause');
      // playbutton.setAttribute('title', 'pause');
    }
  };

  return {
    init: init,
    togglePlay: toggle
  };

})();
