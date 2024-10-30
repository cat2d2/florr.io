"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.properties = exports.gamemodes = void 0;
var _arena = _interopRequireDefault(require("./arena/arena.js"));
var _properties = _interopRequireDefault(require("./arena/properties.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var gamemodes = {
  'arena': _arena["default"]
};
exports.gamemodes = gamemodes;
var properties = {
  'arena': _properties["default"]
};
exports.properties = properties;