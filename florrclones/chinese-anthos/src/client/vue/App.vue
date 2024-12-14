<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import Block from './Block.vue';
import Title from './Title.vue';
import Button from './Button.vue';
import Text from './Text.vue';
import * as room from '../room.js';
import * as nw from '../networking.js';
import Constants from '../../shared/constants.js';
import * as util from '../utility.js';
import { startRenderGame, stopRenderGame, initGameSettings } from '../game/main.js';
import { resetState } from '../state.js';
import { startCapturingInput, stopCapturingInput } from '../input.js';

const attr = ref({
	title: {
		x: 50,
		y: -20,
	},
	button_arena: {
		x: 50,
		y: -20,
	},
	button_back:{
		x: 5,
		y: 105,
	},
	username_input: {
		x: 50,
		y: -20,
	},
	room: {
		x: 30,
		y: -30,
	},
	log: {
		x: -20,
		y: 5,
	},
	player_list: {
		x: 80,
		y: -20,
	},
	game_settings: {
		x: 67,
		y: -30,
	}
});

onMounted(() => { // 这个做法可能有潜在出错风险
	setTimeout(() => {
		attr.value.title.y = 30;
		attr.value.button_arena.y = 40;
		attr.value.username_input.y = 45;
	}, 100);
});

// 模式选择

const mode = ref('');
const selectedMode = ref(false);

function onBack() {
	selectedMode.value = false;
	attr.value.title.y = 30;
	attr.value.button_arena.y = 40;
	attr.value.username_input.y = 45;
	attr.value.button_back.y = 105;
	attr.value.room.y = -30;
	attr.value.player_list.y = -20;
	attr.value.game_settings.y = -30;
	attr.value.log.x = -20;
}

function onSelectArena() {
	selectedMode.value = true;
	attr.value.title.y = -20;
	attr.value.button_arena.y = -20;
	attr.value.button_back.y = 95;
	attr.value.username_input.y = 5;
	attr.value.room.y = 5;
	attr.value.player_list.y = 5;
	attr.value.game_settings.y = 4;
	attr.value.log.x = 5;
	mode.value = 'arena';
}

// 房间

const roomIDInput = ref('');
const roomID = ref('');
const inRoom = ref(false);
const selfID = ref('');
const ownerID = ref('');
const state = ref(0);
const countdownTime = ref(0);

function onRoomIDInput(e) {
	let str = e.target.value;
	roomIDInput.value = str;
}

function copyRoomID() {
	util.copyToClipboard(roomID.value);
	logs.value.unshift({
		msg: 'Room ID has been copied to the clipboard.',
		color: '#dedede',
	});
}

// 加入房间

function joinRoom() {
	room.joinRoom(mode.value, username.value || 'Random Flower', roomIDInput.value);
}

function onJoinRoom(state, roomID_ = '') {
	const msgs = [
		`Successfully joined room #${roomID_}.`,
		`Room does not exist.`,
		`Already in room.`,
		`Room is full.`,
		`Leave the current room before joining a new one.`,
		`That room is already starting a game.`,
	], colors = [
		'#cbfcb1',
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
	];
	if ( state == 0 ) {
		roomID.value = roomID_;
		roomIDInput.value = roomID_;
		inRoom.value = true;
	}
	logs.value.unshift({
		msg: msgs[state],
		color: colors[state],
	});
}

// 创建房间

function createRoom() {
	room.createRoom(mode.value, username.value || 'Random Flower');
}

function onCreateRoom(state, roomID_ = '') {
	const msgs = [
		`Successfully created room #${roomID_}.`,
		`Can't create a new room when already in one.`,
	], colors = [
		'#cbfcb1',
		'#fcab9d',
	];
	logs.value.unshift({
		msg: msgs[state],
		color: colors[state],
	});
}

// 离开房间

function leaveRoom() {
	room.leaveRoom();
}

function onLeaveRoom(state) {
	const msgs = [
		`Left room.`,
		`Not in a room.`,
	], colors = [
		'#9dbbfc',
		'#fcab9d',
	];
	if ( state == 0 ) {
		roomID.value = '';
		roomIDInput.value = '';
		inRoom.value = false;
		players.value = {};
		teams.value = [];
	}
	logs.value.unshift({
		msg: msgs[state],
		color: colors[state],
	});
}

// 更新本地信息

