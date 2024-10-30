"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addPlayer = addPlayer;
exports.handlePetalDeath = handlePetalDeath;
exports.handlePlayerDeath = handlePlayerDeath;
exports.init = init;
exports.newUnboundPetal = newUnboundPetal;
exports.togglePetalSkillTrigger = togglePetalSkillTrigger;
exports.updatePlayers = updatePlayers;
var util = _interopRequireWildcard(require("./utility.js"));
var _player = _interopRequireDefault(require("./player.js"));
var entityHandler = _interopRequireWildcard(require("./entityHandler.js"));
var _mobAttr = _interopRequireDefault(require("./mobAttr.js"));
var _petalAttr = _interopRequireDefault(require("./petalAttr.js"));
var _petalInfo = _interopRequireDefault(require("./petalInfo.js"));
var _petalSkill = _interopRequireDefault(require("./petalSkill.js"));
var _petal2 = _interopRequireDefault(require("./petal.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
处理玩家

$ = this.var

$.sockets: {socket id -> socket}
$.players: {socket id -> uuid}
*/

function init() {
  // 初始化
  var $ = this["var"];
  $.sockets = {};
  $.players = {};
}
function addPlayer(socket, username, team) {
  var _attr$hp;
  // 添加玩家
  var $ = this["var"];
  $.sockets[socket.id] = socket; // 储存 socket
  var x = util.randomInt(0, $.props.map_width); // 生成随机出生点
  var y = util.randomInt(0, $.props.map_height);
  var attr = structuredClone(_mobAttr["default"].player);
  var defaultAttr = structuredClone(_mobAttr["default"]["default"]);

  // 将未设置属性设置为默认值
  Object.keys(defaultAttr).forEach(function (key) {
    var _attr$key;
    (_attr$key = attr[key]) !== null && _attr$key !== void 0 ? _attr$key : attr[key] = defaultAttr[key];
  });
  (_attr$hp = attr.hp) !== null && _attr$hp !== void 0 ? _attr$hp : attr.hp = attr.max_hp;
  var newPlayer = new _player["default"](
  // 创建新 Player 实例
  socket.id, username, x, y, team, attr);
  var uuid = newPlayer["var"].uuid; // 获取 uuid
  $.players[socket.id] = uuid; // 储存 uuid
  entityHandler.addEntity.bind(this)(uuid, newPlayer); // 添加实体到实体列表

  if ($.props.random_initial_angle)
    // 如果设置为 true
    newPlayer["var"].angle = util.random(0, Math.PI * 2); // 设置随机玩家初始起始角度

  var kit = $.props.kit_info;
  if (kit) {
    var legal = true;
    kit.primary.forEach(function (id) {
      if (id && !_petalInfo["default"][id]) legal = false;
    });
    if (!legal) kit = $.props.default_kit_info;
  } else {
    kit = $.props.default_kit_info;
  }
  initPetals.bind(newPlayer)(kit); // 初始化花瓣相关信息
}
function playerNaturalRegen(player) {
  // 玩家自然会血
  var $ = this["var"];
  if ($.tick % $.props.player_natural_regen.interval) return;
  player.heal($.props.player_natural_regen.point + $.props.player_natural_regen.percent * player["var"].attr.max_hp * 0.01);
}
function newUnboundPetal(id, parent, x, y, dir, skill_set, skill_var, attr) {
  // Game 调用
  // 生成解绑花瓣
  var $ = this["var"];
  var player = $.entities[parent];
  var newPetal = new _petal2["default"](id, player["var"].uuid,
  // 设置玩家为 parent
  -1, -1, structuredClone(skill_set),
  // 技能 id
  structuredClone(skill_var),
  // 技能变量
  x, y, player["var"].team,
  // 继承玩家的所在队伍
  structuredClone(attr)) // 默认属性
  ;
  newPetal["var"].attr.dir = dir;
  newPetal["var"].unbound_idx = player["var"].petals.push(newPetal["var"].uuid) - 1; // 记录在已解绑花瓣中 记录 unbound_idx
  newPetal["var"].unbound = true;
  entityHandler.addEntity.bind(this)(newPetal["var"].uuid, newPetal);
  togglePetalSkillTrigger.bind(this)('onSpawn', newPetal);
}
function togglePetalSkillTrigger(trigger, petal) {
  var _this = this;
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  // 触发花瓣技能触发器
  petal["var"].skill_set.forEach(function (skill_id) {
    var skill = _petalSkill["default"][skill_id];
    if (!skill) {
      // 未知技能
      console.log("Unknown skill id '".concat(skill_id, "'."));
      return;
    }
    if (skill[trigger]) {
      skill[trigger].forEach(function (fn) {
        fn.bind(_this).apply(void 0, [petal].concat(args));
      });
    }
  });
}
function updatePlayers() {
  var _this2 = this;
  // Game 调用 更新玩家
  var $ = this["var"];
  Object.values($.players).map(function (uuid) {
    return $.entities[uuid];
  }).forEach(function (player) {
    // 遍历玩家
    if (player["var"].spec) {
      // 玩家是观察者
      return;
    }
    playerNaturalRegen.bind(_this2)(player);
    player.regen();
    var kit = player["var"].kit;
    var clusterCnt = 0; // 花瓣簇总数 聚合算 1 分散算 n
    player["var"].angle = (player["var"].angle + player["var"].rot_speed * player["var"].rot_dir) % (Math.PI * 2); // 更新轨道起始角度

    // 已解绑花瓣判定技能触发器
    player["var"].petals.forEach(function (uuid) {
      if (!uuid) return;
      var petal = $.entities[uuid];
      togglePetalSkillTrigger.bind(_this2)('onTick', petal);
    });

    // 判定花瓣技能触发器
    kit.primary.forEach(function (data) {
      var id = data.id; // 抽象花瓣 id
      if (!id)
        // 空花瓣
        return;
      var info = data.info;
      var instances = data.instances;
      for (var subidx = 0; subidx < info.count; subidx++) {
        // 遍历实例
        if (!instances[subidx])
          // 实例不存在
          continue;
        var instance = $.entities[instances[subidx]]; // 实例
        togglePetalSkillTrigger.bind(_this2)('onTick', instance); // 触发
      }
    });

    // 遍历抽象花瓣 更新冷却 花瓣簇计数
    kit.primary.forEach(function (data, idx) {
      var id = data.id; // 抽象花瓣 id
      if (!id)
        // 空花瓣
        return;
      var info = data.info; // 抽象花瓣信息
      var instances = data.instances; // 实例列表

      clusterCnt += info.pattern == 0 ? info.count : 1; // 花瓣簇计数
      var _loop = function _loop() {
        // 遍历实例 更新 冷却时间
        if (!instances[subidx]) {
          // 如果实例不存在 即 在冷却时间
          info.cd_remain[subidx]--; // 更新冷却时间
          if (info.cd_remain[subidx] <= 0) {
            var _attr$hp2;
            // 冷却时间结束 load 新实例
            var attr = structuredClone(_petalAttr["default"][info.instance_id]); // 默认属性
            var defaultAttr = structuredClone(_petalAttr["default"]['default']); // 未设置值默认值

            if (!attr)
              // 使用了未知的 instance id
              throw new Error("instance '".concat(info.instance_id, "' does not exist"));

            // 自动设置未设置值为默认值
            Object.keys(defaultAttr).forEach(function (key) {
              var _attr$key2;
              (_attr$key2 = attr[key]) !== null && _attr$key2 !== void 0 ? _attr$key2 : attr[key] = defaultAttr[key];
            });
            (_attr$hp2 = attr.hp) !== null && _attr$hp2 !== void 0 ? _attr$hp2 : attr.hp = attr.max_hp;

            // 创建新 Petal
            var newPetal = new _petal2["default"](info.instance_id,
            // 获取实例 id
            player["var"].uuid,
            // 设置玩家为 parent
            idx,
            // 所属抽象花瓣的编号
            subidx,
            // 在所属抽象花瓣的实例集合中的编号
            structuredClone(info.skill_set),
            // 技能 id
            structuredClone(info.skill_var),
            // 技能变量
            player["var"].pos.x, player["var"].pos.y,
            // 继承玩家的位置
            player["var"].team,
            // 继承玩家的所在队伍
            attr) // 默认属性
            ;
            togglePetalSkillTrigger.bind(_this2)('onSpawn', newPetal);
            var uuid = newPetal["var"].uuid; // 获取新花瓣 uuid
            instances[subidx] = uuid; // 储存 uuid
            entityHandler.addEntity.bind(_this2)(uuid, newPetal); // 添加实体到实体列表

            if (info.cuml_cnt == 0) {
              togglePetalSkillTrigger.bind(_this2)('onFirstLoad', newPetal); // 触发
            }
            togglePetalSkillTrigger.bind(_this2)('onLoad', newPetal);
            info.cuml_cnt += info.count; // 更新累计 load 实例数量
          }
        }
      };
      for (var subidx = 0; subidx < info.count; subidx++) {
        _loop();
      }
    });
    var clusteridx = 0; // 当前花瓣簇编号
    kit.primary.forEach(function (data) {
      // 遍历抽象花瓣 更新移动
      var id = data.id; // 抽象花瓣 id
      if (!id)
        // 空花瓣
        return;
      var info = data.info; // 抽象花瓣信息
      var instances = data.instances; // 实例列表

      if (info.pattern == 0) {
        // 分散
        for (var subidx = 0; subidx < info.count; subidx++) {
          // 遍历该抽象花瓣的实例
          if (instances[subidx]) {
            // 实例存在
            var petal = $.entities[instances[subidx]]; // 当前实例（花瓣实体）
            var angle = player["var"].angle + Math.PI * 2 * (clusteridx / clusterCnt); // 计算当前实例在轨道的角度

            var state = player["var"].state;
            var orbit_radius = info.orbit_special == -1 ? info.orbit_extra[state] + info.orbit_disabled[state] ? player["var"].orbit[0] : player["var"].orbit[state] : info.orbit_special;
            var x = player["var"].pos.x + orbit_radius * Math.cos(angle); // 目标坐标
            var y = player["var"].pos.y + orbit_radius * Math.sin(angle);
            var dx = x - petal["var"].pos.x,
              dy = y - petal["var"].pos.y; // 计算 目标坐标 相对于 目前坐标 的 相对坐标

            entityHandler.move.bind(petal)(
            // 更新花瓣 movement
            Math.atan2(dy, dx),
            // 方向
            Math.sqrt(dx * dx + dy * dy) * $.props.petal_speed // 大小
            );
          }
          clusteridx += 1; // 更新花瓣簇编号
        }
      } else {
        // 聚合
        var _angle = player["var"].angle + Math.PI * 2 * (clusteridx / clusterCnt); // 计算当前抽象花瓣亚轨道中心在轨道的角度

        var _state = player["var"].state;
        var _orbit_radius = info.orbit_special == -1 ? info.orbit_extra[_state] + info.orbit_disabled[_state] ? player["var"].orbit[0] : player["var"].orbit[_state] : info.orbit_special;
        var cx = player["var"].pos.x + _orbit_radius * Math.cos(_angle); // 亚轨道中心坐标
        var cy = player["var"].pos.y + _orbit_radius * Math.sin(_angle);
        for (var _subidx = 0; _subidx < info.count; _subidx++) {
          // 遍历该抽象花瓣的实例
          if (instances[_subidx]) {
            // 实例存在
            var _petal = $.entities[instances[_subidx]]; // 当前实例（花瓣实体）

            var sub_angle = info.angle + _subidx * (Math.PI * 2 / info.count); // 计算当前实例在抽象花瓣亚轨道的角度
            var subdx = info.orbit_special == -1 ? info.sub_orbit * Math.cos(sub_angle) : 0; // 在亚轨道上相对与亚轨道中心的相对坐标
            var subdy = info.orbit_special == -1 ? info.sub_orbit * Math.sin(sub_angle) : 0; // 特殊轨道启用时取消亚轨道; 所有实例强制重叠在亚轨道中心

            var _dx = cx + subdx - _petal["var"].pos.x,
              _dy = cy + subdy - _petal["var"].pos.y; // 计算 目标坐标 相对于 目前坐标 的 相对坐标

            entityHandler.move.bind(_petal)(
            // 更新花瓣 movement
            Math.atan2(_dy, _dx),
            // 方向
            Math.sqrt(_dx * _dx + _dy * _dy) * $.props.petal_speed // 大小
            );
          }
        }
        if (info.sub_orbit_type == 'rotate') {
          // 更新亚轨道起始角度
          info.angle = (info.angle + info.sub_orbit_rot_speed) % (Math.PI * 2);
        } else if (info.sub_orbit_type == 'radial') {
          info.angle = _angle;
        } else if (info.sub_orbit_type == 'radial_reverse') {
          info.angle = _angle + Math.PI;
        }
        clusteridx += 1; // 更新花瓣簇编号
      }
    });
  });
}

/*
花瓣相关概念定义
抽象花瓣：玩家可以获取的，非实体的花瓣
实体花瓣：有碰撞箱的实体花瓣
loadout：一行抽象花瓣的集合
kit：主副 loadout 的集合
绑定：实体花瓣一般绑定到生成它的抽象花瓣
当该实体花瓣脱离其抽象花瓣且不影响所属抽象花瓣生成新的实体花瓣时解绑
例如：导弹发射，花粉放置

kit: {size, primary:[{id, info, instances:[uuid]}], secondary:[{id, info}]}
记录 loadout size, 主副 loadout 抽象花瓣的 id, info

抽象花瓣 info 格式：
'basic': { 					// key 与抽象花瓣 id 对应
	id: 'basic', 			// 抽象花瓣 id
	instance_id: 'basic', 	// 实体花瓣 id
	cd: 62, 				// = 2.48s 单位 刻 冷却时间
	cd_remain: [], 			// 各实例剩余冷却时间
	count: 1, 				// 数量，等于 1 表示单子，多于 1 表示多子
	pattern: 0, 			// 多子形态，0 表示分散，1 表示聚合
	angle: 0,				// 多子花瓣的亚轨道起始角度
	rot_speed: 0.05,		// 亚轨道旋转速度 单位:弧度 / 刻
	orbit_extra: 100,		// 额外轨道半径
	sub_orbit: 0,			// 亚轨道半径
}
具体参考 petalInfo.js

petals: [uuid]
记录已解绑实体花瓣的 uuid
*/

function initPetals(defaultKitInfo) {
  // Player 调用
  var $ = this["var"];
  $.kit = {
    size: defaultKitInfo.size,
    primary: [],
    secondary: []
  };
  defaultKitInfo.primary.forEach(function (id) {
    var _info$instance_id;
    if (!id) {
      // 空花瓣
      $.kit.primary.push({
        id: ''
      });
      return;
    }
    var info = structuredClone(_petalInfo["default"][id]); // 获取抽象花瓣信息
    var defaultInfo = structuredClone(_petalInfo["default"]['default']); // 默认信息

    // 自动设置未设定值为默认设定
    Object.keys(defaultInfo).forEach(function (key) {
      var _info$key;
      (_info$key = info[key]) !== null && _info$key !== void 0 ? _info$key : info[key] = defaultInfo[key];
    });
    (_info$instance_id = info.instance_id) !== null && _info$instance_id !== void 0 ? _info$instance_id : info.instance_id = id;
    info.cd_remain = new Array(info.count).fill(info.cd); // 设置初始 cd

    var data = {
      id: id,
      info: info,
      instances: []
    };
    $.kit.primary.push(data);
  });
  if ($.kit.primary.length < $.kit.size) {
    // 长度不够，补空的
    $.kit.primary = $.kit.primary.concat(new Array($.kit.size - $.kit.primary.length).fill({
      id: ''
    }));
  } else if ($.kit.primary.lenth > $.kit.size) {
    // 长度超过，删除多余的
    $.kit.primary = $.kit.primary.slice(0, $.kit.size);
  }
  defaultKitInfo.secondary.forEach(function (id) {
    $.kit.secondary.push({
      id: id,
      info: _petalInfo["default"][id]
    });
  });
  if ($.kit.secondary.length < $.kit.size) {
    // 长度不够，补空的
    $.kit.secondary = $.kit.secondary.concat(new Array($.kit.size - $.kit.secondary.length).fill({
      id: ''
    }));
  } else if ($.kit.secondary.lenth > $.kit.size) {
    // 长度超过，删除多余的
    $.kit.secondary = $.kit.secondary.slice(0, $.kit.size);
  }
}
function handlePlayerDeath(player) {
  var _this3 = this;
  // Game 调用
  var $ = this["var"];
  player.setSpec(true);
  var kit = player["var"].kit;
  kit.primary.forEach(function (data) {
    // 移除死亡玩家的所有花瓣
    if (!data.id)
      // 空花瓣
      return;
    data.instances.forEach(function (uuid) {
      var petal = $.entities[uuid];
      if (!petal)
        // 花瓣不存在
        return;
      petal["var"].unbound = true;
      handlePetalDeath.bind(_this3)(petal); // 移除花瓣记录
      entityHandler.removeEntity.bind(_this3)(petal["var"].uuid); // 移除花瓣实体
    });
  });
}
function handlePetalDeath(petal) {
  // Game 调用
  // 移除玩家对花瓣的记录
  togglePetalSkillTrigger.bind(this)('onDeath', petal); // 触发花瓣技能触发器
  var $ = this["var"];
  var player = $.entities[petal["var"].parent]; // 获取花瓣所属玩家
  if (!player)
    // 玩家已不存在
    return;
  if (petal["var"].unbound) {
    // 已解绑花瓣
    delete player["var"].petals[petal["var"].unbound_idx]; // 清空记录的 uuid
    return;
  }
  var data = player["var"].kit.primary[petal["var"].idx]; // 获取所属抽象花瓣数据
  data.info.cd_remain[petal["var"].subidx] = data.info.cd; // 重置 cd
  data.instances[petal["var"].subidx] = ''; // 清除旧 uuid 不可省略 因为这用于判定是否在冷却期间
}