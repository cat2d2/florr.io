import * as entityHandler from './entityHandler.js';
import * as playerHandler from './playerHandler.js';
import petalAttr from './petalAttr.js';

// 花瓣技能

export default Object.freeze({
	'consistent_heal': {
		/*
			技能介绍：
				持续回血，使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				consistent_heal: heal // 回血量，单位: 点 / 刻
			变量域：
				consistent_heal
		*/
		'onFirstLoad': [
			// 首次 load 时增加 heal 点每刻自然回血
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.heal.point += sv.consistent_heal;
			},
		],
		'onUnequip': [
			// unequip 时减少 heal 点每刻自然回血
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.heal.point -= sv.consistent_heal;
			},
		],
	},
	'effect_on_hit': {
		/*
			技能介绍：
				击中的实体获得中毒效果
			前置技能：
				无
			参数：
				effect_on_hit: {
					id,		// 效果 id
					duration:,	// 持续时间 单位: 刻
					value,		// 效果值
				}
			变量域：
				effect_on_hit
		*/
		'onHit': [
			// 击中目标时给予中毒效果
			function (instance, target) {
				const sv = instance.var.skill_var;
				target.effect(sv.effect_on_hit.id, sv.effect_on_hit.duration, sv.effect_on_hit.value);
			}
		],
	},
	'heal': {
		/*
			技能介绍：
				回血
			前置技能：
				flag
			参数：
				heal: {
					start, // start flag
					value, // 回血值 单位: 点
				}
			变量域：
				heal
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				if ( !sv.flag[sv.heal.start] ) // 判断准备是否完成
					return ;
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const heal = sv.heal.value; // 回血量
				player.heal(heal); // 回血
			}
		],
	},
	'attach': {
		/*
			技能介绍：
				使用此技能的花瓣不可解绑，on flag 为 true 时 设置特殊轨道（贴着玩家的轨道），false 时 取消特殊轨道
			前置技能：
				flag
			参数：
				attach: {
					condition, // on flag
				}
			变量域：
				attach
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const info = player.var.kit.primary[instance.var.idx].info;
				if ( sv.flag[sv.attach.condition] ) {
					info.orbit_special = player.var.attr.radius + instance.var.attr.radius * 0.8;
				} else {
					info.orbit_special = -1;
				}
			}
		]
	},
	'float': {
		/*
			技能介绍：
				花瓣变成聚合式
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				float: {
					condition, // condition flag
				}
			变量域：
				float
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const info = player.var.kit.primary[instance.var.idx].info;
				info.pattern = (sv.flag[sv.float.condition]) ? 1 : 0;
			}
		]
	},
	'extra_hp': {
		/*
			技能介绍：
				增加额外血量
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				extra_hp: number // 额外血量
			变量域：
				extra_hp
		*/
		'onFirstLoad': [
			// 首次 load 时增加最大血量
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				// 等比增加血量
				const hpPercent = player.var.attr.hp / player.var.attr.max_hp;
				player.var.attr.max_hp += sv.extra_hp;
				player.var.attr.hp = hpPercent * player.var.attr.max_hp;
			},
		],
		'onUnequip': [
			// unequip 时减少最大血量
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				// 等比减少血量
				const hpPercent = player.var.attr.hp / player.var.attr.max_hp;
				player.var.attr.max_hp -= sv.extra_hp;
				player.var.attr.hp = hpPercent * player.var.attr.max_hp;
			},
		],
	},
	'extra_rot_speed': {
		/*
			技能介绍：
				增加额外转速
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				extra_rot_speed: number // 额外血量
			变量域：
				extra_rot_speed
		*/
		'onFirstLoad': [
			// 首次 load 时增加 extra_rot_speed rad/tick 转速
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.rot_speed += sv.extra_rot_speed;
			},
		],
		'onUnequip': [
			// unequip 时减少 extra_rot_speed rad/tick 转速
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.rot_speed -= sv.extra_rot_speed;
			},
		],
	},
	'dmg_reflect_unstackable': {
		/*
			技能介绍：
				无堆叠反伤
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				dmg_reflect_unstackable: {
					stack_id,		// 堆叠 id
					dmg_reflect,	// 反伤百分点
				}
			变量域：
				dmg_reflect_unstackable
		*/
		'onFirstLoad': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.dmg_reflect_unstackable.stack_id] ??= 0; // 若首次使用 初始化堆叠计数
				player.var.stack[sv.dmg_reflect_unstackable.stack_id] ++; // 更新堆叠计数
				if ( player.var.stack[sv.dmg_reflect_unstackable.stack_id] == 1 ) { // 未堆叠
					player.var.attr.dmg_reflect += sv.dmg_reflect_unstackable.dmg_reflect; // 更新反伤百分比
				}
			},
		],
		'onUnequip': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.dmg_reflect_unstackable.stack_id] --; // 更新堆叠计数
				if ( player.var.stack[sv.dmg_reflect_unstackable.stack_id] == 0 ) { // 未堆叠
					player.var.attr.dmg_reflect -= sv.dmg_reflect_unstackable.dmg_reflect; // 更新反伤百分比
				}
			},
		],
	},
	'poison_unstackable': {
		/*
			技能介绍：
				无堆叠玩家本体毒伤，卸下时失效
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				poison_unstackable: {
					stack_id,		// 堆叠 id
					duration,	// 中毒持续时间
					dmg,			// 中毒每刻伤害
				}
			变量域：
				poison_unstackable
		*/
		'onLoad': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.poison_unstackable.stack_id] ??= 0; // 若首次使用 初始化堆叠计数
				player.var.stack[sv.poison_unstackable.stack_id] ++; // 更新堆叠计数
				if ( player.var.stack[sv.poison_unstackable.stack_id] == 1 ) { // 未堆叠
					player.var.attr.poison.duration = sv.poison_unstackable.duration; // 设置玩家毒伤
					player.var.attr.poison.dmg = sv.poison_unstackable.dmg;
				}
			},
		],
		'onDeath': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.poison_unstackable.stack_id] --; // 更新堆叠计数
				if ( player.var.stack[sv.poison_unstackable.stack_id] == 0 ) { // 未堆叠
					player.var.attr.poison.duration = 0; // 设置玩家毒伤
					player.var.attr.poison.dmg = 0;
				}
			},
		],
	},
	'push': {
		/*
			技能介绍：
				推进
			前置技能：
				flag
			参数：
				push: {
					start, // start flag
					power, // 推进力量
					coeff, // 推进速度衰减系数
				}
			变量域：
				push
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				if ( !sv.flag[sv.push.start] )
					return ;
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const dir = Math.atan2((player.var.pos.y - instance.var.pos.y), (player.var.pos.x - instance.var.pos.x)); // 推进方向
				entityHandler.appendVelocity.bind(player)( // 推进
					Math.cos(dir) * sv.push.power,
					Math.sin(dir) * sv.push.power,
					sv.push.coeff, // 泡泡速度衰减系数
				);
			}
		]
	},
	'project': {
		/*
			技能介绍：
				弹射物发射
			前置技能：
				flag
			参数：
				project: {
					start, // start flag
					speed, // 推进力量
					coeff, // 推进速度衰减系数
				}
			变量域：
				project
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				if ( !sv.flag[sv.project.start] )
					return ;
				if ( !sv.project.launch ) { // 第一刻
					sv.project.launch = true;
					if ( !instance.var.unbound ) {
						const $ = this.var;
						const player = $.entities[instance.var.parent];
						playerHandler.handlePetalDeath.bind(this)(instance); // 移除对花瓣的记录
						instance.var.unbound_idx = player.var.petals.push(instance.var.uuid) - 1; // 记录在已解绑花瓣中 记录 unbound_idx
						instance.var.unbound = true;
						if ( sv.dir )
							sv.dir.type = 'none'; // 停止改变方向
					}
					const dir = instance.var.attr.dir;
					entityHandler.move.bind(instance)(0, 0); // 清空加速度 否则会保留原来维持轨道的加速度
					entityHandler.appendVelocity.bind(instance)(
						sv.project.speed * Math.cos(dir),
						sv.project.speed * Math.sin(dir),
						sv.project.coeff,
					);
				}
			},
		],
	},
	'dir': {
		/*
			技能介绍：
				旋转方向
			前置技能：
				无
			参数：
				dir: {
					type,		// 方向类型
						'radial': 径向
						'none': 停止改变方向
						'rotate': 旋转
						'sub_orbit': 继承亚轨道方向
					rot_speed,	// 类型为 rotate 时旋转速度 单位: rad / tick
				}
			变量域：
				dir
		*/
		'onTick': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				if ( sv.dir.type == 'none' ) {
					return ;
				} else if ( sv.dir.type == 'radial' ) {
					instance.var.attr.dir = Math.atan2(instance.var.pos.y - player.var.pos.y, instance.var.pos.x - player.var.pos.x);
				} else if ( sv.dir.type == 'rotate' ) {
					instance.var.attr.dir = (instance.var.attr.dir + sv.dir.rot_speed) % (Math.PI * 2);
				} else if ( sv.dir.type == 'sub_orbit' ) {
					const info = player.var.kit.primary[instance.var.idx].info;
					instance.var.attr.dir = info.angle;
				}
			}
		]
	},
	'yinyang': {
		/*
			技能介绍：
				阴阳
				使用此技能的花瓣不可解绑
			前置技能：
				无
			参数：
				yinyang: {
					stack_id,	// 用于堆叠计数
				}
			变量域：
				yinyang
		*/
		'onFirstLoad': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.yinyang.stack_id] ??= 0; // 若首次使用 初始化堆叠计数
				player.var.stack[sv.yinyang.stack_id] ++; // 更新堆叠计数
				if ( player.var.stack[sv.yinyang.stack_id] % 2 == 1 ) { // 逆时针
					player.var.rot_dir = -1;
				} else { // 顺时针
					player.var.rot_dir = 1;
				}
			},
		],
		'onUnequip': [
			function (instance) {
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				const sv = instance.var.skill_var;
				player.var.stack[sv.yinyang.stack_id] --; // 更新堆叠计数
				if ( player.var.stack[sv.yinyang.stack_id] % 2 == 1 ) { // 逆时针
					player.var.rot_dir = -1;
				} else { // 顺时针
					player.var.rot_dir = 1;
				}
			},
		],
	},
	'spawn': {
		/*
			技能介绍：
				生成花瓣
			前置技能：
				flag
			参数：
				spawn: {
					start,		// start flag
					count,		// 生成数量
					child: {
						id,	// 生成的花瓣 id
						skill_set,	// 技能组
						skill_var,	// 技能变量
						attr,		// 属性
					}
				}
			变量域：
				spawn
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				if ( !sv.flag[sv.spawn.start] )
					return ;
				const $ = this.var;
				const player = $.entities[instance.var.parent];

				const defaultAttr = structuredClone(petalAttr['default']); // 未设置值默认值

				// 自动设置未设置值为默认值
				Object.keys(defaultAttr).forEach(key => {
					sv.spawn.child.attr[key] ??= defaultAttr[key];
				});
				sv.spawn.child.attr.hp ??= sv.spawn.child.attr.max_hp;

				for (let i = 0; i < sv.spawn.count; i ++ ) {
					playerHandler.newUnboundPetal.bind(this)(
						sv.spawn.child.id,
						player.var.uuid,
						instance.var.pos.x, instance.var.pos.y,
						instance.var.attr.dir + i * (Math.PI * 2 / sv.spawn.count),
						structuredClone(sv.spawn.child.skill_set),
						structuredClone(sv.spawn.child.skill_var),
						structuredClone(sv.spawn.child.attr),
					);
				}
			},
		],
	},
	'remove': {
		/*
			技能介绍：
				删除自己，请把这个技能放到最后
			前置技能：
				flag
			参数：
				remove: {
					on, // on flag
				}
			变量域：
				remove
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				if ( sv.flag[sv.remove.on] ) {
					playerHandler.handlePetalDeath.bind(this)(instance);
					entityHandler.removeEntity.bind(this)(instance.var.uuid);
				}
			}
		]
	},
	'timer': {
		/*
			技能介绍：
				计时器，start 标签为 true 时开始倒计时 time 刻，计时结束后 end 标签设为 true
			前置技能：
				flag
			参数：
				timer: [
					{
						time,	// 目标时间
						start,	// start flag
						end,	// end flag
						condition, // condition flag 默认为 'true'
						reset, // 是否在条件不满足时重置 默认为 true
					}
				]
			变量域：
				timer
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				Object.values(sv.timer).forEach(timer => {
					if ( sv.flag[timer.end] ) // 计时已结束
						return ;
					if ( sv.flag[timer.start] ) { // 计时开始
						timer.t ??= 0;				// 未设置初始时间 设置为 0
						timer.condition ??= 'true'; // 未设置条件 设置为 true
						if ( sv.flag[timer.condition] ) { // 条件满足
							timer.t ++; // 更新计时器
							if ( timer.t >= timer.time ) // 计时结束
								sv.flag[timer.end] = true; // 设置 end 标签为 true
						} else { // 条件不满足
							timer.reset ??= true;
							if ( timer.reset ) {
								timer.t = 0;
							}
						}
					}
				});
			}
		],
	},
	'player_state': {
		/*
			技能介绍：
				player_attack, player_defend, player_need_heal
			前置技能：
				flag
			参数：
				无
			变量域：
				无
		*/
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				const $ = this.var;
				const player = $.entities[instance.var.parent];
				sv.flag['player_attack'] = (player.var.state & 1) ? true : false;
				sv.flag['player_defend'] = (player.var.state & 2) ? true : false;
				sv.flag['player_need_heal'] = (player.var.attr.hp < player.var.attr.max_hp) ? true : false;
			}
		]
	},
	'flag': {
		/*
			技能介绍：
				初始化 flag，onSpawn 时自动设置 flag 'spawn' 为 true，'true' / 'false' flag 为对应值
			前置技能：
				无
			参数：
				flag_rules: {
					'and': {
						flag: flag_list // flag_list 全都为 true 时 flag 设为 true
					},
					'or': {
						flag: flag_list // flag_list 至少一个为 true 时 flag 设为 true
					},
					'not': {
						flag: flag_list // flag_list 全都为 false 时 flag 设为 true
					}
				}
			变量域：
				flag, flag_rules
		*/
		'onSpawn': [
			function (instance) {
				const sv = instance.var.skill_var;
				sv.flag = {'spawn': true, 'true': true, 'false': false};
			}
		],
		'onTick': [
			function (instance) {
				const sv = instance.var.skill_var;
				const rules = sv.flag_rules; // 规则 obj
				if ( !rules )
					return ;
				if ( rules['and'] ) {
					const r = rules['and'];
					Object.keys(r).forEach(key => {
						const flag_list = r[key];
						sv.flag[key] = true;
						flag_list.forEach(flag => {
							sv.flag[key] &= sv.flag[flag];
						});
					});
				}
				if ( rules['or'] ) {
					const r = rules['or'];
					Object.keys(r).forEach(key => {
						const flag_list = r[key];
						sv.flag[key] = false;
						flag_list.forEach(flag => {
							sv.flag[key] |= sv.flag[flag];
						});
					});
				}
				if ( rules['not'] ) {
					const r = rules['not'];
					Object.keys(r).forEach(key => {
						const flag_list = r[key];
						sv.flag[key] = false;
						flag_list.forEach(flag => {
							sv.flag[key] |= sv.flag[flag];
						});
						sv.flag[key] ^= true;
					});
				}
			}
		]
	}
});

/*
技能详细信息请看代码注释
技能详细信息格式

技能介绍：
	技能介绍
前置技能：
	前置技能
参数：
	参数
变量域：
	变量域

参数表示需要定义时传入的参数
变量域表示储存相关变量的 obj key
*/

/*
建议技能列表按照前置顺序排列，正常情况下不存在互为前置的技能
若 A 为 B 的前置，则 A 排在 B 的前面

不同技能技能执行顺序与技能列表中位置有关
同一触发器下不同函数按顺序执行

花瓣技能属于抽象花瓣，根据抽象花瓣的 id 来判定技能组
触发器触发顺序
unbound onTick -> bound onTick -> onFirstLoad -> onLoad -> onHit
*/

/*
触发器列表
onSpawn			// 生成实体时最先触发的触发器 该触发器不能使用 this
onFirstLoad		// 首次被抽象花瓣加载
onLoad			// 被抽象花瓣加载
onDeath			// 死亡
onHit			// 击中目标
onTick			// 每刻执行
*/