'use strict';
var playerEvents = require('./PlayerEvents');

/**
 * Place all subscribers here. It also makes logging esay.
 * All customized objects register subscribers here.
 *
 * @param{PlayButton} playButton
 * @param{ProgressBar} progress
 * @param{Video} video
 */

module.exports = function(eventManager, playButton, progress, video) {
  // video component subscribers
  eventManager.subscribe(playerEvents.play, function() {
    video.play();
  });
  eventManager.subscribe(playerEvents.pause, function() {
    video.pause();
  });
  eventManager.subscribe(playerEvents.seek, function(data) {
    video.seek(data.currentTime);
  });
  eventManager.subscribe(playerEvents.togglePlay, function() {
    video.togglePlay();
  });
  eventManager.subscribe(playerEvents.fastForward, function(data) {
    video.fastForward(data.steps);
  });
  eventManager.subscribe(playerEvents.rewind, function(data) {
    video.rewind(data.steps);
  });
  // progress component subscribers
  eventManager.subscribe(playerEvents.videoReady, function(data) {
    progress.updateDuration(data);
  });
  eventManager.subscribe(playerEvents.playing, function() {
    progress.receivePlaying(playerEvents.playing);
  });
  eventManager.subscribe(playerEvents.buffered, function(data) {
    progress.updateBufferedProgress(data);
  });
  eventManager.subscribe(playerEvents.played, function(data) {
    progress.updatePlayedProgress(data);
  });
  eventManager.subscribe(playerEvents.tick, function(data) {
    progress.updateTick(data);
  });
  // playButton component subscribers
  eventManager.subscribe(playerEvents.playing, function() {
    playButton.togglePlay(playerEvents.playing);
  });
  eventManager.subscribe(playerEvents.pause, function() {
    playButton.togglePlay(playerEvents.pause);
  });
};
