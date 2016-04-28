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
	var Player = __webpack_require__(1);
	
	var app = function(videoLink, width, height) {
	  var player = new Player(videoLink, width, height);
	  return player;
	};
	
	module.exports = app;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Video = __webpack_require__(2);
	var Progress = __webpack_require__(7);
	var PlayButton = __webpack_require__(10);
	var publishers = __webpack_require__(12);
	var subscribers = __webpack_require__(14);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	var utility = __webpack_require__(8);
	
	/**
	 * Custom Class: Player
	 * @param{String} videoLink: video link
	 * @param{String} width: player's width
	 * @param{String} height: player's height
	 * members:
	 * 1. DOM objects: this.playerContainer - contains all elements
	 * 2. Video object: this.video, it opens Player's APIs.
	 */
	
	var Player = function(videoLink, width, height) {
	  this.video = new Video(videoLink);
	  var container = document.createElement('div');
	  var randomId = utility.generateRandomId(10);
	  container.className = 'player-container';
	  container.setAttribute('id', randomId);
	  container.setAttribute('tabindex', 0);
	
	  container.style.width = width;
	  container.style.height = height;
	  container.appendChild(this.video.videoContainer);
	
	  var controls = document.createElement('div');
	  controls.className = 'controls';
	  var playBtn = new PlayButton();
	  controls.appendChild(playBtn.playbuttonElem);
	  var progress = new Progress();
	  controls.appendChild(progress.progressContainer);
	  container.appendChild(controls);
	
	  this.playerControls = controls;
	  this.playerContainer = container;
	
	  // register pubs/subs here.
	  publishers.init(playBtn.playbuttonElem, progress.progressContainer, this.video.videoContainer, this.playerContainer);
	  subscribers.init(playBtn, progress, this.video);
	
	  var that = this;
	  var isMouseDown = false;
	  var leftArrowCount = 0;
	  var rightArrowCount = 0;
	  var mouseStopTimer = null;
	
	  var _resetMouseStopTimer = function() {
	    if (mouseStopTimer) {
	      window.clearTimeout(mouseStopTimer);
	    }
	    if (utility.hasClass(that.playerControls, 'invisible')) {
	      utility.removeClass(that.playerControls, 'invisible');
	    }
	    mouseStopTimer = window.setTimeout(function() {
	      utility.addClass(that.playerControls, 'invisible');
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
	      utility.addClass(that.playerControls, 'invisible');
	    }
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseLeaveListener = function() {
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseEnterListener = function() {
	    utility.removeClass(that.playerControls, 'invisible');
	    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
	    that.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _keydownListener = function(event) {
	    _resetMouseStopTimer();
	    if (event.keyCode === 32) {
	      event.preventDefault();
	      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
	      that.playerContainer.dispatchEvent(videoTogglePlayEvent);
	    }
	
	    if (event.keyCode === 37) {
	      rightArrowCount += 1;
	      var rewindData = { steps: rightArrowCount };
	      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
	      that.playerContainer.dispatchEvent(rewindEvent);
	    }
	
	    if (event.keyCode === 39) {
	      leftArrowCount += 1;
	      var fastForwardData = { steps: leftArrowCount };
	      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
	      that.playerContainer.dispatchEvent(fastForwardEvent);
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
	
	  this.playerContainer.addEventListener('keydown', _keydownListener, false);
	  this.playerContainer.addEventListener('keyup', _keyupListener, false);
	  this.playerContainer.addEventListener('mousedown', _mousedownListener, false);
	  this.playerContainer.addEventListener('mouseup', _mouseupListener, false);
	
	  this.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  this.playerContainer.addEventListener('mouseleave', _mouseLeaveListner, false);
	  this.playerControls.addEventListener('mouseenter', _controlsMouseEnterListener, false);
	  this.playerControls.addEventListener('mouseleave', _controlsMouseLeaveListener, false);
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
	 * Custom Class: Video
	 * @param{String} videoLink, video source link
	 * members:
	 * 1. DOM objects: this.videoContainer - contains video element
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
	  var that = this;
	
	  /**
	  * private methods - mainly for event listeners
	  */
	  var _loadeddataListener = function() {
	    that.video.duration = that.video.player.duration;
	    var durationData = { duration: that.video.duration };
	    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
	    that.videoContainer.dispatchEvent(videoReadyEvent);
	    _progressUpdateListener();
	  };
	
	  var _timeupdateListener = function() {
	    that.video.currentTime = that.video.player.currentTime;
	    var tickData = { currentTime: that.video.currentTime };
	    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
	    that.videoContainer.dispatchEvent(videoTickEvent);
	
	    var playedProgressData = { progress: that.video.currentTime };
	    var videoPlayedEvent = createCustomEvent(playerEvents.played, playedProgressData);
	    that.videoContainer.dispatchEvent(videoPlayedEvent);
	  };
	
	  var _progressUpdateListener = function() {
	    var buffered = that.video.player.buffered;
	    if (buffered.length > 0) {
	      var bufferedEnd = buffered.end(buffered.length - 1);
	      var bufferData = { buffered: bufferedEnd };
	      var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	      that.videoContainer.dispatchEvent(videoBufferEvent);
	    }
	  };
	
	  var _playingListener = function() {
	    var videoPlayingEvent = createCustomEvent(playerEvents.playing);
	    that.videoContainer.dispatchEvent(videoPlayingEvent);
	  };
	
	  var _pauseListener = function() {
	    var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	    that.videoContainer.dispatchEvent(vimeoPauseEvent);
	  };
	
	  var _mouseClickListner = function() {
	    that.togglePlay();
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
	* @return { Object } contains all names
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
	
	module.exports = (function () {
	  var customEventPolyfill = function() {
	    if (typeof window.CustomEvent === 'function') return false;
	
	    function CustomEvent(event, params) {
	      params = params || { bubbles: false, cancelable: false, detail: undefined };
	      var evt = document.createEvent('CustomEvent');
	      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
	      return evt;
	    }
	
	    CustomEvent.prototype = window.Event.prototype;
	    window.CustomEvent = CustomEvent;
	  };
	
	  var eventPolyfill = function() {
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
	  };
	
	  customEventPolyfill();
	  eventPolyfill();
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
	 * Custom Object: Progress
	 * members - DOM obj
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
	
	  var that = this;
	  var isMouseDown = false;
	
	  /**
	  * private methods - mainly for event listeners
	  */
	  var _dispatchSeek = function(event) {
	    var hoverPosition = _getMousePosition(event, that.progressBar);
	    var data = { currentTime: that.videoDuration * hoverPosition };
	    var seekEvent = createCustomEvent(playerEvents.seek, data);
	    that.progressContainer.dispatchEvent(seekEvent);
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
	
	  var _mousemoveListener = function(event) {
	    event.stopPropagation();
	    var hoverPosition = _getMousePosition(event, that.progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = that.videoDuration * hoverPosition;
	    that.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    that.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    that.progressBarChildren.hoverTimebox.className = 'hover-timebox';
	  };
	
	  var _mouseleaveListener = function() {
	    that.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	  };
	
	  var _mousedownListener = function(event) {
	    event.preventDefault();
	    isMouseDown = true;
	    that.playerContainer = that.progressContainer.parentNode.parentNode;
	    utility.addClass(that.playerContainer, 'grabbable');
	    _dispatchSeek(event);
	
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    that.progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
	    if (!isMouseDown) return;
	    utility.removeClass(that.playerContainer, 'grabbable');
	    that.progressBar.addEventListener('mousemove', _mousemoveListener, false);
	
	    // when mouse is up remove mousemove event from documentElement
	    document.documentElement.removeEventListener('mousemove', _mousedownmoveListener);
	  };
	
	  var _mousedownmoveListener = function(event) {
	    var hoverPosition = _getMousePosition(event, that.progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = that.videoDuration * hoverPosition;
	    that.progressBarChildren.played.style.width = (hoverPosition * 100).toFixed(3) + '%';
	    that.progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    that.progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	    that.progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    that.progressBarChildren.timeBox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    that.progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	    _dispatchSeek(event);
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var playButtonElement = __webpack_require__(11);
	var createCustomEvent = __webpack_require__(5);
	var playerEvents = __webpack_require__(4);
	
	/**
	 * Custom Object: PlayButton
	 * members:
	 * 1. DOM objects: playbuttonElem - contains button element
	 * 2. Playing state: this.states
	 * In order to access to PlayButton object, use prototype's methods (APIs)
	 * @see PlayButton.prototype
	 */
	
	var PlayButton = function() {
	  this.playbuttonElem = playButtonElement.createPlayButton();
	  var that = this;
	
	  var _buttonClickListener = function(event) {
	    event.stopPropagation();
	    if (that.state.playing) {
	      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	      that.playbuttonElem.dispatchEvent(vimeoPauseEvent);
	      that.state.playing = false;
	    } else {
	      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
	      that.playbuttonElem.dispatchEvent(vimeoPlayEvent);
	      that.state.playing = true;
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
	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	/**
	 * Place all publishers here. It also makes logging esay.
	 * Register the DOM elements by calling init();
	 *
	 */
	
	module.exports = (function() {
	  /**
	  * @param{Object} playButton (DOM Object): playpause button
	  * @param{Object} progress (DOM Object): progress bar
	  * @param{Object} video (DOM Object): vidoe element
	  * @param{Object} playerContainer (DOM Object): a container element contains all elements
	  *
	  */
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
	
	/**
	 * Pub/Sub model definition
	 */
	
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
	
	/**
	 * Place all subscribers here. It also makes logging esay.
	 * Register the DOM elements by calling init() @see init()
	 */
	
	module.exports = (function() {
	  /**
	  * @param{Object} playButton (DOM Object): playpause button
	  * @param{Object} progress (DOM Object): progress bar
	  * @param{Object} video (DOM Object): vidoe element
	  */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAxZmY2YzFhZGY3NGM4OTk1Mjg1NyIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMxSUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBOztBQUVBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQzdIQTs7QUFFQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNwQkQ7O0FBRUE7QUFDQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakIsWUFBVyxZQUFZLEtBQUs7QUFDNUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBOzs7Ozs7O0FDdEJBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ3ZDRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBLFlBQVcsU0FBUztBQUNwQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUM3REE7O0FBRUE7QUFDQSxZQUFXLFNBQVM7QUFDcEI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxREQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCLFlBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUM3RUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzQkFBcUIsOEJBQThCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQzNDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVcsT0FBTztBQUNsQixZQUFXLE9BQU87QUFDbEIsWUFBVyxPQUFPO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUMiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJwbGF5ZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicGxheWVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInBsYXllclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMWZmNmMxYWRmNzRjODk5NTI4NTdcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BsYXllcicpO1xuXG52YXIgYXBwID0gZnVuY3Rpb24odmlkZW9MaW5rLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCk7XG4gIHJldHVybiBwbGF5ZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBwLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFZpZGVvID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9WaWRlbycpO1xudmFyIFByb2dyZXNzID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Qcm9ncmVzc0JhcicpO1xudmFyIFBsYXlCdXR0b24gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BsYXlCdXR0b24nKTtcbnZhciBwdWJsaXNoZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMnKTtcbnZhciBzdWJzY3JpYmVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG5cbi8qKlxuICogQ3VzdG9tIENsYXNzOiBQbGF5ZXJcbiAqIEBwYXJhbXtTdHJpbmd9IHZpZGVvTGluazogdmlkZW8gbGlua1xuICogQHBhcmFte1N0cmluZ30gd2lkdGg6IHBsYXllcidzIHdpZHRoXG4gKiBAcGFyYW17U3RyaW5nfSBoZWlnaHQ6IHBsYXllcidzIGhlaWdodFxuICogbWVtYmVyczpcbiAqIDEuIERPTSBvYmplY3RzOiB0aGlzLnBsYXllckNvbnRhaW5lciAtIGNvbnRhaW5zIGFsbCBlbGVtZW50c1xuICogMi4gVmlkZW8gb2JqZWN0OiB0aGlzLnZpZGVvLCBpdCBvcGVucyBQbGF5ZXIncyBBUElzLlxuICovXG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy52aWRlbyA9IG5ldyBWaWRlbyh2aWRlb0xpbmspO1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciByYW5kb21JZCA9IHV0aWxpdHkuZ2VuZXJhdGVSYW5kb21JZCgxMCk7XG4gIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2lkJywgcmFuZG9tSWQpO1xuICBjb250YWluZXIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuXG4gIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWRlby52aWRlb0NvbnRhaW5lcik7XG5cbiAgdmFyIGNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gIHZhciBwbGF5QnRuID0gbmV3IFBsYXlCdXR0b24oKTtcbiAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bi5wbGF5YnV0dG9uRWxlbSk7XG4gIHZhciBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcygpO1xuICBjb250cm9scy5hcHBlbmRDaGlsZChwcm9ncmVzcy5wcm9ncmVzc0NvbnRhaW5lcik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgdGhpcy5wbGF5ZXJDb250cm9scyA9IGNvbnRyb2xzO1xuICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4ucGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzLnByb2dyZXNzQ29udGFpbmVyLCB0aGlzLnZpZGVvLnZpZGVvQ29udGFpbmVyLCB0aGlzLnBsYXllckNvbnRhaW5lcik7XG4gIHN1YnNjcmliZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHRoaXMudmlkZW8pO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIHZhciBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gIHZhciByaWdodEFycm93Q291bnQgPSAwO1xuICB2YXIgbW91c2VTdG9wVGltZXIgPSBudWxsO1xuXG4gIHZhciBfcmVzZXRNb3VzZVN0b3BUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChtb3VzZVN0b3BUaW1lcikge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dChtb3VzZVN0b3BUaW1lcik7XG4gICAgfVxuICAgIGlmICh1dGlsaXR5Lmhhc0NsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKSkge1xuICAgICAgdXRpbGl0eS5yZW1vdmVDbGFzcyh0aGF0LnBsYXllckNvbnRyb2xzLCAnaW52aXNpYmxlJyk7XG4gICAgfVxuICAgIG1vdXNlU3RvcFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKTtcbiAgICB9LCAzMDAwKTtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfcmVzZXRNb3VzZVN0b3BUaW1lcigpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpc01vdXNlRG93biA9IHRydWU7XG4gIH07XG5cbiAgdmFyIF9tb3VzZXVwTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpc01vdXNlRG93biA9IGZhbHNlO1xuICB9O1xuXG4gIHZhciBfbW91c2VMZWF2ZUxpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzTW91c2VEb3duKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdpbnZpc2libGUnKTtcbiAgICB9XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyh0aGF0LnBsYXllckNvbnRyb2xzLCAnaW52aXNpYmxlJyk7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICB0aGF0LnBsYXllckNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfa2V5ZG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBfcmVzZXRNb3VzZVN0b3BUaW1lcigpO1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciB2aWRlb1RvZ2dsZVBsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50b2dnbGVQbGF5KTtcbiAgICAgIHRoYXQucGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9Ub2dnbGVQbGF5RXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNykge1xuICAgICAgcmlnaHRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgcmV3aW5kRGF0YSA9IHsgc3RlcHM6IHJpZ2h0QXJyb3dDb3VudCB9O1xuICAgICAgdmFyIHJld2luZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnJld2luZCwgcmV3aW5kRGF0YSk7XG4gICAgICB0aGF0LnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHJld2luZEV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIGxlZnRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgZmFzdEZvcndhcmREYXRhID0geyBzdGVwczogbGVmdEFycm93Q291bnQgfTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmYXN0Rm9yd2FyZERhdGEpO1xuICAgICAgdGhhdC5wbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChmYXN0Rm9yd2FyZEV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9rZXl1cExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHJpZ2h0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5KSB7XG4gICAgICBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfa2V5ZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgX2tleXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZUxlYXZlTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnBsYXllckNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBfY29udHJvbHNNb3VzZUVudGVyTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuanNcbiAqKiBtb2R1bGUgaWQgPSAxXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9WaWRlb0VsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbi8qKlxuICogQ3VzdG9tIENsYXNzOiBWaWRlb1xuICogQHBhcmFte1N0cmluZ30gdmlkZW9MaW5rLCB2aWRlbyBzb3VyY2UgbGlua1xuICogbWVtYmVyczpcbiAqIDEuIERPTSBvYmplY3RzOiB0aGlzLnZpZGVvQ29udGFpbmVyIC0gY29udGFpbnMgdmlkZW8gZWxlbWVudFxuICogMi4gVmlkZW8gc3RhdGU6IHRoaXMudmlkZW9cbiAqIEluIG9yZGVyIHRvIGFjY2VzcyB0byBWaWRlbyBvYmplY3QgYW5kIGNoYW5nZSBzdGF0ZXMsIHVzZSBwcm90b3R5cGUncyBtZXRob2RzIChBUElzKVxuICogQHNlZSBWaWRlby5wcm90b3R5cGVcbiAqL1xuXG52YXIgVmlkZW8gPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgdGhpcy52aWRlb0NvbnRhaW5lciA9IHZpZGVvRWxlbWVudC52aWRlb0VsZW1lbnQodmlkZW9MaW5rKTtcbiAgdGhpcy52aWRlbyA9IHtcbiAgICBkdXJhdGlvbjogMCxcbiAgICBjdXJyZW50VGltZTogMCxcbiAgICBidWZmZXJlZDogMCxcbiAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICBwbGF5ZXI6IHRoaXMudmlkZW9Db250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGRcbiAgfTtcbiAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gIC8qKlxuICAqIHByaXZhdGUgbWV0aG9kcyAtIG1haW5seSBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHZhciBfbG9hZGVkZGF0YUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC52aWRlby5kdXJhdGlvbiA9IHRoYXQudmlkZW8ucGxheWVyLmR1cmF0aW9uO1xuICAgIHZhciBkdXJhdGlvbkRhdGEgPSB7IGR1cmF0aW9uOiB0aGF0LnZpZGVvLmR1cmF0aW9uIH07XG4gICAgdmFyIHZpZGVvUmVhZHlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkdXJhdGlvbkRhdGEpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuICAgIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyKCk7XG4gIH07XG5cbiAgdmFyIF90aW1ldXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lID0gdGhhdC52aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgdmFyIHRpY2tEYXRhID0geyBjdXJyZW50VGltZTogdGhhdC52aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1RpY2tFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50aWNrLCB0aWNrRGF0YSk7XG4gICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvUGxheWVkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSB0aGF0LnZpZGVvLnBsYXllci5idWZmZXJlZDtcbiAgICBpZiAoYnVmZmVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGJ1ZmZlcmVkRW5kID0gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpO1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBidWZmZXJlZEVuZCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3BsYXlpbmdMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWRlb1BsYXlpbmdFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB0aGF0LnZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9QbGF5aW5nRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcGF1c2VMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfbW91c2VDbGlja0xpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnRvZ2dsZVBsYXkoKTtcbiAgfTtcblxuICAvKipcbiAgKiByZWdpc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdGhpcy52aWRlb0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9tb3VzZUNsaWNrTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8vXG4vLyBWaWRlbyBBUElzLCBvdGhlciBlbGVtZW50cyBjaGFuZ2UgdmlkZW8gc3RhdGVzIGZyb20gaGVyZS5cbi8vIEFsc28sIGlmIHBsYXllciBleHBvc2UgYSB2aWRlbyBvYmplY3QsIHRoZW4gdGhlc2UgQVBJcyBiZWNvbWUgdGhlIHBsYXllcidzIEFQSXMuXG4vL1xuVmlkZW8ucHJvdG90eXBlID0ge1xuICBzZWVrOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdGhpcy52aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgIHRoaXMudmlkZW8ucGxheWluZyA9IHRydWU7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgdGhpcy52aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH0sXG5cbiAgZmFzdEZvcndhcmQ6IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgcmV3aW5kOiBmdW5jdGlvbihzdGVwcykge1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgLT0gc3RlcHM7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IHZpZGVvRWxlbWVudCgpIGNyZWF0ZSBhIERPTSBlbGVtZW50ICh3cmFwcGVyIGRpdikgZm9yIHZpZGVvXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogQWxsIFZpZW1vIFBsYXllciBjdXN0b20gZXZlbnQgbmFtZXMgYXJlIGhlcmVcbiogQHJldHVybiB7IE9iamVjdCB9IGNvbnRhaW5zIGFsbCBuYW1lc1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGxheWluZzogJ3ZpbWVvUGxheWluZycsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHRvZ2dsZVBsYXk6ICd0b2dnbGVQbGF5JyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICd2aWVtb1BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snLFxuICBmYXN0Rm9yd2FyZDogJ3ZpZW1vRmFzdEZvcndhcmQnLFxuICByZXdpbmQ6ICd2aW1lb1Jld2luZCdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiogY3JlYXRlIGEgY3VzdG9tIGV2ZW50IGZvciBhIEhUTUwgZWxlbWVudCwgb25seSB0aGUgc2FtZSBlbGVtZW50IGNhbiBsaXN0ZW4gdG8uXG4qIGl0J3MgdGhlIGVsZW1lbnQncyBpbnRlcm5hbCBldmVudHNcbiogbG9hZCBQb2x5ZmlsbCBmaXJzdCBmb3IgSUVcbipcbiogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4qIEByZXR1cm4ge0N1c3RvbUV2ZW50fSBvciB7RXZlbnR9XG4qXG4qL1xuXG5yZXF1aXJlKCcuL1BvbHlmaWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICdkZXRhaWwnOiBkYXRhXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBjdXN0b21FdmVudFBvbHlmaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cblxuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG4gIH07XG5cbiAgdmFyIGV2ZW50UG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gRXZlbnQoZXZlbnROYW1lKSB7XG4gICAgICB2YXIgcGFyYW1zID0geyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UgfTtcbiAgICAgIHZhciBldnQ7XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIGV2dC5pbml0RXZlbnQoZXZlbnROYW1lLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgZXZ0LmV2ZW50VHlwZSA9IGV2ZW50TmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldnQ7XG4gICAgfVxuXG4gICAgRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgICB3aW5kb3cuRXZlbnQgPSBFdmVudDtcbiAgfTtcblxuICBjdXN0b21FdmVudFBvbHlmaWxsKCk7XG4gIGV2ZW50UG9seWZpbGwoKTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG4vKipcbiAqIEN1c3RvbSBPYmplY3Q6IFByb2dyZXNzXG4gKiBtZW1iZXJzIC0gRE9NIG9ialxuICogLSB0aGlzLnByb2dyZXNzQmFyLFxuICogLSB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4gLSBhIGNvbGxlY3Rpb24gb2YgY2hpbGQgRE9NcyBvZiBwcm9ncmVzc0JhclxuICpcbiAqIEluIG9yZGVyIHRvIGFjY2VzcyB0byB0aGlzIG9iamVjdCwgdXNlIHByb3RvdHlwZSdzIG1ldGhvZHMgKEFQSXMpXG4gKiBAc2VlIFByb2dyZXNzLnByb3RvdHlwZVxuICovXG5cbnZhciBQcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByb2dyZXNzQ29udGFpbmVyID0gcHJvZ3Jlc3NXcmFwcGVyLnByb2dyZXNzV3JhcHBlcigpO1xuICB0aGlzLnByb2dyZXNzQmFyID0gdGhpcy5wcm9ncmVzc0NvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuID0ge1xuICAgIGJ1ZmZlcmVkOiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzBdLFxuICAgIHBsYXllZDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblsxXSxcbiAgICBob3ZlclRpbWVib3g6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMl0sXG4gICAgdGltZUJveDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblszXVxuICB9O1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG5cbiAgLyoqXG4gICogcHJpdmF0ZSBtZXRob2RzIC0gbWFpbmx5IGZvciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdmFyIF9kaXNwYXRjaFNlZWsgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHRoYXQucHJvZ3Jlc3NCYXIpO1xuICAgIHZhciBkYXRhID0geyBjdXJyZW50VGltZTogdGhhdC52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgdGhhdC5wcm9ncmVzc0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHNlZWtFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCB0aGF0LnByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB0aGF0LnZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICB9O1xuXG4gIHZhciBfbW91c2VsZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIHRoYXQucGxheWVyQ29udGFpbmVyID0gdGhhdC5wcm9ncmVzc0NvbnRhaW5lci5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyh0aGF0LnBsYXllckNvbnRhaW5lciwgJ2dyYWJiYWJsZScpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuXG4gICAgLy8gb25seSBhZGQgbW91c2Vtb3ZlIHRvIGRvY3VtZW50IHdoZW4gbW91c2UgZG93biB0byBwcm9ncmVzc0JhciBoYXBwZW5lZFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdGhhdC5wcm9ncmVzc0Jhci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFpc01vdXNlRG93bikgcmV0dXJuO1xuICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3ModGhhdC5wbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICB0aGF0LnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgLy8gd2hlbiBtb3VzZSBpcyB1cCByZW1vdmUgbW91c2Vtb3ZlIGV2ZW50IGZyb20gZG9jdW1lbnRFbGVtZW50XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3dubW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCB0aGF0LnByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB0aGF0LnZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94IGludmlzaWJsZSc7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcbiAgfTtcblxuICAvKipcbiAgKiByZWdpc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdGhpcy5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX21vdXNlbGVhdmVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9tb3VzZWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9tb3VzZXVwTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8vXG4vLyBQcm9ncmVzcyBBUElzLCBvdGhlciBlbGVtZW50cyBjaGFuZ2UgcHJvZ3Jlc3Mgc3RhdGVzIGZyb20gaGVyZS5cbi8vIEFsc28sIGlmIHBsYXllciBleHBvc2UgYSBQcm9ncmVzcyBvYmplY3QsIHRoZW4gdGhlc2UgQVBJcyBiZWNvbWUgdGhlIHBsYXllcidzIEFQSXMuXG4vL1xuUHJvZ3Jlc3MucHJvdG90eXBlID0ge1xuICB2aWRlb0R1cmF0aW9uOiAwLFxuXG4gIHVwZGF0ZVBsYXllZFByb2dyZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHRoaXMudmlkZW9EdXJhdGlvbiA8PSAwKSByZXR1cm47XG4gICAgdmFyIHBsYXllZFBlY2VudGFnZSA9IGRhdGEucHJvZ3Jlc3MgLyB0aGlzLnZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSBwbGF5ZWRQZWNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEucHJvZ3Jlc3MpO1xuICAgIHZhciBwbGF5ZWRBcmlhVGV4dCA9IHV0aWxpdHkucmVhZFRpbWUoZGF0YS5wcm9ncmVzcykgKyAnIHBsYXllZCc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgcGxheWVkQXJpYVRleHQpO1xuICB9LFxuXG4gIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAodGhpcy52aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgYnVmZmVyZWRQZXJjZW50YWdlID0gZGF0YS5idWZmZXJlZCAvIHRoaXMudmlkZW9EdXJhdGlvbiAqIDEwMDtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc3R5bGUud2lkdGggPSBidWZmZXJlZFBlcmNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5idWZmZXJlZCk7XG4gICAgdmFyIGJ1ZmZlcmVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEuYnVmZmVyZWQpICsgJyBidWZmZXJlZCc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCBidWZmZXJlZEFyaWFUZXh0KTtcbiAgfSxcblxuICB1cGRhdGVUaW1lQm94OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgdXBkYXRlVGljazogZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICB9LFxuXG4gIHVwZGF0ZUR1cmF0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy52aWRlb0R1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcbiAgICAvLyB1cGRhdGUgVUlzIHJlbGF0ZWQgd2l0aCBkdWF0aW9uXG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUodGhpcy52aWRlb0R1cmF0aW9uKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIHRoaXMudmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdGhpcy52aWRlb0R1cmF0aW9uLnRvRml4ZWQoMykpO1xuICB9LFxuXG4gIHJlY2VpdmVQbGF5aW5nOiBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3gsICdpbnZpc2libGUnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmVzcztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9Qcm9ncmVzc0Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNwbGl0VGltZTogZnVuY3Rpb24odGltZUluU2Vjb25kcykge1xuICAgIHZhciB0bSA9IG5ldyBEYXRlKHRpbWVJblNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgaG91cnMgPSB0bS5nZXRVVENIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdG0uZ2V0VVRDTWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gdG0uZ2V0VVRDU2Vjb25kcygpO1xuICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgIH1cbiAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICB9XG4gICAgaWYgKGhvdXJzID09PSAwKSB7XG4gICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHM7XG4gIH0sXG5cbiAgcmVhZFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICB2YXIgc2Vjb25kU3RyaW5nID0gJyBzZWNvbmRzJztcbiAgICB2YXIgbWludXRlU3RyaW5nID0gJyBtaW51dGVzJztcbiAgICB2YXIgaG91clN0cmluZyA9ICcgaG91cnMnO1xuICAgIGlmIChzZWNvbmRzIDw9IDEpIHtcbiAgICAgIHNlY29uZFN0cmluZyA9ICcgc2Vjb25kJztcbiAgICB9XG4gICAgaWYgKG1pbnV0ZXMgPD0gMSkge1xuICAgICAgbWludXRlU3RyaW5nID0gJyBtaW51dGUnO1xuICAgIH1cbiAgICBpZiAoaG91cnMgPD0gMSkge1xuICAgICAgaG91clN0cmluZyA9ICcgaG91cic7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVJblNlY29uZHMgPCA2MCkge1xuICAgICAgcmV0dXJuIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfSBlbHNlIGlmICh0aW1lSW5TZWNvbmRzID49IDYwICYmIHRpbWVJblNlY29uZHMgPCAzNjAwKSB7XG4gICAgICByZXR1cm4gbWludXRlcyArIG1pbnV0ZVN0cmluZyArICcsICcgKyBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaG91cnMgKyBob3VyU3RyaW5nICsgJywgJyArIG1pbnV0ZXMgKyBtaW51dGVTdHJpbmcgKyAnLCAnICsgc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9XG4gIH0sXG5cbiAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISFlbC5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKSk7XG4gICAgfVxuICB9LFxuXG4gIGFkZENsYXNzOiBmdW5jdGlvbihlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJyk7XG4gICAgICBlbC5jbGFzc05hbWU9ZWwuY2xhc3NOYW1lLnJlcGxhY2UocmVnLCAnICcpO1xuICAgIH1cbiAgfSxcblxuICBnZW5lcmF0ZVJhbmRvbUlkOiBmdW5jdGlvbihpZExlbmd0aCkge1xuICAgIHZhciBpZCA9ICcnO1xuICAgIHZhciBjaGFyU2V0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSc7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gaWRMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmFuZFBvcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcbiAgICAgICAgaWQgKz0gY2hhclNldFtyYW5kUG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1V0aWxpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHJldHVybntGdW5jdGlvbn0gcHJvZ3Jlc3NXcmFwcGVyKCkgY3JlYXRlIGEgRE9NIGVsZW1lbnQgKHdyYXBwZXIgZGl2KSBmb3IgcHJvZ3Jlc3MgYmFyXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1ZmZlcmVkRGl2LmNsYXNzTmFtZSA9ICdidWZmZXJlZCc7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3Byb2dyZXNzYmFyJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ2J1ZmZlcmVkJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIGJ1ZmZlcmVkRGl2O1xuICB9O1xuXG4gIHZhciBwbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXllZCcpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciBob3ZlclRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiBob3ZlclRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIHRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIHRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVQb3AgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lUG9wRGl2LmNsYXNzTmFtZSA9ICd0aW1lLXBvcCc7XG4gICAgdGltZVBvcERpdi5pbm5lckhUTUwgPSB0aW1lO1xuICAgIHJldHVybiB0aW1lUG9wRGl2O1xuICB9O1xuXG4gIHZhciBjcmVhdGVQcm9ncmVzc1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWRFbGVtZW50ID0gYnVmZmVyZWQoKTtcbiAgICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICAgIHZhciBob3ZlclRpbWVib3hFbGVtZW50ID0gaG92ZXJUaW1lYm94KCk7XG4gICAgdmFyIHRpbWVCb3hFbGVtZW50ID0gdGltZWJveCgpO1xuICAgIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3Byb2dyZXNzJztcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGhvdmVyVGltZWJveEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZCh0aW1lQm94RWxlbWVudCk7XG4gICAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzV3JhcHBlci5jbGFzc05hbWUgPSAncHJvZ3Jlc3Mtd3JhcHBlcic7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmFwcGVuZENoaWxkKHByb2dyZXNzRWxlbWVudCk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyOiBjcmVhdGVQcm9ncmVzc1dyYXBwZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGxheUJ1dHRvbkVsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudCcpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcblxuLyoqXG4gKiBDdXN0b20gT2JqZWN0OiBQbGF5QnV0dG9uXG4gKiBtZW1iZXJzOlxuICogMS4gRE9NIG9iamVjdHM6IHBsYXlidXR0b25FbGVtIC0gY29udGFpbnMgYnV0dG9uIGVsZW1lbnRcbiAqIDIuIFBsYXlpbmcgc3RhdGU6IHRoaXMuc3RhdGVzXG4gKiBJbiBvcmRlciB0byBhY2Nlc3MgdG8gUGxheUJ1dHRvbiBvYmplY3QsIHVzZSBwcm90b3R5cGUncyBtZXRob2RzIChBUElzKVxuICogQHNlZSBQbGF5QnV0dG9uLnByb3RvdHlwZVxuICovXG5cbnZhciBQbGF5QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucGxheWJ1dHRvbkVsZW0gPSBwbGF5QnV0dG9uRWxlbWVudC5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gIHZhciB0aGF0ID0gdGhpcztcblxuICB2YXIgX2J1dHRvbkNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGlmICh0aGF0LnN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgICAgdGhhdC5wbGF5YnV0dG9uRWxlbS5kaXNwYXRjaEV2ZW50KHZpbWVvUGF1c2VFdmVudCk7XG4gICAgICB0aGF0LnN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHZpbWVvUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXkpO1xuICAgICAgdGhhdC5wbGF5YnV0dG9uRWxlbS5kaXNwYXRjaEV2ZW50KHZpbWVvUGxheUV2ZW50KTtcbiAgICAgIHRoYXQuc3RhdGUucGxheWluZyA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMucGxheWJ1dHRvbkVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYnV0dG9uQ2xpY2tMaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuUGxheUJ1dHRvbi5wcm90b3R5cGUgPSB7XG4gIHN0YXRlOiB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgIHZhciBwbGF5YnV0dG9uID0gdGhpcy5wbGF5YnV0dG9uRWxlbTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBwbGF5SWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMF07XG4gICAgdmFyIHBhdXNlSWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMV07XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gcGxheWVyRXZlbnRzLnBhdXNlKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheScpO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BsYXknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGF1c2UnKTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwYXVzZScpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5QnV0dG9uO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm57RnVuY3Rpb259IGNyZWF0ZVBsYXlCdXR0b24oKSBjcmVhdGUgYSBET00gZWxlbWVudCAoZGl2KSBmb3IgcGxheSBidXR0b25cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXlCdXR0b24uY2xhc3NOYW1lID0gJ3BsYXktaWNvbic7XG4gICAgdmFyIHBsYXlTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBsYXlTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIHBvbHlnb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncG9seWdvbicpO1xuICAgIHBvbHlnb24uc2V0QXR0cmlidXRlKCdwb2ludHMnLCAnMSwwIDIwLDEwIDEsMjAnKTtcbiAgICBwbGF5U1ZHLmFwcGVuZENoaWxkKHBvbHlnb24pO1xuICAgIHBsYXlCdXR0b24uYXBwZW5kQ2hpbGQocGxheVNWRyk7XG4gICAgcmV0dXJuIHBsYXlCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVBhdXNlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGF1c2VCdXR0b24uY2xhc3NOYW1lID0gJ3BhdXNlLWljb24nO1xuICAgIHZhciBwYXVzZVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBsZWZ0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQobGVmdFJlY3QpO1xuICAgIHZhciByaWdodFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAnMjAnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzEyJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gICAgcGF1c2VTVkcuYXBwZW5kQ2hpbGQocmlnaHRSZWN0KTtcbiAgICBwYXVzZUJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZVNWRyk7XG4gICAgcmV0dXJuIHBhdXNlQnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5JztcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXknKTtcbiAgICBidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwbGF5Jyk7XG4gICAgdmFyIHBsYXlCdG4gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgIHZhciBwYXVzZUJ0biA9IGNyZWF0ZVBhdXNlQnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlQnRuKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUGxheUJ1dHRvbjogY3JlYXRlQnV0dG9uXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbi8qKlxuICogUGxhY2UgYWxsIHB1Ymxpc2hlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4gKiBSZWdpc3RlciB0aGUgRE9NIGVsZW1lbnRzIGJ5IGNhbGxpbmcgaW5pdCgpO1xuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgLyoqXG4gICogQHBhcmFte09iamVjdH0gcGxheUJ1dHRvbiAoRE9NIE9iamVjdCk6IHBsYXlwYXVzZSBidXR0b25cbiAgKiBAcGFyYW17T2JqZWN0fSBwcm9ncmVzcyAoRE9NIE9iamVjdCk6IHByb2dyZXNzIGJhclxuICAqIEBwYXJhbXtPYmplY3R9IHZpZGVvIChET00gT2JqZWN0KTogdmlkb2UgZWxlbWVudFxuICAqIEBwYXJhbXtPYmplY3R9IHBsYXllckNvbnRhaW5lciAoRE9NIE9iamVjdCk6IGEgY29udGFpbmVyIGVsZW1lbnQgY29udGFpbnMgYWxsIGVsZW1lbnRzXG4gICpcbiAgKi9cbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAgIF9wbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBfcHJvZ3Jlc3NQdWJsaXNoZXJzKHByb2dyZXNzKTtcbiAgICBfdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgICBfcGxheWVyQ29udGFpbmVyUHVicyhwbGF5ZXJDb250YWluZXIpO1xuICB9O1xuXG4gIHZhciBfcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF92aWRlb1B1Ymxpc2hlcnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3BsYXllckNvbnRhaW5lclB1YnMgPSBmdW5jdGlvbihwbGF5ZXJDb250YWluZXIpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5yZXdpbmQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQdWIvU3ViIG1vZGVsIGRlZmluaXRpb25cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGV2ZW50cyA9IHt9O1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRzID0ge307XG4gIH07XG5cbiAgdmFyIHN1YnNjcmliZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBldmVudHNbZXZlbnROYW1lXSA9IGV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgIGV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9O1xuXG4gIHZhciB1bnN1YnNjcmliZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIGV2ZW50c1tldmVudE5hbWVdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgcHVibGlzaCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmIChldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICBmbihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHN1YnNjcmliZTogc3Vic2NyaWJlLFxuICAgIHB1Ymxpc2g6IHB1Ymxpc2gsXG4gICAgdW5zdWJzY3JpYmU6IHVuc3Vic2NyaWJlLFxuICAgIGluaXQ6IGluaXRcbiAgfTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9QdWJTdWInKTtcblxuLyoqXG4gKiBQbGFjZSBhbGwgc3Vic2NyaWJlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4gKiBSZWdpc3RlciB0aGUgRE9NIGVsZW1lbnRzIGJ5IGNhbGxpbmcgaW5pdCgpIEBzZWUgaW5pdCgpXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIC8qKlxuICAqIEBwYXJhbXtPYmplY3R9IHBsYXlCdXR0b24gKERPTSBPYmplY3QpOiBwbGF5cGF1c2UgYnV0dG9uXG4gICogQHBhcmFte09iamVjdH0gcHJvZ3Jlc3MgKERPTSBPYmplY3QpOiBwcm9ncmVzcyBiYXJcbiAgKiBAcGFyYW17T2JqZWN0fSB2aWRlbyAoRE9NIE9iamVjdCk6IHZpZG9lIGVsZW1lbnRcbiAgKi9cbiAgdmFyIHJlZ2lzdGVyU3Vic2NyaWJlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8pIHtcbiAgICBfdmlkZW9TdWJzKHZpZGVvKTtcbiAgICBfcHJvZ3Jlc3NTdWJzKHByb2dyZXNzKTtcbiAgICBfYnV0dG9uU3VicyhwbGF5QnV0dG9uKTtcbiAgfTtcblxuICB2YXIgX3ZpZGVvU3VicyA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby5wbGF5KCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5zZWVrKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8udG9nZ2xlUGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5mYXN0Rm9yd2FyZChkYXRhLnN0ZXBzKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLnJld2luZChkYXRhLnN0ZXBzKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzU3VicyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlRHVyYXRpb24oZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBwcm9ncmVzcy5yZWNlaXZlUGxheWluZyhwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVQbGF5ZWRQcm9ncmVzcyhkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVUaWNrKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBfYnV0dG9uU3VicyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24pIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgcGxheUJ1dHRvbi50b2dnbGVQbGF5KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiByZWdpc3RlclN1YnNjcmliZXJzXG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==