## JXVimeo Player
* Written in [Airbnb JavaScript](https://github.com/airbnb/javascript) style
  * used `jshint` to setup the rules.
* `player.js` is a UMD module.

## Getting Started
* Go to 'VimeoPlayer', run `npm install` to install all dev dependencies.
* To start develop mode: `npm start`  
  * here you can see non-minified JavaScript
* Run production: `npm run build`
  * JavaScript minification
  * remove source map

## Usage
In your HTML `<script>` tag, include `player.min.js` or `player.js`, and generate player element by calling function `play(videoLink, width, height)`. `videoLink` is the video file link, `width` is the width you want to give to the player, `height` is the height you want to give to the player.

For example:
```
<script src="./js/player.js"></script>
<script>
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  var width = '800px';
  var height = '450px';
  var player = player(videoLink, width, height);
  /* insert the player element into document */
  document.getElementsByTagName('body')[0].appendChild(player);
</script>
```
## Demo
open `demo.html` under `public` directory.

## Player features
Meets all requirements, including _accessibility_ of the player (supports screen reader and keyboard).
