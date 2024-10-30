"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCmdLog = addCmdLog;
exports.clearCmdLog = clearCmdLog;
exports.setCmdColor = setCmdColor;
exports.setCmdLayer = setCmdLayer;
exports.toggleDebugOption = toggleDebugOption;
var cmdLog = [];
var cmdMaxLineCnt = 30;
var cmdColor = 'cyan';
var debugOptions = [false,
// show hitbox
false // show hp
];
function setCmdLayer() {
  document.getElementById("cmd-input").style['z-index'] = UILayer[0];
}
function setCmdColor(color) {
  cmdColor = color;
}
function clearCmdLog() {
  cmdLog = [];
}
function addCmdLog(log) {
  cmdLog.push(log);
}
function toggleDebugOption(optionID, value) {
  debugOptions[optionID] = value;
}