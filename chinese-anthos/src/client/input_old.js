import { sendMovement, sendMouseDownEvent, sendMouseUpEvent, sendPetalSwitchEvent } from './networking.js';
import { select, deSelect, drag, target, switchPetals, toggleKeyboardMovement } from './render.js';
import { focusCmd, cmdExecute, cmdSetPrev } from './cmd.js';

var keyDown = {
	'w': false,
	's': false,
	'a': false,
	'd': false,
};

var cmdInput = false;
var currentDirection;
var keyboardMovement = false;
var spaceDown = false, shiftDown = false;
var leftDown = false, rightDown = false;
var W;
var hpx;
var primarySlotHitboxLength, primarySlotDisplayLength, primarySlotCenterY, primarySlotCount;
var secondarySlotHitboxLength, secondarySlotDisplayLength, secondarySlotCenterY, secondarySlotCount;
var selectedSlot = undefined, targetSlot = undefined;

document.addEventListener('contextmenu', event => event.preventDefault()); // prevent right-clicks

function inRegion(x, y, xl, xr, yl, yr) {
	return (x >= xl && x <= xr && y >= yl && y <= yr);
}

function onMouseMove(e) {
	const dpr = window.devicePixelRatio;
	let x = e.clientX * dpr, y = e.clientY * dpr;
	handleMovement(x / dpr, y / dpr);

	let slotCount = primarySlotCount;
	let slotHitboxLength = primarySlotHitboxLength * hpx;
	let slotDisplayLength = primarySlotDisplayLength * hpx;
	let centerY = primarySlotCenterY * hpx;
	let point = false;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		if ( inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2) ) {
			point = true;
		}
	}

	slotCount = secondarySlotCount;
	slotHitboxLength = secondarySlotHitboxLength * hpx;
	slotDisplayLength = secondarySlotDisplayLength * hpx;
	centerY = secondarySlotCenterY * hpx;
	for (let i = 0; i < slotCount; i ++ ) {
		let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
		if ( inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2) ) {
			point = true;
		}
	}

	if ( point || selectedSlot ) {
		document.body.style.cursor = "pointer";
	} else {
		document.body.style.cursor = "default";
	}

	if ( selectedSlot ) {
		let targeted = false;
		slotCount = primarySlotCount;
		slotHitboxLength = primarySlotHitboxLength * hpx;
		centerY = primarySlotCenterY * hpx;
		for (let i = 0; i < slotCount; i ++ ) {
			if ( (selectedSlot.isPrimary) && (selectedSlot.slot == i) ) {
				continue;
			}
			let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
			if ( inRegion(x, y, centerX - slotHitboxLength / 2, centerX + slotHitboxLength / 2, centerY - slotHitboxLength / 2, centerY + slotHitboxLength / 2) ) {
				targeted = true;
				targetSlot = {
					isPrimary: true,
					slot: i,
				};
				target(selectedSlot.isPrimary, selectedSlot.slot, true, i);
			}
		}
	
		slotCount = secondarySlotCount;
		slotHitboxLength = secondarySlotHitboxLength * hpx;
		centerY = secondarySlotCenterY * hpx;
		for (let i = 0; i < slotCount; i ++ ) {
			if ( (!selectedSlot.isPrimary) && (selectedSlot.slot == i) ) {
				continue;
			}
			let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
			if ( inRegion(x, y, centerX - slotHitboxLength / 2, centerX + slotHitboxLength / 2, centerY - slotHitboxLength / 2, centerY + slotHitboxLength / 2) ) {
				targeted = true;
				targetSlot = {
					isPrimary: false,
					slot: i,
				};
				target(selectedSlot.isPrimary, selectedSlot.slot, false, i);
			}
		}
	
		if ( !targeted ) {
			targetSlot = undefined;
			drag(selectedSlot.isPrimary, selectedSlot.slot, x, y);
		}
	}
}

function onMouseDown(e) {
	if ( (!spaceDown) && (!shiftDown) ) {
		if ( e.buttons & 1 )
			leftDown = true;
		if ( e.buttons & 2 )
			rightDown = true;
		sendMouseDownEvent(e.buttons);
	}
	if ( e.buttons & 1 ) {
		const dpr = window.devicePixelRatio;
		let x = e.clientX * dpr, y = e.clientY * dpr;
		let slotCount = primarySlotCount;
		let slotHitboxLength = primarySlotHitboxLength * hpx;
		let slotDisplayLength = primarySlotDisplayLength * hpx;
		let centerY = primarySlotCenterY * hpx;
		for (let i = 0; i < slotCount; i ++ ) {
			let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
			if ( inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2) ) {
				selectedSlot = {
					isPrimary: true,
					slot: i,
				};
				select(true, i, x, y);
			}
		}

		slotCount = secondarySlotCount;
		slotHitboxLength = secondarySlotHitboxLength * hpx;
		slotDisplayLength = secondarySlotDisplayLength * hpx;
		centerY = secondarySlotCenterY * hpx;
		for (let i = 0; i < slotCount; i ++ ) {
			let centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
			if ( inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2) ) {
				selectedSlot = {
					isPrimary: false,
					slot: i,
				};
				select(false, i, x, y);
			}
		}
	}
}

function onMouseUp(e) {
	if ( (!spaceDown) && (!shiftDown) ) {
		if ( !(e.buttons & 1) )
			leftDown = false;
		if ( !(e.buttons & 2) )
			rightDown = false;
		sendMouseUpEvent(e.buttons);
	}
	if ( !(e.buttons & 1) ) {
		if ( selectedSlot && targetSlot ) {
			switchPetals(selectedSlot.isPrimary, selectedSlot.slot, targetSlot.isPrimary, targetSlot.slot);
			sendPetalSwitchEvent(
				{isPrimary: selectedSlot.isPrimary, slot: selectedSlot.slot},
				{isPrimary: targetSlot.isPrimary, slot: targetSlot.slot}
			);
			selectedSlot = undefined;
		} else if ( selectedSlot ) {
			deSelect(selectedSlot.isPrimary, selectedSlot.slot);
			selectedSlot = undefined;
		}
	}
}

