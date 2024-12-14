/*
处理游戏物理

$ = this.var

$.chunks: {chunkID -> [{type -> entityType, id -> id}]}
*/
import * as util from './utility.js';
import { appendVelocity } from './entityHandler.js';
import { togglePetalSkillTrigger } from './playerHandler.js';
import petalSkill from './petalSkill.js';

const chunk_id_constant = 1000000; // 用于计算区块 id

function init() {
	const $ = this.var;
	$.chunks = {}; // id -> [uuid]
}

function solveBorderCollisions() { // 解决与地图边界碰撞
	const $ = this.var;
	const w = $.props.map_width, h = $.props.map_height; // 地图宽高
	Object.values($.entities).forEach(entity => {
		if ( entity.var.attr.ignore_border ) // 无视边界属性判定
			return ;
		const pos = entity.var.pos; // 实体坐标
		const v = entity.var.v;
		const r = entity.var.attr.radius; // 实体半径
		if ( pos.x < r ) {
			v.x = 0;
			pos.x = r;
		}
		if ( pos.x > w - r ) {
			v.x = 0;
			pos.x = w - r;
		}
		if ( pos.y < r ) {
			v.y = 0;
			pos.y = r;
		}
		if ( pos.y > h - r ) {
			v.y = 0;
			pos.y = h - r;
		}
	});
}

function getChunkUpdate(chunkSize) { // Entity 调用
	const $ = this.var;

	const x = $.pos.x, y = $.pos.y; // 实体坐标
	const r = $.attr.radius; // 实体半径

	const old = $.chunks.slice(); // 复制保存一份更新前的区块列表
	$.chunks = []; // 清空区块列表，准备更新

	const cs = chunkSize; // chunk size 区块大小
	const cr = Math.ceil(r / cs); // chunk radius 区块半径
	const bc = { // base chunk 基准区块
		x: Math.floor(x / cs),
		y: Math.floor(y / cs),
	};

	const add = (cx, cy) => { // 添加区块
		$.chunks.push({x: cx, y: cy});
	};

	for (let cx = bc.x - cr; cx <= bc.x + cr; cx ++ ) { // chunk x 遍历可能的区块
		for (let cy = bc.y - cr; cy <= bc.y + cr; cy ++ ) { // chunk y
			if ( cx < 0 || cy < 0 ) 
				continue;
			if ( cx == bc.x ) { // 与基准区块同一列
				if ( cy > bc.y ) { // 下侧
					if ( cy * cs <= y + r )
						add(cx, cy);
				} else { // 上测或恰好在基准区块
					if ( (cy + 1) * cs >= y - r ) 
						add(cx, cy);
				}
			} else if ( cy == bc.y ) { // 与基准区块同一行
				if ( cx > bc.x ) { // 右侧
					if ( cx * cs <= x + r )
						add(cx, cy);
				} else if ( cx < bc.x ) { // 左侧 实际上直接用 else 应该有同样的效果
					if ( (cx + 1) * cs >= x - r )
						add(cx, cy);
				}
			} else { // 在四个 "象限"
				const dx = (cx + (cx < bc.x)) * cs - x;
				const dy = (cy + (cy < bc.y)) * cs - y;
				if ( Math.sqrt(dx * dx + dy * dy) <= r )
					add(cx, cy);
			}
		}
	}

	return {
		oldChunks: old,
		newChunks: $.chunks,
	};
}

function updateChunks() { // Game 调用
	const $ = this.var;
	Object.keys($.entities).forEach(uuid => {
		const entity = $.entities[uuid];
		if ( entity.var.attr.ghost ) { // 无碰撞箱
			return ;
		}
		const chunkInfo = getChunkUpdate.bind(entity)($.props.chunk_size); // 获取新旧区块信息
		if ( chunkInfo ) {
			const oldChunks = chunkInfo.oldChunks; // 更新前区块
			const newChunks = chunkInfo.newChunks; // 更新后区块
			oldChunks.forEach(chunk => { // 遍历旧区块
				const id = getChunkID(chunk); // 区块 ID
				if ( $.chunks[id] ) {
					const idx = $.chunks[id].findIndex(uuid_ => (uuid == uuid_)); // 寻找这个区块中的当前实体的记录
					if ( idx != -1 ) { // 找到
						$.chunks[id].splice(idx, 1); // 删除
					}
				}
			});
			newChunks.forEach(chunk => { // 遍历新区块 并记录 uuid
				const id = getChunkID(chunk);
				if ( $.chunks[id] ) {
					$.chunks[id].push(uuid);
				} else {
					$.chunks[id] = [uuid];
				}
			});
		}
	});
}

function getChunkID(chunk) { // gets the ID of the chunk
	return chunk.x * chunk_id_constant + chunk.y;
}

