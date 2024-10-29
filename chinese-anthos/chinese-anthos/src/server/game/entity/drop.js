import Entity from './entity.js';
import Constants from '../../shared/constants.js';

class Drop extends Entity {
	constructor(id, x, y, type, existTime) {
		super(id, x, y, 'drop', 'drop', type, 1, 1, false);
		this.existTime = existTime || 2.5;
		this.attributes = {};
		this.attributes.RADIUS = Constants.DROP_SIZE;
		this.actionTime = Constants.DROP_ACTION_TIME;
	}
	
	updateMovement(deltaT) {
		this.actionTime -= deltaT;
		this.direction += 62.8 * deltaT;
		if (this.actionTime < 0) {
			this.direction = 0;
			this.movement = {
				direction: 0,
				speed: 0,
			};
		}
	}
	
	updateChunks() {
		return super.updateChunks(Constants.DROP_SIZE);
	}
	
	handleBorder() {
		super.handleBorder(Constants.DROP_SIZE);
	}

	serializeForUpdate() {
		return {
			...(super.serializeForUpdate()),
			type: this.type,
		}
	}
}

export default Drop;