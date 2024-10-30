"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socket = exports.connectedPromise = exports.connect = void 0;
var _socket = _interopRequireDefault(require("socket.io-client"));
var _state = require("./state.js");
var _constants = _interopRequireDefault(require("../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var socketProtocol = window.location.protocol.includes('https') ? 'wss' : 'ws';
var socket = (0, _socket["default"])("".concat(socketProtocol, "://").concat(window.location.host), {
  reconnection: false
});
exports.socket = socket;
var connectedPromise = new Promise(function (resolve) {
  socket.on('connect', function () {
    console.log('Connected to server!');
    resolve();
  });
});
exports.connectedPromise = connectedPromise;
var connect = function connect() {
  connectedPromise.then(function () {
    socket.on(_constants["default"].MSG_TYPES.SERVER.GAME.UPDATE, _state.processGameUpdate);
  });
};
exports.connect = connect;