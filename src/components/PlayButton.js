var eventManager = require('../eventManager/PubSub');
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
    var playIcon = playbutton.children[0];
    var pauseIcon = playbutton.children[1];
    playbutton.addEventListener('click', function() {
      buttonClickListener(playIcon, pauseIcon);
    }, false);

    return playbutton;
  };

  var buttonClickListener = function(playIcon, pauseIcon) {
    if (state.playing) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
      playbutton.dispatchEvent(vimeoPauseEvent);
      state.playing = false;
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
      playbutton.dispatchEvent(vimeoPlayEvent);
      state.playing = true;
    }
  };

  return {
    init: init,
    playbutton: playbutton
  };

})();
