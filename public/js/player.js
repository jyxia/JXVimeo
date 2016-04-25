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
	
	var Player = function(videoLink, width, height) {
	  var container = document.createElement('div');
	  var randomId = utility.generateRandomId(10);
	  container.className = 'player-container';
	  container.setAttribute('id', randomId);
	
	  this.video = new Video(videoLink);
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
	
	  var _resetMouseStopTimer = function() {
	    if (that.mouseStopTimer) {
	      window.clearTimeout(that.mouseStopTimer);
	      utility.removeClass(that.playerControls, 'hidden');
	    }
	    that.mouseStopTimer = window.setTimeout(function() {
	      utility.addClass(that.playerControls, 'hidden');
	    }, 2000);
	  };
	
	  var _mouseLeaveListner = function() {
	    if (!that.isMouseDown) {
	      utility.addClass(that.playerControls, 'hidden');
	    }
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseLeaveListener = function() {
	    that.playerContainer.addEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _controlsMouseEnterListener = function() {
	    utility.removeClass(that.playerControls, 'hidden');
	    if (that.mouseStopTimer) window.clearTimeout(that.mouseStopTimer);
	    that.playerContainer.removeEventListener('mousemove', _mousemoveListner, false);
	  };
	
	  var _mousemoveListner = function() {
	    _resetMouseStopTimer();
	  };
	
	  var _mousedownListener = function() {
	    that.isMouseDown = true;
	  };
	
	  var _mouseupListener = function() {
	    that.isMouseDown = false;
	  };
	
	  var _keydownListener = function(event) {
	    _resetMouseStopTimer();
	    if (event.keyCode === 32) {
	      event.preventDefault();
	      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
	      that.playerContainer.dispatchEvent(videoTogglePlayEvent);
	    }
	
	    if (event.keyCode === 37) {
	      that.rightArrowCount += 1;
	      var rewindData = { steps: that.rightArrowCount };
	      var rewindEvent = createCustomEvent(playerEvents.rewind, rewindData);
	      that.playerContainer.dispatchEvent(rewindEvent);
	    }
	
	    if (event.keyCode === 39) {
	      that.leftArrowCount += 1;
	      var fastForwardData = { steps: that.leftArrowCount };
	      var fastForwardEvent = createCustomEvent(playerEvents.fastForward, fastForwardData);
	      that.playerContainer.dispatchEvent(fastForwardEvent);
	    }
	  };
	
	  var _keyupListener = function(event) {
	    if (event.keyCode === 37) {
	      that.rightArrowCount = 0;
	    }
	
	    if (event.keyCode === 39) {
	      that.leftArrowCount = 0;
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
	
	Player.prototype = {
	  leftArrowCount: 0,
	  rightArrowCount: 0,
	  mouseStopTimer: null,
	  isMouseDown: false
	};
	
	module.exports = Player;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var videoElement = __webpack_require__(3);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
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
	
	  var _loadeddataListener = function() {
	    that.video.duration = that.video.player.duration;
	    var durationData = { duration: that.video.duration };
	    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
	    that.videoContainer.dispatchEvent(videoReadyEvent);
	
	    var bufferData = { buffered: that.video.player.buffered.end(0) / that.video.duration * 100 };
	    var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	    that.videoContainer.dispatchEvent(videoBufferEvent);
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
	
	var Progress = function() {
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
	    that.isMouseDown = true;
	    event.preventDefault();
	    that.playerContainer = that.progressContainer.parentNode.parentNode;
	    utility.addClass(that.playerContainer, 'grabbable');
	    _dispatchSeek(event);
	
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    that.progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
	    if (!that.isMouseDown) return;
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
	
	  this.progressContainer = progressWrapper.progressWrapper();
	  this.progressBar = this.progressContainer.firstElementChild;
	  this.progressBarChildren = {
	    buffered: this.progressBar.children[0],
	    played: this.progressBar.children[1],
	    hoverTimebox: this.progressBar.children[2],
	    timeBox: this.progressBar.children[3]
	  };
	
	  this.progressBar.addEventListener('mousemove', _mousemoveListener, false);
	  this.progressBar.addEventListener('mouseleave', _mouseleaveListener, false);
	  this.progressBar.addEventListener('mousedown', _mousedownListener, false);
	  document.documentElement.addEventListener('mouseup', _mouseupListener, false);
	
	  var that = this;
	};
	
	Progress.prototype = {
	  isMouseDown: false,
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
	
	var PlayButton = function() {
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
	
	  this.playbuttonElem = playButtonElement.createPlayButton();
	  this.playbuttonElem.addEventListener('click', _buttonClickListener, false);
	  var that = this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAwZTczODA4ZmIwNmZlNTM2YTg2NCIsIndlYnBhY2s6Ly8vLi9zcmMvYXBwLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXllci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVCQUFlO0FBQ2Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsOEJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaElBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7O0FBRUEsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDaEhBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ2hCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFlBQVcsWUFBWSxLQUFLO0FBQzVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0E7QUFDQTs7Ozs7OztBQ3RCQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDZEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWdCO0FBQ2hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuSkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxvQkFBbUIsZUFBZTtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNyRUQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3JFRDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0JBQXFCLDhCQUE4QjtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUN2Q0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUMiLCJmaWxlIjoicGxheWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJwbGF5ZXJcIiwgW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wicGxheWVyXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcInBsYXllclwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvblxuICoqLyIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgMGU3MzgwOGZiMDZmZTUzNmE4NjRcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgUGxheWVyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BsYXllcicpO1xuXG52YXIgYXBwID0gZnVuY3Rpb24odmlkZW9MaW5rLCB3aWR0aCwgaGVpZ2h0KSB7XG4gIHZhciBwbGF5ZXIgPSBuZXcgUGxheWVyKHZpZGVvTGluaywgd2lkdGgsIGhlaWdodCk7XG4gIHJldHVybiBwbGF5ZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBwLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFZpZGVvID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9WaWRlbycpO1xudmFyIFByb2dyZXNzID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Qcm9ncmVzc0JhcicpO1xudmFyIFBsYXlCdXR0b24gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BsYXlCdXR0b24nKTtcbnZhciBwdWJsaXNoZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMnKTtcbnZhciBzdWJzY3JpYmVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG5cbnZhciBQbGF5ZXIgPSBmdW5jdGlvbih2aWRlb0xpbmssIHdpZHRoLCBoZWlnaHQpIHtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2YXIgcmFuZG9tSWQgPSB1dGlsaXR5LmdlbmVyYXRlUmFuZG9tSWQoMTApO1xuICBjb250YWluZXIuY2xhc3NOYW1lID0gJ3BsYXllci1jb250YWluZXInO1xuICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdpZCcsIHJhbmRvbUlkKTtcblxuICB0aGlzLnZpZGVvID0gbmV3IFZpZGVvKHZpZGVvTGluayk7XG4gIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9IHdpZHRoO1xuICBjb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy52aWRlby52aWRlb0NvbnRhaW5lcik7XG5cbiAgdmFyIGNvbnRyb2xzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gIHZhciBwbGF5QnRuID0gbmV3IFBsYXlCdXR0b24oKTtcbiAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bi5wbGF5YnV0dG9uRWxlbSk7XG4gIHZhciBwcm9ncmVzcyA9IG5ldyBQcm9ncmVzcygpO1xuICBjb250cm9scy5hcHBlbmRDaGlsZChwcm9ncmVzcy5wcm9ncmVzc0NvbnRhaW5lcik7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgdGhpcy5wbGF5ZXJDb250cm9scyA9IGNvbnRyb2xzO1xuICB0aGlzLnBsYXllckNvbnRhaW5lciA9IGNvbnRhaW5lcjtcblxuICAvLyByZWdpc3RlciBwdWJzL3N1YnMgaGVyZS5cbiAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4ucGxheWJ1dHRvbkVsZW0sIHByb2dyZXNzLnByb2dyZXNzQ29udGFpbmVyLCB0aGlzLnZpZGVvLnZpZGVvQ29udGFpbmVyLCB0aGlzLnBsYXllckNvbnRhaW5lcik7XG4gIHN1YnNjcmliZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3MsIHRoaXMudmlkZW8pO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcblxuICB2YXIgX3Jlc2V0TW91c2VTdG9wVGltZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhhdC5tb3VzZVN0b3BUaW1lcikge1xuICAgICAgd2luZG93LmNsZWFyVGltZW91dCh0aGF0Lm1vdXNlU3RvcFRpbWVyKTtcbiAgICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3ModGhhdC5wbGF5ZXJDb250cm9scywgJ2hpZGRlbicpO1xuICAgIH1cbiAgICB0aGF0Lm1vdXNlU3RvcFRpbWVyID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9LCAyMDAwKTtcbiAgfTtcblxuICB2YXIgX21vdXNlTGVhdmVMaXN0bmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGF0LmlzTW91c2VEb3duKSB7XG4gICAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udHJvbHMsICdoaWRkZW4nKTtcbiAgICB9XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VMZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX2NvbnRyb2xzTW91c2VFbnRlckxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyh0aGF0LnBsYXllckNvbnRyb2xzLCAnaGlkZGVuJyk7XG4gICAgaWYgKHRoYXQubW91c2VTdG9wVGltZXIpIHdpbmRvdy5jbGVhclRpbWVvdXQodGhhdC5tb3VzZVN0b3BUaW1lcik7XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlbW92ZUxpc3RuZXIsIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBfcmVzZXRNb3VzZVN0b3BUaW1lcigpO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LmlzTW91c2VEb3duID0gdHJ1ZTtcbiAgfTtcblxuICB2YXIgX21vdXNldXBMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoYXQuaXNNb3VzZURvd24gPSBmYWxzZTtcbiAgfTtcblxuICB2YXIgX2tleWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgX3Jlc2V0TW91c2VTdG9wVGltZXIoKTtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgdmlkZW9Ub2dnbGVQbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgICB0aGF0LnBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVG9nZ2xlUGxheUV2ZW50KTtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHRoYXQucmlnaHRBcnJvd0NvdW50ICs9IDE7XG4gICAgICB2YXIgcmV3aW5kRGF0YSA9IHsgc3RlcHM6IHRoYXQucmlnaHRBcnJvd0NvdW50IH07XG4gICAgICB2YXIgcmV3aW5kRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucmV3aW5kLCByZXdpbmREYXRhKTtcbiAgICAgIHRoYXQucGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQocmV3aW5kRXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzOSkge1xuICAgICAgdGhhdC5sZWZ0QXJyb3dDb3VudCArPSAxO1xuICAgICAgdmFyIGZhc3RGb3J3YXJkRGF0YSA9IHsgc3RlcHM6IHRoYXQubGVmdEFycm93Q291bnQgfTtcbiAgICAgIHZhciBmYXN0Rm9yd2FyZEV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBmYXN0Rm9yd2FyZERhdGEpO1xuICAgICAgdGhhdC5wbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudChmYXN0Rm9yd2FyZEV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9rZXl1cExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcpIHtcbiAgICAgIHRoYXQucmlnaHRBcnJvd0NvdW50ID0gMDtcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkpIHtcbiAgICAgIHRoYXQubGVmdEFycm93Q291bnQgPSAwO1xuICAgIH1cbiAgfTtcblxuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIF9rZXlkb3duTGlzdGVuZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgX2tleXVwTGlzdGVuZXIsIGZhbHNlKTtcbiAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9tb3VzZWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIF9tb3VzZXVwTGlzdGVuZXIsIGZhbHNlKTtcblxuICB0aGlzLnBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdG5lciwgZmFsc2UpO1xuICB0aGlzLnBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX21vdXNlTGVhdmVMaXN0bmVyLCBmYWxzZSk7XG4gIHRoaXMucGxheWVyQ29udHJvbHMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIF9jb250cm9sc01vdXNlRW50ZXJMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnBsYXllckNvbnRyb2xzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfY29udHJvbHNNb3VzZUxlYXZlTGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cblBsYXllci5wcm90b3R5cGUgPSB7XG4gIGxlZnRBcnJvd0NvdW50OiAwLFxuICByaWdodEFycm93Q291bnQ6IDAsXG4gIG1vdXNlU3RvcFRpbWVyOiBudWxsLFxuICBpc01vdXNlRG93bjogZmFsc2Vcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUGxheWVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXllci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHZpZGVvRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1ZpZGVvRWxlbWVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxudmFyIFZpZGVvID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gIHRoaXMudmlkZW9Db250YWluZXIgPSB2aWRlb0VsZW1lbnQudmlkZW9FbGVtZW50KHZpZGVvTGluayk7XG4gIHRoaXMudmlkZW8gPSB7XG4gICAgZHVyYXRpb246IDAsXG4gICAgY3VycmVudFRpbWU6IDAsXG4gICAgYnVmZmVyZWQ6IDAsXG4gICAgcGxheWluZzogZmFsc2UsXG4gICAgcGxheWVyOiB0aGlzLnZpZGVvQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkXG4gIH07XG4gIHZhciB0aGF0ID0gdGhpcztcblxuICB2YXIgX2xvYWRlZGRhdGFMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoYXQudmlkZW8uZHVyYXRpb24gPSB0aGF0LnZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdGhhdC52aWRlby5kdXJhdGlvbiB9O1xuICAgIHZhciB2aWRlb1JlYWR5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZHVyYXRpb25EYXRhKTtcbiAgICB0aGF0LnZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9SZWFkeUV2ZW50KTtcblxuICAgIHZhciBidWZmZXJEYXRhID0geyBidWZmZXJlZDogdGhhdC52aWRlby5wbGF5ZXIuYnVmZmVyZWQuZW5kKDApIC8gdGhhdC52aWRlby5kdXJhdGlvbiAqIDEwMCB9O1xuICAgIHZhciB2aWRlb0J1ZmZlckV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBidWZmZXJEYXRhKTtcbiAgICB0aGF0LnZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gIH07XG5cbiAgdmFyIF90aW1ldXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lID0gdGhhdC52aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgdmFyIHRpY2tEYXRhID0geyBjdXJyZW50VGltZTogdGhhdC52aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1RpY2tFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50aWNrLCB0aWNrRGF0YSk7XG4gICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB0aGF0LnZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvUGxheWVkRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXllZEV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWQgPSB0aGF0LnZpZGVvLnBsYXllci5idWZmZXJlZDtcbiAgICBpZiAoYnVmZmVyZWQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGJ1ZmZlcmVkRW5kID0gYnVmZmVyZWQuZW5kKGJ1ZmZlcmVkLmxlbmd0aCAtIDEpO1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBidWZmZXJlZEVuZCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdGhhdC52aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3BsYXlpbmdMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aWRlb1BsYXlpbmdFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB0aGF0LnZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9QbGF5aW5nRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcGF1c2VMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIHRoYXQudmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfbW91c2VDbGlja0xpc3RuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnRvZ2dsZVBsYXkoKTtcbiAgfTtcblxuICB0aGlzLnZpZGVvQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX21vdXNlQ2xpY2tMaXN0bmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCBfbG9hZGVkZGF0YUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBfdGltZXVwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMudmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy52aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigncGxheWluZycsIF9wbGF5aW5nTGlzdGVuZXIsIGZhbHNlKTtcbiAgdGhpcy52aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigncGF1c2UnLCBfcGF1c2VMaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuLy9cbi8vIFZpZGVvIEFQSXMsIG90aGVyIGVsZW1lbnRzIGNoYW5nZSB2aWRlbyBzdGF0ZXMgZnJvbSBoZXJlLlxuLy8gQWxzbywgaWYgcGxheWVyIGV4cG9zZSBhIHZpZGVvIG9iamVjdCwgdGhlbiB0aGVzZSBBUElzIGJlY29tZSB0aGUgcGxheWVyJ3MgQVBJcy5cbi8vXG5WaWRlby5wcm90b3R5cGUgPSB7XG4gIHNlZWs6IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSA9IHRpbWU7XG4gIH0sXG5cbiAgdG9nZ2xlUGxheTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMudmlkZW8ucGxheWluZykge1xuICAgICAgdGhpcy52aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICAgIHRoaXMudmlkZW8ucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZpZGVvLnBsYXllci5wbGF5KCk7XG4gICAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfSxcblxuICBwbGF5OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnZpZGVvLnBsYXllci5wbGF5KCk7XG4gICAgdGhpcy52aWRlby5wbGF5aW5nID0gdHJ1ZTtcbiAgfSxcblxuICBwYXVzZTogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy52aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICB0aGlzLnZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgfSxcblxuICBmYXN0Rm9yd2FyZDogZnVuY3Rpb24oc3RlcHMpIHtcbiAgICB0aGlzLnZpZGVvLmN1cnJlbnRUaW1lICs9IHN0ZXBzO1xuICAgIHRoaXMudmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lID0gdGhpcy52aWRlby5jdXJyZW50VGltZTtcbiAgfSxcblxuICByZXdpbmQ6IGZ1bmN0aW9uKHN0ZXBzKSB7XG4gICAgdGhpcy52aWRlby5jdXJyZW50VGltZSAtPSBzdGVwcztcbiAgICB0aGlzLnZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IHRoaXMudmlkZW8uY3VycmVudFRpbWU7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVmlkZW87XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvVmlkZW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlVmlkZW9FbGVtZW50ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIHZpZGVvQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmlkZW9Db250YWluZXIuY2xhc3NOYW1lID0gJ3ZpZGVvLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgdmlkZW9MaW5rKTtcbiAgICB2aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlb0VsZW1lbnQpO1xuICAgIHJldHVybiB2aWRlb0NvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHZpZGVvRWxlbWVudDogY3JlYXRlVmlkZW9FbGVtZW50XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1ZpZGVvRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxuLyoqXG4qIEFsbCBWaWVtbyBQbGF5ZXIgb3duIGV2ZW50IG5hbWVzIGFyZSBoZXJlXG4qXG4qIEByZXR1cm4ge31cbipcbiovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB2aWRlb1JlYWR5OiAndmltZW9WaWRlb1JlYWR5JyxcbiAgcGxheTogJ3ZpbWVvUGxheScsXG4gIHBsYXlpbmc6ICd2aW1lb1BsYXlpbmcnLFxuICBwYXVzZTogJ3ZpbWVvUGF1c2UnLFxuICB0b2dnbGVQbGF5OiAndG9nZ2xlUGxheScsXG4gIHNlZWs6ICd2aW1lb1NlZWsnLFxuICBidWZmZXJlZDogJ3ZpbWVvQnVmZmVyZWQnLFxuICBwcm9ncmVzc3VwZGF0ZTogJ3ZpbWVvUHJvZ3Jlc3NVcGRkYXRlJyxcbiAgcGxheWVkOiAndmllbW9QbGF5ZWQnLFxuICB0aWNrOiAndmltZW9UaWNrJyxcbiAgZmFzdEZvcndhcmQ6ICd2aWVtb0Zhc3RGb3J3YXJkJyxcbiAgcmV3aW5kOiAndmltZW9SZXdpbmQnXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIGNyZWF0ZSBhIGN1c3RvbSBldmVudCBmb3IgYSBIVE1MIGVsZW1lbnQsIG9ubHkgdGhlIHNhbWUgZWxlbWVudCBjYW4gbGlzdGVuIHRvLlxuKiBpdCdzIHRoZSBlbGVtZW50J3MgaW50ZXJuYWwgZXZlbnRzXG4qIGxvYWQgUG9seWZpbGwgZmlyc3QgZm9yIElFXG4qXG4qIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHBhc3NlZCB3aXRoIHRoZSBldmVudFxuKiBAcmV0dXJuIHtDdXN0b21FdmVudH0gb3Ige0V2ZW50fVxuKlxuKi9cblxucmVxdWlyZSgnLi9Qb2x5ZmlsbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICBpZiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAnZGV0YWlsJzogZGF0YVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRXZlbnQoZXZlbnROYW1lKTtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcgKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH1cblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG52YXIgUHJvZ3Jlc3MgPSBmdW5jdGlvbigpIHtcbiAgdmFyIF9kaXNwYXRjaFNlZWsgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHRoYXQucHJvZ3Jlc3NCYXIpO1xuICAgIHZhciBkYXRhID0geyBjdXJyZW50VGltZTogdGhhdC52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgdGhhdC5wcm9ncmVzc0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHNlZWtFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCB0aGF0LnByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB0aGF0LnZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICB9O1xuXG4gIHZhciBfbW91c2VsZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHRoYXQuaXNNb3VzZURvd24gPSB0cnVlO1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhhdC5wbGF5ZXJDb250YWluZXIgPSB0aGF0LnByb2dyZXNzQ29udGFpbmVyLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHRoYXQucGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG5cbiAgICAvLyBvbmx5IGFkZCBtb3VzZW1vdmUgdG8gZG9jdW1lbnQgd2hlbiBtb3VzZSBkb3duIHRvIHByb2dyZXNzQmFyIGhhcHBlbmVkXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICB0aGF0LnByb2dyZXNzQmFyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZXVwTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoYXQuaXNNb3VzZURvd24pIHJldHVybjtcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHRoYXQucGxheWVyQ29udGFpbmVyLCAnZ3JhYmJhYmxlJyk7XG4gICAgdGhhdC5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIC8vIHdoZW4gbW91c2UgaXMgdXAgcmVtb3ZlIG1vdXNlbW92ZSBldmVudCBmcm9tIGRvY3VtZW50RWxlbWVudFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bm1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgdGhhdC5wcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdGhhdC52aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnN0eWxlLndpZHRoID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgdGhhdC5wcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICB0aGF0LnByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgdGhpcy5wcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgdGhpcy5wcm9ncmVzc0JhciA9IHRoaXMucHJvZ3Jlc3NDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbiA9IHtcbiAgICBidWZmZXJlZDogdGhpcy5wcm9ncmVzc0Jhci5jaGlsZHJlblswXSxcbiAgICBwbGF5ZWQ6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMV0sXG4gICAgaG92ZXJUaW1lYm94OiB0aGlzLnByb2dyZXNzQmFyLmNoaWxkcmVuWzJdLFxuICAgIHRpbWVCb3g6IHRoaXMucHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM11cbiAgfTtcblxuICB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VsZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX21vdXNldXBMaXN0ZW5lciwgZmFsc2UpO1xuXG4gIHZhciB0aGF0ID0gdGhpcztcbn07XG5cblByb2dyZXNzLnByb3RvdHlwZSA9IHtcbiAgaXNNb3VzZURvd246IGZhbHNlLFxuICB2aWRlb0R1cmF0aW9uOiAwLFxuXG4gIHVwZGF0ZVBsYXllZFByb2dyZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHRoaXMudmlkZW9EdXJhdGlvbiA8PSAwKSByZXR1cm47XG4gICAgdmFyIHBsYXllZFBlY2VudGFnZSA9IGRhdGEucHJvZ3Jlc3MgLyB0aGlzLnZpZGVvRHVyYXRpb24gKiAxMDA7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IHBsYXllZFBlY2VudGFnZS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSBwbGF5ZWRQZWNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW5vdycsIGRhdGEucHJvZ3Jlc3MpO1xuICAgIHZhciBwbGF5ZWRBcmlhVGV4dCA9IHV0aWxpdHkucmVhZFRpbWUoZGF0YS5wcm9ncmVzcykgKyAnIHBsYXllZCc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWV0ZXh0JywgcGxheWVkQXJpYVRleHQpO1xuICB9LFxuXG4gIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAodGhpcy52aWRlb0R1cmF0aW9uIDw9IDApIHJldHVybjtcbiAgICB2YXIgYnVmZmVyZWRQZXJjZW50YWdlID0gZGF0YS5idWZmZXJlZCAvIHRoaXMudmlkZW9EdXJhdGlvbiAqIDEwMDtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc3R5bGUud2lkdGggPSBidWZmZXJlZFBlcmNlbnRhZ2UudG9GaXhlZCgzKSArICclJztcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgZGF0YS5idWZmZXJlZCk7XG4gICAgdmFyIGJ1ZmZlcmVkQXJpYVRleHQgPSB1dGlsaXR5LnJlYWRUaW1lKGRhdGEuYnVmZmVyZWQpICsgJyBidWZmZXJlZCc7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZXRleHQnLCBidWZmZXJlZEFyaWFUZXh0KTtcbiAgfSxcblxuICB1cGRhdGVUaW1lQm94OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gY3VycmVudFRpbWU7XG4gIH0sXG5cbiAgdXBkYXRlVGljazogZnVuY3Rpb24oZGF0YSkge1xuICAgIHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICB9LFxuXG4gIHVwZGF0ZUR1cmF0aW9uOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgdGhpcy52aWRlb0R1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcbiAgICAvLyB1cGRhdGUgVUlzIHJlbGF0ZWQgd2l0aCBkdWF0aW9uXG4gICAgdGhpcy5wcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUodGhpcy52aWRlb0R1cmF0aW9uKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnNldEF0dHJpYnV0ZSgnYXJpYS12YWx1ZW1heCcsIHRoaXMudmlkZW9EdXJhdGlvbi50b0ZpeGVkKDMpKTtcbiAgICB0aGlzLnByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWF4JywgdGhpcy52aWRlb0R1cmF0aW9uLnRvRml4ZWQoMykpO1xuICB9LFxuXG4gIHJlY2VpdmVQbGF5aW5nOiBmdW5jdGlvbigpIHtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHRoaXMucHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3gsICdpbnZpc2libGUnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmVzcztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9Qcm9ncmVzc0Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNwbGl0VGltZTogZnVuY3Rpb24odGltZUluU2Vjb25kcykge1xuICAgIHZhciB0bSA9IG5ldyBEYXRlKHRpbWVJblNlY29uZHMgKiAxMDAwKTtcbiAgICB2YXIgaG91cnMgPSB0bS5nZXRVVENIb3VycygpO1xuICAgIHZhciBtaW51dGVzID0gdG0uZ2V0VVRDTWludXRlcygpO1xuICAgIHZhciBzZWNvbmRzID0gdG0uZ2V0VVRDU2Vjb25kcygpO1xuICAgIGlmIChtaW51dGVzIDwgMTApIHtcbiAgICAgIG1pbnV0ZXMgPSAnMCcgKyBtaW51dGVzO1xuICAgIH1cbiAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICBzZWNvbmRzID0gJzAnICsgc2Vjb25kcztcbiAgICB9XG4gICAgaWYgKGhvdXJzID09PSAwKSB7XG4gICAgICByZXR1cm4gbWludXRlcyArICc6JyArIHNlY29uZHM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHM7XG4gIH0sXG5cbiAgcmVhZFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICB2YXIgc2Vjb25kU3RyaW5nID0gJyBzZWNvbmRzJztcbiAgICB2YXIgbWludXRlU3RyaW5nID0gJyBtaW51dGVzJztcbiAgICB2YXIgaG91clN0cmluZyA9ICcgaG91cnMnO1xuICAgIGlmIChzZWNvbmRzIDw9IDEpIHtcbiAgICAgIHNlY29uZFN0cmluZyA9ICcgc2Vjb25kJztcbiAgICB9XG4gICAgaWYgKG1pbnV0ZXMgPD0gMSkge1xuICAgICAgbWludXRlU3RyaW5nID0gJyBtaW51dGUnO1xuICAgIH1cbiAgICBpZiAoaG91cnMgPD0gMSkge1xuICAgICAgaG91clN0cmluZyA9ICcgaG91cic7XG4gICAgfVxuXG4gICAgaWYgKHRpbWVJblNlY29uZHMgPCA2MCkge1xuICAgICAgcmV0dXJuIHNlY29uZHMgKyBzZWNvbmRTdHJpbmc7XG4gICAgfSBlbHNlIGlmICh0aW1lSW5TZWNvbmRzID49IDYwICYmIHRpbWVJblNlY29uZHMgPCAzNjAwKSB7XG4gICAgICByZXR1cm4gbWludXRlcyArIG1pbnV0ZVN0cmluZyArICcsICcgKyBzZWNvbmRzICsgc2Vjb25kU3RyaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaG91cnMgKyBob3VyU3RyaW5nICsgJywgJyArIG1pbnV0ZXMgKyBtaW51dGVTdHJpbmcgKyAnLCAnICsgc2Vjb25kcyArIHNlY29uZFN0cmluZztcbiAgICB9XG4gIH0sXG5cbiAgaGFzQ2xhc3M6IGZ1bmN0aW9uIChlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gISFlbC5jbGFzc05hbWUubWF0Y2gobmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKSk7XG4gICAgfVxuICB9LFxuXG4gIGFkZENsYXNzOiBmdW5jdGlvbihlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIGVsLmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJyk7XG4gICAgICBlbC5jbGFzc05hbWU9ZWwuY2xhc3NOYW1lLnJlcGxhY2UocmVnLCAnICcpO1xuICAgIH1cbiAgfSxcblxuICBnZW5lcmF0ZVJhbmRvbUlkOiBmdW5jdGlvbihpZExlbmd0aCkge1xuICAgIHZhciBpZCA9ICcnO1xuICAgIHZhciBjaGFyU2V0ID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSc7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gaWRMZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgcmFuZFBvcyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJTZXQubGVuZ3RoKTtcbiAgICAgICAgaWQgKz0gY2hhclNldFtyYW5kUG9zXTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1V0aWxpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGJ1ZmZlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnVmZmVyZWREaXYuY2xhc3NOYW1lID0gJ2J1ZmZlcmVkJztcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBidWZmZXJlZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAnYnVmZmVkJyk7XG4gICAgYnVmZmVyZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbWluJywgMCk7XG4gICAgcmV0dXJuIGJ1ZmZlcmVkRGl2O1xuICB9O1xuXG4gIHZhciBwbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAncHJvZ3Jlc3NiYXInKTtcbiAgICBwbGF5ZWREaXYuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgJ3BsYXllZCcpO1xuICAgIHBsYXllZERpdi5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVtaW4nLCAwKTtcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciBob3ZlclRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LnNldEF0dHJpYnV0ZSgncm9sZScsICdwcmVzZW50YXRpb24nKTtcbiAgICBob3ZlclRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiBob3ZlclRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdyb2xlJywgJ3ByZXNlbnRhdGlvbicpO1xuICAgIHRpbWVib3hEaXYuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIHRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIHRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVQb3AgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lUG9wRGl2LmNsYXNzTmFtZSA9ICd0aW1lLXBvcCc7XG4gICAgdGltZVBvcERpdi5pbm5lckhUTUwgPSB0aW1lO1xuICAgIHJldHVybiB0aW1lUG9wRGl2O1xuICB9O1xuXG4gIHZhciBjcmVhdGVQcm9ncmVzc1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWRFbGVtZW50ID0gYnVmZmVyZWQoKTtcbiAgICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICAgIHZhciBob3ZlclRpbWVib3hFbGVtZW50ID0gaG92ZXJUaW1lYm94KCk7XG4gICAgdmFyIHRpbWVCb3hFbGVtZW50ID0gdGltZWJveCgpO1xuICAgIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3Byb2dyZXNzJztcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGhvdmVyVGltZWJveEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZCh0aW1lQm94RWxlbWVudCk7XG4gICAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzV3JhcHBlci5jbGFzc05hbWUgPSAncHJvZ3Jlc3Mtd3JhcHBlcic7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmFwcGVuZENoaWxkKHByb2dyZXNzRWxlbWVudCk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyOiBjcmVhdGVQcm9ncmVzc1dyYXBwZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcGxheUJ1dHRvbkVsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudCcpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcblxudmFyIFBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIF9idXR0b25DbGlja0xpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBpZiAodGhhdC5zdGF0ZS5wbGF5aW5nKSB7XG4gICAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICAgIHRoYXQucGxheWJ1dHRvbkVsZW0uZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICAgICAgdGhhdC5zdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aW1lb1BsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICAgIHRoYXQucGxheWJ1dHRvbkVsZW0uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICB0aGF0LnN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnBsYXlidXR0b25FbGVtID0gcGxheUJ1dHRvbkVsZW1lbnQuY3JlYXRlUGxheUJ1dHRvbigpO1xuICB0aGlzLnBsYXlidXR0b25FbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2J1dHRvbkNsaWNrTGlzdGVuZXIsIGZhbHNlKTtcbiAgdmFyIHRoYXQgPSB0aGlzO1xufTtcblxuUGxheUJ1dHRvbi5wcm90b3R5cGUgPSB7XG4gIHN0YXRlOiB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9LFxuXG4gIHRvZ2dsZVBsYXk6IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgIHZhciBwbGF5YnV0dG9uID0gdGhpcy5wbGF5YnV0dG9uRWxlbTtcbiAgICB2YXIgc3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBwbGF5SWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMF07XG4gICAgdmFyIHBhdXNlSWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMV07XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gcGxheWVyRXZlbnRzLnBhdXNlKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGxheScpO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJ3BsYXknKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgICAgcGxheWJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnLCAncGF1c2UnKTtcbiAgICAgIHBsYXlidXR0b24uc2V0QXR0cmlidXRlKCd0aXRsZScsICdwYXVzZScpO1xuICAgIH1cbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5QnV0dG9uO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5QnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5LWljb24nO1xuICAgIHZhciBwbGF5U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3BvbHlnb24nKTtcbiAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgJzEsMCAyMCwxMCAxLDIwJyk7XG4gICAgcGxheVNWRy5hcHBlbmRDaGlsZChwb2x5Z29uKTtcbiAgICBwbGF5QnV0dG9uLmFwcGVuZENoaWxkKHBsYXlTVkcpO1xuICAgIHJldHVybiBwbGF5QnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVQYXVzZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBhdXNlQnV0dG9uLmNsYXNzTmFtZSA9ICdwYXVzZS1pY29uJztcbiAgICB2YXIgcGF1c2VTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgbGVmdFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKGxlZnRSZWN0KTtcbiAgICB2YXIgcmlnaHRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcxMicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKHJpZ2h0UmVjdCk7XG4gICAgcGF1c2VCdXR0b24uYXBwZW5kQ2hpbGQocGF1c2VTVkcpO1xuICAgIHJldHVybiBwYXVzZUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncGxheSc7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsICdwbGF5Jyk7XG4gICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgndGl0bGUnLCAncGxheScpO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcbnZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL1B1YlN1YicpO1xuXG4vKipcbiogUGxhY2UgYWxsIHB1Ymxpc2hlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAgIF9wbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBfcHJvZ3Jlc3NQdWJsaXNoZXJzKHByb2dyZXNzKTtcbiAgICBfdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgICBfcGxheWVyQ29udGFpbmVyUHVicyhwbGF5ZXJDb250YWluZXIpO1xuICB9O1xuXG4gIHZhciBfcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF92aWRlb1B1Ymxpc2hlcnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3BsYXllckNvbnRhaW5lclB1YnMgPSBmdW5jdGlvbihwbGF5ZXJDb250YWluZXIpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5mYXN0Rm9yd2FyZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmZhc3RGb3J3YXJkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5yZXdpbmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5yZXdpbmQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBldmVudHMgPSB7fTtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50cyA9IHt9O1xuICB9O1xuXG4gIHZhciBzdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgZXZlbnRzW2V2ZW50TmFtZV0gPSBldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICBldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfTtcblxuICB2YXIgdW5zdWJzY3JpYmUgPSBmdW5jdGlvbihldmVudE5hbWUsIGZuKSB7XG4gICAgaWYgKGV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChldmVudHNbZXZlbnROYW1lXVtpXSA9PT0gZm4pIHtcbiAgICAgICAgICBldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIHB1Ymxpc2ggPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAoZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIGV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzdWJzY3JpYmU6IHN1YnNjcmliZSxcbiAgICBwdWJsaXNoOiBwdWJsaXNoLFxuICAgIHVuc3Vic2NyaWJlOiB1bnN1YnNjcmliZSxcbiAgICBpbml0OiBpbml0XG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnaXN0ZXJTdWJzY3JpYmVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbykge1xuICAgIF92aWRlb1N1YnModmlkZW8pO1xuICAgIF9wcm9ncmVzc1N1YnMocHJvZ3Jlc3MpO1xuICAgIF9idXR0b25TdWJzKHBsYXlCdXR0b24pO1xuICB9O1xuXG4gIHZhciBfdmlkZW9TdWJzID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby5wYXVzZSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLnNlZWsoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby50b2dnbGVQbGF5KCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuZmFzdEZvcndhcmQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLmZhc3RGb3J3YXJkKGRhdGEuc3RlcHMpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnJld2luZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8ucmV3aW5kKGRhdGEuc3RlcHMpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NTdWJzID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVEdXJhdGlvbihkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5aW5nLCBmdW5jdGlvbigpIHtcbiAgICAgIHByb2dyZXNzLnJlY2VpdmVQbGF5aW5nKHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlQnVmZmVyZWRQcm9ncmVzcyhkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVBsYXllZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVRpY2soZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9idXR0b25TdWJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbikge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgcGxheUJ1dHRvbi50b2dnbGVQbGF5KHBsYXllckV2ZW50cy5wbGF5aW5nKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IHJlZ2lzdGVyU3Vic2NyaWJlcnNcbiAgfTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9