"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _constants = _interopRequireDefault(require("../../shared/constants.js"));
var _entity_attributes = _interopRequireDefault(require("../../../public/entity_attributes.js"));
var _petal_attributes = _interopRequireDefault(require("../../../public/petal_attributes.js"));
var _player3 = _interopRequireDefault(require("./entity/player.js"));
var _mob = _interopRequireDefault(require("./entity/mob.js"));
var _drop = _interopRequireDefault(require("./entity/drop.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var TOTAL_SPAWN_WEIGHT = 0; // this is a constant
Object.values(_entity_attributes["default"]).forEach(function (attribute) {
  if (attribute.ATTACK_MODE == "PROJECTILE" || attribute.IS_SEGMENT) return;
  Object.entries(attribute.SPAWN_AREA).forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      name = _ref2[0],
      weight = _ref2[1];
    TOTAL_SPAWN_WEIGHT += weight;
  });
});
var Game = /*#__PURE__*/function () {
  function Game() {
    var _this = this;
    _classCallCheck(this, Game);
    this.leaderboard = [{
      score: -1
    }]; // the leaderboard handles all players, but only send the first 'LEADERBOARD_LENGTH' Object.values to each client
    this.sockets = {};
    this.players = {};
    this.mobs = {}; // {id: mob,...}
    this.drops = {};
    this.chunks = {}; // {chunkID:[{type: entityType, id: id},...],...}
    this.lastUpdateTime = Date.now();
    //this.mobSpawnTimer = {};
    //this.volumeTaken = 0;
    // this.shouldSendUpdate = false;
    this.mobID = 0;
    this.dropID = 0;
    this.info = {};
    this.lightningPath = [];
    this.diedEntities = [];
    setInterval(this.update.bind(this), 1000 / _constants["default"].TICK_PER_SECOND); // update the game every tick

    this.areas = {};
    Object.keys(_constants["default"].MAP_AREAS).forEach(function (name) {
      _this.areas[name] = {};
      _this.areas[name].mobSpawnTimer = 0;
      _this.areas[name].volumeTaken = 0;
    });
  }

  // client networking
  _createClass(Game, [{
    key: "addPlayer",
    value: function addPlayer(socket, username) {
      // add a player
      this.sockets[socket.id] = socket;
      var x = _constants["default"].MAP_AREAS.GARDEN.WIDTH * this.rnd(0.1, 0.9);
      var y = _constants["default"].MAP_AREAS.GARDEN.HEIGHT * this.rnd(0.1, 0.9);
      this.players[socket.id] = new _player3["default"](socket.id, username, x, y);

      //this.appendEntityToBlock(`player`, this.players[socket.id]);

      this.updateLeaderboard(this.players[socket.id]);
    }
  }, {
    key: "onPlayerDisconnect",
    value: function onPlayerDisconnect(socket) {
      // calls when a player is disconnected (currently the webpage will refresh for a player that dies)
      if (this.players[socket.id]) {
        this.removeFromLeaderboard(this.players[socket.id]);
        this.removePlayer(socket);
      }
    }
  }, {
    key: "removePlayer",
    value: function removePlayer(socket) {
      var _this2 = this;
      // remove a player
      var playerID = socket.id;
      this.players[playerID].chunks.forEach(function (chunk) {
        if (_this2.chunks[_this2.getChunkID(chunk)]) {
          _this2.chunks[_this2.getChunkID(chunk)].splice(_this2.chunks[_this2.getChunkID(chunk)].findIndex(function (entityInChunk) {
            return entityInChunk.type == 'player' && entityInChunk.id == playerID;
          }), 1);
        }
      });
      this.players[playerID].petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (petal.mob && petal.isHide) {
            petal.mob.forEach(function (mobID) {
              delete _this2.mobs[mobID];
            });
          }
          if (!petal.inCooldown) {
            petal.chunks.forEach(function (chunk) {
              if (_this2.chunks[_this2.getChunkID(chunk)]) {
                _this2.chunks[_this2.getChunkID(chunk)].splice(_this2.chunks[_this2.getChunkID(chunk)].findIndex(function (entityInChunk) {
                  return entityInChunk.type == 'petal' && entityInChunk.id == {
                    playerID: playerID,
                    petalID: petal.id
                  };
                }), 1);
              }
            });
          }
        });
      });
      delete this.sockets[playerID];
      delete this.players[playerID];
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(socket, mouseDownEvent) {
      var player = this.players[socket.id];
      if (player) {
        if (mouseDownEvent & 1) {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_ATTACK;
          player.attack = true;
          if (mouseDownEvent & 2) {
            player.defend = true;
          }
        } else if (mouseDownEvent & 2) {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_DEFEND;
          player.defend = true;
        } else {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_NORMAL;
        }
      }
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(socket, mouseUpEvent) {
      var player = this.players[socket.id];
      if (player) {
        if (mouseUpEvent & 1) {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_ATTACK;
          if (!(mouseUpEvent & 2)) {
            player.defend = false;
          }
        } else if (mouseUpEvent & 2) {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_DEFEND;
          player.attack = false;
        } else {
          player.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_NORMAL;
          player.attack = false;
          player.defend = false;
        }
      }
    }
  }, {
    key: "handlePetalSwitch",
    value: function handlePetalSwitch(socket, petalA, petalB) {
      var player = this.players[socket.id];
      if (!player) return;
      player.switchPetals(petalA, petalB);
    }
  }, {
    key: "handleMovement",
    value: function handleMovement(socket, movement) {
      // handle input from a player
      var player = this.players[socket.id];
      if (player) {
        player.handleActiveMovement({
          direction: movement.direction,
          speed: movement.magnitude * _entity_attributes["default"].PLAYER.SPEED
        });
      }
    }

    // cmd
  }, {
    key: "cmdInv",
    value: function cmdInv(sel, petal) {}

    // leaderboard
  }, {
    key: "getRankOnLeaderboard",
    value: function getRankOnLeaderboard(playerID) {
      // find the rank of a player
      return this.leaderboard.findIndex(function (player) {
        return player.id == playerID;
      });
    }
  }, {
    key: "removeFromLeaderboard",
    value: function removeFromLeaderboard(player) {
      // remove a player from leaderboard
      this.leaderboard.splice(this.getRankOnLeaderboard(player.id), 1);
    }
  }, {
    key: "updateLeaderboard",
    value: function updateLeaderboard(player) {
      // called when a player's score changes, update the player's rank on leaderboard
      if (player.haveRankOnLeaderboard == false) {
        // this is true only if this function is called in this.addPlayer.
        this.leaderboard.push({
          score: 1,
          id: player.id,
          username: player.username
        });
        player.haveRankOnLeaderboard = true;
        return;
      }
      var rankOnLeaderboard = this.getRankOnLeaderboard(player.id);
      var playerRank = rankOnLeaderboard;
      var playerScore = player.score;
      var rankChanged = false;
      while (playerScore > this.leaderboard[playerRank].score && playerRank > 0) {
        // comparing one by one, can be optimized with binary search
        playerRank--;
        rankChanged = true;
      }
      if (rankChanged) playerRank++;
      this.leaderboard.splice(rankOnLeaderboard, 1);
      this.leaderboard.splice(playerRank, 0, {
        score: playerScore,
        id: player.id,
        username: player.username
      });
    }

    // handle deaths
  }, {
    key: "handlePlayerDeath",
    value: function handlePlayerDeath(player) {
      // handles a single player death
      // called when a player dies, adding score to 'killedBy' and remove the dead player from leaderboard
      // this function will not remove the player itself

      this.diedEntities.push({
        x: player.x,
        y: player.y,
        vdir: Math.atan2(player.velocity.y, player.velocity.x),
        type: "player",
        size: player.attributes.RENDER_RADIUS,
        dir: player.direction
      });
      var killedByInfo = player.hurtByInfo;
      if (killedByInfo.type == 'player' || killedByInfo.type == 'petal') {
        var killedBy;
        if (killedByInfo.type == 'player') {
          killedBy = this.players[killedByInfo.id];
        } else if (killedByInfo.type == 'petal') {
          killedBy = this.players[killedByInfo.id.playerID];
        }
        if (killedBy) {
          killedBy.score += Math.floor(_entity_attributes["default"].PLAYER + player.score * _constants["default"].SCORE_LOOTING_COEFFICIENT);
          killedBy.addExp(_entity_attributes["default"].PLAYER.EXPERIENCE + player.totalExp * _constants["default"].EXP_LOOTING_COEFFICIENT);
          if (this.getRankOnLeaderboard(killedBy.id) > 0) {
            // avoid crashing when two players kill each other at the exact same time
            // it will crash because the player who killed you is not on the leaderboard anymore
            // (the player who killed you is dead, and he has already been removed from leaderboard)
            this.updateLeaderboard(killedBy);
            killedBy.maxHp += 10;
          }
        }
      }
      this.removeFromLeaderboard(player);
      console.log("".concat(player.username, " is dead!"));
    }
  }, {
    key: "handlePetalDeaths",
    value: function handlePetalDeaths(player) {
      var _this3 = this;
      // make dead petals in cooldown
      player.petals.forEach(function (petals, slot) {
        petals.forEach(function (petal, index) {
          if (!petal.inCooldown) {
            if (petal.hp <= 0) {
              _this3.diedEntities.push({
                x: petal.x,
                y: petal.y,
                vdir: Math.atan2(petal.velocity.y, petal.velocity.x),
                type: petal.type,
                size: petal.attributes.RADIUS * petal.attributes.RENDER_RADIUS,
                dir: petal.direction
              });
              petal.chunks.forEach(function (chunk) {
                if (_this3.chunks[_this3.getChunkID(chunk)]) {
                  _this3.chunks[_this3.getChunkID(chunk)].splice(_this3.chunks[_this3.getChunkID(chunk)].findIndex(function (entityInChunk) {
                    return entityInChunk.type == 'petal' && entityInChunk.id == {
                      playerID: player.id,
                      petalID: petal.id
                    };
                  }), 1);
                }
              });
              if (petal.placeHolder != -1) {
                petal.inCooldown = true;
                player.reload(petal.slot, index);
                return;
              }
              player.petals.splice(slot, 1);
            }
          }
        });
      });
    }
  }, {
    key: "handlePlayerDeaths",
    value: function handlePlayerDeaths() {
      var _this4 = this;
      // handle mutiple player death
      Object.keys(this.sockets).forEach(function (playerID) {
        // handle player deaths
        var player = _this4.players[playerID];
        _this4.handlePetalDeaths(player);
        if (player.hp <= 0) {
          _this4.handlePlayerDeath(player);
        }
      });
      Object.keys(this.sockets).forEach(function (playerID) {
        // remove dead players
        var socket = _this4.sockets[playerID];
        var player = _this4.players[playerID];
        if (player.hp <= 0) {
          socket.emit(_constants["default"].MSG_TYPES.GAME_OVER);
          _this4.removePlayer(socket);
        }
      });
    }
  }, {
    key: "handleMobDeaths",
    value: function handleMobDeaths() {
      var _this5 = this;
      // remove dead mobs
      Object.keys(this.mobs).forEach(function (mobID) {
        var mob = _this5.mobs[mobID];
        if (!mob)
          // 这个生物已经不存在了
          return;
        if (mob.hpConnection && _this5.getEntity(mob.hpConnection).hp > 0) return;
        if (mob.hp <= 0) {
          var killedByInfo = mob.hurtByInfo;
          var killedBy;
          if (killedByInfo.type == 'player') {
            killedBy = _this5.players[killedByInfo.id];
          } else if (killedByInfo.type == 'petal') {
            killedBy = _this5.players[killedByInfo.id.playerID];
          } else if (killedByInfo.type == 'mob' && _this5.mobs[killedByInfo.id]) {
            var killedByMob = _this5.mobs[killedByInfo.id];
            if (killedByMob.team != "mobTeam" && _this5.players[killedByMob.team]) {
              killedBy = _this5.players[killedByMob.team];
            }
          }
          if (killedBy) {
            killedBy.score += Math.floor(_entity_attributes["default"][mob.type].VALUE);
            killedBy.addExp(_entity_attributes["default"][mob.type].EXPERIENCE);
            if (_this5.getRankOnLeaderboard(killedBy.id) > 0) {
              _this5.updateLeaderboard(killedBy);
            }
          }
          ;
          mob.chunks.forEach(function (chunk) {
            if (_this5.chunks[_this5.getChunkID(chunk)]) {
              _this5.chunks[_this5.getChunkID(chunk)].splice(_this5.chunks[_this5.getChunkID(chunk)].findIndex(function (entityInChunk) {
                return entityInChunk.type == 'mob' && entityInChunk.id == mob.id;
              }), 1);
            }
          });
          _this5.areas[mob.birthplace].volumeTaken -= _entity_attributes["default"][mob.type].VOLUME;

          // console.log("a mob has juts been killed!");

          _this5.diedEntities.push({
            x: mob.x,
            y: mob.y,
            vdir: Math.atan2(mob.velocity.y, mob.velocity.x),
            type: mob.type,
            size: mob.attributes.RADIUS * mob.attributes.RENDER_RADIUS,
            dir: mob.direction,
            isMob: true
          });

          //召唤类花瓣重生
          if (_this5.players[mob.team] && mob.slot != undefined) {
            var player = _this5.players[mob.team];
            var petals = player.petals.find(function (petals) {
              return petals[0].slot == mob.slot;
            });
            petals.forEach(function (petal) {
              if (petal.id != mob.petalID) return;
              petal.mob.splice(petal.mob.indexOf(mob.id), 1);
              if (petal.mob.length == 0) {
                petal.isHide = false;
                player.reload(petal.slot, petal.idInPlaceHolder);
                player.updatePlaceHolder();
              }
            });
          }
          if (mob.attributes.CONTENT_RELEASE && !(mob.team != "mobTeam" && !_this5.players[mob.team])) {
            if (mob.attributes.CONTENT_RELEASE.ONDIE) {
              var releases = mob.attributes.CONTENT_RELEASE.ONDIE;
              var contents = mob.attributes.CONTENT;
              Object.entries(releases.RELEASE).forEach(function (_ref3) {
                var _ref4 = _slicedToArray(_ref3, 2),
                  type = _ref4[0],
                  number = _ref4[1];
                var isContentProjectile = _entity_attributes["default"][type].ATTACK_MODE == "PROJECTILE" ? true : false;
                var _loop = function _loop() {
                  if (contents[type] <= 0) return "break";
                  var newMob = _this5.spawnMob(type, mob.x, mob.y, mob.team, isContentProjectile, isContentProjectile ? _constants["default"].PROJECTILE_EXIST_TIME : Infinity);
                  if (mob.team != "mobTeam") {
                    var _player = _this5.getEntity(mob.team);
                    newMob.slot = mob.slot;
                    newMob.petalID = mob.petalID;
                    _player.pets[newMob.id] = newMob;
                    _player.petals.some(function (petals) {
                      var petal = petals.find(function (petal) {
                        return petal.id == newMob.petalID;
                      });
                      if (petal) {
                        petal.mob.push(newMob.id);
                        return true;
                      }
                    });
                  }
                  contents[type]--;
                };
                for (var time = 0; time < number; time++) {
                  var _ret = _loop();
                  if (_ret === "break") break;
                }
              });
            }
          }

          //创建掉落
          (function () {
            if (_this5.players[mob.team]) return;
            if (mob.attributes.DROP) _this5.createDrop(mob.attributes.DROP, mob.x, mob.y);
          })();

          //删除存于玩家的mob属性
          if (_this5.players[mob.team]) delete _this5.players[mob.team].pets[mobID];
          mob.segments.splice(mob.segments.indexOf(mob.id), 1);
          delete _this5.mobs[mobID];
        }
      });
    }

    // init
  }, {
    key: "init",
    value: function init(deltaT) {
      var _this6 = this;
      this.lightningPath = [];
      this.diedEntities = [];
      Object.values(this.mobs).forEach(function (mob) {
        var targetId = mob.target;
        if (!_this6.players[targetId] && !_this6.mobs[targetId]) mob.target = -1;
      });
    }

    // movement
  }, {
    key: "applyForces",
    value: function applyForces(deltaT) {
      var _this7 = this;
      Object.keys(this.sockets).forEach(function (playerID) {
        var player = _this7.players[playerID];
        player.applyForces(deltaT);
      });
      Object.values(this.mobs).forEach(function (mob) {
        mob.applyForces(deltaT);
      });
    }
  }, {
    key: "updateMovement",
    value: function updateMovement(deltaT) {
      var _this8 = this;
      Object.values(this.players).forEach(function (player) {
        player.updateMovement(deltaT);
      });
      Object.entries(this.mobs).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
          mobID = _ref6[0],
          mob = _ref6[1];
        if (mob.sensitization || mob.attributes.ATTACK_MODE == "EVIL") {
          //判断mob是否为主动型生物,为mob寻找目标
          if (mob.target == -1 || !(_this8.players[mob.target] || _this8.mobs[mob.target])) {
            //没有目标或者目标不存在
            var distances = [],
              ids = [];
            if (mob.team == "mobTeam") {
              var center = {
                x: mob.x,
                y: mob.y
              };
              Object.entries(_this8.players).forEach(function (_ref7) {
                var _ref8 = _slicedToArray(_ref7, 2),
                  id = _ref8[0],
                  player = _ref8[1];
                var distance = Math.sqrt(Math.pow(center.x - player.x, 2) + Math.pow(center.y - player.y, 2));
                if (distance < _constants["default"].MOB_ATTACK_RADIUS) {
                  distances.push(distance);
                  ids.push(id);
                }
                Object.entries(player.pets).forEach(function (_ref9) {
                  var _ref10 = _slicedToArray(_ref9, 2),
                    id = _ref10[0],
                    enemyMob = _ref10[1];
                  if (enemyMob.team == mob.team || enemyMob.isProjectile) return;
                  var distance = Math.sqrt(Math.pow(center.x - enemyMob.x, 2) + Math.pow(center.y - enemyMob.y, 2));
                  if (distance < _constants["default"].MOB_ATTACK_RADIUS) {
                    distances.push(distance);
                    ids.push(id);
                  }
                });
              });
            } else {
              //玩家队伍
              (function () {
                var player = _this8.players[mob.team];
                if (!player) return;
                var center = {
                  x: player.x,
                  y: player.y
                };
                Object.entries(_this8.players).forEach(function (_ref11) {
                  var _ref12 = _slicedToArray(_ref11, 2),
                    id = _ref12[0],
                    player = _ref12[1];
                  if (player.team == mob.team) return;
                  var distance = Math.sqrt(Math.pow(center.x - player.x, 2) + Math.pow(center.y - player.y, 2));
                  if (distance < _constants["default"].MOB_ATTACK_RADIUS) {
                    distances.push(distance);
                    ids.push(id);
                  }
                });
                Object.entries(_this8.mobs).forEach(function (_ref13) {
                  var _ref14 = _slicedToArray(_ref13, 2),
                    id = _ref14[0],
                    enemyMob = _ref14[1];
                  if (id == mobID || enemyMob.isProjectile || enemyMob.team == mob.team) return;

                  //寻找玩家附近的目标
                  if (Math.sqrt(Math.pow(center.x - enemyMob.x, 2) + Math.pow(center.y - enemyMob.y, 2)) > _constants["default"].MOB_ATTACK_RADIUS) return;

                  //寻找距离自己最近的目标
                  var distance = Math.sqrt(Math.pow(mob.x - enemyMob.x, 2) + Math.pow(mob.y - enemyMob.y, 2));
                  if (distance < _constants["default"].MOB_ATTACK_RADIUS) {
                    distances.push(distance);
                    ids.push(id);
                  }
                });
              })();
            }
            mob.target = ids[distances.indexOf(Math.min.apply(Math, distances))] || -1;
          }
        }
        var target = _this8.getEntity(mob.target);
        if (mob.bodyConnection && mob.segments.includes(mob.bodyConnection)) {
          return;
        }

        //获取目标失败或距离目标太远或离玩家（parent）太远，待机
        else if (!target || mob.distanceTo(target) > _constants["default"].MOB_ATTACK_RADIUS || mob.team != "mobTeam" && mob.distanceTo(_this8.getEntity(mob.team)) > _constants["default"].MOB_ATTACK_RADIUS) {
          mob.idle(deltaT, _this8.players[mob.team]);
        }

        //成功获取目标
        else if (target) {
          mob.updateMovement(deltaT, target);
          mob.aimAt(target);
        }
      });
      Object.values(this.drops).forEach(function (drop) {
        drop.updateMovement(deltaT);
      });
    }
  }, {
    key: "updateBodyConnection",
    value: function updateBodyConnection(deltaT) {
      var _this9 = this;
      Object.values(this.mobs).forEach(function (mob) {
        if (mob.bodyConnection && mob.segments.includes(mob.bodyConnection)) {
          mob.connectTo(_this9.getEntity(mob.bodyConnection));
        }
      });
    }
  }, {
    key: "updateVelocity",
    value: function updateVelocity(deltaT) {
      var _this10 = this;
      Object.keys(this.sockets).forEach(function (playerID) {
        var player = _this10.players[playerID];
        player.updateVelocity(deltaT);
      });
      Object.values(this.mobs).forEach(function (mob) {
        mob.updateVelocity(deltaT);
      });
      Object.values(this.drops).forEach(function (drop) {
        drop.updateVelocity(deltaT);
      });
    }
  }, {
    key: "applyVelocity",
    value: function applyVelocity(deltaT) {
      var _this11 = this;
      // apply velocity for each entity
      Object.values(this.mobs).forEach(function (mob) {
        mob.applyVelocity(deltaT);
      });
      Object.keys(this.sockets).forEach(function (playerID) {
        _this11.players[playerID].applyVelocity(deltaT);
      });
      Object.values(this.drops).forEach(function (drop) {
        drop.applyVelocity(deltaT);
      });
    }
  }, {
    key: "updateChunks",
    value: function updateChunks() {
      var _this12 = this;
      Object.keys(this.sockets).forEach(function (playerID) {
        var player = _this12.players[playerID];
        var playerChunks = player.updateChunks(); // update player
        if (playerChunks) {
          // update the player's chunks
          var chunksOld = playerChunks.chunksOld;
          var chunksNew = playerChunks.chunksNew;
          chunksOld.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              var idx = _this12.chunks[_this12.getChunkID(chunk)].findIndex(function (entityInChunk) {
                return entityInChunk.type == 'player' && entityInChunk.id == playerID;
              });
              if (idx != -1) _this12.chunks[_this12.getChunkID(chunk)].splice(idx, 1);
            }
          });
          chunksNew.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              _this12.chunks[_this12.getChunkID(chunk)].push({
                type: 'player',
                id: playerID
              });
            } else {
              _this12.chunks[_this12.getChunkID(chunk)] = new Array({
                type: 'player',
                id: playerID
              });
            }
          });
        }
        player.petals.forEach(function (petals) {
          petals.forEach(function (petal) {
            if (!petal.inCooldown) {
              var petalChunks = petal.updateChunks(petal.attributes.RADIUS);
              if (petalChunks) {
                // update the petals' chunks
                var _chunksOld = petalChunks.chunksOld;
                var _chunksNew = petalChunks.chunksNew;
                _chunksOld.forEach(function (chunk) {
                  if (_this12.chunks[_this12.getChunkID(chunk)]) {
                    var idx = _this12.chunks[_this12.getChunkID(chunk)].findIndex(function (entityInChunk) {
                      return entityInChunk.type == 'petal' && entityInChunk.id.playerID == playerID && entityInChunk.id.petalID == petal.id;
                    });
                    if (idx != -1) _this12.chunks[_this12.getChunkID(chunk)].splice(idx, 1);
                  }
                });
                _chunksNew.forEach(function (chunk) {
                  if (_this12.chunks[_this12.getChunkID(chunk)]) {
                    _this12.chunks[_this12.getChunkID(chunk)].push({
                      type: 'petal',
                      id: {
                        playerID: playerID,
                        petalID: petal.id
                      }
                    });
                  } else {
                    _this12.chunks[_this12.getChunkID(chunk)] = new Array({
                      type: 'petal',
                      id: {
                        playerID: playerID,
                        petalID: petal.id
                      }
                    });
                  }
                });
              }
            }
          });
        }); // update the player's petals
      });
      Object.values(this.mobs).forEach(function (mob) {
        var chunks = mob.updateChunks();
        if (chunks) {
          var chunksOld = chunks.chunksOld;
          var chunksNew = chunks.chunksNew;
          chunksOld.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              var idx = _this12.chunks[_this12.getChunkID(chunk)].findIndex(function (entityInChunk) {
                return entityInChunk.type == 'mob' && entityInChunk.id == mob.id;
              });
              if (idx != -1) _this12.chunks[_this12.getChunkID(chunk)].splice(idx, 1);
            }
          });
          chunksNew.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              _this12.chunks[_this12.getChunkID(chunk)].push({
                type: 'mob',
                id: mob.id
              });
            } else {
              _this12.chunks[_this12.getChunkID(chunk)] = new Array({
                type: 'mob',
                id: mob.id
              });
            }
          });
        }
      });
      Object.values(this.drops).forEach(function (drop) {
        var chunks = drop.updateChunks();
        if (chunks) {
          var chunksOld = chunks.chunksOld;
          var chunksNew = chunks.chunksNew;
          chunksOld.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              var idx = _this12.chunks[_this12.getChunkID(chunk)].findIndex(function (entityInChunk) {
                return entityInChunk.type == 'drop' && entityInChunk.id == drop.id;
              });
              if (idx != -1) _this12.chunks[_this12.getChunkID(chunk)].splice(idx, 1);
            }
          });
          chunksNew.forEach(function (chunk) {
            if (_this12.chunks[_this12.getChunkID(chunk)]) {
              _this12.chunks[_this12.getChunkID(chunk)].push({
                type: 'drop',
                id: drop.id
              });
            } else {
              _this12.chunks[_this12.getChunkID(chunk)] = new Array({
                type: 'drop',
                id: drop.id
              });
            }
          });
        }
      });
    }

    // mob spawn
  }, {
    key: "getNewMobID",
    value: function getNewMobID() {
      // get a new mob ID when a mob spawns
      this.mobID++;
      return "mob-".concat(this.mobID);
    }
  }, {
    key: "getNewDropID",
    value: function getNewDropID() {
      // get a new mob ID when a mob spawns
      this.dropID++;
      return "drop-".concat(this.dropID);
    }
  }, {
    key: "mobSpawn",
    value: function mobSpawn() {
      var _this13 = this;
      // spawns mobs
      Object.entries(_constants["default"].MAP_AREAS).forEach(function (_ref15) {
        var _ref16 = _slicedToArray(_ref15, 2),
          areaName = _ref16[0],
          areaAttribute = _ref16[1];
        var areaAttributesNow = _this13.areas[areaName];
        if (areaAttributesNow.mobSpawnTimer > 0) {
          areaAttributesNow.mobSpawnTimer--;
          return;
        }
        areaAttributesNow.mobSpawnTimer = areaAttribute.MOB_SPAWN_INTERVAL;
        var _loop2 = function _loop2() {
          var mobNumber = _this13.rnd(1, TOTAL_SPAWN_WEIGHT);
          var currentMobNumber = 0;
          Object.values(_entity_attributes["default"]).forEach(function (attribute) {
            if (attribute.ATTACK_MODE == "PROJECTILE" || attribute.IS_SEGMENT) return;
            Object.entries(attribute.SPAWN_AREA).forEach(function (_ref17) {
              var _ref18 = _slicedToArray(_ref17, 2),
                name = _ref18[0],
                weight = _ref18[1];
              if (currentMobNumber < mobNumber && currentMobNumber + weight >= mobNumber && areaName == name) {
                var startWidth = _constants["default"].MAP_AREAS[name].START_WIDTH;
                var startHeight = _constants["default"].MAP_AREAS[name].START_HEIGHT;
                var width = _constants["default"].MAP_AREAS[name].WIDTH;
                var height = _constants["default"].MAP_AREAS[name].HEIGHT;
                var spawnX = _this13.rnd(startWidth, width);
                var spawnY = _this13.rnd(startHeight, height);
                _this13.spawnMob(attribute.TYPE, spawnX, spawnY, "mobTeam");
              }
            });
          });
        };
        while (areaAttributesNow.volumeTaken < areaAttribute.MAX_VOLUME) {
          _loop2();
        }
      });
    }
  }, {
    key: "spawnMob",
    value: function spawnMob(type, spawnX, spawnY, team, isProjectile, existTime) {
      var _this14 = this;
      var newMobID = this.getNewMobID();
      var mob = new _mob["default"](newMobID, spawnX, spawnY, type, team, false, isProjectile, existTime);
      // console.log(mob.x, mob.y);
      mob.birthplace = this.getAreaNameByEntityPosition(mob.x, mob.y);
      this.areas[mob.birthplace].volumeTaken += mob.attributes.VOLUME;
      var offsetRadiusAttributes = mob.attributes.RADIUS_DEVIATION;
      if (offsetRadiusAttributes) {
        var offsetRadius = Math.floor(Math.random() * (offsetRadiusAttributes.MAX - offsetRadiusAttributes.MIN + 1)) + offsetRadiusAttributes.MIN;
        mob.attributes.RADIUS += offsetRadius;
        // mob.attributes.RENDER_RADIUS += offsetRadius;
        if (mob.attributes.HP_DEVIATION) {
          var offsetHp = Math.round(offsetRadius / (offsetRadiusAttributes.MAX - offsetRadiusAttributes.MIN) * (mob.attributes.HP_DEVIATION.MAX - mob.attributes.HP_DEVIATION.MIN));
          mob.attributes.MAX_HP += offsetHp;
          mob.hp += offsetHp;
          mob.maxHp += offsetHp;
        }
      }
      this.mobs[newMobID] = mob;

      //segment
      var mobSegmentAttributes = _entity_attributes["default"][type].SEGMENT;
      if (mobSegmentAttributes) {
        var segmentAngle = Math.random() * Math.PI * 2;
        var segmentCount = Math.floor(Math.random() * (mobSegmentAttributes.MAX - mobSegmentAttributes.MIN + 1)) + mobSegmentAttributes.MIN;
        var segmentRadius = _entity_attributes["default"][mobSegmentAttributes.NAME].RENDER_RADIUS;
        var mobRadius = _entity_attributes["default"][type].RENDER_RADIUS;
        var segments = [];
        segments.push(mob.id);
        for (var segmentNumber = 0; segmentNumber < segmentCount; segmentNumber++) {
          var lastArea = Object.values(_constants["default"].MAP_AREAS)[Object.keys(_constants["default"].MAP_AREAS).length - 1];
          var mapWidth = lastArea.START_WIDTH + lastArea.WIDTH,
            mapHeight = lastArea.START_HEIGHT + lastArea.HEIGHT;
          var newSpawnX = spawnX + (segmentRadius + mobRadius) * (segmentNumber + 1) * Math.sin(segmentAngle),
            newSpawnY = spawnY + (segmentRadius + mobRadius) * (segmentNumber + 1) * Math.cos(segmentAngle);
          if (newSpawnX < 0) newSpawnX = 0;else if (newSpawnX > mapWidth) newSpawnX = mapWidth;
          if (newSpawnY < 0) newSpawnY = 0;else if (newSpawnY > mapHeight) newSpawnY = mapHeight;
          var segment = this.spawnMob(mobSegmentAttributes.NAME, newSpawnX, newSpawnY, mob.team, false);
          segment.bodyConnection = segments[segmentNumber];
          segments.push(segment.id);
        }
        segments.forEach(function (id) {
          var segment = _this14.mobs[id];
          segment.segments = segments;
          if (segment.attributes.HP_CONNECT) {
            segment.hpConnection = mob.id;
            mob.hp += segment.hp;
            mob.maxHp += segment.maxHp;
            segment.hp = 0;
            segment.maxHp = 0;
          }
        });
      }

      //this.appendEntityToBlock(`mob`, this.mobs[newMobID]);

      return this.mobs[newMobID];
    }

    // solve collisions
  }, {
    key: "solveCollisions",
    value: function solveCollisions(deltaT) {
      var _this15 = this;
      // handle collisions
      var collisions = [];
      Object.values(this.chunks).forEach(function (entitiesInChunk) {
        var entityCount = entitiesInChunk.length;
        if (entityCount <= 1) {
          return;
        }
        for (var i = 0; i < entityCount - 1; i++) {
          var _loop3 = function _loop3() {
            var entityInfoA = entitiesInChunk[i];
            var entityInfoB = entitiesInChunk[j];
            var entityA, entityB;
            if (entityInfoA.type == 'player') {
              entityA = _this15.players[entityInfoA.id];
            } else if (entityInfoA.type == 'mob') {
              entityA = _this15.mobs[entityInfoA.id];
            } else if (entityInfoA.type == 'petal') {
              if (!_this15.players[entityInfoA.id.playerID]) return "continue";
              try {
                _this15.players[entityInfoA.id.playerID].petals.forEach(function (petals) {
                  petals.forEach(function (petal) {
                    if (petal.id == entityInfoA.id.petalID) {
                      if (petal.inCooldown || petal.isHide) {
                        throw Error();
                      } else {
                        entityA = petal;
                      }
                    }
                  });
                });
              } catch (e) {
                return "continue";
              }
            } else if (entityInfoA.type == 'drop') {
              entityA = _this15.drops[entityInfoA.id];
            }
            if (entityInfoB.type == 'player') {
              entityB = _this15.players[entityInfoB.id];
            } else if (entityInfoB.type == 'mob') {
              entityB = _this15.mobs[entityInfoB.id];
            } else if (entityInfoB.type == 'petal') {
              if (!_this15.players[entityInfoB.id.playerID]) return "continue";
              try {
                _this15.players[entityInfoB.id.playerID].petals.forEach(function (petals) {
                  petals.forEach(function (petal) {
                    if (petal.id == entityInfoB.id.petalID) {
                      if (petal.inCooldown) {
                        throw Error();
                      } else {
                        entityB = petal;
                      }
                    }
                  });
                });
              } catch (e) {
                return "continue";
              }
            } else if (entityInfoB.type == 'drop') {
              entityB = _this15.drops[entityInfoB.id];
            }
            if (!entityA || !entityB) return "continue";
            if (entityA.team == entityB.team && (entityInfoA.type == 'petal' || entityInfoB.type == 'petal')) // petals do not collide with anything of the same team
              return "continue";
            if (entityA.team == entityB.team && (entityA.attributes.ATTACK_MODE == 'PROJECTILE' || entityB.attributes.ATTACK_MODE == 'PROJECTILE')) return "continue";
            var distance = entityA.distanceTo(entityB);
            var r1 = entityA.attributes.RADIUS,
              r2 = entityB.attributes.RADIUS;
            if (distance < r1 + r2) {
              collisions.push({
                infoA: entityInfoA,
                infoB: entityInfoB
              });
            }
          };
          for (var j = i + 1; j < entityCount; j++) {
            var _ret2 = _loop3();
            if (_ret2 === "continue") continue;
          }
        }
      });
      collisions = collisions.reduce(function (accumulator, cur) {
        if (!accumulator.find(function (item) {
          var sameA = false,
            sameB = false;
          if (item.infoA.type != 'petal') {
            sameA = item.infoA.type == cur.infoA.type && item.infoA.id == cur.infoA.id;
          } else {
            sameA = item.infoA.id.playerID == cur.infoA.id.playerID && item.infoA.id.petalID == cur.infoA.id.petalID;
          }
          if (item.infoB.type != 'petal') {
            sameB = item.infoB.type == cur.infoB.type && item.infoB.id == cur.infoB.id;
          } else {
            sameB = item.infoB.id.playerID == cur.infoB.id.playerID && item.infoB.id.petalID == cur.infoB.id.petalID;
          }
          return sameA && sameB;
        })) {
          accumulator.push(cur);
        }
        return accumulator;
      }, []);
      var _loop4 = function _loop4() {
        var collision = collisions[i];
        var entityInfoA = collision.infoA,
          entityInfoB = collision.infoB;
        var entityA, entityB;
        if (entityInfoA.type == 'player') {
          entityA = _this15.players[entityInfoA.id];
        } else if (entityInfoA.type == 'mob') {
          entityA = _this15.mobs[entityInfoA.id];
        } else if (entityInfoA.type == 'petal') {
          if (!_this15.players[entityInfoA.id.playerID]) return "continue";
          try {
            _this15.players[entityInfoA.id.playerID].petals.forEach(function (petals) {
              petals.forEach(function (petal) {
                if (petal.id == entityInfoA.id.petalID) {
                  if (petal.inCooldown) {
                    throw Error();
                  } else {
                    entityA = petal;
                  }
                }
              });
            });
          } catch (e) {
            return "continue";
          }
        } else if (entityInfoA.type == 'drop') {
          entityA = _this15.drops[entityInfoA.id];
        }
        if (entityInfoB.type == 'player') {
          entityB = _this15.players[entityInfoB.id];
        } else if (entityInfoB.type == 'mob') {
          entityB = _this15.mobs[entityInfoB.id];
        } else if (entityInfoB.type == 'petal') {
          if (!_this15.players[entityInfoB.id.playerID]) return "continue";
          try {
            _this15.players[entityInfoB.id.playerID].petals.forEach(function (petals) {
              petals.forEach(function (petal) {
                if (petal.id == entityInfoB.id.petalID) {
                  if (petal.inCooldown) {
                    throw Error();
                  } else {
                    entityB = petal;
                  }
                }
              });
            });
          } catch (e) {
            return "continue";
          }
        } else if (entityInfoB.type == 'drop') {
          entityB = _this15.drops[entityInfoB.id];
        }
        if (!entityA || !entityB) return "continue";

        //是否为玩家与掉落
        if (entityA.type == "PLAYER" && entityB.team == "drop") {
          var isCollectSuccess = _this15.givePetal(entityA, entityB.type);
          if (isCollectSuccess) delete _this15.drops[entityB.id];
          return "continue";
        } else if (entityB.type == "PLAYER" && entityA.team == "drop") {
          var _isCollectSuccess = _this15.givePetal(entityB, entityA.type);
          if (_isCollectSuccess) delete _this15.drops[entityA.id];
          return "continue";
        }
        if (entityA.team == "drop" || entityB.team == "drop") return "continue";
        var distance = entityA.distanceTo(entityB);
        var r1 = entityA.attributes.RADIUS,
          r2 = entityB.attributes.RADIUS;
        var depth = r1 + r2 - distance;
        var mA = entityA.attributes.MASS,
          mB = entityB.attributes.MASS;
        var theta2 = Math.atan2(entityA.x - entityB.x, entityB.y - entityA.y); // orientation of A relative to B
        var theta1 = theta2 - Math.PI; // orientation of B relative to A
        var penetrationDepthWeightInCollision = _constants["default"].PENETRATION_DEPTH_WEIGHT_IN_COLLISION;
        var velA = depth * penetrationDepthWeightInCollision * mB / (mA + mB);
        var velB = depth * penetrationDepthWeightInCollision * mA / (mA + mB);
        entityA.constraintVelocity.x += velA * Math.sin(theta2) / deltaT;
        entityA.constraintVelocity.y += velA * Math.cos(theta2) / deltaT;
        entityB.constraintVelocity.x += velB * Math.sin(theta1) / deltaT;
        entityB.constraintVelocity.y += velB * Math.cos(theta1) / deltaT;
        if (entityA.team != entityB.team) {
          if (entityInfoA.type == 'player') {
            entityA.velocity.x += velA * Math.sin(theta2) / deltaT;
            entityA.velocity.y += velA * Math.cos(theta2) / deltaT;
            var baseKnockback = _constants["default"].BASE_KNOCKBACK;
            var knockbackA = baseKnockback * mB / (mA + mB);
            entityA.velocity.x += knockbackA * Math.sin(theta2);
            entityA.velocity.y += knockbackA * Math.cos(theta2);
            if (entityInfoB.type == 'petal') {
              _this15.players[entityB.parent].hp -= entityB.attributes.DAMAGE * entityA.damageReflect * (1 + entityB.fragile);
            } else if (entityInfoB.type == 'player') {
              entityA.hp -= entityA.attributes.DAMAGE * entityB.damageReflect * (1 + entityA.fragile);
              entityB.hp -= entityB.attributes.DAMAGE * entityA.damageReflect * (1 + entityB.fragile);
              if (entityA.bodyToxicity > 0) {
                if (entityB.poison * entityB.poisonTime < entityA.bodyPoison) {
                  entityB.poison = entityA.bodyToxicity;
                  entityB.poisonTime = entityA.bodyPoison / entityA.bodyToxicity;
                }
              }
              if (entityB.bodyToxicity > 0) {
                if (entityA.poison * entityA.poisonTime < entityB.bodyPoison) {
                  entityA.poison = entityB.bodyToxicity;
                  entityA.poisonTime = entityB.bodyPoison / entityB.bodyToxicity;
                }
              }
            }
          }
          if (entityInfoB.type == 'player') {
            entityB.velocity.x += velB * Math.sin(theta1) / deltaT;
            entityB.velocity.y += velB * Math.cos(theta1) / deltaT;
            var _baseKnockback = _constants["default"].BASE_KNOCKBACK;
            var knockbackB = _baseKnockback * mA / (mA + mB);
            entityB.velocity.x += knockbackB * Math.sin(theta1);
            entityB.velocity.y += knockbackB * Math.cos(theta1);
            if (entityInfoA.type == 'petal') {
              _this15.players[entityA.parent].hp -= entityA.attributes.DAMAGE * entityB.damageReflect * (1 + entityA.fragile);
            }
          }
          var dmgA = entityB.attributes.DAMAGE * (1 + entityA.fragile);
          var dmgB = entityA.attributes.DAMAGE * (1 + entityB.fragile);

          //第一个if是吸血相关的
          if (!entityA.segments.includes(entityB.id) && !entityB.segments.includes(entityA.id) || !(entityA.attributes.TRIGGERS.VAMPIRISM || entityB.attributes.TRIGGERS.VAMPIRISM)) {
            if (dmgA != 0) {
              entityA.isHurt = true;
            }
            if (dmgB != 0) {
              entityB.isHurt = true;
            }
            if (entityA.hpConnection) {
              _this15.getEntity(entityA.hpConnection).hp -= dmgA;
            } else {
              entityA.hp -= dmgA;
            }
            if (entityB.hpConnection) {
              _this15.getEntity(entityB.hpConnection).hp -= dmgB;
            } else {
              entityB.hp -= dmgB;
            }
          }
          _this15.releaseCollisionSkill(entityA, entityB, entityInfoB);
          _this15.releaseCollisionSkill(entityB, entityA, entityInfoA);
        }
      };
      for (var i = 0; i < collisions.length; i++) {
        var _ret3 = _loop4();
        if (_ret3 === "continue") continue;
      }
    }
  }, {
    key: "releaseCollisionSkill",
    value: function releaseCollisionSkill(entityA, entityB, entityInfo) {
      var _this16 = this;
      if (entityB.attributes.TRIGGERS) {
        if (entityB.attributes.TRIGGERS.NO_HEAL) {
          entityA.noHeal = entityB.attributes.TRIGGERS.NO_HEAL;
        }
        if (entityB.attributes.TRIGGERS.POISON) {
          if (entityA.poison * entityA.poisonTime < entityB.attributes.TRIGGERS.POISON) {
            entityA.poison = entityB.attributes.TRIGGERS.TOXICITY;
            entityA.poisonTime = entityB.attributes.TRIGGERS.POISON / entityB.attributes.TRIGGERS.TOXICITY;
          }
        }
        if (entityB.attributes.TRIGGERS.PUNCTURE) {
          if (entityA.puncture < entityB.attributes.TRIGGERS.PUNCTURE) {
            entityA.puncture = entityB.attributes.TRIGGERS.PUNCTURE;
            entityA.fragile = entityB.attributes.TRIGGERS.PUNCTURE_DAMAGE;
          }
        }
        if (entityB.attributes.TRIGGERS.LIGHTNING && entityB.attributes.TRIGGERS.LIGHTNING.COLLIDE) {
          this.lightning(entityB, entityA, entityInfo);
        }
        if (entityB.attributes.TRIGGERS.VAMPIRISM) {
          if (entityB.attributes.TRIGGERS.VAMPIRISM.COLLIDE) {
            entityB.hp = Math.min(entityB.maxHp, entityB.hp + entityB.attributes.DAMAGE * entityB.attributes.TRIGGERS.VAMPIRISM.HEAL);
            entityA.isHurt = true;
            if (entityB.attributes.TRIGGERS.VAMPIRISM.HEAL_PLAYER) {
              var player = this.getEntity(entityInfo.id.playerID);
              player.hp = Math.min(player.maxHp, player.hp + entityB.attributes.DAMAGE * entityB.attributes.TRIGGERS.VAMPIRISM.HEAL_PLAYER);
            }
          } else if (entityB.target == entityA.id) {
            entityB.bodyConnection = entityA.id;
            entityB.segments.push(entityA.id);
          }
        }
      }
      if (entityA.attributes.CONTENT_RELEASE) {
        if (entityA.attributes.CONTENT_RELEASE.ONHIT) {
          var releases = entityA.attributes.CONTENT_RELEASE.ONHIT;
          var contents = entityA.attributes.CONTENT;
          var correctTimes = Math.floor((entityA.maxHp - entityA.hp) / releases.HP);
          if (correctTimes > releases.TIMES) {
            releases.TIMES = correctTimes;
            Object.entries(releases.RELEASE).forEach(function (_ref19) {
              var _ref20 = _slicedToArray(_ref19, 2),
                type = _ref20[0],
                number = _ref20[1];
              var isContentProjectile = _entity_attributes["default"][type].ATTACK_MODE == "PROJECTILE" ? true : false;
              var _loop5 = function _loop5() {
                if (contents[type] <= 0) return "break";
                var newMob = _this16.spawnMob(type, entityA.x, entityA.y, entityA.team, isContentProjectile, isContentProjectile ? _constants["default"].PROJECTILE_EXIST_TIME : Infinity);
                if (entityA.team != "mobTeam") {
                  var _player2 = _this16.getEntity(entityA.team);
                  newMob.slot = entityA.slot;
                  newMob.petalID = entityA.petalID;
                  _player2.pets[newMob.id] = newMob;
                  _player2.petals.some(function (petals) {
                    var petal = petals.find(function (petal) {
                      return petal.id == newMob.petalID;
                    });
                    if (petal) {
                      petal.mob.push(newMob.id);
                      return true;
                    }
                  });
                }
                contents[type]--;
              };
              for (var time = 0; time < number; time++) {
                var _ret4 = _loop5();
                if (_ret4 === "break") break;
              }
            });
          }
        }
      }
      if (entityA.puncture > 0) {
        entityA.puncture--;
      }
      if (entityA.puncture == 0) {
        entityA.fragile = 0;
      }
      if (entityB.attributes.ATTACK_MODE == "PROJECTILE") {
        entityA.hurtByInfo = {
          type: entityInfo.type,
          id: entityB.shootBy
        };
        return;
      }
      entityA.hurtByInfo = entityInfo;
    }
  }, {
    key: "applyConstraintVelocity",
    value: function applyConstraintVelocity(deltaT) {
      var _this17 = this;
      Object.values(this.mobs).forEach(function (mob) {
        mob.applyConstraintVelocity(deltaT);
      });
      Object.keys(this.sockets).forEach(function (playerID) {
        _this17.players[playerID].applyConstraintVelocity(deltaT);
      });
    }
  }, {
    key: "handleBorder",
    value: function handleBorder() {
      var _this18 = this;
      Object.keys(this.sockets).forEach(function (playerID) {
        var player = _this18.players[playerID];
        player.handleBorder();
      });
      Object.values(this.mobs).forEach(function (mob) {
        mob.handleBorder();
      });
      Object.values(this.drops).forEach(function (drop) {
        drop.handleBorder();
      });
    }

    // update players and mobs
  }, {
    key: "updatePlayers",
    value: function updatePlayers(deltaT) {
      var _this19 = this;
      Object.keys(this.sockets).forEach(function (playerID) {
        var player = _this19.players[playerID];
        if (_this19.getAreaNameByEntityPosition(player.x, player.y) == "OCEAN") {
          if (player.oxygen < 0) {
            player.suffocateTime += deltaT;
          } else {
            player.oxygen -= deltaT;
            player.suffocateTime = 0;
          }
        } else {
          player.oxygen = _constants["default"].PLAYER_OXYGEN;
          player.suffocateTime = 0;
        }
        player.update(deltaT);
        player.petals.forEach(function (petals) {
          petals.forEach(function (petal) {
            //召唤类花瓣召唤
            if (petal.attributes.TRIGGERS.SUMMON && !petal.disabled && !petal.inCooldown && !petal.isHide) {
              if (petal.actionCooldown > 0) {
                petal.actionCooldown -= deltaT;
                return;
              }
              petal.isHide = true;
              player.updatePlaceHolder();
              player.updatePetalSlot();
              var mob = _this19.spawnMob(petal.attributes.TRIGGERS.SUMMON, petal.x, petal.y, petal.team);
              mob.segments.forEach(function (segmentID) {
                var segment = _this19.mobs[segmentID];
                segment.slot = petal.slot;
                segment.petalID = petal.id;
                player.pets[segment.id] = segment;
                petal.mob.push(segmentID);
              });
            }
          });
        });
      });
    }
  }, {
    key: "updateMobs",
    value: function updateMobs(deltaT) {
      var _this20 = this;
      Object.values(this.mobs).forEach(function (mob) {
        //技能
        (function () {
          var targetId = mob.target;
          if (!mob.attributes.TRIGGERS || targetId == -1) return;
          if (mob.skillCoolDownTimer < mob.skillCoolDown) {
            mob.skillCoolDownTimer += deltaT;
            return;
          }
          ;
          if (!mob.isSkillenable) return;
          if (mob.attributes.TRIGGERS.SHOOT) {
            mob.skillCoolDownTimer = 0;
            var projectile = _this20.spawnMob(mob.attributes.TRIGGERS.SHOOT, mob.x, mob.y, mob.team, true, 2.5);
            projectile.movement = {
              direction: mob.direction,
              speed: projectile.attributes.SPEED
            };

            //后坐力
            mob.velocity.x = Math.sin(mob.direction) * -200;
            mob.velocity.y = Math.cos(mob.direction) * -200;
            projectile.direction = mob.direction;
            projectile.shootBy = mob.id;
            return;
          }
          if (mob.attributes.TRIGGERS.LIGHTNING) {
            mob.skillCoolDownTimer = 0;
            _this20.lightning(mob, _this20.getEntity(targetId), {
              type: "mob",
              id: mob.id
            });
            return;
          }
          if (mob.attributes.TRIGGERS.VAMPIRISM && !mob.attributes.TRIGGERS.VAMPIRISM.COLLIDE) {
            var target = _this20.getEntity(targetId);
            if (mob.bodyConnection == target.id) {
              mob.skillCoolDownTimer = 0;
              target.hp -= mob.attributes.TRIGGERS.VAMPIRISM.DAMAGE;
              mob.hp += mob.attributes.TRIGGERS.VAMPIRISM.DAMAGE * mob.attributes.TRIGGERS.VAMPIRISM.HEAL;
              target.isHurt = true;
              _this20.releaseCollisionSkill(target, mob, {
                type: "mob",
                id: mob.id
              });
            }
            return;
          }
        })();

        //存活时间
        (function () {
          if (mob.existTime > 0) {
            mob.existTime -= deltaT;
          }
          if (mob.existTime <= 0) {
            mob.hp = 0;
          }
        })();

        //毒
        (function () {
          if (mob.poisonTime <= 0) {
            mob.poison = 0;
            return;
          }
          if (!mob.poison) return;
          mob.hp -= mob.poison * deltaT;
          mob.poisonTime -= deltaT;
        })();

        //友军mob检测花瓣是否仍然存在
        (function () {
          if (mob.team != "mobTeam" && mob.attributes.ATTACK_MODE != 'PROJECTILE') {
            var petalIDs = [],
              isPetalInCooldown = [];
            var player = _this20.players[mob.team];
            if (!player) return;
            player.petals[mob.slot].forEach(function (petal) {
              petalIDs.push(petal.id);
              isPetalInCooldown.push(petal.inCooldown);
            });
            if (petalIDs.includes(mob.petalID) && !isPetalInCooldown[petalIDs.indexOf(mob.petalID)]) {
              return;
            }
            ;
            mob.hp = -1;
          }
        })();

        //窒息伤害
        (function () {
          /* 找出mob出现在地图外原因后即可删除以下代码 */
          if (mob.x < 0 || mob.y < 0 || mob.x > _constants["default"].MAP_WIDTH || mob.y > _constants["default"].MAP_HEIGHT) return;
          /* 找出mob出现在地图外原因后即可删除以上代码 */
          if (_this20.getAreaNameByEntityPosition(mob.x, mob.y) == "OCEAN" && mob.attributes.ATTACK_MODE != 'PROJECTILE' && !mob.attributes.AQUATIC) {
            mob.hp -= _constants["default"].SUFFOCATE_DAMAGE_BASE * deltaT + mob.suffocateTime * deltaT * _constants["default"].SUFFOCATE_DAMAGE_IMPROVE;
            mob.suffocateTime += deltaT;
            return;
          }
          mob.suffocateTime = 0;
        })();
      });
    }

    // handle drops
  }, {
    key: "createDrop",
    value: function createDrop(drops, x, y) {
      var _this21 = this;
      var actionMovement = {
        direction: 0,
        speed: 0
      };
      var baseAngle = Math.PI / 2;
      var successDrops = Object.entries(drops).filter(function (_ref21) {
        var _ref22 = _slicedToArray(_ref21, 2),
          type = _ref22[0],
          chance = _ref22[1];
        return _this21.chance(chance);
      }); // getting success drops;
      var dropCount = successDrops.length;
      successDrops.forEach(function (_ref23, dropNumber) {
        var _ref24 = _slicedToArray(_ref23, 1),
          type = _ref24[0];
        if (dropCount > 1) {
          actionMovement = {
            direction: baseAngle + dropNumber / dropCount * 2 * Math.PI,
            speed: Math.sqrt(_constants["default"].DROP_SPREAD_DISTANCE * Math.pow(Math.sin(actionMovement.direction), 2) + _constants["default"].DROP_SPREAD_DISTANCE * Math.pow(Math.cos(actionMovement.direction), 2)) / _constants["default"].DROP_ACTION_TIME
          };
        }
        var newDropID = _this21.getNewDropID();
        _this21.drops[newDropID] = new _drop["default"](newDropID, x, y, type, 2.5);
        _this21.drops[newDropID].movement = actionMovement;
        //this.appendEntityToBlock(`drop`, this.drops[newDropID]);
      });
    }
  }, {
    key: "givePetal",
    value: function givePetal(player, newPetal) {
      var primarySlot = player.primaryPetals.indexOf("EMPTY");
      var secondarySlot = player.secondaryPetals.indexOf("EMPTY");
      if (primarySlot != -1) {
        player.primaryPetals[primarySlot] = newPetal;
        player.switched = true;
        var times = _petal_attributes["default"][newPetal].COUNT - player.petals[primarySlot].length;
        for (var i = 0; i < times; i++) {
          var petal = player.newPetal(newPetal, player.getNewPetalID(), primarySlot * _constants["default"].PETAL_MULTIPLE_MAX + i, primarySlot, primarySlot);
          player.petals[primarySlot].push(petal);
        }
        player.petals[primarySlot].forEach(function (petal, index) {
          petal.isHide = false;
          petal.idInPlaceHolder = index;
          petal.disabled = false;
          petal.type = newPetal;
          petal.updateAttributes();
          petal.cooldown = petal.attributes.RELOAD;
          petal.inCooldown = true;
        });
        player.updatePlaceHolder();
        player.updatePetalSlot();
        return true;
      } else if (secondarySlot != -1) {
        player.secondaryPetals[secondarySlot] = newPetal;
        player.switched = true;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: "handleDropDeaths",
    value: function handleDropDeaths() {
      var _this22 = this;
      Object.values(this.drops).forEach(function (drop) {
        if (drop.existTime > 0) return;
        drop.chunks.forEach(function (chunk) {
          if (_this22.chunks[_this22.getChunkID(chunk)]) {
            _this22.chunks[_this22.getChunkID(chunk)].splice(_this22.chunks[_this22.getChunkID(chunk)].findIndex(function (entityInChunk) {
              return entityInChunk.type == 'drop' && entityInChunk.id == drop.id;
            }), 1);
          }
        });

        //this.removeEntityFromBlock(`drop`, drop);

        delete _this22.drops[drop.id];
      });
    }
  }, {
    key: "updateDrops",
    value: function updateDrops(deltaT) {
      Object.values(this.drops).forEach(function (drop) {
        drop.existTime -= deltaT;
      });
    }

    // update
  }, {
    key: "update",
    value: function update() {
      // updates the game every tick
      var now = Date.now();
      var deltaT = 1 / _constants["default"].TICK_PER_SECOND;
      this.lastUpdateTime = now;
      this.init(deltaT);
      this.mobSpawn();
      this.updateDrops(deltaT);
      this.updateBodyConnection(deltaT);
      this.updateMovement(deltaT);
      this.updateVelocity(deltaT);
      this.applyVelocity(deltaT);
      this.updateBodyConnection(deltaT);
      this.handleBorder();
      this.updateMobs(deltaT);
      this.updatePlayers(deltaT);
      this.solveCollisions(deltaT);
      this.updateChunks();
      this.applyConstraintVelocity(deltaT);
      this.handleBorder();
      this.info = {
        mspt: Date.now() - now,
        mobCount: Object.keys(this.mobs).length,
        mobVol: this.areas.GARDEN.volumeTaken //this.areas[this.getAreaNameByEntityPosition(this.rnd(0, 20000), this.rnd(0, 4000))].volumeTaken,
      };
      this.handlePlayerDeaths();
      this.handleMobDeaths();
      this.handleDropDeaths();
      this.sendUpdate();
    }

    // send update
  }, {
    key: "sendUpdate",
    value: function sendUpdate() {
      var _this23 = this;
      // send update to each client
      Object.keys(this.sockets).forEach(function (playerID) {
        var socket = _this23.sockets[playerID];
        var player = _this23.players[playerID];
        socket.emit(_constants["default"].MSG_TYPES.GAME_UPDATE, _this23.createUpdate(player));
      });
    }
  }, {
    key: "createUpdate",
    value: function createUpdate(player) {
      // create the update and return to sendUpdate()
      var nearbyPlayers = Object.values(this.players).filter(function (p) {
        return p !== player && p.distanceTo(player) <= _constants["default"].NEARBY_DISTANCE;
      }); // getting nearby players

      var nearbyMobs = Object.values(this.mobs).filter(function (e) {
        return e.distanceTo(player) <= _constants["default"].NEARBY_DISTANCE;
      }); // getting nearby mobs

      var nearbyDrops = Object.values(this.drops).filter(function (e) {
        return e.distanceTo(player) <= _constants["default"].NEARBY_DISTANCE;
      }); // getting nearby drops

      return {
        t: Date.now(),
        // current time
        info: this.info,
        leaderboard: this.leaderboard.slice(0, _constants["default"].LEADERBOARD_LENGTH + 1),
        // leaderboard
        rankOnLeaderboard: this.getRankOnLeaderboard(player.id),
        // this player's rank on leaderboard
        me: player.serializeForUpdate(true),
        // this player
        others: nearbyPlayers.map(function (p) {
          return p.serializeForUpdate(false);
        }),
        // nearby players
        playerCount: Object.keys(this.players).length,
        // the number of players online
        mobs: nearbyMobs.map(function (e) {
          return e.serializeForUpdate();
        }),
        drops: nearbyDrops.map(function (e) {
          return e.serializeForUpdate();
        }),
        lightningPath: this.lightningPath,
        diedEntities: this.diedEntities
      };
    }
  }, {
    key: "lightning",
    value: function lightning(start, target, entityInfo) {
      var _this24 = this;
      var possibleEntityPositions = [];
      var lightningPath = [];
      lightningPath.push({
        x: start.x,
        y: start.y
      });
      lightningPath.push({
        x: target.x,
        y: target.y
      });

      //寻找可能被连锁的实体，提升效率
      Object.entries(this.players).forEach(function (_ref25) {
        var _ref26 = _slicedToArray(_ref25, 2),
          id = _ref26[0],
          player = _ref26[1];
        if (id == start.team) return;
        if (Math.sqrt(Math.pow(player.x - target.x, 2) + Math.pow(player.y - target.y, 2)) <= _constants["default"].LIGHTNING_LENGTH * start.attributes.TRIGGERS.LIGHTNING.COUNT) {
          possibleEntityPositions.push([player.x, player.y, id]);
        }
      });
      Object.entries(this.mobs).forEach(function (_ref27) {
        var _ref28 = _slicedToArray(_ref27, 2),
          id = _ref28[0],
          mob = _ref28[1];
        if (mob.team == start.team) return;
        if (Math.sqrt(Math.pow(mob.x - target.x, 2) + Math.pow(mob.y - target.y, 2)) <= _constants["default"].LIGHTNING_LENGTH * start.attributes.TRIGGERS.LIGHTNING.COUNT) {
          possibleEntityPositions.push([mob.x, mob.y, id]);
        }
      });

      //指定接触目标为正在被连锁的实体并造成伤害
      target.hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + target.fragile);
      target.hurtByInfo = entityInfo;
      var damagingEntityPosition = {
        x: target.x,
        y: target.y
      };
      var damagedEntity = [];
      damagedEntity.push(target.id);

      //连锁
      var _loop6 = function _loop6() {
        var distances = [],
          ids = [];

        //寻找与正在被连锁的实体附近小于等于闪电连锁距离的实体
        possibleEntityPositions.forEach(function (_ref29) {
          var _ref30 = _slicedToArray(_ref29, 3),
            entityX = _ref30[0],
            entityY = _ref30[1],
            id = _ref30[2];
          if (damagedEntity.includes(id)) return;
          var distance = Math.sqrt(Math.pow(entityX - damagingEntityPosition.x, 2) + Math.pow(entityY - damagingEntityPosition.y, 2));
          if (distance <= _constants["default"].LIGHTNING_LENGTH) {
            distances.push(distance);
            ids.push(id);
          }
        });

        //寻找与正在被连锁实体最近的实体（距离小于等于闪电连锁范围），没有就退出循环
        var nextTargetEntityId = ids[distances.indexOf(Math.min.apply(Math, distances))];
        if (!nextTargetEntityId) return "break";

        //对该实体进行伤害并指定其为正在被连锁的实体
        var nextTargetEntity = _this24.getEntity(nextTargetEntityId);
        if (nextTargetEntity.hpConnection) {
          _this24.getEntity(nextTargetEntity.hpConnection).hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + nextTargetEntity.fragile);
        } else {
          nextTargetEntity.hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + nextTargetEntity.fragile);
        }
        nextTargetEntity.hurtByInfo = entityInfo;
        damagingEntityPosition.x = nextTargetEntity.x;
        damagingEntityPosition.y = nextTargetEntity.y;
        lightningPath.push({
          x: damagingEntityPosition.x,
          y: damagingEntityPosition.y
        });
        damagedEntity.push(nextTargetEntityId);
      };
      for (var times = 1; times < start.attributes.TRIGGERS.LIGHTNING.COUNT; times++) {
        var _ret5 = _loop6();
        if (_ret5 === "break") break;
      }
      this.lightningPath.push(lightningPath);
    }

    // other functions
  }, {
    key: "rnd",
    value: function rnd(x, y) {
      // returns a random number in range [x, y]
      return Math.random() * y + x;
    }
  }, {
    key: "getChunkID",
    value: function getChunkID(chunk) {
      // gets the ID of the chunk
      return chunk.x * _constants["default"].CHUNK_ID_CONSTANT + chunk.y;
    }
  }, {
    key: "getEntity",
    value: function getEntity(id) {
      return this.players[id] || this.mobs[id] && this.mobs[id] || false;
    }
  }, {
    key: "chance",
    value: function chance(_chance) {
      return Math.random() < _chance;
    }
  }, {
    key: "getAreaNameByEntityPosition",
    value: function getAreaNameByEntityPosition(x, y) {
      var areasArray = Object.entries(_constants["default"].MAP_AREAS);
      var result = areasArray.find(function (_ref31) {
        var _ref32 = _slicedToArray(_ref31, 2),
          name = _ref32[0],
          attribute = _ref32[1];
        return attribute.START_WIDTH <= x && x <= attribute.START_WIDTH + attribute.WIDTH && attribute.START_HEIGHT <= y && y <= attribute.START_HEIGHT + attribute.HEIGHT;
      });
      return result[0];
    }
  }]);
  return Game;
}();
var _default = Game;
exports["default"] = _default;