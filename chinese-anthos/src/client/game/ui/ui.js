import { Petal } from "./petal";

const PETAL_OUTLINE_WIDTH_PERCENTAGE = 0.05;

let primarySlotDisplayLength = 60, primarySlotHitboxLength = 92, primarySlotCenterY = 850;
let secondarySlotDisplayLength = 45, secondarySlotHitboxLength = 70, secondarySlotCenterY = 930;
let primarySlotCount = Constants.PRIMARY_SLOT_COUNT_BASE;
let secondarySlotCount = Constants.SECONDARY_SLOT_COUNT_BASE;
let selectedSize = 1.2;

export function renderUI(me) {
	ctx = getCtx(UILayer);

	renderExpBar(me); // 经验条

	if ( !isKeyboardMovement() ) { // movement helper
		renderMovementHelper();
	}

	renderSlots(me); // 物品栏

	renderCmdLog(); // 控制台输出

	renderInfo(); // 服务器信息
}

let expBarLength = 0;

function renderExpBar(me) {
	const expBarYPos = hpx * 900;
	const expBarBaseLength = hpx * 300;
	const expBarBaseWidth = hpx * 45;
	const expBarBaseStyle = 'rgba(51, 51, 51, 0.85)';
	const expBarExpectedLength = expBarBaseLength * me.exp / me.currentExpForLevel;
	expBarLength += (expBarExpectedLength - expBarLength) * 0.3;
	if ( Math.abs(expBarExpectedLength - expBarLength) <= 1 ) {
		expBarLength = expBarExpectedLength;
	}
	const expBarWidth = expBarBaseWidth - hpx * 5;
	const expBarStyle = 'rgba(255, 255, 110, 0.95)'
	
	ctx.beginPath();
	ctx.moveTo(0, expBarYPos);
	ctx.lineTo(expBarBaseLength, expBarYPos);
	ctx.lineWidth = expBarBaseWidth;
	ctx.strokeStyle = expBarBaseStyle;
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.closePath();

	ctx.globalCompositeOperation = 'desitination-out';
	ctx.beginPath();
	ctx.moveTo(0, expBarYPos);
	ctx.lineTo(expBarLength, expBarYPos);
	ctx.lineWidth = expBarWidth;
	ctx.strokeStyle = 'rgb(0, 0, 0)';
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(0, expBarYPos);
	ctx.lineTo(expBarLength, expBarYPos);
	ctx.lineWidth = expBarWidth;
	ctx.strokeStyle = expBarStyle;
	ctx.lineCap = 'round';
	ctx.stroke();
	ctx.closePath();

	ctx.globalCompositeOperation = 'source-over';

	ctx.globalAlpha = 1;
	renderText(1, `Lvl ${Math.floor(me.level)} flower`, hpx * 100, expBarYPos + hpx * 5, hpx * 18, 'left');
	renderText(0.9, me.username, hpx * 150, expBarYPos - hpx * 40, hpx * 30, 'center');
}

function renderMovementHelper() {
	// ...
}

let primaryPetals = [];
let secondaryPetals = [];

