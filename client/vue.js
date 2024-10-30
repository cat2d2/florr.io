"use strict";

var _vue = require("vue");
var _App = _interopRequireDefault(require("./vue/App.vue"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _vue.createApp)(_App["default"]);
app.mount("#app");