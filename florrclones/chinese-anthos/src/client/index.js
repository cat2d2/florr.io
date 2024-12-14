import * as nw from './networking.js';

import { downloadAssets } from './assets.js';

// import { initState } from './state.js';

import * as room from './room.js';

import * as canvas from './canvas.js';

import './css/main.css';

import './vue.js';

window.onload = () => {
	document.body.style.cursor = "default";
	preventDefaultActions();
	canvas.init();
	Promise.all([
		downloadAssets(),
	]).then(() => {
		// .
	});
}

function preventDefaultActions() {
	document.onselectstart = (event) => {
		event.preventDefault();
	}
	window.addEventListener('contextmenu', (event) => {
		event.preventDefault();
	});
}
