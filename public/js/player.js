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
	  var isMouseDown = false;
	
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
	    document.documentElement.addEventListener('mousedown', _mousedownListener, false);
	    document.documentElement.addEventListener('mouseup', _mouseupListener, false);
	
	    playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	    playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
	    playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
	    playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
	
	    return playerContainer;
	  };
	
	  var _mouseLeaveListner = function() {
	    if (!isMouseDown) {
	      utility.addClass(playerControls, 'hidden');
	    }
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
	
	  var _mousedownListener = function() {
	    isMouseDown = true;
	  };
	
	  var _mouseupListener = function() {
	    isMouseDown = false;
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
	    receivePlaying: receivePlaying,
	    isMouseDown: isMouseDown
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyMzI4ZGYxZGFmZDdkNGJkNWFjYSIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzFIRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7O0FBRUEsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNwSEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDaEJEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakIsWUFBVyxZQUFZLEtBQUs7QUFDNUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNkRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDaktEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDckVEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDckREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyREQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyRUQ7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNCQUFxQiw4QkFBOEI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDdkNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwicGxheWVyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInBsYXllclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJwbGF5ZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDIzMjhkZjFkYWZkN2Q0YmQ1YWNhXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckNvbnRhaW5lciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QbGF5ZXInKTtcblxudmFyIGFwcCA9IGZ1bmN0aW9uKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcGxheWVyID0gcGxheWVyQ29udGFpbmVyLmluaXQodmlkZW9MaW5rLCB3aWR0aCwgaGVpZ2h0KTtcbiAgcmV0dXJuIHBsYXllcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXBwO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcHAuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgdmlkZW9Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1ZpZGVvJyk7XG52YXIgcHJvZ3Jlc3NDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1Byb2dyZXNzQmFyJyk7XG52YXIgcGxheUJ1dHRvbkNvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUGxheUJ1dHRvbicpO1xudmFyIHB1Ymxpc2hlcnMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUHVibGlzaGVycycpO1xudmFyIHN1YnNjcmliZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L1V0aWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXI7XG4gIHZhciBwbGF5ZXJDb250cm9scztcbiAgdmFyIGxlZnRBcnJvd0NvdW50ID0gMDtcbiAgdmFyIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gIHZhciBtb3VzZVN0b3BUaW1lcjtcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZXJDb250YWluZXIuY2xhc3NOYW1lID0gJ3BsYXllci1jb250YWluZXInO1xuICAgIHZhciB2aWRlbyA9IHZpZGVvQ29tcG9uZW50LmluaXQodmlkZW9MaW5rKTtcbiAgICBwbGF5ZXJDb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICBwbGF5ZXJDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICBwbGF5ZXJDb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllckNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gICAgdmFyIHBsYXlCdG4gPSBwbGF5QnV0dG9uQ29tcG9uZW50LmluaXQoKTtcbiAgICBwbGF5ZXJDb250cm9scy5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0NvbXBvbmVudC5pbml0KCk7XG4gICAgcGxheWVyQ29udHJvbHMuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZChwbGF5ZXJDb250cm9scyk7XG5cbiAgICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgICBwdWJsaXNoZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHZpZGVvLCBwbGF5ZXJDb250YWluZXIpO1xuICAgIHN1YnNjcmliZXJzLmluaXQocGxheUJ1dHRvbkNvbXBvbmVudCwgcHJvZ3Jlc3NDb21wb25lbnQsIHZpZGVvQ29tcG9uZW50KTtcblxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgX2tleWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIF9rZXl1cExpc3RlbmVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9tb3VzZWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX21vdXNldXBMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VMZWF2ZUxpc3RuZXIsIGZhbHNlKTtcbiAgICBwbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcGxheWVyQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9jb250cm9sc01vdXNlTGVhdmVMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHBsYXllckNvbnRhaW5lcjtcbiAgfTtcblxuICB2YXIgX21vdXNlTGVhdmVMaXN0bmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFpc01vdXNlRG93bikge1xuICAgICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250cm9scywgJ2hpZGRlbicpO1xuICAgIH1cbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9jb250cm9sc01vdXNlRW50ZXJMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3MocGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICBpZiAobW91c2VTdG9wVGltZXIpIHdpbmRvdy5jbGVhclRpbWVvdXQobW91c2VTdG9wVGltZXIpO1xuICAgIHBsYXllckNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChtb3VzZVN0b3BUaW1lcikge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dChtb3VzZVN0b3BUaW1lcik7XG4gICAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHBsYXllckNvbnRyb2xzLCAnaGlkZGVuJyk7XG4gICAgfVxuICAgIG1vdXNlU3RvcFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHBsYXllckNvbnRyb2xzLCAnaGlkZGVuJyk7XG4gICAgfSwgMjAwMCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9rZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2aWRlb1RvZ2dsZVBsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50b2dnbGVQbGF5KTtcbiAgICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVG9nZ2xlUGxheUV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHJpZ2h0QXJyb3dDb3VudCArPSAxO1xuICAgICAgdmFyIHJld2luZERhdGEgPSB7IHN0ZXBzOiByaWdodEFycm93Q291bnQgfTtcbiAgICAgIHZhciByZXdpbmRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5yZXdpbmQsIHJld2luZERhdGEpO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQocmV3aW5kRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgbGVmdEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZERhdGEgPSB7IHN0ZXBzOiBsZWZ0QXJyb3dDb3VudCB9O1xuICAgICAgdmFyIGZhc3RGb3J3YXJkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZhc3RGb3J3YXJkRGF0YSk7XG4gICAgICBwbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChmYXN0Rm9yd2FyZEV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9rZXl1cExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XG4gICAgICBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXllci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZpZGVvRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1ZpZGVvRWxlbWVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB2aWRlbyA9IHtcbiAgICBkdXJhdGlvbjogMCxcbiAgICBjdXJyZW50VGltZTogMCxcbiAgICBidWZmZXJlZDogMCxcbiAgICBwbGF5aW5nOiBmYWxzZVxuICB9O1xuICB2YXIgdmlkZW9Db250YWluZXI7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2aWRlb0NvbnRhaW5lciA9IHZpZGVvRWxlbWVudC52aWRlb0VsZW1lbnQodmlkZW9MaW5rKTtcbiAgICB2aWRlby5wbGF5ZXIgPSB2aWRlb0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkZGF0YScsIF9sb2FkZWRkYXRhTGlzdGVuZXIsIGZhbHNlKTtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIF90aW1ldXBkYXRlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwbGF5aW5nJywgX3BsYXlpbmdMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwYXVzZScsIF9wYXVzZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfbG9hZGVkZGF0YUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8uZHVyYXRpb24gPSB2aWRlby5wbGF5ZXIuZHVyYXRpb247XG4gICAgdmFyIGR1cmF0aW9uRGF0YSA9IHsgZHVyYXRpb246IHZpZGVvLmR1cmF0aW9uIH07XG4gICAgdmFyIHZpZGVvUmVhZHlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkdXJhdGlvbkRhdGEpO1xuICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9SZWFkeUV2ZW50KTtcblxuICAgIHZhciBidWZmZXJEYXRhID0geyBidWZmZXJlZDogdmlkZW8ucGxheWVyLmJ1ZmZlcmVkLmVuZCgwKSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gIH07XG5cbiAgdmFyIF90aW1ldXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLnBsYXllci5jdXJyZW50VGltZTtcbiAgICB2YXIgdGlja0RhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1RpY2tFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50aWNrLCB0aWNrRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1RpY2tFdmVudCk7XG5cbiAgICB2YXIgcGxheWVkUHJvZ3Jlc3NEYXRhID0geyBwcm9ncmVzczogdmlkZW8uY3VycmVudFRpbWUgfTtcbiAgICB2YXIgdmlkZW9QbGF5ZWRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5ZWQsIHBsYXllZFByb2dyZXNzRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSB2aWRlby5wbGF5ZXIuYnVmZmVyZWQ7XG4gICAgaWYgKGJ1ZmZlcmVkLmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBidWZmZXJlZEVuZCA9IGJ1ZmZlcmVkLmVuZChidWZmZXJlZC5sZW5ndGggLSAxKTtcbiAgICAgIHZhciBidWZmZXJEYXRhID0geyBidWZmZXJlZDogYnVmZmVyZWRFbmQgfTtcbiAgICAgIHZhciB2aWRlb0J1ZmZlckV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBidWZmZXJEYXRhKTtcbiAgICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfcGxheWluZ0xpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpZGVvUGxheWluZ0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9QbGF5aW5nRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcGF1c2VMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgfTtcblxuICB2YXIgc2VlayA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgfTtcblxuICB2YXIgdG9nZ2xlUGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh2aWRlby5wbGF5aW5nKSB7XG4gICAgICB2aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICAgIHZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlkZW8ucGxheWVyLnBsYXkoKTtcbiAgICAgIHZpZGVvLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnBsYXllci5wbGF5KCk7XG4gICAgdmlkZW8ucGxheWluZyA9IHRydWU7XG4gIH07XG5cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgdmlkZW8ucGxheWluZyA9IGZhbHNlO1xuICB9O1xuXG4gIHZhciBmYXN0Rm9yd2FyZCA9IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgKz0gc3RlcHM7XG4gICAgdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lID0gdmlkZW8uY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIHJld2luZCA9IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgLT0gc3RlcHM7XG4gICAgdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lID0gdmlkZW8uY3VycmVudFRpbWU7XG4gIH07XG4gIC8vXG4gIC8vIFZpZGVvIGNvbXBvbmVudCBwdWJsaWMgQVBJc1xuICAvLyBPdXRzaWRlIHdvcmxkIGNhbiBjaGFuZ2UgdmlkZW8gY29tcG9uZW50IHN0YXRlcyBieSBhY2Nlc3NpbmcgdG8gdGhlc2UgQVBJcy5cbiAgLy9cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHRvZ2dsZVBsYXk6IHRvZ2dsZVBsYXksXG4gICAgcGxheTogcGxheSxcbiAgICBwYXVzZTogcGF1c2UsXG4gICAgc2Vlazogc2VlayxcbiAgICBmYXN0Rm9yd2FyZDogZmFzdEZvcndhcmQsXG4gICAgcmV3aW5kOiByZXdpbmRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9WaWRlby5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogQWxsIFZpZW1vIFBsYXllciBvd24gZXZlbnQgbmFtZXMgYXJlIGhlcmVcbipcbiogQHJldHVybiB7fVxuKlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGxheWluZzogJ3ZpbWVvUGxheWluZycsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHRvZ2dsZVBsYXk6ICd0b2dnbGVQbGF5JyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICd2aWVtb1BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snLFxuICBmYXN0Rm9yd2FyZDogJ3ZpZW1vRmFzdEZvcndhcmQnLFxuICByZXdpbmQ6ICd2aW1lb1Jld2luZCdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiogY3JlYXRlIGEgY3VzdG9tIGV2ZW50IGZvciBhIEhUTUwgZWxlbWVudCwgb25seSB0aGUgc2FtZSBlbGVtZW50IGNhbiBsaXN0ZW4gdG8uXG4qIGl0J3MgdGhlIGVsZW1lbnQncyBpbnRlcm5hbCBldmVudHNcbiogbG9hZCBQb2x5ZmlsbCBmaXJzdCBmb3IgSUVcbipcbiogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4qIEByZXR1cm4ge0N1c3RvbUV2ZW50fSBvciB7RXZlbnR9XG4qXG4qL1xuXG5yZXF1aXJlKCcuL1BvbHlmaWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICdkZXRhaWwnOiBkYXRhXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBFdmVudChldmVudE5hbWUpO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSAnZnVuY3Rpb24nKSByZXR1cm4gZmFsc2U7XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcykge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50JyApO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9Qb2x5ZmlsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L1V0aWxpdHknKTtcbnZhciBwcm9ncmVzc1dyYXBwZXIgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5ZXJQcm9ncmVzc0VsZW1lbnQuanMnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcHJvZ3Jlc3NCYXJDaGlsZHJlbiA9IHt9O1xuICB2YXIgdmlkZW9EdXJhdGlvbiA9IDA7XG4gIHZhciBwcm9ncmVzc0JhcjtcbiAgdmFyIHByb2dyZXNzQ29udGFpbmVyO1xuICB2YXIgcGxheWVyQ29udGFpbmVyO1xuICB2YXIgaXNNb3VzZURvd24gPSBmYWxzZTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHByb2dyZXNzQ29udGFpbmVyID0gcHJvZ3Jlc3NXcmFwcGVyLnByb2dyZXNzV3JhcHBlcigpO1xuICAgIHByb2dyZXNzQmFyID0gcHJvZ3Jlc3NDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzBdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMV07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3ggPSBwcm9ncmVzc0Jhci5jaGlsZHJlblsyXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3ggPSBwcm9ncmVzc0Jhci5jaGlsZHJlblszXTtcblxuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VsZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHByb2dyZXNzQ29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgfTtcblxuICB2YXIgX21vdXNlbGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94IGludmlzaWJsZSc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgcGxheWVyQ29udGFpbmVyID0gcHJvZ3Jlc3NDb250YWluZXIucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIHV0aWxpdHkuYWRkQ2xhc3MocGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG5cbiAgICAvLyBvbmx5IGFkZCBtb3VzZW1vdmUgdG8gZG9jdW1lbnQgd2hlbiBtb3VzZSBkb3duIHRvIHByb2dyZXNzQmFyIGhhcHBlbmVkXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFpc01vdXNlRG93bikgcmV0dXJuO1xuICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3MocGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG5cbiAgICAvLyB3aGVuIG1vdXNlIGlzIHVwIHJlbW92ZSBtb3VzZW1vdmUgZXZlbnQgZnJvbSBkb2N1bWVudEVsZW1lbnRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZGlzcGF0Y2hTZWVrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgdmFyIGRhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgcHJvZ3Jlc3NDb250YWluZXIuZGlzcGF0Y2hFdmVudChzZWVrRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uKGUsIHByb2dyZXNzQmFyKSB7XG4gICAgdmFyIG1Qb3N4ID0gMDtcbiAgICB2YXIgZVBvc3ggPSAwO1xuICAgIHZhciBvYmogPSBwcm9ncmVzc0JhcjtcblxuICAgIC8vIGdldCBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudCBjcm9zc2Jyb3dzZXJcbiAgICBpZiAoIWUpIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgaWYgKGUucGFnZVgpIHtcbiAgICAgIG1Qb3N4ID0gZS5wYWdlWDtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50KSB7XG4gICAgICBtUG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgICB3aGlsZSAob2JqLm9mZnNldFBhcmVudCkge1xuICAgICAgZVBvc3ggKz0gb2JqLm9mZnNldExlZnQ7XG4gICAgICBvYmogPSBvYmoub2Zmc2V0UGFyZW50O1xuICAgIH1cblxuICAgIHZhciBvZmZzZXQgPSBtUG9zeCAtIGVQb3N4O1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gb2Zmc2V0IC8gcHJvZ3Jlc3NCYXIub2Zmc2V0V2lkdGg7XG4gICAgcmV0dXJuIGhvdmVyUG9zaXRpb247XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVBsYXllZFByb2dyZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh2aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgcGxheWVkUGVjZW50YWdlID0gZGF0YS5wcm9ncmVzcyAvIHZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSBwbGF5ZWRQZWNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEucHJvZ3Jlc3MpO1xuICAgIHZhciBwbGF5ZWRBcmlhVGV4dCA9IHV0aWxpdHkucmVhZFRpbWUoZGF0YS5wcm9ncmVzcykgKyAnIHBsYXllZCc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIHBsYXllZEFyaWFUZXh0KTtcbiAgfTtcblxuICB2YXIgdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAodmlkZW9EdXJhdGlvbiA8PSAwKSByZXR1cm47XG4gICAgdmFyIGJ1ZmZlcmVkUGVyY2VudGFnZSA9IGRhdGEuYnVmZmVyZWQgLyB2aWRlb0R1cmF0aW9uICogMTAwO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc3R5bGUud2lkdGggPSBidWZmZXJlZFBlcmNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEuYnVmZmVyZWQpO1xuICAgIHZhciBidWZmZXJlZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLmJ1ZmZlcmVkKSArICcgYnVmZmVyZWQnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIGJ1ZmZlcmVkQXJpYVRleHQpO1xuICB9O1xuXG4gIHZhciB1cGRhdGVUaW1lQm94ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBjdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgdXBkYXRlVGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZUR1cmF0aW9uID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZpZGVvRHVyYXRpb24gPSBkYXRhLmR1cmF0aW9uO1xuICAgIC8vIHVwZGF0ZSBVSXMgcmVsYXRlZCB3aXRoIGR1YXRpb25cbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUodmlkZW9EdXJhdGlvbik7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIHZpZGVvRHVyYXRpb24udG9GaXhlZCgzKSk7XG4gIH07XG5cbiAgdmFyIHJlY2VpdmVQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveCwgJ2ludmlzaWJsZScpO1xuICB9O1xuXG4gIC8vXG4gIC8vIFByb2dyZXNzIGNvbXBvbmVudCBwdWJsaWMgQVBJc1xuICAvLyBPdXRzaWRlIHdvcmxkIGNhbiBjaGFuZ2UgcHJvZ3Jlc3Mgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdXBkYXRlUGxheWVkUHJvZ3Jlc3M6IHVwZGF0ZVBsYXllZFByb2dyZXNzLFxuICAgIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3M6IHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlVGltZUJveDogdXBkYXRlVGltZUJveCxcbiAgICB1cGRhdGVUaWNrOiB1cGRhdGVUaWNrLFxuICAgIHVwZGF0ZUR1cmF0aW9uOiB1cGRhdGVEdXJhdGlvbixcbiAgICByZWNlaXZlUGxheWluZzogcmVjZWl2ZVBsYXlpbmcsXG4gICAgaXNNb3VzZURvd246IGlzTW91c2VEb3duXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzcGxpdFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICB9XG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgfVxuICAgIGlmIChob3VycyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICB9LFxuXG4gIHJlYWRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgdmFyIHNlY29uZFN0cmluZyA9ICcgc2Vjb25kcyc7XG4gICAgdmFyIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlcyc7XG4gICAgdmFyIGhvdXJTdHJpbmcgPSAnIGhvdXJzJztcbiAgICBpZiAoc2Vjb25kcyA8PSAxKSB7XG4gICAgICBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZCc7XG4gICAgfVxuICAgIGlmIChtaW51dGVzIDw9IDEpIHtcbiAgICAgIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlJztcbiAgICB9XG4gICAgaWYgKGhvdXJzIDw9IDEpIHtcbiAgICAgIGhvdXJTdHJpbmcgPSAnIGhvdXInO1xuICAgIH1cblxuICAgIGlmICh0aW1lSW5TZWNvbmRzIDwgNjApIHtcbiAgICAgIHJldHVybiBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAodGltZUluU2Vjb25kcyA+PSA2MCAmJiB0aW1lSW5TZWNvbmRzIDwgMzYwMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyBtaW51dGVTdHJpbmcgKyAnLCAnICsgc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGhvdXJzICsgaG91clN0cmluZyArICcsICcgKyBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfVxuICB9LFxuXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpO1xuICAgIH1cbiAgfSxcblxuICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgfSxcblxuICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpO1xuICAgICAgZWwuY2xhc3NOYW1lPWVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgJyAnKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2VuZXJhdGVSYW5kb21JZDogZnVuY3Rpb24oaWRMZW5ndGgpIHtcbiAgICB2YXIgaWQgPSAnJztcbiAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGlkTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJhbmRQb3MgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XG4gICAgICAgIGlkICs9IGNoYXJTZXRbcmFuZFBvc107XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9VdGlsaXR5LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1ZmZlcmVkRGl2LmNsYXNzTmFtZSA9ICdidWZmZXJlZCc7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ2J1ZmZlZCcpO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIDApO1xuICAgIHJldHVybiBidWZmZXJlZERpdjtcbiAgfTtcblxuICB2YXIgcGxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllZERpdi5jbGFzc05hbWUgPSAncGxheWVkJztcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5ZWQnKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIHBsYXllZERpdjtcbiAgfTtcblxuICB2YXIgaG92ZXJUaW1lYm94ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhvdmVyVGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvdmVyVGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGhvdmVyVGltZWJveERpdi5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIGhvdmVyVGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gaG92ZXJUaW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciB0aW1lYm94ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lYm94RGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgICB0aW1lYm94RGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIHRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ3RpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICB0aW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiB0aW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciB0aW1lUG9wID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB0aW1lUG9wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVBvcERpdi5jbGFzc05hbWUgPSAndGltZS1wb3AnO1xuICAgIHRpbWVQb3BEaXYuaW5uZXJIVE1MID0gdGltZTtcbiAgICByZXR1cm4gdGltZVBvcERpdjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRWxlbWVudCA9IGJ1ZmZlcmVkKCk7XG4gICAgdmFyIHBsYXllZEVsZW1lbnQgPSBwbGF5ZWQoKTtcbiAgICB2YXIgaG92ZXJUaW1lYm94RWxlbWVudCA9IGhvdmVyVGltZWJveCgpO1xuICAgIHZhciB0aW1lQm94RWxlbWVudCA9IHRpbWVib3goKTtcbiAgICB2YXIgcHJvZ3Jlc3NFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmNsYXNzTmFtZSA9ICdwcm9ncmVzcyc7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGJ1ZmZlcmVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHBsYXllZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChob3ZlclRpbWVib3hFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGltZUJveEVsZW1lbnQpO1xuICAgIHZhciBwcm9ncmVzc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc1dyYXBwZXIuY2xhc3NOYW1lID0gJ3Byb2dyZXNzLXdyYXBwZXInO1xuICAgIHByb2dyZXNzV3JhcHBlci5hcHBlbmRDaGlsZChwcm9ncmVzc0VsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzV3JhcHBlcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHByb2dyZXNzV3JhcHBlcjogY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBsYXlCdXR0b25FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9O1xuICB2YXIgcGxheWJ1dHRvbjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHBsYXlidXR0b24gPSBwbGF5QnV0dG9uRWxlbWVudC5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgcGxheWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9idXR0b25DbGlja0xpc3RlbmVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHBsYXlidXR0b247XG4gIH07XG5cbiAgdmFyIF9idXR0b25DbGlja0xpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgICAgcGxheWJ1dHRvbi5kaXNwYXRjaEV2ZW50KHZpbWVvUGF1c2VFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aW1lb1BsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHRvZ2dsZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgIHZhciBwbGF5SWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMF07XG4gICAgdmFyIHBhdXNlSWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMV07XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gcGxheWVyRXZlbnRzLnBhdXNlKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheScpO1xuICAgICAgLy8gcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BsYXknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGF1c2UnKTtcbiAgICAgIC8vIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwYXVzZScpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdG9nZ2xlUGxheTogdG9nZ2xlXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUGxheUJ1dHRvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXlCdXR0b24uY2xhc3NOYW1lID0gJ3BsYXktaWNvbic7XG4gICAgdmFyIHBsYXlTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIHBvbHlnb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncG9seWdvbicpO1xuICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKCdwb2ludHMnLCAnMSwwIDIwLDEwIDEsMjAnKTtcbiAgICBwbGF5U1ZHLmFwcGVuZENoaWxkKHBvbHlnb24pO1xuICAgIHBsYXlCdXR0b24uYXBwZW5kQ2hpbGQocGxheVNWRyk7XG4gICAgcmV0dXJuIHBsYXlCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVBhdXNlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGF1c2VCdXR0b24uY2xhc3NOYW1lID0gJ3BhdXNlLWljb24nO1xuICAgIHZhciBwYXVzZVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBsZWZ0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQobGVmdFJlY3QpO1xuICAgIHZhciByaWdodFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzEyJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQocmlnaHRSZWN0KTtcbiAgICBwYXVzZUJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZVNWRyk7XG4gICAgcmV0dXJuIHBhdXNlQnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5JztcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgdmFyIHBsYXlCdG4gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgIHZhciBwYXVzZUJ0biA9IGNyZWF0ZVBhdXNlQnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlQnRuKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUGxheUJ1dHRvbjogY3JlYXRlQnV0dG9uXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbi8qKlxuKiBQbGFjZSBhbGwgcHVibGlzaGVycyBoZXJlLiBJdCBhbHNvIG1ha2VzIGxvZ2dpbmcgZXNheS5cbipcbiovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbywgcGxheWVyQ29udGFpbmVyKSB7XG4gICAgX3BsYXlidXR0b25QdWJsaXNoZXJzKHBsYXlCdXR0b24pO1xuICAgIF9wcm9ncmVzc1B1Ymxpc2hlcnMocHJvZ3Jlc3MpO1xuICAgIF92aWRlb1B1Ymxpc2hlcnModmlkZW8pO1xuICAgIF9wbGF5ZXJDb250YWluZXJQdWJzKHBsYXllckNvbnRhaW5lcik7XG4gIH07XG5cbiAgdmFyIF9wbGF5YnV0dG9uUHVibGlzaGVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24pIHtcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXkpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NQdWJsaXNoZXJzID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICBwcm9ncmVzcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3ZpZGVvUHVibGlzaGVycyA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5ZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRpY2ssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfcGxheWVyQ29udGFpbmVyUHVicyA9IGZ1bmN0aW9uKHBsYXllckNvbnRhaW5lcikge1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy50b2dnbGVQbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50b2dnbGVQbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnJld2luZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnJld2luZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGV2ZW50cyA9IHt9O1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRzID0ge307XG4gIH07XG5cbiAgdmFyIHN1YnNjcmliZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9O1xuXG4gIHZhciB1bnN1YnNjcmliZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIGV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgcHVibGlzaCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICBmbihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gICAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICAgIGluaXQ6IGluaXRcbiAgfTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9QdWJTdWInKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWdpc3RlclN1YnNjcmliZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvKSB7XG4gICAgX3ZpZGVvU3Vicyh2aWRlbyk7XG4gICAgX3Byb2dyZXNzU3Vicyhwcm9ncmVzcyk7XG4gICAgX2J1dHRvblN1YnMocGxheUJ1dHRvbik7XG4gIH07XG5cbiAgdmFyIF92aWRlb1N1YnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uc2VlayhkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50b2dnbGVQbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uZmFzdEZvcndhcmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucmV3aW5kLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5yZXdpbmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1N1YnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZUR1cmF0aW9uKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvZ3Jlc3MucmVjZWl2ZVBsYXlpbmcocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX2J1dHRvblN1YnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogcmVnaXN0ZXJTdWJzY3JpYmVyc1xuICB9O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=