function renderSlots(me) {
	// primary slots
	if ( me.petalSync ) {
		if ( primarySlotCount < me.primaryPetals.length ) {
			primarySlotCount = me.primaryPetals.length;
		}
		while ( primaryPetals.length < me.primaryPetals.length ) {
			let p = new Petal(0, 0, me.primaryPetals[primaryPetals.length].type);
			primaryPetals.push(p);
		}
	}

	let slotCount = primarySlotCount;
	let slotDisplayLength = primarySlotDisplayLength * hpx;
	let slotHitboxLength = primarySlotHitboxLength * hpx;
	let centerY = primarySlotCenterY * hpx;
	let petalOutlineWidth = slotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		renderRoundRect(centerX - slotDisplayLength / 2 - petalOutlineWidth, centerY - slotDisplayLength / 2 - petalOutlineWidth, 
			slotDisplayLength + petalOutlineWidth * 2, slotDisplayLength + petalOutlineWidth * 2, hpx * 1, true, true, true, true);
		ctx.strokeStyle = 'rgba(207, 207, 207, 0.7)';
		ctx.lineWidth = petalOutlineWidth * 2;
		ctx.stroke();

		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillRect(centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);

		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
		ctx.fillRect(centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);
	}

	// secondary slots

	if ( me.petalSync ) {
		if ( secondarySlotCount < me.secondaryPetals.length ) {
			secondarySlotCount = me.secondaryPetals.length;
		}
		while ( secondaryPetals.length < me.secondaryPetals.length ) {
			let p = new Petal(0, 0, me.secondaryPetals[secondaryPetals.length].type);
			secondaryPetals.push(p);
		}
	}

	slotCount = secondarySlotCount;
	slotDisplayLength = secondarySlotDisplayLength * hpx;
	slotHitboxLength = secondarySlotHitboxLength * hpx;
	centerY = secondarySlotCenterY * hpx;
	petalOutlineWidth = slotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		renderRoundRect(centerX - slotDisplayLength / 2 - petalOutlineWidth, centerY - slotDisplayLength / 2 - petalOutlineWidth, 
			slotDisplayLength + petalOutlineWidth * 2, slotDisplayLength + petalOutlineWidth * 2, hpx * 1, true, true, true, true);
		ctx.strokeStyle = 'rgba(207, 207, 207, 0.7)';
		ctx.lineWidth = petalOutlineWidth * 2;
		ctx.stroke();

		ctx.globalCompositeOperation = 'destination-out';
		ctx.fillRect(centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);

		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
		ctx.fillRect(centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);
	}

	// primary

	slotCount = primarySlotCount;
	slotDisplayLength = primarySlotDisplayLength * hpx;
	slotHitboxLength = primarySlotHitboxLength * hpx;
	centerY = primarySlotCenterY * hpx;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		if ( !primaryPetals[i].animating ) {
			primaryPetals[i].setTargetPos(centerX, centerY);
			primaryPetals[i].setTargetSize(1);
			if ( me.petalSync ) {
				primaryPetals[i].setType(me.primaryPetals[i]);
			}
			primaryPetals[i].render(slotDisplayLength);
		}
	}

	for (let i = 0; i < slotCount; i ++ ) {
		if ( primaryPetals[i].animating ) {
			primaryPetals[i].render(slotDisplayLength);
		}
	}

	// secondary

	slotCount = secondarySlotCount;
	slotDisplayLength = secondarySlotDisplayLength * hpx;
	slotHitboxLength = secondarySlotHitboxLength * hpx;
	centerY = secondarySlotCenterY * hpx;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		if ( !secondaryPetals[i].animating ) {
			secondaryPetals[i].setTargetPos(centerX, centerY);
			secondaryPetals[i].setTargetSize(1);
			if ( me.petalSync )
				secondaryPetals[i].setType(me.secondaryPetals[i]);
			secondaryPetals[i].render(slotDisplayLength);
		}
	}
	for (let i = 0; i < slotCount; i ++ ) {
		if ( secondaryPetals[i].animating ) {
			secondaryPetals[i].render(slotDisplayLength);
		}
	}
}

function renderCmdLog() {
	let len = cmdLog.length;
	let rightAlign = 990 * wpx;
	let fontSize = 15 * hpx;
	let spaceBetween = 5 * hpx;
	let alpha = 0.9;

	ctx.lineWidth = fontSize * 0.125;
	ctx.font = `${fontSize}px Ubuntu`;
	ctx.textAlign = "right";
	ctx.globalAlpha = alpha;

	for (let i = len - 1; i >= Math.max(0, len - cmdMaxLineCnt); i -- ) {
		// ctx.strokeText(cmdLog[i], rightAlign, (900 - (len - i) * (spaceBetween + fontSize)) * hpx, fontSize);
		let text = cmdLog[i];
		let x = rightAlign;
		let y = (900 * hpx - (len - i) * (spaceBetween + fontSize));
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = cmdColor;
		ctx.fillText(text, x, y);
	}
	ctx.globalAlpha = 1;
}

function renderInfo(info) { // state.info
	renderText(0.7, "real_florrio", hpx * 85, hpx * 45, hpx * 40, 'center');
	renderText(1, `MSPT: ${info.mspt}`, W - hpx * 10, H - hpx * 15, hpx * 10, 'right');
	renderText(1, `Mob Count: ${info.mobCount}`, W - hpx * 10, H - hpx * 30, hpx * 10, 'right');
	renderText(1, `Mob Volume Taken: ${info.mobVol}`, W - hpx * 10, H - hpx * 45, hpx * 10, 'right');
}

