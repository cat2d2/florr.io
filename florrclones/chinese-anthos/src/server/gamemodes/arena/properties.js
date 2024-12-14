export default Object.freeze({
	tick_per_second: 25, // 游戏 tps
	map_width: 2000, // 地图宽度
	map_height: 2000, // 地图高度
	chunk_size: 200, // 区块大小 用于碰撞判定
	default_kit_info: { // 默认抽象花瓣信息
		size: 8,
		primary: ['stinger', 'iris', 'stinger', 'dandelion', 'cactus_toxic', 'epic_rose', 'salt', 'bubble'],
		// primary: ['faster', 'triplet', 'corn', 'heavy', 'rock', 'rice', 'leaf', 'rose'],
		// primary: ['dahlia', 'wing', 'cactus', 'triple_cactus', 'missile', 'peas', 'peas_toxic', 'peas_legendary'],
		secondary: [],
	},
	pkb: 2, // 穿透击退乘数，游戏内所有碰撞击退都会应用这个乘数
	player_natural_regen: { // 玩家自然回血
		interval: 25, // 单位:刻
		point: 1, // 单位:点
		percent: 0, // 单位:总血量百分点; 取 1 表示 1%
	},
	petal_speed: 150, // 花瓣追踪速度乘数
	// spec_speed: 200, // 观察者速度
	ghost_friendly_petal: true, // 同队花瓣无碰撞
	random_initial_angle: true, // 玩家初始随机轨道起始角度
});