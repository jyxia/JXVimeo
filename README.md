## JXVimeo Player
* `player.js` is a UMD module. A library can be universally reused. It is a `jQuery widget`-like development.
* The `player` instance is an self-contained HTML component (widget). All you need to do is to create a `player` instance and insert it to the HTML document (e.g. inside a `<div>` block).
* Support all features of current Vimeo player (mainly play/pause and the progress bar).
* Written in [Airbnb JavaScript](https://github.com/airbnb/javascript) style
  * Use `jshint` to setup the rules. See `.jshinrc`

## Player features (please test all)
Meets all requirements, including **accessibility** of the player (supports screen reader and keyboard events).
* :white_check_mark: UI looks same as Vimeo player.
* :white_check_mark: Video controls are self contained. Actually, the controls element a `div` wrapper that wraps everything.
* :white_check_mark: Play/pause functions as same as Vimeo player. Clicking video itself toggles play/pause too.
* :white_check_mark: Video states (Video time, duration, buffered and played) are displayed as same as Vimeo player
* :white_check_mark: Show/hide effects match Vimeo Player's default effects. e.g. if the mouse stays still on top of the video for a short amount of time, the control bar goes away.
* :white_check_mark: No size restriction to this player. The controls scale.
* :white_check_mark::tada: **Scrubbing**
  * matches current Vimeo player's behaviors: you can even scrub the progress outside of the player area.
* :white_check_mark::tada: **Accessibility**
  * __spacebar__ controls play/pause, __left/right__ arrow key controls fastforward and rewind, etc.
  * screen readers can read player's _playing/buffered_ progress, _play/pause_ button status, etc.

## Usage
In your HTML `<script>` tag, include `player.min.js` or `player.js` (under [`public/js`](https://github.com/jyxia/JXVimeo/tree/master/public) directory), and generate a player instance by calling function `player(videoLink, width, height)`. `videoLink` is the video file link, `width` is the width you want to give to the player, `height` is the height you want to give to the player.

For example:
```javascript
<script src="./js/player.js"></script>
<script>
  var videoLink = 'https://player.vimeo.com/external/76979871.hd.mp4?s=700bf8f30f8f8114cc372e94c4156aaf&profile_id=113';
  // You can actually assign any size to the player. The video player has a responsive design.
  var width = '640px';
  var height = '320px';
  // Get a player object `myPlayer`
  var myPlayer = player(videoLink, width, height);
  // Now, insert myPlayer's DOM element into document's body.
  // In fact, you can append it anywhere, e.g. a <div> block
  document.getElementsByTagName('body')[0].appendChild(myPlayer.playerContainer);
  // Now, you can also access to myPlayer's APIs (see below) to manipulate the video, e.g. myPlayer.play()
</script>
```

Lastly, don't forget to place `style.css`(under [`public/css`](https://github.com/jyxia/JXVimeo/tree/master/public) directory) inside `<link rel="stylesheet" >` tag.

So, just 5 lines of code, not bad, right? Give it a try! Any questions? Contact me.

## Demo
Open `demo.html` under [`public`](https://github.com/jyxia/JXVimeo/tree/master/public) directory. Or click here: [Demo](http://xiajinyue.info/JXVimeo/demo.html).
* You can see there is no content inside the HTML `<body>`, `player.js` takes cares of placing the player on your page.   

## Start development
* Go to 'VimeoPlayer', run `npm install` to install all dev dependencies.
* To develop: `npm start`  
* Run production: `npm run build`

## Tested Browsers
* Chrome v50.0
* Firefox v45.0.2
* Safari v9.1
* Internet Explorer v11.0

## Player APIs
```javascript
var myPlayer = player(videoLink, width, height);
```
Then you can use following APIs to manipulate the video

* `myPlayer.video.seek(time)`
* `myPlayer.video.play()`
* `myPlayer.video.pause()`
* `myPlayer.video.fastForward(steps)`
* `myPlayer.video.rewind(steps)`
* to be continued...

## Implementation (Pub/Sub pattern)
* Easily manage player's internal events.
* Able to create custom events for the player self.
* Make events logging easily.
* Lightweight.
* Development is under [pubsub-pattern branch](https://github.com/jyxia/JXVimeo/tree/pubsub-pattern).
  * Used `feature branch` -> `develop` git workflow.

## Discussions
* By understanding the requirement, I should only use plain JavaScript for the development. Initially, I tried to use `React`'s idea to implement this player because I am a React developer. It turned out that it is not easy to update the UI's states without React's virtual DOMs, so I gave up that idea. Then I used `Pub/Sub pattern` for this project.
* You can see my development process by looking at my commits.
* Due to the limited time, I only implemented the required features plus accessibility considerations. For the future work, (or if I can continue working on it), I would like to:
  * Add more controls: volume, fullscreen, etc.
  * Show a duration box on the right when screen is small (e.g. phone's size). I noticed this box exists on the phone's screen. I didn't have time to implement this time, although my player is actually *responsive*.
  * Use sass/less to code css. Once there are more UIs or effects, plain css becomes less manageable.
  * Add testing, CI (travis-CI, Jenkins, etc.)
  * ...
