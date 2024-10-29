export function renderLeaderboardRank(rank, leaderboardRankBaseLength, leaderboardRankOutlineWidth, leaderboardRankBaseWidth, rankTopScore,
	leaderboardHeadHeight, leaderboardHeightPerPlayer, rankOnLeaderboard, leaderboardRank, baseX, baseY) { // render the current rank on leaderboard

	ctx = getCtx(UILayer[0]);

	baseX += 0;
	baseY += leaderboardHeadHeight + rank * leaderboardHeightPerPlayer;
	
	ctx.beginPath();
	ctx.lineWidth = leaderboardRankBaseWidth;
	ctx.moveTo(baseX - leaderboardRankBaseLength / 2, baseY + 0);
	ctx.lineTo(baseX + leaderboardRankBaseLength / 2, baseY + 0);
	if ( rank == rankOnLeaderboard ) {
		ctx.strokeStyle = 'rgb(200, 200, 200)';
	} else {
		ctx.strokeStyle = 'rgb(65, 65, 65)';
	}
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.closePath();

	const leaderboardRankLength = leaderboardRankBaseLength * leaderboardRank.score / rankTopScore;

	ctx.beginPath();
	ctx.lineWidth = leaderboardRankBaseWidth - leaderboardRankOutlineWidth * 2;
	ctx.moveTo(baseX - leaderboardRankBaseLength / 2, baseY + hpx * 0);
	ctx.lineTo(baseX - leaderboardRankBaseLength / 2 + leaderboardRankLength, baseY + hpx * 0);
	ctx.strokeStyle = 'rgb(255, 252, 97)';
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.closePath();

	var score = leaderboardRank.score;
	score = getNumberDisplay(score);

	const leaderboardDisplay = `${leaderboardRank.username} - ${score}`;

	renderText(1, leaderboardDisplay, baseX + hpx * 0, baseY + hpx * 5, hpx * 15, 'center');
}

export function renderLeaderboard(leaderboard, playerCount, me, rankOnLeaderboard) {
	ctx = getCtx(UILayer[0]);
	const leaderboardOutlineWidth = hpx * 5;

	const leaderboardBorderGap = hpx * 20;

	const leaderboardRoundCornerRadius = hpx * 5;

	const leaderboardHeadHeight = hpx * 40;
	const leaderboardHeightPerPlayer = hpx * 20;

	const leaderboardWidth = hpx * 200;
	const leaderboardHeight = leaderboardHeadHeight + leaderboardHeightPerPlayer * (Constants.LEADERBOARD_LENGTH + hpx * 1);

	const position = {
		x: W - leaderboardBorderGap - leaderboardWidth,
		y: leaderboardBorderGap,
	}
	
	ctx.fillStyle = "rgb(85, 85, 85)";
	ctx.fillRect(position.x + leaderboardOutlineWidth / 2, position.y + leaderboardOutlineWidth / 2,
	leaderboardWidth - leaderboardOutlineWidth / 2, leaderboardHeight - leaderboardOutlineWidth / 2);
	
	renderRoundRect(position.x, position.y, leaderboardWidth, leaderboardHeight, leaderboardRoundCornerRadius, true, true, true, true);
	ctx.lineWidth = leaderboardOutlineWidth;
	ctx.strokeStyle = "rgb(69, 69, 69)";
	ctx.stroke();

	ctx.fillStyle = "rgb(85, 187, 85)";
	ctx.fillRect(position.x + leaderboardOutlineWidth / 2, position.y + leaderboardOutlineWidth / 2, 
	leaderboardWidth - leaderboardOutlineWidth / 2, leaderboardHeadHeight - leaderboardOutlineWidth / 2);
	
	renderRoundRect(position.x, position.y, leaderboardWidth, leaderboardHeadHeight, leaderboardRoundCornerRadius, true, true, false, false);
	ctx.lineWidth = leaderboardOutlineWidth;
	ctx.strokeStyle = "rgb(69, 151, 69)";
	ctx.stroke();

	var baseX = position.x + leaderboardWidth / 2;
	var baseY = position.y;

	if ( playerCount > 1 ) {
		renderText(1, `${playerCount} Flowers`, baseX + hpx * 0, baseY + leaderboardHeadHeight / 2 + leaderboardOutlineWidth, hpx * 18, 'center');
	} else {
		renderText(1, '1 Flower', baseX + hpx * 0, baseY + leaderboardHeadHeight / 2 + leaderboardOutlineWidth, hpx * 18, 'center');
	}
	const rankTopScore = leaderboard[1].score;

	const leaderboardRankBaseLength = leaderboardWidth - leaderboardOutlineWidth - 30;
	const leaderboardRankOutlineWidth = 2;
	const leaderboardRankBaseWidth = leaderboardHeightPerPlayer - 1;

	const leaderboardLength = Math.min(Constants.LEADERBOARD_LENGTH, leaderboard.length - 1);

	for(var i = 1;i <= leaderboardLength - 1; i++) {
		renderLeaderboardRank(i, leaderboardRankBaseLength, leaderboardRankOutlineWidth, leaderboardRankBaseWidth, rankTopScore,
			leaderboardHeadHeight, leaderboardHeightPerPlayer, rankOnLeaderboard, leaderboard[i], baseX, baseY);
	}

	if ( rankOnLeaderboard <= leaderboardLength ) { // if I should be on leaderboard
		renderLeaderboardRank(leaderboardLength, leaderboardRankBaseLength, leaderboardRankOutlineWidth, leaderboardRankBaseWidth, rankTopScore,
			leaderboardHeadHeight, leaderboardHeightPerPlayer, rankOnLeaderboard, leaderboard[leaderboardLength], baseX, baseY);
	} else { // if not
		renderLeaderboardRank(leaderboardLength, leaderboardRankBaseLength, leaderboardRankOutlineWidth, leaderboardRankBaseWidth, rankTopScore,
			leaderboardHeadHeight, leaderboardHeightPerPlayer, leaderboardLength, {score: me.score, id: me.id, username: me.username}, baseX, baseY);
	}
}