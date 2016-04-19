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

	var playerContainer = __webpack_require__(1);
	
	var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
	
	document.getElementsByTagName('body')[0].appendChild(playerContainer(videoLink));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var videoElement = __webpack_require__(3);
	var playerControls = __webpack_require__(6);
	
	var playerContainer = function(videoLink) {
	  var container = document.createElement('div');
	  container.className = 'player-container';
	  var video = videoElement(videoLink);
	  container.appendChild(video);
	  var controls = playerControls();
	  container.appendChild(controls);
	
	  return container;
	};
	
	module.exports = playerContainer;


/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	var videoStore = __webpack_require__(10);
	
	var createElement = function(videoLink) {
	  var videoContainer = document.createElement('div');
	  videoContainer.className = 'video-container';
	  var videoElement = document.createElement('video');
	  videoElement.setAttribute('src', videoLink);
	  videoStore.init(videoElement);
	  videoContainer.appendChild(videoElement);
	
	  return videoContainer;
	};
	
	var videoElement = function(videoLink) {
	  var videoContainer = createElement(videoLink);
	  return videoContainer;
	};
	
	module.exports = videoElement;


/***/ },
/* 4 */,
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	var playButtonStore = __webpack_require__(11);
	
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
	
	var playButtonClick = function(self) {
	  if (state.playing) {
	    state.playing = false;
	    playButtonActions.publishPause();
	  } else {
	    playButtonActions.publishPlay();
	    state.playing = true;
	  }
	};
	
	var playButton = function() {
	  var button = document.createElement('button');
	  button.className = 'play';
	  var playBtn = createPlayButton();
	  button.appendChild(playBtn);
	  var pauseBtn = createPauseButton();
	  button.appendChild(pauseBtn);
	  playButtonStore.init(button);
	
	  return button;
	};
	
	module.exports = playButton;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var playButton = __webpack_require__(5);
	var progressWrapper = __webpack_require__(7);
	
	var playerControls = function() {
	  var controls = document.createElement('div');
	  controls.className = 'controls';
	  var playBtn = playButton();
	  controls.appendChild(playBtn);
	  var progress = progressWrapper();
	  controls.appendChild(progress);
	  return controls;
	};
	
	module.exports = playerControls;


/***/ },
/* 7 */
/***/ function(module, exports) {

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
	  var timePopDiv = timePop('00:10');
	  hoverTimeboxDiv.appendChild(timePopDiv);
	  return hoverTimeboxDiv;
	};
	
	var timebox = function() {
	  var timeboxDiv = document.createElement('div');
	  timeboxDiv.className = 'timebox';
	  var timePopDiv = timePop('00:20');
	  timeboxDiv.appendChild(timePopDiv);
	  return timeboxDiv;
	};
	
	var timePop = function(time) {
	  var timePopDiv = document.createElement('div');
	  timePopDiv.className = 'time-pop';
	  timePopDiv.innerHTML = time;
	  return timePopDiv;
	};
	
	var playerProgress = function() {
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
	
	module.exports = playerProgress;


/***/ },
/* 8 */
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
/* 9 */,
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	var videoActions = __webpack_require__(13);
	
	module.exports = (function() {
	  var state = { };
	
	  /*
	  * video element publishers:
	  *
	  */
	
	  var loadeddata = function(self) {
	    var data = {
	      duration: self.player.duration
	    };
	    videoActions.publishReady(data);
	  };
	
	  var timeupdate = function(self) {
	    var data = {
	      currentTime: self.player.currentTime,
	    };
	    videoActions.publishTick(data);
	  };
	
	
	  /*
	  * video element subscribers:
	  *
	  */
	  var play = function() {
	    this.player.play();
	  };
	
	  var init = function(element) {
	    this.player = element;
	    var self = this;
	    element.addEventListener('loadeddata', function() {
	      loadeddata(self);
	    }, false);
	    element.addEventListener('timeupdate', function() {
	      timeupdate(self);
	    }, false);
	
	    eventManager.subscribe('play', function() {
	      self.player.play();
	    });
	    eventManager.subscribe('pause', function() {
	      self.player.pause();
	    });
	  };
	
	  var getCurrentTime = function() {
	    return this.element.currentTime;
	  };
	
	  var setCurrentTime = function(currentTime) {
	    this.state.currentTime = currentTime;
	  };
	
	  var getDuration = function() {
	    return this.element.state.duration;
	  };
	
	  return {
	    init: init
	  };
	
	})();


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	var playButtonActions = __webpack_require__(15);
	
	module.exports = (function() {
	  var state = {
	    'playing': false
	  };
	
	  var playButtonClick = function(self) {
	    if (state.playing) {
	      state.playing = false;
	      playButtonActions.publishPause();
	    } else {
	      playButtonActions.publishPlay();
	      state.playing = true;
	    }
	  };
	
	  var init = function(button) {
	    this.playButton = button;
	    var self = this;
	    this.playButton.addEventListener('click', function() {
	      playButtonClick(self);
	    }, false);
	  };
	
	  return {
	    init: init
	  };
	
	})();


