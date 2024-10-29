let petalSwing = Math.PI * 0.03;

export class Petal { // ui里的物品栏里的花瓣
	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.dir = 0;
		this.swing = false;
		this.size = 1;
		this.targetX = x;
		this.targetY = y;
		this.defaultX = x;
		this.defaultY = y;
		this.targetSize = 1;
		this.type = type;
		this.animating = false;
	}

	setTargetPos(x, y) {
		this.targetX = x;
		this.targetY = y;
	}

	setTargetSize(size) {
		this.targetSize = size;
	}
	
	setType(type) {
		this.type = type;
	}

	render(length) {
		if ( this.type != 'NONE' ) {
			const followSpeed = 0.2;

			this.x += (this.targetX - this.x) * followSpeed;
			if ( Math.abs(this.targetX - this.x) < 0.5 ) {
				this.x = this.targetX;
			}

			this.y += (this.targetY - this.y) * followSpeed;
			if ( Math.abs(this.targetY - this.y) < 0.5 ) {
				this.y = this.targetY;
			}
			
			if ( this.animating ) {
				if ( this.x == this.targetX && this.x == this.defaultX && this.y == this.targetY && this.y == this.defaultY && (!this.swing) && this.dir == 0 ){
					this.animating = false;
				}
			}

			this.size += (this.targetSize - this.size) * 0.3;
			if ( Math.abs(this.targetSize - this.size) < 0.02 ) {
				this.size = this.targetSize;
			}

			if ( this.swing ) {
				if ( petalSwing > this.dir ) {
					this.dir += Math.min(0.015, Math.min(petalSwing - this.dir, this.dir + petalSwing) * 0.25);
				} else {
					this.dir += Math.max(-0.015, Math.max(petalSwing - this.dir, this.dir + petalSwing) * 0.25);

				}
				if ( Math.abs(petalSwing - this.dir) < 0.01) {
					petalSwing = -petalSwing;
				}
			} else {
				this.dir -= this.dir * 0.1;
				if ( Math.abs(this.dir) < 0.001 ) {
					this.dir = 0;
				}
			}
			
			let petalAlpha = 0.88;
			ctx.translate(this.x, this.y);
			ctx.rotate(this.dir);
			ctx.globalAlpha = petalAlpha;
			let displayLength = length * this.size;
			let outlineWidth = displayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
			renderRoundRect(- displayLength / 2 - outlineWidth, - displayLength / 2 - outlineWidth, 
			displayLength + outlineWidth * 2, displayLength + outlineWidth * 2, hpx * 1, true, true, true, true);
			ctx.strokeStyle = Constants.RARITY_COLOR_DARKEN[PetalAttributes[this.type].RARITY];
			ctx.lineWidth = outlineWidth * 2;
			
			if (this.type == `EMPTY`) {
				ctx.globalAlpha = 0;
				petalAlpha = 0;
			};

			ctx.globalCompositeOperation = 'destination-out';
			ctx.stroke();

			ctx.globalCompositeOperation = 'source-over';
			ctx.stroke();

			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillRect(- displayLength / 2, - displayLength / 2, displayLength, displayLength);

			ctx.globalCompositeOperation = 'source-over';
			ctx.fillStyle = Constants.RARITY_COLOR[PetalAttributes[this.type].RARITY];
			ctx.fillRect(- displayLength / 2, - displayLength / 2, displayLength, displayLength);
			
			ctx.globalCompositeOperation = 'destination-out';
			
			const renderRadius = displayLength * 0.2;
			const asset = getAsset(`petals/${this.type.toLowerCase()}.svg`);
			const width = asset.naturalWidth, height = asset.naturalHeight;
			const offset = displayLength * 0.08;
			
			let offsetX = 0,
				offsetY = 0;
			if (PetalAttributes[this.type].MULTIPLE) {
				let baseAngle = Math.PI / 2;
				for (let i = 0; i < PetalAttributes[this.type].COUNT; i++) {
					offsetX = (renderRadius + 1) * Math.sin(baseAngle + i / PetalAttributes[this.type].COUNT * 2 * Math.PI);
					offsetY = (renderRadius + 1) * Math.cos(baseAngle + i / PetalAttributes[this.type].COUNT * 2 * Math.PI);
					
					if ( width <= height ) {
						ctx.drawImage(
							asset,
							- renderRadius + offsetX,
							- renderRadius / width * height - offset + offsetY,
							renderRadius * 2,
							renderRadius / width * height * 2,
						);
						
						ctx.globalCompositeOperation = 'source-over';
						ctx.drawImage(
							asset,
							- renderRadius + offsetX,
							- renderRadius / width * height - offset + offsetY,
							renderRadius * 2,
							renderRadius / width * height * 2,
						);
					} else {
						ctx.drawImage(
							asset,
							- renderRadius / height * width + offsetX,
							- renderRadius - offset + offsetY,
							renderRadius / height * width * 2,
							renderRadius * 2,
						);
					
						ctx.globalCompositeOperation = 'source-over';
						ctx.drawImage(
							asset,
							- renderRadius / height * width + offsetX,
							- renderRadius - offset + offsetY,
							renderRadius / height * width * 2,
							renderRadius * 2,
						);
					}
				}
			} else {
				if ( width <= height ) {
					ctx.drawImage(
						asset,
						- renderRadius + offsetX,
						- renderRadius / width * height - offset + offsetY,
						renderRadius * 2,
						renderRadius / width * height * 2,
					);
						
					ctx.globalCompositeOperation = 'source-over';
					ctx.drawImage(
						asset,
						- renderRadius + offsetX,
						- renderRadius / width * height - offset + offsetY,
						renderRadius * 2,
						renderRadius / width * height * 2,
					);
				} else {
					ctx.drawImage(
						asset,
						- renderRadius / height * width + offsetX,
						- renderRadius - offset + offsetY,
						renderRadius / height * width * 2,
						renderRadius * 2,
					);
					
					ctx.globalCompositeOperation = 'source-over';
					ctx.drawImage(
						asset,
						- renderRadius / height * width + offsetX,
						- renderRadius - offset + offsetY,
						renderRadius / height * width * 2,
						renderRadius * 2,
					);
				}
			}
			
			let name = this.type.toLowerCase();
			let textOffset = displayLength * 0.35;
			let textFont = displayLength * 0.25;
			
			ctx.globalCompositeOperation = 'destination-out';
			renderText(petalAlpha, name.charAt(0).toUpperCase() + name.slice(1), 0, textOffset, textFont, 'center');

			ctx.globalCompositeOperation = 'source-over';
			renderText(petalAlpha, name.charAt(0).toUpperCase() + name.slice(1), 0, textOffset, textFont, 'center');

			ctx.rotate(-this.dir);
			ctx.translate(-this.x, -this.y);
			ctx.globalAlpha = 1;
		}
	}
}