'use strict';

/**
 * @return{Function} progressWrapper() create a DOM element (wrapper div) for progress bar
 */

module.exports = (function() {
  var buffered = function() {
    var bufferedDiv = document.createElement('div');
    bufferedDiv.className = 'buffered';
    bufferedDiv.setAttribute('role', 'progressbar');
    bufferedDiv.setAttribute('aria-label', 'buffered');
    bufferedDiv.setAttribute('aria-valuemin', 0);
    return bufferedDiv;
  };

  var played = function() {
    var playedDiv = document.createElement('div');
    playedDiv.className = 'played';
    playedDiv.setAttribute('role', 'progressbar');
    playedDiv.setAttribute('aria-label', 'played');
    playedDiv.setAttribute('aria-valuemin', 0);
    return playedDiv;
  };

  var hoverTimebox = function() {
    var hoverTimeboxDiv = document.createElement('div');
    hoverTimeboxDiv.setAttribute('role', 'presentation');
    hoverTimeboxDiv.setAttribute('aria-hidden', 'true');
    hoverTimeboxDiv.className = 'hover-timebox';
    var timePopDiv = timePop('00:00');
    hoverTimeboxDiv.appendChild(timePopDiv);
    return hoverTimeboxDiv;
  };

  var timebox = function() {
    var timeboxDiv = document.createElement('div');
    timeboxDiv.setAttribute('role', 'presentation');
    timeboxDiv.setAttribute('aria-hidden', 'true');
    timeboxDiv.className = 'timebox';
    var timePopDiv = timePop('00:00');
    timeboxDiv.appendChild(timePopDiv);
    return timeboxDiv;
  };

  var timePop = function(time) {
    var timePopDiv = document.createElement('div');
    timePopDiv.className = 'time-pop';
    timePopDiv.innerHTML = time;
    return timePopDiv;
  };

  var createProgressWrapper = function() {
    var bufferedElement = buffered();
    var playedElement = played();
    var hoverTimeboxElement = hoverTimebox();
    var timeBoxElement = timebox();
    var progressElement = document.createElement('div');
    progressElement.className = 'progress';
    progressElement.appendChild(bufferedElement);
    progressElement.appendChild(playedElement);
    progressElement.appendChild(hoverTimeboxElement);
    progressElement.appendChild(timeBoxElement);
    var progressWrapper = document.createElement('div');
    progressWrapper.className = 'progress-wrapper';
    progressWrapper.appendChild(progressElement);

    return progressWrapper;
  };

  return {
    progressWrapper: createProgressWrapper
  };

})();
