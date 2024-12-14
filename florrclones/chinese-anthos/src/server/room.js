import Constants from '../shared/constants.js';

import { gamemodes, properties } from './gamemodes/gamemodes.js';

const rooms = {
};

const roomIDOfPlayer = {};

const defaultColor = [
	'#ff9c9c',
	'#a1d0ff',
	'#fff7a1',
	'#aaffa1',
	'#b3ffe2',
	'#ffbfea',
	'#f3bfff',
	'#ffc799',
];

/*
主要流程：

1.创建房间 加入房间 此时房间在 wait 状态
此时可以随意修改游戏内用户名，游戏设置，队伍设置等等
此时房间 Game 没有创建
当有玩家的 isReady 属性变化时，执行阶段 2

2.房间会检查此时是否所有玩家的 isReady 都为 true
如果是:
	执行阶段 3
如果否:
	如果此时房间在 load 状态:
		解除 load 状态(unload)，进入 wait 状态
	否则什么都不做

3.进入 load 状态，停止接收不影响 ready 人数的客户端信息
这也就意味着还会接收玩家 isReady 改变，退出房间和断开连接这三个信息
此时房间开始倒计时，每过一秒执行一次阶段 2，直到倒计时结束
倒计时结束，执行阶段 4

4.进入 game 状态
此时在房间层面只接受断开连接的信息
断开连接的玩家移出房间
为选择队伍为 -1 (Random) 的玩家分配随机队伍
创建 Game，写入游戏设置
将玩家加入到 Game 中
开始游戏主循环
游戏结束
进入 wait 状态
删除 Game
进入阶段 1
*/

class Room {
	constructor(mode, ownerID_) {
		this.id = getNewRoomID();
		// 获取新的房间 ID
		this.state = 0;
		// 0: wait, 1: load, 2: game
		// 初始为 wait 状态
		this.sockets = {};
		// (socket)id: socket
		this.players = {};
		// (socket)id: {team, isOwner, username, socketid, isReady}
		// 以 addPlayer 方法为准
		this.playerCount = 0;
		// 维护玩家数量
		this.ownerID = ownerID_;
		// 房主ID
		// if (!gamemodes[mode])
		// 	throw new Error('trying to create room with unknown gamemode');
		this.mode = mode;
		// 游戏模式 (如 arena)
		this.game = undefined;
		// 房间的 Game，也就是游戏本体
		this.teamCount = 2;
		// 队伍数量
		this.teamSize = 1;
		// 队伍大小 指单个队伍人数上限
		this.teams = [];
		// 队伍信息 {color, playerCount}
		// 没有维护队伍具体成员信息，因为似乎暂时用不上
		this.settings = {};
		// 其他设置 未实装，暂定为游戏本体相关设置
		this.resetTeams();
		// 重置队伍信息
	}

	resetTeams() { // 重置队伍(一般发生在队伍设置改变时)
		this.teams = [];
		for (let i = 0; i < this.teamCount; i ++ ) {
			this.teams.push({
				color: defaultColor[i],
				playerCount: 0,
			});
		}
		Object.values(this.players).forEach(player => {
			player.team = -1;
		});
		this.update(5, {teams: this.teams});
	}

