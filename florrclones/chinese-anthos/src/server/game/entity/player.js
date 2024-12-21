import Entity from './entity.js';
import Constants from '../../../shared/constants.js';
import EntityAttributes from '../../../../public/entity_attributes.js';
import PetalAttributes from '../../../../public/petal_attributes.js';
const Attribute = EntityAttributes.PLAYER;
import Petal from './petal.js';
import cryptoRandomString from 'crypto-random-string';

class Player extends Entity {
	constructor(id, socketID, username, x, y, team) {
		super(id, x, y, team, 'mob', 'PLAYER', EntityAttributes.PLAYER.MAX_HP_BASE, EntityAttributes.PLAYER.MAX_HP_BASE, false);
		this.socketID = socketID;
		this.username = username;
		this.score = 1;
		this.haveRankOnLeaderboard = false;
		this.exp = 0;
		this.totalExp = 0;
		this.level = 1;
		this.currentExpForLevel = this.getExpForLevel(this.level);
		this.rotationSpeed = Constants.PETAL_ROTATION_SPEED_BASE;
		this.firstPetalDirection = 0;
		this.rotateClockwise = 1; // 1 for clockwise, -1 for counter-clockwise
		this.suffocateTime = 0;
		this.oxygen = Constants.PLAYER_OXYGEN;
		this.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_NORMAL;
		this.slotCount = Constants.PRIMARY_SLOT_COUNT_BASE;
		this.placeHolder = Constants.PRIMARY_SLOT_COUNT_BASE; // how many places are there
		this.petalID = Constants.FIRST_PETAL_ID;
		this.primaryPetals = [];
		this.secondaryPetals = [];
		this.petals = [];

		this.primaryPetals[0] = 'BASIC';
		this.primaryPetals[1] = 'BASIC';
		this.primaryPetals[2] = 'BASIC';
		this.primaryPetals[3] = 'BASIC';
		this.primaryPetals[4] = 'BASIC';

		this.secondaryPetals[0] = 'EMPTY';
		this.secondaryPetals[1] = 'EMPTY';
		this.secondaryPetals[2] = 'EMPTY';
		this.secondaryPetals[3] = 'EMPTY';
		this.secondaryPetals[4] = 'EMPTY';
		
		for (let i = 0; i < Constants.PRIMARY_SLOT_COUNT_BASE; i ++ ) {
			let petals = [];
			for (let o = 0; o < PetalAttributes[this.primaryPetals[i]].COUNT; o++) {
				const petal = this.newPetal(this.primaryPetals[i], i * Constants.PETAL_MULTIPLE_MAX + o, i * Constants.PETAL_MULTIPLE_MAX + o, i, o, i, this.x, this.y);
				petals.push(petal);
			}
			this.petals.push(petals);
		}
		this.updatePlaceHolder();
		
		this.pets = {};
		this.activeDirection = 0;
		this.attributes = Attribute;
		this.attack = false;
		this.defend = false;
		this.bubbleVelocity = {
			x: 0,
			y: 0,
		};
		// this.switched = true; // 这一刻是否进行交换操作
		this.noHeal = 0; // 剩余禁用回血时间
		this.poison = 0; // 中毒每秒毒伤
		this.poisonTime = 0; // 剩余中毒时间
		this.bodyToxicity = 0; // 碰撞毒秒伤
		this.bodyPoison = 0; // 碰撞毒总伤
		this.damageReflect = 0.000; // 反伤
		this.vision = 1.0;
		this.petalSyncTimer = Constants.PETAL_SYNC_INTERVAL;
		
		this.updatePetalSlot();
	}

	disablePetal(slot) {
		let petals = this.petals[slot];
		petals.forEach((petal) => {
			petal.disabled = true;
			petal.inCooldown = true;
			petal.cooldown = petal.attributes.RELOAD;
		})
	}

