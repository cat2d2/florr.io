"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _entity = _interopRequireDefault(require("./entity.js"));
var _entity_attributes = _interopRequireDefault(require("../../../public/entity_attributes.js"));
var _constants = _interopRequireDefault(require("../../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get.bind(); } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }
function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var Mob = /*#__PURE__*/function (_Entity) {
  _inherits(Mob, _Entity);
  var _super = _createSuper(Mob);
  function Mob(id, x, y, type, team, noBorderCollision, isProjectile, existTime, size) {
    var _this;
    _classCallCheck(this, Mob);
    _this = _super.call(this, id, x, y, team, 'mob', type, _entity_attributes["default"][type].MAX_HP, _entity_attributes["default"][type].MAX_HP, noBorderCollision);
    _this.attributes = JSON.parse(JSON.stringify(_entity_attributes["default"][type]));
    _this.existTime = existTime || Infinity;
    _this.sensitization = false;
    _this.target = -1;
    _this.idleMovementCooldown = 0;
    _this.isProjectile = isProjectile || false;
    _this.startDirection = 0;
    _this.maxCloseLength = _this.attributes.MAX_CLOSE_LENGTH || 0;
    _this.skillCoolDown = _this.attributes.SKILL_COOLDOWN || 0;
    _this.aimMovementDirection = 0.01;
    _this.isSkillenable = false;
    _this.isEinstein = false;
    _this.idleMode = _entity_attributes["default"][type].IDLE_MODE;
    _this.suffocateTime = 0;
    if (Math.random() <= 0.5) {
      _this.aimMovementDirection = -0.01;
    }
    if (Math.random() <= 0.5 && _entity_attributes["default"][type].TRIGGERS.SHOOT) {
      _this.isEinstein = true;
    }
    if (_this.attributes.ATTACK_MODE == "STATIC") {
      _this.updateMovement = function (deltaT) {};
      _this.idle = function (deltaT, parent) {};
    } else if (_this.attributes.ATTACK_MODE == "PROJECTILE") {
      _this.noBorderCollision = true;
      _this.updateMovement = function (deltaT) {
        _this.velocity.x /= _constants["default"].SPEED_ATTENUATION_COEFFICIENT;
        _this.velocity.y /= _constants["default"].SPEED_ATTENUATION_COEFFICIENT;
      };
      _this.idle = function (deltaT, parent) {};
    } else if (_this.attributes.ATTACK_MODE == "PEACE") {
      _this.updateMovement = function (deltaT, parent) {};
    } else if (_this.attributes.ATTACK_MODE == "NEUTRAL") {
      _this.updateMovement = function (deltaT, target) {
        //拥有攻击目标则开始追杀
        if (target) {
          _this.movement = {
            direction: Math.atan2(target.x - _this.x, _this.y - target.y),
            speed: _this.attributes.SPEED
          };
        } else {
          _this.movement.speed = 0;
        }
      };
    } else if (_this.attributes.ATTACK_MODE == "EVIL") {
      _this.updateMovement = function (deltaT, target) {
        if (!target) return;

        //绕圈
        var distanceToTarget = Math.sqrt(Math.pow(target.x - _this.x, 2) + Math.pow(target.y - _this.y, 2));
        if (distanceToTarget - _this.attributes.RADIUS - target.attributes.RADIUS <= _this.maxCloseLength) {
          var atan = Math.atan2(_this.x - target.x, target.y - _this.y) + _this.aimMovementDirection;
          var goalPos = {
            x: target.x + distanceToTarget * Math.sin(atan),
            y: target.y - distanceToTarget * Math.cos(atan)
          };
          _this.movement = {
            direction: Math.atan2(goalPos.x - _this.x, _this.y - goalPos.y),
            speed: _this.attributes.SPEED / 5
          };
          _this.isSkillenable = true;
          return;
        }
        _this.movement = {
          direction: Math.atan2(target.x - _this.x, _this.y - target.y),
          speed: _this.attributes.SPEED
        };
        _this.isSkillenable = false;
      };
    }
    return _this;
  }
  _createClass(Mob, [{
    key: "idle",
    value: function idle(deltaT, parent) {
      //首次受到攻击时更改攻击目标
      if (this.attributes.ATTACK_MODE != "PEACE") {
        if (this.hurtByInfo.id.playerID) {
          //player
          this.target = this.hurtByInfo.id.playerID;
        } else if (this.hurtByInfo.id != -1) {
          //mob
          this.target = this.hurtByInfo.id;
        }
      }
      if (this.idleMode == "STATIC") {
        return;
      } else if (this.idleMode == "NORMAL") {
        this.isSkillenable = false;
        if (parent && this.distanceTo(parent) > _constants["default"].MOB_IDLE_RADIUS) {
          this.idleMovementCooldown = 0;
          this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
          this.movement = {
            direction: this.direction,
            speed: this.attributes.SPEED
          };
          return;
        }
        this.idleMovementCooldown -= deltaT;
        if (this.idleMovementCooldown > 0) {
          this.movement = {
            direction: this.direction,
            speed: Math.max(0, this.movement.speed -= this.movement.speed / this.idleMovementCooldown / 2)
          };
          return;
        }
        ;
        var center = {
          x: 0,
          y: 0
        };
        if (parent) {
          center.x = parent.x;
          center.y = parent.y;
        } else {
          center.x = this.x;
          center.y = this.y;
        }
        var atan = Math.random() * Math.PI * 2;
        var idleRadius = _constants["default"].MOB_IDLE_RADIUS / 2;
        this.idleMovementGoalPos = {
          x: center.x + idleRadius * Math.sin(atan),
          y: center.y + idleRadius * Math.cos(atan)
        };
        var direction = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y);
        this.movement = {
          direction: direction,
          speed: this.attributes.SPEED
        };
        this.direction = direction;
        this.idleMovementCooldown = _constants["default"].MOB_IDLE_MOVEMENT_COOLDOWN;
      } else if (this.idleMode == "FLOAT") {
        this.isSkillenable = false;
        if (parent && this.distanceTo(parent) > _constants["default"].MOB_IDLE_RADIUS) {
          this.idleMovementCooldown = 0;
          this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
          this.movement = {
            direction: this.direction,
            speed: this.attributes.SPEED
          };
          return;
        }
        this.idleMovementCooldown -= deltaT;
        if (this.idleMovementCooldown > 0) {
          this.direction = this.startDirection + Math.cos(this.idleMovementCooldown * Math.PI) / 2;
          this.movement = {
            direction: this.direction,
            speed: this.attributes.SPEED / 8
          };
          return;
        }
        ;
        var _center = {
          x: 0,
          y: 0
        };
        if (parent) {
          _center.x = parent.x;
          _center.y = parent.y;
        } else {
          _center.x = this.x;
          _center.y = this.y;
        }
        var _atan = Math.random() * Math.PI * 2;
        var _idleRadius = _constants["default"].MOB_IDLE_RADIUS / 2;
        this.idleMovementGoalPos = {
          x: _center.x + _idleRadius * Math.sin(_atan),
          y: _center.y + _idleRadius * Math.cos(_atan)
        };
        var _direction = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y);
        this.movement = {
          direction: _direction,
          speed: this.attributes.SPEED / 8
        };
        this.startDirection = _direction;
        this.idleMovementCooldown = _constants["default"].MOB_IDLE_MOVEMENT_COOLDOWN;
      } else if (this.idleMode == "FLOAT_SLOW") {
        this.isSkillenable = false;
        if (parent && this.distanceTo(parent) > _constants["default"].MOB_IDLE_RADIUS) {
          this.idleMovementCooldown = 0;
          this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
          this.movement = {
            direction: this.direction,
            speed: this.attributes.SPEED
          };
          return;
        }
        this.idleMovementCooldown -= deltaT;
        if (this.idleMovementCooldown > 0) {
          this.direction = this.startDirection + Math.cos(this.idleMovementCooldown / 16 * Math.PI) / 2;
          this.movement = {
            direction: this.direction,
            speed: this.attributes.SPEED / 12
          };
          return;
        }
        ;
        var _center2 = {
          x: 0,
          y: 0
        };
        if (parent) {
          _center2.x = parent.x;
          _center2.y = parent.y;
        } else {
          _center2.x = this.x;
          _center2.y = this.y;
        }
        var _atan2 = this.direction + Math.floor(Math.random() * 2 + 1) - 1;
        var _idleRadius2 = _constants["default"].MOB_IDLE_RADIUS / 2;
        this.idleMovementGoalPos = {
          x: _center2.x + _idleRadius2 * Math.sin(_atan2),
          y: _center2.y + _idleRadius2 * Math.cos(_atan2)
        };
        var _direction2 = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y);
        this.movement = {
          direction: _direction2,
          speed: this.attributes.SPEED / 12
        };
        this.startDirection = _direction2;
        this.idleMovementCooldown = _constants["default"].MOB_IDLE_MOVEMENT_COOLDOWN * 32;
      }
    }
  }, {
    key: "connectTo",
    value: function connectTo(target) {
      if (target) {
        var direction = Math.atan2(target.x - this.x, this.y - target.y);
        var distance = Math.sqrt(Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2)) - this.attributes.RADIUS - target.attributes.RADIUS;
        //if (!target.attributes.IS_SEGMENT) distance -= 7;
        this.x += distance * Math.sin(direction);
        this.y -= distance * Math.cos(direction);
        this.direction = direction;
      }
    }
  }, {
    key: "aimAt",
    value: function aimAt(target) {
      if (this.isEinstein) {
        var x1 = target.x,
          x2 = this.x,
          y1 = target.y,
          y2 = this.y,
          v1 = target.movement.speed,
          v2 = _entity_attributes["default"][this.attributes.TRIGGERS.SHOOT].SPEED - _entity_attributes["default"][this.attributes.TRIGGERS.SHOOT].RADIUS * 2,
          n1 = target.movement.direction;
        var acos = Math.atan2(target.x - this.x, this.y - target.y) + this.direction < this.direction ? -Math.acos(v1 / v2 * Math.cos(n1 + Math.atan((y2 - y1) / (x1 - x2)))) : Math.acos(v1 / v2 * Math.cos(n1 + Math.atan((y2 - y1) / (x1 - x2)))); //决定正反
        this.direction = acos - Math.atan((y2 - y1) / (x1 - x2));
      } else {
        this.direction = Math.atan2(target.x - this.x, this.y - target.y);
      }
    }
  }, {
    key: "updateChunks",
    value: function updateChunks() {
      return _get(_getPrototypeOf(Mob.prototype), "updateChunks", this).call(this, this.attributes.RADIUS);
    }
  }, {
    key: "handleBorder",
    value: function handleBorder() {
      _get(_getPrototypeOf(Mob.prototype), "handleBorder", this).call(this, this.attributes.RADIUS);
    }
  }, {
    key: "serializeForUpdate",
    value: function serializeForUpdate() {
      return _objectSpread(_objectSpread({}, _get(_getPrototypeOf(Mob.prototype), "serializeForUpdate", this).call(this)), {}, {
        type: this.type,
        activeDirection: this.activeDirection,
        radius: this.attributes.RADIUS,
        size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS
      });
    }
  }]);
  return Mob;
}(_entity["default"]);
var _default = Mob;
exports["default"] = _default;