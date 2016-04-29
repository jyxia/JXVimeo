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
	  this.video = video;
	  // register pubs/subs here.
	  var eventManager = new EventManager();
	  registerPubs(eventManager, playButton.playbuttonElem, progress.progressContainer,video.videoContainer, this.playerContainer);
	  registerSubs(eventManager, playButton, progress, video, player);
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
	
	Player.prototype.receivePlaying = function() {
	  var playingEvent = createCustomEvent('playing');
	  this.playerContainer.dispatchEvent(playingEvent);
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
	  },
	
	  isPlaying: function() {
	    return this.video.playing;
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
	
	module.exports = function(eventManager, playButton, progress, video, player) {
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
	  // player component subscribers
	  eventManager.subscribe(playerEvents.playing, function() {
	    player.receivePlaying(playerEvents.playing);
	  });
	};


/***/ }
/******/ ])
});
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA0NTczOWU1NzNiYTg2NmZiZTVlMCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaEpBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBOztBQUVBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUN0SUE7O0FBRUE7QUFDQSxZQUFXLFNBQVM7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDcEJEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakIsWUFBVyxZQUFZLEtBQUs7QUFDNUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOzs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBLG1CQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDckNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDdktBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0Esb0JBQW1CLGVBQWU7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDbEZBOztBQUVBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzFFRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUM1REE7O0FBRUE7QUFDQSxZQUFXLFNBQVM7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxREQ7QUFDQTs7QUFFQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0EsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEIsYUFBWSxPQUFPO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxQ0Q7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW1CLG1DQUFtQztBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBOztBQUVBOzs7Ozs7O0FDbENBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIOzs7Ozs7O0FDdERBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLFdBQVc7QUFDckIsV0FBVSxZQUFZO0FBQ3RCLFdBQVUsTUFBTTtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUc7QUFDSDtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQSxJQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwiUGxheWVyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlBsYXllclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJQbGF5ZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIDQ1NzM5ZTU3M2JhODY2ZmJlNWUwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QbGF5ZXInKTtcbnZhciBFdmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL2V2ZW50TWFuYWdlci9QdWJTdWInKTtcbnZhciByZWdpc3RlclB1YnMgPSByZXF1aXJlKCcuL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzJyk7XG52YXIgcmVnaXN0ZXJTdWJzID0gcmVxdWlyZSgnLi9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMnKTtcblxuLyoqXG4gKiBDdXN0b20gQ2xhc3M6IFBsYXllclxuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rOiB2aWRlbyBsaW5rXG4gKiBAcGFyYW17U3RyaW5nfSB3aWR0aDogcGxheWVyJ3Mgd2lkdGhcbiAqIEBwYXJhbXtTdHJpbmd9IGhlaWdodDogcGxheWVyJ3MgaGVpZ2h0XG4gKlxuICogbWVtYmVyczpcbiAqIDEuIEhUTUwgZWxlbWVudDogdGhpcy5wbGF5ZXJDb250YWluZXIgLSBjb250YWlucyBhbGwgZWxlbWVudHMgaW4gdGhlIHBsYXllclxuICovXG52YXIgYXBwID0gZnVuY3Rpb24odmlkZW9MaW5rLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCk7XG4gIHZhciBwbGF5QnV0dG9uID0gcGxheWVyLnBsYXllckJ1dHRvbjtcbiAgdmFyIHByb2dyZXNzID0gcGxheWVyLnByb2dyZXNzO1xuICB2YXIgdmlkZW8gPSBwbGF5ZXIudmlkZW87XG4gIHRoaXMucGxheWVyQ29udGFpbmVyID0gcGxheWVyLnBsYXllckNvbnRhaW5lcjtcbiAgdGhpcy52aWRlbyA9IHZpZGVvO1xuICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgdmFyIGV2ZW50TWFuYWdlciA9IG5ldyBFdmVudE1hbmFnZXIoKTtcbiAgcmVnaXN0ZXJQdWJzKGV2ZW50TWFuYWdlciwgcGxheUJ1dHRvbi5wbGF5YnV0dG9uRWxlbSwgcHJvZ3Jlc3MucHJvZ3Jlc3NDb250YWluZXIsdmlkZW8udmlkZW9Db250YWluZXIsIHRoaXMucGxheWVyQ29udGFpbmVyKTtcbiAgcmVnaXN0ZXJTdWJzKGV2ZW50TWFuYWdlciwgcGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvLCBwbGF5ZXIpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBWaWRlbyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvVmlkZW8nKTtcbnZhciBQcm9ncmVzcyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXInKTtcbnZhciBQbGF5QnV0dG9uID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QbGF5QnV0dG9uJyk7XG52YXIgUGxheWVyRWxlbSA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllckVsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xuXG4vKipcbiAqIEN1c3RvbSBjbGFzczogUGxheWVyXG4gKlxuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rOiB2aWRlbyBsaW5rXG4gKiBAcGFyYW17U3RyaW5nfSB3aWR0aDogcGxheWVyJ3Mgd2lkdGhcbiAqIEBwYXJhbXtTdHJpbmd9IGhlaWdodDogcGxheWVyJ3MgaGVpZ2h0XG4gKlxuICogbWVtYmVyczpcbiAqIDEuIEhUTUwgb2JqZWN0OiB0aGlzLnBsYXllckNvbnRhaW5lciAtIGNvbnRhaW5zIGFsbCBlbGVtZW50c1xuICogMi4gVmlkZW8gb2JqZWN0OiB0aGlzLnZpZGVvLCBpdCBvcGVucyBQbGF5ZXIncyBBUElzLlxuICovXG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy5wbGF5ZXJCdXR0b24gPSBuZXcgUGxheUJ1dHRvbigpO1xuICB0aGlzLnByb2dyZXNzID0gbmV3IFByb2dyZXNzKCk7XG4gIHRoaXMudmlkZW8gPSBuZXcgVmlkZW8odmlkZW9MaW5rKTtcbiAgdmFyIHBsYXlidXR0b25FbGVtID0gdGhpcy5wbGF5ZXJCdXR0b24ucGxheWJ1dHRvbkVsZW07XG4gIHZhciBwcm9ncmVzc0NvbnRhaW5lciA9IHRoaXMucHJvZ3Jlc3MucHJvZ3Jlc3NDb250YWluZXI7XG4gIHZhciB2aWRlb0NvbnRhaW5lciA9IHRoaXMudmlkZW8udmlkZW9Db250YWluZXI7XG4gIHZhciB2aWRlb1dyYXBwZXIgPSB7XG4gICAgdmlkZW9Db250YWluZXI6IHZpZGVvQ29udGFpbmVyLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9O1xuICB2YXIgcGxheWVyRWxlbSA9IFBsYXllckVsZW0uY3JlYXRlUGxheWVyKHZpZGVvV3JhcHBlciwgcGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzQ29udGFpbmVyKTtcbiAgdmFyIHBsYXllckNvbnRyb2xzID0gcGxheWVyRWxlbS5jb250cm9scztcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIgPSBwbGF5ZXJFbGVtLmNvbnRhaW5lcjtcblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB2YXIgaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgdmFyIGxlZnRBcnJvd0NvdW50ID0gMDtcbiAgdmFyIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gIHZhciBtb3VzZVN0b3BUaW1lciA9IG51bGw7XG5cbiAgLyoqXG4gICogcHJpdmF0ZSBtZXRob2RzIC0gbWFpbmx5IGZvciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdmFyIF9yZXNldE1vdXNlU3RvcFRpbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB7XG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICB9XG4gICAgaWYgKHV0aWxpdHkuaGFzQ2xhc3MocGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKSkge1xuICAgICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250cm9scywgJ2ludmlzaWJsZScpO1xuICAgIH1cbiAgICBtb3VzZVN0b3BUaW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250cm9scywgJ2ludmlzaWJsZScpO1xuICAgIH0sIDMwMDApO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF9yZXNldE1vdXNlU3RvcFRpbWVyKCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9tb3VzZUxlYXZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNNb3VzZURvd24pIHtcbiAgICAgIHV0aWxpdHkuYWRkQ2xhc3MocGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKTtcbiAgICB9XG4gICAgX3RoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF9jb250cm9sc01vdXNlTGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfY29udHJvbHNNb3VzZUVudGVyTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHBsYXllckNvbnRyb2xzLCAnaW52aXNpYmxlJyk7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICBfdGhpcy5wbGF5ZXJDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2tleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgX3Jlc2V0TW91c2VTdG9wVGltZXIoKTtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdmlkZW9Ub2dnbGVQbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgICBfdGhpcy5wbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1RvZ2dsZVBsYXlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XG4gICAgICByaWdodEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciByZXdpbmREYXRhID0geyBzdGVwczogcmlnaHRBcnJvd0NvdW50IH07XG4gICAgICB2YXIgcmV3aW5kRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucmV3aW5kLCByZXdpbmREYXRhKTtcbiAgICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHJld2luZEV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIGxlZnRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgZmFzdEZvcndhcmREYXRhID0geyBzdGVwczogbGVmdEFycm93Q291bnQgfTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmYXN0Rm9yd2FyZERhdGEpO1xuICAgICAgX3RoaXMucGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoZmFzdEZvcndhcmRFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfa2V5dXBMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XG4gICAgICByaWdodEFycm93Q291bnQgPSAwO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgbGVmdEFycm93Q291bnQgPSAwO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2NsaWNrRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnBsYXllckNvbnRhaW5lci5mb2N1cygpO1xuICB9O1xuXG4gIC8qKlxuICAqIEFkZCBldmVudGxpc3RlbmVycyBoZXJlXG4gICovXG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfa2V5ZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgX2tleXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0bmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VMZWF2ZUxpc3RuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfY2xpY2tFdmVudExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgcGxheWVyQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIF9jb250cm9sc01vdXNlRW50ZXJMaXN0ZW5lciwgZmFsc2UpO1xuICBwbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5QbGF5ZXIucHJvdG90eXBlLnJlY2VpdmVQbGF5aW5nID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5aW5nRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudCgncGxheWluZycpO1xuICB0aGlzLnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHBsYXlpbmdFdmVudCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9WaWRlb0VsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbi8qKlxuICogQ3VzdG9tIGNsYXNzOiBWaWRlb1xuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rLCB2aWRlbyBzb3VyY2UgbGlua1xuICpcbiAqIG1lbWJlcnM6XG4gKiAxLiBIVE1MIGVsZW1lbnQ6IHRoaXMudmlkZW9Db250YWluZXIgLSBjb250YWlucyB2aWRlbyBlbGVtZW50XG4gKiAyLiBWaWRlbyBzdGF0ZTogdGhpcy52aWRlb1xuICogSW4gb3JkZXIgdG8gYWNjZXNzIHRvIFZpZGVvIG9iamVjdCBhbmQgY2hhbmdlIHN0YXRlcywgdXNlIHByb3RvdHlwZSdzIG1ldGhvZHMgKEFQSXMpXG4gKiBAc2VlIFZpZGVvLnByb3RvdHlwZVxuICovXG5cbnZhciBWaWRlbyA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICB0aGlzLnZpZGVvQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICB0aGlzLnZpZGVvID0ge1xuICAgIGR1cmF0aW9uOiAwLFxuICAgIGN1cnJlbnRUaW1lOiAwLFxuICAgIGJ1ZmZlcmVkOiAwLFxuICAgIHBsYXlpbmc6IGZhbHNlLFxuICAgIHBsYXllcjogdGhpcy52aWRlb0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZFxuICB9O1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIC8qKlxuICAqIHByaXZhdGUgbWV0aG9kcyAtIG1haW5seSBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHZhciBfdXBkYXRlUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSAgX3RoaXMudmlkZW8ucGxheWVyLmJ1ZmZlcmVkO1xuICAgIGlmIChidWZmZXJlZC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgYnVmZmVyZWRFbmQgPSBidWZmZXJlZC5lbmQoYnVmZmVyZWQubGVuZ3RoIC0gMSk7XG4gICAgICB2YXIgYnVmZmVyRGF0YSA9IHsgYnVmZmVyZWQ6IGJ1ZmZlcmVkRW5kIH07XG4gICAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2xvYWRlZGRhdGFMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnZpZGVvLmR1cmF0aW9uID0gX3RoaXMudmlkZW8ucGxheWVyLmR1cmF0aW9uO1xuICAgIHZhciBkdXJhdGlvbkRhdGEgPSB7IGR1cmF0aW9uOiAgX3RoaXMudmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgX3RoaXMudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuICAgIF91cGRhdGVQcm9ncmVzcygpO1xuICB9O1xuXG4gIHZhciBfdGltZXVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgX3RoaXMudmlkZW8uY3VycmVudFRpbWUgPSAgX3RoaXMudmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuICAgIHZhciB0aWNrRGF0YSA9IHsgY3VycmVudFRpbWU6IF90aGlzLnZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvVGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRpY2ssIHRpY2tEYXRhKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiAgX3RoaXMudmlkZW8uY3VycmVudFRpbWUgfTtcbiAgICB2YXIgdmlkZW9QbGF5ZWRFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5ZWQsIHBsYXllZFByb2dyZXNzRGF0YSk7XG4gICAgX3RoaXMudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfdXBkYXRlUHJvZ3Jlc3MoKTtcbiAgfTtcblxuICB2YXIgX3BsYXlpbmdMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWRlb1BsYXlpbmdFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvUGxheWluZ0V2ZW50KTtcbiAgfTtcblxuICB2YXIgX3BhdXNlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICBfdGhpcy52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpbWVvUGF1c2VFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZUNsaWNrTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF90aGlzLnRvZ2dsZVBsYXkoKTtcbiAgfTtcblxuICAvKipcbiAgKiByZWdpc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdGhpcy52aWRlb0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9tb3VzZUNsaWNrTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8vXG4vLyBWaWRlbyBBUElzLCBvdGhlciBlbGVtZW50cyBjaGFuZ2UgdmlkZW8gc3RhdGVzIGZyb20gaGVyZS5cbi8vIEFsc28sIGlmIHBsYXllciBleHBvc2UgYSB2aWRlbyBvYmplY3QsIHRoZW4gdGhlc2UgQVBJcyBiZWNvbWUgdGhlIHBsYXllcidzIEFQSXMuXG4vL1xuVmlkZW8ucHJvdG90eXBlID0ge1xuICBzZWVrOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdGhpcy52aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgIHRoaXMudmlkZW8ucGxheWluZyA9IHRydWU7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgdGhpcy52aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH0sXG5cbiAgZmFzdEZvcndhcmQ6IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgcmV3aW5kOiBmdW5jdGlvbihzdGVwcykge1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgLT0gc3RlcHM7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lO1xuICB9LFxuXG4gIGlzUGxheWluZzogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudmlkZW8ucGxheWluZztcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBWaWRlbztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9WaWRlby5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAcmV0dXJue0Z1bmN0aW9ufSB2aWRlb0VsZW1lbnQoKSBjcmVhdGUgYSBET00gZWxlbWVudCAod3JhcHBlciBkaXYpIGZvciB2aWRlb1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlVmlkZW9FbGVtZW50ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIHZpZGVvQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmlkZW9Db250YWluZXIuY2xhc3NOYW1lID0gJ3ZpZGVvLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgdmlkZW9MaW5rKTtcbiAgICB2aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlb0VsZW1lbnQpO1xuICAgIHJldHVybiB2aWRlb0NvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHZpZGVvRWxlbWVudDogY3JlYXRlVmlkZW9FbGVtZW50XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1ZpZGVvRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4qIEFsbCBWaWVtbyBQbGF5ZXIgY3VzdG9tIGV2ZW50IG5hbWVzIGFyZSBoZXJlXG4qXG4qIEByZXR1cm4ge09iamVjdH0gY29udGFpbnMgYWxsIGN1c3RvbSBldmVudCBuYW1lc1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGxheWluZzogJ3ZpbWVvUGxheWluZycsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHRvZ2dsZVBsYXk6ICd0b2dnbGVQbGF5JyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICd2aWVtb1BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snLFxuICBmYXN0Rm9yd2FyZDogJ3ZpZW1vRmFzdEZvcndhcmQnLFxuICByZXdpbmQ6ICd2aW1lb1Jld2luZCdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiogY3JlYXRlIGEgY3VzdG9tIGV2ZW50IGZvciBhIEhUTUwgZWxlbWVudCwgb25seSB0aGUgc2FtZSBlbGVtZW50IGNhbiBsaXN0ZW4gdG8uXG4qIGl0J3MgdGhlIGVsZW1lbnQncyBpbnRlcm5hbCBldmVudHNcbiogbG9hZCBQb2x5ZmlsbCBmaXJzdCBmb3IgSUVcbipcbiogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4qIEByZXR1cm4ge0N1c3RvbUV2ZW50fSBvciB7RXZlbnR9XG4qXG4qL1xuXG5yZXF1aXJlKCcuL1BvbHlmaWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICdkZXRhaWwnOiBkYXRhXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4gKiBQb2x5ZmlsbHMgZm9yICdDdXN0b21FdmVudCcgYW5kICdFdmVudCcgb2JqZWN0LlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKSB7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHsgYnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZCB9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH1cblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiB3aW5kb3cuRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICBmdW5jdGlvbiBFdmVudChldmVudE5hbWUpIHtcbiAgICB2YXIgcGFyYW1zID0geyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UgfTtcbiAgICB2YXIgZXZ0O1xuICAgIGlmIChkb2N1bWVudC5jcmVhdGVFdmVudCkge1xuICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICBldnQuaW5pdEV2ZW50KGV2ZW50TmFtZSwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgIGV2dC5ldmVudFR5cGUgPSBldmVudE5hbWU7XG4gICAgfVxuICAgIHJldHVybiBldnQ7XG4gIH1cblxuICBFdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuRXZlbnQgPSBFdmVudDtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG4vKipcbiAqIEN1c3RvbSBjbGFzczogUHJvZ3Jlc3NcbiAqIG1lbWJlcnMgLSBIVE1MIGVsZW1lbnRzXG4gKiAtIHRoaXMucHJvZ3Jlc3NCYXIsXG4gKiAtIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbiAtIGEgY29sbGVjdGlvbiBvZiBjaGlsZCBET01zIG9mIHByb2dyZXNzQmFyXG4gKlxuICogSW4gb3JkZXIgdG8gYWNjZXNzIHRvIHRoaXMgb2JqZWN0LCB1c2UgcHJvdG90eXBlJ3MgbWV0aG9kcyAoQVBJcylcbiAqIEBzZWUgUHJvZ3Jlc3MucHJvdG90eXBlXG4gKi9cblxudmFyIFByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJvZ3Jlc3NDb250YWluZXIgPSBwcm9ncmVzc1dyYXBwZXIucHJvZ3Jlc3NXcmFwcGVyKCk7XG4gIHRoaXMucHJvZ3Jlc3NCYXIgPSB0aGlzLnByb2dyZXNzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4gPSB7XG4gICAgYnVmZmVyZWQ6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMF0sXG4gICAgcGxheWVkOiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzFdLFxuICAgIGhvdmVyVGltZWJveDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblsyXSxcbiAgICB0aW1lQm94OiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzNdXG4gIH07XG5cbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG5cbiAgLyoqXG4gICogcHJpdmF0ZSBtZXRob2RzIC0gbWFpbmx5IGZvciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgX2Rpc3BhdGNoU2VlayA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgX3RoaXMucHJvZ3Jlc3NCYXIpO1xuICAgIHZhciBkYXRhID0geyBjdXJyZW50VGltZTogX3RoaXMudmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb24gfTtcbiAgICB2YXIgc2Vla0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnNlZWssIGRhdGEpO1xuICAgIF90aGlzLnByb2dyZXNzQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoc2Vla0V2ZW50KTtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBfdGhpcy5wcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gX3RoaXMudmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb247XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIF90aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWxlYXZlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3dubW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBfdGhpcy5wcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gX3RoaXMudmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb247XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBfdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIF90aGlzLnBsYXllckNvbnRhaW5lciA9IF90aGlzLnByb2dyZXNzQ29udGFpbmVyLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB1dGlsaXR5LmFkZENsYXNzKF90aGlzLnBsYXllckNvbnRhaW5lciwgJ2dyYWJiYWJsZScpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuXG4gICAgLy8gb25seSBhZGQgbW91c2Vtb3ZlIHRvIGRvY3VtZW50IHdoZW4gbW91c2UgZG93biB0byBwcm9ncmVzc0JhciBoYXBwZW5lZFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgX3RoaXMucHJvZ3Jlc3NCYXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNNb3VzZURvd24pIHJldHVybjtcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKF90aGlzLnBsYXllckNvbnRhaW5lciwgJ2dyYWJiYWJsZScpO1xuICAgIF90aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgLy8gd2hlbiBtb3VzZSBpcyB1cCByZW1vdmUgbW91c2Vtb3ZlIGV2ZW50IGZyb20gZG9jdW1lbnRFbGVtZW50XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIC8qKlxuICAqIHJlZ2lzdGVyIGV2ZW50IGxpc3RlbmVyc1xuICAqL1xuICB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VsZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX21vdXNldXBMaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuLy9cbi8vIFByb2dyZXNzIEFQSXMsIG90aGVyIGVsZW1lbnRzIGNoYW5nZSBwcm9ncmVzcyBzdGF0ZXMgZnJvbSBoZXJlLlxuLy8gQWxzbywgaWYgcGxheWVyIGV4cG9zZSBhIFByb2dyZXNzIG9iamVjdCwgdGhlbiB0aGVzZSBBUElzIGJlY29tZSB0aGUgcGxheWVyJ3MgQVBJcy5cbi8vXG5Qcm9ncmVzcy5wcm90b3R5cGUgPSB7XG4gIHZpZGVvRHVyYXRpb246IDAsXG5cbiAgdXBkYXRlUGxheWVkUHJvZ3Jlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAodGhpcy52aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgcGxheWVkUGVjZW50YWdlID0gZGF0YS5wcm9ncmVzcyAvIHRoaXMudmlkZW9EdXJhdGlvbiAqIDEwMDtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnN0eWxlLndpZHRoID0gcGxheWVkUGVjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5wcm9ncmVzcyk7XG4gICAgdmFyIHBsYXllZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLnByb2dyZXNzKSArICcgcGxheWVkJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCBwbGF5ZWRBcmlhVGV4dCk7XG4gIH0sXG5cbiAgdXBkYXRlQnVmZmVyZWRQcm9ncmVzczogZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh0aGlzLnZpZGVvRHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICAgIHZhciBidWZmZXJlZFBlcmNlbnRhZ2UgPSBkYXRhLmJ1ZmZlcmVkIC8gdGhpcy52aWRlb0R1cmF0aW9uICogMTAwO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zdHlsZS53aWR0aCA9IGJ1ZmZlcmVkUGVyY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBkYXRhLmJ1ZmZlcmVkKTtcbiAgICB2YXIgYnVmZmVyZWRBcmlhVGV4dCA9IHV0aWxpdHkucmVhZFRpbWUoZGF0YS5idWZmZXJlZCkgKyAnIGJ1ZmZlcmVkJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIGJ1ZmZlcmVkQXJpYVRleHQpO1xuICB9LFxuXG4gIHVwZGF0ZVRpbWVCb3g6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBjdXJyZW50VGltZTtcbiAgfSxcblxuICB1cGRhdGVUaWNrOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gIH0sXG5cbiAgdXBkYXRlRHVyYXRpb246IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLnZpZGVvRHVyYXRpb24gPSBkYXRhLmR1cmF0aW9uO1xuICAgIC8vIHVwZGF0ZSBVSXMgcmVsYXRlZCB3aXRoIGR1YXRpb25cbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZSh0aGlzLnZpZGVvRHVyYXRpb24pO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdGhpcy52aWRlb0R1cmF0aW9uLnRvRml4ZWQoMykpO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCB0aGlzLnZpZGVvRHVyYXRpb24udG9GaXhlZCgzKSk7XG4gIH0sXG5cbiAgcmVjZWl2ZVBsYXlpbmc6IGZ1bmN0aW9uKCkge1xuICAgIHV0aWxpdHkuYWRkQ2xhc3ModGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveCwgJ2ludmlzaWJsZScpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFByb2dyZXNzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgfVxuICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgIH1cbiAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgfSxcblxuICByZWFkVGltZTogZnVuY3Rpb24odGltZUluU2Vjb25kcykge1xuICAgIHZhciB0bSA9IG5ldyBEYXRlKHRpbWVJblNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgaG91cnMgPSB0bS5nZXRVVENIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdG0uZ2V0VVRDTWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gdG0uZ2V0VVRDU2Vjb25kcygpO1xuICAgIHZhciBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZHMnO1xuICAgIHZhciBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZXMnO1xuICAgIHZhciBob3VyU3RyaW5nID0gJyBob3Vycyc7XG4gICAgaWYgKHNlY29uZHMgPD0gMSkge1xuICAgICAgc2Vjb25kU3RyaW5nID0gJyBzZWNvbmQnO1xuICAgIH1cbiAgICBpZiAobWludXRlcyA8PSAxKSB7XG4gICAgICBtaW51dGVTdHJpbmcgPSAnIG1pbnV0ZSc7XG4gICAgfVxuICAgIGlmIChob3VycyA8PSAxKSB7XG4gICAgICBob3VyU3RyaW5nID0gJyBob3VyJztcbiAgICB9XG5cbiAgICBpZiAodGltZUluU2Vjb25kcyA8IDYwKSB7XG4gICAgICByZXR1cm4gc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2UgaWYgKHRpbWVJblNlY29uZHMgPj0gNjAgJiYgdGltZUluU2Vjb25kcyA8IDM2MDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBob3VycyArIGhvdXJTdHJpbmcgKyAnLCAnICsgbWludXRlcyArIG1pbnV0ZVN0cmluZyArICcsICcgKyBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH1cbiAgfSxcblxuICBoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIWVsLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpKTtcbiAgICB9XG4gIH0sXG5cbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKTtcbiAgICAgIGVsLmNsYXNzTmFtZT1lbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJyk7XG4gICAgfVxuICB9LFxuXG4gIGdlbmVyYXRlUmFuZG9tSWQ6IGZ1bmN0aW9uKGlkTGVuZ3RoKSB7XG4gICAgdmFyIGlkID0gJyc7XG4gICAgdmFyIGNoYXJTZXQgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODknO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGlkTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJhbmRQb3MgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XG4gICAgICAgIGlkICs9IGNoYXJTZXRbcmFuZFBvc107XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9VdGlsaXR5LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IHByb2dyZXNzV3JhcHBlcigpIGNyZWF0ZSBhIERPTSBlbGVtZW50ICh3cmFwcGVyIGRpdikgZm9yIHByb2dyZXNzIGJhclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgYnVmZmVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdidWZmZXJlZCcpO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIDApO1xuICAgIHJldHVybiBidWZmZXJlZERpdjtcbiAgfTtcblxuICB2YXIgcGxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllZERpdi5jbGFzc05hbWUgPSAncGxheWVkJztcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5ZWQnKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIHBsYXllZERpdjtcbiAgfTtcblxuICB2YXIgdGltZVBvcCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgdGltZVBvcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVQb3BEaXYuY2xhc3NOYW1lID0gJ3RpbWUtcG9wJztcbiAgICB0aW1lUG9wRGl2LmlubmVySFRNTCA9IHRpbWU7XG4gICAgcmV0dXJuIHRpbWVQb3BEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIHRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIHRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIGhvdmVyVGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBob3ZlclRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIGhvdmVyVGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIGhvdmVyVGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRWxlbWVudCA9IGJ1ZmZlcmVkKCk7XG4gICAgdmFyIHBsYXllZEVsZW1lbnQgPSBwbGF5ZWQoKTtcbiAgICB2YXIgaG92ZXJUaW1lYm94RWxlbWVudCA9IGhvdmVyVGltZWJveCgpO1xuICAgIHZhciB0aW1lQm94RWxlbWVudCA9IHRpbWVib3goKTtcbiAgICB2YXIgcHJvZ3Jlc3NFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmNsYXNzTmFtZSA9ICdwcm9ncmVzcyc7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGJ1ZmZlcmVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHBsYXllZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChob3ZlclRpbWVib3hFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGltZUJveEVsZW1lbnQpO1xuICAgIHZhciBwcm9ncmVzc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc1dyYXBwZXIuY2xhc3NOYW1lID0gJ3Byb2dyZXNzLXdyYXBwZXInO1xuICAgIHByb2dyZXNzV3JhcHBlci5hcHBlbmRDaGlsZChwcm9ncmVzc0VsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzV3JhcHBlcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHByb2dyZXNzV3JhcHBlcjogY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBsYXlCdXR0b25FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG5cbi8qKlxuICogQ3VzdG9tIGNsYXNzOiBQbGF5QnV0dG9uXG4gKlxuICogbWVtYmVyczpcbiAqIDEuIEhUTUwgZWxlbWVudDogcGxheWJ1dHRvbkVsZW0gLSBjb250YWlucyBidXR0b24gZWxlbWVudFxuICogMi4gUGxheWluZyBzdGF0ZTogdGhpcy5zdGF0ZXNcbiAqIEluIG9yZGVyIHRvIGFjY2VzcyB0byBQbGF5QnV0dG9uIG9iamVjdCwgdXNlIHByb3RvdHlwZSdzIG1ldGhvZHMgKEFQSXMpXG4gKiBAc2VlIFBsYXlCdXR0b24ucHJvdG90eXBlXG4gKi9cblxudmFyIFBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5YnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtZW50LmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgdmFyIF90aGlzID0gdGhpcztcblxuICB2YXIgX2J1dHRvbkNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmIChfdGhpcy5wbGF5aW5nKSB7XG4gICAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICAgIF90aGlzLnBsYXlidXR0b25FbGVtLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgICAgIF90aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpbWVvUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXkpO1xuICAgICAgX3RoaXMucGxheWJ1dHRvbkVsZW0uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICBfdGhpcy5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5wbGF5YnV0dG9uRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9idXR0b25DbGlja0xpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5QbGF5QnV0dG9uLnByb3RvdHlwZSA9IHtcbiAgcGxheWluZzogZmFsc2UsXG5cbiAgdG9nZ2xlUGxheTogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgdmFyIHBsYXlidXR0b24gPSB0aGlzLnBsYXlidXR0b25FbGVtO1xuICAgIHZhciBwbGF5SWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMF07XG4gICAgdmFyIHBhdXNlSWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMV07XG5cbiAgICBpZiAoZXZlbnROYW1lID09PSBwbGF5ZXJFdmVudHMucGF1c2UpIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB0aGlzLnBsYXlpbmcgPSBmYWxzZTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBwYXVzZUljb24uc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGF1c2UnKTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwYXVzZScpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5QnV0dG9uO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IGNyZWF0ZVBsYXlCdXR0b24oKSBjcmVhdGUgYSBET00gZWxlbWVudCAoZGl2KSBmb3IgcGxheSBidXR0b25cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXlCdXR0b24uY2xhc3NOYW1lID0gJ3BsYXktaWNvbic7XG4gICAgdmFyIHBsYXlTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIHBvbHlnb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncG9seWdvbicpO1xuICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKCdwb2ludHMnLCAnMSwwIDIwLDEwIDEsMjAnKTtcbiAgICBwbGF5U1ZHLmFwcGVuZENoaWxkKHBvbHlnb24pO1xuICAgIHBsYXlCdXR0b24uYXBwZW5kQ2hpbGQocGxheVNWRyk7XG4gICAgcmV0dXJuIHBsYXlCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVBhdXNlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGF1c2VCdXR0b24uY2xhc3NOYW1lID0gJ3BhdXNlLWljb24nO1xuICAgIHZhciBwYXVzZVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBsZWZ0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQobGVmdFJlY3QpO1xuICAgIHZhciByaWdodFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzEyJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQocmlnaHRSZWN0KTtcbiAgICBwYXVzZUJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZVNWRyk7XG4gICAgcmV0dXJuIHBhdXNlQnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5JztcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgdmFyIHBsYXlCdG4gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgIHZhciBwYXVzZUJ0biA9IGNyZWF0ZVBhdXNlQnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlQnRuKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUGxheUJ1dHRvbjogY3JlYXRlQnV0dG9uXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG5cbi8qKlxuICogQHJldHVybntGdW5jdGlvbn0gY3JlYXRlUGxheWVyKCkgY3JlYXRlIGEgSFRNTCBET00gZWxlbWVudCAoZGl2KSBmb3IgcGxheWVyXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAqIEBwYXJhbXtPYmplY3R9IHZpZGVvQ29udGFpbmVyLCB2aWRlb1dyYXBwZXIgZGl2IEhUTUwgZWxlbWVudFxuICAqIEBwYXJhbXtPYmplY3R9IHBsYXlidXR0b25FbGVtLCBwbGF5YnV0dG9uIGRpdiBIVE1MIGVsZW1lbnRcbiAgKiBAcGFyYW17T2JqZWN0fSBwcm9ncmVzc0NvbnRhaW5lciwgcHJvZ3Jlc3NDb250YWluZXIgZGl2IEhUTUwgZWxlbWVudFxuICAqIEByZXR1cm57T2JqZWN0fSBjb250YWluZXIsIHBsYXllcidzIHdyYXBwZXIgSFRNTCBlbGVtZW50XG4gICovXG4gIHZhciBjcmVhdGVQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0NvbnRhaW5lciwgcGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzQ29udGFpbmVyKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZhciByYW5kb21JZCA9IHV0aWxpdHkuZ2VuZXJhdGVSYW5kb21JZCgxMCk7XG4gICAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdwbGF5ZXItY29udGFpbmVyJztcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsIHJhbmRvbUlkKTtcbiAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHZpZGVvQ29udGFpbmVyLndpZHRoO1xuICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSB2aWRlb0NvbnRhaW5lci5oZWlnaHQ7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvQ29udGFpbmVyLnZpZGVvQ29udGFpbmVyKTtcblxuICAgIHZhciBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheWJ1dHRvbkVsZW0pO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHByb2dyZXNzQ29udGFpbmVyKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbHMpO1xuXG4gICAgdmFyIHBsYXllciA9IHtcbiAgICAgIGNvbnRhaW5lcjogY29udGFpbmVyLFxuICAgICAgY29udHJvbHM6IGNvbnRyb2xzLFxuICAgICAgdmlkZW86IHZpZGVvQ29udGFpbmVyLnZpZGVvQ29udGFpbmVyXG4gICAgfTtcbiAgICByZXR1cm4gcGxheWVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUGxheWVyOiBjcmVhdGVQbGF5ZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogUHViL1N1YiBtb2RlbCBkZWZpbml0aW9uXG4gKi9cblxudmFyIEV2ZW50TWFuYWdlciA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmV2ZW50cyA9IHt9O1xufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xufTtcblxuRXZlbnRNYW5hZ2VyLnByb3RvdHlwZS51bnN1YnNjcmliZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5FdmVudE1hbmFnZXIucHJvdG90eXBlLnB1Ymxpc2ggPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgIGZuKGRhdGEpO1xuICAgIH0pO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50TWFuYWdlcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1B1YlN1Yi5qc1xuICoqIG1vZHVsZSBpZCA9IDEzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcblxuLyoqXG4gKiBQbGFjZSBhbGwgcHVibGlzaGVycyBoZXJlLiBJdCBtYWtlcyBsb2dnaW5nIGVzYXkhIVxuICogQWxsIHBsYXllcidzIEhUTUwgZWxlbWVudHMgcmVnaXN0ZXIgcHVibGlzaGVycyBoZXJlLlxuICpcbiAqIEBwYXJhbXtPYmplY3R9IHBsYXlCdXR0b24gKEhUTUwgZWxlbWVudCk6IHBsYXlwYXVzZSBidXR0b25cbiAqIEBwYXJhbXtPYmplY3R9IHByb2dyZXNzIChIVE1MIGVsZW1lbnQpOiBwcm9ncmVzcyBiYXJcbiAqIEBwYXJhbXtPYmplY3R9IHZpZGVvIChIVE1MIGVsZW1lbnQpOiB2aWRvZSBlbGVtZW50XG4gKiBAcGFyYW17T2JqZWN0fSBwbGF5ZXJDb250YWluZXIgKEhUTUwgZWxlbWVudCk6IGEgY29udGFpbmVyIGVsZW1lbnQgY29udGFpbnMgYWxsIGVsZW1lbnRzXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihldmVudE1hbmFnZXIsIHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbywgcGxheWVyQ29udGFpbmVyKSB7XG4gIC8vIHBsYXlCdXR0b24gcHVibGlzaGVyc1xuICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgfSwgZmFsc2UpO1xuICBwbGF5QnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICB9LCBmYWxzZSk7XG4gIC8vIHByb2dlc3MgZWxlbWVudCBwdWJsaXNoZXJzXG4gIHByb2dyZXNzLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YS5kZXRhaWwpO1xuICB9LCBmYWxzZSk7XG4gIC8vIHZpZGVvIGVsZW1lbnQgcHVibGlzaGVyc1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZGF0YS5kZXRhaWwpO1xuICB9LCBmYWxzZSk7XG4gIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5ZWQsIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRpY2ssIGRhdGEuZGV0YWlsKTtcbiAgfSwgZmFsc2UpO1xuICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gIH0sIGZhbHNlKTtcbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wYXVzZSk7XG4gIH0sIGZhbHNlKTtcbiAgLy8gcGxheWVyQ29udGFpbmVyIGVsZW1lbnQgcHVibGlzaGVyc1xuICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXkpO1xuICB9LCBmYWxzZSk7XG4gIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZGF0YS5kZXRhaWwpO1xuICB9LCBmYWxzZSk7XG4gIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucmV3aW5kLCBkYXRhLmRldGFpbCk7XG4gIH0sIGZhbHNlKTtcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xuXG4vKipcbiAqIFBsYWNlIGFsbCBzdWJzY3JpYmVycyBoZXJlLiBJdCBhbHNvIG1ha2VzIGxvZ2dpbmcgZXNheS5cbiAqIEFsbCBjdXN0b21pemVkIG9iamVjdHMgcmVnaXN0ZXIgc3Vic2NyaWJlcnMgaGVyZS5cbiAqXG4gKiBAcGFyYW17UGxheUJ1dHRvbn0gcGxheUJ1dHRvblxuICogQHBhcmFte1Byb2dyZXNzQmFyfSBwcm9ncmVzc1xuICogQHBhcmFte1ZpZGVvfSB2aWRlb1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnRNYW5hZ2VyLCBwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllcikge1xuICAvLyB2aWRlbyBjb21wb25lbnQgc3Vic2NyaWJlcnNcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheSgpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnBhdXNlKCk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmlkZW8uc2VlayhkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXksIGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnRvZ2dsZVBsYXkoKTtcbiAgfSk7XG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmlkZW8uZmFzdEZvcndhcmQoZGF0YS5zdGVwcyk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2aWRlby5yZXdpbmQoZGF0YS5zdGVwcyk7XG4gIH0pO1xuICAvLyBwcm9ncmVzcyBjb21wb25lbnQgc3Vic2NyaWJlcnNcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzLnVwZGF0ZUR1cmF0aW9uKGRhdGEpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3MucmVjZWl2ZVBsYXlpbmcocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICB9KTtcbiAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgfSk7XG4gIC8vIHBsYXlCdXR0b24gY29tcG9uZW50IHN1YnNjcmliZXJzXG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gIH0pO1xuICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgcGxheUJ1dHRvbi50b2dnbGVQbGF5KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gIH0pO1xuICAvLyBwbGF5ZXIgY29tcG9uZW50IHN1YnNjcmliZXJzXG4gIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgIHBsYXllci5yZWNlaXZlUGxheWluZyhwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gIH0pO1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=