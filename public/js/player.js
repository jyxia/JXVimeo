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
	  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
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
	    utility.removeClass(progressBar, 'grabbable');
	  };
	
	  var _mousedownListener = function(event) {
	    event.preventDefault();
	    utility.addClass(progressBar, 'grabbable');
	    _dispatchSeek(event);
	    // only add mousemove to document when mouse down to progressBar happened
	    document.documentElement.addEventListener('mousemove', _mousedownmoveListener, false);
	    progressBar.removeEventListener('mousemove', _mousemoveListener);
	  };
	
	  var _mouseupListener = function() {
	    utility.removeClass(progressBar, 'grabbable');
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
	    //get parent element position in document
	    // if (obj.offsetParent) {
	    //     do {
	    //       ePosx += obj.offsetLeft;
	    //     } while (obj = obj.offsetParent);
	    // }
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
	      el.className += " " + className;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYzg3OWUwZTI5ZWY4YTgxY2Q4ZWYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDTkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNoQ0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx5QkFBd0I7QUFDeEI7QUFDQTs7QUFFQSx1QkFBc0I7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBb0I7QUFDcEI7QUFDQTs7QUFFQSwrQkFBOEI7QUFDOUI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNwRkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDZEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFVLE9BQU87QUFDakIsV0FBVSxPQUFPO0FBQ2pCLFlBQVcsWUFBWSxLQUFLO0FBQzVCO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0wsSUFBRztBQUNIO0FBQ0E7QUFDQTs7Ozs7OztBQ3JCQTtBQUNBOztBQUVBO0FBQ0EseUJBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxFQUFDOzs7Ozs7O0FDWkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzVJRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxREQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUMxQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQ2xERDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDNUNEO0FBQ0EsYUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7O0FDMUJBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgYzg3OWUwZTI5ZWY4YTgxY2Q4ZWZcbiAqKi8iLCIvLyByZXF1aXJlKCchc3R5bGUhY3NzIS4vY3NzL3N0eWxlLmNzcycpO1xubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250YWluZXIgPSByZXF1aXJlKCcuL2VsZW1lbnRzL1BsYXllckNvbnRhaW5lckVsZW1lbnQnKTtcbiAgdmFyIHZpZGVvTGluayA9ICdodHRwczovL3BsYXllci52aW1lby5jb20vZXh0ZXJuYWwvNzY5Nzk4NzEuaGQubXA0P3M9NzAwYmY4ZjMwZjhmODExNGNjMzcyZTk0YzQxNTZhYWYmcHJvZmlsZV9pZD0xMTMnO1xuICB2YXIgcGxheWVyID0gcGxheWVyQ29udGFpbmVyLnBsYXllckNvbnRhaW5lcih2aWRlb0xpbmspO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdLmFwcGVuZENoaWxkKHBsYXllcik7XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9hcHAuanNcbiAqKiBtb2R1bGUgaWQgPSAwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdmlkZW9Db21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1ZpZGVvJyk7XG52YXIgcHJvZ3Jlc3NDb21wb25lbnQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL1Byb2dyZXNzQmFyJyk7XG52YXIgcGxheUJ1dHRvbiA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUGxheUJ1dHRvbicpO1xudmFyIHB1Ymxpc2hlcnMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUHVibGlzaGVycycpO1xudmFyIHN1YnNjcmliZXJzID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1N1YnNjcmliZXJzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcGxheWVyQ29udGFpbmVyID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvID0gdmlkZW9Db21wb25lbnQuaW5pdCh2aWRlb0xpbmspO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnY29udHJvbHMnO1xuICAgIHZhciBwbGF5QnRuID0gcGxheUJ1dHRvbi5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NDb21wb25lbnQuaW5pdCgpO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbHMpO1xuXG4gICAgLy8gcmVnaXN0ZXIgcHVicy9zdWJzIGhlcmUuIFxuICAgIHB1Ymxpc2hlcnMuaW5pdChwbGF5QnRuLCBwcm9ncmVzcywgdmlkZW8pO1xuICAgIHN1YnNjcmliZXJzLmluaXQocGxheUJ0biwgcHJvZ3Jlc3NDb21wb25lbnQsIHZpZGVvQ29tcG9uZW50KTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBwbGF5ZXJDb250YWluZXI6IHBsYXllckNvbnRhaW5lcixcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9WaWRlb0VsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdmlkZW8gPSB7XG4gICAgZHVyYXRpb246IDAsXG4gICAgY3VycmVudFRpbWU6IDAsXG4gICAgYnVmZmVyZWQ6IDBcbiAgfTtcbiAgdmFyIHBsYXllckNvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHBsYXllckNvbnRhaW5lciA9IHZpZGVvRWxlbWVudC52aWRlb0VsZW1lbnQodmlkZW9MaW5rKTtcbiAgICB2aWRlby5wbGF5ZXIgPSBwbGF5ZXJDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCBfbG9hZGVkZGF0YUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBfdGltZXVwZGF0ZUxpc3RlbmVyLCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgX3Byb2dyZXNzVXBkYXRlTGlzdGVuZXIsIGZhbHNlKTtcblxuICAgIHJldHVybiBwbGF5ZXJDb250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9sb2FkZWRkYXRhTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5kdXJhdGlvbiA9IHZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9SZWFkeUV2ZW50KTtcblxuICAgIHZhciBidWZmZXJEYXRhID0geyBidWZmZXJlZDogdmlkZW8ucGxheWVyLmJ1ZmZlcmVkLmVuZCgwKSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfdGltZXVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgdmFyIHRpY2tEYXRhID0geyBjdXJyZW50VGltZTogdmlkZW8uY3VycmVudFRpbWUgfTtcbiAgICB2YXIgdmlkZW9UaWNrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudGljaywgdGlja0RhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB2aWRlby5jdXJyZW50VGltZSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5nZSA9IDA7XG4gICAgdmFyIGJmID0gdmlkZW8ucGxheWVyLmJ1ZmZlcmVkO1xuICAgIHZhciB0aW1lID0gdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuXG4gICAgd2hpbGUoIShiZi5zdGFydChyYW5nZSkgPD0gdGltZSAmJiB0aW1lIDw9IGJmLmVuZChyYW5nZSkpKSB7XG4gICAgICByYW5nZSArPSAxO1xuICAgIH1cblxuICAgIGlmIChyYW5nZSA8IGJmLnN0YXJ0Lmxlbmd0aCkge1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBiZi5lbmQocmFuZ2UpIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICAgIHZhciB2aWRlb0J1ZmZlckV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBidWZmZXJEYXRhKTtcbiAgICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgc2V0Q3VycmVudFRpbWUgPSBmdW5jdGlvbihjdXJyZW50VGltZSkge1xuICAgIHZpZGVvLnBsYXllci5jdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lO1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIHBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5wbGF5ZXIucGxheSgpO1xuICB9O1xuXG4gIHZhciBwYXVzZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZpZGVvLnBsYXllci5wYXVzZSgpO1xuICB9O1xuXG4gIC8vXG4gIC8vIFZpZGVvIGNvbXBvbmVudCBwdWJsaWMgQVBJc1xuICAvLyBPdXRzaWRlIHdvcmxkIGNhbiBjaGFuZ2UgdmlkZW8gY29tcG9uZW50IHN0YXRlcyBieSBhY2Nlc3NpbmcgdG8gdGhlc2UgQVBJcy5cbiAgLy9cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHBsYXk6IHBsYXksXG4gICAgcGF1c2U6IHBhdXNlLFxuICAgIHNldEN1cnJlbnRUaW1lOiBzZXRDdXJyZW50VGltZVxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1ZpZGVvLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBjcmVhdGVWaWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgICB2YXIgdmlkZW9Db250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgICB2YXIgdmlkZW9FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcbiAgICB2aWRlb0VsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB2aWRlb0xpbmspO1xuICAgIHZpZGVvQ29udGFpbmVyLmFwcGVuZENoaWxkKHZpZGVvRWxlbWVudCk7XG4gICAgcmV0dXJuIHZpZGVvQ29udGFpbmVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgdmlkZW9FbGVtZW50OiBjcmVhdGVWaWRlb0VsZW1lbnRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gM1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiLyoqXG4qIEFsbCBWaWVtbyBQbGF5ZXIgZXZlbnQgbmFtZXMgYXJlIGhlcmVcbipcbiogQHJldHVybiB7fVxuKlxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHZpZGVvUmVhZHk6ICd2aW1lb1ZpZGVvUmVhZHknLFxuICBwbGF5OiAndmltZW9QbGF5JyxcbiAgcGF1c2U6ICd2aW1lb1BhdXNlJyxcbiAgc2VlazogJ3ZpbWVvU2VlaycsXG4gIGJ1ZmZlcmVkOiAndmltZW9CdWZmZXJlZCcsXG4gIHByb2dyZXNzdXBkYXRlOiAndmltZW9Qcm9ncmVzc1VwZGRhdGUnLFxuICBwbGF5ZWQ6ICdwbGF5ZWQnLFxuICB0aWNrOiAndmltZW9UaWNrJ1xufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1BsYXllckV2ZW50cy5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuKiBjcmVhdGUgYSBjdXN0b20gZXZlbnQgZm9yIGEgSFRNTCBlbGVtZW50LCBvbmx5IHRoZSBzYW1lIGVsZW1lbnQgY2FuIGxpc3RlbiB0by5cbiogaXQncyB0aGUgZWxlbWVudCdzIGludGVybmFsIGV2ZW50c1xuKiBsb2FkIFBvbHlmaWxsIGZpcnN0IGZvciBJRVxuKlxuKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lXG4qIEBwYXJhbSB7T2JqZWN0fSBkYXRhIC0gZGF0YSBwYXNzZWQgd2l0aCB0aGUgZXZlbnRcbiogQHJldHVybiB7Q3VzdG9tRXZlbnR9IG9yIHtFdmVudH1cbipcbiovXG5cbnJlcXVpcmUoJy4vUG9seWZpbGwnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihldmVudE5hbWUsIGRhdGEpIHtcbiAgaWYgKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwge1xuICAgICAgJ2RldGFpbCc6IGRhdGFcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEV2ZW50KGV2ZW50TmFtZSk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbiAoKSB7XG4gIGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICggZXZlbnQsIHBhcmFtcyApIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnQ3VzdG9tRXZlbnQnICk7XG4gICAgZXZ0LmluaXRDdXN0b21FdmVudCggZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCApO1xuICAgIHJldHVybiBldnQ7XG4gIH1cblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvUG9seWZpbGwuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xudmFyIHByb2dyZXNzV3JhcHBlciA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9ncmVzc0JhckNoaWxkcmVuID0ge307XG4gIHZhciB2aWRlb0R1cmF0aW9uID0gMDtcbiAgdmFyIHByb2dyZXNzQmFyO1xuICB2YXIgcHJvZ3Jlc3NDb250YWluZXI7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgICBwcm9ncmVzc0JhciA9IHByb2dyZXNzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQgPSBwcm9ncmVzc0Jhci5jaGlsZHJlblswXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzFdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMl07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM107XG5cbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgX21vdXNlbGVhdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIF9tb3VzZWRvd25MaXN0ZW5lciwgZmFsc2UpO1xuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgX21vdXNldXBMaXN0ZW5lciwgZmFsc2UpO1xuICAgIHJldHVybiBwcm9ncmVzc0NvbnRhaW5lcjtcbiAgfTtcblxuICB2YXIgX21vdXNlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgaWYgKGhvdmVyUG9zaXRpb24gPCAwIHx8IGhvdmVyUG9zaXRpb24gPiAxKSByZXR1cm47XG4gICAgdmFyIGN1cnJlbnRUaW1lID0gdmlkZW9EdXJhdGlvbiAqIGhvdmVyUG9zaXRpb247XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWxlYXZlTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHV0aWxpdHkucmVtb3ZlQ2xhc3MocHJvZ3Jlc3NCYXIsICdncmFiYmFibGUnKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bkxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHV0aWxpdHkuYWRkQ2xhc3MocHJvZ3Jlc3NCYXIsICdncmFiYmFibGUnKTtcbiAgICBfZGlzcGF0Y2hTZWVrKGV2ZW50KTtcbiAgICAvLyBvbmx5IGFkZCBtb3VzZW1vdmUgdG8gZG9jdW1lbnQgd2hlbiBtb3VzZSBkb3duIHRvIHByb2dyZXNzQmFyIGhhcHBlbmVkXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZWRvd25tb3ZlTGlzdGVuZXIsIGZhbHNlKTtcbiAgICBwcm9ncmVzc0Jhci5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vtb3ZlTGlzdGVuZXIpO1xuICB9O1xuXG4gIHZhciBfbW91c2V1cExpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdXRpbGl0eS5yZW1vdmVDbGFzcyhwcm9ncmVzc0JhciwgJ2dyYWJiYWJsZScpO1xuICAgIHByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIF9tb3VzZW1vdmVMaXN0ZW5lciwgZmFsc2UpO1xuICAgIC8vIHdoZW4gbW91c2UgaXMgdXAgcmVtb3ZlIG1vdXNlbW92ZSBldmVudCBmcm9tIGRvY3VtZW50RWxlbWVudFxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBfbW91c2Vkb3dubW92ZUxpc3RlbmVyKTtcbiAgfTtcblxuICB2YXIgX21vdXNlZG93bm1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCBpbnZpc2libGUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IChob3ZlclBvc2l0aW9uICogMTAwKS50b0ZpeGVkKDMpICsgJyUnO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShjdXJyZW50VGltZSk7XG4gICAgX2Rpc3BhdGNoU2VlayhldmVudCk7XG4gIH07XG5cbiAgdmFyIF9kaXNwYXRjaFNlZWsgPSBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBob3ZlclBvc2l0aW9uID0gX2dldE1vdXNlUG9zaXRpb24oZXZlbnQsIHByb2dyZXNzQmFyKTtcbiAgICB2YXIgZGF0YSA9IHsgY3VycmVudFRpbWU6IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uIH07XG4gICAgdmFyIHNlZWtFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5zZWVrLCBkYXRhKTtcbiAgICBwcm9ncmVzc0NvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHNlZWtFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9nZXRNb3VzZVBvc2l0aW9uID0gZnVuY3Rpb24oZSwgcHJvZ3Jlc3NCYXIpIHtcbiAgICB2YXIgbVBvc3ggPSAwO1xuICAgIHZhciBlUG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuXG4gICAgLy8gZ2V0IG1vdXNlIHBvc2l0aW9uIG9uIGRvY3VtZW50IGNyb3NzYnJvd3NlclxuICAgIGlmICghZSkgZSA9IHdpbmRvdy5ldmVudDtcbiAgICBpZiAoZS5wYWdlWCkge1xuICAgICAgbVBvc3ggPSBlLnBhZ2VYO1xuICAgIH0gZWxzZSBpZiAoZS5jbGllbnQpIHtcbiAgICAgIG1Qb3N4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7XG4gICAgfVxuICAgIC8vZ2V0IHBhcmVudCBlbGVtZW50IHBvc2l0aW9uIGluIGRvY3VtZW50XG4gICAgLy8gaWYgKG9iai5vZmZzZXRQYXJlbnQpIHtcbiAgICAvLyAgICAgZG8ge1xuICAgIC8vICAgICAgIGVQb3N4ICs9IG9iai5vZmZzZXRMZWZ0O1xuICAgIC8vICAgICB9IHdoaWxlIChvYmogPSBvYmoub2Zmc2V0UGFyZW50KTtcbiAgICAvLyB9XG4gICAgd2hpbGUgKG9iai5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGVQb3N4ICs9IG9iai5vZmZzZXRMZWZ0O1xuICAgICAgb2JqID0gb2JqLm9mZnNldFBhcmVudDtcbiAgICB9XG5cbiAgICB2YXIgb2Zmc2V0ID0gbVBvc3ggLSBlUG9zeDtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IG9mZnNldCAvIHByb2dyZXNzQmFyLm9mZnNldFdpZHRoO1xuICAgIHJldHVybiBob3ZlclBvc2l0aW9uO1xuICB9O1xuXG4gIHZhciB1cGRhdGVQbGF5ZWRQcm9ncmVzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZC5zdHlsZS53aWR0aCA9IGRhdGEucHJvZ3Jlc3MudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guc3R5bGUubGVmdCA9IGRhdGEucHJvZ3Jlc3MudG9GaXhlZCgzKSArICclJztcbiAgfTtcblxuICB2YXIgdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmJ1ZmZlcmVkLnN0eWxlLndpZHRoID0gZGF0YS5idWZmZXJlZC50b0ZpeGVkKDMpICsgJyUnO1xuICB9O1xuXG4gIHZhciB1cGRhdGVUaW1lQm94ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciBjdXJyZW50VGltZSA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSBjdXJyZW50VGltZTtcbiAgfTtcblxuICB2YXIgaW5pdFRpbWVCb3ggPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmlkZW9EdXJhdGlvbiA9IGRhdGEuZHVyYXRpb247XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IHV0aWxpdHkuc3BsaXRUaW1lKGRhdGEuZHVyYXRpb24pO1xuICB9O1xuXG4gIHZhciB1cGRhdGVUaWNrID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgfTtcblxuICAvL1xuICAvLyBQcm9ncmVzcyBjb21wb25lbnQgcHVibGljIEFQSXNcbiAgLy8gT3V0c2lkZSB3b3JsZCBjYW4gY2hhbmdlIHByb2dyZXNzIHN0YXRlcyBieSBhY2Nlc3NpbmcgdG8gdGhlc2UgQVBJcy5cbiAgLy9cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHVwZGF0ZVBsYXllZFByb2dyZXNzOiB1cGRhdGVQbGF5ZWRQcm9ncmVzcyxcbiAgICB1cGRhdGVCdWZmZXJlZFByb2dyZXNzOiB1cGRhdGVCdWZmZXJlZFByb2dyZXNzLFxuICAgIHVwZGF0ZVRpbWVCb3g6IHVwZGF0ZVRpbWVCb3gsXG4gICAgaW5pdFRpbWVCb3g6IGluaXRUaW1lQm94LFxuICAgIHVwZGF0ZVRpY2s6IHVwZGF0ZVRpY2tcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9Qcm9ncmVzc0Jhci5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBzcGxpdFRpbWU6IGZ1bmN0aW9uKHRpbWVJblNlY29uZHMpIHtcbiAgICB2YXIgdG0gPSBuZXcgRGF0ZSh0aW1lSW5TZWNvbmRzICogMTAwMCk7XG4gICAgdmFyIGhvdXJzID0gdG0uZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgbWludXRlcyA9IHRtLmdldFVUQ01pbnV0ZXMoKTtcbiAgICB2YXIgc2Vjb25kcyA9IHRtLmdldFVUQ1NlY29uZHMoKTtcbiAgICBpZiAobWludXRlcyA8IDEwKSB7XG4gICAgICBtaW51dGVzID0gXCIwXCIgKyBtaW51dGVzO1xuICAgIH1cbiAgICBpZiAoc2Vjb25kcyA8IDEwKSB7XG4gICAgICBzZWNvbmRzID0gXCIwXCIgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIGlmIChob3VycyA9PT0gMCkge1xuICAgICAgcmV0dXJuIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICAgIH1cblxuICAgIHJldHVybiBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzO1xuICB9LFxuXG4gIGhhc0NsYXNzOiBmdW5jdGlvbiAoZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpO1xuICAgIH1cbiAgfSxcblxuICBhZGRDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpIHtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSB7XG4gICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc05hbWU7XG4gICAgfVxuICB9LFxuXG4gIHJlbW92ZUNsYXNzOiBmdW5jdGlvbihlbCwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdCkge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5oYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJyk7XG4gICAgICBlbC5jbGFzc05hbWU9ZWwuY2xhc3NOYW1lLnJlcGxhY2UocmVnLCAnICcpO1xuICAgIH1cbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9VdGlsaXR5LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidWZmZXJlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJ1ZmZlcmVkRGl2LmNsYXNzTmFtZSA9ICdidWZmZXJlZCc7XG4gICAgcmV0dXJuIGJ1ZmZlcmVkRGl2O1xuICB9O1xuXG4gIHZhciBwbGF5ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGxheWVkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICAgIHJldHVybiBwbGF5ZWREaXY7XG4gIH07XG5cbiAgdmFyIGhvdmVyVGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBob3ZlclRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICBob3ZlclRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIGhvdmVyVGltZWJveERpdjtcbiAgfTtcblxuICB2YXIgdGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSB0aW1lUG9wKCcwMDowMCcpO1xuICAgIHRpbWVib3hEaXYuYXBwZW5kQ2hpbGQodGltZVBvcERpdik7XG4gICAgcmV0dXJuIHRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVQb3AgPSBmdW5jdGlvbih0aW1lKSB7XG4gICAgdmFyIHRpbWVQb3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aW1lUG9wRGl2LmNsYXNzTmFtZSA9ICd0aW1lLXBvcCc7XG4gICAgdGltZVBvcERpdi5pbm5lckhUTUwgPSB0aW1lO1xuICAgIHJldHVybiB0aW1lUG9wRGl2O1xuICB9O1xuXG4gIHZhciBjcmVhdGVQcm9ncmVzc1dyYXBwZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWRFbGVtZW50ID0gYnVmZmVyZWQoKTtcbiAgICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICAgIHZhciBob3ZlclRpbWVib3hFbGVtZW50ID0gaG92ZXJUaW1lYm94KCk7XG4gICAgdmFyIHRpbWVCb3hFbGVtZW50ID0gdGltZWJveCgpO1xuICAgIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuY2xhc3NOYW1lID0gJ3Byb2dyZXNzJztcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQoYnVmZmVyZWRFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGhvdmVyVGltZWJveEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZCh0aW1lQm94RWxlbWVudCk7XG4gICAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHByb2dyZXNzV3JhcHBlci5jbGFzc05hbWUgPSAncHJvZ3Jlc3Mtd3JhcHBlcic7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyLmFwcGVuZENoaWxkKHByb2dyZXNzRWxlbWVudCk7XG5cbiAgICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcHJvZ3Jlc3NXcmFwcGVyOiBjcmVhdGVQcm9ncmVzc1dyYXBwZXJcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZWxlbWVudHMvUGxheWVyUHJvZ3Jlc3NFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHBsYXlCdXR0b25FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9O1xuICB2YXIgcGxheWJ1dHRvbjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHBsYXlidXR0b24gPSBwbGF5QnV0dG9uRWxlbWVudC5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgdmFyIHBsYXlJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICB2YXIgcGF1c2VJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblsxXTtcbiAgICBwbGF5YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBidXR0b25DbGlja0xpc3RlbmVyKHBsYXlJY29uLCBwYXVzZUljb24pO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBwbGF5YnV0dG9uO1xuICB9O1xuXG4gIHZhciBidXR0b25DbGlja0xpc3RlbmVyID0gZnVuY3Rpb24ocGxheUljb24sIHBhdXNlSWNvbikge1xuICAgIGlmIChzdGF0ZS5wbGF5aW5nKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgICBwbGF5YnV0dG9uLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHZhciB2aW1lb1BsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHBsYXlidXR0b246IHBsYXlidXR0b25cbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgICB2YXIgcGxheVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdwb2x5Z29uJyk7XG4gICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsICcxLDAgMjAsMTAgMSwyMCcpO1xuICAgIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgcGxheUJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5U1ZHKTtcbiAgICByZXR1cm4gcGxheUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc05hbWUgPSAncGF1c2UtaWNvbic7XG4gICAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChsZWZ0UmVjdCk7XG4gICAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChyaWdodFJlY3QpO1xuICAgIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcbiAgICByZXR1cm4gcGF1c2VCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ3BsYXknO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcbnZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL1B1YlN1YicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8pIHtcbiAgICBwbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBwcm9ncmVzc1B1Ymxpc2hlcnMocHJvZ3Jlc3MpO1xuICAgIHZpZGVvUHVibGlzaGVycyh2aWRlbyk7XG4gIH07XG5cbiAgdmFyIHBsYXlidXR0b25QdWJsaXNoZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbikge1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIHByb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIHZpZGVvUHVibGlzaGVycyA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5ZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRpY2ssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBldmVudHM6IHt9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9LFxuXG4gIHVuc3Vic3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHB1Ymxpc2g6IGZ1bmN0aW9uIChldmVudE5hbWUsIGRhdGEpIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5mb3JFYWNoKGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvUHViU3ViLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgcmVnaXN0ZXJTdWJzY3JpYmVycyA9IGZ1bmN0aW9uKHBsYXlCdXR0b24sIHByb2dyZXNzLCB2aWRlbykge1xuICAgIHZpZGVvU3Vicyh2aWRlbyk7XG4gICAgcHJvZ3Jlc3NTdWJzKHByb2dyZXNzKTtcbiAgfTtcblxuICB2YXIgdmlkZW9TdWJzID0gZnVuY3Rpb24odmlkZW8pIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5LCBmdW5jdGlvbigpIHtcbiAgICAgIHZpZGVvLnBsYXkoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wYXVzZSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby5wYXVzZSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnNlZWssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHZpZGVvLnNldEN1cnJlbnRUaW1lKGRhdGEuY3VycmVudFRpbWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBwcm9ncmVzc1N1YnMgPSBmdW5jdGlvbihwcm9ncmVzcykge1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLmluaXRUaW1lQm94KGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy51cGRhdGVCdWZmZXJlZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnBsYXllZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlUGxheWVkUHJvZ3Jlc3MoZGF0YSk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlVGljayhkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IHJlZ2lzdGVyU3Vic2NyaWJlcnNcbiAgfTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iXSwic291cmNlUm9vdCI6IiJ9