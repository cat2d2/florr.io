"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var time = _interopRequireWildcard(require("../../game/time.js"));
var playerHandler = _interopRequireWildcard(require("../../game/playerHandler.js"));
var entityHandler = _interopRequireWildcard(require("../../game/entityHandler.js"));
var physics = _interopRequireWildcard(require("../../game/physics.js"));
var _constants = _interopRequireDefault(require("../../../shared/constants.js"));
var util = _interopRequireWildcard(require("../../game/utility.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // 时间相关方法
var Game_Arena = /*#__PURE__*/function () {
  function Game_Arena(settings) {
    _classCallCheck(this, Game_Arena);
    this["var"] = {
      isStarted: false,
      isOver: false,
      tick: 0,
      // 游戏刻计数
      ended: false,
      stopped: false
    };
    this.init(settings);
  }
  _createClass(Game_Arena, [{
    key: "init",
    value: function init(settings) {
      this["var"].props = settings;
      time.init.bind(this)();
      playerHandler.init.bind(this)();
      entityHandler.init.bind(this)();
      physics.init.bind(this)();
    }
  }, {
    key: "start",
    value: function start(endFn) {
      // 开始游戏
      var $ = this["var"];
      $.endFn = endFn; // 结束函数
      $.isStarted = true; // 表示游戏开始
      $.intervalID = setInterval(this.update.bind(this), 1000 / $.props.tick_per_second); // 开启游戏主循环
    }
  }, {
    key: "stop",
    value: function stop() {
      // 停止游戏
      this["var"].stopped = true;
      clearInterval(this["var"].intervalID); // 停止主循环
    }
  }, {
    key: "update",
    value: function update() {
      if (!this["var"].stopped) {
        time.update.bind(this)();
        var dt = 1 / this["var"].props.tick_per_second;
        this["var"].tick++;
        entityHandler.updateEntities.bind(this)(); // 更新实体
        playerHandler.updatePlayers.bind(this)(); // 更新玩家
        entityHandler.updateAcceleration.bind(this)(dt); // 更新加速度
        entityHandler.updateVelocity.bind(this)(dt); // 更新速度
        entityHandler.updatePosition.bind(this)(dt); // 更新位置
        physics.updateChunks.bind(this)(); // 更新区块信息
        physics.solveCollisions.bind(this)(dt); // 计算碰撞
        physics.solveBorderCollisions.bind(this)(); // 处理边界碰撞
        entityHandler.handleEntityDeaths.bind(this)(); // 处理实体死亡
        if (!this["var"].ended) this.checkGameOver();
        this.sendUpdate();
      }
    }
  }, {
    key: "checkGameOver",
    value: function checkGameOver() {
      var $ = this["var"];
      var aliveTeams = {},
        winners = []; // 记录存活队伍，获胜者列表
      Object.values($.players).forEach(function (uuid) {
        var player = $.entities[uuid];
        if (!player["var"].spec) {
          aliveTeams[player["var"].team] = true;
        }
      });
      if (Object.keys(aliveTeams).length <= 1) {
        // 只剩不超过一个队伍存活
        console.log(aliveTeams);
        if (Object.keys(aliveTeams).length == 0) {
          // 同归于尽
          winners = ['The Dandelion Gods'];
        } else {
          Object.values($.players).forEach(function (uuid) {
            // 统计存活队伍的成员
            var player = $.entities[uuid];
            if (player["var"].team == aliveTeams[Object.keys(aliveTeams)[0]]) {
              winners.push(player["var"].playerInfo.username);
            }
          });
        }
        this["var"].ended = true;
        setTimeout(function () {
          $.endFn(winners); // 执行房间传来的结束函数
        }, 5000);
      }
    }
  }, {
    key: "handlePlayerInput",
    value: function handlePlayerInput(socketID, type, input) {
      var $ = this["var"];
      var player = $.entities[$.players[socketID]];
      if (type == 0) {
        // 鼠标移动
        entityHandler.move.bind(player)(input.dir, input.power * player["var"].attr.speed);
      } else if (type == 1) {
        // 鼠标按下/松开
        player["var"].state = input;
      }
    }
  }, {
    key: "addPlayer",
    value: function addPlayer(socket, username, team) {
      playerHandler.addPlayer.bind(this)(socket, username, team);
    }
  }, {
    key: "sendUpdate",
    value: function sendUpdate() {
      var _this = this;
      var $ = this["var"];
      Object.keys($.sockets).forEach(function (socketID) {
        var socket = $.sockets[socketID];
        var player = $.entities[$.players[socketID]];
        var update = _this.createUpdate(player);
        socket.emit(_constants["default"].MSG_TYPES.SERVER.GAME.UPDATE, update);
      });
    }
  }, {
    key: "createUpdate",
    value: function createUpdate(player) {
      var $ = this["var"];
      var d = player["var"].attr.vision; // 视距
      var nearbyEntities = Object.values($.entities).filter(function (e) {
        return e["var"].uuid != player["var"].uuid && util.getDistance(e["var"].pos, player["var"].pos) <= d;
      });
      return {
        t: Date.now(),
        // current time
        mspt: Date.now() - this["var"].time.lastUpdTime,
        // mspt
        self: entityHandler.getUpdate.bind(player)(),
        entities: nearbyEntities.map(function (e) {
          return entityHandler.getUpdate.bind(e)();
        }) // 视距内实体
      };
    }
  }]);
  return Game_Arena;
}();
var _default = Game_Arena;
exports["default"] = _default;