	sendInfo(socket) { // 加入房价时发送此时房间信息
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.INFO, {
			players: this.players,
			ownerID: this.ownerID,
			teamCount: this.teamCount,
			teamSize: this.teamSize,
			teams: this.teams,
			settings: this.settings,
		});
	}

	update(type, update, cancel = '') { // 对客户端更新房间信息
		Object.keys(this.sockets).forEach(socketID => {
			if ( socketID == cancel )
				return ;
			const socket = this.sockets[socketID];
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.UPDATE, type, update);
		});
		// addPlayer: 0, {player}
		// removePlayer: 1, {socketid}
		// teamSize: 2, {teamSize}
		// teamCount: 3, {teamCount}
		// username: 4, {id, username}
		// teams: 5, {teams} 重置时更新
		// jointeam: 6, {id, team, prevTeam} 玩家加入队伍
		// owner: 7, {id}
		// ready: 8, {id, isReady, quiet}
		// countdownTime: 9, {countdownTime}
		// state: 10, {state}
		// game settings: 11, {settings}
		// kit: 12, {kit}
	}

	addPlayer(socket, username) { // 在房间加入玩家
		roomIDOfPlayer[socket.id] = this.id;
		this.sockets[socket.id] = socket;
		this.players[socket.id] = {
			'team': -1,
			'isOwner': (socket.id == this.ownerID),
			'username': username,
			'socketID': socket.id,
			'isReady': false,
		};
		this.playerCount += 1;
		this.sendInfo(socket);
		this.update(0, {player: this.players[socket.id]});
	}

	removePlayer(socketID) { // 从房间移除玩家
		this.update(1, {player: this.players[socketID]});
		delete roomIDOfPlayer[socketID];
		delete this.sockets[socketID];
		
		// 删除队伍中的记录
		const team = this.players[socketID].team;
		if ( team != -1 ) {
			this.teams[team].playerCount --;
			this.update(5, {teams: this.teams});
		}

		delete this.players[socketID];
		this.playerCount -= 1;
		if ( this.playerCount == 0 ) {
			if ( this.game )
				this.game.stop();
			delete rooms[this.id];
			// console.log(`Room #${this.id} has been deleted.`);
			return ;
		}
		if ( this.ownerID == socketID ) {
			this.ownerID = Object.keys(this.players)[0];
			this.update(7, {id: this.ownerID});
		}
	}

	checkReady() { // 阶段 2 检查 ready 情况，此时房间 state 只可能是 0(wait) 或 1(load)
		const maxPlayerCnt = this.teamCount * this.teamSize;
		if ( Object.values(this.players).filter(player => player.isReady).length >= maxPlayerCnt - ((maxPlayerCnt == 2) ? 0 : 1) ) { // ready 人数 >= 房间人数上限 - 1
			if ( this.state == 0 ) { // 在 wait 状态
				this.load(); // 执行阶段 3
			}
		} else { // 未完全 ready
			if ( this.state == 1 ) { // 现在在 load 状态
				this.unload();
			}
			// 否则(在 wait 状态)什么都不做
		}
	}

	load() { // 进入阶段 3
		this.updState(1); // 进入 load 状态
		let countdownTime = 3; // 倒计时 Timer
		this.countDown(countdownTime, // t
			this.start.bind(this), // resolve
			(t) => { // check
				this.update(9, {countdownTime: t});
				return (this.state == 1);
			},
			() => {
				this.update(9, {countdownTime: -1});
			}
		);
	}

	updState(newState) { // 更新 state 并同时向客户端发送更新
		this.state = newState;
		this.update(10, {state: newState});
	}

	unload() { // 阶段 3 -> 1
		this.updState(0); // 进入 wait 状态
	}

	start() { // 阶段 4
		this.updState(2); // 进入 game 状态
		Object.values(this.sockets).forEach(socket => {
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.START);
		});
		let spots = []; // 获取所有空闲位置所在的队伍编号
		this.teams.forEach((team, id) => {
			const newArr = new Array(Math.max(0, this.teamSize - team.playerCount));
			spots = spots.concat(newArr.fill(id));
		});
		shuffle(spots); // 打乱这些编号
		let spotIndex = 0;
		Object.values(this.players).forEach(player => {
			if ( player.team == -1 )
				player.team = spots[spotIndex++];
		});

		const defaultSettings = structuredClone(properties[this.mode]);

		// 将未设置属性设置为默认值
		Object.keys(defaultSettings).forEach(key => {
			this.settings[key] ??= defaultSettings[key]; // 游戏设置，会传入 Game 到 $.props
		});

		this.update(11, {settings: this.settings}); // 传到客户端进行初始化
		this.game = new gamemodes[this.mode](this.settings); // 创建 Game 类
		Object.keys(this.sockets).forEach(id => { // id: socket id
			const socket = this.sockets[id];
			const player = this.players[id];
			this.game.addPlayer(socket, player.username, player.team);
		});
		this.game.start(this.end.bind(this));
	}
	
	end(winners) {
		if ( !this.game.var.stopped ) {
			this.game.stop();
			Object.keys(this.sockets).forEach(socketID => {
				const socket = this.sockets[socketID];
				socket.emit(Constants.MSG_TYPES.SERVER.GAME.OVER, winners);
			});
			Object.values(this.players).forEach(player => {
				player.isReady = false;
				player.team = -1;
				// this.update(8, {id: player.socketID, isReady: player.isReady, quiet: true});
			});
			this.resetTeams();
			
			Object.keys(this.sockets).forEach(socketID => {
				const socket = this.sockets[socketID];
				this.sendInfo(socket);
			});
	
			this.update(12, {kit: 0});
			this.updState(0);
		}
	}

	countDown(t, resolve, check = () => {return true}, reject = () => {}) {
		// t 剩余倒计时时间 单位: 秒
		// resolve 倒计时结束执行
		// check 每次调用 countDown 时执行，返回一个 Bool 值表示是否继续倒计时
		// reject 倒计时取消执行
		const pass = check(t);
		if ( !pass ) {
			reject();
			return ;
		}
		t = Math.floor(t);
		if ( t <= 0 ) {
			resolve();
			return ;
		}
		setTimeout(
			this.countDown.bind(this),
			1000,
			t - 1, resolve, check, reject,
		);
	}
}

