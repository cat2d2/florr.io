"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.play = play;
exports.stop = stop;
var fps = 60;
var now, then, elapsed;
var fpsInterval;
var renderFn;
var playing = false;
var animationFrameID;
function play(renderFunction) {
  var fixed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  renderFn = renderFunction;
  if (!playing) {
    playing = true;
    then = Date.now();
    fpsInterval = 1000 / fps;
    if (fixed) animateFixed(renderFn);else animate(renderFn);
  }
}
function stop() {
  cancelAnimationFrame(animationFrameID);
}
function animate() {
  animationFrameID = requestAnimationFrame(animate);
  renderFn();
}
function animateFixed() {
  animationFrameID = requestAnimationFrame(animateFixed);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - elapsed % fpsInterval;
    renderFn();
  }
}