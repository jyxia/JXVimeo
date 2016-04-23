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