function gameInput(socket, type, input) { // 接受玩家游戏输入
	const roomID = roomIDOfPlayer[socket.id];
	if ( !roomID ) { // 不在房间中
		return ;
	}

	const room = rooms[roomID];
	if ( !room ) { // 房间不存在
		return ;
	}

	const game = room.game;
	if ( !game ) { // 游戏不存在
		return ;
	}

	if ( !game.var.isStarted ) { // 游戏未开始（未初始化）
		return ;
	}

	game.handlePlayerInput(socket.id, type, input);
}

function shuffle(array) {
	let cur = array.length;
	while (cur != 0) {
		let rnd = Math.floor(Math.random() * cur);
		cur--;
		[array[cur], array[rnd]] = [array[rnd], array[cur]];
	}
}

function toggleReady(socket) {
	const roomID = roomIDOfPlayer[socket.id];
	if ( !roomID ) {
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.READY, 1);
		// code 1:不在房间中
		return ;
	}

	const room = rooms[roomID];
	if ( !room ) {
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.READY, 2);
		// code 2:房间不存在
		return ;
	}

	room.players[socket.id].isReady ^= 1; // 切换状态
	room.update(8, {id: socket.id, isReady: room.players[socket.id].isReady, quiet: false});
	socket.emit(Constants.MSG_TYPES.SERVER.ROOM.READY, 0, room.players[socket.id].isReady);
	// code 0:成功，返回切换后的状态

	room.checkReady(); // 阶段 2
}

