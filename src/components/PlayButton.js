'use strict';

var playButtonElement = require('../elements/PlayButtonElement');
var createCustomEvent = require('../utility/CreateCustomEvent');
var playerEvents = require('../eventManager/PlayerEvents');

/**
 * Custom class: PlayButton
 *
 * members:
 * 1. HTML element: playbuttonElem - contains button element
 * 2. Playing state: this.states
 * In order to access to PlayButton object, use prototype's methods (APIs)
 * @see PlayButton.prototype
 */

var PlayButton = function() {
  this.playbuttonElem = playButtonElement.createPlayButton();
  var _this = this;

  var _buttonClickListener = function(event) {
    event.stopPropagation();
    if (_this.playing) {
      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
      _this.playbuttonElem.dispatchEvent(vimeoPauseEvent);
      _this.playing = false;
    } else {
      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
      _this.playbuttonElem.dispatchEvent(vimeoPlayEvent);
      _this.playing = true;
    }
  };

  this.playbuttonElem.addEventListener('click', _buttonClickListener, false);
};

PlayButton.prototype = {
  playing: false,

  togglePlay: function(eventName) {
    var playbutton = this.playbuttonElem;
    var playIcon = playbutton.children[0];
    var pauseIcon = playbutton.children[1];

    if (eventName === playerEvents.pause) {
      playIcon.style.display = 'block';
      pauseIcon.style.display = 'none';
      this.playing = false;
      playbutton.setAttribute('aria-label', 'play');
      playbutton.setAttribute('title', 'play');
    } else {
      playIcon.style.display = 'none';
      pauseIcon.style.display = 'block';
      this.playing = true;
      playbutton.setAttribute('aria-label', 'pause');
      playbutton.setAttribute('title', 'pause');
    }
  }
};

module.exports = PlayButton;
