'use strict';
module.exports = (function() {
  var createPlayButton = function() {
    var playButton = document.createElement('div');
    playButton.className = 'play-icon';
    var playSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    playSVG.setAttribute('viewBox', '0 0 20 20');
    playSVG.setAttribute('preserveAspectRatio', 'xMidYMid');
    var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
    polygon.setAttribute('points', '1,0 20,10 1,20');
    playSVG.appendChild(polygon);
    playButton.appendChild(playSVG);
    return playButton;
  };

  var createPauseButton = function() {
    var pauseButton = document.createElement('div');
    pauseButton.className = 'pause-icon';
    var pauseSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    pauseSVG.setAttribute('viewBox', '0 0 20 20');
    pauseSVG.setAttribute('preserveAspectRatio', 'xMidYMid');
    var leftRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    leftRect.setAttribute('width', '6');
    leftRect.setAttribute('height', '20');
    leftRect.setAttribute('x', '0');
    leftRect.setAttribute('y', '0');
    pauseSVG.appendChild(leftRect);
    var rightRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    rightRect.setAttribute('width', '6');
    rightRect.setAttribute('height', '20');
    rightRect.setAttribute('x', '12');
    rightRect.setAttribute('y', '0');
    pauseSVG.appendChild(rightRect);
    pauseButton.appendChild(pauseSVG);
    return pauseButton;
  };

  var createButton = function() {
    var button = document.createElement('button');
    button.className = 'play';
    var playBtn = createPlayButton();
    button.appendChild(playBtn);
    var pauseBtn = createPauseButton();
    button.appendChild(pauseBtn);
    return button;
  };

  return {
    createPlayButton: createButton
  };

})();
