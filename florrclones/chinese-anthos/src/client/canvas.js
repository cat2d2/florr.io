// import { setPetalPosition } from './ui/ui.js';

let canvas; // 主画布
let ctxMain;
let W, H, hpx;

function init() { // 初始化
	canvas = document.getElementById('canvas');
	ctxMain = canvas.getContext('2d');
	handleWindowResize();
	window.addEventListener('resize', handleWindowResize);
}

function getTmpCtx(w = W, h = H) { // 返回临时画布
	let newCanvas = createCanvas();
	newCanvas.width = w;
	newCanvas.height = h;
	return newCanvas.getContext('2d');
}

function draw(ctx, onCtx, x = 0, y = 0, remove = true) {
	onCtx.drawImage(ctx.canvas, x, y);
	if ( remove ) {
		ctx.canvas.remove();
	}
}

// 以指定位置为图像中心绘制图像
function drawImage(ctx, asset, x, y, dir, renderRadius, alpha = 1) {
	const width = asset.naturalWidth, height = asset.naturalHeight;
	ctx.save();
	ctx.globalAlpha = alpha;
	ctx.translate(x, y);
	ctx.rotate(dir);
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
	ctx.restore();
}

// 先将asset填充为同种颜色，再绘制asset
function fillColorOnAsset(onCtx, asset, rectColor, alpha, x, y, dir, renderRadius) { 
	const ctx = getTmpCtx();
	ctx.save();
	
	ctx.globalCompositeOperation = "source-over";
	drawImage(ctx, asset, x, y, dir, renderRadius);
	
	ctx.globalCompositeOperation = "source-in";
	ctx.globalAlpha = alpha;
	ctx.fillStyle = rectColor;
	
	const width = asset.naturalWidth, height = asset.naturalHeight;
	
	ctx.translate(x, y);
	
	ctx.rotate(dir);
	
	if ( width <= height ) {
		ctx.fillRect(
			- renderRadius,
			- renderRadius / width * height,
			renderRadius * 2,
			renderRadius / width * height * 2,
		);
	} else {
		ctx.fillRect(
			- renderRadius / height * width,
			- renderRadius,
			renderRadius / height * width * 2,
			renderRadius * 2,
		);
	}
	
	ctx.restore()
	draw(ctx, onCtx);
}

function createCanvas(id = undefined) { // 创建canvas
	let newCanvas = document.createElement('canvas');
	if ( id ) {
		newCanvas.id = id;
		document.body.append(newCanvas);
	}
	newCanvas.classList.add('canvas');
	return newCanvas;
}

function handleWindowResize() {
	const devicePixelRatio = window.devicePixelRatio || 1;
	W = window.innerWidth * devicePixelRatio;
	H = window.innerHeight * devicePixelRatio;
	hpx = H / 1000;
	setCanvasDimensions(canvas);
}

function setCanvasDimensions(canvas_) {
	canvas_.width = W;
	canvas_.height = H;
	canvas_.style.width = window.innerWidth + `px`;
	canvas_.style.height = window.innerHeight + `px`;
}

export {
	W, H, hpx,
	ctxMain,
	init,
	getTmpCtx,
	draw,
	drawImage,
	fillColorOnAsset,
};