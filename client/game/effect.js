"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderLightningPath = renderLightningPath;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var lightningPaths = [];
function renderLightningPath(newPaths, me) {
  newPaths.forEach(function (path) {
    lightningPaths.push([path, 1]);
  });
  var ctx = getCtx(effectLayer);
  ctx.lineWidth = 1 * hpx;
  ctx.strokeStyle = "White";
  lightningPaths.forEach(function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 2),
      path = _ref2[0],
      alpha = _ref2[1];
    ctx.globalAlpha = alpha;
    lightningPaths[index][1] -= 0.05;
    if (lightningPaths[index][1] <= 0) {
      lightningPaths.splice(index, 1);
      return;
    }
    ctx.beginPath();
    var oldx = W / 2 + (path[0].x - me.x) * hpx;
    var oldy = H / 2 + (path[0].y - me.y) * hpx;
    ctx.moveTo(oldx, oldy);
    path.forEach(function (position) {
      var x = W / 2 + (position.x - me.x) * hpx;
      var y = H / 2 + (position.y - me.y) * hpx;
      ctx.lineTo((oldx + x) / 2 + random(-70, 70) * hpx, (oldy + y) / 2 + random(-70, 70) * hpx);
      ctx.lineTo(x, y);
      oldx = W / 2 + (position.x - me.x) * hpx;
      oldy = H / 2 + (position.y - me.y) * hpx;
    });
    ctx.closePath();
    ctx.stroke();
  });
}