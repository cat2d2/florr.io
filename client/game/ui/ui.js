"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deSelect = deSelect;
exports.drag = drag;
exports.renderUI = renderUI;
exports.select = select;
exports.setPetalPosition = setPetalPosition;
exports.switchPetals = switchPetals;
exports.target = target;
var _petal = require("./petal");
var PETAL_OUTLINE_WIDTH_PERCENTAGE = 0.05;
var primarySlotDisplayLength = 60,
  primarySlotHitboxLength = 92,
  primarySlotCenterY = 850;
var secondarySlotDisplayLength = 45,
  secondarySlotHitboxLength = 70,
  secondarySlotCenterY = 930;
var primarySlotCount = Constants.PRIMARY_SLOT_COUNT_BASE;
var secondarySlotCount = Constants.SECONDARY_SLOT_COUNT_BASE;
var selectedSize = 1.2;
function renderUI(me) {
  ctx = getCtx(UILayer);
  renderExpBar(me); // 经验条

  if (!isKeyboardMovement()) {
    // movement helper
    renderMovementHelper();
  }
  renderSlots(me); // 物品栏

  renderCmdLog(); // 控制台输出

  renderInfo(); // 服务器信息
}
var expBarLength = 0;
function renderExpBar(me) {
  var expBarYPos = hpx * 900;
  var expBarBaseLength = hpx * 300;
  var expBarBaseWidth = hpx * 45;
  var expBarBaseStyle = 'rgba(51, 51, 51, 0.85)';
  var expBarExpectedLength = expBarBaseLength * me.exp / me.currentExpForLevel;
  expBarLength += (expBarExpectedLength - expBarLength) * 0.3;
  if (Math.abs(expBarExpectedLength - expBarLength) <= 1) {
    expBarLength = expBarExpectedLength;
  }
  var expBarWidth = expBarBaseWidth - hpx * 5;
  var expBarStyle = 'rgba(255, 255, 110, 0.95)';
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
  renderText(1, "Lvl ".concat(Math.floor(me.level), " flower"), hpx * 100, expBarYPos + hpx * 5, hpx * 18, 'left');
  renderText(0.9, me.username, hpx * 150, expBarYPos - hpx * 40, hpx * 30, 'center');
}
function renderMovementHelper() {
  // ...
}
var primaryPetals = [];
var secondaryPetals = [];
function renderSlots(me) {
  // primary slots
  if (me.petalSync) {
    if (primarySlotCount < me.primaryPetals.length) {
      primarySlotCount = me.primaryPetals.length;
    }
    while (primaryPetals.length < me.primaryPetals.length) {
      var p = new _petal.Petal(0, 0, me.primaryPetals[primaryPetals.length].type);
      primaryPetals.push(p);
    }
  }
  var slotCount = primarySlotCount;
  var slotDisplayLength = primarySlotDisplayLength * hpx;
  var slotHitboxLength = primarySlotHitboxLength * hpx;
  var centerY = primarySlotCenterY * hpx;
  var petalOutlineWidth = slotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
  for (var i = 0; i < slotCount; i++) {
    var centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + i * slotHitboxLength;
    renderRoundRect(centerX - slotDisplayLength / 2 - petalOutlineWidth, centerY - slotDisplayLength / 2 - petalOutlineWidth, slotDisplayLength + petalOutlineWidth * 2, slotDisplayLength + petalOutlineWidth * 2, hpx * 1, true, true, true, true);
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

  if (me.petalSync) {
    if (secondarySlotCount < me.secondaryPetals.length) {
      secondarySlotCount = me.secondaryPetals.length;
    }
    while (secondaryPetals.length < me.secondaryPetals.length) {
      var _p = new _petal.Petal(0, 0, me.secondaryPetals[secondaryPetals.length].type);
      secondaryPetals.push(_p);
    }
  }
  slotCount = secondarySlotCount;
  slotDisplayLength = secondarySlotDisplayLength * hpx;
  slotHitboxLength = secondarySlotHitboxLength * hpx;
  centerY = secondarySlotCenterY * hpx;
  petalOutlineWidth = slotDisplayLength * PETAL_OUTLINE_WIDTH_PERCENTAGE;
  for (var _i = 0; _i < slotCount; _i++) {
    var _centerX = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i * slotHitboxLength;
    renderRoundRect(_centerX - slotDisplayLength / 2 - petalOutlineWidth, centerY - slotDisplayLength / 2 - petalOutlineWidth, slotDisplayLength + petalOutlineWidth * 2, slotDisplayLength + petalOutlineWidth * 2, hpx * 1, true, true, true, true);
    ctx.strokeStyle = 'rgba(207, 207, 207, 0.7)';
    ctx.lineWidth = petalOutlineWidth * 2;
    ctx.stroke();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(_centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(_centerX - slotDisplayLength / 2, centerY - slotDisplayLength / 2, slotDisplayLength, slotDisplayLength);
  }

  // primary

  slotCount = primarySlotCount;
  slotDisplayLength = primarySlotDisplayLength * hpx;
  slotHitboxLength = primarySlotHitboxLength * hpx;
  centerY = primarySlotCenterY * hpx;
  for (var _i2 = 0; _i2 < slotCount; _i2++) {
    var _centerX2 = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i2 * slotHitboxLength;
    if (!primaryPetals[_i2].animating) {
      primaryPetals[_i2].setTargetPos(_centerX2, centerY);
      primaryPetals[_i2].setTargetSize(1);
      if (me.petalSync) {
        primaryPetals[_i2].setType(me.primaryPetals[_i2]);
      }
      primaryPetals[_i2].render(slotDisplayLength);
    }
  }
  for (var _i3 = 0; _i3 < slotCount; _i3++) {
    if (primaryPetals[_i3].animating) {
      primaryPetals[_i3].render(slotDisplayLength);
    }
  }

  // secondary

  slotCount = secondarySlotCount;
  slotDisplayLength = secondarySlotDisplayLength * hpx;
  slotHitboxLength = secondarySlotHitboxLength * hpx;
  centerY = secondarySlotCenterY * hpx;
  for (var _i4 = 0; _i4 < slotCount; _i4++) {
    var _centerX3 = W / 2 - slotHitboxLength * (slotCount / 2 - 0.5) + _i4 * slotHitboxLength;
    if (!secondaryPetals[_i4].animating) {
      secondaryPetals[_i4].setTargetPos(_centerX3, centerY);
      secondaryPetals[_i4].setTargetSize(1);
      if (me.petalSync) secondaryPetals[_i4].setType(me.secondaryPetals[_i4]);
      secondaryPetals[_i4].render(slotDisplayLength);
    }
  }
  for (var _i5 = 0; _i5 < slotCount; _i5++) {
    if (secondaryPetals[_i5].animating) {
      secondaryPetals[_i5].render(slotDisplayLength);
    }
  }
}
function renderCmdLog() {
  var len = cmdLog.length;
  var rightAlign = 990 * wpx;
  var fontSize = 15 * hpx;
  var spaceBetween = 5 * hpx;
  var alpha = 0.9;
  ctx.lineWidth = fontSize * 0.125;
  ctx.font = "".concat(fontSize, "px Ubuntu");
  ctx.textAlign = "right";
  ctx.globalAlpha = alpha;
  for (var i = len - 1; i >= Math.max(0, len - cmdMaxLineCnt); i--) {
    // ctx.strokeText(cmdLog[i], rightAlign, (900 - (len - i) * (spaceBetween + fontSize)) * hpx, fontSize);
    var text = cmdLog[i];
    var x = rightAlign;
    var y = 900 * hpx - (len - i) * (spaceBetween + fontSize);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = cmdColor;
    ctx.fillText(text, x, y);
  }
  ctx.globalAlpha = 1;
}
function renderInfo(info) {
  // state.info
  renderText(0.7, "real_florrio", hpx * 85, hpx * 45, hpx * 40, 'center');
  renderText(1, "MSPT: ".concat(info.mspt), W - hpx * 10, H - hpx * 15, hpx * 10, 'right');
  renderText(1, "Mob Count: ".concat(info.mobCount), W - hpx * 10, H - hpx * 30, hpx * 10, 'right');
  renderText(1, "Mob Volume Taken: ".concat(info.mobVol), W - hpx * 10, H - hpx * 45, hpx * 10, 'right');
}
function select(isPrimary, slot, x, y) {
  var petal;
  if (isPrimary) {
    petal = primaryPetals[slot];
  } else {
    petal = secondaryPetals[slot];
  }
  petal.animating = true;
  petal.swing = true;
  petal.setTargetPos(x, y);
  petal.setTargetSize(selectedSize);
}
function deSelect(isPrimary, slot) {
  var petal;
  var slotHitboxLength, slotCount, slotCenterY;
  if (isPrimary) {
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
function target(isPrimary, slot, targetIsPrimary, targetSlot) {
  var petal;
  var slotHitboxLength, slotCount, slotCenterY;
  var defaultSize, targetSize;
  if (isPrimary) {
    petal = primaryPetals[slot];
    defaultSize = primarySlotDisplayLength;
  } else {
    petal = secondaryPetals[slot];
    defaultSize = secondarySlotDisplayLength;
  }
  if (targetIsPrimary) {
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
function drag(isPrimary, slot, x, y) {
  var petal;
  if (isPrimary) {
    petal = primaryPetals[slot];
  } else {
    petal = secondaryPetals[slot];
  }
  petal.setTargetPos(x, y);
  if (!petal.swing) {
    petal.swing = true;
    petal.setTargetSize(selectedSize);
  }
}
function switchPetals(isPrimary, slot, targetIsPrimary, targetSlot) {
  var petalA, petalB;
  if (isPrimary) {
    petalA = primaryPetals[slot];
  } else {
    petalA = secondaryPetals[slot];
  }
  if (targetIsPrimary) {
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
  var tmp = petalA.type;
  petalA.type = petalB.type;
  petalB.type = tmp;
  tmp = petalA.x;
  petalA.x = petalB.x;
  petalB.x = tmp;
  tmp = petalA.y;
  petalA.y = petalB.y;
  petalB.y = tmp;
}
function setPetalPosition() {
  if (primaryPetals[0]) {
    for (var i = 0; i < primarySlotCount; i++) {
      primaryPetals[i].defaultX = W / 2 - primarySlotHitboxLength * hpx * (primarySlotCount / 2 - 0.5) + i * primarySlotHitboxLength * hpx;
      primaryPetals[i].defaultY = primarySlotCenterY * hpx;
    }
    for (var _i6 = 0; _i6 < secondarySlotCount; _i6++) {
      secondaryPetals[_i6].defaultX = W / 2 - secondarySlotHitboxLength * hpx * (secondarySlotCount / 2 - 0.5) + _i6 * secondarySlotHitboxLength * hpx;
      secondaryPetals[_i6].defaultY = secondarySlotCenterY * hpx;
    }
  }
}