// require('!style!css!./css/style.css');
'use strict';
var playerContainer = require('./elements/PlayerContainerElement');

module.exports = (function() {
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  var player = playerContainer.init(videoLink);
  document.getElementsByTagName('body')[0].appendChild(player);
})();
