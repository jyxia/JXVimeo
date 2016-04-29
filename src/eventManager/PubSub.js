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
