// 花瓣信息 也就是 抽象花瓣的属性
import petalAttr from './petalAttr.js';

export default Object.freeze({
	'default': { // 默认值
		cd: 25,
		count: 1,
		pattern: 0,
		angle: 0,
		orbit_extra: [0, 0, 0, 0], // 默认 左键 右键 左右
		orbit_disabled: [false, false, false, false],
		orbit_special: -1,
		sub_orbit: 10,
		sub_orbit_type: '', // 'radial', 'rotate', 'radial_reverse'
		sub_orbit_rot_speed: 0, // rad / tick
		cuml_cnt: 0,
		skill_set: [],
		skill_var: {},
	},
	'basic': {
		cd: 62,
	},
	'stinger': {
		cd: 100,
		skill_set: ['dir'],
		skill_var: {
			dir: {
				type: 'rotate',
				rot_speed: 0.05,
			}
		}
	},
	'triple_stinger': {
		instance_id: 'stinger',
		cd: 100,
		count: 3,
		pattern: 1,
		sub_orbit_type: 'rotate',
		sub_orbit_rot_speed: 0.15,
		skill_set: ['dir'],
		skill_var: {
			dir: {
				type: 'rotate',
				rot_speed: 0.05,
			}
		}
	},
	'fast': {
		instance_id: 'light',
		cd: 12,
	},
	'twin': {
		instance_id: 'light',
		cd: 25,
		count: 2,
	},
	'triplet': {
		instance_id: 'light',
		cd: 25,
		count: 3,
	},
	'penta': {
		instance_id: 'light',
		cd: 25,
		count: 5,
	},
	'rice': {
		cd: 1,
	},
	'corn': {
		cd: 875,
	},
	'rock': {
		cd: 250,
	},
	'heavy': {
		cd: 500,
	},
	'leaf': {
		cd: 25,
		skill_set: ['consistent_heal'],
		skill_var: {
			consistent_heal: 0.04,
		},
	},
	'iris': {
		cd: 150,
		skill_set: ['effect_on_hit'],
		skill_var: {
			effect_on_hit: {
				id: 'poison',
				duration: 150,
				value: 0.4,
			}
		},
	},
	'rose': {
		cd: 75,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'attach', 'heal', 'remove'],
		skill_var: {
			flag_rules: {
				'and': {
					'attach': ['player_need_heal', 'ready'],
				}
			},
			timer: [
				{
					time: 25,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 12,
					start: 'ready',
					end: 'use',
					condition: 'player_need_heal',
				}
			],
			attach: {
				condition: 'attach',
			},
			heal: {
				start: 'use',
				value: 10,
			},
			remove: {
				on: 'use',
			},
		},
	},
	'epic_rose': {
		cd: 75,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'attach', 'heal', 'remove'],
		skill_var: {
			flag_rules: {
				'and': {
					'attach': ['player_need_heal', 'ready'],
				}
			},
			timer: [
				{
					time: 25,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 12,
					start: 'ready',
					end: 'use',
					condition: 'player_need_heal',
				}
			],
			attach: {
				condition: 'attach',
			},
			heal: {
				start: 'use',
				value: 22,
			},
			remove: {
				on: 'use',
			},
		},
	},
	'dahlia': {
		cd: 75,
		orbit_disabled: [false, true, false, true],
		count: 3,
		pattern: 1,
		sub_orbit: 8,
		sub_orbit_type: 'radial_reverse',
		skill_set: ['flag', 'timer', 'player_state', 'attach', 'heal', 'remove'],
		skill_var: {
			flag_rules: {
				'and': {
					'attach': ['player_need_heal', 'ready'],
				}
			},
			timer: [
				{
					time: 12,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 8,
					start: 'ready',
					end: 'use',
					condition: 'player_need_heal',
				}
			],
			attach: {
				condition: 'attach',
			},
			heal: {
				start: 'use',
				value: 1.8,
			},
			remove: {
				on: 'use',
			},
		},
	},
	'wing': {
		cd: 30,
		sub_orbit: 10,
		sub_orbit_type: 'rotate', // 'radial', 'rotate'
		sub_orbit_rot_speed: 0.4, // rad / tick
		skill_set: ['flag', 'player_state', 'float'],
		skill_var: {
			float: {
				condition: 'player_attack',
			}
		}
	},
	'cactus': {
		cd: 25,
		skill_set: ['extra_hp'],
		skill_var: {
			extra_hp: 20,
		},
	},
	'faster': {
		cd: 12,
		skill_set: ['extra_rot_speed'],
		skill_var: {
			extra_rot_speed: 0.032,
		},
	},
	'cactus_toxic': {
		cd: 25,
		skill_set: ['effect_on_hit', 'extra_hp', 'poison_unstackable'],
		skill_var: {
			effect_on_hit: {
				id: 'poison',
				duration: 15,
				value: 0.4,
			},
			extra_hp: 20,
			poison_unstackable: {
				duration: 100,
				dmg: 0.4,
				stack_id: 'cactus_toxic',
			},
		},
	},
	'salt': {
		cd: 62,
		skill_set: ['dmg_reflect_unstackable'],
		skill_var: {
			dmg_reflect_unstackable: {
				stack_id: 'salt',
				dmg_reflect: 25,
			}
		},
	},
	'triple_cactus': {
		instance_id: 'cactus',
		cd: 25,
		count: 3,
		pattern: 1,
		sub_orbit: 12,
		sub_orbit_type: 'radial',
		skill_set: ['extra_hp'],
		skill_var: {
			extra_hp: 15,
		},
	},
	'bubble': {
		cd: 75,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'push', 'remove'],
		skill_var: {
			timer: [
				{
					time: 1,
					start: 'spawn',
					end: 'use',
					condition: 'player_defend',
				},
			],
			push: {
				start: 'use',
				power: 1000,
				coeff: 0.8,
			},
			remove: {
				on: 'use',
			},
		}
	},
	'missile': {
		cd: 75,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'project', 'dir', 'remove'],
		skill_var: {
			timer: [
				{
					time: 5,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'player_attack',
				},
				{
					time: 100,
					start: 'use',
					end: 'death',
				}
			],
			project: {
				start: 'use',
				speed: 900,
				coeff: 1,
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'death',
			},
		},
	},
	'yinyang': {
		cd: 25,
		skill_set: ['yinyang'],
		skill_var: {
			yinyang: {
				stack_id: 'yinyang',
			}
		}
	},
	'peas': {
		cd: 35,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'spawn', 'dir', 'remove'],
		skill_var: {
			timer: [
				{
					time: 5,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'player_attack',
				},
			],
			spawn: {
				start: 'use',
				count: 4,
				child: {
					id: 'peas_single',
					skill_set: ['flag', 'timer', 'project', 'remove'],
					skill_var: {
						timer: [
							{
								time: 50,
								start: 'spawn',
								end: 'death',
							},
						],
						project: {
							start: 'spawn',
							speed: 700,
							coeff: 1,
						},
						remove: {
							on: 'death',
						},
					},
					attr: petalAttr['peas_single'],
				}
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'use',
			},
		},
	},
	'peas_toxic': {
		cd: 35,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'spawn', 'dir', 'remove'],
		skill_var: {
			timer: [
				{
					time: 5,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'player_attack',
				},
			],
			spawn: {
				start: 'use',
				count: 4,
				child: {
					id: 'peas_toxic_single',
					skill_set: ['flag', 'timer', 'project', 'remove', 'effect_on_hit'],
					skill_var: {
						timer: [
							{
								time: 50,
								start: 'spawn',
								end: 'death',
							},
						],
						project: {
							start: 'spawn',
							speed: 700,
							coeff: 1,
						},
						remove: {
							on: 'death',
						},
						effect_on_hit: {
							id: 'poison',
							duration: 25,
							value: 0.4,
						}
					},
					attr: petalAttr['peas_single'],
				}
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'use',
			},
		},
	},
	'peas_legendary': {
		cd: 35,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'spawn', 'dir', 'remove'],
		skill_var: {
			timer: [
				{
					time: 5,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'player_attack',
				},
			],
			spawn: {
				start: 'use',
				count: 4,
				child: {
					id: 'peas_toxic_single',
					skill_set: ['flag', 'timer', 'project', 'remove', 'effect_on_hit'],
					skill_var: {
						timer: [
							{
								time: 50,
								start: 'spawn',
								end: 'death',
							},
						],
						project: {
							start: 'spawn',
							speed: 700,
							coeff: 1,
						},
						remove: {
							on: 'death',
						},
						effect_on_hit: {
							id: 'poison',
							duration: 50,
							value: 0.4,
						}
					},
					attr: petalAttr['peas_legendary_single'],
				}
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'use',
			},
		},
	},
	'dandelion': {
		cd: 62,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'effect_on_hit', 'project', 'dir', 'remove'],
		skill_var: {
			timer: [
				{
					time: 5,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'player_attack',
				},
				{
					time: 100,
					start: 'use',
					end: 'death',
				}
			],
			effect_on_hit: {
				id: 'heal_res',
				duration: 250,
				value: 100,
			},
			project: {
				start: 'use',
				speed: 800,
				coeff: 1,
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'death',
			},
		},

	},
	'pollen': {
		cd: 25,
		count: 3,
		orbit_disabled: [false, true, false, true],
		skill_set: ['flag', 'timer', 'player_state', 'project', 'dir', 'remove'],
		skill_var: {
			flag_rules: {
				'or': {
					'ok': ['player_attack', 'player_defend'],
				}
			},
			timer: [
				{
					time: 10,
					start: 'spawn',
					end: 'ready',
				},
				{
					time: 1,
					start: 'ready',
					end: 'use',
					condition: 'ok',
				},
				{
					time: 125,
					start: 'use',
					end: 'death',
				}
			],
			project: {
				start: 'use',
				speed: 500,
				coeff: 0.7,
			},
			dir: {
				type: 'radial',
			},
			remove: {
				on: 'death',
			},
		},
	},
});

/*
'basic': { 					// key 与抽象花瓣 id 对应
	instance_id: 'basic', 	// 实体花瓣 id
	cd: 62, 				// 单位:刻 冷却时间 1 为瞬间重生 设置为 <= 0 可能会导致一些问题
	count: 3,				// 数量，等于 1 表示单子，多于 1 表示多子
	pattern: 0, 			// 多子形态，0 表示分散，1 表示聚合
	orbit_extra: [0, 0, 0, 0],
	// 默认 左键 右键 左右
	orbit_disabled: [false, false, false, false],
	// 禁用轨道
	orbit_special: -1,		// 特殊轨道
	sub_orbit: 10,			// 亚轨道半径
	sub_orbit_type: '', 	// 'radial', 'rotate', 'radial_reverse'
	sub_orbit_rot_speed: 0, // rad / tick
	cuml_cnt: 0,			// cumulative count; 累计 load 实例数量
	skill_set: [],			// 技能列表
	skill_var: {},			// 技能变量
},
*/