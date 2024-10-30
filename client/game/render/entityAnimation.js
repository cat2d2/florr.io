"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntityRenderAttributes = getEntityRenderAttributes;
exports.play = play;
exports.recordEntity = recordEntity;
exports.setNewEntitiesList = setNewEntitiesList;
var _utility = require("../../utility.js");
var canvas = _interopRequireWildcard(require("../../canvas.js"));
var _assets = require("../../assets.js");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*

entityAnimations {
	uuid0 {
		animationType0: {
			setting0: Dynnum (DynamicNumber)
			setting1: Dynnum
			...
		}
		animationType1: {
			setting0: Dynnum (DynamicNumber)
			setting1: Dynnum
			...
		}
		...
	}
	uuid1 {
		animationType0: ...
		animationType1: ...
		...
	}
	...
}

*/

/*
	uuid {
		setting0: Dynnum (DynamicNumber)
		setting1: Dynnum
	}
*/

var entitiesAnimations = {}; // ^^^

var tempEntitiesAnimations = {}; // 每次渲染都会替换原本的动画列表

var entitiesAnimationsCtx; // 实体动画将绘制在此ctx上

var animationColors = {
  hurt: "rgb(255, 0, 0)",
  poison: "rgb(83, 2, 118)",
  heal_res: "rgb(255, 255, 255)",
  die: "none"
};
function getEntityRenderAttributes(entity) {
  // 获得实体渲染属性
  return entitiesAnimations[entity.uuid];
}
function play(entity, type) {
  var renderAttributes = getEntityRenderAttributes(entity);
  renderAttributes.color.cover = animationColors[type];
  if (["hurt", "poison", "heal_res"].includes(type)) {
    renderAttributes.color.alpha.set(1);
  }
}
function getNewRenderAttributes() {
  return {
    color: {
      cover: "none",
      alpha: _utility.DynamicNumber.create(0, 0, 0.7)
    },
    alpha: _utility.DynamicNumber.create(1, 1, 0.9),
    size: _utility.DynamicNumber.create(1, 1, 0.9)
  };
}
function recordEntity(entity) {
  // 记录实体到临时列表
  var renderAttributes = getEntityRenderAttributes(entity);
  if (!renderAttributes) {
    entitiesAnimations[entity.uuid] = getNewRenderAttributes();
  }
  tempEntitiesAnimations[entity.uuid] = entitiesAnimations[entity.uuid];
}
function setNewEntitiesList() {
  // 用临时列表替换旧列表
  entitiesAnimations = tempEntitiesAnimations;
  tempEntitiesAnimations = {}; // 这里实际是将临时动画列表指向了新的地址，因此不会影响主列表
}