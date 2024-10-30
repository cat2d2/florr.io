"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DynamicNumber = void 0;
exports.copyToClipboard = copyToClipboard;
exports.fillBackground = fillBackground;
exports.getStorage = getStorage;
exports.setStorage = setStorage;
exports.shakeScreen = shakeScreen;
var _canvas = require("./canvas.js");
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var unsecuredCopyWarned = false; // 防止报错刷屏

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    if (!unsecuredCopyWarned) {
      // 不安全复制方法
      console.log('USING UNSECURE COPY METHOD');
      unsecuredCopyWarned = true;
    }
    unsecuredCopyToClipboard(text);
  }
}
var DynamicNumber = /*#__PURE__*/function () {
  function DynamicNumber(value, target, mode, k) {
    _classCallCheck(this, DynamicNumber);
    this.value = value;
    this.target = target;
    this.mode = mode;
    this.k = k;
  }
  _createClass(DynamicNumber, [{
    key: "to",
    value: function to(newTarget) {
      this.isDone = false;
      this.target = newTarget;
    }
  }, {
    key: "get",
    value: function get() {
      if (this.isDone) return this.target;
      if (this.mode == "exp") {
        this.value = this.target - (this.target - this.value) * this.k;
      }
      if (Math.abs(this.value - this.target) < 0.01) this.isDone = true;
      return this.value;
    }
  }, {
    key: "set",
    value: function set(newValue) {
      this.isDone = false;
      this.value = newValue;
    }
  }], [{
    key: "create",
    value: function create(value, target) {
      var k = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.8;
      var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "exp";
      return new DynamicNumber(value, target, mode, k);
    }
  }]);
  return DynamicNumber;
}();
exports.DynamicNumber = DynamicNumber;
function shakeScreen() {
  var duration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var intensity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var startTime = Date.now();
  var canvas = _canvas.ctxMain.canvas;
  function shake() {
    var elapsed = Date.now() - startTime;
    var amplitude = 1 - elapsed / duration;
    var randomX = (Math.random() - 0.5) * 2 * amplitude * intensity;
    var randomY = (Math.random() - 0.5) * 2 * amplitude * intensity;
    canvas.style.transform = "translate(".concat(randomX, "px, ").concat(randomY, "px)");
    if (elapsed < duration) {
      requestAnimationFrame(shake);
    } else {
      canvas.style.transform = 'translateX(0)';
    }
  }
  shake();
}
function unsecuredCopyToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Unable to copy to clipboard', err);
  }
  document.body.removeChild(textArea);
}
function fillBackground(ctx, fillStyle) {
  ctx.fillStyle = fillStyle;
  ctx.fillRect(0, 0, _canvas.W, _canvas.H);
}
function setStorage(key, value) {
  window.localStorage.setItem(key, value);
}
function getStorage(key, preset) {
  var _window$localStorage$;
  return (_window$localStorage$ = window.localStorage.getItem(key)) !== null && _window$localStorage$ !== void 0 ? _window$localStorage$ : preset;
}