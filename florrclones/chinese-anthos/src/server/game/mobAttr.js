// 生物默认属性表 参考 entity.js

export default Object.freeze({
	default: {
		// hp 未设置时会自动设置成 max_hp
		max_hp: 100,
		radius: 20,
		vision: 1000,
		mass: 100,
		speed: 2000,
		ghost: false,
		ignore_border: false,
		invulnerable: false,
		poison_res: 0,
		poison: {duration: 0, dmg: 0},
		dmg_reflect: 0,
		dir: 0,
		friction: 0.7,
		kb: 0,
		elasticity: 0.7,
	},
	player: { // 玩家
		max_hp: 150,
		radius: 25,
		vision: 2000,
		mass: 100,
		dmg: 25,
		speed: 2000,
		kb: 20,
	},
});