/***/ },
/* 12 */,
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	
	module.exports = {
	  publishReady: function(data) {
	    eventManager.publish('videoReady', data);
	  },
	
	  publishTick: function(data) {
	    eventManager.publish('tick', data);
	  }
	};


/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var eventManager = __webpack_require__(8);
	
	module.exports = {
	  publishPlay: function() {
	    eventManager.publish('play');
	  },
	
	  publishPause: function() {
	    eventManager.publish('pause');
	  }
	};


/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjhhYzVjODU5MDExMDIzZTkzMjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tcG9uZW50cy9QbGF5ZXJDb250YWluZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvVmlkZW9FbGVtZW50LmpzIiwid2VicGFjazovLy8uL3NyYy9jb21wb25lbnRzL1BsYXlCdXR0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvUGxheWVyQ29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbXBvbmVudHMvUGxheWVyUHJvZ3Jlc3MuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0V2ZW50TWFuYWdlci9QdWJTdWIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1N0b3Jlcy9WaWRlb1N0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9TdG9yZXMvUGxheUJ1dHRvblN0b3JlLmpzIiwid2VicGFjazovLy8uL3NyYy9BY3Rpb25zL1ZpZGVvQWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQWN0aW9ucy9QbGF5QnV0dG9uQWN0aW9ucy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdUJBQWU7QUFDZjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQ3RDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQ0pBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7QUNkQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDbkJBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7OztBQzlEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7O0FDckRBO0FBQ0EsYUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQSxzQkFBcUIsbUNBQW1DO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFPO0FBQ1A7QUFDQTtBQUNBOzs7Ozs7OztBQzFCQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWU7O0FBRWY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0EsTUFBSzs7QUFFTDtBQUNBO0FBQ0EsTUFBSztBQUNMO0FBQ0E7QUFDQSxNQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLEVBQUM7Ozs7Ozs7QUNwRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxFQUFDOzs7Ozs7OztBQzlCRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiB3ZWJwYWNrL2Jvb3RzdHJhcCBiOGFjNWM4NTkwMTEwMjNlOTMyMlxuICoqLyIsInZhciBwbGF5ZXJDb250YWluZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGxheWVyQ29udGFpbmVyJyk7XG5cbnZhciB2aWRlb0xpbmsgPSAnaHR0cHM6Ly9wbGF5ZXIudmltZW8uY29tL2V4dGVybmFsLzc2OTc5ODcxLmhkLm1wND9zPTcwMGJmOGYzMGY4ZjgxMTRjYzM3MmU5NGM0MTU2YWFmJnByb2ZpbGVfaWQ9MTEzJztcblxuZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXS5hcHBlbmRDaGlsZChwbGF5ZXJDb250YWluZXIodmlkZW9MaW5rKSk7XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL2FwcC5qc1xuICoqIG1vZHVsZSBpZCA9IDBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciB2aWRlb0VsZW1lbnQgPSByZXF1aXJlKCcuL1ZpZGVvRWxlbWVudCcpO1xudmFyIHBsYXllckNvbnRyb2xzID0gcmVxdWlyZSgnLi9QbGF5ZXJDb250cm9scycpO1xuXG52YXIgcGxheWVyQ29udGFpbmVyID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gIHZhciBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udGFpbmVyLmNsYXNzTmFtZSA9ICdwbGF5ZXItY29udGFpbmVyJztcbiAgdmFyIHZpZGVvID0gdmlkZW9FbGVtZW50KHZpZGVvTGluayk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlbyk7XG4gIHZhciBjb250cm9scyA9IHBsYXllckNvbnRyb2xzKCk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9scyk7XG5cbiAgcmV0dXJuIGNvbnRhaW5lcjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheWVyQ29udGFpbmVyO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXllckNvbnRhaW5lci5qc1xuICoqIG1vZHVsZSBpZCA9IDFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9FdmVudE1hbmFnZXIvUHViU3ViJyk7XG52YXIgdmlkZW9TdG9yZSA9IHJlcXVpcmUoJy4uL1N0b3Jlcy9WaWRlb1N0b3JlJyk7XG5cbnZhciBjcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24odmlkZW9MaW5rKSB7XG4gIHZhciB2aWRlb0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB2aWRlb0NvbnRhaW5lci5jbGFzc05hbWUgPSAndmlkZW8tY29udGFpbmVyJztcbiAgdmFyIHZpZGVvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJyk7XG4gIHZpZGVvRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHZpZGVvTGluayk7XG4gIHZpZGVvU3RvcmUuaW5pdCh2aWRlb0VsZW1lbnQpO1xuICB2aWRlb0NvbnRhaW5lci5hcHBlbmRDaGlsZCh2aWRlb0VsZW1lbnQpO1xuXG4gIHJldHVybiB2aWRlb0NvbnRhaW5lcjtcbn07XG5cbnZhciB2aWRlb0VsZW1lbnQgPSBmdW5jdGlvbih2aWRlb0xpbmspIHtcbiAgdmFyIHZpZGVvQ29udGFpbmVyID0gY3JlYXRlRWxlbWVudCh2aWRlb0xpbmspO1xuICByZXR1cm4gdmlkZW9Db250YWluZXI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHZpZGVvRWxlbWVudDtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9WaWRlb0VsZW1lbnQuanNcbiAqKiBtb2R1bGUgaWQgPSAzXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vRXZlbnRNYW5hZ2VyL1B1YlN1Yi5qcycpO1xudmFyIHBsYXlCdXR0b25TdG9yZSA9IHJlcXVpcmUoJy4uL1N0b3Jlcy9QbGF5QnV0dG9uU3RvcmUnKTtcblxudmFyIGNyZWF0ZVBsYXlCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBsYXlCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcGxheUJ1dHRvbi5jbGFzc05hbWUgPSAncGxheS1pY29uJztcbiAgdmFyIHBsYXlTVkcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywgJ3N2ZycpO1xuICBwbGF5U1ZHLnNldEF0dHJpYnV0ZSgndmlld0JveCcsICcwIDAgMjAgMjAnKTtcbiAgcGxheVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgdmFyIHBvbHlnb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJywncG9seWdvbicpO1xuICBwb2x5Z29uLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgJzEsMCAyMCwxMCAxLDIwJyk7XG4gIHBsYXlTVkcuYXBwZW5kQ2hpbGQocG9seWdvbik7XG4gIHBsYXlCdXR0b24uYXBwZW5kQ2hpbGQocGxheVNWRyk7XG5cbiAgcmV0dXJuIHBsYXlCdXR0b247XG59O1xuXG52YXIgY3JlYXRlUGF1c2VCdXR0b24gPSBmdW5jdGlvbigpIHtcbiAgdmFyIHBhdXNlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHBhdXNlQnV0dG9uLmNsYXNzTmFtZSA9ICdwYXVzZS1pY29uJztcbiAgdmFyIHBhdXNlU1ZHID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsICdzdmcnKTtcbiAgcGF1c2VTVkcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgJzAgMCAyMCAyMCcpO1xuICBwYXVzZVNWRy5zZXRBdHRyaWJ1dGUoJ3ByZXNlcnZlQXNwZWN0UmF0aW8nLCAneE1pZFlNaWQnKTtcbiAgdmFyIGxlZnRSZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKCdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZycsJ3JlY3QnKTtcbiAgbGVmdFJlY3Quc2V0QXR0cmlidXRlKCd3aWR0aCcsICc2Jyk7XG4gIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneCcsICcwJyk7XG4gIGxlZnRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gIHBhdXNlU1ZHLmFwcGVuZENoaWxkKGxlZnRSZWN0KTtcbiAgdmFyIHJpZ2h0UmVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCdyZWN0Jyk7XG4gIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzYnKTtcbiAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgJzIwJyk7XG4gIHJpZ2h0UmVjdC5zZXRBdHRyaWJ1dGUoJ3gnLCAnMTInKTtcbiAgcmlnaHRSZWN0LnNldEF0dHJpYnV0ZSgneScsICcwJyk7XG4gIHBhdXNlU1ZHLmFwcGVuZENoaWxkKHJpZ2h0UmVjdCk7XG4gIHBhdXNlQnV0dG9uLmFwcGVuZENoaWxkKHBhdXNlU1ZHKTtcblxuICByZXR1cm4gcGF1c2VCdXR0b247XG59O1xuXG52YXIgcGxheUJ1dHRvbkNsaWNrID0gZnVuY3Rpb24oc2VsZikge1xuICBpZiAoc3RhdGUucGxheWluZykge1xuICAgIHN0YXRlLnBsYXlpbmcgPSBmYWxzZTtcbiAgICBwbGF5QnV0dG9uQWN0aW9ucy5wdWJsaXNoUGF1c2UoKTtcbiAgfSBlbHNlIHtcbiAgICBwbGF5QnV0dG9uQWN0aW9ucy5wdWJsaXNoUGxheSgpO1xuICAgIHN0YXRlLnBsYXlpbmcgPSB0cnVlO1xuICB9XG59O1xuXG52YXIgcGxheUJ1dHRvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gIGJ1dHRvbi5jbGFzc05hbWUgPSAncGxheSc7XG4gIHZhciBwbGF5QnRuID0gY3JlYXRlUGxheUJ1dHRvbigpO1xuICBidXR0b24uYXBwZW5kQ2hpbGQocGxheUJ0bik7XG4gIHZhciBwYXVzZUJ0biA9IGNyZWF0ZVBhdXNlQnV0dG9uKCk7XG4gIGJ1dHRvbi5hcHBlbmRDaGlsZChwYXVzZUJ0bik7XG4gIHBsYXlCdXR0b25TdG9yZS5pbml0KGJ1dHRvbik7XG5cbiAgcmV0dXJuIGJ1dHRvbjtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gcGxheUJ1dHRvbjtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5QnV0dG9uLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIHBsYXlCdXR0b24gPSByZXF1aXJlKCcuL1BsYXlCdXR0b24nKTtcbnZhciBwcm9ncmVzc1dyYXBwZXIgPSByZXF1aXJlKCcuL1BsYXllclByb2dyZXNzJyk7XG5cbnZhciBwbGF5ZXJDb250cm9scyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgY29udHJvbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgY29udHJvbHMuY2xhc3NOYW1lID0gJ2NvbnRyb2xzJztcbiAgdmFyIHBsYXlCdG4gPSBwbGF5QnV0dG9uKCk7XG4gIGNvbnRyb2xzLmFwcGVuZENoaWxkKHBsYXlCdG4pO1xuICB2YXIgcHJvZ3Jlc3MgPSBwcm9ncmVzc1dyYXBwZXIoKTtcbiAgY29udHJvbHMuYXBwZW5kQ2hpbGQocHJvZ3Jlc3MpO1xuICByZXR1cm4gY29udHJvbHM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBsYXllckNvbnRyb2xzO1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9jb21wb25lbnRzL1BsYXllckNvbnRyb2xzLmpzXG4gKiogbW9kdWxlIGlkID0gNlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGJ1ZmZlcmVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBidWZmZXJlZERpdi5jbGFzc05hbWUgPSAnYnVmZmVyZWQnO1xuICByZXR1cm4gYnVmZmVyZWREaXY7XG59O1xuXG52YXIgcGxheWVkID0gZnVuY3Rpb24oKSB7XG4gIHZhciBwbGF5ZWREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcGxheWVkRGl2LmNsYXNzTmFtZSA9ICdwbGF5ZWQnO1xuICByZXR1cm4gcGxheWVkRGl2O1xufTtcblxudmFyIGhvdmVyVGltZWJveCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaG92ZXJUaW1lYm94RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGhvdmVyVGltZWJveERpdi5jbGFzc05hbWUgPSAnaG92ZXItdGltZWJveCc7XG4gIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MTAnKTtcbiAgaG92ZXJUaW1lYm94RGl2LmFwcGVuZENoaWxkKHRpbWVQb3BEaXYpO1xuICByZXR1cm4gaG92ZXJUaW1lYm94RGl2O1xufTtcblxudmFyIHRpbWVib3ggPSBmdW5jdGlvbigpIHtcbiAgdmFyIHRpbWVib3hEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGltZWJveERpdi5jbGFzc05hbWUgPSAndGltZWJveCc7XG4gIHZhciB0aW1lUG9wRGl2ID0gdGltZVBvcCgnMDA6MjAnKTtcbiAgdGltZWJveERpdi5hcHBlbmRDaGlsZCh0aW1lUG9wRGl2KTtcbiAgcmV0dXJuIHRpbWVib3hEaXY7XG59O1xuXG52YXIgdGltZVBvcCA9IGZ1bmN0aW9uKHRpbWUpIHtcbiAgdmFyIHRpbWVQb3BEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGltZVBvcERpdi5jbGFzc05hbWUgPSAndGltZS1wb3AnO1xuICB0aW1lUG9wRGl2LmlubmVySFRNTCA9IHRpbWU7XG4gIHJldHVybiB0aW1lUG9wRGl2O1xufTtcblxudmFyIHBsYXllclByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gIHZhciBidWZmZXJlZEVsZW1lbnQgPSBidWZmZXJlZCgpO1xuICB2YXIgcGxheWVkRWxlbWVudCA9IHBsYXllZCgpO1xuICB2YXIgaG92ZXJUaW1lYm94RWxlbWVudCA9IGhvdmVyVGltZWJveCgpO1xuICB2YXIgdGltZUJveEVsZW1lbnQgPSB0aW1lYm94KCk7XG4gIHZhciBwcm9ncmVzc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcHJvZ3Jlc3NFbGVtZW50LmNsYXNzTmFtZSA9ICdwcm9ncmVzcyc7XG4gIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChidWZmZXJlZEVsZW1lbnQpO1xuICBwcm9ncmVzc0VsZW1lbnQuYXBwZW5kQ2hpbGQocGxheWVkRWxlbWVudCk7XG4gIHByb2dyZXNzRWxlbWVudC5hcHBlbmRDaGlsZChob3ZlclRpbWVib3hFbGVtZW50KTtcbiAgcHJvZ3Jlc3NFbGVtZW50LmFwcGVuZENoaWxkKHRpbWVCb3hFbGVtZW50KTtcbiAgdmFyIHByb2dyZXNzV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBwcm9ncmVzc1dyYXBwZXIuY2xhc3NOYW1lID0gJ3Byb2dyZXNzLXdyYXBwZXInO1xuICBwcm9ncmVzc1dyYXBwZXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NFbGVtZW50KTtcblxuICByZXR1cm4gcHJvZ3Jlc3NXcmFwcGVyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBwbGF5ZXJQcm9ncmVzcztcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvY29tcG9uZW50cy9QbGF5ZXJQcm9ncmVzcy5qc1xuICoqIG1vZHVsZSBpZCA9IDdcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBldmVudHM6IHt9LFxuXG4gIHN1YnNjcmliZTogZnVuY3Rpb24gKGV2ZW50TmFtZSwgZm4pIHtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdID0gdGhpcy5ldmVudHNbZXZlbnROYW1lXSB8fCBbXTtcbiAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLnB1c2goZm4pO1xuICB9LFxuXG4gIHVuc3Vic3JpYmU6IGZ1bmN0aW9uKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcblxuICBwdWJsaXNoOiBmdW5jdGlvbiAoZXZlbnROYW1lLCBkYXRhKSB7XG4gICAgaWYgKHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0pIHtcbiAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uZm9yRWFjaChmdW5jdGlvbihmbikge1xuICAgICAgICBmbihkYXRhKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvRXZlbnRNYW5hZ2VyL1B1YlN1Yi5qc1xuICoqIG1vZHVsZSBpZCA9IDhcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9FdmVudE1hbmFnZXIvUHViU3ViJyk7XG52YXIgdmlkZW9BY3Rpb25zID0gcmVxdWlyZSgnLi4vQWN0aW9ucy9WaWRlb0FjdGlvbnMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHsgfTtcblxuICAvKlxuICAqIHZpZGVvIGVsZW1lbnQgcHVibGlzaGVyczpcbiAgKlxuICAqL1xuXG4gIHZhciBsb2FkZWRkYXRhID0gZnVuY3Rpb24oc2VsZikge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgZHVyYXRpb246IHNlbGYucGxheWVyLmR1cmF0aW9uXG4gICAgfTtcbiAgICB2aWRlb0FjdGlvbnMucHVibGlzaFJlYWR5KGRhdGEpO1xuICB9O1xuXG4gIHZhciB0aW1ldXBkYXRlID0gZnVuY3Rpb24oc2VsZikge1xuICAgIHZhciBkYXRhID0ge1xuICAgICAgY3VycmVudFRpbWU6IHNlbGYucGxheWVyLmN1cnJlbnRUaW1lLFxuICAgIH07XG4gICAgdmlkZW9BY3Rpb25zLnB1Ymxpc2hUaWNrKGRhdGEpO1xuICB9O1xuXG5cbiAgLypcbiAgKiB2aWRlbyBlbGVtZW50IHN1YnNjcmliZXJzOlxuICAqXG4gICovXG4gIHZhciBwbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wbGF5ZXIucGxheSgpO1xuICB9O1xuXG4gIHZhciBpbml0ID0gZnVuY3Rpb24oZWxlbWVudCkge1xuICAgIHRoaXMucGxheWVyID0gZWxlbWVudDtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdsb2FkZWRkYXRhJywgZnVuY3Rpb24oKSB7XG4gICAgICBsb2FkZWRkYXRhKHNlbGYpO1xuICAgIH0sIGZhbHNlKTtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RpbWV1cGRhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIHRpbWV1cGRhdGUoc2VsZik7XG4gICAgfSwgZmFsc2UpO1xuXG4gICAgZXZlbnRNYW5hZ2VyLnN1YnNjcmliZSgncGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgc2VsZi5wbGF5ZXIucGxheSgpO1xuICAgIH0pO1xuICAgIGV2ZW50TWFuYWdlci5zdWJzY3JpYmUoJ3BhdXNlJywgZnVuY3Rpb24oKSB7XG4gICAgICBzZWxmLnBsYXllci5wYXVzZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIHZhciBnZXRDdXJyZW50VGltZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQuY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIHNldEN1cnJlbnRUaW1lID0gZnVuY3Rpb24oY3VycmVudFRpbWUpIHtcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRUaW1lID0gY3VycmVudFRpbWU7XG4gIH07XG5cbiAgdmFyIGdldER1cmF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5zdGF0ZS5kdXJhdGlvbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvU3RvcmVzL1ZpZGVvU3RvcmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwidmFyIGV2ZW50TWFuYWdlciA9IHJlcXVpcmUoJy4uL0V2ZW50TWFuYWdlci9QdWJTdWIuanMnKTtcbnZhciBwbGF5QnV0dG9uQWN0aW9ucyA9IHJlcXVpcmUoJy4uL0FjdGlvbnMvUGxheUJ1dHRvbkFjdGlvbnMuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciBzdGF0ZSA9IHtcbiAgICAncGxheWluZyc6IGZhbHNlXG4gIH07XG5cbiAgdmFyIHBsYXlCdXR0b25DbGljayA9IGZ1bmN0aW9uKHNlbGYpIHtcbiAgICBpZiAoc3RhdGUucGxheWluZykge1xuICAgICAgc3RhdGUucGxheWluZyA9IGZhbHNlO1xuICAgICAgcGxheUJ1dHRvbkFjdGlvbnMucHVibGlzaFBhdXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBsYXlCdXR0b25BY3Rpb25zLnB1Ymxpc2hQbGF5KCk7XG4gICAgICBzdGF0ZS5wbGF5aW5nID0gdHJ1ZTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGluaXQgPSBmdW5jdGlvbihidXR0b24pIHtcbiAgICB0aGlzLnBsYXlCdXR0b24gPSBidXR0b247XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHRoaXMucGxheUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgcGxheUJ1dHRvbkNsaWNrKHNlbGYpO1xuICAgIH0sIGZhbHNlKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfTtcblxufSkoKTtcblxuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9zcmMvU3RvcmVzL1BsYXlCdXR0b25TdG9yZS5qc1xuICoqIG1vZHVsZSBpZCA9IDExXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCJ2YXIgZXZlbnRNYW5hZ2VyID0gcmVxdWlyZSgnLi4vRXZlbnRNYW5hZ2VyL1B1YlN1YicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgcHVibGlzaFJlYWR5OiBmdW5jdGlvbihkYXRhKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2goJ3ZpZGVvUmVhZHknLCBkYXRhKTtcbiAgfSxcblxuICBwdWJsaXNoVGljazogZnVuY3Rpb24oZGF0YSkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKCd0aWNrJywgZGF0YSk7XG4gIH1cbn07XG5cblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vc3JjL0FjdGlvbnMvVmlkZW9BY3Rpb25zLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsInZhciBldmVudE1hbmFnZXIgPSByZXF1aXJlKCcuLi9FdmVudE1hbmFnZXIvUHViU3ViLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBwdWJsaXNoUGxheTogZnVuY3Rpb24oKSB7XG4gICAgZXZlbnRNYW5hZ2VyLnB1Ymxpc2goJ3BsYXknKTtcbiAgfSxcblxuICBwdWJsaXNoUGF1c2U6IGZ1bmN0aW9uKCkge1xuICAgIGV2ZW50TWFuYWdlci5wdWJsaXNoKCdwYXVzZScpO1xuICB9XG59O1xuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL3NyYy9BY3Rpb25zL1BsYXlCdXR0b25BY3Rpb25zLmpzXG4gKiogbW9kdWxlIGlkID0gMTVcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJzb3VyY2VSb290IjoiIn0=