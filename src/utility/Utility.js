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

  readTime: function(timeInSeconds) {
    var tm = new Date(timeInSeconds * 1000);
    var hours = tm.getUTCHours();
    var minutes = tm.getUTCMinutes();
    var seconds = tm.getUTCSeconds();
    var secondString = ' seconds';
    var minuteString = ' minutes';
    var hourString = ' hours';
    if (seconds <= 1) {
      secondString = ' second';
    }
    if (minutes <= 1) {
      minuteString = ' minute';
    }
    if (hours <= 1) {
      hourString = ' hour';
    }

    if (timeInSeconds < 60) {
      return seconds + secondString;
    } else if (timeInSeconds >= 60 && timeInSeconds < 3600) {
      return minutes + minuteString + ', ' + seconds + secondString;
    } else {
      return hours + hourString + ', ' + minutes + minuteString + ', ' + seconds + secondString;
    }
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
  },

  generateRandomId: function(idLength) {
    var id = '';
    var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 1; i <= idLength; i++) {
        var randPos = Math.floor(Math.random() * charSet.length);
        id += charSet[randPos];
    }
    return id;
  }
};
