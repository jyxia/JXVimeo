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
	module.exports = (function() {
	  var playerContainer = __webpack_require__(1);
	  // var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
	  var videoLink = '/Applications/MAMP/htdocs/videocollaboratory/optimizedVideos/vc-543-2.mp4';
	  var player = playerContainer.playerContainer(videoLink);
	  document.getElementsByTagName('body')[0].appendChild(player);
	})();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var videoComponent = __webpack_require__(2);
	var progressComponent = __webpack_require__(7);
	var playButton = __webpack_require__(10);
	var publishers = __webpack_require__(12);
	var subscribers = __webpack_require__(14);
	
	module.exports = (function() {
	  var playerContainer = function(videoLink) {
	    var container = document.createElement('div');
	    container.className = 'player-container';
	    var video = videoComponent.init(videoLink);
	    container.appendChild(video);
	
	    var controls = document.createElement('div');
	    controls.className = 'controls';
	    var playBtn = playButton.init();
	    controls.appendChild(playBtn);
	    var progress = progressComponent.init();
	    controls.appendChild(progress);
	    container.appendChild(controls);
	
	    // register pubs/subs here.
	    publishers.init(playBtn, progress, video);
	    subscribers.init(playBtn, progressComponent, videoComponent);
	
	    return container;
	  };
	
	  return {
	    playerContainer: playerContainer,
	  };
	
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var videoElement = __webpack_require__(3);
	var playerEvents = __webpack_require__(4);
	var createCustomEvent = __webpack_require__(5);
	
	module.exports = (function() {
	  var video = {
	    duration: 0,
	    currentTime: 0,
	    buffered: 0
	  };
	  var playerContainer;
	
	  var init = function(videoLink) {
	    playerContainer = videoElement.videoElement(videoLink);
	    video.player = playerContainer.firstElementChild;
	    video.player.addEventListener('loadeddata', _loadeddataListener, false);
	    video.player.addEventListener('timeupdate', _timeupdateListener, false);
	    video.player.addEventListener('progress', _progressUpdateListener, false);
	
	    return playerContainer;
	  };
	
	  var _loadeddataListener = function() {
	    video.duration = video.player.duration;
	    var durationData = { duration: video.duration };
	    var videoReadyEvent = createCustomEvent(playerEvents.videoReady, durationData);
	    playerContainer.dispatchEvent(videoReadyEvent);
	
	    var bufferData = { buffered: video.player.buffered.end(0) / video.duration * 100 };
	    var videoBufferEvent = createCustomEvent(playerEvents.buffered, bufferData);
	    playerContainer.dispatchEvent(videoBufferEvent);
	  };
	
	  var _timeupdateListener = function() {
	    video.currentTime = video.player.currentTime;
	    var tickData = { currentTime: video.currentTime };
	    var videoTickEvent = createCustomEvent(playerEvents.tick, tickData);
	    playerContainer.dispatchEvent(videoTickEvent);
	
	    var playedProgressData = { progress: video.currentTime / video.duration * 100 };
	    var videoBufferEvent = createCustomEvent(playerEvents.played, playedProgressData);
	    playerContainer.dispatchEvent(videoBufferEvent);
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
	      playerContainer.dispatchEvent(videoBufferEvent);
	    }
	  };
	
	  var setCurrentTime = function(currentTime) {
	    video.player.currentTime = currentTime;
	    video.currentTime = currentTime;
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
	    play: play,
	    pause: pause,
	    setCurrentTime: setCurrentTime
	  };
	
	})();


/***/ },
/* 3 */
/***/ function(module, exports) {

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

	/**
	* All Viemo Player event names are here
	*
	* @return {}
	*
	*/
	
	module.exports = {
	  videoReady: 'vimeoVideoReady',
	  play: 'vimeoPlay',
	  pause: 'vimeoPause',
	  seek: 'vimeoSeek',
	  buffered: 'vimeoBuffered',
	  progressupdate: 'vimeoProgressUpddate',
	  played: 'played',
	  tick: 'vimeoTick'
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

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

	module.exports = (function () {
	  if ( typeof window.CustomEvent === "function" ) return false;
	
	  function CustomEvent ( event, params ) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent( 'CustomEvent' );
	    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	    return evt;
	  }
	
	  CustomEvent.prototype = window.Event.prototype;
	  window.CustomEvent = CustomEvent;
	})();


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

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
	    event.preventDefault();
	    playerContainer = progressContainer.parentNode.parentNode;
	    utility.addClass(playerContainer, 'grabbable');
	    _dispatchSeek(event);
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
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

	module.exports = {
	  splitTime: function(timeInSeconds) {
	    var tm = new Date(timeInSeconds * 1000);
	    var hours = tm.getUTCHours();
	    var minutes = tm.getUTCMinutes();
	    var seconds = tm.getUTCSeconds();
	    if (minutes < 10) {
	      minutes = "0" + minutes;
	    }
	    if (seconds < 10) {
	      seconds = "0" + seconds;
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
	    var playIcon = playbutton.children[0];
	    var pauseIcon = playbutton.children[1];
	    playbutton.addEventListener('click', function() {
	      buttonClickListener(playIcon, pauseIcon);
	    }, false);
	
	    return playbutton;
	  };
	
	  var buttonClickListener = function(playIcon, pauseIcon) {
	    if (state.playing) {
	      playIcon.style.display = 'block';
	      pauseIcon.style.display = 'none';
	      var vimeoPauseEvent = createCustomEvent(playerEvents.pause);
	      playbutton.dispatchEvent(vimeoPauseEvent);
	      state.playing = false;
	    } else {
	      playIcon.style.display = 'none';
	      pauseIcon.style.display = 'block';
	      var vimeoPlayEvent = createCustomEvent(playerEvents.play);
	      playbutton.dispatchEvent(vimeoPlayEvent);
	      state.playing = true;
	    }
	  };
	
	  return {
	    init: init,
	    playbutton: playbutton
	  };
	
	})();


/***/ },
/* 11 */
/***/ function(module, exports) {

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

	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	module.exports = (function() {
	  var init = function(playButton, progress, video) {
	    playbuttonPublishers(playButton);
	    progressPublishers(progress);
	    videoPublishers(video);
	  };
	
	  var playbuttonPublishers = function(playButton) {
	    playButton.addEventListener(playerEvents.play, function() {
	      eventManager.publish(playerEvents.play);
	    }, false);
	    playButton.addEventListener(playerEvents.pause, function() {
	      eventManager.publish(playerEvents.pause);
	    }, false);
	  };
	
	  var progressPublishers = function(progress) {
	    progress.addEventListener(playerEvents.seek, function(data) {
	      eventManager.publish(playerEvents.seek, data.detail);
	    }, false);
	  };
	
	  var videoPublishers = function(video) {
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
	  };
	
	  return {
	    init: init
	  };
	
	})();


/***/ },
/* 13 */
/***/ function(module, exports) {

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

	var playerEvents = __webpack_require__(4);
	var eventManager = __webpack_require__(13);
	
	module.exports = (function() {
	  var registerSubscribers = function(playButton, progress, video) {
	    videoSubs(video);
	    progressSubs(progress);
	  };
	
	  var videoSubs = function(video) {
	    eventManager.subscribe(playerEvents.play, function() {
	      video.play();
	    });
	    eventManager.subscribe(playerEvents.pause, function() {
	      video.pause();
	    });
	    eventManager.subscribe(playerEvents.seek, function(data) {
	      video.setCurrentTime(data.currentTime);
	    });
	  };
	
	  var progressSubs = function(progress) {
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
	
	  return {
	    init: registerSubscribers
	  };
	})();


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTU4NjE2MjM2Njc0OThjMTgyMGEiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNQRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ2hDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBOztBQUVBLHVCQUFzQjtBQUN0QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHFCQUFvQjtBQUNwQjtBQUNBOztBQUVBLCtCQUE4QjtBQUM5QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3BGRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNkRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVUsT0FBTztBQUNqQixXQUFVLE9BQU87QUFDakIsWUFBVyxZQUFZLEtBQUs7QUFDNUI7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTCxJQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7O0FDckJBO0FBQ0E7O0FBRUE7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUM7Ozs7Ozs7QUNaRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBZ0I7QUFDaEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ3hJRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxREQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ2xERDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDNUNEO0FBQ0EsYUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7O0FDMUJBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNTU4NjE2MjM2Njc0OThjMTgyMGFcbiAqKi8iLCIvLyByZXF1aXJlKCchc3R5bGUhY3NzIS4vY3NzL3N0eWxlLmNzcycpO1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXIgPSByZXF1aXJlKCcuL2VsZW1lbnRzL1BsYXllckNvbnRhaW5lckVsZW1lbnQnKTtcbiAgLy8gdmFyIHZpZGVvTGluayA9ICdodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNzY5Nzk4NzEuaGQubXA0P3M9NzAwYmY4ZjMwZjhmODExNGNjMzcyZTk0YzQxNTZhYWYmcHJvZmlsZV9pZD0xMTMnO1xuICB2YXIgdmlkZW9MaW5rID0gJy9BcHBsaWNhdGlvbnMvTUFNUC9odGRvY3MvdmlkZW9jb2xsYWJvcmF0b3J5L29wdGltaXplZFZpZGVvcy92Yy01NDMtMi5tcDQnO1xuICB2YXIgcGxheWVyID0gcGxheWVyQ29udGFpbmVyLnBsYXllckNvbnRhaW5lcih2aWRlb0xpbmspO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHBsYXllcik7XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcHAuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdmlkZW9Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1ZpZGVvJyk7XG52YXIgcHJvZ3Jlc3NDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1Byb2dyZXNzQmFyJyk7XG52YXIgcGxheUJ1dHRvbiA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUGxheUJ1dHRvbicpO1xudmFyIHB1Ymxpc2hlcnMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUHVibGlzaGVycycpO1xudmFyIHN1YnNjcmliZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcGxheWVyQ29udGFpbmVyID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvID0gdmlkZW9Db21wb25lbnQuaW5pdCh2aWRlb0xpbmspO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnY29udHJvbHMnO1xuICAgIHZhciBwbGF5QnRuID0gcGxheUJ1dHRvbi5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NDb21wb25lbnQuaW5pdCgpO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbHMpO1xuXG4gICAgLy8gcmVnaXN0ZXIgcHVicy9zdWJzIGhlcmUuXG4gICAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4sIHByb2dyZXNzLCB2aWRlbyk7XG4gICAgc3Vic2NyaWJlcnMuaW5pdChwbGF5QnRuLCBwcm9ncmVzc0NvbXBvbmVudCwgdmlkZW9Db21wb25lbnQpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYXllckNvbnRhaW5lcjogcGxheWVyQ29udGFpbmVyLFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJDb250YWluZXJFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHZpZGVvRWxlbWVudCA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1ZpZGVvRWxlbWVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB2aWRlbyA9IHtcbiAgICBkdXJhdGlvbjogMCxcbiAgICBjdXJyZW50VGltZTogMCxcbiAgICBidWZmZXJlZDogMFxuICB9O1xuICB2YXIgcGxheWVyQ29udGFpbmVyO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgcGxheWVyQ29udGFpbmVyID0gdmlkZW9FbGVtZW50LnZpZGVvRWxlbWVudCh2aWRlb0xpbmspO1xuICAgIHZpZGVvLnBsYXllciA9IHBsYXllckNvbnRhaW5lci5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVkZGF0YScsIF9sb2FkZWRkYXRhTGlzdGVuZXIsIGZhbHNlKTtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigndGltZXVwZGF0ZScsIF90aW1ldXBkYXRlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICB2aWRlby5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcigncHJvZ3Jlc3MnLCBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHBsYXllckNvbnRhaW5lcjtcbiAgfTtcblxuICB2YXIgX2xvYWRlZGRhdGFMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLmR1cmF0aW9uID0gdmlkZW8ucGxheWVyLmR1cmF0aW9uO1xuICAgIHZhciBkdXJhdGlvbkRhdGEgPSB7IGR1cmF0aW9uOiB2aWRlby5kdXJhdGlvbiB9O1xuICAgIHZhciB2aWRlb1JlYWR5RXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZHVyYXRpb25EYXRhKTtcbiAgICBwbGF5ZXJDb250YWluZXIuZGlzcGF0Y2hFdmVudCh2aWRlb1JlYWR5RXZlbnQpO1xuXG4gICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiB2aWRlby5wbGF5ZXIuYnVmZmVyZWQuZW5kKDApIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5idWZmZXJlZCwgYnVmZmVyRGF0YSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gIH07XG5cbiAgdmFyIF90aW1ldXBkYXRlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IHZpZGVvLnBsYXllci5jdXJyZW50VGltZTtcbiAgICB2YXIgdGlja0RhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlby5jdXJyZW50VGltZSB9O1xuICAgIHZhciB2aWRlb1RpY2tFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy50aWNrLCB0aWNrRGF0YSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9UaWNrRXZlbnQpO1xuXG4gICAgdmFyIHBsYXllZFByb2dyZXNzRGF0YSA9IHsgcHJvZ3Jlc3M6IHZpZGVvLmN1cnJlbnRUaW1lIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICB2YXIgdmlkZW9CdWZmZXJFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5ZWQsIHBsYXllZFByb2dyZXNzRGF0YSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9wcm9ncmVzc1VwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJhbmdlID0gMDtcbiAgICB2YXIgYmYgPSB2aWRlby5wbGF5ZXIuYnVmZmVyZWQ7XG4gICAgdmFyIHRpbWUgPSB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG5cbiAgICB3aGlsZSghKGJmLnN0YXJ0KHJhbmdlKSA8PSB0aW1lICYmIHRpbWUgPD0gYmYuZW5kKHJhbmdlKSkpIHtcbiAgICAgIHJhbmdlICs9IDE7XG4gICAgfVxuXG4gICAgaWYgKHJhbmdlIDwgYmYuc3RhcnQubGVuZ3RoKSB7XG4gICAgICB2YXIgYnVmZmVyRGF0YSA9IHsgYnVmZmVyZWQ6IGJmLmVuZChyYW5nZSkgLyB2aWRlby5kdXJhdGlvbiAqIDEwMCB9O1xuICAgICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9CdWZmZXJFdmVudCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBzZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uKGN1cnJlbnRUaW1lKSB7XG4gICAgdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSBjdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgcGxheSA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnBsYXllci5wbGF5KCk7XG4gIH07XG5cbiAgdmFyIHBhdXNlID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBhdXNlKCk7XG4gIH07XG5cbiAgLy9cbiAgLy8gVmlkZW8gY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSB2aWRlbyBjb21wb25lbnQgc3RhdGVzIGJ5IGFjY2Vzc2luZyB0byB0aGVzZSBBUElzLlxuICAvL1xuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgcGxheTogcGxheSxcbiAgICBwYXVzZTogcGF1c2UsXG4gICAgc2V0Q3VycmVudFRpbWU6IHNldEN1cnJlbnRUaW1lXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvVmlkZW8uanNcbiAqKiBtb2R1bGUgaWQgPSAyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNyZWF0ZVZpZGVvRWxlbWVudCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHZhciB2aWRlb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHZpZGVvQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd2aWRlby1jb250YWluZXInO1xuICAgIHZhciB2aWRlb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpO1xuICAgIHZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHZpZGVvTGluayk7XG4gICAgdmlkZW9Db250YWluZXIuYXBwZW5kQ2hpbGQodmlkZW9FbGVtZW50KTtcbiAgICByZXR1cm4gdmlkZW9Db250YWluZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICB2aWRlb0VsZW1lbnQ6IGNyZWF0ZVZpZGVvRWxlbWVudFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9WaWRlb0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiogQWxsIFZpZW1vIFBsYXllciBldmVudCBuYW1lcyBhcmUgaGVyZVxuKlxuKiBAcmV0dXJuIHt9XG4qXG4qL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgdmlkZW9SZWFkeTogJ3ZpbWVvVmlkZW9SZWFkeScsXG4gIHBsYXk6ICd2aW1lb1BsYXknLFxuICBwYXVzZTogJ3ZpbWVvUGF1c2UnLFxuICBzZWVrOiAndmltZW9TZWVrJyxcbiAgYnVmZmVyZWQ6ICd2aW1lb0J1ZmZlcmVkJyxcbiAgcHJvZ3Jlc3N1cGRhdGU6ICd2aW1lb1Byb2dyZXNzVXBkZGF0ZScsXG4gIHBsYXllZDogJ3BsYXllZCcsXG4gIHRpY2s6ICd2aW1lb1RpY2snXG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzXG4gKiogbW9kdWxlIGlkID0gNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4qIGNyZWF0ZSBhIGN1c3RvbSBldmVudCBmb3IgYSBIVE1MIGVsZW1lbnQsIG9ubHkgdGhlIHNhbWUgZWxlbWVudCBjYW4gbGlzdGVuIHRvLlxuKiBpdCdzIHRoZSBlbGVtZW50J3MgaW50ZXJuYWwgZXZlbnRzXG4qIGxvYWQgUG9seWZpbGwgZmlyc3QgZm9yIElFXG4qXG4qIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWVcbiogQHBhcmFtIHtPYmplY3R9IGRhdGEgLSBkYXRhIHBhc3NlZCB3aXRoIHRoZSBldmVudFxuKiBAcmV0dXJuIHtDdXN0b21FdmVudH0gb3Ige0V2ZW50fVxuKlxuKi9cblxucmVxdWlyZSgnLi9Qb2x5ZmlsbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZGF0YSkge1xuICBpZiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgQ3VzdG9tRXZlbnQoZXZlbnROYW1lLCB7XG4gICAgICAnZGV0YWlsJzogZGF0YVxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgRXZlbnQoZXZlbnROYW1lKTtcbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKCB0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIgKSByZXR1cm4gZmFsc2U7XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQgKCBldmVudCwgcGFyYW1zICkge1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7IGJ1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWQgfTtcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoICdDdXN0b21FdmVudCcgKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KCBldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsICk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfVxuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9Qb2x5ZmlsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDZcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB1dGlsaXR5ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9VdGlsaXR5Jyk7XG52YXIgcHJvZ3Jlc3NXcmFwcGVyID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzJyk7XG52YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cycpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHByb2dyZXNzQmFyQ2hpbGRyZW4gPSB7fTtcbiAgdmFyIHZpZGVvRHVyYXRpb24gPSAwO1xuICB2YXIgcHJvZ3Jlc3NCYXI7XG4gIHZhciBwcm9ncmVzc0NvbnRhaW5lcjtcbiAgdmFyIHBsYXllckNvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHByb2dyZXNzQ29udGFpbmVyID0gcHJvZ3Jlc3NXcmFwcGVyLnByb2dyZXNzV3JhcHBlcigpO1xuICAgIHByb2dyZXNzQmFyID0gcHJvZ3Jlc3NDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzBdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4ucGxheWVkID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMV07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3ggPSBwcm9ncmVzc0Jhci5jaGlsZHJlblsyXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3ggPSBwcm9ncmVzc0Jhci5jaGlsZHJlblszXTtcblxuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBfbW91c2VsZWF2ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgX21vdXNlZG93bkxpc3RlbmVyLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBfbW91c2V1cExpc3RlbmVyLCBmYWxzZSk7XG4gICAgcmV0dXJuIHByb2dyZXNzQ29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfbW91c2Vtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgfTtcblxuICB2YXIgX21vdXNlbGVhdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94IGludmlzaWJsZSc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBwbGF5ZXJDb250YWluZXIgPSBwcm9ncmVzc0NvbnRhaW5lci5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcbiAgICAvLyBvbmx5IGFkZCBtb3VzZW1vdmUgdG8gZG9jdW1lbnQgd2hlbiBtb3VzZSBkb3duIHRvIHByb2dyZXNzQmFyIGhhcHBlbmVkXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwbGF5ZXJDb250YWluZXIsICdncmFiYmFibGUnKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICAvLyB3aGVuIG1vdXNlIGlzIHVwIHJlbW92ZSBtb3VzZW1vdmUgZXZlbnQgZnJvbSBkb2N1bWVudEVsZW1lbnRcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgX21vdXNlZG93bm1vdmVMaXN0ZW5lcik7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICBpZiAoaG92ZXJQb3NpdGlvbiA8IDAgfHwgaG92ZXJQb3NpdGlvbiA+IDEpIHJldHVybjtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbjtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5zdHlsZS5sZWZ0ID0gKGhvdmVyUG9zaXRpb24gKiAxMDApLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICAgIF9kaXNwYXRjaFNlZWsoZXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZGlzcGF0Y2hTZWVrID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgdmFyIGRhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBzZWVrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YSk7XG4gICAgcHJvZ3Jlc3NDb250YWluZXIuZGlzcGF0Y2hFdmVudChzZWVrRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uKGUsIHByb2dyZXNzQmFyKSB7XG4gICAgdmFyIG1Qb3N4ID0gMDtcbiAgICB2YXIgZVBvc3ggPSAwO1xuICAgIHZhciBvYmogPSBwcm9ncmVzc0JhcjtcblxuICAgIC8vIGdldCBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudCBjcm9zc2Jyb3dzZXJcbiAgICBpZiAoIWUpIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgaWYgKGUucGFnZVgpIHtcbiAgICAgIG1Qb3N4ID0gZS5wYWdlWDtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50KSB7XG4gICAgICBtUG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cblxuICAgIHdoaWxlIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICBlUG9zeCArPSBvYmoub2Zmc2V0TGVmdDtcbiAgICAgIG9iaiA9IG9iai5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuXG4gICAgdmFyIG9mZnNldCA9IG1Qb3N4IC0gZVBvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgdXBkYXRlUGxheWVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSBkYXRhLnByb2dyZXNzLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSBkYXRhLnByb2dyZXNzLnRvRml4ZWQoMykgKyAnJSc7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zdHlsZS53aWR0aCA9IGRhdGEuYnVmZmVyZWQudG9GaXhlZCgzKSArICclJztcbiAgfTtcblxuICB2YXIgdXBkYXRlVGltZUJveCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIGluaXRUaW1lQm94ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZpZGVvRHVyYXRpb24gPSBkYXRhLmR1cmF0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmR1cmF0aW9uKTtcbiAgfTtcblxuICB2YXIgdXBkYXRlVGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gIH07XG5cbiAgLy9cbiAgLy8gUHJvZ3Jlc3MgY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSBwcm9ncmVzcyBzdGF0ZXMgYnkgYWNjZXNzaW5nIHRvIHRoZXNlIEFQSXMuXG4gIC8vXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogdXBkYXRlUGxheWVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlQnVmZmVyZWRQcm9ncmVzczogdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyxcbiAgICB1cGRhdGVUaW1lQm94OiB1cGRhdGVUaW1lQm94LFxuICAgIGluaXRUaW1lQm94OiBpbml0VGltZUJveCxcbiAgICB1cGRhdGVUaWNrOiB1cGRhdGVUaWNrXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9IFwiMFwiICsgbWludXRlcztcbiAgICB9XG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgc2Vjb25kcyA9IFwiMFwiICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgfSxcblxuICBoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAhIWVsLmNsYXNzTmFtZS5tYXRjaChuZXcgUmVnRXhwKCcoXFxcXHN8XiknICsgY2xhc3NOYW1lICsgJyhcXFxcc3wkKScpKTtcbiAgICB9XG4gIH0sXG5cbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgZWwuY2xhc3NOYW1lICs9ICcgJyArIGNsYXNzTmFtZTtcbiAgICB9XG4gIH0sXG5cbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cCgnKFxcXFxzfF4pJyArIGNsYXNzTmFtZSArICcoXFxcXHN8JCknKTtcbiAgICAgIGVsLmNsYXNzTmFtZT1lbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJyk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L1V0aWxpdHkuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGJ1ZmZlcmVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgYnVmZmVyZWREaXYuY2xhc3NOYW1lID0gJ2J1ZmZlcmVkJztcbiAgICByZXR1cm4gYnVmZmVyZWREaXY7XG4gIH07XG5cbiAgdmFyIHBsYXllZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5ZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5ZWREaXYuY2xhc3NOYW1lID0gJ3BsYXllZCc7XG4gICAgcmV0dXJuIHBsYXllZERpdjtcbiAgfTtcblxuICB2YXIgaG92ZXJUaW1lYm94ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGhvdmVyVGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGhvdmVyVGltZWJveERpdi5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIGhvdmVyVGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gaG92ZXJUaW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciB0aW1lYm94ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lYm94RGl2LmNsYXNzTmFtZSA9ICd0aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgdGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgICByZXR1cm4gdGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZVBvcCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgICB2YXIgdGltZVBvcERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVQb3BEaXYuY2xhc3NOYW1lID0gJ3RpbWUtcG9wJztcbiAgICB0aW1lUG9wRGl2LmlubmVySFRNTCA9IHRpbWU7XG4gICAgcmV0dXJuIHRpbWVQb3BEaXY7XG4gIH07XG5cbiAgdmFyIGNyZWF0ZVByb2dyZXNzV3JhcHBlciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZEVsZW1lbnQgPSBidWZmZXJlZCgpO1xuICAgIHZhciBwbGF5ZWRFbGVtZW50ID0gcGxheWVkKCk7XG4gICAgdmFyIGhvdmVyVGltZWJveEVsZW1lbnQgPSBob3ZlclRpbWVib3goKTtcbiAgICB2YXIgdGltZUJveEVsZW1lbnQgPSB0aW1lYm94KCk7XG4gICAgdmFyIHByb2dyZXNzRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzRWxlbWVudC5jbGFzc05hbWUgPSAncHJvZ3Jlc3MnO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXJlZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChwbGF5ZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoaG92ZXJUaW1lYm94RWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHRpbWVCb3hFbGVtZW50KTtcbiAgICB2YXIgcHJvZ3Jlc3NXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmNsYXNzTmFtZSA9ICdwcm9ncmVzcy13cmFwcGVyJztcbiAgICBwcm9ncmVzc1dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NFbGVtZW50KTtcblxuICAgIHJldHVybiBwcm9ncmVzc1dyYXBwZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwcm9ncmVzc1dyYXBwZXI6IGNyZWF0ZVByb2dyZXNzV3JhcHBlclxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJQcm9ncmVzc0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA5XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcGxheUJ1dHRvbkVsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudCcpO1xudmFyIGNyZWF0ZUN1c3RvbUV2ZW50ID0gcmVxdWlyZSgnLi4vdXRpbGl0eS9DcmVhdGVDdXN0b21FdmVudCcpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICAncGxheWluZyc6IGZhbHNlXG4gIH07XG4gIHZhciBwbGF5YnV0dG9uO1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgcGxheWJ1dHRvbiA9IHBsYXlCdXR0b25FbGVtZW50LmNyZWF0ZVBsYXlCdXR0b24oKTtcbiAgICB2YXIgcGxheUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzBdO1xuICAgIHZhciBwYXVzZUljb24gPSBwbGF5YnV0dG9uLmNoaWxkcmVuWzFdO1xuICAgIHBsYXlidXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGJ1dHRvbkNsaWNrTGlzdGVuZXIocGxheUljb24sIHBhdXNlSWNvbik7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHBsYXlidXR0b247XG4gIH07XG5cbiAgdmFyIGJ1dHRvbkNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbihwbGF5SWNvbiwgcGF1c2VJY29uKSB7XG4gICAgaWYgKHN0YXRlLnBsYXlpbmcpIHtcbiAgICAgIHBsYXlJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB2YXIgdmltZW9QYXVzZUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BhdXNlRXZlbnQpO1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgcGF1c2VJY29uLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdmFyIHZpbWVvUGxheUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnBsYXkpO1xuICAgICAgcGxheWJ1dHRvbi5kaXNwYXRjaEV2ZW50KHZpbWVvUGxheUV2ZW50KTtcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXQsXG4gICAgcGxheWJ1dHRvbjogcGxheWJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVQbGF5QnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwbGF5QnV0dG9uLmNsYXNzTmFtZSA9ICdwbGF5LWljb24nO1xuICAgIHZhciBwbGF5U1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgncHJlc2VydmVBc3BlY3RSYXRpbycsICd4TWlkWU1pZCcpO1xuICAgIHZhciBwb2x5Z29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3BvbHlnb24nKTtcbiAgICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgJzEsMCAyMCwxMCAxLDIwJyk7XG4gICAgcGxheVNWRy5hcHBlbmRDaGlsZChwb2x5Z29uKTtcbiAgICBwbGF5QnV0dG9uLmFwcGVuZENoaWxkKHBsYXlTVkcpO1xuICAgIHJldHVybiBwbGF5QnV0dG9uO1xuICB9O1xuXG4gIHZhciBjcmVhdGVQYXVzZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwYXVzZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBhdXNlQnV0dG9uLmNsYXNzTmFtZSA9ICdwYXVzZS1pY29uJztcbiAgICB2YXIgcGF1c2VTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICAgIHBhdXNlU1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgbGVmdFJlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncmVjdCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd4JywgJzAnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKGxlZnRSZWN0KTtcbiAgICB2YXIgcmlnaHRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcxMicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3knLCAnMCcpO1xuICAgIHBhdXNlU1ZHLmFwcGVuZENoaWxkKHJpZ2h0UmVjdCk7XG4gICAgcGF1c2VCdXR0b24uYXBwZW5kQ2hpbGQocGF1c2VTVkcpO1xuICAgIHJldHVybiBwYXVzZUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlQnV0dG9uID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIGJ1dHRvbi5jbGFzc05hbWUgPSAncGxheSc7XG4gICAgdmFyIHBsYXlCdG4gPSBjcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICAgIHZhciBwYXVzZUJ0biA9IGNyZWF0ZVBhdXNlQnV0dG9uKCk7XG4gICAgYnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlQnRuKTtcbiAgICByZXR1cm4gYnV0dG9uO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgY3JlYXRlUGxheUJ1dHRvbjogY3JlYXRlQnV0dG9uXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXlCdXR0b25FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbykge1xuICAgIHBsYXlidXR0b25QdWJsaXNoZXJzKHBsYXlCdXR0b24pO1xuICAgIHByb2dyZXNzUHVibGlzaGVycyhwcm9ncmVzcyk7XG4gICAgdmlkZW9QdWJsaXNoZXJzKHZpZGVvKTtcbiAgfTtcblxuICB2YXIgcGxheWJ1dHRvblB1Ymxpc2hlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uKSB7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICB9LCBmYWxzZSk7XG4gICAgcGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGF1c2UpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgcHJvZ3Jlc3NQdWJsaXNoZXJzID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICBwcm9ncmVzcy5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMuc2VlaywgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICB2YXIgdmlkZW9QdWJsaXNoZXJzID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBkYXRhLmRldGFpbCk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHZpZGVvLmFkZEV2ZW50TGlzdGVuZXIocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBsYXllZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMudGljaywgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGV2ZW50czoge30sXG5cbiAgc3Vic2NyaWJlOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBmbikge1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gPSB0aGlzLmV2ZW50c1tldmVudE5hbWVdIHx8IFtdO1xuICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ucHVzaChmbik7XG4gIH0sXG5cbiAgdW5zdWJzcmliZTogZnVuY3Rpb24oZXZlbnROYW1lLCBmbikge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV1baV0gPT09IGZuKSB7XG4gICAgICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHVibGlzaDogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgZm4oZGF0YSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanNcbiAqKiBtb2R1bGUgaWQgPSAxM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4vUGxheWVyRXZlbnRzJyk7XG52YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi9QdWJTdWInKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciByZWdpc3RlclN1YnNjcmliZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbiwgcHJvZ3Jlc3MsIHZpZGVvKSB7XG4gICAgdmlkZW9TdWJzKHZpZGVvKTtcbiAgICBwcm9ncmVzc1N1YnMocHJvZ3Jlc3MpO1xuICB9O1xuXG4gIHZhciB2aWRlb1N1YnMgPSBmdW5jdGlvbih2aWRlbykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXksIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBhdXNlLCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgdmlkZW8uc2V0Q3VycmVudFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgdmFyIHByb2dyZXNzU3VicyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MuaW5pdFRpbWVCb3goZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheWVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVQbGF5ZWRQcm9ncmVzcyhkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy50aWNrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVUaWNrKGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgaW5pdDogcmVnaXN0ZXJTdWJzY3JpYmVyc1xuICB9O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=