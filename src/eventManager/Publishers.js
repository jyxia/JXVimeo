'use strict';
var playerEvents = require('./PlayerEvents');

/**
 * Place all publishers here. It makes logging esay!!
 * All player's HTML elements register publishers here.
 *
 * @param{Object} playButton (HTML element): playpause button
 * @param{Object} progress (HTML element): progress bar
 * @param{Object} video (HTML element): vidoe element
 * @param{Object} playerContainer (HTML element): a container element contains all elements
 */

module.exports = function(eventManager, playButton, progress, video, playerContainer) {
  // playButton publishers
  playButton.addEventListener(playerEvents.play, function() {
    eventManager.publish(playerEvents.play);
  }, false);
  playButton.addEventListener(playerEvents.pause, function() {
    eventManager.publish(playerEvents.pause);
  }, false);
  // progess element publishers
  progress.addEventListener(playerEvents.seek, function(data) {
    eventManager.publish(playerEvents.seek, data.detail);
  }, false);
  // video element publishers
  video.addEventListener(playerEvents.videoReady, function(data) {
    eventManager.publish(playerEvents.videoReady, data.detail);
  }, false);
  video.addEventListener(playerEvents.buffered, function(data) {
    eventManager.publish(playerEvents.buffered, data.detail);
  }, false);
  video.addEventListener(playerEvents.played, function(data) {
    eventManager.publish(playerEvents.played, data.detail);
  }, false);
  video.addEventListener(playerEvents.tick, function(data) {
    eventManager.publish(playerEvents.tick, data.detail);
  }, false);
  video.addEventListener(playerEvents.playing, function() {
    eventManager.publish(playerEvents.playing);
  }, false);
  video.addEventListener(playerEvents.pause, function() {
    eventManager.publish(playerEvents.pause);
  }, false);
  // playerContainer element publishers
  playerContainer.addEventListener(playerEvents.togglePlay, function() {
    eventManager.publish(playerEvents.togglePlay);
  }, false);
  playerContainer.addEventListener(playerEvents.fastForward, function(data) {
    eventManager.publish(playerEvents.fastForward, data.detail);
  }, false);
  playerContainer.addEventListener(playerEvents.rewind, function(data) {
    eventManager.publish(playerEvents.rewind, data.detail);
  }, false);
};
