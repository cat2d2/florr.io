import * as util from '../utility.js';
import { getCurrentState } from '../state.js';
import { renderBackground } from './render/background.js';
import { renderPlayer } from './render/player.js';
import { renderPetal } from './render/petal.js';
import * as canvas from '../canvas.js';
import * as entityAnim from './render/entityAnimation.js';

let settings;
let animationFrameRequestID;
let vision = 1; // 视距

function initGameSettings(settings_) { // 游戏开始时获取的游戏设定信息
	settings = settings_;
}

function startRenderGame() { // 开始游戏
	animationFrameRequestID = requestAnimationFrame(render);
}

function render() {
	const state = getCurrentState();
	if ( state.self ) {
		// 创建不同图层
		const backgroundCtx = canvas.getTmpCtx();
		const playerCtx = canvas.getTmpCtx();
		const petalCtx = canvas.getTmpCtx();

		vision = state.self.vision;
    
		renderBackground(backgroundCtx, state.self.x, state.self.y, state.mspt);
		renderPlayer(playerCtx, state.self, state.self);
		
		// 自己受伤了就抖动屏幕
		if (state.self.isHurt) util.shakeScreen(200, 2);
		
		state.entities.forEach(e => {
			if ( e.type == 'player' ) {
				renderPlayer(playerCtx, state.self, e);
			} else if ( e.type == 'petal' ) {
				renderPetal(petalCtx, state.self, e);
			}
		});
		
		entityAnim.setNewEntitiesList();

		// 按顺序渲染不同图层
		canvas.draw(backgroundCtx, canvas.ctxMain);
		canvas.draw(petalCtx, canvas.ctxMain);
		canvas.draw(playerCtx, canvas.ctxMain);
	}
	animationFrameRequestID = requestAnimationFrame(render);
}

function stopRenderGame() {
	cancelAnimationFrame(animationFrameRequestID);
}

export {
	startRenderGame,
	stopRenderGame,
	initGameSettings,
	settings,
	vision,
};