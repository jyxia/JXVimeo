var playerContainer = require('./components/PlayerContainer');

var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';

document.getElementsByTagName('body')[0].appendChild(playerContainer(videoLink));
