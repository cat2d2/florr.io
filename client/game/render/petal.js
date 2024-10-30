"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPetal = renderPetal;
var canvas = _interopRequireWildcard(require("../../canvas.js"));
var _assets = require("../../assets.js");
var entityAnim = _interopRequireWildcard(require("./entityAnimation.js"));
var _main = require("../main.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function renderPetal(ctx, self, petal) {
  var u = canvas.hpx / _main.vision;
  var x = petal.x,
    y = petal.y;
  var asset = (0, _assets.getAssetByEntity)(petal);
  var canvasX = canvas.W / 2 + (x - self.x) * u;
  var canvasY = canvas.H / 2 + (y - self.y) * u;
  var renderRadius = petal.attr.radius * u;
  entityAnim.recordEntity(petal);
  canvas.drawImage(ctx, asset, canvasX, canvasY, petal.attr.dir, renderRadius);
  var attributes = entityAnim.getEntityRenderAttributes(petal);
  if (attributes.color.cover != "none") {
    var color = attributes.color.cover;
    var alpha = petal.attr.ghost ? 0.2 : attributes.color.alpha.get();
    canvas.fillColorOnAsset(ctx, asset, color, alpha, canvasX, canvasY, petal.attr.dir, renderRadius);
    return;
  }

  //canvas.drawImage(ctx, asset, canvasX, canvasY, petal.attr.dir, renderRadius, alpha);

  // ctx.beginPath();
  // ctx.arc(0, 0, petal.attr.radius, 0, 2 * Math.PI);
  // ctx.moveTo(0, 0);
  // ctx.lineTo(petal.attr.radius, 0);
  // ctx.closePath();
  // ctx.strokeStyle = '#78fffa';
  // ctx.lineWidth = u * 1;
  // ctx.stroke();

  // canvas.draw(ctx, canvas.ctxMain);
}