function onUpdate(type, update) {
	if ( type == 0 ) {
		players.value[update.player.socketID] = update.player;
		logs.value.unshift({
			msg: `Player ${update.player.username} joined. (${Object.keys(players.value).length + '/' + teamSize.value * teamCount.value})`,
			color: "#9deefc",
		});
	} else if ( type == 1 ) {
		if ( !players.value[update.player.socketID] )
			return ;
		delete players.value[update.player.socketID];
		logs.value.unshift({
			msg: `Player ${update.player.username} left. (${Object.keys(players.value).length + '/' + teamSize.value * teamCount.value})`,
			color: "#9dbbfc",
		});
	} else if ( type == 2 ) { // 不会执行
		teamSize.value = update.teamSize;
		logs.value.unshift({
			msg: `Settings: TeamSize = ${teamSize.value}`,
			color: "#dedede",
		});
	} else if ( type == 3 ) {
		teamCount.value = update.teamCount;
		logs.value.unshift({
			msg: `Settings: TeamCount = ${teamCount.value}`,
			color: "#dedede",
		});
	} else if ( type == 4 ) {
		players.value[update.id].username = update.username;
	} else if ( type == 5 ) {
		teams.value = update.teams;
		Object.values(players.value).forEach(player => {
			player.team = -1;
		});
		if ( team.value != -1 ) {
			unwatch['team'] = true;
			team.value = -1;
		}
		logs.value.unshift({
			msg: `Reset teams.`,
			color: "#dedede",
		});
	} else if ( type == 6 ) {
		players.value[update.id].team = update.team;
		if ( update.team != -1 )
			teams.value[update.team].playerCount += 1;
		if ( update.prevTeam != -1)
			teams.value[update.prevTeam].playerCount -= 1;
		logs.value.unshift({
			msg: `Player ${players.value[update.id].username} joined team `
				+ `${update.team == -1 ? 'Random' : teams.value[update.team].color}`
				+ `${update.team == -1 ? '' : ' (' + teams.value[update.team].playerCount + '/' + teamSize.value + ')'}`,
			color: "#dedede",
		});
	} else if ( type == 7 ) {
		ownerID.value = update.id;
		logs.value.unshift({
			msg: `Player ${players.value[update.id].username} is the new Owner.`,
			color: "#dedede",
		});
	} else if ( type == 8 ) {
		players.value[update.id].isReady = update.isReady;
		const readyPlayerCount = Object.values(players.value).filter(player => player.isReady).length;
		if ( !update.quiet ) {
			if ( update.id != selfID.value ) {
				logs.value.unshift({
					msg: `Player ${players.value[update.id].username} ${update.isReady ? 'is ready.' : 'canceled ready.'} (${readyPlayerCount}/${teamCount.value * teamSize.value})`,
					color: (update.isReady ? '#cbfcb1' : '#fcab9d'),
				});
			}
		}
	} else if ( type == 9 ) {
		countdownTime.value = update.countdownTime;
	} else if ( type == 10 ) {
		state.value = update.state;
	} else if ( type == 11 ) {
		initGameSettings(update.settings);
	} else if ( type == 12 ) {
		unwatch['kit'] = true;
		kit.value = update.kit;
	}
}

function onRecvInfo(info) { // 加入房间时获取房间信息
	players.value = info.players;
	ownerID.value = info.ownerID;
	if ( teamCount.value != info.teamCount ) {
		unwatch['teamCount'] = true;
		teamCount.value = info.teamCount;
	}
	if ( teamSize.value != info.teamSize ) {
		unwatch['teamSize'] = true;
		teamSize.value = info.teamSize;
	}
	unwatch['kit'] = true;
	kit.value = info.kit;
	teams.value = info.teams;
	// settings.value = info.settings;
}

watch(countdownTime, (t) => {
	if ( t == -1 ) {
		logs.value.unshift({
			msg: `Game start canceled since someone is not ready.`,
			color: `#dedede`,
		});
		return ;
	}
	logs.value.unshift({
		msg: `Game will start in ${t}...`,
		color: `#dedede`,
	});
});

// 切换准备状态

function toggleReady() {
	room.toggleReady();
}

function onToggleReady(state, isReady) {
	const readyPlayerCount = Object.values(players.value).filter(player => player.isReady).length;
	const msgs = [
		(isReady ? 'Ready.' : 'Canceled ready.') + ` (${readyPlayerCount}/${teamCount.value * teamSize.value})`,
		`Not in a room.`,
		`Room does not exist.`,
	], colors = [
		(isReady ? '#cbfcb1' : '#fcab9d'),
		`#fcab9d`,
		`#fcab9d`,
	];
	logs.value.unshift({
		msg: msgs[state],
		color: colors[state],
	});
}

// 一些房间信息

const players = ref({}); // {username, socketID}
const teams = ref([]); // {color, playerCount}

// 游戏设置

const unwatch = {}; // 取消监听

