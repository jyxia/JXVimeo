'use strict';

var playButtonElement = require('../elements/PlayButtonElement');
var createCustomEvent = require('../utility/CreateCustomEvent');
var playerEvents = require('../eventManager/PlayerEvents');

var PlayButton = function() {
  var _buttonClickListener = function(event) {
    event.stopPropagation();
    if (that.state.playing) {
      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
      that.playbuttonElem.dispatchEvent(vimeoPauseEvent);
      that.state.playing = false;
    } else {
      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
      that.playbuttonElem.dispatchEvent(vimeoPlayEvent);
      that.state.playing = true;
    }
  };

  this.playbuttonElem = playButtonElement.createPlayButton();
  this.playbuttonElem.addEventListener('click', _buttonClickListener, false);
  var that = this;
};

PlayButton.prototype = {
  state: {
    'playing': false
  },

  togglePlay: function(eventName) {
    var playbutton = this.playbuttonElem;
    var state = this.state;
    var playIcon = playbutton.children[0];
    var pauseIcon = playbutton.children[1];
    if (eventName === playerEvents.pause) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      state.playing = false;
      playbutton.setAttribute('aria-label', 'play');
      playbutton.setAttribute('title', 'play');
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      state.playing = true;
      playbutton.setAttribute('aria-label', 'pause');
      playbutton.setAttribute('title', 'pause');
    }
  }
};

module.exports = PlayButton;
