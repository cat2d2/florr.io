import { DynamicNumber } from '../../utility.js';
import * as canvas from '../../canvas.js';
import { getAssetByEntity } from '../../assets.js';

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

let entitiesAnimations = {} // ^^^

let tempEntitiesAnimations = {}; // 每次渲染都会替换原本的动画列表

let entitiesAnimationsCtx; // 实体动画将绘制在此ctx上

const animationColors = {
	hurt: `rgb(255, 0, 0)`, 
	poison: `rgb(83, 2, 118)`,
	heal_res: `rgb(255, 255, 255)`,
	die: `none`,
}

function getEntityRenderAttributes(entity) { // 获得实体渲染属性
	return entitiesAnimations[entity.uuid];
}

function play(entity, type) {
	const renderAttributes = getEntityRenderAttributes(entity);
	renderAttributes.color.cover = animationColors[type]
	if ([`hurt`, `poison`, `heal_res`].includes(type)) {
		renderAttributes.color.alpha.set(1);
	}
}

function getNewRenderAttributes() {
	return {
		color: {
			cover: `none`,
			alpha: DynamicNumber.create(0, 0, 0.7),
		},
		alpha: DynamicNumber.create(1, 1, 0.9),
		size: DynamicNumber.create(1, 1, 0.9)
	}
}

function recordEntity(entity) { // 记录实体到临时列表
	const renderAttributes = getEntityRenderAttributes(entity);
	if (!renderAttributes) {
		entitiesAnimations[entity.uuid] = getNewRenderAttributes();
	}
	tempEntitiesAnimations[entity.uuid] = entitiesAnimations[entity.uuid];
}

function setNewEntitiesList() { // 用临时列表替换旧列表
	entitiesAnimations = tempEntitiesAnimations;
	tempEntitiesAnimations = {}; // 这里实际是将临时动画列表指向了新的地址，因此不会影响主列表
}

export {
	play,
	getEntityRenderAttributes,
	recordEntity,
	setNewEntitiesList,
}
