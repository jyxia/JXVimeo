## JXVimeo Player
* Written in [Airbnb JavaScript](https://github.com/airbnb/javascript) style
  * Use `jshint` to setup the rules.
* `player.js` is a UMD module.
* Support all features of current Vimeo player.

## Player features
Meets all requirements, including **accessibility** of the player (supports screen reader and keyboard).
* Play/pause, show/hide same as Vimeo player
* Video time, duration, buffered, played same as Vimeo player
* :tada: Scrubbing
  * matches current Vimeo player's behavior: you can even scrub the progress outside of the player.
* :tada: Accessibility
  * _spacebar_ controls play/pause, _left/right_ arrow key controls fastforward and rewind.
  * screen readers can read player's _playing/buffered_ progress.

## Usage
In your HTML `<script>` tag, include `player.min.js` or `player.js`, and generate a player element by calling function `player(videoLink, width, height)`. `videoLink` is the video file link, `width` is the width you want to give to the player, `height` is the height you want to give to the player.

For example:
```javascript
<script src="./js/player.js"></script>
<script>
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  var width = '640px';
  var height = '320px';
  var myPlayer = player(videoLink, width, height);
  /* insert the player element into document */
  document.getElementsByTagName('body')[0].appendChild(myPlayer);
</script>
```

Don't forget to place `style.css` inside `<link rel="stylesheet" >` tag.

## Demo
Open `demo.html` under `public` directory. Or click here: [Demo](http://xiajinyue.info/JXVimeo/demo.html).

## Getting Started
* To develop: `npm start`  
  * Go to 'VimeoPlayer', run `npm install` to install all dev dependencies.
  * here you can see non-minified JavaScript
* Run production: `npm run build`
  * JavaScript minification
  * remove source map
* Or just include `player.js` in `<script>` tag. `player.js` is under `public/js` folder, you must use it together with `style.css` under `public/css`

## Player APIs
```javascript
var player = player(videoLink, width, height);
```
* `player.video.seek(time)`
* `player.video.play`
* `player.video.pause`
* `player.video.fastForward(steps)`
* `player.video.rewind(steps)`

## Implementation
* ###### Pub/Sub pattern

## Discussion
