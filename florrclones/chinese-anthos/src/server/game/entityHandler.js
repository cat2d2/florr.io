/*
处理实体

$ = this.var
*/
import * as playerHandler from './playerHandler.js';
import * as physics from './physics.js';

function init() { // Game 调用
	// 初始化
	const $ = this.var;
	$.entities = {};
}

function addEntity(uuid, entity) { // Game 调用
	// 添加一个实体
	const $ = this.var;
	$.entities[uuid] = entity;
}

function move(dir, val) { // Entity 调用
	// 设定移动方向与速度（加速度）
	// 一个实体的加速度就是当前刻中最后一次接收到的 movement，也就是说 movement 就是加速度
	const $ = this.var;
	$.movement.dir = dir;
	$.movement.val = val;
}

function updateAcceleration(dt) { // 更新加速度
	const $ = this.var;
	Object.values($.entities).forEach(entity => {
		const movement = entity.var.movement;
		entity.var.a = {
			x: movement.val * Math.cos(movement.dir),
			y: movement.val * Math.sin(movement.dir),
		};
	});
}

function updateVelocity(dt) {
	const $ = this.var;
	Object.values($.entities).forEach(entity => {
		const a = entity.var.a; // 实体加速度
		const v = entity.var.v;
		const friction = entity.var.attr.friction;
		v.x *= friction;
		v.y *= friction;
		v.x += a.x * dt;
		v.y += a.y * dt;

		const v_list = entity.var.v_list; // 其他速度列表
		v_list.forEach((vel, i)=> {
			vel.x *= vel.coeff;
			vel.y *= vel.coeff;
			if ( Math.sqrt(vel.x * vel.x + vel.y * vel.y) < 1 ) { // 衰减到消失
				delete v_list[i];
				return ;
			}
		});
	});
}

function appendVelocity(x, y, coeff) { // Entity 调用
	const $ = this.var;
	$.v_list.push({
		x: x,
		y: y,
		coeff: coeff,
	});
}

function updatePosition(dt) {
	const $ = this.var;
	Object.values($.entities).forEach(entity => {
		const v = entity.var.v; // 速度
		const pos = entity.var.pos;
		pos.x += v.x * dt;
		pos.y += v.y * dt;
		const v_list = entity.var.v_list; // 其他速度列表
		v_list.forEach((vel)=> {
			pos.x += vel.x * dt;
			pos.y += vel.y * dt;
		});
	});
}

function handleEntityDeaths() {
	const $ = this.var;
	Object.values($.entities).forEach(entity => {
		if ( !entity )
			return ;
		if ( entity.var.attr.hp <= 0 ) { // 死亡
			if ( entity.var.attr.invulnerable ) { // 不会进行死亡判定
				return ;
			}
			if ( entity.var.type == 'player' ) { // 对玩家进行特殊处理
				playerHandler.handlePlayerDeath.bind(this)(entity);
				return ;
			}
			if ( entity.var.type == 'petal' ) {
				playerHandler.handlePetalDeath.bind(this)(entity);
			}
			removeEntity.bind(this)(entity.var.uuid);
		}
	});
}

function removeEntity(uuid) {
	const $ = this.var;
	const entity = $.entities[uuid];
	if ( !entity )
		return ;
	entity.var.chunks.forEach(chunk => { // 清除区块中对这个实体的记录
		const id = physics.getChunkID(chunk);
		if ( $.chunks[id] ) {
			$.chunks[id].splice(
				$.chunks[id].findIndex(uuid_ => {
					return (uuid_ == entity.var.uuid);
				}),
				1
			);
		}
	});
	delete $.entities[uuid];
}

function updateEntities() { // Game 调用
	const $ = this.var;
	Object.values($.entities).forEach(entity => {
		//init
		entity.var.isHurt = false;
		
		// 处理状态效果
		(() => {
			const effects = entity.var.effects; // 状态效果
			// 中毒
			Object.keys(effects).forEach(effectID => {
				const effect = effects[effectID];
				if ( effect.duration > 0 ) {
					effect.duration --;
					if ( effectID == 'poison' ) {
						entity.var.attr.hp -= effects.poison.value * (1 - entity.var.attr.poison_res);
					}
				}
			});
		})();
	});
}

function getUpdate() { // Entity 调用
	const $ = this.var;
	const ret = {
		uuid: $.uuid,
		type: $.type,
		x: $.pos.x,
		y: $.pos.y,
		attr: $.attr,
		isHurt: $.isHurt,
		effects: $.effects,
	};
	if ( $.type == 'player' ) {
		ret.username = $.playerInfo.username;
		ret.team = $.team;
		ret.vision = $.vision; // 客户端视距
	}
	if ( $.type == 'petal' ) {
		ret.id = $.id;
	}
	return ret;
}

export {
	init,
	move,
	addEntity,
	updateAcceleration,
	updateVelocity,
	appendVelocity,
	updatePosition,
	handleEntityDeaths,
	getUpdate,
	removeEntity,
	updateEntities,
};