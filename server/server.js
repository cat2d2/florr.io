"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
var _express = _interopRequireDefault(require("express"));
var _webpack = _interopRequireDefault(require("webpack"));
var _webpackDevMiddleware = _interopRequireDefault(require("webpack-dev-middleware"));
var _socket = require("socket.io");
var _constants = _interopRequireDefault(require("../shared/constants.js"));
var _webpackDev = _interopRequireDefault(require("../../webpack.dev.js"));
var _webpackProd = _interopRequireDefault(require("../../webpack.prod.js"));
var room = _interopRequireWildcard(require("./room.js"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use(_express["default"]["static"]('public'));
if (process.env.NODE_ENV == "development") {
  var compiler = (0, _webpack["default"])(_webpackDev["default"]);
  app.use((0, _webpackDevMiddleware["default"])(compiler));
} else if (process.env.NODE_ENV == "production") {
  var _compiler = (0, _webpack["default"])(_webpackProd["default"]);
  app.use((0, _webpackDevMiddleware["default"])(_compiler));
} else {
  app.use(_express["default"]["static"]('dist'));
}
var port = process.env.PORT || 25564;
var server = app.listen(port);
console.log("Server listening on port ".concat(port));
var io = new _socket.Server(server);
var totalPlayerCount = 0;
io.on('connection', function (socket) {
  // console.log(`Player ${socket.id} connected.`);
  totalPlayerCount++;
  console.log("Online Players: ".concat(totalPlayerCount));
  socket.on(_constants["default"].MSG_TYPES.CLIENT.ROOM.CREATE, createRoom);
  socket.on(_constants["default"].MSG_TYPES.CLIENT.ROOM.JOIN, joinRoom);
  socket.on(_constants["default"].MSG_TYPES.CLIENT.ROOM.SETTINGS, updSettings);
  socket.on(_constants["default"].MSG_TYPES.CLIENT.ROOM.READY, toggleReady);
  socket.on(_constants["default"].MSG_TYPES.CLIENT.ROOM.LEAVE, leaveRoom);
  socket.on(_constants["default"].MSG_TYPES.CLIENT.GAME.INPUT, gameInput);
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
  totalPlayerCount--;
  console.log("Online Players: ".concat(totalPlayerCount));
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