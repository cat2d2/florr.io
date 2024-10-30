"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startCapturingInput = startCapturingInput;
exports.stopCapturingInput = stopCapturingInput;
var nw = _interopRequireWildcard(require("./networking.js"));
var _constants = _interopRequireDefault(require("../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function onMouseMove(e) {
  var dpr = window.devicePixelRatio;
  var x = e.clientX,
    y = e.clientY;
  var w = window.innerWidth,
    h = window.innerHeight;
  var dir = Math.atan2(y - h / 2, x - w / 2);
  var dx = x - w / 2,
    dy = y - h / 2;
  var d = Math.sqrt(dx * dx + dy * dy); // 鼠标到屏幕中心的距离
  var maxd = 100; // power 为 100 时的距离
  var power = Math.min(maxd, d) / maxd; // [0, 1] 范围内的值，为玩家速度乘数
  var input = {
    dir: dir,
    power: power
  };
  // type 0
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.GAME.INPUT, 0, input);
}
function onMouseDown(e) {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.GAME.INPUT, 1, e.buttons & 3);
}
function onMouseUp(e) {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.GAME.INPUT, 1, e.buttons & 3);
}
function onKeyDown(e) {
  // render.broadcast('key_down', e);
}
function onKeyUp() {}
function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}
function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}