import Entity from './entity.js';
import PetalAttributes from '../../../../public/petal_attributes.js';

class Petal extends Entity {
	constructor(id, idx, placeHolder, x, y, parent, type, noBorderCollision, idInPlaceHolder, slot) {
		super(id, x, y, parent, 'petal', type, PetalAttributes[type].MAX_HP, PetalAttributes[type].MAX_HP, noBorderCollision);
		this.idx = idx;
		this.parent = parent;
		this.attributes = PetalAttributes[type];
		this.disabled = false;
		this.cooldown = 0;
		this.inCooldown = false;
		this.action = false;
		this.actionTime = 0;
		this.isHide = false;
		this.mob = [];
		this.placeHolder = placeHolder;
		this.idInPlaceHolder = idInPlaceHolder || 0; //多子花瓣在同花瓣位置的编号
		this.slot = slot; 
		// placeHolder: -1 -> projectile
		if ( this.attributes.TRIGGERS.ACTION_COOLDOWN ) {
			this.actionCooldown = this.attributes.TRIGGERS.ACTION_COOLDOWN;
		} else {
			this.actionCooldown = -1;
		}
		this.direction = 0;
		
		//翅膀
		this.floatRadius = 0;
		this.floatDirection = 0;
	}

	updateAttributes() {
		this.attributes = PetalAttributes[this.type];
	}

	serializeForUpdate() {
		return {
			...(super.serializeForUpdate()),
			size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
			radius: this.attributes.RADIUS,
			type: this.type,
			dir: this.direction,
			isHide: this.isHide,
		};
	}
}

export default Petal;