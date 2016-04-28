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
