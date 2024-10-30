"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addEntity = addEntity;
exports.appendVelocity = appendVelocity;
exports.getUpdate = getUpdate;
exports.handleEntityDeaths = handleEntityDeaths;
exports.init = init;
exports.move = move;
exports.removeEntity = removeEntity;
exports.updateAcceleration = updateAcceleration;
exports.updateEntities = updateEntities;
exports.updatePosition = updatePosition;
exports.updateVelocity = updateVelocity;
var playerHandler = _interopRequireWildcard(require("./playerHandler.js"));
var physics = _interopRequireWildcard(require("./physics.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
处理实体

$ = this.var
*/

function init() {
  // Game 调用
  // 初始化
  var $ = this["var"];
  $.entities = {};
}
function addEntity(uuid, entity) {
  // Game 调用
  // 添加一个实体
  var $ = this["var"];
  $.entities[uuid] = entity;
}
function move(dir, val) {
  // Entity 调用
  // 设定移动方向与速度（加速度）
  // 一个实体的加速度就是当前刻中最后一次接收到的 movement，也就是说 movement 就是加速度
  var $ = this["var"];
  $.movement.dir = dir;
  $.movement.val = val;
}
function updateAcceleration(dt) {
  // 更新加速度
  var $ = this["var"];
  Object.values($.entities).forEach(function (entity) {
    var movement = entity["var"].movement;
    entity["var"].a = {
      x: movement.val * Math.cos(movement.dir),
      y: movement.val * Math.sin(movement.dir)
    };
  });
}
function updateVelocity(dt) {
  var $ = this["var"];
  Object.values($.entities).forEach(function (entity) {
    var a = entity["var"].a; // 实体加速度
    var v = entity["var"].v;
    var friction = entity["var"].attr.friction;
    v.x *= friction;
    v.y *= friction;
    v.x += a.x * dt;
    v.y += a.y * dt;
    var v_list = entity["var"].v_list; // 其他速度列表
    v_list.forEach(function (vel, i) {
      vel.x *= vel.coeff;
      vel.y *= vel.coeff;
      if (Math.sqrt(vel.x * vel.x + vel.y * vel.y) < 1) {
        // 衰减到消失
        delete v_list[i];
        return;
      }
    });
  });
}
function appendVelocity(x, y, coeff) {
  // Entity 调用
  var $ = this["var"];
  $.v_list.push({
    x: x,
    y: y,
    coeff: coeff
  });
}
function updatePosition(dt) {
  var $ = this["var"];
  Object.values($.entities).forEach(function (entity) {
    var v = entity["var"].v; // 速度
    var pos = entity["var"].pos;
    pos.x += v.x * dt;
    pos.y += v.y * dt;
    var v_list = entity["var"].v_list; // 其他速度列表
    v_list.forEach(function (vel) {
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;
    });
  });
}
function handleEntityDeaths() {
  var _this = this;
  var $ = this["var"];
  Object.values($.entities).forEach(function (entity) {
    if (!entity) return;
    if (entity["var"].attr.hp <= 0) {
      // 死亡
      if (entity["var"].attr.invulnerable) {
        // 不会进行死亡判定
        return;
      }
      if (entity["var"].type == 'player') {
        // 对玩家进行特殊处理
        playerHandler.handlePlayerDeath.bind(_this)(entity);
        return;
      }
      if (entity["var"].type == 'petal') {
        playerHandler.handlePetalDeath.bind(_this)(entity);
      }
      removeEntity.bind(_this)(entity["var"].uuid);
    }
  });
}
function removeEntity(uuid) {
  var $ = this["var"];
  var entity = $.entities[uuid];
  if (!entity) return;
  entity["var"].chunks.forEach(function (chunk) {
    // 清除区块中对这个实体的记录
    var id = physics.getChunkID(chunk);
    if ($.chunks[id]) {
      $.chunks[id].splice($.chunks[id].findIndex(function (uuid_) {
        return uuid_ == entity["var"].uuid;
      }), 1);
    }
  });
  delete $.entities[uuid];
}
function updateEntities() {
  // Game 调用
  var $ = this["var"];
  Object.values($.entities).forEach(function (entity) {
    //init
    entity["var"].isHurt = false;

    // 处理状态效果
    (function () {
      var effects = entity["var"].effects; // 状态效果
      // 中毒
      Object.keys(effects).forEach(function (effectID) {
        var effect = effects[effectID];
        if (effect.duration > 0) {
          effect.duration--;
          if (effectID == 'poison') {
            entity["var"].attr.hp -= effects.poison.value * (1 - entity["var"].attr.poison_res);
          }
        }
      });
    })();
  });
}
function getUpdate() {
  // Entity 调用
  var $ = this["var"];
  var ret = {
    uuid: $.uuid,
    type: $.type,
    x: $.pos.x,
    y: $.pos.y,
    attr: $.attr,
    isHurt: $.isHurt,
    effects: $.effects
  };
  if ($.type == 'player') {
    ret.username = $.playerInfo.username;
    ret.team = $.team;
    ret.vision = $.vision; // 客户端视距
  }
  if ($.type == 'petal') {
    ret.id = $.id;
  }
  return ret;
}