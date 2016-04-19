var eventManager = require('../EventManager/PubSub.js');

module.exports = {
  publishPlay: function() {
    eventManager.publish('play');
  },

  publishPause: function() {
    eventManager.publish('pause');
  }
};
