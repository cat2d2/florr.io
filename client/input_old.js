"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startCapturingInput = startCapturingInput;
exports.stopCapturingInput = stopCapturingInput;
exports.updateSlotsData = updateSlotsData;
var _networking = require("./networking.js");
var _render = require("./render.js");
var _cmd = require("./cmd.js");
var keyDown = {
  'w': false,
  's': false,
  'a': false,
  'd': false
};
var cmdInput = false;
var currentDirection;
var keyboardMovement = false;
var spaceDown = false,
  shiftDown = false;
var leftDown = false,
  rightDown = false;
var W;
var hpx;
var primarySlotHitboxLength, primarySlotDisplayLength, primarySlotCenterY, primarySlotCount;
var secondarySlotHitboxLength, secondarySlotDisplayLength, secondarySlotCenterY, secondarySlotCount;
var selectedSlot = undefined,
  targetSlot = undefined;
document.addEventListener('contextmenu', function (event) {
  return event.preventDefault();
}); // prevent right-clicks

function inRegion(x, y, xl, xr, yl, yr) {
  return x >= xl && x <= xr && y >= yl && y <= yr;
}
function onMouseMove(e) {
  var dpr = window.devicePixelRatio;
  var x = e.clientX * dpr,
    y = e.clientY * dpr;
  handleMovement(x / dpr, y / dpr);
  var slotCount = primarySlotCount;
  var slotHitboxLength = primarySlotHitboxLength * hpx;
  var slotDisplayLength = primarySlotDisplayLength * hpx;
  var centerY = primarySlotCenterY * hpx;
  var point = false;
  for (var i = 0; i < slotCount; i++) {
    var centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
    if (inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2)) {
      point = true;
    }
  }
  slotCount = secondarySlotCount;
  slotHitboxLength = secondarySlotHitboxLength * hpx;
  slotDisplayLength = secondarySlotDisplayLength * hpx;
  centerY = secondarySlotCenterY * hpx;
  for (var _i = 0; _i < slotCount; _i++) {
    var _centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i * slotHitboxLength;
    if (inRegion(x, y, _centerX - slotDisplayLength / 2, _centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2)) {
      point = true;
    }
  }
  if (point || selectedSlot) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
  if (selectedSlot) {
    var targeted = false;
    slotCount = primarySlotCount;
    slotHitboxLength = primarySlotHitboxLength * hpx;
    centerY = primarySlotCenterY * hpx;
    for (var _i2 = 0; _i2 < slotCount; _i2++) {
      if (selectedSlot.isPrimary && selectedSlot.slot == _i2) {
        continue;
      }
      var _centerX2 = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i2 * slotHitboxLength;
      if (inRegion(x, y, _centerX2 - slotHitboxLength / 2, _centerX2 + slotHitboxLength / 2, centerY - slotHitboxLength / 2, centerY + slotHitboxLength / 2)) {
        targeted = true;
        targetSlot = {
          isPrimary: true,
          slot: _i2
        };
        (0, _render.target)(selectedSlot.isPrimary, selectedSlot.slot, true, _i2);
      }
    }
    slotCount = secondarySlotCount;
    slotHitboxLength = secondarySlotHitboxLength * hpx;
    centerY = secondarySlotCenterY * hpx;
    for (var _i3 = 0; _i3 < slotCount; _i3++) {
      if (!selectedSlot.isPrimary && selectedSlot.slot == _i3) {
        continue;
      }
      var _centerX3 = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i3 * slotHitboxLength;
      if (inRegion(x, y, _centerX3 - slotHitboxLength / 2, _centerX3 + slotHitboxLength / 2, centerY - slotHitboxLength / 2, centerY + slotHitboxLength / 2)) {
        targeted = true;
        targetSlot = {
          isPrimary: false,
          slot: _i3
        };
        (0, _render.target)(selectedSlot.isPrimary, selectedSlot.slot, false, _i3);
      }
    }
    if (!targeted) {
      targetSlot = undefined;
      (0, _render.drag)(selectedSlot.isPrimary, selectedSlot.slot, x, y);
    }
  }
}
function onMouseDown(e) {
  if (!spaceDown && !shiftDown) {
    if (e.buttons & 1) leftDown = true;
    if (e.buttons & 2) rightDown = true;
    (0, _networking.sendMouseDownEvent)(e.buttons);
  }
  if (e.buttons & 1) {
    var dpr = window.devicePixelRatio;
    var x = e.clientX * dpr,
      y = e.clientY * dpr;
    var slotCount = primarySlotCount;
    var slotHitboxLength = primarySlotHitboxLength * hpx;
    var slotDisplayLength = primarySlotDisplayLength * hpx;
    var centerY = primarySlotCenterY * hpx;
    for (var i = 0; i < slotCount; i++) {
      var centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
      if (inRegion(x, y, centerX - slotDisplayLength / 2, centerX + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2)) {
        selectedSlot = {
          isPrimary: true,
          slot: i
        };
        (0, _render.select)(true, i, x, y);
      }
    }
    slotCount = secondarySlotCount;
    slotHitboxLength = secondarySlotHitboxLength * hpx;
    slotDisplayLength = secondarySlotDisplayLength * hpx;
    centerY = secondarySlotCenterY * hpx;
    for (var _i4 = 0; _i4 < slotCount; _i4++) {
      var _centerX4 = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i4 * slotHitboxLength;
      if (inRegion(x, y, _centerX4 - slotDisplayLength / 2, _centerX4 + slotDisplayLength / 2, centerY - slotDisplayLength / 2, centerY + slotDisplayLength / 2)) {
        selectedSlot = {
          isPrimary: false,
          slot: _i4
        };
        (0, _render.select)(false, _i4, x, y);
      }
    }
  }
}
function onMouseUp(e) {
  if (!spaceDown && !shiftDown) {
    if (!(e.buttons & 1)) leftDown = false;
    if (!(e.buttons & 2)) rightDown = false;
    (0, _networking.sendMouseUpEvent)(e.buttons);
  }
  if (!(e.buttons & 1)) {
    if (selectedSlot && targetSlot) {
      (0, _render.switchPetals)(selectedSlot.isPrimary, selectedSlot.slot, targetSlot.isPrimary, targetSlot.slot);
      (0, _networking.sendPetalSwitchEvent)({
        isPrimary: selectedSlot.isPrimary,
        slot: selectedSlot.slot
      }, {
        isPrimary: targetSlot.isPrimary,
        slot: targetSlot.slot
      });
      selectedSlot = undefined;
    } else if (selectedSlot) {
      (0, _render.deSelect)(selectedSlot.isPrimary, selectedSlot.slot);
      selectedSlot = undefined;
    }
  }
}
function handleMovement(x, y) {
  if (!keyboardMovement) {
    var direction = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
    var dx = x - window.innerWidth / 2;
    var dy = y - window.innerHeight / 2;
    var distanceMouseCenter = Math.sqrt(dx * dx + dy * dy);
    var speedRatio = Math.min(100, distanceMouseCenter) / 100;
    var input = {
      direction: direction,
      magnitude: speedRatio
    };
    (0, _networking.sendMovement)(input);
  }
}
function handleKeyDownInput(e) {
  if (cmdInput) {
    if (e.code == 'Enter') {
      (0, _cmd.cmdExecute)();
      cmdInput = false;
    }
    if (e.code == 'ArrowUp') {
      (0, _cmd.cmdSetPrev)();
    }
    return;
  }
  if (keyboardMovement) {
    if (e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd') {
      keyDown[e.key] = true;
      var directionX = 0;
      var directionY = 0;
      if (keyDown['w']) directionY++;
      if (keyDown['s']) directionY--;
      if (keyDown['a']) directionX--;
      if (keyDown['d']) directionX++;
      if (directionX == 0 && directionY == 0) {
        (0, _networking.sendMovement)({
          direction: currentDirection,
          magnitude: 0
        });
      } else {
        currentDirection = Math.atan2(directionX, directionY);
        (0, _networking.sendMovement)({
          direction: currentDirection,
          magnitude: 1
        });
      }
    }
  }
  if (e.code == 'Enter') {
    cmdInput = true;
    (0, _cmd.focusCmd)();
  }
  if (e.key == 'k') {
    keyboardMovement = !keyboardMovement;
    (0, _render.toggleKeyboardMovement)(keyboardMovement);
    (0, _networking.sendMovement)({
      direction: 0,
      magnitude: 0
    });
  }
  if (!leftDown && !rightDown) {
    if (e.code == 'Space') {
      spaceDown = true;
      (0, _networking.sendMouseDownEvent)(spaceDown * 1 | shiftDown * 2);
    } else if (e.code == 'ShiftLeft') {
      shiftDown = true;
      (0, _networking.sendMouseDownEvent)(spaceDown * 1 | shiftDown * 2);
    }
  }
  if (parseInt(e.key) !== NaN) {
    var slot = parseInt(e.key);
    slot--;
    if (slot == -1) slot = 9;
    if (slot >= 0 && slot < primarySlotCount) {
      (0, _render.switchPetals)(true, slot, false, slot);
      (0, _networking.sendPetalSwitchEvent)({
        isPrimary: true,
        slot: slot
      }, {
        isPrimary: false,
        slot: slot
      });
      selectedSlot = undefined;
      targetSlot = undefined;
    }
  }
}
function handleKeyUpInput(e) {
  if (cmdInput) {
    return;
  }
  if (keyboardMovement) {
    if (e.key == 'w' || e.key == 's' || e.key == 'a' || e.key == 'd') {
      keyDown[e.key] = false;
      var directionX = 0;
      var directionY = 0;
      if (keyDown['w']) directionY++;
      if (keyDown['s']) directionY--;
      if (keyDown['a']) directionX--;
      if (keyDown['d']) directionX++;
      if (directionX == 0 && directionY == 0) {
        (0, _networking.sendMovement)({
          direction: currentDirection,
          magnitude: 0
        });
      } else {
        currentDirection = Math.atan2(directionX, directionY);
        (0, _networking.sendMovement)({
          direction: currentDirection,
          magnitude: 1
        });
      }
    }
  }
  if (!leftDown && !rightDown) {
    if (e.code == 'Space') {
      spaceDown = false;
      (0, _networking.sendMouseUpEvent)(spaceDown * 1 | shiftDown * 2);
    } else if (e.code == 'ShiftLeft') {
      shiftDown = false;
      (0, _networking.sendMouseUpEvent)(spaceDown * 1 | shiftDown * 2);
    }
  }
}
function startCapturingInput() {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('keydown', handleKeyDownInput);
  window.addEventListener('keyup', handleKeyUpInput);
}
function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mousedown', onMouseDown);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('keydown', handleKeyDownInput);
  window.removeEventListener('keyup', handleKeyUpInput);
}
function updateSlotsData(W_, hpx_, primarySlotHitboxLength_, primarySlotDisplayLength_, primarySlotCenterY_, primarySlotCount_, secondarySlotHitboxLength_, secondarySlotDisplayLength_, secondarySlotCenterY_, secondarySlotCount_) {
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