"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _entity = _interopRequireDefault(require("./entity.js"));
var _constants = _interopRequireDefault(require("../../../shared/constants.js"));
var _entity_attributes = _interopRequireDefault(require("../../../../public/entity_attributes.js"));
var _petal_attributes = _interopRequireDefault(require("../../../../public/petal_attributes.js"));
var _petal3 = _interopRequireDefault(require("./petal.js"));
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
var Attribute = _entity_attributes["default"].PLAYER;
var Player = /*#__PURE__*/function (_Entity) {
  _inherits(Player, _Entity);
  var _super = _createSuper(Player);
  function Player(id, socketID, username, x, y, team) {
    var _this;
    _classCallCheck(this, Player);
    _this = _super.call(this, id, x, y, team, 'mob', 'PLAYER', _entity_attributes["default"].PLAYER.MAX_HP_BASE, _entity_attributes["default"].PLAYER.MAX_HP_BASE, false);
    _this.socketID = socketID;
    _this.username = username;
    _this.score = 1;
    _this.haveRankOnLeaderboard = false;
    _this.exp = 0;
    _this.totalExp = 0;
    _this.level = 1;
    _this.currentExpForLevel = _this.getExpForLevel(_this.level);
    _this.rotationSpeed = _constants["default"].PETAL_ROTATION_SPEED_BASE;
    _this.firstPetalDirection = 0;
    _this.rotateClockwise = 1; // 1 for clockwise, -1 for counter-clockwise
    _this.suffocateTime = 0;
    _this.oxygen = _constants["default"].PLAYER_OXYGEN;
    _this.petalExpandRadius = _constants["default"].PETAL_EXPAND_RADIUS_NORMAL;
    _this.slotCount = _constants["default"].PRIMARY_SLOT_COUNT_BASE;
    _this.placeHolder = _constants["default"].PRIMARY_SLOT_COUNT_BASE; // how many places are there
    _this.petalID = _constants["default"].FIRST_PETAL_ID;
    _this.primaryPetals = [];
    _this.secondaryPetals = [];
    _this.petals = [];
    _this.primaryPetals[0] = 'BASIC';
    _this.primaryPetals[1] = 'BASIC';
    _this.primaryPetals[2] = 'BASIC';
    _this.primaryPetals[3] = 'BASIC';
    _this.primaryPetals[4] = 'BASIC';
    _this.secondaryPetals[0] = 'EMPTY';
    _this.secondaryPetals[1] = 'EMPTY';
    _this.secondaryPetals[2] = 'EMPTY';
    _this.secondaryPetals[3] = 'EMPTY';
    _this.secondaryPetals[4] = 'EMPTY';
    for (var i = 0; i < _constants["default"].PRIMARY_SLOT_COUNT_BASE; i++) {
      var petals = [];
      for (var o = 0; o < _petal_attributes["default"][_this.primaryPetals[i]].COUNT; o++) {
        var petal = _this.newPetal(_this.primaryPetals[i], i * _constants["default"].PETAL_MULTIPLE_MAX + o, i * _constants["default"].PETAL_MULTIPLE_MAX + o, i, o, i, _this.x, _this.y);
        petals.push(petal);
      }
      _this.petals.push(petals);
    }
    _this.updatePlaceHolder();
    _this.pets = {};
    _this.activeDirection = 0;
    _this.attributes = Attribute;
    _this.attack = false;
    _this.defend = false;
    _this.bubbleVelocity = {
      x: 0,
      y: 0
    };
    // this.switched = true; // 这一刻是否进行交换操作
    _this.noHeal = 0; // 剩余禁用回血时间
    _this.poison = 0; // 中毒每秒毒伤
    _this.poisonTime = 0; // 剩余中毒时间
    _this.bodyToxicity = 0; // 碰撞毒秒伤
    _this.bodyPoison = 0; // 碰撞毒总伤
    _this.damageReflect = 0.000; // 反伤
    _this.vision = 1.0;
    _this.petalSyncTimer = _constants["default"].PETAL_SYNC_INTERVAL;
    _this.updatePetalSlot();
    return _this;
  }
  _createClass(Player, [{
    key: "disablePetal",
    value: function disablePetal(slot) {
      var petals = this.petals[slot];
      petals.forEach(function (petal) {
        petal.disabled = true;
        petal.inCooldown = true;
        petal.cooldown = petal.attributes.RELOAD;
      });
    }
  }, {
    key: "switchPetals",
    value: function switchPetals(slot1, slot2) {
      var _this2 = this;
      var tmp;
      if (slot1 != -1) {
        if (!slot1.isPrimary && slot2.isPrimary) {
          tmp = slot1;
          slot1 = slot2;
          slot2 = tmp;
        }
        if (slot1.isPrimary && slot2.isPrimary) {
          tmp = this.primaryPetals[slot1.slot];
          this.primaryPetals[slot1.slot] = this.primaryPetals[slot2.slot];
          this.primaryPetals[slot2.slot] = tmp;
          var petalA = this.petals.find(function (ptl) {
              return ptl[0].slot == slot1.slot;
            }),
            petalB = this.petals.find(function (ptl) {
              return ptl[0].slot == slot2.slot;
            }),
            petalA_type = this.primaryPetals[slot2.slot],
            petalB_type = this.primaryPetals[slot1.slot];
          tmp = petalA[0].placeHolder;
          //petalA
          //目标花瓣数量是否大于自身数量，是就增加花瓣位
          if (_petal_attributes["default"][petalB_type].COUNT > petalA.length) {
            var times = _petal_attributes["default"][petalB_type].COUNT - petalA.length;
            for (var i = 0; i < times; i++) {
              var petal = this.newPetal(petalB_type, this.getNewPetalID(), petalA[petalA.length - 1].idx + 1, petalB[0].placeHolder, 0);
              petalA.push(petal);
            }
          }

          //目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
          if (_petal_attributes["default"][petalB_type].COUNT < petalA.length) {
            petalA.splice(_petal_attributes["default"][petalB_type].COUNT, _constants["default"].PETAL_MULTIPLE_MAX);
          }

          //刷新花瓣属性
          petalA.forEach(function (petal, index) {
            petal.isHide = false;
            petal.idInPlaceHolder = index;
            petal.disabled = false;
            petal.type = _this2.primaryPetals[slot1.slot];
            petal.updateAttributes();
            petal.cooldown = petal.attributes.RELOAD;
            petal.inCooldown = true;
          });
          this.petals.forEach(function (petals) {
            petals.forEach(function (petal) {
              if (petal.type == "EMPTY") {
                petal.isHide = true;
              }
            });
          });

          //petalB
          //目标花瓣数量是否大于自身数量，是就增加花瓣位
          if (_petal_attributes["default"][petalA_type].COUNT > petalB.length) {
            var _times = _petal_attributes["default"][petalA_type].COUNT - petalB.length;
            for (var _i = 0; _i < _times; _i++) {
              var _petal = this.newPetal(petalA_type, this.getNewPetalID(), petalB[petalB.length - 1].idx + 1, tmp, 0);
              petalB.push(_petal);
            }
          }

          //目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
          if (_petal_attributes["default"][petalA_type].COUNT < petalB.length) {
            petalB.splice(_petal_attributes["default"][petalA_type].COUNT, _constants["default"].PETAL_MULTIPLE_MAX);
          }

          //刷新花瓣属性
          petalB.forEach(function (petal, index) {
            petal.isHide = false;
            petal.idInPlaceHolder = index;
            petal.disabled = false;
            petal.type = _this2.primaryPetals[slot2.slot];
            petal.updateAttributes();
            petal.cooldown = petal.attributes.RELOAD;
            petal.inCooldown = true;
          });
          this.petals.forEach(function (petals) {
            petals.forEach(function (petal) {
              if (petal.type == "EMPTY") {
                petal.isHide = true;
              }
            });
          });
          this.updatePlaceHolder();
          this.updatePetalSlot();
        } else if (slot1.isPrimary && !slot2.isPrimary) {
          tmp = this.primaryPetals[slot1.slot];
          this.primaryPetals[slot1.slot] = this.secondaryPetals[slot2.slot];
          this.secondaryPetals[slot2.slot] = tmp;
          var _petalA = this.petals.find(function (ptl) {
            return ptl[0].slot == slot1.slot;
          });

          //目标花瓣数量是否大于自身数量，是就增加花瓣位
          if (_petal_attributes["default"][this.primaryPetals[slot1.slot]].COUNT > _petalA.length) {
            var _times2 = _petal_attributes["default"][this.primaryPetals[slot1.slot]].COUNT - _petalA.length;
            for (var _i2 = 0; _i2 < _times2; _i2++) {
              var _petal2 = this.newPetal(_petalA[0].type, this.getNewPetalID(), _petalA[_petalA.length - 1].idx + 1, _petalA[0].placeHolder, _petalA[0].slot);
              _petalA.push(_petal2);
            }
          }

          //目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
          if (_petal_attributes["default"][this.primaryPetals[slot1.slot]].COUNT < _petalA.length) {
            _petalA.splice(_petal_attributes["default"][this.primaryPetals[slot1.slot]].COUNT, _constants["default"].PETAL_MULTIPLE_MAX);
          }

          //刷新花瓣属性
          _petalA.forEach(function (petal, index) {
            petal.isHide = false;
            petal.idInPlaceHolder = index;
            petal.disabled = false;
            petal.type = _this2.primaryPetals[slot1.slot];
            petal.updateAttributes();
            petal.cooldown = petal.attributes.RELOAD;
            petal.inCooldown = true;
          });
          this.petals.forEach(function (petals) {
            petals.forEach(function (petal) {
              if (petal.type == "EMPTY") {
                petal.isHide = true;
              }
            });
          });
          this.updatePlaceHolder();
          this.updatePetalSlot();
        } else {
          tmp = this.secondaryPetals[slot1.slot];
          this.secondaryPetals[slot1.slot] = this.secondaryPetals[slot2.slot];
          this.secondaryPetals[slot2.slot] = tmp;
        }
      }

      //检测是否有空花瓣&更新最大花瓣位置
      /*
      this.placeHolder = 0;
      this.petals.forEach((petal,index) => {
      	petal.placeHolder = index;
      })
      this.petals.forEach((petal,index) => {
      	console.log(petal)
      	if (petal.type === `NONE`) {
      		for (let i = index; i < this.petals.length; ++i) {
      			this.petals[i].placeHolder--;
      		}
      		//console.log(index)
      		return;
      	};
      	this.placeHolder++;
      })
      */
    }
  }, {
    key: "updatePlaceHolder",
    value: function updatePlaceHolder() {
      var placeHolder = 0;
      this.petals.forEach(function (petals) {
        var petalHideNum = 0;
        var isCluster = true;
        petals.forEach(function (petal) {
          if (petal.placeHolder == -1) {
            petalHideNum++;
            return;
          }
          if (petal.isHide) petalHideNum++;
          petal.placeHolder = placeHolder;
          if (!petal.attributes.CLUSTER && !petal.isHide) {
            isCluster = false;
            placeHolder++;
          }
          ;
        });
        if (petalHideNum == petals.length) return;
        if (isCluster) {
          placeHolder++;
        }
      });
      this.placeHolder = placeHolder;
    }
  }, {
    key: "updatePetalSlot",
    value: function updatePetalSlot() {
      var slot = 0;
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (petal.slot == -1 || petal.placeHolder == -1) return;
          petal.slot = slot;
        });
        slot++;
      });
    }
  }, {
    key: "updatePetalMovement",
    value: function updatePetalMovement(deltaT) {
      var _this3 = this;
      //console.log(this.petals[0])
      this.firstPetalDirection -= this.rotateClockwise * this.rotationSpeed * deltaT;
      if (this.firstPetalDirection > 4 * Math.PI) {
        this.firstPetalDirection -= 4 * Math.PI;
      }
      if (this.firstPetalDirection < -4 * Math.PI) {
        this.firstPetalDirection += 4 * Math.PI;
      }
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal, index) {
          if (!petal.inCooldown) {
            if (petal.attributes.TRIGGERS.PROJECTILE && petal.action) {
              petal.movement = {
                direction: petal.direction,
                speed: petal.attributes.TRIGGERS.PROJECTILE
              };
            } else {
              if (petal.attributes.TRIGGERS.PROJECTILE) {
                petal.direction = Math.atan2(petal.x - _this3.x, _this3.y - petal.y);
              } else {
                petal.direction += 0.1;
              }
              var theta = _this3.firstPetalDirection + 2 * Math.PI * petal.placeHolder / _this3.placeHolder;
              var expandRadius = _this3.petalExpandRadius + _this3.attributes.RADIUS;
              if (!petal.attributes.EXPANDABLE) {
                expandRadius = Math.min(expandRadius, _constants["default"].PETAL_EXPAND_RADIUS_NORMAL + _this3.attributes.RADIUS);
              }
              if (petal.action) {
                expandRadius = Math.min(expandRadius, _this3.attributes.RADIUS + petal.attributes.RADIUS);
              }
              if (petal.attributes.TRIGGERS.FLOAT) {
                if (_this3.attack) {
                  petal.floatDirection += deltaT * petal.attributes.TRIGGERS.FLOAT / _constants["default"].PETAL_FLOAT_SPEED;
                  petal.floatRadius += deltaT * Math.cos(Math.PI / 2 + petal.floatDirection / petal.attributes.TRIGGERS.FLOAT * Math.PI) * petal.attributes.TRIGGERS.FLOAT / _constants["default"].PETAL_FLOAT_SPEED;
                  if (petal.floatDirection >= petal.attributes.TRIGGERS.FLOAT * 2) {
                    petal.floatDirection = 0;
                    petal.floatRadius = 0;
                  }
                  expandRadius -= petal.floatRadius; // + Math.cos(petal.floatDirection / (petal.attributes.TRIGGERS.FLOAT * 2) * Math.PI) * (Constants.PETAL_EXPAND_RADIUS_ATTACK / 2);
                } else {
                  petal.floatRadius = 0;
                  petal.floatDirection = 0;
                }
              }
              var offsetX = 0,
                offsetY = 0;
              if (petal.attributes.MULTIPLE && petal.attributes.CLUSTER) {
                offsetX = _constants["default"].PETAL_MULTIPLE_OFFSET_DISTANCE * Math.sin(index / petal.attributes.COUNT * 2 * Math.PI + _this3.firstPetalDirection * 0.5);
                offsetY = _constants["default"].PETAL_MULTIPLE_OFFSET_DISTANCE * Math.cos(index / petal.attributes.COUNT * 2 * Math.PI + _this3.firstPetalDirection * 0.5);
              }
              var goalPos = {
                x: _this3.x + expandRadius * Math.sin(theta) + offsetX,
                y: _this3.y + expandRadius * Math.cos(theta) + offsetY
              };
              var followSpeed = 7.5 + _this3.rotationSpeed * expandRadius / 2 * deltaT;
              petal.movement = {
                direction: Math.atan2(goalPos.x - petal.x, petal.y - goalPos.y),
                speed: Math.sqrt(Math.pow(goalPos.x - petal.x, 2) + Math.pow(goalPos.y - petal.y, 2)) * followSpeed
              };
              // * (1 - Constants.SPEED_ATTENUATION_COEFFICIENT) / deltaT
              // console.log(petal.velocity);
            }
          } else {
            if (!petal.disabled) {
              petal.cooldown -= deltaT;
              if (petal.cooldown <= 0) {
                var _theta = _this3.firstPetalDirection + 2 * Math.PI * petal.placeHolder / _this3.placeHolder;
                var startRadius = _this3.attributes.RADIUS;
                var _offsetX = 0,
                  _offsetY = 0;
                if (petal.attributes.MULTIPLE && petal.attributes.CLUSTER) {
                  _offsetX = _constants["default"].PETAL_MULTIPLE_OFFSET_DISTANCE * Math.sin(index / petal.attributes.COUNT * 2 * Math.PI + _this3.firstPetalDirection * 0.5);
                  _offsetY = _constants["default"].PETAL_MULTIPLE_OFFSET_DISTANCE * Math.cos(index / petal.attributes.COUNT * 2 * Math.PI + _this3.firstPetalDirection * 0.5);
                }
                petals[index] = _this3.newPetal(petal.attributes.TYPE, _this3.getNewPetalID(), petal.idx, petal.placeHolder, petal.idInPlaceHolder, petal.slot, _this3.x + startRadius * Math.sin(_theta) + _offsetX, _this3.y + startRadius * Math.cos(_theta) + _offsetY);
              }
            }
          }
        });
      });
    }
  }, {
    key: "newPetal",
    value: function newPetal(type, petalID, petalIDX, placeHolder, idInPlaceHolder, slot, x, y) {
      return new _petal3["default"](petalID, petalIDX, placeHolder, x, y, this.id, type, true, idInPlaceHolder, slot);
    }
  }, {
    key: "handleActiveMovement",
    value: function handleActiveMovement(activeMovement) {
      // handles active motion
      this.movement = activeMovement;
      this.activeDirection = activeMovement.direction;
    }
  }, {
    key: "update",
    value: function update(deltaT) {
      var _this4 = this;
      this.needSwitchPetals = [];
      // console.log(this.primaryPetals, this.secondaryPetals);
      this.rotationSpeed = _constants["default"].PETAL_ROTATION_SPEED_BASE; //初始化旋转速度
      this.rotateClockwise = 1; //初始化旋转方向
      this.noHeal = Math.max(0, this.noHeal - deltaT);
      this.poisonTime = Math.max(0, this.poisonTime - deltaT);
      if (this.poisonTime > 0) this.hp -= this.poison * deltaT;
      if (this.hp < this.maxHp && !this.noHeal) {
        this.hp += this.maxHp / 240 * deltaT;
        this.hp = Math.min(this.hp, this.maxHp);
      }
      if (this.oxygen < 0) {
        this.hp -= _constants["default"].SUFFOCATE_DAMAGE_BASE * deltaT + this.suffocateTime * deltaT * _constants["default"].SUFFOCATE_DAMAGE_IMPROVE;
      }
      var isAllYinYang = this.petals.every(function (petal) {
        return petal[0].attributes && petal[0].attributes.TYPE === "YINYANG";
      }); //判断是否所有花瓣都为阴阳
      this.petals.forEach(function (petals, slot) {
        petals.forEach(function (petal, index) {
          if (!petal || !petal.attributes) return;

          //阴阳控制旋转部分
          if (petal.attributes.TRIGGERS.ROTATION_SWITCH) {
            if (isAllYinYang && _this4.slotCount >= 8) {
              _this4.rotateClockwise = 5;
            } else if (_this4.rotateClockwise == 1) {
              _this4.rotateClockwise = -1;
            } else if (_this4.rotateClockwise == -1) {
              _this4.rotateClockwise = 0;
            } else if (_this4.rotateClockwise == 0) {
              _this4.rotateClockwise = 1;
            }
          }
          if (petal.inCooldown) return;
          if (petal.attributes.TRIGGERS.ROTATION_ACCELERATE) {
            _this4.rotationSpeed += petal.attributes.TRIGGERS.ROTATION_ACCELERATE;
            return;
          }
          if (petal.attributes.TRIGGERS.HEAL_SUSTAIN) {
            if (_this4.hp < _this4.maxHp && !_this4.noHeal) {
              _this4.hp += petal.attributes.TRIGGERS.HEAL_SUSTAIN * deltaT;
              _this4.hp = Math.min(_this4.hp, _this4.maxHp);
            }
            return;
          }
          if (petal.attributes.TRIGGERS.HEAL) {
            if (_this4.hp >= _this4.maxHp || _this4.noHeal) {
              petal.action = false;
              petal.actionTime = 0;
              return;
            }
            if (petal.actionCooldown > 0) {
              petal.actionCooldown -= deltaT;
              return;
            }
            if (!petal.action) {
              petal.action = true;
              return;
            }
            if (petal.actionTime < petal.attributes.TRIGGERS.ACTION_TIME) {
              petal.actionTime += deltaT;
              return;
            }
            petal.hp = -1;
            _this4.hp += petal.attributes.TRIGGERS.HEAL;
            _this4.hp = Math.min(_this4.hp, _this4.maxHp);
            return;
          }

          // trigger projectile petals like missile, dandelion etc.
          if (petal.attributes.TRIGGERS.PROJECTILE) {
            if (petal.actionCooldown > 0) {
              petal.actionCooldown -= deltaT;
              return;
            }
            if (petal.action) {
              petal.actionTime += deltaT;
              if (petal.actionTime >= petal.attributes.TRIGGERS.ACTION_TIME) {
                petal.hp = -1;
              }
              return;
            }
            if (_this4.attack) {
              var projectile = _this4.newPetal(petal.type, _this4.getNewPetalID(), -1, -1, -1, _this4.x, _this4.y);
              projectile.action = true;
              projectile.x = petal.x;
              projectile.y = petal.y;
              projectile.direction = petal.direction;
              projectile.velocity = {
                x: petal.attributes.TRIGGERS.PROJECTILE / _constants["default"].SPEED_ATTENUATION_COEFFICIENT * Math.sin(petal.direction),
                y: petal.attributes.TRIGGERS.PROJECTILE / _constants["default"].SPEED_ATTENUATION_COEFFICIENT * Math.cos(petal.direction)
              };
              _this4.petals.push([projectile]);
              _this4.reload(petal.slot, index);
              return;
            }
          }
          if (petal.attributes.TRIGGERS.SPLIT) {
            if (petal.actionCooldown > 0) {
              petal.actionCooldown -= deltaT;
              return;
            }
            if (petal.action) {
              petal.actionTime += deltaT;
              if (petal.actionTime >= petal.attributes.TRIGGERS.ACTION_TIME) {
                petal.hp = -1;
              }
              return;
            }
            if (_this4.attack) {
              var firstDirection = Math.random() * Math.PI * 2;
              for (var i = 0; i < petal.attributes.TRIGGERS.SPLIT.COUNT; i++) {
                var direction = firstDirection + i / petal.attributes.TRIGGERS.SPLIT.COUNT * Math.PI * 2;
                var _projectile = _this4.newPetal(petal.attributes.TRIGGERS.SPLIT.NAME, _this4.getNewPetalID(), -1, -1, -1, _this4.x, _this4.y);
                _projectile.action = true;
                _projectile.x = petal.x;
                _projectile.y = petal.y;
                _projectile.direction = direction;
                _projectile.velocity = {
                  x: petal.attributes.TRIGGERS.SPLIT.SPEED / _constants["default"].SPEED_ATTENUATION_COEFFICIENT * Math.sin(direction),
                  y: petal.attributes.TRIGGERS.SPLIT.SPEED / _constants["default"].SPEED_ATTENUATION_COEFFICIENT * Math.cos(direction)
                };
                _this4.petals.push([_projectile]);
              }
              _this4.reload(petal.slot, index);
              return;
            }
          }
          if (petal.attributes.TRIGGERS.BUBBLE_PUSH) {
            // trigger bubble
            if (petal.actionCooldown > 0) {
              petal.actionCooldown -= deltaT;
              return;
            }
            if (_this4.defend) {
              petal.hp = -1;
              var dir = _this4.firstPetalDirection + 2 * Math.PI * petal.placeHolder / _this4.placeHolder;
              var push = petal.attributes.TRIGGERS.BUBBLE_PUSH;
              _this4.bubbleVelocity.x -= push * Math.sin(dir);
              _this4.bubbleVelocity.y += push * Math.cos(dir);
              return;
            }
          }
          if (_this4.defend) {
            // defend trigger
            if (petal.attributes.TRIGGERS.HEAL_SUSTAIN_DEFENCE) {
              if (_this4.hp < _this4.maxHp && !_this4.noHeal) {
                _this4.hp += petal.attributes.TRIGGERS.HEAL_SUSTAIN_DEFENCE * deltaT;
                _this4.hp = Math.min(_this4.hp, _this4.maxHp);
              }
            }
          }
        });
      });
    }
  }, {
    key: "updateChunks",
    value: function updateChunks() {
      return _get(_getPrototypeOf(Player.prototype), "updateChunks", this).call(this, this.attributes.RADIUS);
    }
  }, {
    key: "updateMovement",
    value: function updateMovement(deltaT) {
      this.updatePetalMovement(deltaT);
    }
  }, {
    key: "updateVelocity",
    value: function updateVelocity(deltaT) {
      _get(_getPrototypeOf(Player.prototype), "updateVelocity", this).call(this, deltaT);
      this.bubbleVelocity.x *= _constants["default"].BUBBLE_ATTENUATION_COEFFICIENT;
      this.bubbleVelocity.y *= _constants["default"].BUBBLE_ATTENUATION_COEFFICIENT;
      if (Math.sqrt(Math.pow(this.bubbleVelocity.x, 2) + Math.pow(this.bubbleVelocity.y, 2)) <= 50) {
        this.bubbleVelocity = {
          x: 0,
          y: 0
        };
      }
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (!petal.inCooldown) {
            petal.updateVelocity(deltaT);
          }
        });
      });
    }
  }, {
    key: "applyVelocity",
    value: function applyVelocity(deltaT) {
      _get(_getPrototypeOf(Player.prototype), "applyVelocity", this).call(this, deltaT);
      this.x += deltaT * this.bubbleVelocity.x;
      this.y -= deltaT * this.bubbleVelocity.y;
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (!petal.inCooldown) {
            petal.applyVelocity(deltaT);
          }
        });
      });
    }
  }, {
    key: "applyConstraintVelocity",
    value: function applyConstraintVelocity(deltaT) {
      _get(_getPrototypeOf(Player.prototype), "applyConstraintVelocity", this).call(this, deltaT);
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (!petal.inCooldown) {
            petal.applyConstraintVelocity(deltaT);
          }
        });
      });
    }
  }, {
    key: "handleBorder",
    value: function handleBorder() {
      _get(_getPrototypeOf(Player.prototype), "handleBorder", this).call(this, this.attributes.RADIUS);
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (!petal.inCooldown) {
            petal.handleBorder(petal.attributes.RADIUS);
          }
        });
      });
    }
  }, {
    key: "reload",
    value: function reload(slot, idInPlaceHolder) {
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (petal.isHide) return;
          if (petal.slot == slot && petal.idInPlaceHolder == idInPlaceHolder) {
            petal.cooldown = petal.attributes.RELOAD;
            petal.inCooldown = true;
          }
        });
      });
    }
  }, {
    key: "getNewPetalID",
    value: function getNewPetalID() {
      this.petalID++;
      return this.petalID;
    }
  }, {
    key: "getExpForLevel",
    value: function getExpForLevel(level) {
      var expCoeN = 10;
      var expCoeK = 8;
      var expCoeB = 1.1;
      // K * (B ^ L) + N
      return Math.floor(Math.pow(expCoeB, level) * expCoeK + expCoeN);
    }
  }, {
    key: "addExp",
    value: function addExp(exp) {
      this.exp += exp;
      this.totalExp += exp;
      while (this.exp >= this.currentExpForLevel) {
        this.level++;
        this.exp -= this.currentExpForLevel;
        this.currentExpForLevel = this.getExpForLevel(this.level);

        //更新槽位数量
        if (this.slotCount < 8) {
          this.slotCount = 5 + Math.floor(this.level / 15);
        }
      }
    }
  }, {
    key: "getPetalsForUpdate",
    value: function getPetalsForUpdate() {
      var petalsForUpdate = [];
      this.petals.forEach(function (petals) {
        petals.forEach(function (petal) {
          if (!petal.inCooldown) {
            petalsForUpdate.push(petal.serializeForUpdate());
          }
        });
      });
      return petalsForUpdate;
    }
  }, {
    key: "serializeForUpdate",
    value: function serializeForUpdate(self) {
      // get neccesary data and send to client
      if (self) {
        if (this.petalSyncTimer <= 0) {
          this.petalSyncTimer = _constants["default"].PETAL_SYNC_INTERVAL;
          return _objectSpread(_objectSpread({}, _get(_getPrototypeOf(Player.prototype), "serializeForUpdate", this).call(this)), {}, {
            score: this.score,
            hp: this.hp,
            maxHp: this.maxHp,
            radius: this.attributes.RADIUS,
            size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
            currentExpForLevel: this.currentExpForLevel,
            level: this.level,
            exp: this.exp,
            username: this.username,
            petals: this.getPetalsForUpdate(),
            petalSync: true,
            primaryPetals: this.primaryPetals,
            secondaryPetals: this.secondaryPetals
          });
        } else {
          this.petalSyncTimer--;
          return _objectSpread(_objectSpread({}, _get(_getPrototypeOf(Player.prototype), "serializeForUpdate", this).call(this)), {}, {
            score: this.score,
            hp: this.hp,
            maxHp: this.maxHp,
            currentExpForLevel: this.currentExpForLevel,
            level: this.level,
            exp: this.exp,
            username: this.username,
            petals: this.getPetalsForUpdate(),
            radius: this.attributes.RADIUS,
            size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS
          });
        }
      } else {
        return _objectSpread(_objectSpread({}, _get(_getPrototypeOf(Player.prototype), "serializeForUpdate", this).call(this)), {}, {
          score: this.score,
          hp: this.hp,
          maxHp: this.maxHp,
          radius: this.attributes.RADIUS,
          size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
          username: this.username,
          petals: this.getPetalsForUpdate()
        });
      }
    }
  }]);
  return Player;
}(_entity["default"]);
var _default = Player;
exports["default"] = _default;