import animation from '../animation.js';

export function renderGame() {
	for ( let i = 1; i <= layerCount; i ++ ) {
		ctx = getCtx(i);
		ctx.clearRect(0, 0, W, H);
	}
	
	// const { info, me, others, mobs, drops, leaderboard, playerCount, rankOnLeaderboard, lightningPath } = getCurrentState();
	const state = getCurrentState();
	
	updateSlotsData(W, hpx, primarySlotHitboxLength, primarySlotDisplayLength + 4 * primarySlotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE, primarySlotCenterY, primarySlotCount,
		secondarySlotHitboxLength, secondarySlotDisplayLength + 4 * secondarySlotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE, secondarySlotCenterY, secondarySlotCount);

	if ( state.me ) {
		background.renderBackground(state.me.x, state.me.y);
		player.renderPlayer(state.me, state.me);
		state.others.forEach(player.renderPlayer.bind(null, state.me));
		state.mobs.forEach(mob.renderMob.bind(null, state.me));
		drops.renderDrops(state.drops, state.me);
		effect.renderLightningPath(state.lightningPath, me);
		dfoe.renderDiedEntities(me);
		leaderboard.renderLeaderboard(leaderboard, playerCount, me, rankOnLeaderboard);
		ui.renderUI(me);
		renderInfo(info);
		renderWarning(me);
	}
	
	if ( gameRadiusOnEnter < hpx * 1800 ) {
		ctx = getCtx(menuLayer[0]);
		fillBackground("#1EA761");
		renderText(1, "real_florrio", W / 2, H / 2 - hpx * 220, hpx * 85, 'center');
		renderText(1, "How to play", W / 2, H / 2 + hpx * 100, hpx * 30, 'center');
		renderText(1, "Use Mouse or [W] [S] [A] [D] to move", W / 2, H / 2 + hpx * 140, hpx * 15, 'center');
		renderText(1, "Left click or [Space] to attack", W / 2, H / 2 + hpx * 165, hpx * 15, 'center');
		renderText(1, "Right click or [LShift] to defend", W / 2, H / 2 + hpx * 190, hpx * 15, 'center');
		renderText(1, "Press [K] to toggle keyboard movement", W / 2, H / 2 + hpx * 215, hpx * 15, 'center');
		gameRadiusOnEnter += deltaGameRadiusOnEnter;
		deltaGameRadiusOnEnter *= 1.05;

		ctx = getCtx(menuLayer[0]);
		ctx.globalCompositeOperation = 'destination-out';
		ctx.beginPath();
		ctx.arc(W / 2, H / 2, gameRadiusOnEnter, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fillStyle = 'rgb(0, 0, 0)';
		ctx.fill();
		ctx.globalCompositeOperation = 'source-over';
		ctx.strokeStyle = 'rgb(0, 0, 0)';
		ctx.lineWidth = hpx * 5;
		ctx.stroke();
	}
	animation.play(renderGame);
}