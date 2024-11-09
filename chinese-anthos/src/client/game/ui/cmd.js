let cmdLog = [];
let cmdMaxLineCnt = 30;
let cmdColor = 'cyan';

let debugOptions =
	[
		false, // show hitbox
		false, // show hp
	];

export function setCmdLayer() {
	document.getElementById("cmd-input").style['z-index'] = UILayer[1];
}

export function setCmdColor(color) {
	cmdColor = color;
}

export function clearCmdLog() {
	cmdLog = [];
}

export function addCmdLog(log) {
	cmdLog.push(log);
}

export function toggleDebugOption(optionID, value) {
	debugOptions[optionID] = value;
}