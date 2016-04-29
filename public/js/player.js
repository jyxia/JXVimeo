(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Player", [], factory);
	else if(typeof exports === 'object')
		exports["Player"] = factory();
	else
		root["Player"] = factory();
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
	var Player = __webpack_require__(1);
	var EventManager = __webpack_require__(13);
	var registerPubs = __webpack_require__(14);
	var registerSubs = __webpack_require__(15);
	
	/**
	 * Custom Class: Player
	 * @param{String} videoLink: video link
	 * @param{String} width: player's width
	 * @param{String} height: player's height
	 *
	 * members:
	 * 1. HTML element: this.playerContainer - contains all elements in the player
	 */
	var app = function(videoLink, width, height) {
	  var player = new Player(videoLink, width, height);
	  var playButton = player.playerButton;
	  var progress = player.progress;
	  var video = player.video;
	  this.playerContainer = player.playerContainer;
	  // register pubs/subs here.
	  var eventManager = new EventManager();
	  registerPubs(eventManager, playButton.playbuttonElem, progress.progressContainer,video.videoContainer, this.playerContainer);
	  registerSubs(eventManager, playButton, progress, video);
	};
	
	module.exports = app;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Video = __webpack_require__(2);
	var Progress = __webpack_require__(7);
	var PlayButton = __webpack_require__(10);
	var PlayerElem = __webpack_require__(12);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	var utility = __webpack_require__(8);
	
	/**
	 * Custom class: Player
	 *
	 * @param{String} videoLink: video link
	 * @param{String} width: player's width
	 * @param{String} height: player's height
	 *
	 * members:
	 * 1. HTML object: this.playerContainer - contains all elements
	 * 2. Video object: this.video, it opens Player's APIs.
	 */
	
	var Player = function(videoLink, width, height) {
	  this.playerButton = new PlayButton();
	  this.progress = new Progress();
	  this.video = new Video(videoLink);
	  var playbuttonElem = this.playerButton.playbuttonElem;
	  var progressContainer = this.progress.progressContainer;
	  var videoContainer = this.video.videoContainer;
	  var videoWrapper = {
	    videoContainer: videoContainer,
	    width: width,
	    height: height
	  };
	  var playerElem = PlayerElem.createPlayer(videoWrapper, playbuttonElem, progressContainer);
	  var playerControls = playerElem.controls;
	  this.playerContainer = playerElem.container;
	
	  var _this = this;
	  var isMouseDown = false;
	  var leftArrowCount = 0;
	  var rightArrowCount = 0;
	  var mouseStopTimer = null;
	
	  /**
	  * private methods - mainly for event listeners
	  */
	  var _resetMouseStopTimer = function() {
	    if (mouseStopTimer) {
	      window.clearTimeout(mouseStopTimer);
	    }
	    if (utility.hasClass(playerControls, 'invisible')) {
	      utility.removeClass(playerControls, 'invisible');
	    }
	    mouseStopTimer = window.setTimeout(function() {
	      utility.addClass(playerControls, 'invisible');
	    }, 3000);
	  };
	
	  var _mousemoveListner = function() {
	    _resetMouseStopTimer();
	  };
	
	  var _mousedownListener = function() {
	    isMouseDown = true;
	  };
	
	  var _mouseupListener = function() {
	    isMouseDown = false;
	  };
	
	  var _mouseLeaveListner = function() {
	    if (!isMouseDown) {
	      utility.addClass(playerControls, 'invisible');
	    }
	    _this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseLeaveListener = function() {
	    _this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseEnterListener = function() {
	    utility.removeClass(playerControls, 'invisible');
	    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
	    _this.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _keydownListener = function(event) {
	    _resetMouseStopTimer();
	    if (event.keyCode === 32) {
	      event.preventDefault();
	      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
	      _this.playerContainer.dispatchEvent(videoTogglePlayEvent);
	    }
	
	    if (event.keyCode === 37) {
	      rightArrowCount += 1;
	      var rewindData = { steps: rightArrowCount };
	      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
	      _this.playerContainer.dispatchEvent(rewindEvent);
	    }
	
	    if (event.keyCode === 39) {
	      leftArrowCount += 1;
	      var fastForwardData = { steps: leftArrowCount };
	      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
	      _this.playerContainer.dispatchEvent(fastForwardEvent);
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
	
	  var _clickEventListener = function() {
	    _this.playerContainer.focus();
	  };
	
	  /**
	  * Add eventlisteners here
	  */
	  this.playerContainer.addEventListener('keydown', _keydownListener, false);
	  this.playerContainer.addEventListener('keyup', _keyupListener, false);
	  this.playerContainer.addEventListener('mousedown', _mousedownListener, false);
	  this.playerContainer.addEventListener('mouseup', _mouseupListener, false);
	  this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  this.playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
	  this.playerContainer.addEventListener('click', _clickEventListener, false);
	
	  playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
	  playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
	};
	
	module.exports = Player;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var videoElement = __webpack_require__(3);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	/**
	 * Custom class: Video
	 * @param{String} videoLink, video source link
	 *
	 * members:
	 * 1. HTML element: this.videoContainer - contains video element
	 * 2. Video state: this.video
	 * In order to access to Video object and change states, use prototype's methods (APIs)
	 * @see Video.prototype
	 */
	
	var Video = function(videoLink) {
	  this.videoContainer = videoElement.videoElement(videoLink);
	  this.video = {
	    duration: 0,
	    currentTime: 0,
	    buffered: 0,
	    playing: false,
	    player: this.videoContainer.firstElementChild
	  };
	  var _this = this;
	
	  /**
	  * private methods - mainly for event listeners
	  */
	  var _updateProgress = function() {
	    var buffered =  _this.video.player.buffered;
	    if (buffered.length > 0) {
	      var bufferedEnd = buffered.end(buffered.length - 1);
	      var bufferData = { buffered: bufferedEnd };
	      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	      _this.videoContainer.dispatchEvent(videoBufferEvent);
	    }
	  };
	
	  var _loadeddataListener = function() {
	    _this.video.duration = _this.video.player.duration;
	    var durationData = { duration:  _this.video.duration };
	    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
	    _this.videoContainer.dispatchEvent(videoReadyEvent);
	    _updateProgress();
	  };
	
	  var _timeupdateListener = function() {
	    _this.video.currentTime =  _this.video.player.currentTime;
	    var tickData = { currentTime: _this.video.currentTime };
	    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
	    _this.videoContainer.dispatchEvent(videoTickEvent);
	
	    var playedProgressData = { progress:  _this.video.currentTime };
	    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
	    _this.videoContainer.dispatchEvent(videoPlayedEvent);
	  };
	
	  var _progressUpdateListener = function() {
	    _updateProgress();
	  };
	
	  var _playingListener = function() {
	    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
	    _this.videoContainer.dispatchEvent(videoPlayingEvent);
	  };
	
	  var _pauseListener = function() {
	    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	    _this.videoContainer.dispatchEvent(vimeoPauseEvent);
	  };
	
	  var _mouseClickListner = function() {
	    _this.togglePlay();
	  };
	
	  /**
	  * register event listeners
	  */
	  this.videoContainer.addEventListener('click', _mouseClickListner, false);
	  this.video.player.addEventListener('loadeddata', _loadeddataListener, false);
	  this.video.player.addEventListener('timeupdate', _timeupdateListener, false);
	  this.video.player.addEventListener('progress', _progressUpdateListener, false);
	  this.video.player.addEventListener('playing', _playingListener, false);
	  this.video.player.addEventListener('pause', _pauseListener, false);
	};
	
	//
	// Video APIs, other elements change video states from here.
	// Also, if player expose a video object, then these APIs become the player's APIs.
	//
	Video.prototype = {
	  seek: function(time) {
	    this.video.player.currentTime = time;
	    this.video.currentTime = time;
	  },
	
	  togglePlay: function() {
	    if (this.video.playing) {
	      this.video.player.pause();
	      this.video.playing = false;
	    } else {
	      this.video.player.play();
	      this.video.playing = true;
	    }
	  },
	
	  play: function() {
	    this.video.player.play();
	    this.video.playing = true;
	  },
	
	  pause: function() {
	    this.video.player.pause();
	    this.video.playing = false;
	  },
	
	  fastForward: function(steps) {
	    this.video.currentTime += steps;
	    this.video.player.currentTime = this.video.currentTime;
	  },
	
	  rewind: function(steps) {
	    this.video.currentTime -= steps;
	    this.video.player.currentTime = this.video.currentTime;
	  }
	};
	
	module.exports = Video;


/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @return{Function} videoElement() create a DOM element (wrapper div) for video
	 */
	
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
	* All Viemo Player custom event names are here
	*
	* @return {Object} contains all custom event names
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
	  }
	
	  return new Event(eventName);
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	/**
	 * Polyfills for 'CustomEvent' and 'Event' object.
	 */
	
	module.exports = (function () {
	  if (typeof window.CustomEvent === 'function') return false;
	
	  function CustomEvent(event, params) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent('CustomEvent');
	    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	    return evt;
	  }
	
	  CustomEvent.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent;
	})();
	
	module.exports = (function () {
	  if (typeof window.Event === 'function') return false;
	
	  function Event(eventName) {
	    var params = { bubbles: false, cancelable: false };
	    var evt;
	    if (document.createEvent) {
	      evt = document.createEvent('Event');
	      evt.initEvent(eventName, params.bubbles, params.cancelable);
	    } else {
	      evt = document.createEventObject();
	      evt.eventType = eventName;
	    }
	    return evt;
	  }
	
	  Event.prototype = window.Event.prototype;
	  window.Event = Event;
	})();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utility = __webpack_require__(8);
	var progressWrapper = __webpack_require__(9);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	/**
	 * Custom class: Progress
	 * members - HTML elements
	 * - this.progressBar,
	 * - this.progressBarChildren - a collection of child DOMs of progressBar
	 *
	 * In order to access to this object, use prototype's methods (APIs)
	 * @see Progress.prototype
	 */
	
	var Progress = function() {
	  this.progressContainer = progressWrapper.progressWrapper();
	  this.progressBar = this.progressContainer.firstElementChild;
	  this.progressBarChildren = {
	    buffered: this.progressBar.children[0],
	    played: this.progressBar.children[1],
	    hoverTimebox: this.progressBar.children[2],
	    timeBox: this.progressBar.children[3]
	  };
	
	  var _this = this;
	  var isMouseDown = false;
	
	  /**
	  * private methods - mainly for event listeners
	  */
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
	
	  var _dispatchSeek = function(event) {
	    var hoverPosition = _getMousePosition(event, _this.progressBar);
	    var data = { currentTime: _this.videoDuration * hoverPosition };
	    var seekEvent = createCustomEvent(playerEvents.seek, data);
	    _this.progressContainer.dispatchEvent(seekEvent);
	  };
	
	  var _mousemoveListener = function(event) {
	    event.stopPropagation();
	    var hoverPosition = _getMousePosition(event, _this.progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = _this.videoDuration * hoverPosition;
	    _this.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    _this.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox';
	  };
	
	  var _mouseleaveListener = function() {
	    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	  };
	
	  var _mousedownmoveListener = function(event) {
	    var hoverPosition = _getMousePosition(event, _this.progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = _this.videoDuration * hoverPosition;
	    _this.progressBarChildren.played.style.width = (hoverPosition * 100).toFixed(3) + '%';
	    _this.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    _this.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	    _this.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    _this.progressBarChildren.timeBox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    _this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    _dispatchSeek(event);
	  };
	
	  var _mousedownListener = function(event) {
	    event.preventDefault();
	    isMouseDown = true;
	    _this.playerContainer = _this.progressContainer.parentNode.parentNode;
	    utility.addClass(_this.playerContainer, 'grabbable');
	    _dispatchSeek(event);
	
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    _this.progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
	    if (!isMouseDown) return;
	    utility.removeClass(_this.playerContainer, 'grabbable');
	    _this.progressBar.addEventListener('mousemove', _mousemoveListener, false);
	
	    // when mouse is up remove mousemove event from documentElement
	    document.documentElement.removeEventListener('mousemove', _mousedownmoveListener);
	  };
	
	  /**
	  * register event listeners
	  */
	  this.progressBar.addEventListener('mousemove', _mousemoveListener, false);
	  this.progressBar.addEventListener('mouseleave', _mouseleaveListener, false);
	  this.progressBar.addEventListener('mousedown', _mousedownListener, false);
	  document.documentElement.addEventListener('mouseup', _mouseupListener, false);
	};
	
	//
	// Progress APIs, other elements change progress states from here.
	// Also, if player expose a Progress object, then these APIs become the player's APIs.
	//
	Progress.prototype = {
	  videoDuration: 0,
	
	  updatePlayedProgress: function(data) {
	    if (this.videoDuration <= 0) return;
	    var playedPecentage = data.progress / this.videoDuration * 100;
	    this.progressBarChildren.played.style.width = playedPecentage.toFixed(3) + '%';
	    this.progressBarChildren.timeBox.style.left = playedPecentage.toFixed(3) + '%';
	    this.progressBarChildren.played.setAttribute('aria-valuenow', data.progress);
	    var playedAriaText = utility.readTime(data.progress) + ' played';
	    this.progressBarChildren.played.setAttribute('aria-valuetext', playedAriaText);
	  },
	
	  updateBufferedProgress: function(data) {
	    if (this.videoDuration <= 0) return;
	    var bufferedPercentage = data.buffered / this.videoDuration * 100;
	    this.progressBarChildren.buffered.style.width = bufferedPercentage.toFixed(3) + '%';
	    this.progressBarChildren.buffered.setAttribute('aria-valuenow', data.buffered);
	    var bufferedAriaText = utility.readTime(data.buffered) + ' buffered';
	    this.progressBarChildren.buffered.setAttribute('aria-valuetext', bufferedAriaText);
	  },
	
	  updateTimeBox: function(data) {
	    var currentTime = utility.splitTime(data.currentTime);
	    this.progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
	  },
	
	  updateTick: function(data) {
	    this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
	  },
	
	  updateDuration: function(data) {
	    this.videoDuration = data.duration;
	    // update UIs related with duation
	    this.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(this.videoDuration);
	    this.progressBarChildren.played.setAttribute('aria-valuemax', this.videoDuration.toFixed(3));
	    this.progressBarChildren.buffered.setAttribute('aria-valuemax', this.videoDuration.toFixed(3));
	  },
	
	  receivePlaying: function() {
	    utility.addClass(this.progressBarChildren.hoverTimebox, 'invisible');
	  }
	};
	
	module.exports = Progress;


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
	    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
	
	  var timePop = function(time) {
	    var timePopDiv = document.createElement('div');
	    timePopDiv.className = 'time-pop';
	    timePopDiv.innerHTML = time;
	    return timePopDiv;
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
	
	  var hoverTimebox = function() {
	    var hoverTimeboxDiv = document.createElement('div');
	    hoverTimeboxDiv.setAttribute('role', 'presentation');
	    hoverTimeboxDiv.setAttribute('aria-hidden', 'true');
	    hoverTimeboxDiv.className = 'hover-timebox';
	    var timePopDiv = timePop('00:00');
	    hoverTimeboxDiv.appendChild(timePopDiv);
	    return hoverTimeboxDiv;
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
	    if (_this.state.playing) {
	      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	      _this.playbuttonElem.dispatchEvent(vimeoPauseEvent);
	      _this.state.playing = false;
	    } else {
	      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
	      _this.playbuttonElem.dispatchEvent(vimeoPlayEvent);
	      _this.state.playing = true;
	    }
	  };
	
	  this.playbuttonElem.addEventListener('click', _buttonClickListener, false);
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


/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * @return{Function} createPlayButton() create a DOM element (div) for play button
	 */
	
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
	var utility = __webpack_require__(8);
	
	/**
	 * @return{Function} createPlayer() create a HTML DOM element (div) for player
	 */
	
	module.exports = (function() {
	  /**
	  * @param{Object} videoContainer, videoWrapper div HTML element
	  * @param{Object} playbuttonElem, playbutton div HTML element
	  * @param{Object} progressContainer, progressContainer div HTML element
	  * @return{Object} container, player's wrapper HTML element
	  */
	  var createPlayer = function(videoContainer, playbuttonElem, progressContainer) {
	    var container = document.createElement('div');
	    var randomId = utility.generateRandomId(10);
	    container.className = 'player-container';
	    container.setAttribute('id', randomId);
	    container.setAttribute('tabindex', 0);
	    container.style.width = videoContainer.width;
	    container.style.height = videoContainer.height;
	    container.appendChild(videoContainer.videoContainer);
	
	    var controls = document.createElement('div');
	    controls.className = 'controls';
	    controls.appendChild(playbuttonElem);
	    controls.appendChild(progressContainer);
	    container.appendChild(controls);
	
	    var player = {
	      container: container,
	      controls: controls,
	      video: videoContainer.videoContainer
	    };
	    return player;
	  };
	
	  return {
	    createPlayer: createPlayer
	  };
	
	})();


/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Pub/Sub model definition
	 */
	
	var EventManager = function() {
	  this.events = {};
	};
	
	EventManager.prototype.subscribe = function(eventName, fn) {
	  this.events[eventName] = this.events[eventName] || [];
	  this.events[eventName].push(fn);
	};
	
	EventManager.prototype.unsubscribe = function(eventName, fn) {
	  if (this.events[eventName]) {
	    for (var i = 0; i < this.events[eventName].length; i++) {
	      if (this.events[eventName][i] === fn) {
	        this.events[eventName].splice(i, 1);
	        break;
	      }
	    }
	  }
	};
	
	EventManager.prototype.publish = function(eventName, data) {
	  if (this.events[eventName]) {
	    this.events[eventName].forEach(function(fn) {
	      fn(data);
	    });
	  }
	};
	
	module.exports = EventManager;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var playerEvents = __webpack_require__(4);
	
	/**
	 * Place all publishers here. It makes logging esay!!
	 * All player's HTML elements register publishers here.
	 *
	 * @param{Object} playButton (HTML element): playpause button
	 * @param{Object} progress (HTML element): progress bar
	 * @param{Object} video (HTML element): vidoe element
	 * @param{Object} playerContainer (HTML element): a container element contains all elements
	 */
	
	module.exports = function(eventManager, playButton, progress, video, playerContainer) {
	  // playButton publishers
	  playButton.addEventListener(playerEvents.play, function() {
	    eventManager.publish(playerEvents.play);
	  }, false);
	  playButton.addEventListener(playerEvents.pause, function() {
	    eventManager.publish(playerEvents.pause);
	  }, false);
	  // progess element publishers
	  progress.addEventListener(playerEvents.seek, function(data) {
	    eventManager.publish(playerEvents.seek, data.detail);
	  }, false);
	  // video element publishers
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
	  // playerContainer element publishers
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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var playerEvents = __webpack_require__(4);
	
	/**
	 * Place all subscribers here. It also makes logging esay.
	 * All customized objects register subscribers here.
	 *
	 * @param{PlayButton} playButton
	 * @param{ProgressBar} progress
	 * @param{Video} video
	 */
	
	module.exports = function(eventManager, playButton, progress, video) {
	  // video component subscribers
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
	  // progress component subscribers
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
	  // playButton component subscribers
	  eventManager.subscribe(playerEvents.playing, function() {
	    playButton.togglePlay(playerEvents.playing);
	  });
	  eventManager.subscribe(playerEvents.pause, function() {
	    playButton.togglePlay(playerEvents.pause);
	  });
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZDc2Nzc0YzFlN2FjZTY2NmEzNiIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw4QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzNJQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTs7QUFFQSwrQkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDbElBOztBQUVBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3BCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFlBQVcsWUFBWSxLQUFLO0FBQzVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQSxtQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ3JDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzlEQTs7QUFFQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzFERDtBQUNBOztBQUVBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQSxZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsT0FBTztBQUNsQixhQUFZLE9BQU87QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzFDRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBbUIsbUNBQW1DO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNsQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7Ozs7Ozs7QUN0REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsV0FBVztBQUNyQixXQUFVLFlBQVk7QUFDdEIsV0FBVSxNQUFNO0FBQ2hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSCIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShcIlBsYXllclwiLCBbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJQbGF5ZXJcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiUGxheWVyXCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgZnVuY3Rpb24oKSB7XG5yZXR1cm4gXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uXG4gKiovIiwiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCAxZDc2Nzc0YzFlN2FjZTY2NmEzNlxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGxheWVyJyk7XG52YXIgRXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9ldmVudE1hbmFnZXIvUHViU3ViJyk7XG52YXIgcmVnaXN0ZXJQdWJzID0gcmVxdWlyZSgnLi9ldmVudE1hbmFnZXIvUHVibGlzaGVycycpO1xudmFyIHJlZ2lzdGVyU3VicyA9IHJlcXVpcmUoJy4vZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzJyk7XG5cbi8qKlxuICogQ3VzdG9tIENsYXNzOiBQbGF5ZXJcbiAqIEBwYXJhbXtTdHJpbmd9IHZpZGVvTGluazogdmlkZW8gbGlua1xuICogQHBhcmFte1N0cmluZ30gd2lkdGg6IHBsYXllcidzIHdpZHRoXG4gKiBAcGFyYW17U3RyaW5nfSBoZWlnaHQ6IHBsYXllcidzIGhlaWdodFxuICpcbiAqIG1lbWJlcnM6XG4gKiAxLiBIVE1MIGVsZW1lbnQ6IHRoaXMucGxheWVyQ29udGFpbmVyIC0gY29udGFpbnMgYWxsIGVsZW1lbnRzIGluIHRoZSBwbGF5ZXJcbiAqL1xudmFyIGFwcCA9IGZ1bmN0aW9uKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcGxheWVyID0gbmV3IFBsYXllcih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpO1xuICB2YXIgcGxheUJ1dHRvbiA9IHBsYXllci5wbGF5ZXJCdXR0b247XG4gIHZhciBwcm9ncmVzcyA9IHBsYXllci5wcm9ncmVzcztcbiAgdmFyIHZpZGVvID0gcGxheWVyLnZpZGVvO1xuICB0aGlzLnBsYXllckNvbnRhaW5lciA9IHBsYXllci5wbGF5ZXJDb250YWluZXI7XG4gIC8vIHJlZ2lzdGVyIHB1YnMvc3VicyBoZXJlLlxuICB2YXIgZXZlbnRNYW5hZ2VyID0gbmV3IEV2ZW50TWFuYWdlcigpO1xuICByZWdpc3RlclB1YnMoZXZlbnRNYW5hZ2VyLCBwbGF5QnV0dG9uLnBsYXlidXR0b25FbGVtLCBwcm9ncmVzcy5wcm9ncmVzc0NvbnRhaW5lcix2aWRlby52aWRlb0NvbnRhaW5lciwgdGhpcy5wbGF5ZXJDb250YWluZXIpO1xuICByZWdpc3RlclN1YnMoZXZlbnRNYW5hZ2VyLCBwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBWaWRlbyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvVmlkZW8nKTtcbnZhciBQcm9ncmVzcyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXInKTtcbnZhciBQbGF5QnV0dG9uID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QbGF5QnV0dG9uJyk7XG52YXIgUGxheWVyRWxlbSA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllckVsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xuXG4vKipcbiAqIEN1c3RvbSBjbGFzczogUGxheWVyXG4gKlxuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rOiB2aWRlbyBsaW5rXG4gKiBAcGFyYW17U3RyaW5nfSB3aWR0aDogcGxheWVyJ3Mgd2lkdGhcbiAqIEBwYXJhbXtTdHJpbmd9IGhlaWdodDogcGxheWVyJ3MgaGVpZ2h0XG4gKlxuICogbWVtYmVyczpcbiAqIDEuIEhUTUwgb2JqZWN0OiB0aGlzLnBsYXllckNvbnRhaW5lciAtIGNvbnRhaW5zIGFsbCBlbGVtZW50c1xuICogMi4gVmlkZW8gb2JqZWN0OiB0aGlzLnZpZGVvLCBpdCBvcGVucyBQbGF5ZXIncyBBUElzLlxuICovXG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy5wbGF5ZXJCdXR0b24gPSBuZXcgUGxheUJ1dHRvbigpO1xuICB0aGlzLnByb2dyZXNzID0gbmV3IFByb2dyZXNzKCk7XG4gIHRoaXMudmlkZW8gPSBuZXcgVmlkZW8odmlkZW9MaW5rKTtcbiAgdmFyIHBsYXlidXR0b25FbGVtID0gdGhpcy5wbGF5ZXJCdXR0b24ucGxheWJ1dHRvbkVsZW07XG4gIHZhciBwcm9ncmVzc0NvbnRhaW5lciA9IHRoaXMucHJvZ3Jlc3MucHJvZ3Jlc3NDb250YWluZXI7XG4gIHZhciB2aWRlb0NvbnRhaW5lciA9IHRoaXMudmlkZW8udmlkZW9Db250YWluZXI7XG4gIHZhciB2aWRlb1dyYXBwZXIgPSB7XG4gICAgdmlkZW9Db250YWluZXI6IHZpZGVvQ29udGFpbmVyLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xuICB2YXIgcGxheWVyRWxlbSA9IFBsYXllckVsZW0uY3JlYXRlUGxheWVyKHZpZGVvV3JhcHBlciwgcGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzQ29udGFpbmVyKTtcbiAgdmFyIHBsYXllckNvbnRyb2xzID0gcGxheWVyRWxlbS5jb250cm9scztcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBwbGF5ZXJFbGVtLmNvbnRhaW5lcjtcblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB2YXIgaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgdmFyIGxlZnRBcnJvd0NvdW50ID0gMDtcbiAgdmFyIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gIHZhciBtb3VzZVN0b3BUaW1lciA9IG51bGw7XG5cbiAgLyoqXG4gICogcHJpdmF0ZSBtZXRob2RzIC0gbWFpbmx5IGZvciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdmFyIF9yZXNldE1vdXNlU3RvcFRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICB9XG4gICAgaWYgKHV0aWxpdHkuaGFzQ2xhc3MocGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKSkge1xuICAgICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250cm9scywgJ2ludmlzaWJsZScpO1xuICAgIH1cbiAgICBtb3VzZVN0b3BUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250cm9scywgJ2ludmlzaWJsZScpO1xuICAgIH0sIDMwMDApO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF9yZXNldE1vdXNlU3RvcFRpbWVyKCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9tb3VzZUxlYXZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNNb3VzZURvd24pIHtcbiAgICAgIHV0aWxpdHkuYWRkQ2xhc3MocGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKTtcbiAgICB9XG4gICAgX3RoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9jb250cm9sc01vdXNlTGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfY29udHJvbHNNb3VzZUVudGVyTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHBsYXllckNvbnRyb2xzLCAnaW52aXNpYmxlJyk7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICBfdGhpcy5wbGF5ZXJDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2tleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgX3Jlc2V0TW91c2VTdG9wVGltZXIoKTtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdmlkZW9Ub2dnbGVQbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgICBfdGhpcy5wbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1RvZ2dsZVBsYXlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XG4gICAgICByaWdodEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciByZXdpbmREYXRhID0geyBzdGVwczogcmlnaHRBcnJvd0NvdW50IH07XG4gICAgICB2YXIgcmV3aW5kRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucmV3aW5kLCByZXdpbmREYXRhKTtcbiAgICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHJld2luZEV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIGxlZnRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgZmFzdEZvcndhcmREYXRhID0geyBzdGVwczogbGVmdEFycm93Q291bnQgfTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmYXN0Rm9yd2FyZERhdGEpO1xuICAgICAgX3RoaXMucGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZmFzdEZvcndhcmRFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfa2V5dXBMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XG4gICAgICByaWdodEFycm93Q291bnQgPSAwO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgbGVmdEFycm93Q291bnQgPSAwO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2NsaWNrRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5mb2N1cygpO1xuICB9O1xuXG4gIC8qKlxuICAqIEFkZCBldmVudGxpc3RlbmVycyBoZXJlXG4gICovXG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfa2V5ZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgX2tleXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VMZWF2ZUxpc3RuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfY2xpY2tFdmVudExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgcGxheWVyQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIF9jb250cm9sc01vdXNlRW50ZXJMaXN0ZW5lciwgZmFsc2UpO1xuICBwbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9WaWRlb0VsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbi8qKlxuICogQ3VzdG9tIGNsYXNzOiBWaWRlb1xuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rLCB2aWRlbyBzb3VyY2UgbGlua1xuICpcbiAqIG1lbWJlcnM6XG4gKiAxLiBIVE1MIGVsZW1lbnQ6IHRoaXMudmlkZW9Db250YWluZXIgLSBjb250YWlucyB2aWRlbyBlbGVtZW50XG4gKiAyLiBWaWRlbyBzdGF0ZTogdGhpcy52aWRlb1xuICogSW4gb3JkZXIgdG8gYWNjZXNzIHRvIFZpZGVvIG9iamVjdCBhbmQgY2hhbmdlIHN0YXRlcywgdXNlIHByb3RvdHlwZSdzIG1ldGhvZHMgKEFQSXMpXG4gKiBAc2VlIFZpZGVvLnByb3RvdHlwZVxuICovXG5cbnZhciBWaWRlbyA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICB0aGlzLnZpZGVvQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICB0aGlzLnZpZGVvID0ge1xuICAgIGR1cmF0aW9uOiAwLFxuICAgIGN1cnJlbnRUaW1lOiAwLFxuICAgIGJ1ZmZlcmVkOiAwLFxuICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgIHBsYXllcjogdGhpcy52aWRlb0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZFxuICB9O1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIC8qKlxuICAqIHByaXZhdGUgbWV0aG9kcyAtIG1haW5seSBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHZhciBfdXBkYXRlUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSAgX3RoaXMudmlkZW8ucGxheWVyLmJ1ZmZlcmVkO1xuICAgIGlmIChidWZmZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYnVmZmVyZWRFbmQgPSBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSk7XG4gICAgICB2YXIgYnVmZmVyRGF0YSA9IHsgYnVmZmVyZWQ6IGJ1ZmZlcmVkRW5kIH07XG4gICAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2xvYWRlZGRhdGFMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnZpZGVvLmR1cmF0aW9uID0gX3RoaXMudmlkZW8ucGxheWVyLmR1cmF0aW9uO1xuICAgIHZhciBkdXJhdGlvbkRhdGEgPSB7IGR1cmF0aW9uOiAgX3RoaXMudmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgX3RoaXMudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuICAgIF91cGRhdGVQcm9ncmVzcygpO1xuICB9O1xuXG4gIHZhciBfdGltZXVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgX3RoaXMudmlkZW8uY3VycmVudFRpbWUgPSAgX3RoaXMudmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuICAgIHZhciB0aWNrRGF0YSA9IHsgY3VycmVudFRpbWU6IF90aGlzLnZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvVGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRpY2ssIHRpY2tEYXRhKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiAgX3RoaXMudmlkZW8uY3VycmVudFRpbWUgfTtcbiAgICB2YXIgdmlkZW9QbGF5ZWRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5ZWQsIHBsYXllZFByb2dyZXNzRGF0YSk7XG4gICAgX3RoaXMudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfdXBkYXRlUHJvZ3Jlc3MoKTtcbiAgfTtcblxuICB2YXIgX3BsYXlpbmdMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWRlb1BsYXlpbmdFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvUGxheWluZ0V2ZW50KTtcbiAgfTtcblxuICB2YXIgX3BhdXNlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpbWVvUGF1c2VFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZUNsaWNrTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnRvZ2dsZVBsYXkoKTtcbiAgfTtcblxuICAvKipcbiAgKiByZWdpc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdGhpcy52aWRlb0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9tb3VzZUNsaWNrTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8vXG4vLyBWaWRlbyBBUElzLCBvdGhlciBlbGVtZW50cyBjaGFuZ2UgdmlkZW8gc3RhdGVzIGZyb20gaGVyZS5cbi8vIEFsc28sIGlmIHBsYXllciBleHBvc2UgYSB2aWRlbyBvYmplY3QsIHRoZW4gdGhlc2UgQVBJcyBiZWNvbWUgdGhlIHBsYXllcidzIEFQSXMuXG4vL1xuVmlkZW8ucHJvdG90eXBlID0ge1xuICBzZWVrOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdGhpcy52aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgIHRoaXMudmlkZW8ucGxheWluZyA9IHRydWU7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgdGhpcy52aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH0sXG5cbiAgZmFzdEZvcndhcmQ6IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgcmV3aW5kOiBmdW5jdGlvbihzdGVwcykge1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgLT0gc3RlcHM7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IHZpZGVvRWxlbWVudCgpIGNyZWF0ZSBhIERPTSBlbGVtZW50ICh3cmFwcGVyIGRpdikgZm9yIHZpZGVvXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogQWxsIFZpZW1vIFBsYXllciBjdXN0b20gZXZlbnQgbmFtZXMgYXJlIGhlcmVcbipcbiogQHJldHVybiB7T2JqZWN0fSBjb250YWlucyBhbGwgY3VzdG9tIGV2ZW50IG5hbWVzXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmlkZW9SZWFkeTogJ3ZpbWVvVmlkZW9SZWFkeScsXG4gIHBsYXk6ICd2aW1lb1BsYXknLFxuICBwbGF5aW5nOiAndmltZW9QbGF5aW5nJyxcbiAgcGF1c2U6ICd2aW1lb1BhdXNlJyxcbiAgdG9nZ2xlUGxheTogJ3RvZ2dsZVBsYXknLFxuICBzZWVrOiAndmltZW9TZWVrJyxcbiAgYnVmZmVyZWQ6ICd2aW1lb0J1ZmZlcmVkJyxcbiAgcHJvZ3Jlc3N1cGRhdGU6ICd2aW1lb1Byb2dyZXNzVXBkZGF0ZScsXG4gIHBsYXllZDogJ3ZpZW1vUGxheWVkJyxcbiAgdGljazogJ3ZpbWVvVGljaycsXG4gIGZhc3RGb3J3YXJkOiAndmllbW9GYXN0Rm9yd2FyZCcsXG4gIHJld2luZDogJ3ZpbWVvUmV3aW5kJ1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbi8qKlxuKiBjcmVhdGUgYSBjdXN0b20gZXZlbnQgZm9yIGEgSFRNTCBlbGVtZW50LCBvbmx5IHRoZSBzYW1lIGVsZW1lbnQgY2FuIGxpc3RlbiB0by5cbiogaXQncyB0aGUgZWxlbWVudCdzIGludGVybmFsIGV2ZW50c1xuKiBsb2FkIFBvbHlmaWxsIGZpcnN0IGZvciBJRVxuKlxuKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4qIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBwYXNzZWQgd2l0aCB0aGUgZXZlbnRcbiogQHJldHVybiB7Q3VzdG9tRXZlbnR9IG9yIHtFdmVudH1cbipcbiovXG5cbnJlcXVpcmUoJy4vUG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgJ2RldGFpbCc6IGRhdGFcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBuZXcgRXZlbnQoZXZlbnROYW1lKTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiAqIFBvbHlmaWxscyBmb3IgJ0N1c3RvbUV2ZW50JyBhbmQgJ0V2ZW50JyBvYmplY3QuXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEV2ZW50KGV2ZW50TmFtZSkge1xuICAgIHZhciBwYXJhbXMgPSB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSB9O1xuICAgIHZhciBldnQ7XG4gICAgaWYgKGRvY3VtZW50LmNyZWF0ZUV2ZW50KSB7XG4gICAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0RXZlbnQoZXZlbnROYW1lLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgZXZ0LmV2ZW50VHlwZSA9IGV2ZW50TmFtZTtcbiAgICB9XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gIHdpbmRvdy5FdmVudCA9IEV2ZW50O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9Qb2x5ZmlsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV0aWxpdHkgPSByZXF1aXJlKCcuLi91dGlsaXR5L1V0aWxpdHknKTtcbnZhciBwcm9ncmVzc1dyYXBwZXIgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5ZXJQcm9ncmVzc0VsZW1lbnQuanMnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbi8qKlxuICogQ3VzdG9tIGNsYXNzOiBQcm9ncmVzc1xuICogbWVtYmVycyAtIEhUTUwgZWxlbWVudHNcbiAqIC0gdGhpcy5wcm9ncmVzc0JhcixcbiAqIC0gdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuIC0gYSBjb2xsZWN0aW9uIG9mIGNoaWxkIERPTXMgb2YgcHJvZ3Jlc3NCYXJcbiAqXG4gKiBJbiBvcmRlciB0byBhY2Nlc3MgdG8gdGhpcyBvYmplY3QsIHVzZSBwcm90b3R5cGUncyBtZXRob2RzIChBUElzKVxuICogQHNlZSBQcm9ncmVzcy5wcm90b3R5cGVcbiAqL1xuXG52YXIgUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMucHJvZ3Jlc3NDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbiA9IHtcbiAgICBidWZmZXJlZDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblswXSxcbiAgICBwbGF5ZWQ6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMV0sXG4gICAgaG92ZXJUaW1lYm94OiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzJdLFxuICAgIHRpbWVCb3g6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM11cbiAgfTtcblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB2YXIgaXNNb3VzZURvd24gPSBmYWxzZTtcblxuICAvKipcbiAgKiBwcml2YXRlIG1ldGhvZHMgLSBtYWlubHkgZm9yIGV2ZW50IGxpc3RlbmVyc1xuICAqL1xuICB2YXIgX2dldE1vdXNlUG9zaXRpb24gPSBmdW5jdGlvbihlLCBwcm9ncmVzc0Jhcikge1xuICAgIHZhciBtUG9zeCA9IDA7XG4gICAgdmFyIGVQb3N4ID0gMDtcbiAgICB2YXIgb2JqID0gcHJvZ3Jlc3NCYXI7XG5cbiAgICAvLyBnZXQgbW91c2UgcG9zaXRpb24gb24gZG9jdW1lbnQgY3Jvc3Nicm93c2VyXG4gICAgaWYgKCFlKSBlID0gd2luZG93LmV2ZW50O1xuICAgIGlmIChlLnBhZ2VYKSB7XG4gICAgICBtUG9zeCA9IGUucGFnZVg7XG4gICAgfSBlbHNlIGlmIChlLmNsaWVudCkge1xuICAgICAgbVBvc3ggPSBlLmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDtcbiAgICB9XG4gICAgd2hpbGUgKG9iai5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGVQb3N4ICs9IG9iai5vZmZzZXRMZWZ0O1xuICAgICAgb2JqID0gb2JqLm9mZnNldFBhcmVudDtcbiAgICB9XG5cbiAgICB2YXIgb2Zmc2V0ID0gbVBvc3ggLSBlUG9zeDtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IG9mZnNldCAvIHByb2dyZXNzQmFyLm9mZnNldFdpZHRoO1xuICAgIHJldHVybiBob3ZlclBvc2l0aW9uO1xuICB9O1xuXG4gIHZhciBfZGlzcGF0Y2hTZWVrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBfdGhpcy5wcm9ncmVzc0Jhcik7XG4gICAgdmFyIGRhdGEgPSB7IGN1cnJlbnRUaW1lOiBfdGhpcy52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgX3RoaXMucHJvZ3Jlc3NDb250YWluZXIuZGlzcGF0Y2hFdmVudChzZWVrRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIF90aGlzLnByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSBfdGhpcy52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgfTtcblxuICB2YXIgX21vdXNlbGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94IGludmlzaWJsZSc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIF90aGlzLnByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSBfdGhpcy52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpc01vdXNlRG93biA9IHRydWU7XG4gICAgX3RoaXMucGxheWVyQ29udGFpbmVyID0gX3RoaXMucHJvZ3Jlc3NDb250YWluZXIucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIHV0aWxpdHkuYWRkQ2xhc3MoX3RoaXMucGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG5cbiAgICAvLyBvbmx5IGFkZCBtb3VzZW1vdmUgdG8gZG9jdW1lbnQgd2hlbiBtb3VzZSBkb3duIHRvIHByb2dyZXNzQmFyIGhhcHBlbmVkXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBfdGhpcy5wcm9ncmVzc0Jhci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFpc01vdXNlRG93bikgcmV0dXJuO1xuICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3MoX3RoaXMucGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG5cbiAgICAvLyB3aGVuIG1vdXNlIGlzIHVwIHJlbW92ZSBtb3VzZW1vdmUgZXZlbnQgZnJvbSBkb2N1bWVudEVsZW1lbnRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgLyoqXG4gICogcmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZWxlYXZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfbW91c2Vkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG4vL1xuLy8gUHJvZ3Jlc3MgQVBJcywgb3RoZXIgZWxlbWVudHMgY2hhbmdlIHByb2dyZXNzIHN0YXRlcyBmcm9tIGhlcmUuXG4vLyBBbHNvLCBpZiBwbGF5ZXIgZXhwb3NlIGEgUHJvZ3Jlc3Mgb2JqZWN0LCB0aGVuIHRoZXNlIEFQSXMgYmVjb21lIHRoZSBwbGF5ZXIncyBBUElzLlxuLy9cblByb2dyZXNzLnByb3RvdHlwZSA9IHtcbiAgdmlkZW9EdXJhdGlvbjogMCxcblxuICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh0aGlzLnZpZGVvRHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICAgIHZhciBwbGF5ZWRQZWNlbnRhZ2UgPSBkYXRhLnByb2dyZXNzIC8gdGhpcy52aWRlb0R1cmF0aW9uICogMTAwO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSBwbGF5ZWRQZWNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5zdHlsZS5sZWZ0ID0gcGxheWVkUGVjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBkYXRhLnByb2dyZXNzKTtcbiAgICB2YXIgcGxheWVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEucHJvZ3Jlc3MpICsgJyBwbGF5ZWQnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIHBsYXllZEFyaWFUZXh0KTtcbiAgfSxcblxuICB1cGRhdGVCdWZmZXJlZFByb2dyZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHRoaXMudmlkZW9EdXJhdGlvbiA8PSAwKSByZXR1cm47XG4gICAgdmFyIGJ1ZmZlcmVkUGVyY2VudGFnZSA9IGRhdGEuYnVmZmVyZWQgLyB0aGlzLnZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnN0eWxlLndpZHRoID0gYnVmZmVyZWRQZXJjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEuYnVmZmVyZWQpO1xuICAgIHZhciBidWZmZXJlZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLmJ1ZmZlcmVkKSArICcgYnVmZmVyZWQnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgYnVmZmVyZWRBcmlhVGV4dCk7XG4gIH0sXG5cbiAgdXBkYXRlVGltZUJveDogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGN1cnJlbnRUaW1lO1xuICB9LFxuXG4gIHVwZGF0ZVRpY2s6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfSxcblxuICB1cGRhdGVEdXJhdGlvbjogZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMudmlkZW9EdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG4gICAgLy8gdXBkYXRlIFVJcyByZWxhdGVkIHdpdGggZHVhdGlvblxuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKHRoaXMudmlkZW9EdXJhdGlvbik7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCB0aGlzLnZpZGVvRHVyYXRpb24udG9GaXhlZCgzKSk7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIHRoaXMudmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgfSxcblxuICByZWNlaXZlUGxheWluZzogZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyh0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LCAnaW52aXNpYmxlJyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZ3Jlc3M7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzcGxpdFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICB9XG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgfVxuICAgIGlmIChob3VycyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICB9LFxuXG4gIHJlYWRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgdmFyIHNlY29uZFN0cmluZyA9ICcgc2Vjb25kcyc7XG4gICAgdmFyIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlcyc7XG4gICAgdmFyIGhvdXJTdHJpbmcgPSAnIGhvdXJzJztcbiAgICBpZiAoc2Vjb25kcyA8PSAxKSB7XG4gICAgICBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZCc7XG4gICAgfVxuICAgIGlmIChtaW51dGVzIDw9IDEpIHtcbiAgICAgIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlJztcbiAgICB9XG4gICAgaWYgKGhvdXJzIDw9IDEpIHtcbiAgICAgIGhvdXJTdHJpbmcgPSAnIGhvdXInO1xuICAgIH1cblxuICAgIGlmICh0aW1lSW5TZWNvbmRzIDwgNjApIHtcbiAgICAgIHJldHVybiBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAodGltZUluU2Vjb25kcyA+PSA2MCAmJiB0aW1lSW5TZWNvbmRzIDwgMzYwMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyBtaW51dGVTdHJpbmcgKyAnLCAnICsgc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGhvdXJzICsgaG91clN0cmluZyArICcsICcgKyBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfVxuICB9LFxuXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpO1xuICAgIH1cbiAgfSxcblxuICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgfSxcblxuICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpO1xuICAgICAgZWwuY2xhc3NOYW1lPWVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgJyAnKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2VuZXJhdGVSYW5kb21JZDogZnVuY3Rpb24oaWRMZW5ndGgpIHtcbiAgICB2YXIgaWQgPSAnJztcbiAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSc7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gaWRMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmFuZFBvcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcbiAgICAgICAgaWQgKz0gY2hhclNldFtyYW5kUG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1V0aWxpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHJldHVybntGdW5jdGlvbn0gcHJvZ3Jlc3NXcmFwcGVyKCkgY3JlYXRlIGEgRE9NIGVsZW1lbnQgKHdyYXBwZXIgZGl2KSBmb3IgcHJvZ3Jlc3MgYmFyXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1ZmZlcmVkRGl2LmNsYXNzTmFtZSA9ICdidWZmZXJlZCc7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ2J1ZmZlcmVkJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIGJ1ZmZlcmVkRGl2O1xuICB9O1xuXG4gIHZhciBwbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXllZCcpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciB0aW1lUG9wID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB0aW1lUG9wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVBvcERpdi5jbGFzc05hbWUgPSAndGltZS1wb3AnO1xuICAgIHRpbWVQb3BEaXYuaW5uZXJIVE1MID0gdGltZTtcbiAgICByZXR1cm4gdGltZVBvcERpdjtcbiAgfTtcblxuICB2YXIgdGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB0aW1lYm94RGl2LmNsYXNzTmFtZSA9ICd0aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgdGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gdGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgaG92ZXJUaW1lYm94ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhvdmVyVGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvdmVyVGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCAndHJ1ZScpO1xuICAgIGhvdmVyVGltZWJveERpdi5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIGhvdmVyVGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gaG92ZXJUaW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciBjcmVhdGVQcm9ncmVzc1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWRFbGVtZW50ID0gYnVmZmVyZWQoKTtcbiAgICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICAgIHZhciBob3ZlclRpbWVib3hFbGVtZW50ID0gaG92ZXJUaW1lYm94KCk7XG4gICAgdmFyIHRpbWVCb3hFbGVtZW50ID0gdGltZWJveCgpO1xuICAgIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3Byb2dyZXNzJztcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGhvdmVyVGltZWJveEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZCh0aW1lQm94RWxlbWVudCk7XG4gICAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzV3JhcHBlci5jbGFzc05hbWUgPSAncHJvZ3Jlc3Mtd3JhcHBlcic7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmFwcGVuZENoaWxkKHByb2dyZXNzRWxlbWVudCk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyOiBjcmVhdGVQcm9ncmVzc1dyYXBwZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGxheUJ1dHRvbkVsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudCcpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcblxuLyoqXG4gKiBDdXN0b20gY2xhc3M6IFBsYXlCdXR0b25cbiAqXG4gKiBtZW1iZXJzOlxuICogMS4gSFRNTCBlbGVtZW50OiBwbGF5YnV0dG9uRWxlbSAtIGNvbnRhaW5zIGJ1dHRvbiBlbGVtZW50XG4gKiAyLiBQbGF5aW5nIHN0YXRlOiB0aGlzLnN0YXRlc1xuICogSW4gb3JkZXIgdG8gYWNjZXNzIHRvIFBsYXlCdXR0b24gb2JqZWN0LCB1c2UgcHJvdG90eXBlJ3MgbWV0aG9kcyAoQVBJcylcbiAqIEBzZWUgUGxheUJ1dHRvbi5wcm90b3R5cGVcbiAqL1xuXG52YXIgUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnBsYXlidXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW1lbnQuY3JlYXRlUGxheUJ1dHRvbigpO1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHZhciBfYnV0dG9uQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKF90aGlzLnN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgICAgX3RoaXMucGxheWJ1dHRvbkVsZW0uZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICAgICAgX3RoaXMuc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmltZW9QbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgICBfdGhpcy5wbGF5YnV0dG9uRWxlbS5kaXNwYXRjaEV2ZW50KHZpbWVvUGxheUV2ZW50KTtcbiAgICAgIF90aGlzLnN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnBsYXlidXR0b25FbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2J1dHRvbkNsaWNrTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cblBsYXlCdXR0b24ucHJvdG90eXBlID0ge1xuICBzdGF0ZToge1xuICAgICdwbGF5aW5nJzogZmFsc2VcbiAgfSxcblxuICB0b2dnbGVQbGF5OiBmdW5jdGlvbihldmVudE5hbWUpIHtcbiAgICB2YXIgcGxheWJ1dHRvbiA9IHRoaXMucGxheWJ1dHRvbkVsZW07XG4gICAgdmFyIHN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB2YXIgcGxheUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzBdO1xuICAgIHZhciBwYXVzZUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzFdO1xuICAgIGlmIChldmVudE5hbWUgPT09IHBsYXllckV2ZW50cy5wYXVzZSkge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBwYXVzZUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBwYXVzZUljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BhdXNlJyk7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGF1c2UnKTtcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheUJ1dHRvbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcmV0dXJue0Z1bmN0aW9ufSBjcmVhdGVQbGF5QnV0dG9uKCkgY3JlYXRlIGEgRE9NIGVsZW1lbnQgKGRpdikgZm9yIHBsYXkgYnV0dG9uXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5QnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5LWljb24nO1xuICAgIHZhciBwbGF5U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3BvbHlnb24nKTtcbiAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgJzEsMCAyMCwxMCAxLDIwJyk7XG4gICAgcGxheVNWRy5hcHBlbmRDaGlsZChwb2x5Z29uKTtcbiAgICBwbGF5QnV0dG9uLmFwcGVuZENoaWxkKHBsYXlTVkcpO1xuICAgIHJldHVybiBwbGF5QnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVQYXVzZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBhdXNlQnV0dG9uLmNsYXNzTmFtZSA9ICdwYXVzZS1pY29uJztcbiAgICB2YXIgcGF1c2VTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgbGVmdFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKGxlZnRSZWN0KTtcbiAgICB2YXIgcmlnaHRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcxMicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKHJpZ2h0UmVjdCk7XG4gICAgcGF1c2VCdXR0b24uYXBwZW5kQ2hpbGQocGF1c2VTVkcpO1xuICAgIHJldHVybiBwYXVzZUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncGxheSc7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5Jyk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGxheScpO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IGNyZWF0ZVBsYXllcigpIGNyZWF0ZSBhIEhUTUwgRE9NIGVsZW1lbnQgKGRpdikgZm9yIHBsYXllclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgKiBAcGFyYW17T2JqZWN0fSB2aWRlb0NvbnRhaW5lciwgdmlkZW9XcmFwcGVyIGRpdiBIVE1MIGVsZW1lbnRcbiAgKiBAcGFyYW17T2JqZWN0fSBwbGF5YnV0dG9uRWxlbSwgcGxheWJ1dHRvbiBkaXYgSFRNTCBlbGVtZW50XG4gICogQHBhcmFte09iamVjdH0gcHJvZ3Jlc3NDb250YWluZXIsIHByb2dyZXNzQ29udGFpbmVyIGRpdiBIVE1MIGVsZW1lbnRcbiAgKiBAcmV0dXJue09iamVjdH0gY29udGFpbmVyLCBwbGF5ZXIncyB3cmFwcGVyIEhUTUwgZWxlbWVudFxuICAqL1xuICB2YXIgY3JlYXRlUGxheWVyID0gZnVuY3Rpb24odmlkZW9Db250YWluZXIsIHBsYXlidXR0b25FbGVtLCBwcm9ncmVzc0NvbnRhaW5lcikge1xuICAgIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2YXIgcmFuZG9tSWQgPSB1dGlsaXR5LmdlbmVyYXRlUmFuZG9tSWQoMTApO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnaWQnLCByYW5kb21JZCk7XG4gICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSB2aWRlb0NvbnRhaW5lci53aWR0aDtcbiAgICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gdmlkZW9Db250YWluZXIuaGVpZ2h0O1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlb0NvbnRhaW5lci52aWRlb0NvbnRhaW5lcik7XG5cbiAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnY29udHJvbHMnO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHBsYXlidXR0b25FbGVtKTtcbiAgICBjb250cm9scy5hcHBlbmRDaGlsZChwcm9ncmVzc0NvbnRhaW5lcik7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRyb2xzKTtcblxuICAgIHZhciBwbGF5ZXIgPSB7XG4gICAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICAgIGNvbnRyb2xzOiBjb250cm9scyxcbiAgICAgIHZpZGVvOiB2aWRlb0NvbnRhaW5lci52aWRlb0NvbnRhaW5lclxuICAgIH07XG4gICAgcmV0dXJuIHBsYXllcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXllcjogY3JlYXRlUGxheWVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXllckVsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFB1Yi9TdWIgbW9kZWwgZGVmaW5pdGlvblxuICovXG5cbnZhciBFdmVudE1hbmFnZXIgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5ldmVudHMgPSB7fTtcbn07XG5cbkV2ZW50TWFuYWdlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbn07XG5cbkV2ZW50TWFuYWdlci5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZS5wdWJsaXNoID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICBmbihkYXRhKTtcbiAgICB9KTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFdmVudE1hbmFnZXI7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG5cbi8qKlxuICogUGxhY2UgYWxsIHB1Ymxpc2hlcnMgaGVyZS4gSXQgbWFrZXMgbG9nZ2luZyBlc2F5ISFcbiAqIEFsbCBwbGF5ZXIncyBIVE1MIGVsZW1lbnRzIHJlZ2lzdGVyIHB1Ymxpc2hlcnMgaGVyZS5cbiAqXG4gKiBAcGFyYW17T2JqZWN0fSBwbGF5QnV0dG9uIChIVE1MIGVsZW1lbnQpOiBwbGF5cGF1c2UgYnV0dG9uXG4gKiBAcGFyYW17T2JqZWN0fSBwcm9ncmVzcyAoSFRNTCBlbGVtZW50KTogcHJvZ3Jlc3MgYmFyXG4gKiBAcGFyYW17T2JqZWN0fSB2aWRlbyAoSFRNTCBlbGVtZW50KTogdmlkb2UgZWxlbWVudFxuICogQHBhcmFte09iamVjdH0gcGxheWVyQ29udGFpbmVyIChIVE1MIGVsZW1lbnQpOiBhIGNvbnRhaW5lciBlbGVtZW50IGNvbnRhaW5zIGFsbCBlbGVtZW50c1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnRNYW5hZ2VyLCBwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAvLyBwbGF5QnV0dG9uIHB1Ymxpc2hlcnNcbiAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheSk7XG4gIH0sIGZhbHNlKTtcbiAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgfSwgZmFsc2UpO1xuICAvLyBwcm9nZXNzIGVsZW1lbnQgcHVibGlzaGVyc1xuICBwcm9ncmVzcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICAvLyB2aWRlbyBlbGVtZW50IHB1Ymxpc2hlcnNcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gIH0sIGZhbHNlKTtcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gIH0sIGZhbHNlKTtcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gIH0sIGZhbHNlKTtcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICB9LCBmYWxzZSk7XG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICB9LCBmYWxzZSk7XG4gIC8vIHBsYXllckNvbnRhaW5lciBlbGVtZW50IHB1Ymxpc2hlcnNcbiAgcGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXksIGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50b2dnbGVQbGF5KTtcbiAgfSwgZmFsc2UpO1xuICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucmV3aW5kLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnJld2luZCwgZGF0YS5kZXRhaWwpO1xuICB9LCBmYWxzZSk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHVibGlzaGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcblxuLyoqXG4gKiBQbGFjZSBhbGwgc3Vic2NyaWJlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4gKiBBbGwgY3VzdG9taXplZCBvYmplY3RzIHJlZ2lzdGVyIHN1YnNjcmliZXJzIGhlcmUuXG4gKlxuICogQHBhcmFte1BsYXlCdXR0b259IHBsYXlCdXR0b25cbiAqIEBwYXJhbXtQcm9ncmVzc0Jhcn0gcHJvZ3Jlc3NcbiAqIEBwYXJhbXtWaWRlb30gdmlkZW9cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV2ZW50TWFuYWdlciwgcGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvKSB7XG4gIC8vIHZpZGVvIGNvbXBvbmVudCBzdWJzY3JpYmVyc1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5wbGF5KCk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGF1c2UoKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2aWRlby5zZWVrKGRhdGEuY3VycmVudFRpbWUpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8udG9nZ2xlUGxheSgpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2aWRlby5mYXN0Rm9yd2FyZChkYXRhLnN0ZXBzKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnJld2luZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHZpZGVvLnJld2luZChkYXRhLnN0ZXBzKTtcbiAgfSk7XG4gIC8vIHByb2dyZXNzIGNvbXBvbmVudCBzdWJzY3JpYmVyc1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3MudXBkYXRlRHVyYXRpb24oZGF0YSk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzcy5yZWNlaXZlUGxheWluZyhwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzLnVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MoZGF0YSk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzcy51cGRhdGVQbGF5ZWRQcm9ncmVzcyhkYXRhKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzcy51cGRhdGVUaWNrKGRhdGEpO1xuICB9KTtcbiAgLy8gcGxheUJ1dHRvbiBjb21wb25lbnQgc3Vic2NyaWJlcnNcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgcGxheUJ1dHRvbi50b2dnbGVQbGF5KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgfSk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==