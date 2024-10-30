"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Petal = void 0;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var petalSwing = Math.PI * 0.03;
var Petal = /*#__PURE__*/function () {
  // ui里的物品栏里的花瓣
  function Petal(x, y, type) {
    _classCallCheck(this, Petal);
    this.x = x;
    this.y = y;
    this.dir = 0;
    this.swing = false;
    this.size = 1;
    this.targetX = x;
    this.targetY = y;
    this.defaultX = x;
    this.defaultY = y;
    this.targetSize = 1;
    this.type = type;
    this.animating = false;
  }
  _createClass(Petal, [{
    key: "setTargetPos",
    value: function setTargetPos(x, y) {
      this.targetX = x;
      this.targetY = y;
    }
  }, {
    key: "setTargetSize",
    value: function setTargetSize(size) {
      this.targetSize = size;
    }
  }, {
    key: "setType",
    value: function setType(type) {
      this.type = type;
    }
  }, {
    key: "render",
    value: function render(length) {
      if (this.type != 'NONE') {
        var followSpeed = 0.2;
        this.x += (this.targetX - this.x) * followSpeed;
        if (Math.abs(this.targetX - this.x) < 0.5) {
          this.x = this.targetX;
        }
        this.y += (this.targetY - this.y) * followSpeed;
        if (Math.abs(this.targetY - this.y) < 0.5) {
          this.y = this.targetY;
        }
        if (this.animating) {
          if (this.x == this.targetX && this.x == this.defaultX && this.y == this.targetY && this.y == this.defaultY && !this.swing && this.dir == 0) {
            this.animating = false;
          }
        }
        this.size += (this.targetSize - this.size) * 0.3;
        if (Math.abs(this.targetSize - this.size) < 0.02) {
          this.size = this.targetSize;
        }
        if (this.swing) {
          if (petalSwing > this.dir) {
            this.dir += Math.min(0.015, Math.min(petalSwing - this.dir, this.dir + petalSwing) * 0.25);
          } else {
            this.dir += Math.max(-0.015, Math.max(petalSwing - this.dir, this.dir + petalSwing) * 0.25);
          }
          if (Math.abs(petalSwing - this.dir) < 0.01) {
            petalSwing = -petalSwing;
          }
        } else {
          this.dir -= this.dir * 0.1;
          if (Math.abs(this.dir) < 0.001) {
            this.dir = 0;
          }
        }
        var petalAlpha = 0.88;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.dir);
        ctx.globalAlpha = petalAlpha;
        var displayLength = length * this.size;
        var outlineWidth = displayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
        renderRoundRect(-displayLength / 2 - outlineWidth, -displayLength / 2 - outlineWidth, displayLength + outlineWidth * 2, displayLength + outlineWidth * 2, hpx * 1, true, true, true, true);
        ctx.strokeStyle = Constants.RARITY_COLOR_DARKEN[PetalAttributes[this.type].RARITY];
        ctx.lineWidth = outlineWidth * 2;
        if (this.type == "EMPTY") {
          ctx.globalAlpha = 0;
          petalAlpha = 0;
        }
        ;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
        ctx.stroke();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillRect(-displayLength / 2, -displayLength / 2, displayLength, displayLength);
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = Constants.RARITY_COLOR[PetalAttributes[this.type].RARITY];
        ctx.fillRect(-displayLength / 2, -displayLength / 2, displayLength, displayLength);
        ctx.globalCompositeOperation = 'destination-out';
        var renderRadius = displayLength * 0.2;
        var asset = getAsset("petals/".concat(this.type.toLowerCase(), ".svg"));
        var width = asset.naturalWidth,
          height = asset.naturalHeight;
        var offset = displayLength * 0.08;
        var offsetX = 0,
          offsetY = 0;
        if (PetalAttributes[this.type].MULTIPLE) {
          var baseAngle = Math.PI / 2;
          for (var i = 0; i < PetalAttributes[this.type].COUNT; i++) {
            offsetX = (renderRadius + 1) * Math.sin(baseAngle + i / PetalAttributes[this.type].COUNT * 2 * Math.PI);
            offsetY = (renderRadius + 1) * Math.cos(baseAngle + i / PetalAttributes[this.type].COUNT * 2 * Math.PI);
            if (width <= height) {
              ctx.drawImage(asset, -renderRadius + offsetX, -renderRadius / width * height - offset + offsetY, renderRadius * 2, renderRadius / width * height * 2);
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(asset, -renderRadius + offsetX, -renderRadius / width * height - offset + offsetY, renderRadius * 2, renderRadius / width * height * 2);
            } else {
              ctx.drawImage(asset, -renderRadius / height * width + offsetX, -renderRadius - offset + offsetY, renderRadius / height * width * 2, renderRadius * 2);
              ctx.globalCompositeOperation = 'source-over';
              ctx.drawImage(asset, -renderRadius / height * width + offsetX, -renderRadius - offset + offsetY, renderRadius / height * width * 2, renderRadius * 2);
            }
          }
        } else {
          if (width <= height) {
            ctx.drawImage(asset, -renderRadius + offsetX, -renderRadius / width * height - offset + offsetY, renderRadius * 2, renderRadius / width * height * 2);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(asset, -renderRadius + offsetX, -renderRadius / width * height - offset + offsetY, renderRadius * 2, renderRadius / width * height * 2);
          } else {
            ctx.drawImage(asset, -renderRadius / height * width + offsetX, -renderRadius - offset + offsetY, renderRadius / height * width * 2, renderRadius * 2);
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(asset, -renderRadius / height * width + offsetX, -renderRadius - offset + offsetY, renderRadius / height * width * 2, renderRadius * 2);
          }
        }
        var name = this.type.toLowerCase();
        var textOffset = displayLength * 0.35;
        var textFont = displayLength * 0.25;
        ctx.globalCompositeOperation = 'destination-out';
        renderText(petalAlpha, name.charAt(0).toUpperCase() + name.slice(1), 0, textOffset, textFont, 'center');
        ctx.globalCompositeOperation = 'source-over';
        renderText(petalAlpha, name.charAt(0).toUpperCase() + name.slice(1), 0, textOffset, textFont, 'center');
        ctx.rotate(-this.dir);
        ctx.translate(-this.x, -this.y);
        ctx.globalAlpha = 1;
      }
    }
  }]);
  return Petal;
}();
exports.Petal = Petal;