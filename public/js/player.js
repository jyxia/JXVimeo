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
	var progressComponent = __webpack_require__(8);
	var playButton = __webpack_require__(11);
	var publishers = __webpack_require__(13);
	var subscribers = __webpack_require__(14);
	
	module.exports = (function() {
	  var playerControls = function() {
	    var controls = document.createElement('div');
	    controls.className = 'controls';
	    var playBtn = playButton.init();
	    controls.appendChild(playBtn);
	    var progress = progressComponent.init();
	    controls.appendChild(progress);
	    return controls;
	  };
	
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

	var eventManager = __webpack_require__(3);
	var videoElement = __webpack_require__(4);
	var playerEvents = __webpack_require__(5);
	var createCustomEvent = __webpack_require__(6);
	
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
	    video.player.addEventListener('loadeddata', function() {
	      _loadeddataListener();
	    }, false);
	    video.player.addEventListener('timeupdate', function() {
	      _timeupdateListener();
	    }, false);
	    video.player.addEventListener('progress', function() {
	      _progressUpdateListener();
	    }, false);
	
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
	
	  var getCurrentTime = function() {
	    return video.currentTime;
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
	      };
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
/* 4 */
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
/* 5 */
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
/* 6 */
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
	
	__webpack_require__(7);
	
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
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(3);
	var utility = __webpack_require__(9);
	var progressWrapper = __webpack_require__(10);
	var playerEvents = __webpack_require__(5);
	var createCustomEvent = __webpack_require__(6);
	
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
	
	    progressBar.addEventListener('mousemove', function(event) {
	      _mousemoveListener(event);
	    }, false);
	
	    progressBar.addEventListener('mouseleave', function() {
	      _mouseleaveListener();
	    }, false);
	
	    progressBar.addEventListener('click', function(event) {
	      _mouseClickListener(event);
	    }, false);
	
	    progressBar.addEventListener('mousedown', function(event) {
	      _mousedownListener(event);
	    }, false);
	
	    return progressContainer;
	  };
	
	  var _mouseClickListener = function(event) {
	    var hoverPosition = _getMousePosition(event, progressBar);
	    var data = { currentTime: videoDuration * hoverPosition };
	    var clickEvent = createCustomEvent(playerEvents.seek, data);
	    progressContainer.dispatchEvent(clickEvent);
	  };
	
	  var _mousemoveListener = function(event) {
	    var hoverPosition = _getMousePosition(event, progressBar);
	    if (hoverPosition < 0 || hoverPosition > 1) return;
	    var currentTime = videoDuration * hoverPosition;
	    progressBarChildren.hoverTimebox.style.left = (hoverPosition * 100).toFixed(3) + '%';
	    progressBarChildren.hoverTimebox.className = 'hover-timebox';
	    progressBarChildren.hoverTimebox.firstElementChild.innerHTML = utility.splitTime(currentTime);
	  };
	
	  var _mouseleaveListener = function() {
	    progressBarChildren.hoverTimebox.className = 'hover-timebox invisible';
	    utility.removeClass(progressBar, 'grabbable');
	  };
	
	  var _mousedownListener = function(event) {
	    utility.addClass(progressBar, 'grabbable');
	  };
	
	  var _getMousePosition = function(e, progressBar) {
	    var m_posx = 0;
	    var e_posx = 0;
	    var obj = progressBar;
	    // get mouse position on document crossbrowser
	    if (!e) e = window.event;
	    if (e.pageX) {
	        m_posx = e.pageX;
	    } else if (e.client) {
	        m_posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
	    }
	    //get parent element position in document
	    if (obj.offsetParent) {
	        do {
	          e_posx += obj.offsetLeft;
	        } while (obj = obj.offsetParent);
	    }
	
	    var offset = m_posx - e_posx;
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
/* 9 */
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
	    if (el.classList)
	      return el.classList.contains(className)
	    else
	      return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
	  },
	
	  addClass: function(el, className) {
	    if (el.classList)
	      el.classList.add(className)
	    else if (!hasClass(el, className)) el.className += " " + className
	  },
	
	  removeClass: function(el, className) {
	    if (el.classList)
	      el.classList.remove(className)
	    else if (hasClass(el, className)) {
	      var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
	      el.className=el.className.replace(reg, ' ')
	    }
	  }
	};