	switchPetals(slot1, slot2) {
		let tmp;
		if ( slot1 != -1 ) {
			if ( (!slot1.isPrimary) && slot2.isPrimary ) {
				tmp = slot1;
				slot1 = slot2;
				slot2 = tmp;
			}
			if ( slot1.isPrimary && slot2.isPrimary ) {
				tmp = this.primaryPetals[slot1.slot];
				this.primaryPetals[slot1.slot] = this.primaryPetals[slot2.slot];
				this.primaryPetals[slot2.slot] = tmp;
				let petalA = this.petals.find(ptl => (ptl[0].slot == slot1.slot)),
					petalB = this.petals.find(ptl => (ptl[0].slot == slot2.slot)),
					petalA_type = this.primaryPetals[slot2.slot],
					petalB_type = this.primaryPetals[slot1.slot];
				tmp = petalA[0].placeHolder;
				//petalA
				//目标花瓣数量是否大于自身数量，是就增加花瓣位
				if (PetalAttributes[petalB_type].COUNT > petalA.length) {
					let times = PetalAttributes[petalB_type].COUNT - petalA.length;
					for (let i = 0; i < times; i++) {
						let petal = this.newPetal(petalB_type, this.getNewPetalID(), petalA[petalA.length - 1].idx + 1, petalB[0].placeHolder, 0);
						petalA.push(petal);
					}
				}

				//目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
				if (PetalAttributes[petalB_type].COUNT < petalA.length) {
					petalA.splice(PetalAttributes[petalB_type].COUNT,Constants.PETAL_MULTIPLE_MAX);
				}
				
				//刷新花瓣属性
				petalA.forEach((petal,index) => {
					petal.isHide = false;
					petal.idInPlaceHolder = index;
					petal.disabled = false;
					petal.type = this.primaryPetals[slot1.slot];
					petal.updateAttributes();
					petal.cooldown = petal.attributes.RELOAD;
					petal.inCooldown = true;
				})
				this.petals.forEach((petals) => {
					petals.forEach((petal) => {
						if (petal.type == `EMPTY`) {
							petal.isHide = true;
						}
					})
				})
				
				//petalB
				//目标花瓣数量是否大于自身数量，是就增加花瓣位
				if (PetalAttributes[petalA_type].COUNT > petalB.length) {
					let times = PetalAttributes[petalA_type].COUNT - petalB.length;
					for (let i = 0; i < times; i++) {
						let petal = this.newPetal(petalA_type, this.getNewPetalID(), petalB[petalB.length - 1].idx + 1, tmp, 0);
						petalB.push(petal);
					}
				}

				//目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
				if (PetalAttributes[petalA_type].COUNT < petalB.length) {
					petalB.splice(PetalAttributes[petalA_type].COUNT,Constants.PETAL_MULTIPLE_MAX);
				}
				
				//刷新花瓣属性
				petalB.forEach((petal,index) => {
					petal.isHide = false;
					petal.idInPlaceHolder = index;
					petal.disabled = false;
					petal.type = this.primaryPetals[slot2.slot];
					petal.updateAttributes();
					petal.cooldown = petal.attributes.RELOAD;
					petal.inCooldown = true;
				})
				this.petals.forEach((petals) => {
					petals.forEach((petal) => {
						if (petal.type == `EMPTY`) {
							petal.isHide = true;
						}
					})
				})
				this.updatePlaceHolder();
				this.updatePetalSlot();
			} else if ( slot1.isPrimary && (!slot2.isPrimary) ) {
				tmp = this.primaryPetals[slot1.slot];
				this.primaryPetals[slot1.slot] = this.secondaryPetals[slot2.slot];
				this.secondaryPetals[slot2.slot] = tmp;
				let petalA = this.petals.find(ptl => (ptl[0].slot == slot1.slot));
				
				//目标花瓣数量是否大于自身数量，是就增加花瓣位
				if (PetalAttributes[this.primaryPetals[slot1.slot]].COUNT > petalA.length) {
					let times = PetalAttributes[this.primaryPetals[slot1.slot]].COUNT - petalA.length;
					for (let i = 0; i < times; i++) {
						let petal = this.newPetal(petalA[0].type, this.getNewPetalID(), petalA[petalA.length - 1].idx + 1, petalA[0].placeHolder, petalA[0].slot);
						petalA.push(petal);
					}
				}
				
				//目标花瓣数量是否小于自身数量，是就删除多出的花瓣位
				if (PetalAttributes[this.primaryPetals[slot1.slot]].COUNT < petalA.length) {
					petalA.splice(PetalAttributes[this.primaryPetals[slot1.slot]].COUNT,Constants.PETAL_MULTIPLE_MAX);
				}			
				
				//刷新花瓣属性
				petalA.forEach((petal,index) => {
					petal.isHide = false;
					petal.idInPlaceHolder = index;
					petal.disabled = false;
					petal.type = this.primaryPetals[slot1.slot];
					petal.updateAttributes();
					petal.cooldown = petal.attributes.RELOAD;
					petal.inCooldown = true;
				})
				this.petals.forEach((petals) => {
					petals.forEach((petal) => {
						if (petal.type == `EMPTY`) {
							petal.isHide = true;
						}
					})
				})
				this.updatePlaceHolder();
				this.updatePetalSlot();
			} else {
				tmp = this.secondaryPetals[slot1.slot];
				this.secondaryPetals[slot1.slot] = this.secondaryPetals[slot2.slot];
				this.secondaryPetals[slot2.slot] = tmp;
			}
		}
		
		//检测是否有空花瓣&更新最大花瓣位置
		/*
		this.placeHolder = 0;
		this.petals.forEach((petal,index) => {
			petal.placeHolder = index;
		})
		this.petals.forEach((petal,index) => {
			console.log(petal)
			if (petal.type === `NONE`) {
				for (let i = index; i < this.petals.length; ++i) {
					this.petals[i].placeHolder--;
				}
				//console.log(index)
				return;
			};
			this.placeHolder++;
		})
		*/
	}
	
