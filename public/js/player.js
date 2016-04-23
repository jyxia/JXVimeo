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
	
	module.exports = (function() {
	  var playerContainer = __webpack_require__(1);
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
	
	  var init = function(videoLink) {
	    playerContainer = document.createElement('div');
	    playerContainer.className = 'player-container';
	    playerContainer.setAttribute('tabindex', 0);
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
	
	    playerContainer.addEventListener('keypress', _keypressListener, false);
	
	    return playerContainer;
	  };
	
	  var _keypressListener = function(event) {
	    if (event.keyCode === 32) {
	      var videoTogglePlayEvent = createCustomEvent(playerEvents.togglePlay);
	      playerContainer.dispatchEvent(videoTogglePlayEvent);
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
	
	    var playedProgressData = { progress: video.currentTime / video.duration * 100 };
	    var videoBufferEvent = createCustomEvent(playerEvents.played, playedProgressData);
	    videoContainer.dispatchEvent(videoBufferEvent);
	  };
	
	  var _progressUpdateListener = function() {
	    var range = 0;
	    var bf = video.player.buffered;
	    var time = video.player.currentTime;
	
	    while(!(bf.start(range) <= time && time <= bf.end(range))) {
	      range += 1;
	    }
	
	    if (range < bf.start.length) {
	      var bufferData = { buffered: bf.end(range) / video.duration * 100 };
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
	
	  var setCurrentTime = function(currentTime) {
	    video.player.currentTime = currentTime;
	    video.currentTime = currentTime;
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
	  };
	
	  var pause = function() {
	    video.player.pause();
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
	    setCurrentTime: setCurrentTime
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
	  tick: 'vimeoTick'
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
	    progressBarChildren.played.style.width = data.progress.toFixed(3) + '%';
	    progressBarChildren.timeBox.style.left = data.progress.toFixed(3) + '%';
	  };
	
	  var updateBufferedProgress = function(data) {
	    progressBarChildren.buffered.style.width = data.buffered.toFixed(3) + '%';
	  };
	
	  var updateTimeBox = function(data) {
	    var currentTime = utility.splitTime(data.currentTime);
	    progressBarChildren.timeBox.firstElementChild.innerHTML = currentTime;
	  };
	
	  var initTimeBox = function(data) {
	    videoDuration = data.duration;
	    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.duration);
	  };
	
	  var updateTick = function(data) {
	    progressBarChildren.timeBox.firstElementChild.innerHTML = utility.splitTime(data.currentTime);
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
	    initTimeBox: initTimeBox,
	    updateTick: updateTick
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
	    return bufferedDiv;
	  };
	
	  var played = function() {
	    var playedDiv = document.createElement('div');
	    playedDiv.className = 'played';
	    return playedDiv;
	  };
	
	  var hoverTimebox = function() {
	    var hoverTimeboxDiv = document.createElement('div');
	    hoverTimeboxDiv.className = 'hover-timebox';
	    var timePopDiv = timePop('00:00');
	    hoverTimeboxDiv.appendChild(timePopDiv);
	    return hoverTimeboxDiv;
	  };
	
	  var timebox = function() {
	    var timeboxDiv = document.createElement('div');
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
	    } else {
	      playIcon.style.display = 'none';
	      pauseIcon.style.display = 'block';
	      state.playing = true;
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
	      video.setCurrentTime(data.currentTime);
	    });
	    eventManager.subscribe(playerEvents.togglePlay, function() {
	      video.togglePlay();
	    });
	  };
	
	  var _progressSubs = function(progress) {
	    eventManager.subscribe(playerEvents.videoReady, function(data) {
	      progress.initTimeBox(data);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWY2ZTljNTU2ZWFjMzQzZTQ0OWQiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNURDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQy9DRDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7O0FBRUEsdUJBQXNCO0FBQ3RCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQW9CO0FBQ3BCO0FBQ0E7O0FBRUEsK0JBQThCO0FBQzlCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUM3R0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDaEJEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVSxPQUFPO0FBQ2pCLFdBQVUsT0FBTztBQUNqQixZQUFXLFlBQVksS0FBSztBQUM1QjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMLElBQUc7QUFDSDtBQUNBO0FBQ0E7Ozs7Ozs7QUN0QkE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBQzs7Ozs7OztBQ2REOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUM1SUQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMzREQ7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDakREO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ25ERDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDL0REOztBQUVBO0FBQ0EsYUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7O0FDNUJBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsRUFBQyIsImZpbGUiOiJwbGF5ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGFmNmU5YzU1NmVhYzM0M2U0NDlkXG4gKiovIiwiLy8gcmVxdWlyZSgnIXN0eWxlIWNzcyEuL2Nzcy9zdHlsZS5jc3MnKTtcbid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXIgPSByZXF1aXJlKCcuL2VsZW1lbnRzL1BsYXllckNvbnRhaW5lckVsZW1lbnQnKTtcbiAgdmFyIHZpZGVvTGluayA9ICdodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNzY5Nzk4NzEuaGQubXA0P3M9NzAwYmY4ZjMwZjhmODExNGNjMzcyZTk0YzQxNTZhYWYmcHJvZmlsZV9pZD0xMTMnO1xuICAvLyB2YXIgdmlkZW9MaW5rID0gJy9BcHBsaWNhdGlvbnMvTUFNUC9odGRvY3MvdmlkZW9jb2xsYWJvcmF0b3J5L29wdGltaXplZFZpZGVvcy92Yy01NDMtMi5tcDQnO1xuICB2YXIgcGxheWVyID0gcGxheWVyQ29udGFpbmVyLmluaXQodmlkZW9MaW5rKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChwbGF5ZXIpO1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvYXBwLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHZpZGVvQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9WaWRlbycpO1xudmFyIHByb2dyZXNzQ29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Qcm9ncmVzc0JhcicpO1xudmFyIHBsYXlCdXR0b25Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1BsYXlCdXR0b24nKTtcbnZhciBwdWJsaXNoZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMnKTtcbnZhciBzdWJzY3JpYmVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXI7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZXJDb250YWluZXIuY2xhc3NOYW1lID0gJ3BsYXllci1jb250YWluZXInO1xuICAgIHBsYXllckNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgdmFyIHZpZGVvID0gdmlkZW9Db21wb25lbnQuaW5pdCh2aWRlb0xpbmspO1xuICAgIHBsYXllckNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnY29udHJvbHMnO1xuICAgIHZhciBwbGF5QnRuID0gcGxheUJ1dHRvbkNvbXBvbmVudC5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NDb21wb25lbnQuaW5pdCgpO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICBwbGF5ZXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbHMpO1xuXG4gICAgLy8gcmVnaXN0ZXIgcHVicy9zdWJzIGhlcmUuXG4gICAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4sIHByb2dyZXNzLCB2aWRlbywgcGxheWVyQ29udGFpbmVyKTtcbiAgICBzdWJzY3JpYmVycy5pbml0KHBsYXlCdXR0b25Db21wb25lbnQsIHByb2dyZXNzQ29tcG9uZW50LCB2aWRlb0NvbXBvbmVudCwgcGxheWVyQ29udGFpbmVyKTtcblxuICAgIHBsYXllckNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCdrZXlwcmVzcycsIF9rZXlwcmVzc0xpc3RlbmVyLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gcGxheWVyQ29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfa2V5cHJlc3NMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICB2YXIgdmlkZW9Ub2dnbGVQbGF5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgICBwbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1RvZ2dsZVBsYXlFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJDb250YWluZXJFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgdmlkZW9FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvVmlkZW9FbGVtZW50Jyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHZpZGVvID0ge1xuICAgIGR1cmF0aW9uOiAwLFxuICAgIGN1cnJlbnRUaW1lOiAwLFxuICAgIGJ1ZmZlcmVkOiAwLFxuICAgIHBsYXlpbmc6IGZhbHNlXG4gIH07XG4gIHZhciB2aWRlb0NvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZpZGVvQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICAgIHZpZGVvLnBsYXllciA9IHZpZGVvQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgX2xvYWRlZGRhdGFMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCd0aW1ldXBkYXRlJywgX3RpbWV1cGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHZpZGVvLnBsYXllci5hZGRFdmVudExpc3RlbmVyKCdwcm9ncmVzcycsIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BsYXlpbmcnLCBfcGxheWluZ0xpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3BhdXNlJywgX3BhdXNlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9sb2FkZWRkYXRhTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5kdXJhdGlvbiA9IHZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuXG4gICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiB2aWRlby5wbGF5ZXIuYnVmZmVyZWQuZW5kKDApIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgfTtcblxuICB2YXIgX3RpbWV1cGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuICAgIHZhciB0aWNrRGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvLmN1cnJlbnRUaW1lIH07XG4gICAgdmFyIHZpZGVvVGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnRpY2ssIHRpY2tEYXRhKTtcbiAgICB2aWRlb0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB2aWRlby5jdXJyZW50VGltZSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHZpZGVvQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJhbmdlID0gMDtcbiAgICB2YXIgYmYgPSB2aWRlby5wbGF5ZXIuYnVmZmVyZWQ7XG4gICAgdmFyIHRpbWUgPSB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG5cbiAgICB3aGlsZSghKGJmLnN0YXJ0KHJhbmdlKSA8PSB0aW1lICYmIHRpbWUgPD0gYmYuZW5kKHJhbmdlKSkpIHtcbiAgICAgIHJhbmdlICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlIDwgYmYuc3RhcnQubGVuZ3RoKSB7XG4gICAgICB2YXIgYnVmZmVyRGF0YSA9IHsgYnVmZmVyZWQ6IGJmLmVuZChyYW5nZSkgLyB2aWRlby5kdXJhdGlvbiAqIDEwMCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb0J1ZmZlckV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIF9wbGF5aW5nTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdmlkZW9QbGF5aW5nRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWluZyk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1BsYXlpbmdFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9wYXVzZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgdmlkZW9Db250YWluZXIuZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICB9O1xuXG4gIHZhciBzZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uKGN1cnJlbnRUaW1lKSB7XG4gICAgdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSBjdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgdG9nZ2xlUGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh2aWRlby5wbGF5aW5nKSB7XG4gICAgICB2aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgICAgIHZpZGVvLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmlkZW8ucGxheWVyLnBsYXkoKTtcbiAgICAgIHZpZGVvLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICB2YXIgcGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnBsYXllci5wbGF5KCk7XG4gIH07XG5cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gIH07XG5cbiAgLy9cbiAgLy8gVmlkZW8gY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSB2aWRlbyBjb21wb25lbnQgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdG9nZ2xlUGxheTogdG9nZ2xlUGxheSxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBzZXRDdXJyZW50VGltZTogc2V0Q3VycmVudFRpbWVcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9WaWRlby5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiogQWxsIFZpZW1vIFBsYXllciBvd24gZXZlbnQgbmFtZXMgYXJlIGhlcmVcbipcbiogQHJldHVybiB7fVxuKlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGxheWluZzogJ3ZpbWVvUGxheWluZycsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHRvZ2dsZVBsYXk6ICd0b2dnbGVQbGF5JyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICd2aWVtb1BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuLyoqXG4qIGNyZWF0ZSBhIGN1c3RvbSBldmVudCBmb3IgYSBIVE1MIGVsZW1lbnQsIG9ubHkgdGhlIHNhbWUgZWxlbWVudCBjYW4gbGlzdGVuIHRvLlxuKiBpdCdzIHRoZSBlbGVtZW50J3MgaW50ZXJuYWwgZXZlbnRzXG4qIGxvYWQgUG9seWZpbGwgZmlyc3QgZm9yIElFXG4qXG4qIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHBhc3NlZCB3aXRoIHRoZSBldmVudFxuKiBAcmV0dXJuIHtDdXN0b21FdmVudH0gb3Ige0V2ZW50fVxuKlxuKi9cblxucmVxdWlyZSgnLi9Qb2x5ZmlsbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICBpZiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAnZGV0YWlsJzogZGF0YVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRXZlbnQoZXZlbnROYW1lKTtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcgKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH1cblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbnZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHByb2dyZXNzQmFyQ2hpbGRyZW4gPSB7fTtcbiAgdmFyIHZpZGVvRHVyYXRpb24gPSAwO1xuICB2YXIgcHJvZ3Jlc3NCYXI7XG4gIHZhciBwcm9ncmVzc0NvbnRhaW5lcjtcbiAgdmFyIHBsYXllckNvbnRhaW5lcjtcbiAgdmFyIGlzTW91c2VEb3duID0gZmFsc2U7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgICBwcm9ncmVzc0JhciA9IHByb2dyZXNzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQgPSBwcm9ncmVzc0Jhci5jaGlsZHJlblswXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzFdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMl07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM107XG5cbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX21vdXNlbGVhdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9tb3VzZWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX21vdXNldXBMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHJldHVybiBwcm9ncmVzc0NvbnRhaW5lcjtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb247XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWxlYXZlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICB9O1xuXG4gIHZhciBfbW91c2Vkb3duTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGlzTW91c2VEb3duID0gdHJ1ZTtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHBsYXllckNvbnRhaW5lciA9IHByb2dyZXNzQ29udGFpbmVyLnBhcmVudE5vZGUucGFyZW50Tm9kZTtcbiAgICB1dGlsaXR5LmFkZENsYXNzKHBsYXllckNvbnRhaW5lciwgJ2dyYWJiYWJsZScpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuICAgIC8vIG9ubHkgYWRkIG1vdXNlbW92ZSB0byBkb2N1bWVudCB3aGVuIG1vdXNlIGRvd24gdG8gcHJvZ3Jlc3NCYXIgaGFwcGVuZWRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZXVwTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIWlzTW91c2VEb3duKSByZXR1cm47XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICAvLyB3aGVuIG1vdXNlIGlzIHVwIHJlbW92ZSBtb3VzZW1vdmUgZXZlbnQgZnJvbSBkb2N1bWVudEVsZW1lbnRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZGlzcGF0Y2hTZWVrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgdmFyIGRhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgcHJvZ3Jlc3NDb250YWluZXIuZGlzcGF0Y2hFdmVudChzZWVrRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uKGUsIHByb2dyZXNzQmFyKSB7XG4gICAgdmFyIG1Qb3N4ID0gMDtcbiAgICB2YXIgZVBvc3ggPSAwO1xuICAgIHZhciBvYmogPSBwcm9ncmVzc0JhcjtcblxuICAgIC8vIGdldCBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudCBjcm9zc2Jyb3dzZXJcbiAgICBpZiAoIWUpIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgaWYgKGUucGFnZVgpIHtcbiAgICAgIG1Qb3N4ID0gZS5wYWdlWDtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50KSB7XG4gICAgICBtUG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgICB3aGlsZSAob2JqLm9mZnNldFBhcmVudCkge1xuICAgICAgZVBvc3ggKz0gb2JqLm9mZnNldExlZnQ7XG4gICAgICBvYmogPSBvYmoub2Zmc2V0UGFyZW50O1xuICAgIH1cblxuICAgIHZhciBvZmZzZXQgPSBtUG9zeCAtIGVQb3N4O1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gb2Zmc2V0IC8gcHJvZ3Jlc3NCYXIub2Zmc2V0V2lkdGg7XG4gICAgcmV0dXJuIGhvdmVyUG9zaXRpb247XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVBsYXllZFByb2dyZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkLnN0eWxlLndpZHRoID0gZGF0YS5wcm9ncmVzcy50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5zdHlsZS5sZWZ0ID0gZGF0YS5wcm9ncmVzcy50b0ZpeGVkKDMpICsgJyUnO1xuICB9O1xuXG4gIHZhciB1cGRhdGVCdWZmZXJlZFByb2dyZXNzID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQuc3R5bGUud2lkdGggPSBkYXRhLmJ1ZmZlcmVkLnRvRml4ZWQoMykgKyAnJSc7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVRpbWVCb3ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IGN1cnJlbnRUaW1lO1xuICB9O1xuXG4gIHZhciBpbml0VGltZUJveCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2aWRlb0R1cmF0aW9uID0gZGF0YS5kdXJhdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5kdXJhdGlvbik7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZVRpY2sgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICB9O1xuXG4gIC8vXG4gIC8vIFByb2dyZXNzIGNvbXBvbmVudCBwdWJsaWMgQVBJc1xuICAvLyBPdXRzaWRlIHdvcmxkIGNhbiBjaGFuZ2UgcHJvZ3Jlc3Mgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgdXBkYXRlUGxheWVkUHJvZ3Jlc3M6IHVwZGF0ZVBsYXllZFByb2dyZXNzLFxuICAgIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3M6IHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlVGltZUJveDogdXBkYXRlVGltZUJveCxcbiAgICBpbml0VGltZUJveDogaW5pdFRpbWVCb3gsXG4gICAgdXBkYXRlVGljazogdXBkYXRlVGlja1xuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XG4gICAgfVxuICAgIGlmIChzZWNvbmRzIDwgMTApIHtcbiAgICAgIHNlY29uZHMgPSAnMCcgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIGlmIChob3VycyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICB9LFxuXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpO1xuICAgIH1cbiAgfSxcblxuICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gJyAnICsgY2xhc3NOYW1lO1xuICAgIH1cbiAgfSxcblxuICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkpIHtcbiAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpO1xuICAgICAgZWwuY2xhc3NOYW1lPWVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgJyAnKTtcbiAgICB9XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvVXRpbGl0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgYnVmZmVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICAgIHJldHVybiBidWZmZXJlZERpdjtcbiAgfTtcblxuICB2YXIgcGxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllZERpdi5jbGFzc05hbWUgPSAncGxheWVkJztcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciBob3ZlclRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiBob3ZlclRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ3RpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICB0aW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiB0aW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciB0aW1lUG9wID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB0aW1lUG9wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVBvcERpdi5jbGFzc05hbWUgPSAndGltZS1wb3AnO1xuICAgIHRpbWVQb3BEaXYuaW5uZXJIVE1MID0gdGltZTtcbiAgICByZXR1cm4gdGltZVBvcERpdjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRWxlbWVudCA9IGJ1ZmZlcmVkKCk7XG4gICAgdmFyIHBsYXllZEVsZW1lbnQgPSBwbGF5ZWQoKTtcbiAgICB2YXIgaG92ZXJUaW1lYm94RWxlbWVudCA9IGhvdmVyVGltZWJveCgpO1xuICAgIHZhciB0aW1lQm94RWxlbWVudCA9IHRpbWVib3goKTtcbiAgICB2YXIgcHJvZ3Jlc3NFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmNsYXNzTmFtZSA9ICdwcm9ncmVzcyc7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGJ1ZmZlcmVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHBsYXllZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChob3ZlclRpbWVib3hFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGltZUJveEVsZW1lbnQpO1xuICAgIHZhciBwcm9ncmVzc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc1dyYXBwZXIuY2xhc3NOYW1lID0gJ3Byb2dyZXNzLXdyYXBwZXInO1xuICAgIHByb2dyZXNzV3JhcHBlci5hcHBlbmRDaGlsZChwcm9ncmVzc0VsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzV3JhcHBlcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHByb2dyZXNzV3JhcHBlcjogY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcblxudmFyIHBsYXlCdXR0b25FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9O1xuICB2YXIgcGxheWJ1dHRvbjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHBsYXlidXR0b24gPSBwbGF5QnV0dG9uRWxlbWVudC5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgcGxheWJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9idXR0b25DbGlja0xpc3RlbmVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHBsYXlidXR0b247XG4gIH07XG5cbiAgdmFyIF9idXR0b25DbGlja0xpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIHZhciB2aW1lb1BhdXNlRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgICAgcGxheWJ1dHRvbi5kaXNwYXRjaEV2ZW50KHZpbWVvUGF1c2VFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB2aW1lb1BsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHRvZ2dsZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuICAgIHZhciBwbGF5SWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMF07XG4gICAgdmFyIHBhdXNlSWNvbiA9IHBsYXlidXR0b24uY2hpbGRyZW5bMV07XG4gICAgaWYgKGV2ZW50TmFtZSA9PT0gcGxheWVyRXZlbnRzLnBhdXNlKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgc3RhdGUucGxheWluZyA9IHRydWU7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB0b2dnbGVQbGF5OiB0b2dnbGVcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0Jztcbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgICB2YXIgcGxheVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdwb2x5Z29uJyk7XG4gICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsICcxLDAgMjAsMTAgMSwyMCcpO1xuICAgIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgcGxheUJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5U1ZHKTtcbiAgICByZXR1cm4gcGxheUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc05hbWUgPSAncGF1c2UtaWNvbic7XG4gICAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChsZWZ0UmVjdCk7XG4gICAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChyaWdodFJlY3QpO1xuICAgIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcbiAgICByZXR1cm4gcGF1c2VCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ3BsYXknO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcbnZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL1B1YlN1YicpO1xuXG4vKipcbiogUGxhY2UgYWxsIHB1Ymxpc2hlcnMgaGVyZS4gSXQgYWxzbyBtYWtlcyBsb2dnaW5nIGVzYXkuXG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8sIHBsYXllckNvbnRhaW5lcikge1xuICAgIF9wbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBfcHJvZ3Jlc3NQdWJsaXNoZXJzKHByb2dyZXNzKTtcbiAgICBfdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgICBfcGxheWVyQ29udGFpbmVyUHVicyhwbGF5ZXJDb250YWluZXIpO1xuICB9O1xuXG4gIHZhciBfcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3Byb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIF92aWRlb1B1Ymxpc2hlcnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheWVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy50aWNrLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXlpbmcsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgX3BsYXllckNvbnRhaW5lclB1YnMgPSBmdW5jdGlvbihwbGF5ZXJDb250YWluZXIpIHtcbiAgICBwbGF5ZXJDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHVibGlzaGVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBldmVudHM6IHt9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9LFxuXG4gIHVuc3Vic3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHB1Ymxpc2g6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnaXN0ZXJTdWJzY3JpYmVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbywgcGxheWVyQ29udGFpbmVyKSB7XG4gICAgX3ZpZGVvU3Vicyh2aWRlbyk7XG4gICAgX3Byb2dyZXNzU3Vicyhwcm9ncmVzcyk7XG4gICAgX2J1dHRvblN1YnMocGxheUJ1dHRvbik7XG4gIH07XG5cbiAgdmFyIF92aWRlb1N1YnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uc2V0Q3VycmVudFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudG9nZ2xlUGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby50b2dnbGVQbGF5KCk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1N1YnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLmluaXRUaW1lQm94KGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgX2J1dHRvblN1YnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWluZywgZnVuY3Rpb24oKSB7XG4gICAgICBwbGF5QnV0dG9uLnRvZ2dsZVBsYXkocGxheWVyRXZlbnRzLnBsYXlpbmcpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHBsYXlCdXR0b24udG9nZ2xlUGxheShwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0pO1xuICB9O1xuXG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiByZWdpc3RlclN1YnNjcmliZXJzXG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==