const teamSize = ref(1);
const teamCount = ref(2);
const team = ref(-1); // 所在队伍
const kit = ref(0);
// const settings = ref({});
const username = ref(''); // 用户名

watch(teamSize, (teamSize_) => {
	if ( unwatch['teamSize'] ) {
		unwatch['teamSize'] = false;
		return ;
	}
	logs.value.unshift({
		msg: `Settings: TeamSize = ${teamSize.value}`,
		color: "#dedede",
	});
	room.updSettings(0, {teamSize: teamSize_});
});

watch(teamCount, (teamCount_) => {
	if ( unwatch['teamCount'] ) {
		unwatch['TeamCount'] = false;
		return ;
	}
	logs.value.unshift({
		msg: `Settings: TeamCount = ${teamCount.value}`,
		color: "#dedede",
	});
	room.updSettings(1, {teamCount: teamCount_});
});

watch(username, (username_) => {
	if ( inRoom.value ) {
		players.value[selfID.value].username = username_;
		room.setUsername(username_ || "Random Flower");
	}
});

watch(team, (team_, prevTeam_) => {
	if ( unwatch['team'] ) {
		unwatch['team'] = false;
		return ;
	}
	players.value[selfID.value].team = team_;
	if ( team_ != -1 )
		teams.value[team_].playerCount += 1;
	if ( prevTeam_ != -1)
		teams.value[prevTeam_].playerCount -= 1;
	logs.value.unshift({
		msg: `Player ${players.value[selfID.value].username} joined team `
			+ `${team_ == -1 ? 'Random' : teams.value[team_].color}`
			+ `${team_ == -1 ? '' : ' (' + teams.value[team_].playerCount + '/' + teamSize.value + ')'}`,
		color: "#dedede",
	});
	room.updSettings(3, {team: team_, prevTeam: prevTeam_});
});

watch(kit, (kit_) => {
	if ( unwatch['kit'] ) {
		unwatch['kit'] = false;
		return ;
	}
	room.updSettings(4, {kit: kit_});
});

function onUpdSettings(state) {
	const msgs = [
		``,
		`Not in a room.`,
		`Room does not exist.`,
		`No permission.`,
		`You can only do that when the room is in 'wait' state.`,
	], colors = [
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
		'#fcab9d',
	];
	logs.value.unshift({
		msg: msgs[state],
		color: colors[state],
	});
}

// 游戏开始 / 结束

function onGameStart() {
	logs.value.unshift({
		msg: `Game starts now.`,
		color: "#ffa8f5",
	});
	nw.connect();
	resetState();
	startCapturingInput();
	startRenderGame();
}

function onGameOver(winners) {
	state.value = 0; // 设置房间状态
	let str = '';
	winners.forEach((winner, idx) => {
		str += winner;
		if ( idx < winners.length - 1 )
			str += ',';
	});
	logs.value.unshift({
		msg: `The game has ended. The winner is ${str}!`,
		color: '#ffbf7a',
	});
	stopCapturingInput();
	stopRenderGame();
}

// 日志

const logs = ref([{msg: "Log will be printed here.", color: "#dedede"}]);

// 网络

nw.connectedPromise.then(() => {
	selfID.value = nw.socket.id;
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.CREATE, onCreateRoom);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.JOIN, onJoinRoom);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.LEAVE, onLeaveRoom);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.UPDATE, onUpdate);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.INFO, onRecvInfo);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.SETTINGS, onUpdSettings);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.READY, onToggleReady);
	nw.socket.on(Constants.MSG_TYPES.SERVER.ROOM.START, onGameStart);
	nw.socket.on(Constants.MSG_TYPES.SERVER.GAME.OVER, onGameOver);
	nw.socket.on('disconnect', onDisconnect);
});

function onDisconnect() {
	state.value = 0;
	logs.value.unshift({
		msg: `Disconnected from server.`,
		color: '#fcab9d',
	});
	stopCapturingInput();
	stopRenderGame();
}

