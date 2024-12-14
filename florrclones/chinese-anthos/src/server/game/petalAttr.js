// 实体花瓣的属性

export default Object.freeze({
	'default': { // 未设置必设置项时的默认设置
		max_hp: 10,
		radius: 12,
		mass: 10,
		dmg: 10,
		ignore_border: true,
		invulnerable: false,
		poison_res: 1,
		poison: {duration: 0, dmg: 0},
		dmg_reflect: 0,
		dir: 0,
		friction: 0.7,
		kb: 0,
		elasticity: 0.7,
	},
	'basic': { // 实体花瓣 id
		max_hp: 10,
		dmg: 10,
	},
	'stinger': {
		max_hp: 8,
		dmg: 35,
		radius: 8,
	},
	'light': {
		max_hp: 5,
		dmg: 8,
		radius: 6,
	},
	'corn': {
		max_hp: 2000,
		dmg: 1,
	},
	'rice': {
		max_hp: 5,
		dmg: 5,
	},
	'heavy': {
		max_hp: 200,
		dmg: 10,
		radius: 20,
	},
	'rock': {
		max_hp: 90,
		dmg: 10,
	},
	'leaf': {
		max_hp: 10,
		dmg: 8,
	},
	'iris': {
		max_hp: 5,
		dmg: 5,
		radius: 8,
	},
	'rose': {
		max_hp: 5,
		dmg: 5,
	},
	'epic_rose': {
		max_hp: 5,
		dmg: 5,
	},
	'dahlia': {
		max_hp: 5,
		dmg: 3,
		radius: 8,
	},
	'wing': {
		max_hp: 15,
		dmg: 15,
	},
	'cactus': {
		max_hp: 15,
		dmg: 5,
		radius: 15,
	},
	'faster': {
		max_hp: 5,
		dmg: 8,	
		radius: 8,
	},
	'cactus_toxic': {
		max_hp: 15,
		dmg: 5,
		radius: 15,
	},
	'salt': {
		max_hp: 10,
		dmg: 10,
	},
	'bubble': {
		max_hp: 1,
		dmg: 0,
	},
	'missile': {
		max_hp: 10,
		dmg: 35,
		radius: 8,
	},
	'yinyang': {
		max_hp: 15,
		dmg: 15,
	},
	'peas': {
		max_hp: 20,
		dmg: 8,
		radius: 16,
	},
	'peas_single': {
		max_hp: 5,
		dmg: 8,
		radius: 8,
	},
	'peas_toxic': {
		max_hp: 20,
		dmg: 8,
		radius: 16,
	},
	'peas_toxic_single': {
		max_hp: 5,
		dmg: 8,
		radius: 8,
	},
	'peas_legendary': {
		max_hp: 30,
		dmg: 10,
		radius: 20,
	},
	'peas_legendary_single': {
		max_hp: 7.5,
		dmg: 10,
		radius: 10,
	},
	'dandelion': {
		max_hp: 10,
		dmg: 5,
	},
	'pollen': {
		max_hp: 5,
		dmg: 8,
		radius: 6,
	},
});

/*
key: 默认值
描述
hp: max_hp
血量
max_hp: 10
最大血量
radius: 10
半径（碰撞箱）
mass: 10
重量
dmg: 10
伤害
ignore_border: true
无边界碰撞
*/