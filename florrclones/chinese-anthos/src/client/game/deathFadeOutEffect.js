let diedEntities = [];

export function addDiedEntities(entities) {
	entities.forEach((entity) => {
		diedEntities.push([entity, 1, 1]);
	});
}

export function renderDiedEntities(me) {
	let ctx = getCtx(mobLayer);
	
	diedEntities.forEach(([entity, alpha, size], index) => {
		ctx.globalAlpha = alpha;
		const sz = entity.size * size;

		diedEntities[index][1] *= 0.75;
		diedEntities[index][2] *= 1.05;
		if (diedEntities[index][1] <= 0.05) {
			diedEntities.splice(index, 1);
			return ;
		}

		entity.x += Math.cos(entity.vdir) * (10 / Constants.TICK_PER_SECOND);
		entity.y += Math.sin(entity.vdir) * (10 / Constants.TICK_PER_SECOND);
		let x = W / 2 + (entity.x - me.x) * hpx;
		let y = H / 2 + (entity.y - me.y) * hpx;
		
		let asset;
		if (entity.type == `player`) {
			asset = getAsset(`${entity.type.toLowerCase()}.svg`);
			// entity.size *= 0.25;
			// entity.x += entity.size;
			// entity.y += entity.size;
		} else if (entity.isMob) {
			asset = getAsset(`mobs/${entity.type.toLowerCase()}.svg`);
		} else {
			asset = getAsset(`petals/${entity.type.toLowerCase()}.svg`);
		}
		
		ctx.save();
		ctx.translate(x, y);
		ctx.rotate(entity.dir);
		
		const width = asset.naturalWidth, 
			  height = asset.naturalHeight;

		ctx.drawImage(
			asset,
			- sz,
			- sz / width * height,
			sz * 2,
			sz / width * height * 2,
		);

		ctx.restore();
	});

	ctx.globalAlpha = 1;
}