	updatePlaceHolder() {
		let placeHolder = 0;
		this.petals.forEach((petals) => {
			let petalHideNum = 0;
			let isCluster = true;
			petals.forEach((petal) => {
				if (petal.placeHolder == -1) {
					petalHideNum++
					return;
				}
				if (petal.isHide) petalHideNum++;
				petal.placeHolder = placeHolder;
				if (!petal.attributes.CLUSTER && !petal.isHide) {
					isCluster = false;
					placeHolder++;
				};
			})

			if (petalHideNum == petals.length) return;
			
			if (isCluster) {
				placeHolder++;
			}
		})
		this.placeHolder = placeHolder;
	}
	
	updatePetalSlot() {
		let slot = 0;
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if (petal.slot == -1 || petal.placeHolder == -1) return;
				petal.slot = slot;
			})
			slot++;
		})
	}

	updatePetalMovement(deltaT) {
		//console.log(this.petals[0])
		this.firstPetalDirection -= this.rotateClockwise * this.rotationSpeed * deltaT;
		if ( this.firstPetalDirection > 4 * Math.PI ) {
			this.firstPetalDirection -= 4 * Math.PI;
		}
		if ( this.firstPetalDirection < - 4 * Math.PI ) {
			this.firstPetalDirection += 4 * Math.PI;
		}
		
		this.petals.forEach((petals) => {
			petals.forEach((petal,index) => {
				if ( !petal.inCooldown ) {
					if (petal.attributes.TRIGGERS.PROJECTILE && petal.action ) {
						petal.movement = {
							direction: petal.direction,
							speed: petal.attributes.TRIGGERS.PROJECTILE,
						};
					} else {
						if (petal.attributes.TRIGGERS.PROJECTILE) {
							petal.direction = Math.atan2(petal.x - this.x, this.y - petal.y);
						} else{
							petal.direction += 0.1
						}
						const theta = this.firstPetalDirection + 2 * Math.PI * petal.placeHolder / this.placeHolder;
						let expandRadius = this.petalExpandRadius + this.attributes.RADIUS;
						if ( !petal.attributes.EXPANDABLE ) {
							expandRadius = Math.min(expandRadius, Constants.PETAL_EXPAND_RADIUS_NORMAL + this.attributes.RADIUS);
						}
						if ( petal.action ) {
							expandRadius = Math.min(expandRadius, this.attributes.RADIUS + petal.attributes.RADIUS);
						}
				
						if (petal.attributes.TRIGGERS.FLOAT) {
							if (this.attack) {
								petal.floatDirection += deltaT * petal.attributes.TRIGGERS.FLOAT / Constants.PETAL_FLOAT_SPEED;
								petal.floatRadius += deltaT * Math.cos(Math.PI / 2 + petal.floatDirection / petal.attributes.TRIGGERS.FLOAT * Math.PI) * petal.attributes.TRIGGERS.FLOAT / Constants.PETAL_FLOAT_SPEED;
								if (petal.floatDirection >= petal.attributes.TRIGGERS.FLOAT * 2) {
									petal.floatDirection = 0;
									petal.floatRadius = 0;
								}
								expandRadius -= petal.floatRadius;// + Math.cos(petal.floatDirection / (petal.attributes.TRIGGERS.FLOAT * 2) * Math.PI) * (Constants.PETAL_EXPAND_RADIUS_ATTACK / 2);
							} else{
								petal.floatRadius = 0;
								petal.floatDirection = 0;
							}
						}
						let offsetX = 0,
							offsetY = 0;
						if (petal.attributes.MULTIPLE && petal.attributes.CLUSTER) {
							offsetX = Constants.PETAL_MULTIPLE_OFFSET_DISTANCE * Math.sin(index / petal.attributes.COUNT * 2 * Math.PI + this.firstPetalDirection * 0.5);
							offsetY = Constants.PETAL_MULTIPLE_OFFSET_DISTANCE * Math.cos(index / petal.attributes.COUNT * 2 * Math.PI + this.firstPetalDirection * 0.5);
						}
						const goalPos = {
							x: this.x + expandRadius * Math.sin(theta) + offsetX,
							y: this.y + expandRadius * Math.cos(theta) + offsetY,
						};
						
						let followSpeed = 7.5 + this.rotationSpeed * expandRadius / 2 * deltaT;
						petal.movement = {
							direction: Math.atan2(goalPos.x - petal.x, petal.y - goalPos.y),
							speed: Math.sqrt(cryptoRandomString({length: 10, type: 'numeric'})) * followSpeed,
						};
						// * (1 - Constants.SPEED_ATTENUATION_COEFFICIENT) / deltaT
						// console.log(petal.velocity);
					}
				} else {
					if ( !petal.disabled ) {
						petal.cooldown -= deltaT;
						if ( petal.cooldown <= 0 ) {
							const theta = this.firstPetalDirection + 2 * Math.PI * petal.placeHolder / this.placeHolder;
							let startRadius = this.attributes.RADIUS;
							let offsetX = 0,
								offsetY = 0;
							if (petal.attributes.MULTIPLE && petal.attributes.CLUSTER) {
								offsetX = Constants.PETAL_MULTIPLE_OFFSET_DISTANCE * Math.sin(index / petal.attributes.COUNT * 2 * Math.PI + this.firstPetalDirection * 0.5);
								offsetY = Constants.PETAL_MULTIPLE_OFFSET_DISTANCE * Math.cos(index / petal.attributes.COUNT * 2 * Math.PI + this.firstPetalDirection * 0.5);
							}
							petals[index] = this.newPetal(petal.attributes.TYPE, this.getNewPetalID(), petal.idx, petal.placeHolder, petal.idInPlaceHolder, petal.slot, 
														this.x + startRadius * Math.sin(theta) + offsetX, this.y + startRadius * Math.cos(theta) + offsetY);
						}
					}
				}
			})
		})
	}

	newPetal(type, petalID, petalIDX, placeHolder, idInPlaceHolder, slot, x, y) {
		return new Petal(petalID, petalIDX, placeHolder, x, y, this.id, type, true, idInPlaceHolder, slot);
	}

	handleActiveMovement(activeMovement) { // handles active motion
		this.movement = activeMovement;
		this.activeDirection = activeMovement.direction;
	}

	update(deltaT) {
		this.needSwitchPetals = [];
		// console.log(this.primaryPetals, this.secondaryPetals);
		this.rotationSpeed = Constants.PETAL_ROTATION_SPEED_BASE; //初始化旋转速度
		this.rotateClockwise = 1; //初始化旋转方向
		this.noHeal = Math.max(0, this.noHeal - deltaT);
		this.poisonTime = Math.max(0, this.poisonTime - deltaT);
		if ( this.poisonTime > 0 )
			this.hp -= this.poison * deltaT;
		if ( this.hp < this.maxHp && (!this.noHeal) ) {
			this.hp += ((this.maxHp / 240) * deltaT);
			this.hp = Math.min(this.hp, this.maxHp);
		}
		
		if (this.oxygen < 0) {
			this.hp -= Constants.SUFFOCATE_DAMAGE_BASE * deltaT + this.suffocateTime * deltaT * Constants.SUFFOCATE_DAMAGE_IMPROVE;
		}
		
		const isAllYinYang = this.petals.every(petal => petal[0].attributes && petal[0].attributes.TYPE === `YINYANG`); //判断是否所有花瓣都为阴阳
		this.petals.forEach((petals, slot) => {
			petals.forEach((petal,index) => {
				if (!petal || !petal.attributes) return;
				
				//阴阳控制旋转部分
				if ( petal.attributes.TRIGGERS.ROTATION_SWITCH) {
					if (isAllYinYang && this.slotCount >= 8) {
						this.rotateClockwise = 5;
					} else if (this.rotateClockwise == 1) {
						this.rotateClockwise = -1;
					} else if (this.rotateClockwise == -1) {
						this.rotateClockwise = 0;
					} else if (this.rotateClockwise == 0) {
						this.rotateClockwise = 1;
					}
				}
				
				if ( petal.inCooldown ) return;
				
				if ( petal.attributes.TRIGGERS.ROTATION_ACCELERATE ) {
					this.rotationSpeed += petal.attributes.TRIGGERS.ROTATION_ACCELERATE;
					return;
				}
				if ( petal.attributes.TRIGGERS.HEAL_SUSTAIN ) {
					if ( this.hp < this.maxHp && (!this.noHeal) ) {
						this.hp += petal.attributes.TRIGGERS.HEAL_SUSTAIN * deltaT;
						this.hp = Math.min(this.hp, this.maxHp);
					}
					return;
				}
				
				if ( petal.attributes.TRIGGERS.HEAL ) {
					if ( this.hp >= this.maxHp || this.noHeal ) {
						petal.action = false;
						petal.actionTime = 0;
						return;
					}
					if ( petal.actionCooldown > 0 ) {
						petal.actionCooldown -= deltaT;
						return;
					}
					if ( !petal.action ) {
						petal.action = true;
						return;
					}
					if ( petal.actionTime < petal.attributes.TRIGGERS.ACTION_TIME ) {
						petal.actionTime += deltaT;
						return;
					}
					petal.hp = -1;
					this.hp += petal.attributes.TRIGGERS.HEAL;
					this.hp = Math.min(this.hp, this.maxHp);
					return;
				}
				
				// trigger projectile petals like missile, dandelion etc.
				if ( petal.attributes.TRIGGERS.PROJECTILE ) {
					if ( petal.actionCooldown > 0 ) {
						petal.actionCooldown -= deltaT;
						return;
					} 
					
					if ( petal.action ) {
						petal.actionTime += deltaT;
						if ( petal.actionTime >= petal.attributes.TRIGGERS.ACTION_TIME ) {
							petal.hp = -1;
						}
						return;
					}
					
					if ( this.attack ) {
						const projectile = this.newPetal(petal.type, this.getNewPetalID(), -1, -1, -1, this.x, this.y);
						projectile.action = true;
						projectile.x = petal.x;
						projectile.y = petal.y;
						projectile.direction = petal.direction;
						projectile.velocity = {
							x: petal.attributes.TRIGGERS.PROJECTILE / Constants.SPEED_ATTENUATION_COEFFICIENT * Math.sin(petal.direction),
							y: petal.attributes.TRIGGERS.PROJECTILE / Constants.SPEED_ATTENUATION_COEFFICIENT * Math.cos(petal.direction),
						};
						this.petals.push([projectile]);
						this.reload(petal.slot,index);
						return;
					}
				}
				
				if ( petal.attributes.TRIGGERS.SPLIT ) {
					if ( petal.actionCooldown > 0 ) {
						petal.actionCooldown -= deltaT;
						return;
					} 
					
					if ( petal.action ) {
						petal.actionTime += deltaT;
						if ( petal.actionTime >= petal.attributes.TRIGGERS.ACTION_TIME ) {
							petal.hp = -1;
						}
						return;
					}
					
					if ( this.attack ) {
						const firstDirection = Math.random() * Math.PI * 2;
						for (let i = 0; i < petal.attributes.TRIGGERS.SPLIT.COUNT; i++) {
							const direction = firstDirection + i / petal.attributes.TRIGGERS.SPLIT.COUNT * Math.PI * 2;
							const projectile = this.newPetal(petal.attributes.TRIGGERS.SPLIT.NAME, this.getNewPetalID(), -1, -1, -1, this.x, this.y);
							projectile.action = true;
							projectile.x = petal.x;
							projectile.y = petal.y;
							projectile.direction = direction;
							projectile.velocity = {
								x: petal.attributes.TRIGGERS.SPLIT.SPEED / Constants.SPEED_ATTENUATION_COEFFICIENT * Math.sin(direction),
								y: petal.attributes.TRIGGERS.SPLIT.SPEED / Constants.SPEED_ATTENUATION_COEFFICIENT * Math.cos(direction),
							};
							this.petals.push([projectile]);
						}
						this.reload(petal.slot,index);
						return;
					}
				}

				if ( petal.attributes.TRIGGERS.BUBBLE_PUSH ) { // trigger bubble
					if ( petal.actionCooldown > 0 ) {
						petal.actionCooldown -= deltaT;
						return;
					} 
					
					if ( this.defend ) {
						petal.hp = -1;
						const dir = this.firstPetalDirection + 2 * Math.PI * petal.placeHolder / this.placeHolder;
						const push = petal.attributes.TRIGGERS.BUBBLE_PUSH;
						this.bubbleVelocity.x -= push * Math.sin(dir);
						this.bubbleVelocity.y += push * Math.cos(dir);
						return;
					}
				}
				
				if ( this.defend ) { // defend trigger
					if ( petal.attributes.TRIGGERS.HEAL_SUSTAIN_DEFENCE ) {
						if ( this.hp < this.maxHp && (!this.noHeal) ) {
							this.hp += petal.attributes.TRIGGERS.HEAL_SUSTAIN_DEFENCE * deltaT;
							this.hp = Math.min(this.hp, this.maxHp);
						}
					}
				}
			})
		})
	}

	updateChunks() {
		return super.updateChunks(this.attributes.RADIUS);
	}
 
	updateMovement(deltaT) {
		this.updatePetalMovement(deltaT);
	}

	updateVelocity(deltaT) {
		super.updateVelocity(deltaT);
		this.bubbleVelocity.x *= Constants.BUBBLE_ATTENUATION_COEFFICIENT;
		this.bubbleVelocity.y *= Constants.BUBBLE_ATTENUATION_COEFFICIENT;
		if ( Math.sqrt(this.bubbleVelocity.x ** 2 + this.bubbleVelocity.y ** 2) <= 50 ) {
			this.bubbleVelocity = {
				x: 0,
				y: 0,
			};
		}
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( !petal.inCooldown ) {
					petal.updateVelocity(deltaT);
				}
			})
		})
	}

	applyVelocity(deltaT) {
		super.applyVelocity(deltaT);
		this.x += deltaT * this.bubbleVelocity.x;
		this.y -= deltaT * this.bubbleVelocity.y;
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( !petal.inCooldown ) {
					petal.applyVelocity(deltaT);
				}
			})
		})
	}
	
	applyConstraintVelocity(deltaT) {
		super.applyConstraintVelocity(deltaT);
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( !petal.inCooldown ) {
					petal.applyConstraintVelocity(deltaT);
				}
			})
		})
	}

	handleBorder() {
		super.handleBorder(this.attributes.RADIUS);
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( !petal.inCooldown ) {
					petal.handleBorder(petal.attributes.RADIUS);
				}
			})
		})
	}

	reload(slot, idInPlaceHolder) {
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if (petal.isHide) return;
				if (petal.slot == slot && petal.idInPlaceHolder == idInPlaceHolder) {
					petal.cooldown = petal.attributes.RELOAD;
					petal.inCooldown = true;
				}
			})
		})
	}

	getNewPetalID() {
		this.petalID ++;
		return this.petalID;
	}

	getExpForLevel(level) {
		const expCoeN = 10;
		const expCoeK = 8;
		const expCoeB = 1.1;
		// K * (B ^ L) + N
		return Math.floor(Math.pow(expCoeB, level) * expCoeK + expCoeN);
	}

	addExp(exp) {
		this.exp += exp;
		this.totalExp += exp;
		while ( this.exp >= this.currentExpForLevel ) {
			this.level ++;
			this.exp -= this.currentExpForLevel;
			this.currentExpForLevel = this.getExpForLevel(this.level);
			
			//更新槽位数量
			if (this.slotCount < 8) {
				this.slotCount = 5 + Math.floor(this.level / 15);
			}
		}
	}

	getPetalsForUpdate() {
		var petalsForUpdate = [];
		this.petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( !petal.inCooldown ) {
					petalsForUpdate.push(petal.serializeForUpdate());
				}
			})
		})
		return petalsForUpdate;
	}

	serializeForUpdate(self) { // get neccesary data and send to client
		if ( self ) {
			if ( this.petalSyncTimer <= 0  ) {
				this.petalSyncTimer = Constants.PETAL_SYNC_INTERVAL;
				return {
					...(super.serializeForUpdate()),
					score: this.score,
					hp: this.hp,
					maxHp: this.maxHp,
					radius: this.attributes.RADIUS,
					size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
					currentExpForLevel: this.currentExpForLevel,
					level: this.level,
					exp: this.exp,
					username: this.username,
					petals: this.getPetalsForUpdate(),
					petalSync: true,
					primaryPetals: this.primaryPetals,
					secondaryPetals: this.secondaryPetals,
				};
			} else {
				this.petalSyncTimer --;
				return {
					...(super.serializeForUpdate()),
					score: this.score,
					hp: this.hp,
					maxHp: this.maxHp,
					currentExpForLevel: this.currentExpForLevel,
					level: this.level,
					exp: this.exp,
					username: this.username,
					petals: this.getPetalsForUpdate(),
					radius: this.attributes.RADIUS,
					size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
				};
			}
		} else {
			return {
				...(super.serializeForUpdate()),
				score: this.score,
				hp: this.hp,
				maxHp: this.maxHp,
				radius: this.attributes.RADIUS,
				size: this.attributes.RADIUS * this.attributes.RENDER_RADIUS,
				username: this.username,
				petals: this.getPetalsForUpdate(),
			};
		}
	}
}

export default Player;