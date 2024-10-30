"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderPlayer = renderPlayer;
var canvas = _interopRequireWildcard(require("../../canvas.js"));
var _assets = require("../../assets.js");
var entityAnim = _interopRequireWildcard(require("./entityAnimation.js"));
var _main = require("../main.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var teamColor = ['#ff9c9c', '#a1d0ff', '#fff7a1', '#aaffa1', '#b3ffe2', '#ffbfea', '#f3bfff', '#ffc799'];
function renderPlayer(ctx, self, player) {
  var u = canvas.hpx / _main.vision;
  var x = player.x,
    y = player.y;
  var asset = (0, _assets.getAssetByEntity)(player);
  var canvasX = canvas.W / 2 + (x - self.x) * u;
  var canvasY = canvas.H / 2 + (y - self.y) * u;
  var renderRadius = player.attr.radius * u;
  ctx.save();
  (function () {
    // 玩家本体
    (function () {
      //如果玩家是 ghost 状态，设置本体透明度
      if (player.attr.ghost) {
        canvas.drawImage(ctx, asset, canvasX, canvasY, player.attr.dir, renderRadius, 0.2);
        return;
      }
      entityAnim.recordEntity(player);
      updateAnimation(player);
      canvas.drawImage(ctx, asset, canvasX, canvasY, player.attr.dir, renderRadius);
      var attributes = entityAnim.getEntityRenderAttributes(player);
      if (attributes.color.cover != "none") {
        var color = attributes.color.cover;
        var alpha = player.attr.ghost ? 0.2 : attributes.color.alpha.get();
        canvas.fillColorOnAsset(ctx, asset, color, alpha, canvasX, canvasY, player.attr.dir, renderRadius);
      }
    })();
    ctx.translate(canvasX, canvasY);

    // 玩家用户名
    ctx.save();
    (function () {
      if (player.attr.ghost) {
        // ghost 状态 用户名半透明
        ctx.globalAlpha = 0.5;
      }
      ctx.fillStyle = teamColor[player.team];
      ctx.font = "".concat(20 * u, "px PT-sans");
      ctx.textAlign = 'center';
      ctx.fillText(player.username, 0, -player.attr.radius * 1.25 * u);
    })();
    ctx.restore();
    if (!player.attr.ghost) {
      // ghost 状态不显示血条
      healthBar(ctx, player);
    }
  })();
  ctx.restore();
}
function healthBar(ctx, player) {
  // 渲染血条
  var u = canvas.hpx / _main.vision;

  // 玩家半径（用于决定血条长度）
  var renderRadius = player.attr.radius * u;

  // 底色
  var baseWidth = renderRadius * 0.5 * u;
  var baseStyle = 'rgb(51, 51, 51)';
  var baseLength = (renderRadius * 2 + 20) * u;

  // 血条
  var outline = u * 3;
  var width = baseWidth - outline;
  var styleNormal = 'rgb(117, 221, 52)';
  var styleHurt = 'rgb(221, 52, 52)';
  var length = baseLength * Math.max(0, player.attr.hp) / player.attr.max_hp;
  ctx.beginPath();
  ctx.lineWidth = baseWidth;
  ctx.moveTo(-baseLength / 2, u * 45);
  ctx.lineTo(+baseLength / 2, u * 45);
  ctx.strokeStyle = baseStyle;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.moveTo(-baseLength / 2, u * 45);
  ctx.lineTo(-baseLength / 2 + length, u * 45);
  ctx.strokeStyle = styleNormal;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.closePath();
}
function updateAnimation(player) {
  // 更新动画
  if (player.isHurt) {
    entityAnim.play(player, "hurt");
  } else if (player.effects.poison.duration > 0) {
    entityAnim.play(player, "poison");
  } else if (player.effects.heal_res.duration > 0) {
    entityAnim.play(player, "heal_res");
  }
}