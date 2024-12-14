import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import { Server } from 'socket.io';

import Constants from '../shared/constants.js';
import webpackConfigDev from "../../webpack.dev.js";
import webpackConfigProd from '../../webpack.prod.js';

import * as room from './room.js';
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV == "development") {
	const compiler = webpack(webpackConfigDev);
	app.use(webpackDevMiddleware(compiler));
} else if (process.env.NODE_ENV == "production") {
	const compiler = webpack(webpackConfigProd);
	app.use(webpackDevMiddleware(compiler));
} else {
	app.use(express.static('dist'));
}

const port = process.env.PORT || 25564;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = new Server(server);

let totalPlayerCount = 0;

io.on('connection', socket => {
	// console.log(`Player ${socket.id} connected.`);
	totalPlayerCount ++;
	console.log(`Online Players: ${totalPlayerCount}`);
	socket.on(Constants.MSG_TYPES.CLIENT.ROOM.CREATE, createRoom);
	socket.on(Constants.MSG_TYPES.CLIENT.ROOM.JOIN, joinRoom);
	socket.on(Constants.MSG_TYPES.CLIENT.ROOM.SETTINGS, updSettings);
	socket.on(Constants.MSG_TYPES.CLIENT.ROOM.READY, toggleReady);
	socket.on(Constants.MSG_TYPES.CLIENT.ROOM.LEAVE, leaveRoom);
	socket.on(Constants.MSG_TYPES.CLIENT.GAME.INPUT, gameInput);
	socket.on('disconnect', onDisconnect);
});

function createRoom(mode, username) {
	room.createRoom(this, mode, username);
}

function joinRoom(mode, username, roomId) {
	room.joinRoom(this, mode, username, roomId);
}

function leaveRoom() {
	room.leaveRoom(this);
}

function updSettings(type, update) {
	room.updSettings(this, type, update);
}

function toggleReady() {
	room.toggleReady(this);
}

function gameInput(type, input) {
	room.gameInput(this, type, input);
}

function onDisconnect() {
	totalPlayerCount --;
	console.log(`Online Players: ${totalPlayerCount}`);
	room.disconnect(this);
}
// function onDisconnect() {
// 	room.quitRoom(this, false);
// }
// const game = new Game();

// function joinGame(username) {
// 	if ( username.length <= 20 ) {
// 		console.log(`Player Joined Game with Username: ${username}`);
// 		game.addPlayer(this, username);
// 	}
// }

// function onDisconnect() {
// 	game.onPlayerDisconnect(this);
// }

// function handleMovement(movement) {
// 	game.handleMovement(this, movement);
// }

// function handleMouseDown(mouseDownEvent) {
// 	game.handleMouseDown(this, mouseDownEvent);
// }

// function handleMouseUp(mouseUpEvent) {
// 	game.handleMouseUp(this, mouseUpEvent);
// }

// function handlePetalSwitch(petalA, petalB, implement) {
// 	game.handlePetalSwitch(this, petalA, petalB, implement);
// }

// function handleCmdInv(sel, petal) {
// 	game.cmdInv(sel, petal);
// }

// merge test