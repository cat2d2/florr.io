"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderBackground = renderBackground;
var canvas = _interopRequireWildcard(require("../../canvas.js"));
var _main = require("../main.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function renderBackground(ctx, x, y, mspt) {
  var u = canvas.hpx / _main.vision;
  var gridInterval = u * 50;
  var startX = (canvas.W / 2 - x * u) % gridInterval;
  var startY = (canvas.H / 2 - y * u) % gridInterval;
  var gridLineWidth = u * 0.5;
  ctx.fillStyle = "rgb(28, 154, 89)";
  ctx.fillRect(0, 0, canvas.W, canvas.H);
  ctx.fillStyle = "rgb(30, 167, 97)";
  ctx.fillRect(canvas.W / 2 - x * u, canvas.H / 2 - y * u, _main.settings.map_width * u, _main.settings.map_height * u);
  var gridLineStyle = "rgba(0, 0, 0, 0.3)";
  for (var ix = startX; ix < canvas.W; ix += gridInterval) {
    ctx.beginPath();
    ctx.moveTo(ix, 0);
    ctx.lineTo(ix, canvas.H);
    ctx.strokeStyle = gridLineStyle;
    ctx.lineWidth = gridLineWidth;
    ctx.stroke();
    ctx.closePath();
  }
  for (var iy = startY; iy < canvas.H; iy += gridInterval) {
    ctx.beginPath();
    ctx.moveTo(0, iy);
    ctx.lineTo(canvas.W, iy);
    ctx.strokeStyle = gridLineStyle;
    ctx.lineWidth = gridLineWidth;
    ctx.stroke();
    ctx.closePath();
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.font = "".concat(10 * u, "px PT-sans");
  ctx.textAlign = 'center';
  ctx.fillText(mspt, canvas.W - 10 * u, canvas.H - 10 * u);

  // canvas.draw(ctx, canvas.ctxMain);
}