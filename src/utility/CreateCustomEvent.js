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

require('./Polyfill');

module.exports = function(eventName, data) {
  if (data) {
    return new CustomEvent(eventName, {
      'detail': data
    });
  }

  return new Event(eventName);
};
