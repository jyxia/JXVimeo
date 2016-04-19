var eventManager = require('../EventManager/PubSub');

module.exports = {
  publishReady: function(data) {
    eventManager.publish('videoReady', data);
  },

  publishTick: function(data) {
    eventManager.publish('tick', data);
  }
};
