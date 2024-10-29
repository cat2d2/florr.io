import Constants from '../../../shared/constants.js';

class Entity {
	constructor(id, x, y, team, generalType, type, hp, maxHp, noBorderCollision) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.team = team;
		this.generalType = generalType;
		this.type = type;
		this.hp = hp;
		this.maxHp = maxHp;
		this.store = 0;
		this.direction = 0;
		this.hurtByInfo = {
			type: -1,
			id: -1,
		};
		this.isHurt = false;
		this.velocity = {
			x: 0,
			y: 0,
		};
		this.constraintVelocity = {
			x: 0,
			y: 0,
		}
		this.chunks = [];
		this.noBorderCollision = noBorderCollision;
		this.movement = {
			direction: 0,
			speed: 0,
		};
		this.puncture = 0;
		this.fragile = 0;
		this.direction = 0;
		this.skillCoolDown = 0;
		this.skillCoolDownTimer = 0;
		this.poison = 0;
		this.poisonTime = 0;
		this.segments = [this.id];
	}

	distanceTo(object) {
		const deltaX = this.x - object.x;
		const deltaY = this.y - object.y;
		return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
	}
	
	handleBorder(objectRadius) {
		if ( !this.noBorderCollision ) {
			if ( this.x < objectRadius ){ // hit left border
				this.velocity.x = 0;
				this.x = objectRadius;
			} else if ( this.x > Constants.MAP_WIDTH - objectRadius ) { // hit right border
				this.velocity.x = 0;
				this.x = Constants.MAP_WIDTH - objectRadius;
			}
			if ( this.y < objectRadius ){ // hit top border
				this.velocity.y = 0;
				this.y = objectRadius;
			} else if ( this.y > Constants.MAP_HEIGHT - objectRadius ) { // hit bottom border
				this.velocity.y = 0;
				this.y = Constants.MAP_HEIGHT - objectRadius;
			}
		}
	}

	updateVelocity(deltaT) {
		this.velocity.x *= Constants.SPEED_ATTENUATION_COEFFICIENT;
		this.velocity.y *= Constants.SPEED_ATTENUATION_COEFFICIENT;
		const speedX = this.movement.speed * Math.sin(this.movement.direction);
		const speedY = this.movement.speed * Math.cos(this.movement.direction);
		this.velocity.x += speedX;
		this.velocity.y += speedY;
	}

	applyVelocity(deltaT) {
		this.x += deltaT * this.velocity.x;
		this.y -= deltaT * this.velocity.y;
	}

	applyConstraintVelocity(deltaT) {
		this.x += this.constraintVelocity.x * deltaT;
		this.y -= this.constraintVelocity.y * deltaT;
		this.constraintVelocity = {
			x: 0,
			y: 0,
		};
	}

	updateChunks(radius) {
		const chunksNew = [];

		const chunkRadius = Math.ceil(radius / Constants.CHUNK_SIZE + 1);

		const baseChunk = {
			x: Math.floor(this.x / Constants.CHUNK_SIZE),
			y: Math.floor(this.y / Constants.CHUNK_SIZE),
		}

		var chunkX = baseChunk.x - chunkRadius, chunkY = baseChunk.y - chunkRadius;

		while ( chunkX <= baseChunk.x + chunkRadius && chunkY <= baseChunk.y + chunkRadius ) {
			if ( chunkX < baseChunk.x + chunkRadius ) {
				chunkX ++;
			} else if ( chunkY < baseChunk.y + chunkRadius ) {
				chunkX = baseChunk.x - chunkRadius;
				chunkY ++;
			} else {
				break;
			}
			if( chunkX < 0 || chunkY < 0 )
				continue;
			if ( chunkX == baseChunk.x ) {
				if ( chunkY > baseChunk.y ) {
					if ( chunkY * Constants.CHUNK_SIZE <= this.y + radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				} else {
					if ( (chunkY + 1) * Constants.CHUNK_SIZE >= this.y - radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				}
			} else if ( chunkY == baseChunk.y ) {
				if ( chunkX > baseChunk.x ) {
					if ( chunkX * Constants.CHUNK_SIZE <= this.x + radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				} else if ( chunkX < baseChunk.x ){
					if ( (chunkX + 1) * Constants.CHUNK_SIZE >= this.x - radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				}
			} else {
				if ( chunkX > baseChunk.x && chunkY > baseChunk.y ) {
					const deltaX = chunkX * Constants.CHUNK_SIZE - this.x;
					const deltaY = chunkY * Constants.CHUNK_SIZE - this.y;
					if ( Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				} else if ( chunkX > baseChunk.x && chunkY < baseChunk.y ) {
					const deltaX = chunkX * Constants.CHUNK_SIZE - this.x;
					const deltaY = (chunkY + 1) * Constants.CHUNK_SIZE - this.y;
					if ( Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				} else if ( chunkX < baseChunk.x && chunkY > baseChunk.y ) {
					const deltaX = (chunkX + 1) * Constants.CHUNK_SIZE - this.x;
					const deltaY = chunkY * Constants.CHUNK_SIZE - this.y;
					if ( Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				} else {
					const deltaX = (chunkX + 1) * Constants.CHUNK_SIZE - this.x;
					const deltaY = (chunkY + 1) * Constants.CHUNK_SIZE - this.y;
					if ( Math.sqrt(deltaX * deltaX + deltaY * deltaY) <= radius ) {
						chunksNew.push({x: chunkX, y: chunkY});
					}
				}
			}
		}
		const chunksOld = [];
		this.chunks.forEach(chunkOld => {
			chunksOld.push(chunkOld);
		});
		this.chunks = [];
		chunksNew.forEach(chunkNew => {
			this.chunks.push(chunkNew);
		});
		return {
			chunksOld: chunksOld, 
			chunksNew: chunksNew,
		};
	}

	serializeForUpdate() { // get necessary data and send to client
		return {
			id: this.id,
			x: this.x,
			y: this.y,
			hp: this.hp,
			dir: this.direction,
			isHurt: this.isHurt,
		};
	}
}

export default Entity;