function solveCollisions(dt) {
	const $ = this.var;

	let collisions = [];

	Object.values($.chunks).forEach(entityList => { // 遍历区块
		entityList = entityList.filter(uuid => (!($.entities[uuid].var.attr.ghost))); // 过滤无碰撞箱实体

		const n = entityList.length; // 区块实体数量
		if ( n <= 1 ) // 小于等于 1 个实体时不会有碰撞
			return ;
		
		for (let i = 0; i < n - 1; i ++ ) { // 枚举两个可能碰撞的实体
			for (let j = i + 1; j < n; j ++ ) {
				const uuid1 = entityList[i], uuid2 = entityList[j]; // 获取 uuid
				const entity1 = $.entities[uuid1], entity2 = $.entities[uuid2]; // 获取实体
				if ( !entity1 || !entity2 )
					continue;
				if ( $.props.ghost_friendly_petal && entity1.var.team == entity2.var.team && (entity1.var.type == 'petal' || entity2.var.type == 'petal') )
					continue;
				const d = util.getDistance(entity1.var.pos, entity2.var.pos); // distance 两实体距离
				const r1 = entity1.var.attr.radius, r2 = entity2.var.attr.radius; // 两实体半径
				if ( d < r1 + r2 ) { // 可以碰撞
					collisions.push({
						uuid1: uuid1,
						uuid2: uuid2,
					});
				}
			}
		}
	});

	collisions = collisions.reduce((list, cur) => { // 去重
		if ( !list.find((prev) => {
			return (cur.uuid1 == prev.uuid1 && cur.uuid2 == prev.uuid2)
				|| (cur.uuid1 == prev.uuid2 && cur.uuid2 == prev.uuid1);
		}) ) {
			list.push(cur);
		}
		return list;
	}, []);

	collisions.forEach(collision => {
		const e1 = $.entities[collision.uuid1], e2 = $.entities[collision.uuid2]; // 碰撞的两个实体
		if ( !e1 || !e2 || (e1.var.attr.hp <= 0) || (e2.var.attr.hp <= 0) ) // 实体不存在或血量欠费
			return ;
		
		const pos1 = e1.var.pos, pos2 = e2.var.pos;
		// const v1 = e1.var.v, v2 = e2.var.v;
		const x1 = pos1.x, y1 = pos1.y, x2 = pos2.x, y2 = pos2.y;
		const d = util.getDistance(pos1, pos2); // 距离
		const r1 = e1.var.attr.radius, r2 = e2.var.attr.radius; // 半径
		const p = r1 + r2 - d; // 穿透深度
		const m1 = e1.var.attr.mass, m2 = e2.var.attr.mass; // 重量
		const theta1 = Math.atan2(y2 - y1, x2 - x1); // e2 相对于 e1 的方向，水平向右为 0
		const theta2 = theta1 - Math.PI;
		const kb1 = e1.var.attr.kb, kb2 = e2.var.attr.kb; // 额外击退量

		const kbv1 = (p * $.props.pkb + kb1) * m2 / (m1 + m2), kbv2 = (p * $.props.pkb + kb2) * m1 / (m1 + m2); // 速度
		const q1 = e1.var.attr.elasticity, q2 = e2.var.attr.elasticity; // 弹力系数

		appendVelocity.bind(e1)(kbv1 * Math.cos(theta2) / dt, kbv1 * Math.sin(theta2) / dt, q1); // 应用击退速度
		appendVelocity.bind(e2)(kbv2 * Math.cos(theta1) / dt, kbv2 * Math.sin(theta1) / dt, q2);

		solveCollision.bind(this)(e1, e2); // 进行碰撞判定（伤害，技能等）
		solveCollision.bind(this)(e2, e1);
	});
}

function solveCollision(source, target) {
	const $ = this.var;

	// 进行伤害与反伤判定
	(() => {
		if ( source.var.team != target.var.team ) { // 如果队伍不同
			target.var.attr.hp -= source.var.attr.dmg; // 对目标造成伤害
			target.var.isHurt = true;

			// 目标执行反伤
			(() => {
				if ( !target.var.attr.dmg_reflect ) // 目标未设置反伤
					return ;
				const reflect_dmg = (target.var.attr.dmg_reflect * 0.01) * source.var.attr.dmg; // 计算反伤
				if ( source.var.type != 'petal' ) { // 源不是花瓣 直接执行反伤
					source.var.attr.hp -= reflect_dmg;
				} else { // 源是花瓣 执行反伤到玩家
					const player = $.entities[source.var.parent];
					player.var.attr.hp -= reflect_dmg;
				}
			})();
		}
	})();


	// 目标受到中毒
	(() => {
		if ( source.var.team != target.var.team ) { // 如果队伍不同
			if ( source.var.attr.poison ) // 是否存在碰撞给予中毒属性
				target.effect('poison', source.var.attr.poison.duration, source.var.attr.poison.dmg);
		}
	})();

	if ( source.var.type == 'petal' ) { // 源是花瓣
		
		// 触发花瓣技能触发器
		togglePetalSkillTrigger.bind(this)('onHit', source, target);
	}
}

export {
	init,
	solveBorderCollisions,
	updateChunks,
	getChunkID,
	solveCollisions,
};