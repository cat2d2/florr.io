"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updSettings = exports.toggleReady = exports.setUsername = exports.leaveRoom = exports.joinRoom = exports.createRoom = void 0;
var nw = _interopRequireWildcard(require("./networking.js"));
var _constants = _interopRequireDefault(require("../shared/constants.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var setUsername = function setUsername(newUsername) {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.SETTINGS, 2, {
    username: newUsername
  });
};
exports.setUsername = setUsername;
var createRoom = function createRoom(mode, username) {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.CREATE, mode, username);
};
exports.createRoom = createRoom;
var joinRoom = function joinRoom(mode, username) {
  var roomID = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.JOIN, mode, username, roomID);
};
exports.joinRoom = joinRoom;
var leaveRoom = function leaveRoom() {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.LEAVE);
};
exports.leaveRoom = leaveRoom;
var updSettings = function updSettings(type, update) {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.SETTINGS, type, update);
};
exports.updSettings = updSettings;
var toggleReady = function toggleReady() {
  nw.socket.emit(_constants["default"].MSG_TYPES.CLIENT.ROOM.READY);
};
exports.toggleReady = toggleReady;