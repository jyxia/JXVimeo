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
