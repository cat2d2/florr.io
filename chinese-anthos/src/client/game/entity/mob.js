export function renderMob(me, mob) {
	ctx = getCtx(mobLayer[0]);
	ctx.globalAlpha = 1;
	const {x, y} = mob;
	const canvasX = W / 2 + (x - me.x) * hpx;
	const canvasY = H / 2 + (y - me.y) * hpx;
	ctx.translate(canvasX, canvasY);
	const renderRadius = mob.size * hpx;
	const asset = getAsset(`mobs/${mob.type.toLowerCase()}.svg`);
	const width = asset.naturalWidth, height = asset.naturalHeight;
	if ( mob.type == "CENTIPEDE" || mob.type == "CENTIPEDE_EVIL") {
		let offset = 0.24;
		ctx.rotate(mob.dir);
		ctx.translate(0, renderRadius * -offset);
		if ( width <= height ) {
			ctx.drawImage(
				asset,
				- renderRadius,
				- renderRadius / width * height,
				renderRadius * 2,
				renderRadius / width * height * 2,
			);
		} else {
			ctx.drawImage(
				asset,
				- renderRadius / height * width,
				- renderRadius,
				renderRadius / height * width * 2,
				renderRadius * 2,
			);
		}
		ctx.translate(0, -renderRadius * -offset);
		ctx.rotate(-mob.dir);
	} else {
		ctx.rotate(mob.dir);
		if ( width <= height ) {
			ctx.drawImage(
				asset,
				- renderRadius,
				- renderRadius / width * height,
				renderRadius * 2,
				renderRadius / width * height * 2,
			);
		} else {
			ctx.drawImage(
				asset,
				- renderRadius / height * width,
				- renderRadius,
				renderRadius / height * width * 2,
				renderRadius * 2,
			);
		}
		ctx.rotate(-mob.dir);
	}

	const hitboxRadius = mob.radius * hpx;
	
	if ( debugOptions[0] ) {
		renderHitbox(hitboxRadius);
	}

	if ( debugOptions[1] ) {
		renderText(1, `hp:${mob.hp.toFixed(1)}`, 0, hpx * 25, hpx * 18, 'center');
	}

	if ( debugOptions[2] ) {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(hitboxRadius * Math.sin(mob.dir), -hitboxRadius * Math.cos(mob.dir));
		ctx.closePath();
		ctx.strokeStyle = '#fc0f5e';
		ctx.lineWidth = hpx * 1;
		ctx.stroke();
	}

	ctx.translate(-canvasX, -canvasY);
}