export function select(isPrimary, slot, x, y) {
	let petal;
	if ( isPrimary ) {
		petal = primaryPetals[slot];
	} else {
		petal = secondaryPetals[slot];
	}
	petal.animating = true;
	petal.swing = true;
	petal.setTargetPos(x, y);
	petal.setTargetSize(selectedSize);
}

export function deSelect(isPrimary, slot) {
	let petal;
	let slotHitboxLength, slotCount, slotCenterY;

	if ( isPrimary ) {
		petal = primaryPetals[slot];
		slotHitboxLength = primarySlotHitboxLength;
		slotCount = primarySlotCount;
		slotCenterY = primarySlotCenterY;
	} else {
		petal = secondaryPetals[slot];
		slotHitboxLength = secondarySlotHitboxLength;
		slotCount = secondarySlotCount;
		slotCenterY = secondarySlotCenterY;
	}

	petal.swing = false;
	petal.setTargetPos(W / 2 - slotHitboxLength * hpx * (slotCount / 2 - 0.5) + slot * slotHitboxLength * hpx, slotCenterY * hpx);
	petal.setTargetSize(1);
}

export function target(isPrimary, slot, targetIsPrimary, targetSlot) {
	let petal;
	let slotHitboxLength, slotCount, slotCenterY;
	let defaultSize, targetSize;

	if ( isPrimary ) {
		petal = primaryPetals[slot];
		defaultSize = primarySlotDisplayLength;
	} else {
		petal = secondaryPetals[slot];
		defaultSize = secondarySlotDisplayLength;
	}

	if ( targetIsPrimary ) {
		slotHitboxLength = primarySlotHitboxLength;
		slotCount = primarySlotCount;
		slotCenterY = primarySlotCenterY;
		targetSize = primarySlotDisplayLength;
	} else {
		slotHitboxLength = secondarySlotHitboxLength;
		slotCount = secondarySlotCount;
		slotCenterY = secondarySlotCenterY;
		targetSize = secondarySlotDisplayLength;
	}

	petal.swing = false;
	petal.setTargetPos(W / 2 - slotHitboxLength * hpx * (slotCount / 2 - 0.5) + targetSlot * slotHitboxLength * hpx, slotCenterY * hpx);
	petal.setTargetSize(targetSize / defaultSize);
}

export function drag(isPrimary, slot, x, y) {
	let petal;
	if ( isPrimary ) {
		petal = primaryPetals[slot];
	} else {
		petal = secondaryPetals[slot];
	}
	petal.setTargetPos(x, y);
	if ( !petal.swing ) {
		petal.swing = true;
		petal.setTargetSize(selectedSize);
	}
}

export function switchPetals(isPrimary, slot, targetIsPrimary, targetSlot) {

	let petalA, petalB;

	if ( isPrimary ) {
		petalA = primaryPetals[slot];
	} else {
		petalA = secondaryPetals[slot];
	}
	
	if ( targetIsPrimary ) {
		petalB = primaryPetals[targetSlot];
	} else {
		petalB = secondaryPetals[targetSlot];
	}

	petalA.animating = true;
	petalB.animating = true;

	petalA.swing = false;
	petalB.swing = false;
	
	petalA.setTargetPos(petalA.defaultX, petalA.defaultY);
	petalB.setTargetPos(petalB.defaultX, petalB.defaultY);

	petalA.targetSize = 1;
	petalB.targetSize = 1;

	let tmp = petalA.type;
	petalA.type = petalB.type;
	petalB.type = tmp;

	tmp = petalA.x;
	petalA.x = petalB.x;
	petalB.x = tmp;
	tmp = petalA.y;
	petalA.y = petalB.y;
	petalB.y = tmp;
}

export function setPetalPosition() {
	if ( primaryPetals[0] ) {
		for (let i = 0; i < primarySlotCount; i ++ ) {
			primaryPetals[i].defaultX = W / 2 - primarySlotHitboxLength * hpx * (primarySlotCount / 2 - 0.5) + i * primarySlotHitboxLength * hpx;
			primaryPetals[i].defaultY = primarySlotCenterY * hpx;
		}
		for (let i = 0; i < secondarySlotCount; i ++ ) {
			secondaryPetals[i].defaultX = W / 2 - secondarySlotHitboxLength * hpx * (secondarySlotCount / 2 - 0.5) + i * secondarySlotHitboxLength * hpx;
			secondaryPetals[i].defaultY = secondarySlotCenterY * hpx;
		}
	}
}