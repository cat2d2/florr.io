import Entity from './entity.js';
import EntityAttributes from '../../../public/entity_attributes.js';
import Constants from '../../shared/constants.js';

class Mob extends Entity {
	constructor(id, x, y, type, team, noBorderCollision, isProjectile, existTime, size) {
		super(id, x, y, team, 'mob', type, EntityAttributes[type].MAX_HP, EntityAttributes[type].MAX_HP, noBorderCollision)
		this.attributes = JSON.parse(JSON.stringify(EntityAttributes[type]));
		this.existTime = existTime || Infinity;
		this.sensitization = false;
		this.target = -1;
		this.idleMovementCooldown = 0;
		this.isProjectile = isProjectile || false;
		this.startDirection = 0;
		this.maxCloseLength = this.attributes.MAX_CLOSE_LENGTH || 0;
		this.skillCoolDown = this.attributes.SKILL_COOLDOWN || 0;
		this.aimMovementDirection = 0.01;
		this.isSkillenable = false;
		this.isEinstein = false;
		this.idleMode = EntityAttributes[type].IDLE_MODE;
		this.suffocateTime = 0;
		if (Math.random() <= 0.5) {
			this.aimMovementDirection = -0.01;
		}
		if (Math.random() <= 0.5 && EntityAttributes[type].TRIGGERS.SHOOT) {
			this.isEinstein = true;
		}
		
		if (this.attributes.ATTACK_MODE == `STATIC`) {
			this.updateMovement = (deltaT) => {};
			this.idle = (deltaT,parent) => {};
		} 
		else if (this.attributes.ATTACK_MODE == `PROJECTILE`) {
			this.noBorderCollision = true;
			this.updateMovement = (deltaT) => {
				this.velocity.x /= Constants.SPEED_ATTENUATION_COEFFICIENT;
				this.velocity.y /= Constants.SPEED_ATTENUATION_COEFFICIENT;
			};
			this.idle = (deltaT,parent) => {};
		} 
		else if (this.attributes.ATTACK_MODE == `PEACE`) {
			this.updateMovement = (deltaT,parent) => {};
		} 
		else if (this.attributes.ATTACK_MODE == `NEUTRAL`) {
			this.updateMovement = (deltaT,target) => {
				//拥有攻击目标则开始追杀
				if (target) {
					this.movement = {
						direction: Math.atan2(target.x - this.x, this.y - target.y),
						speed: this.attributes.SPEED,
					};
				} else {
					this.movement.speed = 0;
				}
			};
		} 
		else if (this.attributes.ATTACK_MODE == `EVIL`) {
			this.updateMovement = (deltaT, target) => {
				if (!target) return;
				
				//绕圈
				let distanceToTarget = Math.sqrt((target.x - this.x) ** 2 + (target.y - this.y) ** 2);
				if (distanceToTarget - this.attributes.RADIUS - target.attributes.RADIUS <= this.maxCloseLength) {
					let atan = Math.atan2(this.x - target.x, target.y - this.y) + this.aimMovementDirection;
					let goalPos = {
						x: target.x + distanceToTarget * Math.sin(atan),
						y: target.y - distanceToTarget * Math.cos(atan),
					};
					this.movement = {
						direction: Math.atan2(goalPos.x - this.x, this.y - goalPos.y),
						speed: this.attributes.SPEED / 5,
					};
					
					this.isSkillenable = true;
					return;
				}
				
				this.movement = {
					direction: Math.atan2(target.x - this.x, this.y - target.y),
					speed: this.attributes.SPEED,
				};
				this.isSkillenable = false;
			};
		}
	}
	
	idle(deltaT,parent) {
		//首次受到攻击时更改攻击目标
		if (this.attributes.ATTACK_MODE != `PEACE`) {
			if (this.hurtByInfo.id.playerID) { //player
				this.target = this.hurtByInfo.id.playerID;
			} else if (this.hurtByInfo.id != -1) { //mob
				this.target = this.hurtByInfo.id;
			}
		}
		
		if (this.idleMode == `STATIC`) {
			return;
		}
		else if (this.idleMode == `NORMAL`) {
			this.isSkillenable = false;
			
			if (parent && this.distanceTo(parent) > Constants.MOB_IDLE_RADIUS) {
				this.idleMovementCooldown = 0;
				this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
				this.movement = {
					direction: this.direction,
					speed: this.attributes.SPEED,
				};
				return;
			}
			
			this.idleMovementCooldown -= deltaT;
			if (this.idleMovementCooldown > 0) {
				this.movement = {
					direction: this.direction,
					speed: Math.max(0,this.movement.speed -= this.movement.speed / this.idleMovementCooldown / 2),
				};
				return;
			};
			
			let center = {
				x: 0,
				y: 0,
			};
			if (parent) {
				center.x = parent.x;
				center.y = parent.y;
			} else {
				center.x = this.x;
				center.y = this.y;
			}
			
			const atan = Math.random() * Math.PI * 2;
			const idleRadius = Constants.MOB_IDLE_RADIUS / 2;
			this.idleMovementGoalPos = {
				x: center.x + idleRadius * Math.sin(atan),
				y: center.y + idleRadius * Math.cos(atan),
			};
			const direction = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y)
			this.movement = {
				direction: direction,
				speed: this.attributes.SPEED,
			};
			this.direction = direction;
			
			this.idleMovementCooldown = Constants.MOB_IDLE_MOVEMENT_COOLDOWN;
		} else if (this.idleMode == `FLOAT`) {
			this.isSkillenable = false;
			
			if (parent && this.distanceTo(parent) > Constants.MOB_IDLE_RADIUS) {
				this.idleMovementCooldown = 0;
				this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
				this.movement = {
					direction: this.direction,
					speed: this.attributes.SPEED,
				};
				return;
			}
			
			this.idleMovementCooldown -= deltaT;
			if (this.idleMovementCooldown > 0) {
				this.direction = this.startDirection + Math.cos(this.idleMovementCooldown * Math.PI) / 2;
				this.movement = {
					direction: this.direction,
					speed: this.attributes.SPEED / 8,
				};
				return;
			};
			
			let center = {
				x: 0,
				y: 0,
			};
			if (parent) {
				center.x = parent.x;
				center.y = parent.y;
			} else {
				center.x = this.x;
				center.y = this.y;
			}
			
			const atan = Math.random() * Math.PI * 2;
			const idleRadius = Constants.MOB_IDLE_RADIUS / 2;
			this.idleMovementGoalPos = {
				x: center.x + idleRadius * Math.sin(atan),
				y: center.y + idleRadius * Math.cos(atan),
			};
			const direction = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y)
			this.movement = {
				direction: direction,
				speed: this.attributes.SPEED / 8,
			};
			this.startDirection = direction;
			
