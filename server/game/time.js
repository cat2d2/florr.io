"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
exports.update = update;
/*
时间相关的方法

使用变量域: $ = this.var.time
*/

function init() {
  // 初始化
  var $ = this["var"].time = {};
  $.lastUpdTime = Date.now();
}
function update() {
  var _this$var, _this$var$time;
  var $ = (_this$var$time = (_this$var = this["var"]).time) !== null && _this$var$time !== void 0 ? _this$var$time : _this$var.time = {};
  var now = Date.now();
  $.dt = now - $.lastUpdTime; // 两次更新经过的时间
  $.lastUpdTime = now;
}