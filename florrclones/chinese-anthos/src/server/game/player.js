import Entity from './entity.js';

class Player extends Entity {
	constructor(socketID, username, x, y, team, attr ) {
		super('player', x, y, team, attr);
		const $ = this.var;
		$.playerInfo = { // 玩家信息
			socketID: socketID, // socket ID
			username: username, // 用户名
		};
		$.spec = false; // 是否为观察者
		$.state = 0; // 鼠标按下情况 0:无 1:左键 2:右键 3:左右
		$.heal = { // 每刻非自然回血
			point: 0, // 点数
			percent: 0, // 总血量百分点
		};
		$.stack = {}; // 花瓣堆叠计数
		$.petals = []; // 已解绑花瓣 uuid
		$.angle = 0; // 轨道起始角度
		$.rot_speed = 0.1; // 轨道转速 单位:弧度 / 刻 只能为正值
		$.rot_dir = 1; // 旋转乘数 -1 / 0 / 1 逆时针 停转 顺时针
		$.orbit = [65, 130, 35, 130]; // 不同状态下花瓣轨道半径 正常 攻击 防御 同时攻击防御
		$.vision = 1; // 客户端视距
	}

	setSpec(state) { // 设置是否为观察者
		const $ = this.var;
		$.spec = state;
		$.attr.ghost = true;
		$.attr.speed = 2500;
		$.attr.friction = 0.85;
		$.attr.invulnerable = true;
		$.attr.vision = 3000;
		$.vision = 2;
	}

	regen() { // 非自然回血
		const $ = this.var;
		this.heal($.heal.point + $.heal.percent * $.attr.max_hp * 0.01);
	}
}

export default Player;