function handleMovement(x, y) {
	if ( !keyboardMovement ) {
		const direction = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
		const dx = x - window.innerWidth / 2;
		const dy = y - window.innerHeight / 2;
		const distanceMouseCenter = Math.sqrt(dx * dx + dy * dy);
		const speedRatio = Math.min(100, distanceMouseCenter) / 100;
		const input = {
			direction: direction,
			magnitude: speedRatio,
		}
		sendMovement(input);
	}
}

function handleKeyDownInput(e) {
	if ( cmdInput ) {
		if ( e.code == 'Enter' ) {
			cmdExecute();
			cmdInput = false;
		}
		if ( e.code == 'ArrowUp' ) {
			cmdSetPrev();
		}
		return ;
	}
	if ( keyboardMovement ) {
		if ( e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd' ) {
			keyDown[e.key] = true;

			var directionX = 0;
			var directionY = 0;
		
			if ( keyDown['w'] )
				directionY ++;
			if ( keyDown['s'] )
				directionY --;
			if ( keyDown['a'] )
				directionX --;
			if ( keyDown['d'] )
				directionX ++;
			
			if ( directionX == 0 && directionY == 0 ) {
				sendMovement({
					direction: currentDirection,
					magnitude: 0,
				});
			} else {
				currentDirection = Math.atan2(directionX, directionY);
				sendMovement({
					direction: currentDirection,
					magnitude: 1,
				});
			}
		}
	}
	if ( e.code == 'Enter' ) {
		cmdInput = true;
		focusCmd();
	}
	if ( e.key == 'k' ) {
		keyboardMovement = !keyboardMovement;
		toggleKeyboardMovement(keyboardMovement);
		sendMovement({
			direction: 0,
			magnitude: 0,
		});
	}
	if ( (!leftDown) && (!rightDown) ) {
		if ( e.code == 'Space' ) {
			spaceDown = true;
			sendMouseDownEvent((spaceDown * 1) | (shiftDown * 2));
		} else if ( e.code == 'ShiftLeft' ) {
			shiftDown = true;
			sendMouseDownEvent((spaceDown * 1) | (shiftDown * 2));
		}
	}
	if ( parseInt(e.key) !== NaN ) {
		let slot = parseInt(e.key);
		slot --;
		if ( slot == -1 )
			slot = 9;
		if ( slot >= 0 && slot < primarySlotCount) {
			switchPetals(true, slot, false, slot);
			sendPetalSwitchEvent(
				{isPrimary: true, slot: slot},
				{isPrimary: false, slot: slot}
			);
			selectedSlot = undefined;
			targetSlot = undefined;
		}
	}
}

function handleKeyUpInput(e) {
	if ( cmdInput ) {
		return ;
	}
	if ( keyboardMovement ) {
		if ( e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd' ) {
			keyDown[e.key] = false;

			var directionX = 0;
			var directionY = 0;
		
			if ( keyDown['w'] )
				directionY ++;
			if ( keyDown['s'] )
				directionY --;
			if ( keyDown['a'] )
				directionX --;
			if ( keyDown['d'] )
				directionX ++;

			if ( directionX == 0 && directionY == 0 ) {
				sendMovement({
					direction: currentDirection,
					magnitude: 0,
				});
			} else {
				currentDirection = Math.atan2(directionX, directionY);
				sendMovement({
					direction: currentDirection,
					magnitude: 1,
				});
			}
		}
	}
	if ( (!leftDown) && (!rightDown) ) {
		if ( e.code == 'Space' ) {
			spaceDown = false;
			sendMouseUpEvent((spaceDown * 1) | (shiftDown * 2));
		} else if ( e.code == 'ShiftLeft' ) {
			shiftDown = false;
			sendMouseUpEvent((spaceDown * 1) | (shiftDown * 2));
		}
	}
}

export function startCapturingInput() {
	window.addEventListener('mousemove', onMouseMove);
	window.addEventListener('mousedown', onMouseDown);
	window.addEventListener('mouseup', onMouseUp);
	window.addEventListener('keydown', handleKeyDownInput);
	window.addEventListener('keyup', handleKeyUpInput);
}

export function stopCapturingInput() {
	window.removeEventListener('mousemove', onMouseMove);
	window.removeEventListener('mousedown', onMouseDown);
	window.removeEventListener('mouseup', onMouseUp);
	window.removeEventListener('keydown', handleKeyDownInput);
	window.removeEventListener('keyup', handleKeyUpInput);
}

export function updateSlotsData(W_, hpx_, primarySlotHitboxLength_, primarySlotDisplayLength_, primarySlotCenterY_, primarySlotCount_,
		secondarySlotHitboxLength_, secondarySlotDisplayLength_, secondarySlotCenterY_, secondarySlotCount_) {
	W = W_;
	hpx = hpx_;
	primarySlotHitboxLength = primarySlotHitboxLength_;
	primarySlotDisplayLength = primarySlotDisplayLength_;
	primarySlotCenterY = primarySlotCenterY_;
	primarySlotCount = primarySlotCount_;
	secondarySlotHitboxLength = secondarySlotHitboxLength_;
	secondarySlotDisplayLength = secondarySlotDisplayLength_;
	secondarySlotCenterY = secondarySlotCenterY_;
	secondarySlotCount = secondarySlotCount_;
}
