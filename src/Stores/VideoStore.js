var eventManager = require('../EventManager/PubSub');
var videoActions = require('../Actions/VideoActions');

module.exports = (function() {
  var state = { };

  /*
  * video element publishers:
  *
  */

  var loadeddata = function(self) {
    var data = {
      duration: self.player.duration
    };
    videoActions.publishReady(data);
  };

  var timeupdate = function(self) {
    var data = {
      currentTime: self.player.currentTime,
    };
    videoActions.publishTick(data);
  };


  /*
  * video element subscribers:
  *
  */
  var play = function() {
    this.player.play();
  };

  var init = function(element) {
    this.player = element;
    var self = this;
    element.addEventListener('loadeddata', function() {
      loadeddata(self);
    }, false);
    element.addEventListener('timeupdate', function() {
      timeupdate(self);
    }, false);

    eventManager.subscribe('play', function() {
      self.player.play();
    });
    eventManager.subscribe('pause', function() {
      self.player.pause();
    });
  };

  var getCurrentTime = function() {
    return this.element.currentTime;
  };

  var setCurrentTime = function(currentTime) {
    this.state.currentTime = currentTime;
  };

  var getDuration = function() {
    return this.element.state.duration;
  };

  return {
    init: init
  };

})();
