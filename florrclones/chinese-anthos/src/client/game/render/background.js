import { W, H, hpx } from '../../canvas.js';
import * as canvas from '../../canvas.js';
import { settings, vision } from '../main.js';

function renderBackground(ctx, x, y, mspt) {
	let u = hpx / vision;
	const gridInterval = u * 50;
	
	const startX = ( W / 2 - x * u ) % gridInterval;
	const startY = ( H / 2 - y * u ) % gridInterval;
	
	const gridLineWidth = u * 0.5;

	ctx.fillStyle = `rgb(28, 154, 89)`;
	ctx.fillRect(0, 0, W, H);
	ctx.fillStyle = `rgb(30, 167, 97)`;
	ctx.fillRect(W / 2 - x * u, H / 2 - y * u, settings.map_width * u, settings.map_height * u)

	const gridLineStyle = `rgba(0, 0, 0, 0.3)`;
	for ( let ix = startX; ix < W; ix += gridInterval) {
		ctx.beginPath();
		ctx.moveTo(ix, 0);
		ctx.lineTo(ix, H);
		ctx.strokeStyle = gridLineStyle;
		ctx.lineWidth = gridLineWidth;
		ctx.stroke();
		ctx.closePath();
	}
	
	for ( let iy = startY; iy < H; iy += gridInterval) {
		ctx.beginPath();
		ctx.moveTo(0, iy);
		ctx.lineTo(W, iy);
		ctx.strokeStyle = gridLineStyle;
		ctx.lineWidth = gridLineWidth;
		ctx.stroke();
		ctx.closePath();
	}

	ctx.fillStyle = '#FFFFFF';
	ctx.font = `${10 * u}px PT-sans`;
	ctx.textAlign = 'center';
	ctx.fillText(mspt, W - 10 * u, H - 10 * u);

	// canvas.draw(ctx, canvas.ctxMain);
}

export {
	renderBackground,
};