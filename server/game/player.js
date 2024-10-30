"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _entity = _interopRequireDefault(require("./entity.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
var Player = /*#__PURE__*/function (_Entity) {
  _inherits(Player, _Entity);
  var _super = _createSuper(Player);
  function Player(socketID, username, x, y, team, attr) {
    var _this;
    _classCallCheck(this, Player);
    _this = _super.call(this, 'player', x, y, team, attr);
    var $ = _this["var"];
    $.playerInfo = {
      // 玩家信息
      socketID: socketID,
      // socket ID
      username: username // 用户名
    };
    $.spec = false; // 是否为观察者
    $.state = 0; // 鼠标按下情况 0:无 1:左键 2:右键 3:左右
    $.heal = {
      // 每刻非自然回血
      point: 0,
      // 点数
      percent: 0 // 总血量百分点
    };
    $.stack = {}; // 花瓣堆叠计数
    $.petals = []; // 已解绑花瓣 uuid
    $.angle = 0; // 轨道起始角度
    $.rot_speed = 0.1; // 轨道转速 单位:弧度 / 刻 只能为正值
    $.rot_dir = 1; // 旋转乘数 -1 / 0 / 1 逆时针 停转 顺时针
    $.orbit = [65, 130, 35, 130]; // 不同状态下花瓣轨道半径 正常 攻击 防御 同时攻击防御
    $.vision = 1; // 客户端视距
    return _this;
  }
  _createClass(Player, [{
    key: "setSpec",
    value: function setSpec(state) {
      // 设置是否为观察者
      var $ = this["var"];
      $.spec = state;
      $.attr.ghost = true;
      $.attr.speed = 2500;
      $.attr.friction = 0.85;
      $.attr.invulnerable = true;
      $.attr.vision = 3000;
      $.vision = 2;
    }
  }, {
    key: "regen",
    value: function regen() {
      // 非自然回血
      var $ = this["var"];
      this.heal($.heal.point + $.heal.percent * $.attr.max_hp * 0.01);
    }
  }]);
  return Player;
}(_entity["default"]);
var _default = Player;
exports["default"] = _default;