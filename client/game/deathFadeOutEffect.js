"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDiedEntities = addDiedEntities;
exports.renderDiedEntities = renderDiedEntities;
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var diedEntities = [];
function addDiedEntities(entities) {
  entities.forEach(function (entity) {
    diedEntities.push([entity, 1, 1]);
  });
}
function renderDiedEntities(me) {
  var ctx = getCtx(mobLayer);
  diedEntities.forEach(function (_ref, index) {
    var _ref2 = _slicedToArray(_ref, 3),
      entity = _ref2[0],
      alpha = _ref2[1],
      size = _ref2[2];
    ctx.globalAlpha = alpha;
    var sz = entity.size * size;
    diedEntities[index][1] *= 0.75;
    diedEntities[index][2] *= 1.05;
    if (diedEntities[index][1] <= 0.05) {
      diedEntities.splice(index, 1);
      return;
    }
    entity.x += Math.cos(entity.vdir) * (10 / Constants.TICK_PER_SECOND);
    entity.y += Math.sin(entity.vdir) * (10 / Constants.TICK_PER_SECOND);
    var x = W / 2 + (entity.x - me.x) * hpx;
    var y = H / 2 + (entity.y - me.y) * hpx;
    var asset;
    if (entity.type == "player") {
      asset = getAsset("".concat(entity.type.toLowerCase(), ".svg"));
      // entity.size *= 0.25;
      // entity.x += entity.size;
      // entity.y += entity.size;
    } else if (entity.isMob) {
      asset = getAsset("mobs/".concat(entity.type.toLowerCase(), ".svg"));
    } else {
      asset = getAsset("petals/".concat(entity.type.toLowerCase(), ".svg"));
    }
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(entity.dir);
    var width = asset.naturalWidth,
      height = asset.naturalHeight;
    ctx.drawImage(asset, -sz, -sz / width * height, sz * 2, sz / width * height * 2);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}