function updSettings(socket, type, update) {
	// // console.log(`player ${socket.id} tries to update settings:`)
	const roomID = roomIDOfPlayer[socket.id];
	if ( !roomID ) {
		// // console.log('Not in a room.')
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.SETTINGS, 1);
		// code 1:不在房间中
		return ;
	}
	const room = rooms[roomID];
	if ( !room ) {
		// // console.log(`Room #${roomID} does not exist.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.SETTINGS, 2);
		// code 2:房间不存在
		return ;
	}
	const ownerOnly = [0, 1, 4]; // 需要 owner 权限的操作编号列表
	if ( room.ownerID != socket.id && ownerOnly.includes(type) ) {
		// // console.log(`No permission.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.SETTINGS, 3);
		// code 3:无修改设置权限
		return ;
	}
	if ( room.state != 0 ) {
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.SETTINGS, 4);
		// code 4:不是等待阶段，无法修改设置
		return ;
	}
	// // console.log(`Room #${roomID}:`);
	if ( type == 0 ) { // teamSize
		room.teamSize = update.teamSize;
		room.update(2, {teamSize: room.teamSize}, socket.id);
		room.resetTeams();
		// // console.log(`Settings: TeamSize = ${room.teamSize}.`);
	} else if ( type == 1 ) { // teamCount
		room.teamCount = update.teamCount;
		room.update(3, {teamCount: room.teamCount}, socket.id);
		room.resetTeams();
		// // console.log(`Settings: TeamCount = ${room.teamCount}.`);
	} else if ( type == 2 ) { // username
		room.players[socket.id].username = update.username;
		room.update(4, {id: socket.id, username: room.players[socket.id].username}, socket.id);
	} else if ( type == 3 ) { // team
		let team = update.team, prevTeam = update.prevTeam;
		if ( team != -1 ) {
			if ( room.teams[team].playerCount >= room.teamSize ) { // 不能加入满人队伍
				return ;
			}
		}
		room.players[socket.id].team = team;
		if ( team != -1 )
			room.teams[team].playerCount += 1;
		if ( prevTeam != -1)
			room.teams[prevTeam].playerCount -= 1;
		room.update(6, {id: socket.id, team: team, prevTeam: prevTeam}, socket.id);
	} else if ( type == 4 ) { // kit
		const kit = update.kit;
		if ( kit == 0 ) { // Classic
			room.settings.kit_info = {
				size: 5,
				primary: ['stinger', 'stinger', 'stinger', 'rose', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 1 ) { // Classic+
			room.settings.kit_info = {
				size: 5,
				primary: ['stinger', 'iris', 'dandelion', 'epic_rose', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 2 ) { // Classic+ NoIris
			room.settings.kit_info = {
				size: 5,
				primary: ['triple_stinger', 'stinger', 'dandelion', 'epic_rose', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 3 ) { // Advanced
			room.settings.kit_info = {
				size: 8,
				primary: ['stinger', 'iris', 'stinger', 'dandelion', 'cactus_toxic', 'epic_rose', 'salt', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 4 ) { // Assassin
			room.settings.kit_info = {
				size: 8,
				primary: ['stinger', 'iris', 'stinger', 'dandelion', 'dahlia', 'salt', 'dahlia', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 5 ) { // Archer
			room.settings.kit_info = {
				size: 5,
				primary: ['iris', 'missile', 'pollen', 'rose', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 6 ) { // Archer Simple
			room.settings.kit_info = {
				size: 1,
				primary: ['missile'],
				secondary: [],
			};
		} else if ( kit == 7 ) { // Overlord
			room.settings.kit_info = {
				size: 8,
				primary: ['triple_stinger', 'triple_stinger', 'triple_stinger', 'triple_cactus', 'epic_rose', 'triple_cactus', 'epic_rose', 'bubble'],
				secondary: [],
			};
		} else if ( kit == 8 ) { // Spammer!
			room.settings.kit_info = {
				size: 5,
				primary: ['pollen', 'legendary_peas', 'pollen', 'missile', 'epic_rose', 'pollen', 'bubble', 'bubble'],
				secondary: [],
			};
		}
		
		room.update(12, {kit: update.kit}, socket.id);
	}
}

function createRoom(socket, mode, username) {
	// console.log(`Player ${socket.id} tries to create a new Room with Mode '${mode}':`);
	if ( roomIDOfPlayer[socket.id] ) {
		// console.log(`Already in a room.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.CREATE, 1); // 用于发送创建房间的状态（若成功附带0和房间号，若失败附带错误码）
		// code 1:已经在一个房间中
		return ;
	}
	let newRoom = new Room(mode, socket.id);
	rooms[newRoom.id] = newRoom;
	// console.log(`Player ${socket.id} created Room #${newRoom.id}.`);
	socket.emit(Constants.MSG_TYPES.SERVER.ROOM.CREATE, 0, newRoom.id);
	// code 0:成功创建
	joinRoom(socket, mode, username, newRoom.id); // 创建后加入房间
}

function joinRoom(socket, mode, username, roomID) {
	// console.log(`Player ${socket.id} tries to join Room #${roomID} with Mode '${mode}':`);
	if ( roomIDOfPlayer[socket.id] ) {
		// console.log(`Already in a room.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 4);
		// code 4:已经在一个房间中
		return ;
	}
	if ( !rooms[roomID] ) {
		// console.log(`Room #${roomID} not found.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 1); // 用于发送加入房间的状态（若成功附带0和房间号，若失败附带错误码）
		// code 1:房间不存在
	} else {
		const room = rooms[roomID];
		if ( room.players[socket.id] ) {
			// console.log(`Player ${socket.id} is already in the Room`);
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 2);
			// code 2:重复加入
		} else if ( room.playerCount == room.teamCount * room.teamSize ) {
			// console.log(`Room #${roomID} is full`);
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 3);
			// code 3:房间满人
		} else if ( room.state != 0 ) {
			// console.log(`Room #${roomID} is already starting a game.`); 
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 5);
			// code 5:房间已经开始游戏
		} else {
			// console.log(`Player ${socket.id} successfully joined the Room #${roomID}`);
			socket.emit(Constants.MSG_TYPES.SERVER.ROOM.JOIN, 0, roomID);
			room.addPlayer(socket, username);
			// code 0:成功
		}
	}
}

function leaveRoom(socket) {
	const roomID = roomIDOfPlayer[socket.id];
	// console.log(`Player ${socket.id} tries to leave Room #${roomID}:`);
	if ( !roomID ) {
		// console.log(`Player ${socket.id} is not in a room.`);
		socket.emit(Constants.MSG_TYPES.SERVER.ROOM.LEAVE, 1);
		// code 1: 不在房间中
		return ;
	}
	const room = rooms[roomID];
	// console.log(`Player ${socket.id} successfully left Room #${roomID}.`);
	room.removePlayer(socket.id);
	socket.emit(Constants.MSG_TYPES.SERVER.ROOM.LEAVE, 0);
	// code 0: 成功
}

function disconnect(socket) {
	// console.log(`Player ${socket.id} disconnected.`);
	leaveRoom(socket);
}

const charList = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const fixedIDLen = 6;

function getNewRoomID() {
	const arr = new Uint32Array(1);
	crypto.getRandomValues(arr);
	let val = arr[0];
	let id = '';
	while (val > 0) {
		id += charList[val % charList.length];
		val = (val - val % charList.length) / charList.length;
	}
	while (id.length < fixedIDLen) {
		id += '0';
	}
	return id;
}

export {
	createRoom,
	joinRoom,
	leaveRoom,
	updSettings,
	disconnect,
	toggleReady,
	gameInput,
};