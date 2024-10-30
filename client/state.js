"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentState = getCurrentState;
exports.processGameUpdate = processGameUpdate;
exports.resetState = resetState;
var _constants = _interopRequireDefault(require("../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var gameUpdates = [];
var gameStart = 0;
var firstServerTimestamp = 0;
function resetState() {
  gameStart = 0;
  firstServerTimestamp = 0;
  gameUpdates = [];
}
function processGameUpdate(update) {
  if (!firstServerTimestamp) {
    firstServerTimestamp = update.t;
    gameStart = Date.now();
  }
  gameUpdates.push(update);
  var base = getBaseUpdateIndex();
  if (base > 0) {
    gameUpdates.splice(0, base);
  }
}
function currentServerTime() {
  return firstServerTimestamp + (Date.now() - gameStart) - _constants["default"].RENDER_DELAY;
}
function getBaseUpdateIndex() {
  var serverTime = currentServerTime();
  for (var i = gameUpdates.length - 1; i >= 0; i--) {
    if (gameUpdates[i].t <= serverTime) {
      return i;
    }
  }
  return -1;
}
function getCurrentState() {
  if (!firstServerTimestamp) {
    return [];
  }
  var baseUpdateIndex = getBaseUpdateIndex();
  var serverTime = currentServerTime();
  if (baseUpdateIndex < 0 || baseUpdateIndex === gameUpdates.length - 1) {
    return gameUpdates[gameUpdates.length - 1];
  } else {
    var baseUpdate = gameUpdates[baseUpdateIndex];
    var nextUpdate = gameUpdates[baseUpdateIndex + 1];
    var ratio = (serverTime - baseUpdate.t) / (nextUpdate.t - baseUpdate.t);
    return interpolateObject(baseUpdate, nextUpdate, ratio);
    // {
    // 	self: interpolateObject(baseUpdate.self, nextUpdate.self, ratio),
    // 	entities: interpolateObjectArray(baseUpdate.entities, nextUpdate.entities, ratio),
    // };
  }
}
var valueKeys = ['x', 'y', 'hp', 'max_hp', 'radius', 'vision'];
var dirKeys = [];
var arrKeys = ['entities'];
var objKeys = ['self', 'attr'];
function interpolateObject(object1, object2, ratio) {
  if (!object2) {
    return object1;
  }
  var interpolated = {};
  Object.keys(object1).forEach(function (key) {
    if (dirKeys.includes(key)) {
      // 方向
      interpolated[key] = interpolateDirection(object1[key], object2[key], ratio);
    } else if (valueKeys.includes(key)) {
      // 数值
      interpolated[key] = object1[key] + (object2[key] - object1[key]) * ratio;
    } else if (arrKeys.includes(key)) {
      interpolated[key] = interpolateObjectArray(object1[key], object2[key], ratio);
    } else if (objKeys.includes(key)) {
      interpolated[key] = interpolateObject(object1[key], object2[key], ratio);
    } else {
      interpolated[key] = object1[key];
    }
  });
  return interpolated;
}
function interpolateObjectArray(objects1, objects2, ratio) {
  return objects1.map(function (object1) {
    return interpolateObject(object1, objects2.find(function (object2) {
      return object1.uuid == object2.uuid;
    }), ratio);
  });
}
function interpolateDirection(d1, d2, ratio) {
  var absD = Math.abs(d2 - d1);
  if (absD >= Math.PI) {
    if (d1 > d2) {
      return d1 + (d2 + 2 * Math.PI - d1) * ratio;
    } else {
      return d1 - (d2 - 2 * Math.PI - d1) * ratio;
    }
  } else {
    return d1 + (d2 - d1) * ratio;
  }
}