let lightningPaths = [];

export function renderLightningPath(newPaths, me) {
	newPaths.forEach((path) => {
		lightningPaths.push([path, 1]);
	})
	
	let ctx = getCtx(effectLayer);

	ctx.lineWidth = 1 * hpx;
	ctx.strokeStyle = `White`;
	
	lightningPaths.forEach(([path,alpha], index) => {
		ctx.globalAlpha = alpha;
		lightningPaths[index][1] -= 0.05;
		if (lightningPaths[index][1] <= 0) {
			lightningPaths.splice(index, 1);
			return;
		}
		
		ctx.beginPath();
		let oldx = W / 2 + (path[0].x - me.x) * hpx;
		let oldy = H / 2 + (path[0].y - me.y) * hpx;
		ctx.moveTo(oldx, oldy);
		
		path.forEach((position) => {
			let x = W / 2 + (position.x - me.x) * hpx;
			let y = H / 2 + (position.y - me.y) * hpx;
			ctx.lineTo((oldx + x) / 2 + random(-70, 70) * hpx, (oldy + y) / 2 + random(-70, 70) * hpx);
			ctx.lineTo(x,y);
			oldx = W / 2 + (position.x - me.x) * hpx;
			oldy = H / 2 + (position.y - me.y) * hpx;
		})

		ctx.closePath();

		ctx.stroke();
	})
}