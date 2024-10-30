"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _constants = _interopRequireDefault(require("../../../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Entity = /*#__PURE__*/function () {
  function Entity(id, x, y, team, generalType, type, hp, maxHp, noBorderCollision) {
    _classCallCheck(this, Entity);
    this.id = id;
    this.x = x;
    this.y = y;
    this.team = team;
    this.generalType = generalType;
    this.type = type;
    this.hp = hp;
    this.maxHp = maxHp;
    this.store = 0;
    this.direction = 0;
    this.hurtByInfo = {
      type: -1,
      id: -1
    };
    this.isHurt = false;
    this.velocity = {
      x: 0,
      y: 0
    };
    this.constraintVelocity = {
      x: 0,
      y: 0
    };
    this.chunks = [];
    this.noBorderCollision = noBorderCollision;
    this.movement = {
      direction: 0,
      speed: 0
    };
    this.puncture = 0;
    this.fragile = 0;
    this.direction = 0;
    this.skillCoolDown = 0;
    this.skillCoolDownTimer = 0;
    this.poison = 0;
    this.poisonTime = 0;
    this.segments = [this.id];
  }
  _createClass(Entity, [{
    key: "distanceTo",
    value: function distanceTo(object) {
      var deltaX = this.x - object.x;
      var deltaY = this.y - object.y;
      return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }
  }, {
    key: "handleBorder",
    value: function handleBorder(objectRadius) {
      if (!this.noBorderCollision) {
        if (this.x < objectRadius) {
          // hit left border
          this.velocity.x = 0;
          this.x = objectRadius;
        } else if (this.x > _constants["default"].MAP_WIDTH - objectRadius) {
          // hit right border
          this.velocity.x = 0;
          this.x = _constants["default"].MAP_WIDTH - objectRadius;
        }
        if (this.y < objectRadius) {
          // hit top border
          this.velocity.y = 0;
          this.y = objectRadius;
        } else if (this.y > _constants["default"].MAP_HEIGHT - objectRadius) {
          // hit bottom border
          this.velocity.y = 0;
          this.y = _constants["default"].MAP_HEIGHT - objectRadius;
        }
      }
    }
  }, {
    key: "updateVelocity",
    value: function updateVelocity(deltaT) {
      this.velocity.x *= _constants["default"].SPEED_ATTENUATION_COEFFICIENT;
      this.velocity.y *= _constants["default"].SPEED_ATTENUATION_COEFFICIENT;
      var speedX = this.movement.speed * Math.sin(this.movement.direction);
      var speedY = this.movement.speed * Math.cos(this.movement.direction);
      this.velocity.x += speedX;
      this.velocity.y += speedY;
    }
  }, {
    key: "applyVelocity",
    value: function applyVelocity(deltaT) {
      this.x += deltaT * this.velocity.x;
      this.y -= deltaT * this.velocity.y;
    }
  }, {
    key: "applyConstraintVelocity",
    value: function applyConstraintVelocity(deltaT) {
      this.x += this.constraintVelocity.x * deltaT;
      this.y -= this.constraintVelocity.y * deltaT;
      this.constraintVelocity = {
        x: 0,
        y: 0
      };
    }
  }, {
    key: "updateChunks",
    value: function updateChunks(radius) {
      var _this = this;
      var chunksNew = [];
      var chunkRadius = Math.ceil(radius / _constants["default"].CHUNK_SIZE + 1);
      var baseChunk = {
        x: Math.floor(this.x / _constants["default"].CHUNK_SIZE),
        y: Math.floor(this.y / _constants["default"].CHUNK_SIZE)
      };
      var chunkX = baseChunk.x - chunkRadius,
        chunkY = baseChunk.y - chunkRadius;
      while (chunkX <= baseChunk.x + chunkRadius && chunkY <= baseChunk.y + chunkRadius) {
        if (chunkX < baseChunk.x + chunkRadius) {
          chunkX++;
        } else if (chunkY < baseChunk.y + chunkRadius) {
          chunkX = baseChunk.x - chunkRadius;
          chunkY++;
        } else {
          break;
        }
        if (chunkX < 0 || chunkY < 0) continue;
        if (chunkX == baseChunk.x) {
          if (chunkY > baseChunk.y) {
            if (chunkY * _constants["default"].CHUNK_SIZE <= this.y + radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          } else {
            if ((chunkY + 1) * _constants["default"].CHUNK_SIZE >= this.y - radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          }
        } else if (chunkY == baseChunk.y) {
          if (chunkX > baseChunk.x) {
            if (chunkX * _constants["default"].CHUNK_SIZE <= this.x + radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          } else if (chunkX < baseChunk.x) {
            if ((chunkX + 1) * _constants["default"].CHUNK_SIZE >= this.x - radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          }
        } else {
          if (chunkX > baseChunk.x && chunkY > baseChunk.y) {
            var deltaX = chunkX * _constants["default"].CHUNK_SIZE - this.x;
            var deltaY = chunkY * _constants["default"].CHUNK_SIZE - this.y;
            if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          } else if (chunkX > baseChunk.x && chunkY < baseChunk.y) {
            var _deltaX = chunkX * _constants["default"].CHUNK_SIZE - this.x;
            var _deltaY = (chunkY + 1) * _constants["default"].CHUNK_SIZE - this.y;
            if (Math.sqrt(_deltaX * _deltaX + _deltaY * _deltaY) <= radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          } else if (chunkX < baseChunk.x && chunkY > baseChunk.y) {
            var _deltaX2 = (chunkX + 1) * _constants["default"].CHUNK_SIZE - this.x;
            var _deltaY2 = chunkY * _constants["default"].CHUNK_SIZE - this.y;
            if (Math.sqrt(_deltaX2 * _deltaX2 + _deltaY2 * _deltaY2) <= radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          } else {
            var _deltaX3 = (chunkX + 1) * _constants["default"].CHUNK_SIZE - this.x;
            var _deltaY3 = (chunkY + 1) * _constants["default"].CHUNK_SIZE - this.y;
            if (Math.sqrt(_deltaX3 * _deltaX3 + _deltaY3 * _deltaY3) <= radius) {
              chunksNew.push({
                x: chunkX,
                y: chunkY
              });
            }
          }
        }
      }
      var chunksOld = [];
      this.chunks.forEach(function (chunkOld) {
        chunksOld.push(chunkOld);
      });
      this.chunks = [];
      chunksNew.forEach(function (chunkNew) {
        _this.chunks.push(chunkNew);
      });
      return {
        chunksOld: chunksOld,
        chunksNew: chunksNew
      };
    }
  }, {
    key: "serializeForUpdate",
    value: function serializeForUpdate() {
      // get necessary data and send to client
      return {
        id: this.id,
        x: this.x,
        y: this.y,
        hp: this.hp,
        dir: this.direction,
        isHurt: this.isHurt
      };
    }
  }]);
  return Entity;
}();
var _default = Entity;
exports["default"] = _default;