/***/ },
/* 10 */
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(3);
	var playButtonElement = __webpack_require__(12);
	var createCustomEvent = __webpack_require__(6);
	var playerEvents = __webpack_require__(5);
	
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
/* 12 */
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var playerEvents = __webpack_require__(5);
	var eventManager = __webpack_require__(3);
	
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
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var playerEvents = __webpack_require__(5);
	var eventManager = __webpack_require__(3);
	var utility = __webpack_require__(9);
	
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNzk4MDk1NmE2YTAwMTYxZGIwZDgiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9WaWRlby5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1YlN1Yi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZWxlbWVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1BvbHlmaWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1Byb2dyZXNzQmFyLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlsaXR5L1V0aWxpdHkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzIiwid2VicGFjazovLy8uL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZXZlbnRNYW5hZ2VyL1B1Ymxpc2hlcnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2V2ZW50TWFuYWdlci9TdWJzY3JpYmVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztB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QTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDM0hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzFERDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7O0FDM0NEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNsREQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsRUFBQzs7Ozs7OztBQzVDRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7QUFDQTtBQUNBLE1BQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFDIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgNzk4MDk1NmE2YTAwMTYxZGIwZDhcbiAqKi8iLCIvLyByZXF1aXJlKCchc3R5bGUhY3NzIS4vY3NzL3N0eWxlLmNzcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHBsYXllckNvbnRhaW5lciA9IHJlcXVpcmUoJy4vZWxlbWVudHMvUGxheWVyQ29udGFpbmVyRWxlbWVudCcpO1xuICB2YXIgdmlkZW9MaW5rID0gJ2h0dHBzOi8vcGxheWVyLnZpbWVvLmNvbS9leHRlcm5hbC83Njk3OTg3MS5oZC5tcDQ/cz03MDBiZjhmMzBmOGY4MTE0Y2MzNzJlOTRjNDE1NmFhZiZwcm9maWxlX2lkPTExMyc7XG4gIHZhciBwbGF5ZXIgPSBwbGF5ZXJDb250YWluZXIucGxheWVyQ29udGFpbmVyKHZpZGVvTGluayk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0uYXBwZW5kQ2hpbGQocGxheWVyKTtcbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB2aWRlb0NvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvVmlkZW8nKTtcbnZhciBwcm9ncmVzc0NvbXBvbmVudCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXInKTtcbnZhciBwbGF5QnV0dG9uID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9QbGF5QnV0dG9uJyk7XG52YXIgcHVibGlzaGVycyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzJyk7XG52YXIgc3Vic2NyaWJlcnMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZXJDb250cm9scyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb250cm9scyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRyb2xzLmNsYXNzTmFtZSA9ICdjb250cm9scyc7XG4gICAgdmFyIHBsYXlCdG4gPSBwbGF5QnV0dG9uLmluaXQoKTtcbiAgICBjb250cm9scy5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc0NvbXBvbmVudC5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICAgIHJldHVybiBjb250cm9scztcbiAgfTtcblxuICB2YXIgcGxheWVyQ29udGFpbmVyID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lci5jbGFzc05hbWUgPSAncGxheWVyLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvID0gdmlkZW9Db21wb25lbnQuaW5pdCh2aWRlb0xpbmspO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG5cbiAgICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb250cm9scy5jbGFzc05hbWUgPSAnY29udHJvbHMnO1xuICAgIHZhciBwbGF5QnRuID0gcGxheUJ1dHRvbi5pbml0KCk7XG4gICAgY29udHJvbHMuYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gICAgdmFyIHByb2dyZXNzID0gcHJvZ3Jlc3NDb21wb25lbnQuaW5pdCgpO1xuICAgIGNvbnRyb2xzLmFwcGVuZENoaWxkKHByb2dyZXNzKTtcbiAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29udHJvbHMpO1xuXG4gICAgcHVibGlzaGVycy5pbml0KHBsYXlCdG4sIHByb2dyZXNzLCB2aWRlbyk7XG4gICAgc3Vic2NyaWJlcnMuaW5pdChwbGF5QnRuLCBwcm9ncmVzc0NvbXBvbmVudCwgdmlkZW9Db21wb25lbnQpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHBsYXllckNvbnRhaW5lcjogcGxheWVyQ29udGFpbmVyLFxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5ZXJDb250YWluZXJFbGVtZW50LmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QdWJTdWInKTtcbnZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuLi9lbGVtZW50cy9WaWRlb0VsZW1lbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG52YXIgY3JlYXRlQ3VzdG9tRXZlbnQgPSByZXF1aXJlKCcuLi91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdmlkZW8gPSB7XG4gICAgZHVyYXRpb246IDAsXG4gICAgY3VycmVudFRpbWU6IDAsXG4gICAgYnVmZmVyZWQ6IDBcbiAgfTtcbiAgdmFyIHBsYXllckNvbnRhaW5lcjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKHZpZGVvTGluaykge1xuICAgIHBsYXllckNvbnRhaW5lciA9IHZpZGVvRWxlbWVudC52aWRlb0VsZW1lbnQodmlkZW9MaW5rKTtcbiAgICB2aWRlby5wbGF5ZXIgPSBwbGF5ZXJDb250YWluZXIuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWRlZGRhdGEnLCBmdW5jdGlvbigpIHtcbiAgICAgIF9sb2FkZWRkYXRhTGlzdGVuZXIoKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIF90aW1ldXBkYXRlTGlzdGVuZXIoKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8ucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Byb2dyZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lcigpO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBwbGF5ZXJDb250YWluZXI7XG4gIH07XG5cbiAgdmFyIF9sb2FkZWRkYXRhTGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5kdXJhdGlvbiA9IHZpZGVvLnBsYXllci5kdXJhdGlvbjtcbiAgICB2YXIgZHVyYXRpb25EYXRhID0geyBkdXJhdGlvbjogdmlkZW8uZHVyYXRpb24gfTtcbiAgICB2YXIgdmlkZW9SZWFkeUV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGR1cmF0aW9uRGF0YSk7XG4gICAgcGxheWVyQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQodmlkZW9SZWFkeUV2ZW50KTtcblxuICAgIHZhciBidWZmZXJEYXRhID0geyBidWZmZXJlZDogdmlkZW8ucGxheWVyLmJ1ZmZlcmVkLmVuZCgwKSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGJ1ZmZlckRhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfdGltZXVwZGF0ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8uY3VycmVudFRpbWUgPSB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWU7XG4gICAgdmFyIHRpY2tEYXRhID0geyBjdXJyZW50VGltZTogdmlkZW8uY3VycmVudFRpbWUgfTtcbiAgICB2YXIgdmlkZW9UaWNrRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMudGljaywgdGlja0RhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvVGlja0V2ZW50KTtcblxuICAgIHZhciBwbGF5ZWRQcm9ncmVzc0RhdGEgPSB7IHByb2dyZXNzOiB2aWRlby5jdXJyZW50VGltZSAvIHZpZGVvLmR1cmF0aW9uICogMTAwIH07XG4gICAgdmFyIHZpZGVvQnVmZmVyRXZlbnQgPSBjcmVhdGVDdXN0b21FdmVudChwbGF5ZXJFdmVudHMucGxheWVkLCBwbGF5ZWRQcm9ncmVzc0RhdGEpO1xuICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICB9O1xuXG4gIHZhciBfcHJvZ3Jlc3NVcGRhdGVMaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByYW5nZSA9IDA7XG4gICAgdmFyIGJmID0gdmlkZW8ucGxheWVyLmJ1ZmZlcmVkO1xuICAgIHZhciB0aW1lID0gdmlkZW8ucGxheWVyLmN1cnJlbnRUaW1lO1xuXG4gICAgd2hpbGUoIShiZi5zdGFydChyYW5nZSkgPD0gdGltZSAmJiB0aW1lIDw9IGJmLmVuZChyYW5nZSkpKSB7XG4gICAgICByYW5nZSArPSAxO1xuICAgIH1cblxuICAgIGlmIChyYW5nZSA8IGJmLnN0YXJ0Lmxlbmd0aCkge1xuICAgICAgdmFyIGJ1ZmZlckRhdGEgPSB7IGJ1ZmZlcmVkOiBiZi5lbmQocmFuZ2UpIC8gdmlkZW8uZHVyYXRpb24gKiAxMDAgfTtcbiAgICAgIHZhciB2aWRlb0J1ZmZlckV2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLmJ1ZmZlcmVkLCBidWZmZXJEYXRhKTtcbiAgICAgIHBsYXllckNvbnRhaW5lci5kaXNwYXRjaEV2ZW50KHZpZGVvQnVmZmVyRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZ2V0Q3VycmVudFRpbWUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdmlkZW8uY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIHNldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24oY3VycmVudFRpbWUpIHtcbiAgICB2aWRlby5wbGF5ZXIuY3VycmVudFRpbWUgPSBjdXJyZW50VGltZTtcbiAgICB2aWRlby5jdXJyZW50VGltZSA9IGN1cnJlbnRUaW1lO1xuICB9O1xuXG4gIHZhciBwbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdmlkZW8ucGxheWVyLnBsYXkoKTtcbiAgfTtcblxuICB2YXIgcGF1c2UgPSBmdW5jdGlvbigpIHtcbiAgICB2aWRlby5wbGF5ZXIucGF1c2UoKTtcbiAgfTtcblxuICAvL1xuICAvLyBWaWRlbyBjb21wb25lbnQgcHVibGljIEFQSXNcbiAgLy8gT3V0c2lkZSB3b3JsZCBjYW4gY2hhbmdlIHZpZGVvIGNvbXBvbmVudCBzdGF0ZXMgYnkgYWNjZXNzaW5nIHRvIHRoZXNlIEFQSXMuXG4gIC8vXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICBwbGF5OiBwbGF5LFxuICAgIHBhdXNlOiBwYXVzZSxcbiAgICBzZXRDdXJyZW50VGltZTogc2V0Q3VycmVudFRpbWVcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9WaWRlby5qc1xuICoqIG1vZHVsZSBpZCA9IDJcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBldmVudHM6IHt9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9LFxuXG4gIHVuc3Vic3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICBwdWJsaXNoOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICBmbihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvZXZlbnRNYW5hZ2VyL1B1YlN1Yi5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlVmlkZW9FbGVtZW50ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gICAgdmFyIHZpZGVvQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdmlkZW9Db250YWluZXIuY2xhc3NOYW1lID0gJ3ZpZGVvLWNvbnRhaW5lcic7XG4gICAgdmFyIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gICAgdmlkZW9FbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgdmlkZW9MaW5rKTtcbiAgICB2aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlb0VsZW1lbnQpO1xuICAgIHJldHVybiB2aWRlb0NvbnRhaW5lcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHZpZGVvRWxlbWVudDogY3JlYXRlVmlkZW9FbGVtZW50XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1ZpZGVvRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDRcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIi8qKlxuKiBBbGwgVmllbW8gUGxheWVyIGV2ZW50IG5hbWVzIGFyZSBoZXJlXG4qXG4qIEByZXR1cm4ge31cbipcbiovXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICB2aWRlb1JlYWR5OiAndmltZW9WaWRlb1JlYWR5JyxcbiAgcGxheTogJ3ZpbWVvUGxheScsXG4gIHBhdXNlOiAndmltZW9QYXVzZScsXG4gIHNlZWs6ICd2aW1lb1NlZWsnLFxuICBidWZmZXJlZDogJ3ZpbWVvQnVmZmVyZWQnLFxuICBwcm9ncmVzc3VwZGF0ZTogJ3ZpbWVvUHJvZ3Jlc3NVcGRkYXRlJyxcbiAgcGxheWVkOiAncGxheWVkJyxcbiAgdGljazogJ3ZpbWVvVGljaydcbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMuanNcbiAqKiBtb2R1bGUgaWQgPSA1XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIvKipcbiogY3JlYXRlIGEgY3VzdG9tIGV2ZW50IGZvciBhIEhUTUwgZWxlbWVudCwgb25seSB0aGUgc2FtZSBlbGVtZW50IGNhbiBsaXN0ZW4gdG8uXG4qIGl0J3MgdGhlIGVsZW1lbnQncyBpbnRlcm5hbCBldmVudHNcbiogbG9hZCBQb2x5ZmlsbCBmaXJzdCBmb3IgSUVcbipcbiogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZVxuKiBAcGFyYW0ge09iamVjdH0gZGF0YSAtIGRhdGEgcGFzc2VkIHdpdGggdGhlIGV2ZW50XG4qIEByZXR1cm4ge0N1c3RvbUV2ZW50fSBvciB7RXZlbnR9XG4qXG4qL1xuXG5yZXF1aXJlKCcuL1BvbHlmaWxsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXZlbnROYW1lLCBkYXRhKSB7XG4gIGlmIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtcbiAgICAgICdkZXRhaWwnOiBkYXRhXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBFdmVudChldmVudE5hbWUpO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy91dGlsaXR5L0NyZWF0ZUN1c3RvbUV2ZW50LmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwibW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24gKCkge1xuXG4gIGlmICggdHlwZW9mIHdpbmRvdy5DdXN0b21FdmVudCA9PT0gXCJmdW5jdGlvblwiICkgcmV0dXJuIGZhbHNlO1xuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50ICggZXZlbnQsIHBhcmFtcyApIHtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwgeyBidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkIH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnQ3VzdG9tRXZlbnQnICk7XG4gICAgZXZ0LmluaXRDdXN0b21FdmVudCggZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCApO1xuICAgIHJldHVybiBldnQ7XG4gICB9XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgXG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvdXRpbGl0eS9Qb2x5ZmlsbC5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUHViU3ViJyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xudmFyIHByb2dyZXNzV3JhcHBlciA9IHJlcXVpcmUoJy4uL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qcycpO1xudmFyIHBsYXllckV2ZW50cyA9IHJlcXVpcmUoJy4uL2V2ZW50TWFuYWdlci9QbGF5ZXJFdmVudHMnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBwcm9ncmVzc0JhckNoaWxkcmVuID0ge307XG4gIHZhciB2aWRlb0R1cmF0aW9uID0gMDtcbiAgdmFyIHByb2dyZXNzQmFyO1xuICB2YXIgcHJvZ3Jlc3NDb250YWluZXI7XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBwcm9ncmVzc0NvbnRhaW5lciA9IHByb2dyZXNzV3JhcHBlci5wcm9ncmVzc1dyYXBwZXIoKTtcbiAgICBwcm9ncmVzc0JhciA9IHByb2dyZXNzQ29udGFpbmVyLmZpcnN0RWxlbWVudENoaWxkO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uYnVmZmVyZWQgPSBwcm9ncmVzc0Jhci5jaGlsZHJlblswXTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnBsYXllZCA9IHByb2dyZXNzQmFyLmNoaWxkcmVuWzFdO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bMl07XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94ID0gcHJvZ3Jlc3NCYXIuY2hpbGRyZW5bM107XG5cbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgX21vdXNlbW92ZUxpc3RlbmVyKGV2ZW50KTtcbiAgICB9LCBmYWxzZSk7XG5cbiAgICBwcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgZnVuY3Rpb24oKSB7XG4gICAgICBfbW91c2VsZWF2ZUxpc3RlbmVyKCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xuICAgICAgX21vdXNlQ2xpY2tMaXN0ZW5lcihldmVudCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcHJvZ3Jlc3NCYXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIF9tb3VzZWRvd25MaXN0ZW5lcihldmVudCk7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzQ29udGFpbmVyO1xuICB9O1xuXG4gIHZhciBfbW91c2VDbGlja0xpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgaG92ZXJQb3NpdGlvbiA9IF9nZXRNb3VzZVBvc2l0aW9uKGV2ZW50LCBwcm9ncmVzc0Jhcik7XG4gICAgdmFyIGRhdGEgPSB7IGN1cnJlbnRUaW1lOiB2aWRlb0R1cmF0aW9uICogaG92ZXJQb3NpdGlvbiB9O1xuICAgIHZhciBjbGlja0V2ZW50ID0gY3JlYXRlQ3VzdG9tRXZlbnQocGxheWVyRXZlbnRzLnNlZWssIGRhdGEpO1xuICAgIHByb2dyZXNzQ29udGFpbmVyLmRpc3BhdGNoRXZlbnQoY2xpY2tFdmVudCk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBfZ2V0TW91c2VQb3NpdGlvbihldmVudCwgcHJvZ3Jlc3NCYXIpO1xuICAgIGlmIChob3ZlclBvc2l0aW9uIDwgMCB8fCBob3ZlclBvc2l0aW9uID4gMSkgcmV0dXJuO1xuICAgIHZhciBjdXJyZW50VGltZSA9IHZpZGVvRHVyYXRpb24gKiBob3ZlclBvc2l0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4uaG92ZXJUaW1lYm94LnN0eWxlLmxlZnQgPSAoaG92ZXJQb3NpdGlvbiAqIDEwMCkudG9GaXhlZCgzKSArICclJztcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLmhvdmVyVGltZWJveC5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoY3VycmVudFRpbWUpO1xuICB9O1xuXG4gIHZhciBfbW91c2VsZWF2ZUxpc3RlbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5ob3ZlclRpbWVib3guY2xhc3NOYW1lID0gJ2hvdmVyLXRpbWVib3ggaW52aXNpYmxlJztcbiAgICB1dGlsaXR5LnJlbW92ZUNsYXNzKHByb2dyZXNzQmFyLCAnZ3JhYmJhYmxlJyk7XG4gIH07XG5cbiAgdmFyIF9tb3VzZWRvd25MaXN0ZW5lciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdXRpbGl0eS5hZGRDbGFzcyhwcm9ncmVzc0JhciwgJ2dyYWJiYWJsZScpO1xuICB9O1xuXG4gIHZhciBfZ2V0TW91c2VQb3NpdGlvbiA9IGZ1bmN0aW9uKGUsIHByb2dyZXNzQmFyKSB7XG4gICAgdmFyIG1fcG9zeCA9IDA7XG4gICAgdmFyIGVfcG9zeCA9IDA7XG4gICAgdmFyIG9iaiA9IHByb2dyZXNzQmFyO1xuICAgIC8vIGdldCBtb3VzZSBwb3NpdGlvbiBvbiBkb2N1bWVudCBjcm9zc2Jyb3dzZXJcbiAgICBpZiAoIWUpIGUgPSB3aW5kb3cuZXZlbnQ7XG4gICAgaWYgKGUucGFnZVgpIHtcbiAgICAgICAgbV9wb3N4ID0gZS5wYWdlWDtcbiAgICB9IGVsc2UgaWYgKGUuY2xpZW50KSB7XG4gICAgICAgIG1fcG9zeCA9IGUuY2xpZW50WCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsTGVmdCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgIH1cbiAgICAvL2dldCBwYXJlbnQgZWxlbWVudCBwb3NpdGlvbiBpbiBkb2N1bWVudFxuICAgIGlmIChvYmoub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICBlX3Bvc3ggKz0gb2JqLm9mZnNldExlZnQ7XG4gICAgICAgIH0gd2hpbGUgKG9iaiA9IG9iai5vZmZzZXRQYXJlbnQpO1xuICAgIH1cblxuICAgIHZhciBvZmZzZXQgPSBtX3Bvc3ggLSBlX3Bvc3g7XG4gICAgdmFyIGhvdmVyUG9zaXRpb24gPSBvZmZzZXQgLyBwcm9ncmVzc0Jhci5vZmZzZXRXaWR0aDtcbiAgICByZXR1cm4gaG92ZXJQb3NpdGlvbjtcbiAgfTtcblxuICB2YXIgdXBkYXRlUGxheWVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5wbGF5ZWQuc3R5bGUud2lkdGggPSBkYXRhLnByb2dyZXNzLnRvRml4ZWQoMykgKyAnJSc7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi50aW1lQm94LnN0eWxlLmxlZnQgPSBkYXRhLnByb2dyZXNzLnRvRml4ZWQoMykgKyAnJSc7XG4gIH07XG5cbiAgdmFyIHVwZGF0ZUJ1ZmZlcmVkUHJvZ3Jlc3MgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgcHJvZ3Jlc3NCYXJDaGlsZHJlbi5idWZmZXJlZC5zdHlsZS53aWR0aCA9IGRhdGEuYnVmZmVyZWQudG9GaXhlZCgzKSArICclJztcbiAgfTtcblxuICB2YXIgdXBkYXRlVGltZUJveCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgY3VycmVudFRpbWUgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIGluaXRUaW1lQm94ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZpZGVvRHVyYXRpb24gPSBkYXRhLmR1cmF0aW9uO1xuICAgIHByb2dyZXNzQmFyQ2hpbGRyZW4udGltZUJveC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgPSB1dGlsaXR5LnNwbGl0VGltZShkYXRhLmR1cmF0aW9uKTtcbiAgfTtcblxuICB2YXIgdXBkYXRlVGljayA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBwcm9ncmVzc0JhckNoaWxkcmVuLnRpbWVCb3guZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gdXRpbGl0eS5zcGxpdFRpbWUoZGF0YS5jdXJyZW50VGltZSk7XG4gIH07XG5cbiAgLy9cbiAgLy8gUHJvZ3Jlc3MgY29tcG9uZW50IHB1YmxpYyBBUElzXG4gIC8vIE91dHNpZGUgd29ybGQgY2FuIGNoYW5nZSBwcm9ncmVzcyBzdGF0ZXMgYnkgYWNjZXNzaW5nIHRvIHRoZXNlIEFQSXMuXG4gIC8vXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdCxcbiAgICB1cGRhdGVQbGF5ZWRQcm9ncmVzczogdXBkYXRlUGxheWVkUHJvZ3Jlc3MsXG4gICAgdXBkYXRlQnVmZmVyZWRQcm9ncmVzczogdXBkYXRlQnVmZmVyZWRQcm9ncmVzcyxcbiAgICB1cGRhdGVUaW1lQm94OiB1cGRhdGVUaW1lQm94LFxuICAgIGluaXRUaW1lQm94OiBpbml0VGltZUJveCxcbiAgICB1cGRhdGVUaWNrOiB1cGRhdGVUaWNrXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2NvbXBvbmVudHMvUHJvZ3Jlc3NCYXIuanNcbiAqKiBtb2R1bGUgaWQgPSA4XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgc3BsaXRUaW1lOiBmdW5jdGlvbih0aW1lSW5TZWNvbmRzKSB7XG4gICAgdmFyIHRtID0gbmV3IERhdGUodGltZUluU2Vjb25kcyAqIDEwMDApO1xuICAgIHZhciBob3VycyA9IHRtLmdldFVUQ0hvdXJzKCk7XG4gICAgdmFyIG1pbnV0ZXMgPSB0bS5nZXRVVENNaW51dGVzKCk7XG4gICAgdmFyIHNlY29uZHMgPSB0bS5nZXRVVENTZWNvbmRzKCk7XG4gICAgaWYgKG1pbnV0ZXMgPCAxMCkge1xuICAgICAgbWludXRlcyA9IFwiMFwiICsgbWludXRlcztcbiAgICB9XG4gICAgaWYgKHNlY29uZHMgPCAxMCkge1xuICAgICAgc2Vjb25kcyA9IFwiMFwiICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICBpZiAoaG91cnMgPT09IDApIHtcbiAgICAgIHJldHVybiBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgICB9XG5cbiAgICByZXR1cm4gaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcbiAgfSxcblxuICBoYXNDbGFzczogZnVuY3Rpb24gKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KVxuICAgICAgcmV0dXJuIGVsLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuICEhZWwuY2xhc3NOYW1lLm1hdGNoKG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJykpXG4gIH0sXG5cbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uKGVsLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWwuY2xhc3NMaXN0KVxuICAgICAgZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpXG4gICAgZWxzZSBpZiAoIWhhc0NsYXNzKGVsLCBjbGFzc05hbWUpKSBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbGFzc05hbWVcbiAgfSxcblxuICByZW1vdmVDbGFzczogZnVuY3Rpb24oZWwsIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbC5jbGFzc0xpc3QpXG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSlcbiAgICBlbHNlIGlmIChoYXNDbGFzcyhlbCwgY2xhc3NOYW1lKSkge1xuICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoJyhcXFxcc3xeKScgKyBjbGFzc05hbWUgKyAnKFxcXFxzfCQpJylcbiAgICAgIGVsLmNsYXNzTmFtZT1lbC5jbGFzc05hbWUucmVwbGFjZShyZWcsICcgJylcbiAgICB9XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL3V0aWxpdHkvVXRpbGl0eS5qc1xuICoqIG1vZHVsZSBpZCA9IDlcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgYnVmZmVyZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYnVmZmVyZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICAgIHJldHVybiBidWZmZXJlZERpdjtcbiAgfTtcblxuICB2YXIgcGxheWVkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBsYXllZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHBsYXllZERpdi5jbGFzc05hbWUgPSAncGxheWVkJztcbiAgICByZXR1cm4gcGxheWVkRGl2O1xuICB9O1xuXG4gIHZhciBob3ZlclRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmNsYXNzTmFtZSA9ICdob3Zlci10aW1lYm94JztcbiAgICB2YXIgdGltZVBvcERpdiA9IHRpbWVQb3AoJzAwOjAwJyk7XG4gICAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiBob3ZlclRpbWVib3hEaXY7XG4gIH07XG5cbiAgdmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGltZWJveERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRpbWVib3hEaXYuY2xhc3NOYW1lID0gJ3RpbWVib3gnO1xuICAgIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MDAnKTtcbiAgICB0aW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICAgIHJldHVybiB0aW1lYm94RGl2O1xuICB9O1xuXG4gIHZhciB0aW1lUG9wID0gZnVuY3Rpb24odGltZSkge1xuICAgIHZhciB0aW1lUG9wRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGltZVBvcERpdi5jbGFzc05hbWUgPSAndGltZS1wb3AnO1xuICAgIHRpbWVQb3BEaXYuaW5uZXJIVE1MID0gdGltZTtcbiAgICByZXR1cm4gdGltZVBvcERpdjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIGJ1ZmZlcmVkRWxlbWVudCA9IGJ1ZmZlcmVkKCk7XG4gICAgdmFyIHBsYXllZEVsZW1lbnQgPSBwbGF5ZWQoKTtcbiAgICB2YXIgaG92ZXJUaW1lYm94RWxlbWVudCA9IGhvdmVyVGltZWJveCgpO1xuICAgIHZhciB0aW1lQm94RWxlbWVudCA9IHRpbWVib3goKTtcbiAgICB2YXIgcHJvZ3Jlc3NFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmNsYXNzTmFtZSA9ICdwcm9ncmVzcyc7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKGJ1ZmZlcmVkRWxlbWVudCk7XG4gICAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHBsYXllZEVsZW1lbnQpO1xuICAgIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChob3ZlclRpbWVib3hFbGVtZW50KTtcbiAgICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQodGltZUJveEVsZW1lbnQpO1xuICAgIHZhciBwcm9ncmVzc1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9ncmVzc1dyYXBwZXIuY2xhc3NOYW1lID0gJ3Byb2dyZXNzLXdyYXBwZXInO1xuICAgIHByb2dyZXNzV3JhcHBlci5hcHBlbmRDaGlsZChwcm9ncmVzc0VsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHByb2dyZXNzV3JhcHBlcjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHByb2dyZXNzV3JhcHBlcjogY3JlYXRlUHJvZ3Jlc3NXcmFwcGVyXG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2VsZW1lbnRzL1BsYXllclByb2dyZXNzRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDEwXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vZXZlbnRNYW5hZ2VyL1B1YlN1YicpO1xudmFyIHBsYXlCdXR0b25FbGVtZW50ID0gcmVxdWlyZSgnLi4vZWxlbWVudHMvUGxheUJ1dHRvbkVsZW1lbnQnKTtcbnZhciBjcmVhdGVDdXN0b21FdmVudCA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvQ3JlYXRlQ3VzdG9tRXZlbnQnKTtcbnZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuLi9ldmVudE1hbmFnZXIvUGxheWVyRXZlbnRzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgc3RhdGUgPSB7XG4gICAgJ3BsYXlpbmcnOiBmYWxzZVxuICB9O1xuICB2YXIgcGxheWJ1dHRvbjtcblxuICB2YXIgaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIHBsYXlidXR0b24gPSBwbGF5QnV0dG9uRWxlbWVudC5jcmVhdGVQbGF5QnV0dG9uKCk7XG4gICAgdmFyIHBsYXlJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblswXTtcbiAgICB2YXIgcGF1c2VJY29uID0gcGxheWJ1dHRvbi5jaGlsZHJlblsxXTtcbiAgICBwbGF5YnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBidXR0b25DbGlja0xpc3RlbmVyKHBsYXlJY29uLCBwYXVzZUljb24pO1xuICAgIH0sIGZhbHNlKTtcblxuICAgIHJldHVybiBwbGF5YnV0dG9uO1xuICB9O1xuXG4gIHZhciBidXR0b25DbGlja0xpc3RlbmVyID0gZnVuY3Rpb24ocGxheUljb24sIHBhdXNlSWNvbikge1xuICAgIGlmIChzdGF0ZS5wbGF5aW5nKSB7XG4gICAgICBwbGF5SWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdmFyIHZpbWVvUGF1c2VFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wYXVzZSk7XG4gICAgICBwbGF5YnV0dG9uLmRpc3BhdGNoRXZlbnQodmltZW9QYXVzZUV2ZW50KTtcbiAgICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGxheUljb24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHBhdXNlSWNvbi5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHZhciB2aW1lb1BsYXlFdmVudCA9IGNyZWF0ZUN1c3RvbUV2ZW50KHBsYXllckV2ZW50cy5wbGF5KTtcbiAgICAgIHBsYXlidXR0b24uZGlzcGF0Y2hFdmVudCh2aW1lb1BsYXlFdmVudCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0LFxuICAgIHBsYXlidXR0b246IHBsYXlidXR0b25cbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gMTFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgY3JlYXRlUGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBwbGF5QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgICB2YXIgcGxheVNWRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCAnc3ZnJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgICB2YXIgcG9seWdvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdwb2x5Z29uJyk7XG4gICAgcG9seWdvbi5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsICcxLDAgMjAsMTAgMSwyMCcpO1xuICAgIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gICAgcGxheUJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5U1ZHKTtcbiAgICByZXR1cm4gcGxheUJ1dHRvbjtcbiAgfTtcblxuICB2YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcGF1c2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwYXVzZUJ1dHRvbi5jbGFzc05hbWUgPSAncGF1c2UtaWNvbic7XG4gICAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCAnMCAwIDIwIDIwJyk7XG4gICAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkJyk7XG4gICAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgICBsZWZ0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gICAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChsZWZ0UmVjdCk7XG4gICAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gICAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAnNicpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICcyMCcpO1xuICAgIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgICByaWdodFJlY3Quc2V0QXR0cmlidXRlKCd5JywgJzAnKTtcbiAgICBwYXVzZVNWRy5hcHBlbmRDaGlsZChyaWdodFJlY3QpO1xuICAgIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcbiAgICByZXR1cm4gcGF1c2VCdXR0b247XG4gIH07XG5cbiAgdmFyIGNyZWF0ZUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBidXR0b24uY2xhc3NOYW1lID0gJ3BsYXknO1xuICAgIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwbGF5QnRuKTtcbiAgICB2YXIgcGF1c2VCdG4gPSBjcmVhdGVQYXVzZUJ1dHRvbigpO1xuICAgIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gICAgcmV0dXJuIGJ1dHRvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGNyZWF0ZVBsYXlCdXR0b246IGNyZWF0ZUJ1dHRvblxuICB9O1xuXG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9lbGVtZW50cy9QbGF5QnV0dG9uRWxlbWVudC5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgcGxheWVyRXZlbnRzID0gcmVxdWlyZSgnLi9QbGF5ZXJFdmVudHMnKTtcbnZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuL1B1YlN1YicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGluaXQgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8pIHtcbiAgICBwbGF5YnV0dG9uUHVibGlzaGVycyhwbGF5QnV0dG9uKTtcbiAgICBwcm9ncmVzc1B1Ymxpc2hlcnMocHJvZ3Jlc3MpO1xuICAgIHZpZGVvUHVibGlzaGVycyh2aWRlbyk7XG4gIH07XG5cbiAgdmFyIHBsYXlidXR0b25QdWJsaXNoZXJzID0gZnVuY3Rpb24ocGxheUJ1dHRvbikge1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICBldmVudE1hbmFnZXIucHVibGlzaChwbGF5ZXJFdmVudHMucGxheSk7XG4gICAgfSwgZmFsc2UpO1xuICAgIHBsYXlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnBhdXNlKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIHByb2dyZXNzUHVibGlzaGVycyA9IGZ1bmN0aW9uKHByb2dyZXNzKSB7XG4gICAgcHJvZ3Jlc3MuYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuc2VlaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnNlZWssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgdmFyIHZpZGVvUHVibGlzaGVycyA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudmlkZW9SZWFkeSwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnZpZGVvUmVhZHksIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMuYnVmZmVyZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZGF0YS5kZXRhaWwpO1xuICAgIH0sIGZhbHNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKHBsYXllckV2ZW50cy5wbGF5ZWQsIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihwbGF5ZXJFdmVudHMudGljaywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2gocGxheWVyRXZlbnRzLnRpY2ssIGRhdGEuZGV0YWlsKTtcbiAgICB9LCBmYWxzZSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH07XG5cbn0pKCk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2V2ZW50TWFuYWdlci9QdWJsaXNoZXJzLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBwbGF5ZXJFdmVudHMgPSByZXF1aXJlKCcuL1BsYXllckV2ZW50cycpO1xudmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4vUHViU3ViJyk7XG52YXIgdXRpbGl0eSA9IHJlcXVpcmUoJy4uL3V0aWxpdHkvVXRpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHJlZ2lzdGVyU3Vic2NyaWJlcnMgPSBmdW5jdGlvbihwbGF5QnV0dG9uLCBwcm9ncmVzcywgdmlkZW8pIHtcbiAgICB2aWRlb1N1YnModmlkZW8pO1xuICAgIHByb2dyZXNzU3Vicyhwcm9ncmVzcyk7XG4gIH07XG5cbiAgdmFyIHZpZGVvU3VicyA9IGZ1bmN0aW9uKHZpZGVvKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGxheSwgZnVuY3Rpb24oKSB7XG4gICAgICB2aWRlby5wbGF5KCk7XG4gICAgfSk7XG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZShwbGF5ZXJFdmVudHMucGF1c2UsIGZ1bmN0aW9uKCkge1xuICAgICAgdmlkZW8ucGF1c2UoKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5zZWVrLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2aWRlby5zZXRDdXJyZW50VGltZShkYXRhLmN1cnJlbnRUaW1lKTtcbiAgICB9KTtcbiAgfTtcblxuICB2YXIgcHJvZ3Jlc3NTdWJzID0gZnVuY3Rpb24ocHJvZ3Jlc3MpIHtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy52aWRlb1JlYWR5LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICBwcm9ncmVzcy5pbml0VGltZUJveChkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5idWZmZXJlZCwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgcHJvZ3Jlc3MudXBkYXRlQnVmZmVyZWRQcm9ncmVzcyhkYXRhKTtcbiAgICB9KTtcbiAgICBldmVudE1hbmFnZXIuc3Vic2NyaWJlKHBsYXllckV2ZW50cy5wbGF5ZWQsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVBsYXllZFByb2dyZXNzKGRhdGEpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUocGxheWVyRXZlbnRzLnRpY2ssIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgIHByb2dyZXNzLnVwZGF0ZVRpY2soZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiByZWdpc3RlclN1YnNjcmliZXJzXG4gIH07XG59KSgpO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9ldmVudE1hbmFnZXIvU3Vic2NyaWJlcnMuanNcbiAqKiBtb2R1bGUgaWQgPSAxNFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIl0sInNvdXJjZVJvb3QiOiIifQ==