/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// require('!style!css!./css/style.css');
	'use strict';
	var playerContainer = __webpack_require__(1);
	module.exports = (function() {
	  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
	  // var videoLink = '/Applications/MAMP/htdocs/videocollaboratory/optimizedVideos/vc-543-2.mp4';
	  var player = playerContainer.init(videoLink);
	  document.getElementsByTagName('body')[0].appendChild(player);
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var videoComponent = __webpack_require__(2);
	var progressComponent = __webpack_require__(7);
	var playButtonComponent = __webpack_require__(10);
	var publishers = __webpack_require__(12);
	var subscribers = __webpack_require__(14);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	module.exports = (function() {
	  var playerContainer;
	  var leftArrowCount = 0;
	  var rightArrowCount = 0;
	
	  var init = function(videoLink) {
	    playerContainer = document.createElement('div');
	    playerContainer.className = 'player-container';
	    var video = videoComponent.init(videoLink);
	    playerContainer.appendChild(video);
	
	    var controls = document.createElement('div');
	    controls.className = 'controls';
	    var playBtn = playButtonComponent.init();
	    controls.appendChild(playBtn);
	    var progress = progressComponent.init();
	    controls.appendChild(progress);
	    playerContainer.appendChild(controls);
	
	    // register pubs/subs here.
	    publishers.init(playBtn, progress, video, playerContainer);
	    subscribers.init(playButtonComponent, progressComponent, videoComponent, playerContainer);
	
	    document.documentElement.addEventListener('keydown', _keydownListener, false);
	    document.documentElement.addEventListener('keyup', _keyupListener, false);
	
	    return playerContainer;
	  };
	
	  var _keydownListener = function(event) {
	    if (event.keyCode === 32) {
	      event.preventDefault();
	      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
	      playerContainer.dispatchEvent(videoTogglePlayEvent);
	    }
	
	    if (event.keyCode === 37) {
	      rightArrowCount += 1;
	      var rewindData = { steps: rightArrowCount };
	      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
	      playerContainer.dispatchEvent(rewindEvent);
	    }
	
	    if (event.keyCode === 39) {
	      leftArrowCount += 1;
	      var fastForwardData = { steps: leftArrowCount };
	      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
	      playerContainer.dispatchEvent(fastForwardEvent);
	    }
	  };
	
	  var _keyupListener = function(event) {
	    if (event.keyCode === 37) {
	      rightArrowCount = 0;
	    }
	
	    if (event.keyCode === 39) {
	      leftArrowCount = 0;
	    }
	  };
	
	  return {
	    init: init
	  };
	
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var videoElement = __webpack_require__(3);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	module.exports = (function() {
	  var video = {
	    duration: 0,
	    currentTime: 0,
	    buffered: 0,
	    playing: false
	  };
	  var videoContainer;
	
	  var init = function(videoLink) {
	    videoContainer = videoElement.videoElement(videoLink);
	    video.player = videoContainer.firstElementChild;
	    video.player.addEventListener('loadeddata', _loadeddataListener, false);
	    video.player.addEventListener('timeupdate', _timeupdateListener, false);
	    video.player.addEventListener('progress', _progressUpdateListener, false);
	    video.player.addEventListener('playing', _playingListener, false);
	    video.player.addEventListener('pause', _pauseListener, false);
	    return videoContainer;
	  };
	
	  var _loadeddataListener = function() {
	    video.duration = video.player.duration;
	    var durationData = { duration: video.duration };
	    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
	    videoContainer.dispatchEvent(videoReadyEvent);
	
	    var bufferData = { buffered: video.player.buffered.end(0) / video.duration * 100 };
	    var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	    videoContainer.dispatchEvent(videoBufferEvent);
	  };
	
	  var _timeupdateListener = function() {
	    video.currentTime = video.player.currentTime;
	    var tickData = { currentTime: video.currentTime };
	    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
	    videoContainer.dispatchEvent(videoTickEvent);
	
	    var playedProgressData = { progress: video.currentTime };
	    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
	    videoContainer.dispatchEvent(videoPlayedEvent);
	  };
	
	  var _progressUpdateListener = function() {
	    var buffered = video.player.buffered;
	    if (buffered.length > 0) {
	      var bufferedEnd = buffered.end(buffered.length - 1);
	      var bufferData = { buffered: bufferedEnd };
	      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	      videoContainer.dispatchEvent(videoBufferEvent);
	    }
	  };
	
	  var _playingListener = function() {
	    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
	    videoContainer.dispatchEvent(videoPlayingEvent);
	  };
	
	  var _pauseListener = function() {
	    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	    videoContainer.dispatchEvent(vimeoPauseEvent);
	  };
	
	  var seek = function(time) {
	    video.player.currentTime = time;
	    video.currentTime = time;
	  };
	
	  var togglePlay = function() {
	    if (video.playing) {
	      video.player.pause();
	      video.playing = false;
	    } else {
	      video.player.play();
	      video.playing = true;
	    }
	  };
	
	  var play = function() {
	    video.player.play();
	    video.playing = true;
	  };
	
	  var pause = function() {
	    video.player.pause();
	    video.playing = false;
	  };
	
	  var fastForward = function(steps) {
	    video.currentTime += steps;
	    video.player.currentTime = video.currentTime;
	  };
	
	  var rewind = function(steps) {
	    video.currentTime -= steps;
	    video.player.currentTime = video.currentTime;
	  };
	  //
	  // Video component public APIs
	  // Outside world can change video component states by accessing to these APIs.
	  //
	  return {
	    init: init,
	    togglePlay: togglePlay,
	    play: play,
	    pause: pause,
	    seek: seek,
	    fastForward: fastForward,
	    rewind: rewind
	  };
	
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = (function() {
	  var createVideoElement = function(videoLink) {
	    var videoContainer = document.createElement('div');
	    videoContainer.className = 'video-container';
	    var videoElement = document.createElement('video');
	    videoElement.setAttribute('src', videoLink);
	    videoContainer.appendChild(videoElement);
	    return videoContainer;
	  };
	
	  return {
	    videoElement: createVideoElement
	  };
	
	})();


/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	* All Viemo Player own event names are here
	*
	* @return {}
	*
	*/
	
	module.exports = {
	  videoReady: 'vimeoVideoReady',
	  play: 'vimeoPlay',
	  playing: 'vimeoPlaying',
	  pause: 'vimeoPause',
	  togglePlay: 'togglePlay',
	  seek: 'vimeoSeek',
	  buffered: 'vimeoBuffered',
	  progressupdate: 'vimeoProgressUpddate',
	  played: 'viemoPlayed',
	  tick: 'vimeoTick',
	  fastForward: 'viemoFastForward',
	  rewind: 'vimeoRewind'
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	/**
	* create a custom event for a HTML element, only the same element can listen to.
	* it's the element's internal events
	* load Polyfill first for IE
	*
	* @param {String} eventName
	* @param {Object} data - data passed with the event
	* @return {CustomEvent} or {Event}
	*
	*/
	
	__webpack_require__(6);
	
	module.exports = function(eventName, data) {
	  if (data) {
	    return new CustomEvent(eventName, {
	      'detail': data
	    });
	  } else {
	    return new Event(eventName);
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = (function () {
	  if (typeof window.CustomEvent === 'function') return false;
	
	  function CustomEvent(event, params) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent('CustomEvent' );
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }
	
	  CustomEvent.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent;
	})();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utility = __webpack_require__(8);
	var progressWrapper = __webpack_require__(9);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	module.exports = (function() {
	  var progressBarChildren = {};
	  var videoDuration = 0;
	  var progressBar;
	  var progressContainer;
	  var playerContainer;
	  var isMouseDown = false;
	
	  var init = function() {
	    progressContainer = progressWrapper.progressWrapper();
	    progressBar = progressContainer.firstElementChild;
	    progressBarChildren.buffered = progressBar.children[0];
	    progressBarChildren.played = progressBar.children[1];
	    progressBarChildren.hoverTimebox = progressBar.children[2];
	    progressBarChildren.timeBox = progressBar.children[3];
	
	    progressBar.addEventListener('mousemove', _mousemoveListener, false);
	    progressBar.addEventListener('mouseleave', _mouseleaveListener, false);
	    progressBar.addEventListener('mousedown', _mousedownListener, false);
	    document.documentElement.addEventListener('mouseup', _mouseupListener, false);
	    return progressContainer;
	  };
	
	  var _mousemoveListener = function(event) {
	    event.stopPropagation();
	    var hoverPosition = _getMousePosition(event, progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = videoDuration * hoverPosition;
	    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    progressBarChildren.hoverTimebox.className = 'hover-timebox';
	  };
	
	  var _mouseleaveListener = function() {
	    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	  };
	
	  var _mousedownListener = function(event) {
	    isMouseDown = true;
	    event.preventDefault();
	    playerContainer = progressContainer.parentNode.parentNode;
	    utility.addClass(playerContainer, 'grabbable');
	    _dispatchSeek(event);
	
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
	    if (!isMouseDown) return;
	    utility.removeClass(playerContainer, 'grabbable');
	    progressBar.addEventListener('mousemove', _mousemoveListener, false);
	
	    // when mouse is up remove mousemove event from documentElement
	    document.documentElement.removeEventListener('mousemove', _mousedownmoveListener);
	  };
	
	  var _mousedownmoveListener = function(event) {
	    var hoverPosition = _getMousePosition(event, progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = videoDuration * hoverPosition;
	    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    progressBarChildren.timeBox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    _dispatchSeek(event);
	  };
	
	  var _dispatchSeek = function(event) {
	    var hoverPosition = _getMousePosition(event, progressBar);
	    var data = { currentTime: videoDuration * hoverPosition };
	    var seekEvent = createCustomEvent(playerEvents.seek, data);
	    progressContainer.dispatchEvent(seekEvent);
	  };
	
	  var _getMousePosition = function(e, progressBar) {
	    var mPosx = 0;
	    var ePosx = 0;
	    var obj = progressBar;
	
	    // get mouse position on document crossbrowser
	    if (!e) e = window.event;
	    if (e.pageX) {
	      mPosx = e.pageX;
	    } else if (e.client) {
	      mPosx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	    }
	    while (obj.offsetParent) {
	      ePosx += obj.offsetLeft;
	      obj = obj.offsetParent;
	    }
	
	    var offset = mPosx - ePosx;
	    var hoverPosition = offset / progressBar.offsetWidth;
	    return hoverPosition;
	  };
	
	  var updatePlayedProgress = function(data) {
	    if (videoDuration <= 0) return;
	    var playedPecentage = data.progress / videoDuration * 100;
	    progressBarChildren.played.style.width = playedPecentage.toFixed(3) + '%';
	    progressBarChildren.timeBox.style.left = playedPecentage.toFixed(3) + '%';
	    progressBarChildren.played.setAttribute('aria-valuenow', data.progress);
	    var playedAriaText = utility.readTime(data.progress) + ' played';
	    progressBarChildren.played.setAttribute('aria-valuetext', playedAriaText);
	  };
	
	  var updateBufferedProgress = function(data) {
	    if (videoDuration <= 0) return;
	    var bufferedPercentage = data.buffered / videoDuration * 100;
	    progressBarChildren.buffered.style.width = bufferedPercentage.toFixed(3) + '%';
	    progressBarChildren.buffered.setAttribute('aria-valuenow', data.buffered);
	    var bufferedAriaText = utility.readTime(data.buffered) + ' buffered';
	    progressBarChildren.buffered.setAttribute('aria-valuetext', bufferedAriaText);
	  };
	
	  var updateTimeBox = function(data) {
	    var currentTime = utility.splitTime(data.currentTime);
	    progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
	  };
	
	  var updateTick = function(data) {
	    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
	  };
	
	  var updateDuration = function(data) {
	    videoDuration = data.duration;
	    // update UIs related with duation
	    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(videoDuration);
	    progressBarChildren.played.setAttribute('aria-valuemax', videoDuration.toFixed(3));
	    progressBarChildren.buffered.setAttribute('aria-valuemax', videoDuration.toFixed(3));
	  };
	
	  var receivePlaying = function() {
	    utility.addClass(progressBarChildren.hoverTimebox, 'invisible');
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
	    updateTick: updateTick,
	    updateDuration: updateDuration,
	    receivePlaying: receivePlaying
	  };
	
	})();


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  splitTime: function(timeInSeconds) {
	    var tm = new Date(timeInSeconds * 1000);
	    var hours = tm.getUTCHours();
	    var minutes = tm.getUTCMinutes();
	    var seconds = tm.getUTCSeconds();
	    if (minutes < 10) {
	      minutes = '0' + minutes;
	    }
	    if (seconds < 10) {
	      seconds = '0' + seconds;
	    }
	    if (hours === 0) {
	      return minutes + ':' + seconds;
	    }
	
	    return hours + ':' + minutes + ':' + seconds;
	  },
	
	  readTime: function(timeInSeconds) {
	    var tm = new Date(timeInSeconds * 1000);
	    var hours = tm.getUTCHours();
	    var minutes = tm.getUTCMinutes();
	    var seconds = tm.getUTCSeconds();
	    var secondString = ' seconds';
	    var minuteString = ' minutes';
	    var hourString = ' hours';
	    if (seconds <= 1) {
	      secondString = ' second';
	    }
	    if (minutes <= 1) {
	      minuteString = ' minute';
	    }
	    if (hours <= 1) {
	      hourString = ' hour';
	    }
	
	    if (timeInSeconds < 60) {
	      return seconds + secondString;
	    } else if (timeInSeconds >= 60 && timeInSeconds < 3600) {
	      return minutes + minuteString + ', ' + seconds + secondString;
	    } else {
	      return hours + hourString + ', ' + minutes + minuteString + ', ' + seconds + secondString;
	    }
	  },
	
	  hasClass: function (el, className) {
	    if (el.classList) {
	      return el.classList.contains(className);
	    } else {
	      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
	    }
	  },
	
	  addClass: function(el, className) {
	    if (el.classList) {
	      el.classList.add(className);
	    } else if (!this.hasClass(el, className)) {
	      el.className += ' ' + className;
	    }
	  },
	
	  removeClass: function(el, className) {
	    if (el.classList) {
	      el.classList.remove(className);
	    } else if (this.hasClass(el, className)) {
	      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
	      el.className=el.className.replace(reg, ' ');
	    }
	  }
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	module.exports = (function() {
	  var buffered = function() {
	    var bufferedDiv = document.createElement('div');
	    bufferedDiv.className = 'buffered';
	    bufferedDiv.setAttribute('role', 'progressbar');
	    bufferedDiv.setAttribute('aria-label', 'buffed');
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var playButtonElement = __webpack_require__(11);
	var createCustomEvent = __webpack_require__(5);
	var playerEvents = __webpack_require__(4);
	
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


/***/ },
/* 11 */
/***/ function(module, exports) {

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
	    button.setAttribute('aria-label', 'play');
	    button.setAttribute('title', 'play');
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	/**
	* Place all publishers here. It also makes logging esay.
	*
	*/
	
	module.exports = (function() {
	  var init = function(playButton, progress, video, playerContainer) {
	    _playbuttonPublishers(playButton);
	    _progressPublishers(progress);
	    _videoPublishers(video);
	    _playerContainerPubs(playerContainer);
	  };
	
	  var _playbuttonPublishers = function(playButton) {
	    playButton.addEventListener(playerEvents.play, function() {
	      eventManager.publish(playerEvents.play);
	    }, false);
	    playButton.addEventListener(playerEvents.pause, function() {
	      eventManager.publish(playerEvents.pause);
	    }, false);
	  };
	
	  var _progressPublishers = function(progress) {
	    progress.addEventListener(playerEvents.seek, function(data) {
	      eventManager.publish(playerEvents.seek, data.detail);
	    }, false);
	  };
	
	  var _videoPublishers = function(video) {
	    video.addEventListener(playerEvents.videoReady, function(data) {
	      eventManager.publish(playerEvents.videoReady, data.detail);
	    }, false);
	    video.addEventListener(playerEvents.buffered, function(data) {
	      eventManager.publish(playerEvents.buffered, data.detail);
	    }, false);
	    video.addEventListener(playerEvents.played, function(data) {
	      eventManager.publish(playerEvents.played, data.detail);
	    }, false);
	    video.addEventListener(playerEvents.tick, function(data) {
	      eventManager.publish(playerEvents.tick, data.detail);
	    }, false);
	    video.addEventListener(playerEvents.playing, function() {
	      eventManager.publish(playerEvents.playing);
	    }, false);
	    video.addEventListener(playerEvents.pause, function() {
	      eventManager.publish(playerEvents.pause);
	    }, false);
	  };
	
	  var _playerContainerPubs = function(playerContainer) {
	    playerContainer.addEventListener(playerEvents.togglePlay, function() {
	      eventManager.publish(playerEvents.togglePlay);
	    }, false);
	    playerContainer.addEventListener(playerEvents.fastForward, function(data) {
	      eventManager.publish(playerEvents.fastForward, data.detail);
	    }, false);
	    playerContainer.addEventListener(playerEvents.rewind, function(data) {
	      eventManager.publish(playerEvents.rewind, data.detail);
	    }, false);
	  };
	
	  return {
	    init: init
	  };
	
	})();


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  events: {},
	
	  subscribe: function (eventName, fn) {
	    this.events[eventName] = this.events[eventName] || [];
	    this.events[eventName].push(fn);
	  },
	
	  unsubsribe: function(eventName, fn) {
	    if (this.events[eventName]) {
	      for (var i = 0; i < this.events[eventName].length; i++) {
	        if (this.events[eventName][i] === fn) {
	          this.events[eventName].splice(i, 1);
	          break;
	        }
	      }
	    }
	  },
	
	  publish: function (eventName, data) {
	    if (this.events[eventName]) {
	      this.events[eventName].forEach(function(fn) {
	        fn(data);
	      });
	    }
	  }
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	module.exports = (function() {
	  var registerSubscribers = function(playButton, progress, video, playerContainer) {
	    _videoSubs(video);
	    _progressSubs(progress);
	    _buttonSubs(playButton);
	  };
	
	  var _videoSubs = function(video) {
	    eventManager.subscribe(playerEvents.play, function() {
	      video.play();
	    });
	    eventManager.subscribe(playerEvents.pause, function() {
	      video.pause();
	    });
	    eventManager.subscribe(playerEvents.seek, function(data) {
	      video.seek(data.currentTime);
	    });
	    eventManager.subscribe(playerEvents.togglePlay, function() {
	      video.togglePlay();
	    });
	    eventManager.subscribe(playerEvents.fastForward, function(data) {
	      video.fastForward(data.steps);
	    });
	    eventManager.subscribe(playerEvents.rewind, function(data) {
	      video.rewind(data.steps);
	    });
	  };
	
	  var _progressSubs = function(progress) {
	    eventManager.subscribe(playerEvents.videoReady, function(data) {
	      progress.updateDuration(data);
	    });
	    eventManager.subscribe(playerEvents.playing, function() {
	      progress.receivePlaying(playerEvents.playing);
	    });
	    eventManager.subscribe(playerEvents.buffered, function(data) {
	      progress.updateBufferedProgress(data);
	    });
	    eventManager.subscribe(playerEvents.played, function(data) {
	      progress.updatePlayedProgress(data);
	    });
	    eventManager.subscribe(playerEvents.tick, function(data) {
	      progress.updateTick(data);
	    });
	  };
	
	  var _buttonSubs = function(playButton) {
	    eventManager.subscribe(playerEvents.playing, function() {
	      playButton.togglePlay(playerEvents.playing);
	    });
	    eventManager.subscribe(playerEvents.pause, function() {
	      playButton.togglePlay(playerEvents.pause);
	    });
	  };
	
	
	  return {
	    init: registerSubscribers
	  };
	})();


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZTM4MmQzOTdhNDI1NTc3NjkzOGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ1JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDMUVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTs7QUFFQSx1QkFBc0I7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTs7QUFFQSwrQkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3BIRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNoQkQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixZQUFXLFlBQVksS0FBSztBQUM1QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLElBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7QUN0QkE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ2REOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDaEtEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyREQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JFRDs7QUFFQTtBQUNBLGFBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0Esc0JBQXFCLG1DQUFtQztBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTs7Ozs7OztBQzVCQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLEVBQUMiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBlMzgyZDM5N2E0MjU1Nzc2OTM4ZlxuICoqLyIsIi8vIHJlcXVpcmUoJyFzdHlsZSFjc3MhLi9jc3Mvc3R5bGUuY3NzJyk7XG4ndXNlIHN0cmljdCc7XG52YXIgcGxheWVyQ29udGFpbmVyID0gcmVxdWlyZSgnLi9lbGVtZW50cy9QbGF5ZXJDb250YWluZXJFbGVtZW50Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHZpZGVvTGluayA9ICdodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNzY5Nzk4NzEuaGQubXA0P3M9NzAwYmY4ZjMwZjhmODExNGNjMzcyZTk0YzQxNTZhYWYmcHJvZmlsZV9pZD0xMTMnO1xuICAvLyB2YXIgdmlkZW9MaW5rID0gJy9BcHBsaWNhdGlvbnMvTUFNUC9odGRvY3MvdmlkZW9jb2xsYWJvcmF0b3J5L29wdGltaXplZFZpZGVvcy92Yy01NDMtMi5tcDQnO1xuICB2YXIgcGxheWVyID0gcGxheWVyQ29udGFpbmVyLmluaXQodmlkZW9MaW5rKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChwbGF5ZXIpO1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBwLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHZpZGVvQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9WaWRlbycpO1xudmFyIHByb2dyZXNzQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Qcm9ncmVzc0JhcicpO1xudmFyIHBsYXlCdXR0b25Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BsYXlCdXR0b24nKTtcbnZhciBwdWJsaXNoZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMnKTtcbnZhciBzdWJzY3JpYmVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXI7XG4gIHZhciBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gIHZhciByaWdodEFycm93Q291bnQgPSAwO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgcGxheWVyQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVyQ29udGFpbmVyLmNsYXNzTmFtZSA9ICdwbGF5ZXItY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW8gPSB2aWRlb0NvbXBvbmVudC5pbml0KHZpZGVvTGluayk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvKTtcblxuICAgIHZhciBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gICAgdmFyIHBsYXlCdG4gPSBwbGF5QnV0dG9uQ29tcG9uZW50LmluaXQoKTtcbiAgICBjb250cm9scy5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0NvbXBvbmVudC5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgICBwdWJsaXNoZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHZpZGVvLCBwbGF5ZXJDb250YWluZXIpO1xuICAgIHN1YnNjcmliZXJzLmluaXQocGxheUJ1dHRvbkNvbXBvbmVudCwgcHJvZ3Jlc3NDb21wb25lbnQsIHZpZGVvQ29tcG9uZW50LCBwbGF5ZXJDb250YWluZXIpO1xuXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfa2V5ZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgX2tleXVwTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIHJldHVybiBwbGF5ZXJDb250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9rZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2aWRlb1RvZ2dsZVBsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50b2dnbGVQbGF5KTtcbiAgICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVG9nZ2xlUGxheUV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHJpZ2h0QXJyb3dDb3VudCArPSAxO1xuICAgICAgdmFyIHJld2luZERhdGEgPSB7IHN0ZXBzOiByaWdodEFycm93Q291bnQgfTtcbiAgICAgIHZhciByZXdpbmRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5yZXdpbmQsIHJld2luZERhdGEpO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQocmV3aW5kRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgbGVmdEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZERhdGEgPSB7IHN0ZXBzOiBsZWZ0QXJyb3dDb3VudCB9O1xuICAgICAgdmFyIGZhc3RGb3J3YXJkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZhc3RGb3J3YXJkRGF0YSk7XG4gICAgICBwbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChmYXN0Rm9yd2FyZEV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9rZXl1cExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XG4gICAgICBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJDb250YWluZXJFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmlkZW9FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvVmlkZW9FbGVtZW50Jyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHZpZGVvID0ge1xuICAgIGR1cmF0aW9uOiAwLFxuICAgIGN1cnJlbnRUaW1lOiAwLFxuICAgIGJ1ZmZlcmVkOiAwLFxuICAgIHBsYXlpbmc6IGZhbHNlXG4gIH07XG4gIHZhciB2aWRlb0NvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZpZGVvQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICAgIHZpZGVvLnBsYXllciA9IHZpZGVvQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9sb2FkZWRkYXRhTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5kdXJhdGlvbiA9IHZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuXG4gICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiB2aWRlby5wbGF5ZXIuYnVmZmVyZWQuZW5kKDApIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3RpbWV1cGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuICAgIHZhciB0aWNrRGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvVGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRpY2ssIHRpY2tEYXRhKTtcbiAgICB2aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB2aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1BsYXllZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXllZCwgcGxheWVkUHJvZ3Jlc3NEYXRhKTtcbiAgICB2aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvUGxheWVkRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZCA9IHZpZGVvLnBsYXllci5idWZmZXJlZDtcbiAgICBpZiAoYnVmZmVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGJ1ZmZlcmVkRW5kID0gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpO1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBidWZmZXJlZEVuZCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9wbGF5aW5nTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlkZW9QbGF5aW5nRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXlpbmdFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9wYXVzZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBzZWVrID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9O1xuXG4gIHZhciB0b2dnbGVQbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHZpZGVvLnBsYXllci5wYXVzZSgpO1xuICAgICAgdmlkZW8ucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdmlkZW8ucGxheWluZyA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBsYXkoKTtcbiAgICB2aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgcGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICB2aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIGZhc3RGb3J3YXJkID0gZnVuY3Rpb24oc3RlcHMpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgcmV3aW5kID0gZnVuY3Rpb24oc3RlcHMpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSAtPSBzdGVwcztcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZTtcbiAgfTtcbiAgLy9cbiAgLy8gVmlkZW8gY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSB2aWRlbyBjb21wb25lbnQgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdG9nZ2xlUGxheTogdG9nZ2xlUGxheSxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBzZWVrOiBzZWVrLFxuICAgIGZhc3RGb3J3YXJkOiBmYXN0Rm9yd2FyZCxcbiAgICByZXdpbmQ6IHJld2luZFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVZpZGVvRWxlbWVudCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZhciB2aWRlb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZpZGVvQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd2aWRlby1jb250YWluZXInO1xuICAgIHZhciB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIHZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHZpZGVvTGluayk7XG4gICAgdmlkZW9Db250YWluZXIuYXBwZW5kQ2hpbGQodmlkZW9FbGVtZW50KTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB2aWRlb0VsZW1lbnQ6IGNyZWF0ZVZpZGVvRWxlbWVudFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9WaWRlb0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuKiBBbGwgVmllbW8gUGxheWVyIG93biBldmVudCBuYW1lcyBhcmUgaGVyZVxuKlxuKiBAcmV0dXJuIHt9XG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmlkZW9SZWFkeTogJ3ZpbWVvVmlkZW9SZWFkeScsXG4gIHBsYXk6ICd2aW1lb1BsYXknLFxuICBwbGF5aW5nOiAndmltZW9QbGF5aW5nJyxcbiAgcGF1c2U6ICd2aW1lb1BhdXNlJyxcbiAgdG9nZ2xlUGxheTogJ3RvZ2dsZVBsYXknLFxuICBzZWVrOiAndmltZW9TZWVrJyxcbiAgYnVmZmVyZWQ6ICd2aW1lb0J1ZmZlcmVkJyxcbiAgcHJvZ3Jlc3N1cGRhdGU6ICd2aW1lb1Byb2dyZXNzVXBkZGF0ZScsXG4gIHBsYXllZDogJ3ZpZW1vUGxheWVkJyxcbiAgdGljazogJ3ZpbWVvVGljaycsXG4gIGZhc3RGb3J3YXJkOiAndmllbW9GYXN0Rm9yd2FyZCcsXG4gIHJld2luZDogJ3ZpbWVvUmV3aW5kJ1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBjcmVhdGUgYSBjdXN0b20gZXZlbnQgZm9yIGEgSFRNTCBlbGVtZW50LCBvbmx5IHRoZSBzYW1lIGVsZW1lbnQgY2FuIGxpc3RlbiB0by5cbiogaXQncyB0aGUgZWxlbWVudCdzIGludGVybmFsIGV2ZW50c1xuKiBsb2FkIFBvbHlmaWxsIGZpcnN0IGZvciBJRVxuKlxuKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4qIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBwYXNzZWQgd2l0aCB0aGUgZXZlbnRcbiogQHJldHVybiB7Q3VzdG9tRXZlbnR9IG9yIHtFdmVudH1cbipcbiovXG5cbnJlcXVpcmUoJy4vUG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgJ2RldGFpbCc6IGRhdGFcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnICk7XG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICByZXR1cm4gZXZ0O1xuICB9XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xudmFyIHByb2dyZXNzV3JhcHBlciA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9ncmVzc0JhckNoaWxkcmVuID0ge307XG4gIHZhciB2aWRlb0R1cmF0aW9uID0gMDtcbiAgdmFyIHByb2dyZXNzQmFyO1xuICB2YXIgcHJvZ3Jlc3NDb250YWluZXI7XG4gIHZhciBwbGF5ZXJDb250YWluZXI7XG4gIHZhciBpc01vdXNlRG93biA9IGZhbHNlO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3NDb250YWluZXIgPSBwcm9ncmVzc1dyYXBwZXIucHJvZ3Jlc3NXcmFwcGVyKCk7XG4gICAgcHJvZ3Jlc3NCYXIgPSBwcm9ncmVzc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMF07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQgPSBwcm9ncmVzc0Jhci5jaGlsZHJlblsxXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzJdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzNdO1xuXG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZWxlYXZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfbW91c2Vkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9tb3VzZXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gcHJvZ3Jlc3NDb250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9tb3VzZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICB9O1xuXG4gIHZhciBfbW91c2VsZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBwcm9ncmVzc0NvbnRhaW5lci5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcblxuICAgIC8vIG9ubHkgYWRkIG1vdXNlbW92ZSB0byBkb2N1bWVudCB3aGVuIG1vdXNlIGRvd24gdG8gcHJvZ3Jlc3NCYXIgaGFwcGVuZWRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZXVwTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzTW91c2VEb3duKSByZXR1cm47XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIC8vIHdoZW4gbW91c2UgaXMgdXAgcmVtb3ZlIG1vdXNlbW92ZSBldmVudCBmcm9tIGRvY3VtZW50RWxlbWVudFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bm1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgdmFyIF9kaXNwYXRjaFNlZWsgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICB2YXIgZGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uIH07XG4gICAgdmFyIHNlZWtFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5zZWVrLCBkYXRhKTtcbiAgICBwcm9ncmVzc0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHNlZWtFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgdXBkYXRlUGxheWVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHZpZGVvRHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICAgIHZhciBwbGF5ZWRQZWNlbnRhZ2UgPSBkYXRhLnByb2dyZXNzIC8gdmlkZW9EdXJhdGlvbiAqIDEwMDtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5zdHlsZS5sZWZ0ID0gcGxheWVkUGVjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5wcm9ncmVzcyk7XG4gICAgdmFyIHBsYXllZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLnByb2dyZXNzKSArICcgcGxheWVkJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgcGxheWVkQXJpYVRleHQpO1xuICB9O1xuXG4gIHZhciB1cGRhdGVCdWZmZXJlZFByb2dyZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh2aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgYnVmZmVyZWRQZXJjZW50YWdlID0gZGF0YS5idWZmZXJlZCAvIHZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zdHlsZS53aWR0aCA9IGJ1ZmZlcmVkUGVyY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5idWZmZXJlZCk7XG4gICAgdmFyIGJ1ZmZlcmVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEuYnVmZmVyZWQpICsgJyBidWZmZXJlZCc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgYnVmZmVyZWRBcmlhVGV4dCk7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVRpbWVCb3ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGN1cnJlbnRUaW1lO1xuICB9O1xuXG4gIHZhciB1cGRhdGVUaWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfTtcblxuICB2YXIgdXBkYXRlRHVyYXRpb24gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmlkZW9EdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG4gICAgLy8gdXBkYXRlIFVJcyByZWxhdGVkIHdpdGggZHVhdGlvblxuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZSh2aWRlb0R1cmF0aW9uKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCB2aWRlb0R1cmF0aW9uLnRvRml4ZWQoMykpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgfTtcblxuICB2YXIgcmVjZWl2ZVBsYXlpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LCAnaW52aXNpYmxlJyk7XG4gIH07XG5cbiAgLy9cbiAgLy8gUHJvZ3Jlc3MgY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSBwcm9ncmVzcyBzdGF0ZXMgYnkgYWNjZXNzaW5nIHRvIHRoZXNlIEFQSXMuXG4gIC8vXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogdXBkYXRlUGxheWVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlQnVmZmVyZWRQcm9ncmVzczogdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyxcbiAgICB1cGRhdGVUaW1lQm94OiB1cGRhdGVUaW1lQm94LFxuICAgIHVwZGF0ZVRpY2s6IHVwZGF0ZVRpY2ssXG4gICAgdXBkYXRlRHVyYXRpb246IHVwZGF0ZUR1cmF0aW9uLFxuICAgIHJlY2VpdmVQbGF5aW5nOiByZWNlaXZlUGxheWluZ1xuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgfVxuICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgIH1cbiAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgfSxcblxuICByZWFkVGltZTogZnVuY3Rpb24odGltZUluU2Vjb25kcykge1xuICAgIHZhciB0bSA9IG5ldyBEYXRlKHRpbWVJblNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgaG91cnMgPSB0bS5nZXRVVENIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdG0uZ2V0VVRDTWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gdG0uZ2V0VVRDU2Vjb25kcygpO1xuICAgIHZhciBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZHMnO1xuICAgIHZhciBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZXMnO1xuICAgIHZhciBob3VyU3RyaW5nID0gJyBob3Vycyc7XG4gICAgaWYgKHNlY29uZHMgPD0gMSkge1xuICAgICAgc2Vjb25kU3RyaW5nID0gJyBzZWNvbmQnO1xuICAgIH1cbiAgICBpZiAobWludXRlcyA8PSAxKSB7XG4gICAgICBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZSc7XG4gICAgfVxuICAgIGlmIChob3VycyA8PSAxKSB7XG4gICAgICBob3VyU3RyaW5nID0gJyBob3VyJztcbiAgICB9XG5cbiAgICBpZiAodGltZUluU2Vjb25kcyA8IDYwKSB7XG4gICAgICByZXR1cm4gc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2UgaWYgKHRpbWVJblNlY29uZHMgPj0gNjAgJiYgdGltZUluU2Vjb25kcyA8IDM2MDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBob3VycyArIGhvdXJTdHJpbmcgKyAnLCAnICsgbWludXRlcyArIG1pbnV0ZVN0cmluZyArICcsICcgKyBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH1cbiAgfSxcblxuICBoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIWVsLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpKTtcbiAgICB9XG4gIH0sXG5cbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKTtcbiAgICAgIGVsLmNsYXNzTmFtZT1lbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJyk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1V0aWxpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGJ1ZmZlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnVmZmVyZWREaXYuY2xhc3NOYW1lID0gJ2J1ZmZlcmVkJztcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnYnVmZmVkJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIGJ1ZmZlcmVkRGl2O1xuICB9O1xuXG4gIHZhciBwbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXllZCcpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciBob3ZlclRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiBob3ZlclRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIHRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIHRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVQb3AgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lUG9wRGl2LmNsYXNzTmFtZSA9ICd0aW1lLXBvcCc7XG4gICAgdGltZVBvcERpdi5pbm5lckhUTUwgPSB0aW1lO1xuICAgIHJldHVybiB0aW1lUG9wRGl2O1xuICB9O1xuXG4gIHZhciBjcmVhdGVQcm9ncmVzc1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWRFbGVtZW50ID0gYnVmZmVyZWQoKTtcbiAgICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICAgIHZhciBob3ZlclRpbWVib3hFbGVtZW50ID0gaG92ZXJUaW1lYm94KCk7XG4gICAgdmFyIHRpbWVCb3hFbGVtZW50ID0gdGltZWJveCgpO1xuICAgIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3Byb2dyZXNzJztcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGhvdmVyVGltZWJveEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZCh0aW1lQm94RWxlbWVudCk7XG4gICAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzV3JhcHBlci5jbGFzc05hbWUgPSAncHJvZ3Jlc3Mtd3JhcHBlcic7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmFwcGVuZENoaWxkKHByb2dyZXNzRWxlbWVudCk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyOiBjcmVhdGVQcm9ncmVzc1dyYXBwZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGxheUJ1dHRvbkVsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudCcpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICAncGxheWluZyc6IGZhbHNlXG4gIH07XG4gIHZhciBwbGF5YnV0dG9uO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgcGxheWJ1dHRvbiA9IHBsYXlCdXR0b25FbGVtZW50LmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICBwbGF5YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2J1dHRvbkNsaWNrTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gcGxheWJ1dHRvbjtcbiAgfTtcblxuICB2YXIgX2J1dHRvbkNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoc3RhdGUucGxheWluZykge1xuICAgICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgICBwbGF5YnV0dG9uLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpbWVvUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXkpO1xuICAgICAgcGxheWJ1dHRvbi5kaXNwYXRjaEV2ZW50KHZpbWVvUGxheUV2ZW50KTtcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdG9nZ2xlID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgdmFyIHBsYXlJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICB2YXIgcGF1c2VJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblsxXTtcbiAgICBpZiAoZXZlbnROYW1lID09PSBwbGF5ZXJFdmVudHMucGF1c2UpIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5Jyk7XG4gICAgICAvLyBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGxheScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgc3RhdGUucGxheWluZyA9IHRydWU7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwYXVzZScpO1xuICAgICAgLy8gcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BhdXNlJyk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB0b2dnbGVQbGF5OiB0b2dnbGVcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgICB2YXIgcGxheVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdwb2x5Z29uJyk7XG4gICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsICcxLDAgMjAsMTAgMSwyMCcpO1xuICAgIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgcGxheUJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5U1ZHKTtcbiAgICByZXR1cm4gcGxheUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc05hbWUgPSAncGF1c2UtaWNvbic7XG4gICAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChsZWZ0UmVjdCk7XG4gICAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChyaWdodFJlY3QpO1xuICAgIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcbiAgICByZXR1cm4gcGF1c2VCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ3BsYXknO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheScpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BsYXknKTtcbiAgICB2YXIgcGxheUJ0biA9IGNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHBhdXNlQnRuID0gY3JlYXRlUGF1c2VCdXR0b24oKTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQocGF1c2VCdG4pO1xuICAgIHJldHVybiBidXR0b247XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVQbGF5QnV0dG9uOiBjcmVhdGVCdXR0b25cbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9QdWJTdWInKTtcblxuLyoqXG4qIFBsYWNlIGFsbCBwdWJsaXNoZXJzIGhlcmUuIEl0IGFsc28gbWFrZXMgbG9nZ2luZyBlc2F5LlxuKlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBpbml0ID0gZnVuY3Rpb24ocGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvLCBwbGF5ZXJDb250YWluZXIpIHtcbiAgICBfcGxheWJ1dHRvblB1Ymxpc2hlcnMocGxheUJ1dHRvbik7XG4gICAgX3Byb2dyZXNzUHVibGlzaGVycyhwcm9ncmVzcyk7XG4gICAgX3ZpZGVvUHVibGlzaGVycyh2aWRlbyk7XG4gICAgX3BsYXllckNvbnRhaW5lclB1YnMocGxheWVyQ29udGFpbmVyKTtcbiAgfTtcblxuICB2YXIgX3BsYXlidXR0b25QdWJsaXNoZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbikge1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1B1Ymxpc2hlcnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIHByb2dyZXNzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5zZWVrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfdmlkZW9QdWJsaXNoZXJzID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXllZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudGljaywgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9wbGF5ZXJDb250YWluZXJQdWJzID0gZnVuY3Rpb24ocGxheWVyQ29udGFpbmVyKSB7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXkpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucmV3aW5kLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucmV3aW5kLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHVibGlzaGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBldmVudHM6IHt9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9LFxuXG4gIHVuc3Vic3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHB1Ymxpc2g6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnaXN0ZXJTdWJzY3JpYmVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbywgcGxheWVyQ29udGFpbmVyKSB7XG4gICAgX3ZpZGVvU3Vicyh2aWRlbyk7XG4gICAgX3Byb2dyZXNzU3Vicyhwcm9ncmVzcyk7XG4gICAgX2J1dHRvblN1YnMocGxheUJ1dHRvbik7XG4gIH07XG5cbiAgdmFyIF92aWRlb1N1YnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uc2VlayhkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50b2dnbGVQbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uZmFzdEZvcndhcmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucmV3aW5kLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5yZXdpbmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1N1YnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZUR1cmF0aW9uKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvZ3Jlc3MucmVjZWl2ZVBsYXlpbmcocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX2J1dHRvblN1YnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0pO1xuICB9O1xuXG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiByZWdpc3RlclN1YnNjcmliZXJzXG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==