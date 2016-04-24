(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("player", [], factory);
	else if(typeof exports === 'object')
		exports["player"] = factory();
	else
		root["player"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	'use strict';
	var playerContainer = __webpack_require__(1);
	
	var app = function(videoLink, width, height) {
	  var player = playerContainer.init(videoLink, width, height);
	  document.getElementsByTagName('body')[0].appendChild(player);
	  return player;
	};
	
	module.exports = app;


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
	var utility = __webpack_require__(8);
	
	module.exports = (function() {
	  var playerContainer;
	  var playerControls;
	  var leftArrowCount = 0;
	  var rightArrowCount = 0;
	  var mouseStopTimer;
	
	  var init = function(videoLink, width, height) {
	    playerContainer = document.createElement('div');
	    playerContainer.className = 'player-container';
	    var video = videoComponent.init(videoLink);
	    playerContainer.style.width = width;
	    playerContainer.style.height = height;
	    playerContainer.appendChild(video);
	
	    playerControls = document.createElement('div');
	    playerControls.className = 'controls';
	    var playBtn = playButtonComponent.init();
	    playerControls.appendChild(playBtn);
	    var progress = progressComponent.init();
	    playerControls.appendChild(progress);
	    playerContainer.appendChild(playerControls);
	
	    // register pubs/subs here.
	    publishers.init(playBtn, progress, video, playerContainer);
	    subscribers.init(playButtonComponent, progressComponent, videoComponent);
	
	    document.documentElement.addEventListener('keydown', _keydownListener, false);
	    document.documentElement.addEventListener('keyup', _keyupListener, false);
	    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	    playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
	    playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
	    playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
	
	    return playerContainer;
	  };
	
	  var _mouseLeaveListner = function() {
	    utility.addClass(playerControls, 'hidden');
	    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseLeaveListener = function() {
	    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseEnterListener = function() {
	    utility.removeClass(playerControls, 'hidden');
	    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
	    playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _mousemoveListner = function() {
	    if (mouseStopTimer) {
	      window.clearTimeout(mouseStopTimer);
	      utility.removeClass(playerControls, 'hidden');
	    }
	    mouseStopTimer = window.setTimeout(function() {
	      utility.addClass(playerControls, 'hidden');
	    }, 2000);
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
	  },
	
	  generateRandomId: function(idLength) {
	    var id = '';
	    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	    for (var i = 1; i <= idLength; i++) {
	        var randPos = Math.floor(Math.random() * charSet.length);
	        id += charSet[randPos];
	    }
	    return id;
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
	
	module.exports = (function() {
	  var events = {};
	
	  var init = function() {
	    events = {};
	  };
	
	  var subscribe = function(eventName, fn) {
	    events[eventName] = events[eventName] || [];
	    events[eventName].push(fn);
	  };
	
	  var unsubscribe = function(eventName, fn) {
	    if (events[eventName]) {
	      for (var i = 0; i < events[eventName].length; i++) {
	        if (events[eventName][i] === fn) {
	          events[eventName].splice(i, 1);
	          break;
	        }
	      }
	    }
	  };
	
	  var publish = function(eventName, data) {
	    if (events[eventName]) {
	      events[eventName].forEach(function(fn) {
	        fn(data);
	      });
	    }
	  };
	
	  return {
	    subscribe: subscribe,
	    publish: publish,
	    unsubscribe: unsubscribe,
	    init: init
	  };
	})();


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	module.exports = (function() {
	  var registerSubscribers = function(playButton, progress, video) {
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
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBkMjM4YWRjNzYwOTJhZmFjYWQxYiIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUM1R0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBOztBQUVBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBOztBQUVBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDcEhEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ2hCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFlBQVcsWUFBWSxLQUFLO0FBQzVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDZEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNoS0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyREQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUN2Q0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUMiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJwbGF5ZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicGxheWVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInBsYXllclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgZDIzOGFkYzc2MDkyYWZhY2FkMWJcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyQ29udGFpbmVyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BsYXllcicpO1xuXG52YXIgYXBwID0gZnVuY3Rpb24odmlkZW9MaW5rLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBwbGF5ZXIgPSBwbGF5ZXJDb250YWluZXIuaW5pdCh2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHBsYXllcik7XG4gIHJldHVybiBwbGF5ZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBwLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHZpZGVvQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9WaWRlbycpO1xudmFyIHByb2dyZXNzQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Qcm9ncmVzc0JhcicpO1xudmFyIHBsYXlCdXR0b25Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BsYXlCdXR0b24nKTtcbnZhciBwdWJsaXNoZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMnKTtcbnZhciBzdWJzY3JpYmVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcGxheWVyQ29udGFpbmVyO1xuICB2YXIgcGxheWVyQ29udHJvbHM7XG4gIHZhciBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gIHZhciByaWdodEFycm93Q291bnQgPSAwO1xuICB2YXIgbW91c2VTdG9wVGltZXI7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZXJDb250YWluZXIuY2xhc3NOYW1lID0gJ3BsYXllci1jb250YWluZXInO1xuICAgIHZhciB2aWRlbyA9IHZpZGVvQ29tcG9uZW50LmluaXQodmlkZW9MaW5rKTtcbiAgICBwbGF5ZXJDb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICBwbGF5ZXJDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICBwbGF5ZXJDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllckNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gICAgdmFyIHBsYXlCdG4gPSBwbGF5QnV0dG9uQ29tcG9uZW50LmluaXQoKTtcbiAgICBwbGF5ZXJDb250cm9scy5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0NvbXBvbmVudC5pbml0KCk7XG4gICAgcGxheWVyQ29udHJvbHMuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJDb250cm9scyk7XG5cbiAgICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgICBwdWJsaXNoZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHZpZGVvLCBwbGF5ZXJDb250YWluZXIpO1xuICAgIHN1YnNjcmliZXJzLmluaXQocGxheUJ1dHRvbkNvbXBvbmVudCwgcHJvZ3Jlc3NDb21wb25lbnQsIHZpZGVvQ29tcG9uZW50KTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgX2tleWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIF9rZXl1cExpc3RlbmVyLCBmYWxzZSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VMZWF2ZUxpc3RuZXIsIGZhbHNlKTtcbiAgICBwbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcGxheWVyQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9jb250cm9sc01vdXNlTGVhdmVMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHBsYXllckNvbnRhaW5lcjtcbiAgfTtcblxuICB2YXIgX21vdXNlTGVhdmVMaXN0bmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250cm9scywgJ2hpZGRlbicpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfY29udHJvbHNNb3VzZUxlYXZlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250cm9scywgJ2hpZGRlbicpO1xuICAgIGlmIChtb3VzZVN0b3BUaW1lcikgd2luZG93LmNsZWFyVGltZW91dChtb3VzZVN0b3BUaW1lcik7XG4gICAgcGxheWVyQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZW1vdmVMaXN0bmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3MocGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9XG4gICAgbW91c2VTdG9wVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHV0aWxpdHkuYWRkQ2xhc3MocGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9LCAyMDAwKTtcbiAgfTtcblxuICB2YXIgX2tleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZpZGVvVG9nZ2xlUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXkpO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9Ub2dnbGVQbGF5RXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNykge1xuICAgICAgcmlnaHRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgcmV3aW5kRGF0YSA9IHsgc3RlcHM6IHJpZ2h0QXJyb3dDb3VudCB9O1xuICAgICAgdmFyIHJld2luZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnJld2luZCwgcmV3aW5kRGF0YSk7XG4gICAgICBwbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChyZXdpbmRFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XG4gICAgICBsZWZ0QXJyb3dDb3VudCArPSAxO1xuICAgICAgdmFyIGZhc3RGb3J3YXJkRGF0YSA9IHsgc3RlcHM6IGxlZnRBcnJvd0NvdW50IH07XG4gICAgICB2YXIgZmFzdEZvcndhcmRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZmFzdEZvcndhcmREYXRhKTtcbiAgICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGZhc3RGb3J3YXJkRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2tleXVwTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNykge1xuICAgICAgcmlnaHRBcnJvd0NvdW50ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIGxlZnRBcnJvd0NvdW50ID0gMDtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUGxheWVyLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmlkZW9FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvVmlkZW9FbGVtZW50Jyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHZpZGVvID0ge1xuICAgIGR1cmF0aW9uOiAwLFxuICAgIGN1cnJlbnRUaW1lOiAwLFxuICAgIGJ1ZmZlcmVkOiAwLFxuICAgIHBsYXlpbmc6IGZhbHNlXG4gIH07XG4gIHZhciB2aWRlb0NvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZpZGVvQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICAgIHZpZGVvLnBsYXllciA9IHZpZGVvQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9sb2FkZWRkYXRhTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5kdXJhdGlvbiA9IHZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuXG4gICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiB2aWRlby5wbGF5ZXIuYnVmZmVyZWQuZW5kKDApIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3RpbWV1cGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuICAgIHZhciB0aWNrRGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvVGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRpY2ssIHRpY2tEYXRhKTtcbiAgICB2aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB2aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1BsYXllZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXllZCwgcGxheWVkUHJvZ3Jlc3NEYXRhKTtcbiAgICB2aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvUGxheWVkRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZCA9IHZpZGVvLnBsYXllci5idWZmZXJlZDtcbiAgICBpZiAoYnVmZmVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGJ1ZmZlcmVkRW5kID0gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpO1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBidWZmZXJlZEVuZCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9wbGF5aW5nTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlkZW9QbGF5aW5nRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXlpbmdFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9wYXVzZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBzZWVrID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9O1xuXG4gIHZhciB0b2dnbGVQbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHZpZGVvLnBsYXllci5wYXVzZSgpO1xuICAgICAgdmlkZW8ucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdmlkZW8ucGxheWluZyA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciBwbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBsYXkoKTtcbiAgICB2aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgcGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICB2aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIGZhc3RGb3J3YXJkID0gZnVuY3Rpb24oc3RlcHMpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgcmV3aW5kID0gZnVuY3Rpb24oc3RlcHMpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSAtPSBzdGVwcztcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB2aWRlby5jdXJyZW50VGltZTtcbiAgfTtcbiAgLy9cbiAgLy8gVmlkZW8gY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSB2aWRlbyBjb21wb25lbnQgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdG9nZ2xlUGxheTogdG9nZ2xlUGxheSxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBzZWVrOiBzZWVrLFxuICAgIGZhc3RGb3J3YXJkOiBmYXN0Rm9yd2FyZCxcbiAgICByZXdpbmQ6IHJld2luZFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVZpZGVvRWxlbWVudCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZhciB2aWRlb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZpZGVvQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd2aWRlby1jb250YWluZXInO1xuICAgIHZhciB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIHZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHZpZGVvTGluayk7XG4gICAgdmlkZW9Db250YWluZXIuYXBwZW5kQ2hpbGQodmlkZW9FbGVtZW50KTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB2aWRlb0VsZW1lbnQ6IGNyZWF0ZVZpZGVvRWxlbWVudFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9WaWRlb0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuKiBBbGwgVmllbW8gUGxheWVyIG93biBldmVudCBuYW1lcyBhcmUgaGVyZVxuKlxuKiBAcmV0dXJuIHt9XG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmlkZW9SZWFkeTogJ3ZpbWVvVmlkZW9SZWFkeScsXG4gIHBsYXk6ICd2aW1lb1BsYXknLFxuICBwbGF5aW5nOiAndmltZW9QbGF5aW5nJyxcbiAgcGF1c2U6ICd2aW1lb1BhdXNlJyxcbiAgdG9nZ2xlUGxheTogJ3RvZ2dsZVBsYXknLFxuICBzZWVrOiAndmltZW9TZWVrJyxcbiAgYnVmZmVyZWQ6ICd2aW1lb0J1ZmZlcmVkJyxcbiAgcHJvZ3Jlc3N1cGRhdGU6ICd2aW1lb1Byb2dyZXNzVXBkZGF0ZScsXG4gIHBsYXllZDogJ3ZpZW1vUGxheWVkJyxcbiAgdGljazogJ3ZpbWVvVGljaycsXG4gIGZhc3RGb3J3YXJkOiAndmllbW9GYXN0Rm9yd2FyZCcsXG4gIHJld2luZDogJ3ZpbWVvUmV3aW5kJ1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBjcmVhdGUgYSBjdXN0b20gZXZlbnQgZm9yIGEgSFRNTCBlbGVtZW50LCBvbmx5IHRoZSBzYW1lIGVsZW1lbnQgY2FuIGxpc3RlbiB0by5cbiogaXQncyB0aGUgZWxlbWVudCdzIGludGVybmFsIGV2ZW50c1xuKiBsb2FkIFBvbHlmaWxsIGZpcnN0IGZvciBJRVxuKlxuKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4qIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBwYXNzZWQgd2l0aCB0aGUgZXZlbnRcbiogQHJldHVybiB7Q3VzdG9tRXZlbnR9IG9yIHtFdmVudH1cbipcbiovXG5cbnJlcXVpcmUoJy4vUG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgJ2RldGFpbCc6IGRhdGFcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnICk7XG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICByZXR1cm4gZXZ0O1xuICB9XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xudmFyIHByb2dyZXNzV3JhcHBlciA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9ncmVzc0JhckNoaWxkcmVuID0ge307XG4gIHZhciB2aWRlb0R1cmF0aW9uID0gMDtcbiAgdmFyIHByb2dyZXNzQmFyO1xuICB2YXIgcHJvZ3Jlc3NDb250YWluZXI7XG4gIHZhciBwbGF5ZXJDb250YWluZXI7XG4gIHZhciBpc01vdXNlRG93biA9IGZhbHNlO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3NDb250YWluZXIgPSBwcm9ncmVzc1dyYXBwZXIucHJvZ3Jlc3NXcmFwcGVyKCk7XG4gICAgcHJvZ3Jlc3NCYXIgPSBwcm9ncmVzc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMF07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQgPSBwcm9ncmVzc0Jhci5jaGlsZHJlblsxXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzJdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzNdO1xuXG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZWxlYXZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfbW91c2Vkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9tb3VzZXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gcHJvZ3Jlc3NDb250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9tb3VzZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICB9O1xuXG4gIHZhciBfbW91c2VsZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBwcm9ncmVzc0NvbnRhaW5lci5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcblxuICAgIC8vIG9ubHkgYWRkIG1vdXNlbW92ZSB0byBkb2N1bWVudCB3aGVuIG1vdXNlIGRvd24gdG8gcHJvZ3Jlc3NCYXIgaGFwcGVuZWRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZXVwTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzTW91c2VEb3duKSByZXR1cm47XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIC8vIHdoZW4gbW91c2UgaXMgdXAgcmVtb3ZlIG1vdXNlbW92ZSBldmVudCBmcm9tIGRvY3VtZW50RWxlbWVudFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bm1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgdmFyIF9kaXNwYXRjaFNlZWsgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICB2YXIgZGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uIH07XG4gICAgdmFyIHNlZWtFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5zZWVrLCBkYXRhKTtcbiAgICBwcm9ncmVzc0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHNlZWtFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgdXBkYXRlUGxheWVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHZpZGVvRHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICAgIHZhciBwbGF5ZWRQZWNlbnRhZ2UgPSBkYXRhLnByb2dyZXNzIC8gdmlkZW9EdXJhdGlvbiAqIDEwMDtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5zdHlsZS5sZWZ0ID0gcGxheWVkUGVjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5wcm9ncmVzcyk7XG4gICAgdmFyIHBsYXllZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLnByb2dyZXNzKSArICcgcGxheWVkJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgcGxheWVkQXJpYVRleHQpO1xuICB9O1xuXG4gIHZhciB1cGRhdGVCdWZmZXJlZFByb2dyZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh2aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgYnVmZmVyZWRQZXJjZW50YWdlID0gZGF0YS5idWZmZXJlZCAvIHZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zdHlsZS53aWR0aCA9IGJ1ZmZlcmVkUGVyY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5idWZmZXJlZCk7XG4gICAgdmFyIGJ1ZmZlcmVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEuYnVmZmVyZWQpICsgJyBidWZmZXJlZCc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgYnVmZmVyZWRBcmlhVGV4dCk7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVRpbWVCb3ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGN1cnJlbnRUaW1lO1xuICB9O1xuXG4gIHZhciB1cGRhdGVUaWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfTtcblxuICB2YXIgdXBkYXRlRHVyYXRpb24gPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmlkZW9EdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG4gICAgLy8gdXBkYXRlIFVJcyByZWxhdGVkIHdpdGggZHVhdGlvblxuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZSh2aWRlb0R1cmF0aW9uKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCB2aWRlb0R1cmF0aW9uLnRvRml4ZWQoMykpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgfTtcblxuICB2YXIgcmVjZWl2ZVBsYXlpbmcgPSBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LCAnaW52aXNpYmxlJyk7XG4gIH07XG5cbiAgLy9cbiAgLy8gUHJvZ3Jlc3MgY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSBwcm9ncmVzcyBzdGF0ZXMgYnkgYWNjZXNzaW5nIHRvIHRoZXNlIEFQSXMuXG4gIC8vXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogdXBkYXRlUGxheWVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlQnVmZmVyZWRQcm9ncmVzczogdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyxcbiAgICB1cGRhdGVUaW1lQm94OiB1cGRhdGVUaW1lQm94LFxuICAgIHVwZGF0ZVRpY2s6IHVwZGF0ZVRpY2ssXG4gICAgdXBkYXRlRHVyYXRpb246IHVwZGF0ZUR1cmF0aW9uLFxuICAgIHJlY2VpdmVQbGF5aW5nOiByZWNlaXZlUGxheWluZ1xuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgfVxuICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgIH1cbiAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgfSxcblxuICByZWFkVGltZTogZnVuY3Rpb24odGltZUluU2Vjb25kcykge1xuICAgIHZhciB0bSA9IG5ldyBEYXRlKHRpbWVJblNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgaG91cnMgPSB0bS5nZXRVVENIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdG0uZ2V0VVRDTWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gdG0uZ2V0VVRDU2Vjb25kcygpO1xuICAgIHZhciBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZHMnO1xuICAgIHZhciBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZXMnO1xuICAgIHZhciBob3VyU3RyaW5nID0gJyBob3Vycyc7XG4gICAgaWYgKHNlY29uZHMgPD0gMSkge1xuICAgICAgc2Vjb25kU3RyaW5nID0gJyBzZWNvbmQnO1xuICAgIH1cbiAgICBpZiAobWludXRlcyA8PSAxKSB7XG4gICAgICBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZSc7XG4gICAgfVxuICAgIGlmIChob3VycyA8PSAxKSB7XG4gICAgICBob3VyU3RyaW5nID0gJyBob3VyJztcbiAgICB9XG5cbiAgICBpZiAodGltZUluU2Vjb25kcyA8IDYwKSB7XG4gICAgICByZXR1cm4gc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2UgaWYgKHRpbWVJblNlY29uZHMgPj0gNjAgJiYgdGltZUluU2Vjb25kcyA8IDM2MDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBob3VycyArIGhvdXJTdHJpbmcgKyAnLCAnICsgbWludXRlcyArIG1pbnV0ZVN0cmluZyArICcsICcgKyBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH1cbiAgfSxcblxuICBoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIWVsLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpKTtcbiAgICB9XG4gIH0sXG5cbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKTtcbiAgICAgIGVsLmNsYXNzTmFtZT1lbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJyk7XG4gICAgfVxuICB9LFxuXG4gIGdlbmVyYXRlUmFuZG9tSWQ6IGZ1bmN0aW9uKGlkTGVuZ3RoKSB7XG4gICAgdmFyIGlkID0gJyc7XG4gICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVowMTIzNDU2Nzg5JztcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSBpZExlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByYW5kUG9zID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhclNldC5sZW5ndGgpO1xuICAgICAgICBpZCArPSBjaGFyU2V0W3JhbmRQb3NdO1xuICAgIH1cbiAgICByZXR1cm4gaWQ7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvVXRpbGl0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgYnVmZmVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdidWZmZWQnKTtcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gYnVmZmVyZWREaXY7XG4gIH07XG5cbiAgdmFyIHBsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZWREaXYuY2xhc3NOYW1lID0gJ3BsYXllZCc7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheWVkJyk7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIDApO1xuICAgIHJldHVybiBwbGF5ZWREaXY7XG4gIH07XG5cbiAgdmFyIGhvdmVyVGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBob3ZlclRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIGhvdmVyVGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIGhvdmVyVGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB0aW1lYm94RGl2LmNsYXNzTmFtZSA9ICd0aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgdGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gdGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZVBvcCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgdGltZVBvcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVQb3BEaXYuY2xhc3NOYW1lID0gJ3RpbWUtcG9wJztcbiAgICB0aW1lUG9wRGl2LmlubmVySFRNTCA9IHRpbWU7XG4gICAgcmV0dXJuIHRpbWVQb3BEaXY7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVByb2dyZXNzV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZEVsZW1lbnQgPSBidWZmZXJlZCgpO1xuICAgIHZhciBwbGF5ZWRFbGVtZW50ID0gcGxheWVkKCk7XG4gICAgdmFyIGhvdmVyVGltZWJveEVsZW1lbnQgPSBob3ZlclRpbWVib3goKTtcbiAgICB2YXIgdGltZUJveEVsZW1lbnQgPSB0aW1lYm94KCk7XG4gICAgdmFyIHByb2dyZXNzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzRWxlbWVudC5jbGFzc05hbWUgPSAncHJvZ3Jlc3MnO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXJlZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChwbGF5ZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoaG92ZXJUaW1lYm94RWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHRpbWVCb3hFbGVtZW50KTtcbiAgICB2YXIgcHJvZ3Jlc3NXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmNsYXNzTmFtZSA9ICdwcm9ncmVzcy13cmFwcGVyJztcbiAgICBwcm9ncmVzc1dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NFbGVtZW50KTtcblxuICAgIHJldHVybiBwcm9ncmVzc1dyYXBwZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1dyYXBwZXI6IGNyZWF0ZVByb2dyZXNzV3JhcHBlclxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJQcm9ncmVzc0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwbGF5QnV0dG9uRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50Jyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHN0YXRlID0ge1xuICAgICdwbGF5aW5nJzogZmFsc2VcbiAgfTtcbiAgdmFyIHBsYXlidXR0b247XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBwbGF5YnV0dG9uID0gcGxheUJ1dHRvbkVsZW1lbnQuY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIHBsYXlidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYnV0dG9uQ2xpY2tMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHJldHVybiBwbGF5YnV0dG9uO1xuICB9O1xuXG4gIHZhciBfYnV0dG9uQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChzdGF0ZS5wbGF5aW5nKSB7XG4gICAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmltZW9QbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgICBwbGF5YnV0dG9uLmRpc3BhdGNoRXZlbnQodmltZW9QbGF5RXZlbnQpO1xuICAgICAgc3RhdGUucGxheWluZyA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0b2dnbGUgPSBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICB2YXIgcGxheUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzBdO1xuICAgIHZhciBwYXVzZUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzFdO1xuICAgIGlmIChldmVudE5hbWUgPT09IHBsYXllckV2ZW50cy5wYXVzZSkge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBwYXVzZUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICAgIC8vIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBwYXVzZUljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BhdXNlJyk7XG4gICAgICAvLyBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGF1c2UnKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHRvZ2dsZVBsYXk6IHRvZ2dsZVxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5QnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5LWljb24nO1xuICAgIHZhciBwbGF5U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3BvbHlnb24nKTtcbiAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgJzEsMCAyMCwxMCAxLDIwJyk7XG4gICAgcGxheVNWRy5hcHBlbmRDaGlsZChwb2x5Z29uKTtcbiAgICBwbGF5QnV0dG9uLmFwcGVuZENoaWxkKHBsYXlTVkcpO1xuICAgIHJldHVybiBwbGF5QnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVQYXVzZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBhdXNlQnV0dG9uLmNsYXNzTmFtZSA9ICdwYXVzZS1pY29uJztcbiAgICB2YXIgcGF1c2VTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgbGVmdFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKGxlZnRSZWN0KTtcbiAgICB2YXIgcmlnaHRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcxMicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKHJpZ2h0UmVjdCk7XG4gICAgcGF1c2VCdXR0b24uYXBwZW5kQ2hpbGQocGF1c2VTVkcpO1xuICAgIHJldHVybiBwYXVzZUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncGxheSc7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5Jyk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGxheScpO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcbnZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL1B1YlN1YicpO1xuXG4vKipcbiogUGxhY2UgYWxsIHB1Ymxpc2hlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAgIF9wbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBfcHJvZ3Jlc3NQdWJsaXNoZXJzKHByb2dyZXNzKTtcbiAgICBfdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgICBfcGxheWVyQ29udGFpbmVyUHVicyhwbGF5ZXJDb250YWluZXIpO1xuICB9O1xuXG4gIHZhciBfcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF92aWRlb1B1Ymxpc2hlcnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3BsYXllckNvbnRhaW5lclB1YnMgPSBmdW5jdGlvbihwbGF5ZXJDb250YWluZXIpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5yZXdpbmQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBldmVudHMgPSB7fTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50cyA9IHt9O1xuICB9O1xuXG4gIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfTtcblxuICB2YXIgdW5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICBldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIHB1Ymxpc2ggPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBwdWJsaXNoOiBwdWJsaXNoLFxuICAgIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgICBpbml0OiBpbml0XG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnaXN0ZXJTdWJzY3JpYmVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbykge1xuICAgIF92aWRlb1N1YnModmlkZW8pO1xuICAgIF9wcm9ncmVzc1N1YnMocHJvZ3Jlc3MpO1xuICAgIF9idXR0b25TdWJzKHBsYXlCdXR0b24pO1xuICB9O1xuXG4gIHZhciBfdmlkZW9TdWJzID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby5wYXVzZSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLnNlZWsoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby50b2dnbGVQbGF5KCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLmZhc3RGb3J3YXJkKGRhdGEuc3RlcHMpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnJld2luZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8ucmV3aW5kKGRhdGEuc3RlcHMpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NTdWJzID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVEdXJhdGlvbihkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICAgIHByb2dyZXNzLnJlY2VpdmVQbGF5aW5nKHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlQnVmZmVyZWRQcm9ncmVzcyhkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVBsYXllZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVRpY2soZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9idXR0b25TdWJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbikge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgcGxheUJ1dHRvbi50b2dnbGVQbGF5KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IHJlZ2lzdGVyU3Vic2NyaWJlcnNcbiAgfTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9