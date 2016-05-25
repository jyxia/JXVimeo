## JXVimeo Player
* `player.js` is a UMD library which can be universally reused. It is a `jQuery widget`-like development, but only use vanilla JavaScript code.
* The `player` instance is an self-contained HTML component (widget). All you need to do is to create a `player` instance and insert it to the HTML document (e.g. inside a `<div>` block). `player` can be recreated multiple times event on the same page.
* Support all features of current Vimeo video player (mainly play/pause and the progress bar).
* Written in [Airbnb JavaScript](https://github.com/airbnb/javascript) style
  * Use `jshint` to setup the rules. See `.jshinrc`. Official Airbnb [.jshintrc](https://github.com/airbnb/javascript/blob/master/linters/.jshintrc).

## Player features (please test all)
Meets all requirements, including **accessibility** of the player (supports screen reader and keyboard events).
* :white_check_mark: UI looks same as Vimeo video player.
* :white_check_mark: Video controls are components in the player. Actually, the controls element is a `div` wrapper that wraps everything.
* :white_check_mark: Play/pause functions as same as Vimeo video player. Clicking video itself toggles play/pause too.
* :white_check_mark: Video states (Video time, duration, buffered and played) are displayed as same as Vimeo player
* :white_check_mark: Show/hide effects match Vimeo Player's default effects. e.g. if the mouse stays still on top of the video for a short amount of time, the control bar fades away.
* :white_check_mark: No size restriction to this player. The controls scale and adapts to its container.
* :white_check_mark::tada: **Scrubbing**
  * matches current Vimeo player's behaviors: you can even scrub the progress outside of the player area.
* :white_check_mark::tada: **Accessibility**
  * __spacebar__ controls play/pause, __left/right__ arrow key controls fastforward and rewind, etc.
  * screen readers can read player's _playing/buffered_ progress, _play/pause_ button status, etc.

## Usage
In your HTML `<script>` tag, include `player.min.js` or `player.js` (under [`public/js`](https://github.com/jyxia/JXVimeo/tree/master/public) directory), and instantiate a player instance  `new Player(videoLink, width, height)`. `videoLink` is the video file link, `width` is the width you want to give to the player, `height` is the height you want to give to the player.

For example:
```javascript
<script src="./js/player.js"></script>
<script>
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  // You can actually assign any size to the player. The video player has a adaptive design.
  var width = '640px';
  var height = '320px';
  // Get a player object `myPlayer`
  var myPlayer = new Player(videoLink, width, height);
  // Now, insert myPlayer's DOM element into document's body.
  // In fact, you can append it anywhere, e.g. a <div> block
  document.getElementsByTagName('body')[0].appendChild(myPlayer.playerContainer);
  // Now, you can also access to myPlayer's APIs (see below) to manipulate the video, e.g. myPlayer.play()
</script>
```

Lastly, don't forget to place `style.css`(under [`public/css`](https://github.com/jyxia/JXVimeo/tree/master/public) directory) inside `<link rel="stylesheet" >` tag.

So, just 5 lines of code, not bad, right? Give it a try! Any questions? Contact me.

## Demo
Open `demo.html` and `demo2.html` under [`public`](https://github.com/jyxia/JXVimeo/tree/master/public) directory. Or click here:
* [Demo1](http://xiajinyue.info/JXVimeo/demo.html).
* [Demo2](http://xiajinyue.info/JXVimeo/demo2.html).
  * [Demo2](http://xiajinyue.info/JXVimeo/demo2.html) illustrates the example when the page has two players (you can have more than two). Like [Vimeo](https://vimeo.com), when there are multiple videos existing on the same page, if one video is playing, the rest videos should be paused on the page. Demo2 exactly implemented this feature. :sparkles::tada:

In `demo.html` You can see there is no content inside the HTML `<body>`, `player.js` takes cares of placing the player on your page.   

## Start development
* Go to 'VimeoPlayer', run `npm install` to install all dev dependencies.
* To develop: `npm start`  
* Run production: `npm run build`

## Tested Browsers
* Chrome v50.0
* Firefox v45.0.2
* Safari v9.1
* Internet Explorer v11.0
Use `auto-prefixer` to handle css prefixes for different browsers.

## Player APIs
```javascript
var myPlayer = new Player(videoLink, width, height);
```
Then you can use following APIs to manipulate the video

* `myPlayer.video.seek(time)`
* `myPlayer.video.play()`
* `myPlayer.video.pause()`
* `myPlayer.video.fastForward(steps)`
* `myPlayer.video.rewind(steps)`
* `myPlayer.video.isPlaying()`
* to be continued...

You can also listen the player's event, e.g.

* `playing` - `myPlayer.playerContainer.addEventListener('playing', callback)`

## Implementation (Pub/Sub pattern)
* Easily manage player's internal events.
* Able to create custom events for the player self.
* Make events **logging** easily.
* Lightweight.
* Development is under [pubsub-pattern branch](https://github.com/jyxia/JXVimeo/tree/pubsub-pattern).
  * Used `feature branch` -> `develop` git workflow.

## Discussions & Future work
* Initially, I tried to use `React`'s idea to implement this player because I am a React developer. It turned out that it is not easy to update the UI's states without React's virtual DOMs, so I gave up that idea. Then I used `Pub/Sub pattern` for this project.
* You can see my development process by looking at my commits.
* By now, I only implemented the required features plus accessibility considerations. For the future work, (or if I can continue working on it), I would like to:
  * Add more controls: volume, fullscreen, etc.
  * Show a duration box on the right when screen is small (e.g. phone's size). I noticed this box exists on the phone's screen. I didn't have time to implement this time, although my player is actually *adaptive* to the container's size.
  * Use sass/less to code css. Once there are more UIs or effects, plain css becomes less manageable.
  * Add testing, CI (travis-CI, Jenkins, etc.)
  * ...
