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
	 * Custom Object: Player
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
	      utility.removeClass(that.playerControls, 'hidden');
	    }
	    mouseStopTimer = window.setTimeout(function() {
	      utility.addClass(that.playerControls, 'hidden');
	    }, 2000);
	  };
	
	  var _mouseLeaveListner = function() {
	    if (!isMouseDown) {
	      utility.addClass(that.playerControls, 'hidden');
	    }
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseLeaveListener = function() {
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseEnterListener = function() {
	    utility.removeClass(that.playerControls, 'hidden');
	    if (mouseStopTimer) window.clearTimeout(mouseStopTimer);
	    that.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
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
	
	  document.documentElement.addEventListener('keydown', _keydownListener, false);
	  document.documentElement.addEventListener('keyup', _keyupListener, false);
	  document.documentElement.addEventListener('mousedown', _mousedownListener, false);
	  document.documentElement.addEventListener('mouseup', _mouseupListener, false);
	
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
	 * Custom Object: Video
	 * members:
	 * 1. DOM objects:
	 * @param { DOM Object } this.videoContainer - contains video element
	 * 2. Video state:
	 * @param { Object } this.video
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
	 * @return { Function } videoElement() create a DOM element (wrapper div) for video
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
	 * members - DOM objects:
	 * @param { DOM Object } this.progressBar
	 * @param { Object } this.progressBarChildren - a collection of child DOMs of progressBar
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
	 * @return { Function } progressWrapper() create a DOM element (wrapper div) for progress bar
	 */
	
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
	 * @return { Function } createPlayButton() create a DOM element (div) for play button
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
	  * @param playButton (DOM Object): playpause button
	  * @param progress (DOM Object): progress bar
	  * @param video (DOM Object): vidoe element
	  * @param playerContainer (DOM Object): a container element contains all elements
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
	  * @param playButton (DOM Object): playpause button
	  * @param progress (DOM Object): progress bar
	  * @param video (DOM Object): vidoe element
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiYzI5MzYzNGRjNjgyNjhkOGVjOCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDcklBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsYUFBYTtBQUN4QjtBQUNBLFlBQVcsU0FBUztBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7O0FBRUEsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDOUhBOztBQUVBO0FBQ0EsYUFBWSxXQUFXO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3BCRDs7QUFFQTtBQUNBO0FBQ0EsWUFBVyxTQUFTO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixZQUFXLFlBQVksS0FBSztBQUM1QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0QkE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTBCO0FBQzFCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDdkNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVcsYUFBYTtBQUN4QixZQUFXLFNBQVM7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLG9CQUFtQixlQUFlO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2xGQTs7QUFFQTtBQUNBLGFBQVksV0FBVztBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUM3REE7O0FBRUE7QUFDQSxhQUFZLFdBQVc7QUFDdkI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxREQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDN0VEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUMzQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFwicGxheWVyXCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInBsYXllclwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJwbGF5ZXJcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCBmdW5jdGlvbigpIHtcbnJldHVybiBcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb25cbiAqKi8iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGJjMjkzNjM0ZGM2ODI2OGQ4ZWM4XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFBsYXllciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9QbGF5ZXInKTtcblxudmFyIGFwcCA9IGZ1bmN0aW9uKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCkge1xuICB2YXIgcGxheWVyID0gbmV3IFBsYXllcih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpO1xuICByZXR1cm4gcGxheWVyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhcHA7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBWaWRlbyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvVmlkZW8nKTtcbnZhciBQcm9ncmVzcyA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXInKTtcbnZhciBQbGF5QnV0dG9uID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QbGF5QnV0dG9uJyk7XG52YXIgcHVibGlzaGVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzJyk7XG52YXIgc3Vic2NyaWJlcnMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xuXG4vKipcbiAqIEN1c3RvbSBPYmplY3Q6IFBsYXllclxuICogbWVtYmVyczpcbiAqIDEuIERPTSBvYmplY3RzOiB0aGlzLnBsYXllckNvbnRhaW5lciAtIGNvbnRhaW5zIGFsbCBlbGVtZW50c1xuICogMi4gVmlkZW8gb2JqZWN0OiB0aGlzLnZpZGVvLCBpdCBvcGVucyBQbGF5ZXIncyBBUElzLlxuICovXG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgdGhpcy52aWRlbyA9IG5ldyBWaWRlbyh2aWRlb0xpbmspO1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHZhciByYW5kb21JZCA9IHV0aWxpdHkuZ2VuZXJhdGVSYW5kb21JZCgxMCk7XG4gIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2lkJywgcmFuZG9tSWQpO1xuXG4gIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWRlby52aWRlb0NvbnRhaW5lcik7XG5cbiAgdmFyIGNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gIHZhciBwbGF5QnRuID0gbmV3IFBsYXlCdXR0b24oKTtcbiAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bi5wbGF5YnV0dG9uRWxlbSk7XG4gIHZhciBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcygpO1xuICBjb250cm9scy5hcHBlbmRDaGlsZChwcm9ncmVzcy5wcm9ncmVzc0NvbnRhaW5lcik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgdGhpcy5wbGF5ZXJDb250cm9scyA9IGNvbnRyb2xzO1xuICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4ucGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzLnByb2dyZXNzQ29udGFpbmVyLCB0aGlzLnZpZGVvLnZpZGVvQ29udGFpbmVyLCB0aGlzLnBsYXllckNvbnRhaW5lcik7XG4gIHN1YnNjcmliZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHRoaXMudmlkZW8pO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIHZhciBsZWZ0QXJyb3dDb3VudCA9IDA7XG4gIHZhciByaWdodEFycm93Q291bnQgPSAwO1xuICB2YXIgbW91c2VTdG9wVGltZXIgPSBudWxsO1xuXG4gIHZhciBfcmVzZXRNb3VzZVN0b3BUaW1lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChtb3VzZVN0b3BUaW1lcikge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dChtb3VzZVN0b3BUaW1lcik7XG4gICAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9XG4gICAgbW91c2VTdG9wVGltZXIgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHV0aWxpdHkuYWRkQ2xhc3ModGhhdC5wbGF5ZXJDb250cm9scywgJ2hpZGRlbicpO1xuICAgIH0sIDIwMDApO1xuICB9O1xuXG4gIHZhciBfbW91c2VMZWF2ZUxpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzTW91c2VEb3duKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyh0aGF0LnBsYXllckNvbnRyb2xzLCAnaGlkZGVuJyk7XG4gICAgaWYgKG1vdXNlU3RvcFRpbWVyKSB3aW5kb3cuY2xlYXJUaW1lb3V0KG1vdXNlU3RvcFRpbWVyKTtcbiAgICB0aGF0LnBsYXllckNvbnRhaW5lci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdG5lciA9IGZ1bmN0aW9uKCkge1xuICAgIF9yZXNldE1vdXNlU3RvcFRpbWVyKCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlzTW91c2VEb3duID0gZmFsc2U7XG4gIH07XG5cbiAgdmFyIF9rZXlkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIF9yZXNldE1vdXNlU3RvcFRpbWVyKCk7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIHZpZGVvVG9nZ2xlUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRvZ2dsZVBsYXkpO1xuICAgICAgdGhhdC5wbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1RvZ2dsZVBsYXlFdmVudCk7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM3KSB7XG4gICAgICByaWdodEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciByZXdpbmREYXRhID0geyBzdGVwczogcmlnaHRBcnJvd0NvdW50IH07XG4gICAgICB2YXIgcmV3aW5kRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucmV3aW5kLCByZXdpbmREYXRhKTtcbiAgICAgIHRoYXQucGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQocmV3aW5kRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgbGVmdEFycm93Q291bnQgKz0gMTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZERhdGEgPSB7IHN0ZXBzOiBsZWZ0QXJyb3dDb3VudCB9O1xuICAgICAgdmFyIGZhc3RGb3J3YXJkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZhc3RGb3J3YXJkRGF0YSk7XG4gICAgICB0aGF0LnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KGZhc3RGb3J3YXJkRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2tleXVwTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNykge1xuICAgICAgcmlnaHRBcnJvd0NvdW50ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIGxlZnRBcnJvd0NvdW50ID0gMDtcbiAgICB9XG4gIH07XG5cbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBfa2V5ZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsIF9rZXl1cExpc3RlbmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfbW91c2Vkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG5cbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZUxlYXZlTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnBsYXllckNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBfY29udHJvbHNNb3VzZUVudGVyTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wbGF5ZXJDb250cm9scy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXllci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZpZGVvRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1ZpZGVvRWxlbWVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxuLyoqXG4gKiBDdXN0b20gT2JqZWN0OiBWaWRlb1xuICogbWVtYmVyczpcbiAqIDEuIERPTSBvYmplY3RzOlxuICogQHBhcmFtIHsgRE9NIE9iamVjdCB9IHRoaXMudmlkZW9Db250YWluZXIgLSBjb250YWlucyB2aWRlbyBlbGVtZW50XG4gKiAyLiBWaWRlbyBzdGF0ZTpcbiAqIEBwYXJhbSB7IE9iamVjdCB9IHRoaXMudmlkZW9cbiAqIEluIG9yZGVyIHRvIGFjY2VzcyB0byBWaWRlbyBvYmplY3QgYW5kIGNoYW5nZSBzdGF0ZXMsIHVzZSBwcm90b3R5cGUncyBtZXRob2RzIChBUElzKVxuICogQHNlZSBWaWRlby5wcm90b3R5cGVcbiAqL1xuXG52YXIgVmlkZW8gPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgdGhpcy52aWRlb0NvbnRhaW5lciA9IHZpZGVvRWxlbWVudC52aWRlb0VsZW1lbnQodmlkZW9MaW5rKTtcbiAgdGhpcy52aWRlbyA9IHtcbiAgICBkdXJhdGlvbjogMCxcbiAgICBjdXJyZW50VGltZTogMCxcbiAgICBidWZmZXJlZDogMCxcbiAgICBwbGF5aW5nOiBmYWxzZSxcbiAgICBwbGF5ZXI6IHRoaXMudmlkZW9Db250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGRcbiAgfTtcbiAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gIC8qKlxuICAqIHByaXZhdGUgbWV0aG9kcyAtIG1haW5seSBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHZhciBfbG9hZGVkZGF0YUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC52aWRlby5kdXJhdGlvbiA9IHRoYXQudmlkZW8ucGxheWVyLmR1cmF0aW9uO1xuICAgIHZhciBkdXJhdGlvbkRhdGEgPSB7IGR1cmF0aW9uOiB0aGF0LnZpZGVvLmR1cmF0aW9uIH07XG4gICAgdmFyIHZpZGVvUmVhZHlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkdXJhdGlvbkRhdGEpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuICAgIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyKCk7XG4gIH07XG5cbiAgdmFyIF90aW1ldXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lID0gdGhhdC52aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgdmFyIHRpY2tEYXRhID0geyBjdXJyZW50VGltZTogdGhhdC52aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1RpY2tFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50aWNrLCB0aWNrRGF0YSk7XG4gICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvUGxheWVkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSB0aGF0LnZpZGVvLnBsYXllci5idWZmZXJlZDtcbiAgICBpZiAoYnVmZmVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGJ1ZmZlcmVkRW5kID0gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpO1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBidWZmZXJlZEVuZCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3BsYXlpbmdMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWRlb1BsYXlpbmdFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB0aGF0LnZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9QbGF5aW5nRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcGF1c2VMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfbW91c2VDbGlja0xpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnRvZ2dsZVBsYXkoKTtcbiAgfTtcblxuICAvKipcbiAgKiByZWdpc3RlciBldmVudCBsaXN0ZW5lcnNcbiAgKi9cbiAgdGhpcy52aWRlb0NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9tb3VzZUNsaWNrTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8vXG4vLyBWaWRlbyBBUElzLCBvdGhlciBlbGVtZW50cyBjaGFuZ2UgdmlkZW8gc3RhdGVzIGZyb20gaGVyZS5cbi8vIEFsc28sIGlmIHBsYXllciBleHBvc2UgYSB2aWRlbyBvYmplY3QsIHRoZW4gdGhlc2UgQVBJcyBiZWNvbWUgdGhlIHBsYXllcidzIEFQSXMuXG4vL1xuVmlkZW8ucHJvdG90eXBlID0ge1xuICBzZWVrOiBmdW5jdGlvbih0aW1lKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgPSB0aW1lO1xuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpZGVvLnBsYXlpbmcpIHtcbiAgICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgICAgdGhpcy52aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH0sXG5cbiAgcGxheTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIucGxheSgpO1xuICAgIHRoaXMudmlkZW8ucGxheWluZyA9IHRydWU7XG4gIH0sXG5cbiAgcGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMudmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gICAgdGhpcy52aWRlby5wbGF5aW5nID0gZmFsc2U7XG4gIH0sXG5cbiAgZmFzdEZvcndhcmQ6IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSArPSBzdGVwcztcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgcmV3aW5kOiBmdW5jdGlvbihzdGVwcykge1xuICAgIHRoaXMudmlkZW8uY3VycmVudFRpbWUgLT0gc3RlcHM7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZGVvO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm4geyBGdW5jdGlvbiB9IHZpZGVvRWxlbWVudCgpIGNyZWF0ZSBhIERPTSBlbGVtZW50ICh3cmFwcGVyIGRpdikgZm9yIHZpZGVvXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogQWxsIFZpZW1vIFBsYXllciBjdXN0b20gZXZlbnQgbmFtZXMgYXJlIGhlcmVcbiogQHJldHVybiB7IE9iamVjdCB9IGNvbnRhaW5zIGFsbCBuYW1lc1xuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGxheWluZzogJ3ZpbWVvUGxheWluZycsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHRvZ2dsZVBsYXk6ICd0b2dnbGVQbGF5JyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICd2aWVtb1BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snLFxuICBmYXN0Rm9yd2FyZDogJ3ZpZW1vRmFzdEZvcndhcmQnLFxuICByZXdpbmQ6ICd2aW1lb1Jld2luZCdcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG4vKipcbiogY3JlYXRlIGEgY3VzdG9tIGV2ZW50IGZvciBhIEhUTUwgZWxlbWVudCwgb25seSB0aGUgc2FtZSBlbGVtZW50IGNhbiBsaXN0ZW4gdG8uXG4qIGl0J3MgdGhlIGVsZW1lbnQncyBpbnRlcm5hbCBldmVudHNcbiogbG9hZCBQb2x5ZmlsbCBmaXJzdCBmb3IgSUVcbipcbiogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4qIEByZXR1cm4ge0N1c3RvbUV2ZW50fSBvciB7RXZlbnR9XG4qXG4qL1xuXG5yZXF1aXJlKCcuL1BvbHlmaWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICdkZXRhaWwnOiBkYXRhXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciBjdXN0b21FdmVudFBvbHlmaWxsID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cuQ3VzdG9tRXZlbnQgPT09ICdmdW5jdGlvbicpIHJldHVybiBmYWxzZTtcblxuICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcbiAgICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgICByZXR1cm4gZXZ0O1xuICAgIH1cblxuICAgIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gICAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG4gIH07XG5cbiAgdmFyIGV2ZW50UG9seWZpbGwgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gRXZlbnQoZXZlbnROYW1lKSB7XG4gICAgICB2YXIgcGFyYW1zID0geyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UgfTtcbiAgICAgIHZhciBldnQ7XG4gICAgICBpZiAoZG9jdW1lbnQuY3JlYXRlRXZlbnQpIHtcbiAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICAgIGV2dC5pbml0RXZlbnQoZXZlbnROYW1lLCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnRPYmplY3QoKTtcbiAgICAgICAgZXZ0LmV2ZW50VHlwZSA9IGV2ZW50TmFtZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBldnQ7XG4gICAgfVxuXG4gICAgRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgICB3aW5kb3cuRXZlbnQgPSBFdmVudDtcbiAgfTtcblxuICBjdXN0b21FdmVudFBvbHlmaWxsKCk7XG4gIGV2ZW50UG9seWZpbGwoKTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG4vKipcbiAqIEN1c3RvbSBPYmplY3Q6IFByb2dyZXNzXG4gKiBtZW1iZXJzIC0gRE9NIG9iamVjdHM6XG4gKiBAcGFyYW0geyBET00gT2JqZWN0IH0gdGhpcy5wcm9ncmVzc0JhclxuICogQHBhcmFtIHsgT2JqZWN0IH0gdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuIC0gYSBjb2xsZWN0aW9uIG9mIGNoaWxkIERPTXMgb2YgcHJvZ3Jlc3NCYXJcbiAqXG4gKiBJbiBvcmRlciB0byBhY2Nlc3MgdG8gdGhpcyBvYmplY3QsIHVzZSBwcm90b3R5cGUncyBtZXRob2RzIChBUElzKVxuICogQHNlZSBQcm9ncmVzcy5wcm90b3R5cGVcbiAqL1xuXG52YXIgUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMucHJvZ3Jlc3NDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbiA9IHtcbiAgICBidWZmZXJlZDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblswXSxcbiAgICBwbGF5ZWQ6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMV0sXG4gICAgaG92ZXJUaW1lYm94OiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzJdLFxuICAgIHRpbWVCb3g6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM11cbiAgfTtcblxuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHZhciBpc01vdXNlRG93biA9IGZhbHNlO1xuXG4gIC8qKlxuICAqIHByaXZhdGUgbWV0aG9kcyAtIG1haW5seSBmb3IgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHZhciBfZGlzcGF0Y2hTZWVrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCB0aGF0LnByb2dyZXNzQmFyKTtcbiAgICB2YXIgZGF0YSA9IHsgY3VycmVudFRpbWU6IHRoYXQudmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb24gfTtcbiAgICB2YXIgc2Vla0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnNlZWssIGRhdGEpO1xuICAgIHRoYXQucHJvZ3Jlc3NDb250YWluZXIuZGlzcGF0Y2hFdmVudChzZWVrRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uKGUsIHByb2dyZXNzQmFyKSB7XG4gICAgdmFyIG1Qb3N4ID0gMDtcbiAgICB2YXIgZVBvc3ggPSAwO1xuICAgIHZhciBvYmogPSBwcm9ncmVzc0JhcjtcblxuICAgIC8vIGdldCBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudCBjcm9zc2Jyb3dzZXJcbiAgICBpZiAoIWUpIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgaWYgKGUucGFnZVgpIHtcbiAgICAgIG1Qb3N4ID0gZS5wYWdlWDtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50KSB7XG4gICAgICBtUG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgICB3aGlsZSAob2JqLm9mZnNldFBhcmVudCkge1xuICAgICAgZVBvc3ggKz0gb2JqLm9mZnNldExlZnQ7XG4gICAgICBvYmogPSBvYmoub2Zmc2V0UGFyZW50O1xuICAgIH1cblxuICAgIHZhciBvZmZzZXQgPSBtUG9zeCAtIGVQb3N4O1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gb2Zmc2V0IC8gcHJvZ3Jlc3NCYXIub2Zmc2V0V2lkdGg7XG4gICAgcmV0dXJuIGhvdmVyUG9zaXRpb247XG4gIH07XG5cbiAgdmFyIF9tb3VzZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgdGhhdC5wcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdGhhdC52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgfTtcblxuICB2YXIgX21vdXNlbGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICB0aGF0LnBsYXllckNvbnRhaW5lciA9IHRoYXQucHJvZ3Jlc3NDb250YWluZXIucGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgIHV0aWxpdHkuYWRkQ2xhc3ModGhhdC5wbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcblxuICAgIC8vIG9ubHkgYWRkIG1vdXNlbW92ZSB0byBkb2N1bWVudCB3aGVuIG1vdXNlIGRvd24gdG8gcHJvZ3Jlc3NCYXIgaGFwcGVuZWRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghaXNNb3VzZURvd24pIHJldHVybjtcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHRoYXQucGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgdGhhdC5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIC8vIHdoZW4gbW91c2UgaXMgdXAgcmVtb3ZlIG1vdXNlbW92ZSBldmVudCBmcm9tIGRvY3VtZW50RWxlbWVudFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bm1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgdGhhdC5wcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdGhhdC52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnN0eWxlLndpZHRoID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgLyoqXG4gICogcmVnaXN0ZXIgZXZlbnQgbGlzdGVuZXJzXG4gICovXG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIF9tb3VzZWxlYXZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBfbW91c2Vkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG4vL1xuLy8gUHJvZ3Jlc3MgQVBJcywgb3RoZXIgZWxlbWVudHMgY2hhbmdlIHByb2dyZXNzIHN0YXRlcyBmcm9tIGhlcmUuXG4vLyBBbHNvLCBpZiBwbGF5ZXIgZXhwb3NlIGEgUHJvZ3Jlc3Mgb2JqZWN0LCB0aGVuIHRoZXNlIEFQSXMgYmVjb21lIHRoZSBwbGF5ZXIncyBBUElzLlxuLy9cblByb2dyZXNzLnByb3RvdHlwZSA9IHtcbiAgdmlkZW9EdXJhdGlvbjogMCxcblxuICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh0aGlzLnZpZGVvRHVyYXRpb24gPD0gMCkgcmV0dXJuO1xuICAgIHZhciBwbGF5ZWRQZWNlbnRhZ2UgPSBkYXRhLnByb2dyZXNzIC8gdGhpcy52aWRlb0R1cmF0aW9uICogMTAwO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSBwbGF5ZWRQZWNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5zdHlsZS5sZWZ0ID0gcGxheWVkUGVjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBkYXRhLnByb2dyZXNzKTtcbiAgICB2YXIgcGxheWVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEucHJvZ3Jlc3MpICsgJyBwbGF5ZWQnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVldGV4dCcsIHBsYXllZEFyaWFUZXh0KTtcbiAgfSxcblxuICB1cGRhdGVCdWZmZXJlZFByb2dyZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHRoaXMudmlkZW9EdXJhdGlvbiA8PSAwKSByZXR1cm47XG4gICAgdmFyIGJ1ZmZlcmVkUGVyY2VudGFnZSA9IGRhdGEuYnVmZmVyZWQgLyB0aGlzLnZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnN0eWxlLndpZHRoID0gYnVmZmVyZWRQZXJjZW50YWdlLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEuYnVmZmVyZWQpO1xuICAgIHZhciBidWZmZXJlZEFyaWFUZXh0ID0gdXRpbGl0eS5yZWFkVGltZShkYXRhLmJ1ZmZlcmVkKSArICcgYnVmZmVyZWQnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgYnVmZmVyZWRBcmlhVGV4dCk7XG4gIH0sXG5cbiAgdXBkYXRlVGltZUJveDogZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGN1cnJlbnRUaW1lO1xuICB9LFxuXG4gIHVwZGF0ZVRpY2s6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfSxcblxuICB1cGRhdGVEdXJhdGlvbjogZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMudmlkZW9EdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG4gICAgLy8gdXBkYXRlIFVJcyByZWxhdGVkIHdpdGggZHVhdGlvblxuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKHRoaXMudmlkZW9EdXJhdGlvbik7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtYXgnLCB0aGlzLnZpZGVvRHVyYXRpb24udG9GaXhlZCgzKSk7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIHRoaXMudmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgfSxcblxuICByZWNlaXZlUGxheWluZzogZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyh0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LCAnaW52aXNpYmxlJyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZ3Jlc3M7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzcGxpdFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICBtaW51dGVzID0gJzAnICsgbWludXRlcztcbiAgICB9XG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgc2Vjb25kcyA9ICcwJyArIHNlY29uZHM7XG4gICAgfVxuICAgIGlmIChob3VycyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICB9LFxuXG4gIHJlYWRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgdmFyIHNlY29uZFN0cmluZyA9ICcgc2Vjb25kcyc7XG4gICAgdmFyIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlcyc7XG4gICAgdmFyIGhvdXJTdHJpbmcgPSAnIGhvdXJzJztcbiAgICBpZiAoc2Vjb25kcyA8PSAxKSB7XG4gICAgICBzZWNvbmRTdHJpbmcgPSAnIHNlY29uZCc7XG4gICAgfVxuICAgIGlmIChtaW51dGVzIDw9IDEpIHtcbiAgICAgIG1pbnV0ZVN0cmluZyA9ICcgbWludXRlJztcbiAgICB9XG4gICAgaWYgKGhvdXJzIDw9IDEpIHtcbiAgICAgIGhvdXJTdHJpbmcgPSAnIGhvdXInO1xuICAgIH1cblxuICAgIGlmICh0aW1lSW5TZWNvbmRzIDwgNjApIHtcbiAgICAgIHJldHVybiBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH0gZWxzZSBpZiAodGltZUluU2Vjb25kcyA+PSA2MCAmJiB0aW1lSW5TZWNvbmRzIDwgMzYwMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyBtaW51dGVTdHJpbmcgKyAnLCAnICsgc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGhvdXJzICsgaG91clN0cmluZyArICcsICcgKyBtaW51dGVzICsgbWludXRlU3RyaW5nICsgJywgJyArIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfVxuICB9LFxuXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpO1xuICAgIH1cbiAgfSxcblxuICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgfSxcblxuICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpO1xuICAgICAgZWwuY2xhc3NOYW1lPWVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgJyAnKTtcbiAgICB9XG4gIH0sXG5cbiAgZ2VuZXJhdGVSYW5kb21JZDogZnVuY3Rpb24oaWRMZW5ndGgpIHtcbiAgICB2YXIgaWQgPSAnJztcbiAgICB2YXIgY2hhclNldCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODknO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGlkTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHJhbmRQb3MgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyU2V0Lmxlbmd0aCk7XG4gICAgICAgIGlkICs9IGNoYXJTZXRbcmFuZFBvc107XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9VdGlsaXR5LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEByZXR1cm4geyBGdW5jdGlvbiB9IHByb2dyZXNzV3JhcHBlcigpIGNyZWF0ZSBhIERPTSBlbGVtZW50ICh3cmFwcGVyIGRpdikgZm9yIHByb2dyZXNzIGJhclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgYnVmZmVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xuICAgIGJ1ZmZlcmVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdidWZmZWQnKTtcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gYnVmZmVyZWREaXY7XG4gIH07XG5cbiAgdmFyIHBsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZWREaXYuY2xhc3NOYW1lID0gJ3BsYXllZCc7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcm9ncmVzc2JhcicpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheWVkJyk7XG4gICAgcGxheWVkRGl2LnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1pbicsIDApO1xuICAgIHJldHVybiBwbGF5ZWREaXY7XG4gIH07XG5cbiAgdmFyIGhvdmVyVGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBob3ZlclRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIGhvdmVyVGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIGhvdmVyVGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJlc2VudGF0aW9uJyk7XG4gICAgdGltZWJveERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICB0aW1lYm94RGl2LmNsYXNzTmFtZSA9ICd0aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgdGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gdGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZVBvcCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgdGltZVBvcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVQb3BEaXYuY2xhc3NOYW1lID0gJ3RpbWUtcG9wJztcbiAgICB0aW1lUG9wRGl2LmlubmVySFRNTCA9IHRpbWU7XG4gICAgcmV0dXJuIHRpbWVQb3BEaXY7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVByb2dyZXNzV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZEVsZW1lbnQgPSBidWZmZXJlZCgpO1xuICAgIHZhciBwbGF5ZWRFbGVtZW50ID0gcGxheWVkKCk7XG4gICAgdmFyIGhvdmVyVGltZWJveEVsZW1lbnQgPSBob3ZlclRpbWVib3goKTtcbiAgICB2YXIgdGltZUJveEVsZW1lbnQgPSB0aW1lYm94KCk7XG4gICAgdmFyIHByb2dyZXNzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzRWxlbWVudC5jbGFzc05hbWUgPSAncHJvZ3Jlc3MnO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXJlZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChwbGF5ZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoaG92ZXJUaW1lYm94RWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHRpbWVCb3hFbGVtZW50KTtcbiAgICB2YXIgcHJvZ3Jlc3NXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmNsYXNzTmFtZSA9ICdwcm9ncmVzcy13cmFwcGVyJztcbiAgICBwcm9ncmVzc1dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NFbGVtZW50KTtcblxuICAgIHJldHVybiBwcm9ncmVzc1dyYXBwZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1dyYXBwZXI6IGNyZWF0ZVByb2dyZXNzV3JhcHBlclxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJQcm9ncmVzc0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciBwbGF5QnV0dG9uRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50Jyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xuXG4vKipcbiAqIEN1c3RvbSBPYmplY3Q6IFBsYXlCdXR0b25cbiAqIG1lbWJlcnM6XG4gKiAxLiBET00gb2JqZWN0czogcGxheWJ1dHRvbkVsZW0gLSBjb250YWlucyBidXR0b24gZWxlbWVudFxuICogMi4gUGxheWluZyBzdGF0ZTogdGhpcy5zdGF0ZXNcbiAqIEluIG9yZGVyIHRvIGFjY2VzcyB0byBQbGF5QnV0dG9uIG9iamVjdCwgdXNlIHByb3RvdHlwZSdzIG1ldGhvZHMgKEFQSXMpXG4gKiBAc2VlIFBsYXlCdXR0b24ucHJvdG90eXBlXG4gKi9cblxudmFyIFBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wbGF5YnV0dG9uRWxlbSA9IHBsYXlCdXR0b25FbGVtZW50LmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gIHZhciBfYnV0dG9uQ2xpY2tMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgaWYgKHRoYXQuc3RhdGUucGxheWluZykge1xuICAgICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgICB0aGF0LnBsYXlidXR0b25FbGVtLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgICAgIHRoYXQuc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmltZW9QbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgICB0aGF0LnBsYXlidXR0b25FbGVtLmRpc3BhdGNoRXZlbnQodmltZW9QbGF5RXZlbnQpO1xuICAgICAgdGhhdC5zdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdGhpcy5wbGF5YnV0dG9uRWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9idXR0b25DbGlja0xpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5QbGF5QnV0dG9uLnByb3RvdHlwZSA9IHtcbiAgc3RhdGU6IHtcbiAgICAncGxheWluZyc6IGZhbHNlXG4gIH0sXG5cbiAgdG9nZ2xlUGxheTogZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgdmFyIHBsYXlidXR0b24gPSB0aGlzLnBsYXlidXR0b25FbGVtO1xuICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIHBsYXlJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICB2YXIgcGF1c2VJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblsxXTtcbiAgICBpZiAoZXZlbnROYW1lID09PSBwbGF5ZXJFdmVudHMucGF1c2UpIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5Jyk7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGxheScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgc3RhdGUucGxheWluZyA9IHRydWU7XG4gICAgICBwbGF5YnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwYXVzZScpO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BhdXNlJyk7XG4gICAgfVxuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXlCdXR0b247XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUGxheUJ1dHRvbi5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQHJldHVybiB7IEZ1bmN0aW9uIH0gY3JlYXRlUGxheUJ1dHRvbigpIGNyZWF0ZSBhIERPTSBlbGVtZW50IChkaXYpIGZvciBwbGF5IGJ1dHRvblxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgICB2YXIgcGxheVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdwb2x5Z29uJyk7XG4gICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsICcxLDAgMjAsMTAgMSwyMCcpO1xuICAgIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgcGxheUJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5U1ZHKTtcbiAgICByZXR1cm4gcGxheUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc05hbWUgPSAncGF1c2UtaWNvbic7XG4gICAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChsZWZ0UmVjdCk7XG4gICAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChyaWdodFJlY3QpO1xuICAgIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcbiAgICByZXR1cm4gcGF1c2VCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ3BsYXknO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheScpO1xuICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BsYXknKTtcbiAgICB2YXIgcGxheUJ0biA9IGNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHBhdXNlQnRuID0gY3JlYXRlUGF1c2VCdXR0b24oKTtcbiAgICBidXR0b24uYXBwZW5kQ2hpbGQocGF1c2VCdG4pO1xuICAgIHJldHVybiBidXR0b247XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBjcmVhdGVQbGF5QnV0dG9uOiBjcmVhdGVCdXR0b25cbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9QdWJTdWInKTtcblxuLyoqXG4gKiBQbGFjZSBhbGwgcHVibGlzaGVycyBoZXJlLiBJdCBhbHNvIG1ha2VzIGxvZ2dpbmcgZXNheS5cbiAqIFJlZ2lzdGVyIHRoZSBET00gZWxlbWVudHMgYnkgY2FsbGluZyBpbml0KCk7XG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgKiBAcGFyYW0gcGxheUJ1dHRvbiAoRE9NIE9iamVjdCk6IHBsYXlwYXVzZSBidXR0b25cbiAgKiBAcGFyYW0gcHJvZ3Jlc3MgKERPTSBPYmplY3QpOiBwcm9ncmVzcyBiYXJcbiAgKiBAcGFyYW0gdmlkZW8gKERPTSBPYmplY3QpOiB2aWRvZSBlbGVtZW50XG4gICogQHBhcmFtIHBsYXllckNvbnRhaW5lciAoRE9NIE9iamVjdCk6IGEgY29udGFpbmVyIGVsZW1lbnQgY29udGFpbnMgYWxsIGVsZW1lbnRzXG4gICpcbiAgKi9cbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAgIF9wbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBfcHJvZ3Jlc3NQdWJsaXNoZXJzKHByb2dyZXNzKTtcbiAgICBfdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgICBfcGxheWVyQ29udGFpbmVyUHVicyhwbGF5ZXJDb250YWluZXIpO1xuICB9O1xuXG4gIHZhciBfcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF92aWRlb1B1Ymxpc2hlcnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3BsYXllckNvbnRhaW5lclB1YnMgPSBmdW5jdGlvbihwbGF5ZXJDb250YWluZXIpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5yZXdpbmQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBQdWIvU3ViIG1vZGVsIGRlZmluaXRpb24gXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBldmVudHMgPSB7fTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50cyA9IHt9O1xuICB9O1xuXG4gIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfTtcblxuICB2YXIgdW5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICBldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIHB1Ymxpc2ggPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBwdWJsaXNoOiBwdWJsaXNoLFxuICAgIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgICBpbml0OiBpbml0XG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbi8qKlxuICogUGxhY2UgYWxsIHN1YnNjcmliZXJzIGhlcmUuIEl0IGFsc28gbWFrZXMgbG9nZ2luZyBlc2F5LlxuICogUmVnaXN0ZXIgdGhlIERPTSBlbGVtZW50cyBieSBjYWxsaW5nIGluaXQoKSBAc2VlIGluaXQoKVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICAvKipcbiAgKiBAcGFyYW0gcGxheUJ1dHRvbiAoRE9NIE9iamVjdCk6IHBsYXlwYXVzZSBidXR0b25cbiAgKiBAcGFyYW0gcHJvZ3Jlc3MgKERPTSBPYmplY3QpOiBwcm9ncmVzcyBiYXJcbiAgKiBAcGFyYW0gdmlkZW8gKERPTSBPYmplY3QpOiB2aWRvZSBlbGVtZW50XG4gICovXG4gIHZhciByZWdpc3RlclN1YnNjcmliZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvKSB7XG4gICAgX3ZpZGVvU3Vicyh2aWRlbyk7XG4gICAgX3Byb2dyZXNzU3Vicyhwcm9ncmVzcyk7XG4gICAgX2J1dHRvblN1YnMocGxheUJ1dHRvbik7XG4gIH07XG5cbiAgdmFyIF92aWRlb1N1YnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uc2VlayhkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50b2dnbGVQbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnRvZ2dsZVBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uZmFzdEZvcndhcmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucmV3aW5kLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5yZXdpbmQoZGF0YS5zdGVwcyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1N1YnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZUR1cmF0aW9uKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgcHJvZ3Jlc3MucmVjZWl2ZVBsYXlpbmcocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX2J1dHRvblN1YnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogcmVnaXN0ZXJTdWJzY3JpYmVyc1xuICB9O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=