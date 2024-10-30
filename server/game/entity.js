"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var util = _interopRequireWildcard(require("./utility.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Entity = /*#__PURE__*/function () {
  // 所有实体的类
  function Entity(type, x, y, team) {
    var attr = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    _classCallCheck(this, Entity);
    this["var"] = {
      uuid: util.getNewUUID(),
      // 获取新的 uuid
      type: type,
      // 每一种实体独一无二的类型名
      pos: {
        // 位置
        x: x,
        // x 坐标
        y: y // y 坐标
      },
      team: team,
      // 队伍
      attr: attr,
      // 属性
      /*
      	hp, 	// 血量
      	max_hp, // 血量上限
      	radius, // 半径
      	vision, // 视距
      	mass, 	// 重量
      	speed, // 移动速度
      	ghost, // 无碰撞箱
      	ignore_border,	// 无视地图边界
      	invulnerable,	// 不会死亡判定
      	poison_res,		// 中毒抗性; 1 为免疫中毒伤害
      	poison: {duration, dmg}, // 碰撞对目标造成中毒
      	dmg_reflect,	// 反伤百分比
      	dir,	// 方向
      	friction,
      		摩擦系数，影响一般情况下的移动，取值范围[0, 1)
      		该参数越大，移动越"漂"
      		取值 >= 1 时将会无限加速
      		取值 = 0 时将会无法移动
      	kb,
      		击退系数，影响碰撞时弹开的瞬时速度，取值范围无限制
      		与碰撞时弹开的瞬时速度成正比
      	elasticity,
      		弹性系数，影响碰撞时弹开的速度衰减，取值范围[0, 1)
      		碰撞时弹开的衰减速度随着 该参数的减小 而增加
      		取值 = 1 时碰撞后摊开的速度不会衰减
      		取值 = 0 时碰撞后弹开的速度只持续 1 刻
      */
      v: {
        // 速度
        x: 0,
        y: 0
      },
      a: {
        // 加速度
        x: 0,
        y: 0
      },
      movement: {
        // 移动方向
        dir: 0,
        val: 0
      },
      v_list: [],
      // 其他速度列表 [{resistance, x, y}]
      chunks: [],
      // 所覆盖区块
      effects: {
        // 状态效果
        poison: {
          // 中毒
          duration: 0,
          // 时长 单位: 刻
          value: 0 // 每刻伤害
        },
        heal_res: {
          duration: 0,
          value: 0 // 抗性百分点 100 为完全免疫回血
        }
      },
      isHurt: false // 此tick内是否受伤
    };
  }
  _createClass(Entity, [{
    key: "effect",
    value: function effect(id, duration, value) {
      var $ = this["var"];
      var cur = $.effects[id];
      if (id == 'poison') {
        if (cur.duration * cur.value <= duration * value) {
          // 使用总毒伤较高的一方
          cur.duration = duration;
          cur.value = value;
        }
      } else {
        if (cur.duration < duration) {
          cur.duration = duration;
          cur.value = value;
        }
      }
    }
  }, {
    key: "heal",
    value: function heal(value) {
      var $ = this["var"];
      var heal_res = $.effects.heal_res.duration > 0 ? $.effects.heal_res.value * 0.01 : 0;
      $.attr.hp = Math.min($.attr.max_hp, $.attr.hp + value * (1 - heal_res));
    }
  }]);
  return Entity;
}();
var _default = Entity;
exports["default"] = _default;