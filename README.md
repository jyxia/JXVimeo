## JXVimeo Player
* Written in [Airbnb JavaScript](https://github.com/airbnb/javascript) style
  * Use `jshint` to setup the rules.
* `player.js` is a UMD module.
* Support all features of current Vimeo player.

## Player features
Meets all requirements, including **accessibility** of the player (supports screen reader and keyboard).
* Play/pause, show/hide same as Vimeo player
* Video time, duration, buffered, played same as Vimeo player
* No size restriction to this player. The controls scale.
* :tada: **Scrubbing**
  * matches current Vimeo player's behavior: you can even scrub the progress outside of the player area.
* :tada: **Accessibility**
  * _spacebar_ controls play/pause, _left/right_ arrow key controls fastforward and rewind.
  * screen readers can read player's _playing/buffered_ progress.

## Usage
In your HTML `<script>` tag, include `player.min.js` or `player.js`, and generate a player element by calling function `player(videoLink, width, height)`. `videoLink` is the video file link, `width` is the width you want to give to the player, `height` is the height you want to give to the player.

For example:
```javascript
<script src="./js/player.js"></script>
<script>
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  /* give size here, the video will be adaptive to the video player's size */
  var width = '640px';
  var height = '320px';
  var myPlayer = player(videoLink, width, height);
  /* insert the player's DOM element into document */
  document.getElementsByTagName('body')[0].appendChild(myPlayer.playerContainer);
  /* You can also access to myPlayer's APIs (see below), e.g. myPlayer.play() */
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
Then you can use following APIs to manipulate the video

* `player.video.seek(time)`
* `player.video.play`
* `player.video.pause`
* `player.video.fastForward(steps)`
* `player.video.rewind(steps)`

## Implementation (Pub/Sub pattern)
* Easily manage player's internal events.
* Create custom events for player self.
* Make events logging easily.
* Developed under [`pubsub-pattern` branch](https://github.com/jyxia/JXVimeo/tree/pubsub-pattern).

## Discussions
* By understanding I should only use plain JavaScript for the development, initially, I tried to use React's idea to implement this player because I am a React developer. It turned out that it is not easy to update the UI's states without React's virtual DOM, so I gave up that idea. Then used `Pub/Sub pattern` for this project.
* Due to the limited time, I only implemented the required features plus accessibility considerations. For the future work, (or if I can continue work on it), I would like to:
  * More controls: volume, fullscreen, etc.
  * Show a duration box on the right when screen is small (e.g. phone's size). I noticed this box exists on the phone's screen. I didn't have to time to implement this time, although my player is *responsive*.
  * Once there are more UIs or effects, should use sass/less to code css.
  * Add testing, CI (travis-CI, Jenkins, etc.)
