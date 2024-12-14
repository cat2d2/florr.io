import * as nw from './networking.js';

import Constants from '../shared/constants.js';

const setUsername = (newUsername) => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.SETTINGS, 2, {username: newUsername});
};

const createRoom = (mode, username) => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.CREATE, mode, username);
};

const joinRoom = (mode, username, roomID = '') => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.JOIN, mode, username, roomID);
};

const leaveRoom = () => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.LEAVE);
};

const updSettings = (type, update) => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.SETTINGS, type, update);
};

const toggleReady = () => {
	nw.socket.emit(Constants.MSG_TYPES.CLIENT.ROOM.READY);
};

export {
	setUsername,
	createRoom,
	joinRoom,
	leaveRoom,
	updSettings,
	toggleReady,
};