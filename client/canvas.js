"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ctxMain = exports.W = exports.H = void 0;
exports.draw = draw;
exports.drawImage = drawImage;
exports.fillColorOnAsset = fillColorOnAsset;
exports.getTmpCtx = getTmpCtx;
exports.hpx = void 0;
exports.init = init;
// import { setPetalPosition } from './ui/ui.js';

var canvas; // 主画布
var ctxMain;
exports.ctxMain = ctxMain;
var W, H, hpx;
exports.hpx = hpx;
exports.H = H;
exports.W = W;
function init() {
  // 初始化
  canvas = document.getElementById('canvas');
  exports.ctxMain = ctxMain = canvas.getContext('2d');
  handleWindowResize();
  window.addEventListener('resize', handleWindowResize);
}
function getTmpCtx() {
  var w = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : W;
  var h = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : H;
  // 返回临时画布
  var newCanvas = createCanvas();
  newCanvas.width = w;
  newCanvas.height = h;
  return newCanvas.getContext('2d');
}
function draw(ctx, onCtx) {
  var x = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var y = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  var remove = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
  onCtx.drawImage(ctx.canvas, x, y);
  if (remove) {
    ctx.canvas.remove();
  }
}

// 以指定位置为图像中心绘制图像
function drawImage(ctx, asset, x, y, dir, renderRadius) {
  var alpha = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
  var width = asset.naturalWidth,
    height = asset.naturalHeight;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.rotate(dir);
  if (width <= height) {
    ctx.drawImage(asset, -renderRadius, -renderRadius / width * height, renderRadius * 2, renderRadius / width * height * 2);
  } else {
    ctx.drawImage(asset, -renderRadius / height * width, -renderRadius, renderRadius / height * width * 2, renderRadius * 2);
  }
  ctx.restore();
}

// 先将asset填充为同种颜色，再绘制asset
function fillColorOnAsset(onCtx, asset, rectColor, alpha, x, y, dir, renderRadius) {
  var ctx = getTmpCtx();
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  drawImage(ctx, asset, x, y, dir, renderRadius);
  ctx.globalCompositeOperation = "source-in";
  ctx.globalAlpha = alpha;
  ctx.fillStyle = rectColor;
  var width = asset.naturalWidth,
    height = asset.naturalHeight;
  ctx.translate(x, y);
  ctx.rotate(dir);
  if (width <= height) {
    ctx.fillRect(-renderRadius, -renderRadius / width * height, renderRadius * 2, renderRadius / width * height * 2);
  } else {
    ctx.fillRect(-renderRadius / height * width, -renderRadius, renderRadius / height * width * 2, renderRadius * 2);
  }
  ctx.restore();
  draw(ctx, onCtx);
}
function createCanvas() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  // 创建canvas
  var newCanvas = document.createElement('canvas');
  if (id) {
    newCanvas.id = id;
    document.body.append(newCanvas);
  }
  newCanvas.classList.add('canvas');
  return newCanvas;
}
function handleWindowResize() {
  var devicePixelRatio = window.devicePixelRatio || 1;
  exports.W = W = window.innerWidth * devicePixelRatio;
  exports.H = H = window.innerHeight * devicePixelRatio;
  exports.hpx = hpx = H / 1000;
  setCanvasDimensions(canvas);
}
function setCanvasDimensions(canvas_) {
  canvas_.width = W;
  canvas_.height = H;
  canvas_.style.width = window.innerWidth + "px";
  canvas_.style.height = window.innerHeight + "px";
}