			this.idleMovementCooldown = Constants.MOB_IDLE_MOVEMENT_COOLDOWN;
		} else if (this.idleMode == `FLOAT_SLOW`) {
			this.isSkillenable = false;
			
			if (parent && this.distanceTo(parent) > Constants.MOB_IDLE_RADIUS) {
				this.idleMovementCooldown = 0;
				this.direction = Math.atan2(parent.x - this.x, this.y - parent.y);
				this.movement = {
					direction: this.direction,
					speed: this.attributes.SPEED,
				};
				return;
			}
			
			this.idleMovementCooldown -= deltaT;
			if (this.idleMovementCooldown > 0) {
				this.direction = this.startDirection + Math.cos(this.idleMovementCooldown / 16 * Math.PI) / 2;
				this.movement = {
					direction: this.direction,
					speed: this.attributes.SPEED / 12,
				};
				return;
			};
			
			let center = {
				x: 0,
				y: 0,
			};
			if (parent) {
				center.x = parent.x;
				center.y = parent.y;
			} else {
				center.x = this.x;
				center.y = this.y;
			}
			
			const atan = this.direction + Math.floor(Math.random() * 2 + 1) - 1;
			const idleRadius = Constants.MOB_IDLE_RADIUS / 2;
			this.idleMovementGoalPos = {
				x: center.x + idleRadius * Math.sin(atan),
				y: center.y + idleRadius * Math.cos(atan),
			};
			const direction = Math.atan2(this.idleMovementGoalPos.x - this.x, this.y - this.idleMovementGoalPos.y)
			this.movement = {
				direction: direction,
				speed: this.attributes.SPEED / 12,
			};
			this.startDirection = direction;
			
			this.idleMovementCooldown = Constants.MOB_IDLE_MOVEMENT_COOLDOWN * 32;
		}
	}
	
	connectTo(target) {
		if (target) {
			const direction = Math.atan2(target.x - this.x, this.y - target.y);
			let distance = Math.sqrt((this.x - target.x) ** 2 + (this.y - target.y) ** 2) - this.attributes.RADIUS - target.attributes.RADIUS;
			//if (!target.attributes.IS_SEGMENT) distance -= 7;
			this.x += distance * Math.sin(direction); 
			this.y -= distance * Math.cos(direction); 
			this.direction = direction;
		}
	}
	
	aimAt(target) {
		if (this.isEinstein) {
			const x1 = target.x, x2 = this.x, y1 = target.y, y2 = this.y, v1 = target.movement.speed, v2 = EntityAttributes[this.attributes.TRIGGERS.SHOOT].SPEED - EntityAttributes[this.attributes.TRIGGERS.SHOOT].RADIUS * 2, n1 = target.movement.direction;
			const acos = Math.atan2(target.x - this.x, this.y - target.y) + this.direction < this.direction ? -Math.acos((v1 / v2) * Math.cos(n1 + Math.atan((y2 - y1) / (x1 - x2)))) : Math.acos((v1 / v2) * Math.cos(n1 + Math.atan((y2 - y1) / (x1 - x2)))); //决定正反
			this.direction = acos - Math.atan((y2 - y1) / (x1 - x2));
		} else {
			this.direction = Math.atan2(target.x - this.x, this.y - target.y);
		}
	}
	
	updateChunks() {
		return super.updateChunks(this.attributes.RADIUS);
	}
	
	handleBorder() {
		super.handleBorder(this.attributes.RADIUS);
	}

	serializeForUpdate() {
		return {
			...(super.serializeForUpdate()),
			type: this.type,
			activeDirection: this.activeDirection,
			radius: this.attributes.RADIUS,
			size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
		}
	}
}

export default Mob;