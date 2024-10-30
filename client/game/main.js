"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGameSettings = initGameSettings;
exports.settings = void 0;
exports.startRenderGame = startRenderGame;
exports.stopRenderGame = stopRenderGame;
exports.vision = void 0;
var util = _interopRequireWildcard(require("../utility.js"));
var _state = require("../state.js");
var _background = require("./render/background.js");
var _player = require("./render/player.js");
var _petal = require("./render/petal.js");
var canvas = _interopRequireWildcard(require("../canvas.js"));
var entityAnim = _interopRequireWildcard(require("./render/entityAnimation.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var settings;
exports.settings = settings;
var animationFrameRequestID;
var vision = 1; // 视距
exports.vision = vision;
function initGameSettings(settings_) {
  // 游戏开始时获取的游戏设定信息
  exports.settings = settings = settings_;
}
function startRenderGame() {
  // 开始游戏
  animationFrameRequestID = requestAnimationFrame(render);
}
function render() {
  var state = (0, _state.getCurrentState)();
  if (state.self) {
    // 创建不同图层
    var backgroundCtx = canvas.getTmpCtx();
    var playerCtx = canvas.getTmpCtx();
    var petalCtx = canvas.getTmpCtx();
    exports.vision = vision = state.self.vision;
    (0, _background.renderBackground)(backgroundCtx, state.self.x, state.self.y, state.mspt);
    (0, _player.renderPlayer)(playerCtx, state.self, state.self);

    // 自己受伤了就抖动屏幕
    if (state.self.isHurt) util.shakeScreen(200, 2);
    state.entities.forEach(function (e) {
      if (e.type == 'player') {
        (0, _player.renderPlayer)(playerCtx, state.self, e);
      } else if (e.type == 'petal') {
        (0, _petal.renderPetal)(petalCtx, state.self, e);
      }
    });
    entityAnim.setNewEntitiesList();

    // 按顺序渲染不同图层
    canvas.draw(backgroundCtx, canvas.ctxMain);
    canvas.draw(petalCtx, canvas.ctxMain);
    canvas.draw(playerCtx, canvas.ctxMain);
  }
  animationFrameRequestID = requestAnimationFrame(render);
}
function stopRenderGame() {
  cancelAnimationFrame(animationFrameRequestID);
}