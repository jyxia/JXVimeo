// require('!style!css!./css/style.css');
'use strict';

module.exports = (function() {
  var playerContainer = require('./elements/PlayerContainerElement');
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  // var videoLink = '/Applications/MAMP/htdocs/videocollaboratory/optimizedVideos/vc-543-2.mp4';
  var player = playerContainer.init(videoLink);
  document.getElementsByTagName('body')[0].appendChild(player);
})();