</script>
<template>
	<Block :props="attr.title">
		<Title size="10">Florr.io PvP</Title>
		<Title size="3">Made by kit2d2</Title>
	</Block>
	<a href="https://discord.gg/m4DefhCemY" target="_blank" class="discord-icon"><img class="discord-icon img"></a>
	<Block :props="attr.button_back">
		<Button @click="onBack" :disabled="!selectedMode">Back</Button>
	</Block>
	<Block :props="attr.button_arena">
		<Button @click="onSelectArena" :disabled="selectedMode">Arena</Button>
	</Block>
	<Block :props="attr.username_input">
		<Text size="2">This fighting flower is called...</Text>
		<input class="input" v-model="username" placeholder="Name Yourself!" maxlength="20" :disabled="state == 2"/>
	</Block>
	<Block :props="attr.log" style="width: 15%">
		<template v-for="log in logs">
			<Text size="1.5" :color="log.color" class="log">{{ log.msg }}</Text>
		</template>
	</Block>
	<Block :props="attr.room">
		<Text size="2">{{ `Room#${roomID}` }}</Text>
		<input class="input" @input="onRoomIDInput" placeholder="RoomID" maxlength="6" :disabled="inRoom" :value="roomIDInput"/><br/>
		<Button @click="joinRoom" :disabled="(inRoom) || (!selectedMode)">Join</Button><br>
		<Button @click="createRoom" :disabled="(inRoom) || (!selectedMode)">Create</Button><br>
		<Button @click="leaveRoom" :disabled="(!inRoom) || (state == 2)">Leave</Button><br>
		<Button @click="toggleReady" :disabled="(!inRoom) || (state == 2)">Ready</Button><br>
		<Button @click="copyRoomID" :disabled="state == 2">Copy ID</Button><br>
	</Block>
	<Block :props="attr.player_list">
		<Text size="2" class="notransform" :color="(Object.keys(players).length == teamSize * teamCount) ? '#fffd9c' : '#FFFFFF'">
			Players
			<span>{{ Object.keys(players).length }}</span>
			/
			<span>{{ teamSize * teamCount }}</span>
		</Text>
		<template v-for="player in players">
			<Text size="2" class="notransform">
				<span :style="{'color': (player.team == -1) ? '#dedede' : teams[player.team].color}">{{ player.username }}</span>
				<span style="color: #cbfcb1">{{ player.isReady ? ' ✓' : '' }}</span>
			</Text>
		</template>
	</Block>
	<Block :props="attr.game_settings">
		<Text size="2" class="notransform">Settings</Text>
		<Text size="2" class="notransform">Team Size</Text>
		<select v-model="teamSize" :disabled="(ownerID != selfID) || (!inRoom) || (state != 0)">
			<option value="1">1 Player</option>
			<option value="2">2 Players</option>
			<option value="3">3 Players</option>
			<option value="4">4 Players</option>
			<option value="5">5 Players</option>
			<option value="6">6 Players</option>
		</select>
		<Text size="2" class="notransform">Team Count</Text>
		<select v-model="teamCount" :disabled="(ownerID != selfID) || (!inRoom) || (state != 0)">
			<option value="2">2 Teams</option>
			<option value="3">3 Teams</option>
			<option value="4">4 Teams</option>
			<option value="5">5 Teams</option>
			<option value="6">6 Teams</option>
			<option value="7">7 Teams</option>
			<option value="8">8 Teams</option>
		</select>
		<Text size="2" class="notransform">Team</Text>
		<select v-model="team" :disabled="(!inRoom) || (state != 0)">
			<option value="-1">Random</option>
			<template v-for="(team, i) in teams">
				<option :value="i" :disabled="team.playerCount >= teamSize" :style="{color: team.color}">{{ `${team.color} ${team.playerCount}/${teamSize}` }}</option>
			</template>
		</select><br/>
		<Text size="2" class="notransform">Kit</Text>
		<select v-model="kit" :disabled="(ownerID != selfID) || (!inRoom) || (state != 0)">
			<option value="0">Classic</option>
			<option value="1">Classic+</option>
			<option value="2">Classic+ NoIris</option>
			<option value="3">Advanced</option>
			<option value="4">Assassin</option>
			<option value="5">Archer</option>
			<option value="6">Archer Simple</option>
			<option value="7">Overlord</option>
			<option value="8">Pollinator</option>
		</select>
	</Block>
	<canvas id="canvas" class="canvas" :class="{hidden: state != 2}"></canvas>
</template>

<style>
#app {
	position:absolute;
	top:0%;
	left:0%;
	width:100%;
	height:100%;
	background:#1EA761;
}

.hidden {
	display: none !important;
}

.canvas {
	display: block;
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0%;
	top: 0%;
	z-index: 1;
}

.notransform {
	transform:none;
}

.log {
	transform: none;
	position:relative;
	height: auto;
	word-wrap: break-word;
	text-align:start;
}

.input {
	transform:translate(-51%, -10%);
}
.discord-icon {
	position: absolute;
	top: 20px;
	right: 20px;
	width: 10px;
	height: 10px;
	z-index: 10;
}

.discord-icon img {
	width: 100%;
	height: 100%;
	cursor: pointer;
	transition: transform 0.2s ease-in-out;
}

.discord-icon img:hover {
	transform: scale(1.1);
}
</style>