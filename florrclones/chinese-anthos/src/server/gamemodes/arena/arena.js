import * as time from '../../game/time.js'; // 时间相关方法
import * as playerHandler from '../../game/playerHandler.js';
import * as entityHandler from '../../game/entityHandler.js';
import * as physics from '../../game/physics.js';
import Constants from '../../../shared/constants.js';
import * as util from '../../game/utility.js';

class Game_Arena {
	constructor(settings) {
		this.var = {
			isStarted: false, 
			isOver: false,
			tick: 0, // 游戏刻计数
			ended: false,
			stopped: false,
		};
		this.init(settings);
	}

	init(settings) {
		this.var.props = settings;
		time.init.bind(this)();
		playerHandler.init.bind(this)();
		entityHandler.init.bind(this)();
		physics.init.bind(this)();
	}

	start(endFn) { // 开始游戏
		const $ = this.var;
		$.endFn = endFn; // 结束函数
		$.isStarted = true; // 表示游戏开始
		$.intervalID = setInterval(this.update.bind(this), 1000 / $.props.tick_per_second); // 开启游戏主循环
	}

	stop() { // 停止游戏
		this.var.stopped = true;
		clearInterval(this.var.intervalID); // 停止主循环
	}

	update() {
		if ( !this.var.stopped ) {
			time.update.bind(this)();
			const dt = 1 / this.var.props.tick_per_second;
			this.var.tick ++;
			entityHandler.updateEntities.bind(this)(); // 更新实体
			playerHandler.updatePlayers.bind(this)(); // 更新玩家
			entityHandler.updateAcceleration.bind(this)(dt); // 更新加速度
			entityHandler.updateVelocity.bind(this)(dt); // 更新速度
			entityHandler.updatePosition.bind(this)(dt); // 更新位置
			physics.updateChunks.bind(this)(); // 更新区块信息
			physics.solveCollisions.bind(this)(dt); // 计算碰撞
			physics.solveBorderCollisions.bind(this)(); // 处理边界碰撞
			entityHandler.handleEntityDeaths.bind(this)(); // 处理实体死亡
			if ( !this.var.ended )
				this.checkGameOver();
			this.sendUpdate();
		}
	}

	checkGameOver() {
		const $ = this.var;
		let aliveTeams = {}, winners = []; // 记录存活队伍，获胜者列表
		Object.values($.players).forEach(uuid => {
			const player = $.entities[uuid];
			if ( !player.var.spec ) {
				aliveTeams[player.var.team] = true;
			}
		});
		if ( Object.keys(aliveTeams).length <= 1 ) { // 只剩不超过一个队伍存活
			console.log(aliveTeams);
			if ( Object.keys(aliveTeams).length == 0 ) { // 同归于尽
				winners = ['The Dandelion Gods'];
			} else {
				Object.values($.players).forEach(uuid => { // 统计存活队伍的成员
					const player = $.entities[uuid];
					if ( player.var.team == aliveTeams[Object.keys(aliveTeams)[0]] ) {
						winners.push(player.var.playerInfo.username);
					}
				});
			}
			this.var.ended = true;
			setTimeout(() => {
				$.endFn(winners); // 执行房间传来的结束函数
			}, 5000);
		}
	}

	handlePlayerInput(socketID, type, input) {
		const $ = this.var;
		const player = $.entities[$.players[socketID]];
		if ( type == 0 ) { // 鼠标移动
			entityHandler.move.bind(player)(input.dir, input.power * player.var.attr.speed);
		} else if ( type == 1 ) { // 鼠标按下/松开
			player.var.state = input;
		}
	}

	addPlayer(socket, username, team) {
		playerHandler.addPlayer.bind(this)(socket, username, team);
	}

	sendUpdate() {
		const $ = this.var;
		Object.keys($.sockets).forEach(socketID => {
			const socket = $.sockets[socketID];
			const player = $.entities[$.players[socketID]];
			const update = this.createUpdate(player);
			socket.emit(Constants.MSG_TYPES.SERVER.GAME.UPDATE, update);
		});
	}

	createUpdate(player) {
		const $ = this.var;
		const d = player.var.attr.vision; // 视距
		const nearbyEntities = Object.values($.entities).filter(e => ((e.var.uuid != player.var.uuid) && (util.getDistance(e.var.pos, player.var.pos) <= d)));

		return {
			t: Date.now(), // current time
			mspt: Date.now() - this.var.time.lastUpdTime, // mspt
			self: entityHandler.getUpdate.bind(player)(),
			entities: nearbyEntities.map(e => entityHandler.getUpdate.bind(e)()), // 视距内实体
		};
	}
}

export default Game_Arena;