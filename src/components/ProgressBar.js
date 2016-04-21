var eventManager = require('../eventManager/PubSub');
var utility = require('../utility/Utility');
var progressWrapper = require('../elements/PlayerProgressElement.js');
var playerEvents = require('../eventManager/PlayerEvents');
var createCustomEvent = require('../utility/CreateCustomEvent');

module.exports = (function() {
  var progressBarChildren = {};
  var videoDuration = 0;
  var progressBar;
  var progressContainer;

  var init = function() {
    progressContainer = progressWrapper.progressWrapper();
    progressBar = progressContainer.firstElementChild;
    progressBarChildren.buffered = progressBar.children[0];
    progressBarChildren.played = progressBar.children[1];
    progressBarChildren.hoverTimebox = progressBar.children[2];
    progressBarChildren.timeBox = progressBar.children[3];

    progressBar.addEventListener('mousemove', function(event) {
      _mousemoveListener(event);
    }, false);

    progressBar.addEventListener('mouseleave', function() {
      _mouseleaveListener();
    }, false);

    progressBar.addEventListener('click', function(event) {
      _mouseClickListener(event);
    }, false);

    progressBar.addEventListener('mousedown', function(event) {
      _mousedownListener(event);
    }, false);

    return progressContainer;
  };

  var _mouseClickListener = function(event) {
    var hoverPosition = _getMousePosition(event, progressBar);
    var data = { currentTime: videoDuration * hoverPosition };
    var clickEvent = createCustomEvent(playerEvents.seek, data);
    progressContainer.dispatchEvent(clickEvent);
  };

  var _mousemoveListener = function(event) {
    var hoverPosition = _getMousePosition(event, progressBar);
    if (hoverPosition < 0 || hoverPosition > 1) return;
    var currentTime = videoDuration * hoverPosition;
    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
    progressBarChildren.hoverTimebox.className = 'hover-timebox';
    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
  };

  var _mouseleaveListener = function() {
    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
    utility.removeClass(progressBar, 'grabbable');
  };

  var _mousedownListener = function(event) {
    utility.addClass(progressBar, 'grabbable');
  };

  var _getMousePosition = function(e, progressBar) {
    var m_posx = 0;
    var e_posx = 0;
    var obj = progressBar;
    // get mouse position on document crossbrowser
    if (!e) e = window.event;
    if (e.pageX) {
        m_posx = e.pageX;
    } else if (e.client) {
        m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    }
    //get parent element position in document
    if (obj.offsetParent) {
        do {
          e_posx += obj.offsetLeft;
        } while (obj = obj.offsetParent);
    }

    var offset = m_posx - e_posx;
    var hoverPosition = offset / progressBar.offsetWidth;
    return hoverPosition;
  };

  var updatePlayedProgress = function(data) {
    progressBarChildren.played.style.width = data.progress.toFixed(3) + '%';
    progressBarChildren.timeBox.style.left = data.progress.toFixed(3) + '%';
  };

  var updateBufferedProgress = function(data) {
    progressBarChildren.buffered.style.width = data.buffered.toFixed(3) + '%';
  };

  var updateTimeBox = function(data) {
    var currentTime = utility.splitTime(data.currentTime);
    progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
  };

  var initTimeBox = function(data) {
    videoDuration = data.duration;
    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.duration);
  };

  var updateTick = function(data) {
    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
  };

  //
  // Progress component public APIs
  // Outside world can change progress states by accessing to these APIs.
  //
  return {
    init: init,
    updatePlayedProgress: updatePlayedProgress,
    updateBufferedProgress: updateBufferedProgress,
    updateTimeBox: updateTimeBox,
    initTimeBox: initTimeBox,
    updateTick: updateTick
  };

})();
