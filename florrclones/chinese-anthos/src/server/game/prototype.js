import Constants from '../../shared/constants.js';
import crypto from 'crypto';
import EntityAttributes from '../../../public/entity_attributes.js';
import PetalAttributes from '../../../public/petal_attributes.js';
import Player from './entity/player.js';
import Mob from './entity/mob.js';
import Drop from './entity/drop.js';

var TOTAL_SPAWN_WEIGHT = 0; // this is a constant
Object.values(EntityAttributes).forEach(attribute => {
	if (attribute.ATTACK_MODE == `PROJECTILE` || attribute.IS_SEGMENT) return;
	Object.entries(attribute.SPAWN_AREA).forEach(([name, weight]) => {
		TOTAL_SPAWN_WEIGHT += weight;
	})
});

class Game {
	constructor() {
		this.leaderboard = [{score: -1}]; // the leaderboard handles all players, but only send the first 'LEADERBOARD_LENGTH' Object.values to each client
		this.sockets = {};
		this.players = {};
		this.mobs = {}; // {id: mob,...}
		this.drops = {};
		this.chunks = {}; // {chunkID:[{type: entityType, id: id},...],...}
		this.lastUpdateTime = Date.now();
		//this.mobSpawnTimer = {};
		//this.volumeTaken = 0;
		// this.shouldSendUpdate = false;
		this.mobID = 0;
		this.dropID = 0;
		this.info = {};
		this.lightningPath = [];
		this.diedEntities = [];
		setInterval(this.update.bind(this), 1000 / Constants.TICK_PER_SECOND); // update the game every tick
	
		this.areas = {};
		Object.keys(Constants.MAP_AREAS).forEach(name => {
			this.areas[name] = {};
			this.areas[name].mobSpawnTimer = 0;
			this.areas[name].volumeTaken = 0;
		})
	}

	// client networking

	addPlayer(socket, username) { // add a player
		this.sockets[socket.id] = socket;

		const x = Constants.MAP_AREAS.GARDEN.WIDTH * this.rnd(0.1, 0.9);
		const y = Constants.MAP_AREAS.GARDEN.HEIGHT * this.rnd(0.1, 0.9);

		this.players[socket.id] = new Player(socket.id, username, x, y);
		
		//this.appendEntityToBlock(`player`, this.players[socket.id]);

		this.updateLeaderboard(this.players[socket.id]);
	}

	onPlayerDisconnect(socket) { // calls when a player is disconnected (currently the webpage will refresh for a player that dies)
		if ( this.players[socket.id] ) {
			this.removeFromLeaderboard(this.players[socket.id]);
			this.removePlayer(socket);
		}
	}

	removePlayer(socket) { // remove a player
		const playerID = socket.id;
		this.players[playerID].chunks.forEach(chunk => {
			if ( this.chunks[this.getChunkID(chunk)] ) {
				this.chunks[this.getChunkID(chunk)].splice(
					this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
						return entityInChunk.type == 'player' && entityInChunk.id == playerID;
					}),
					1
				);
			}
		});
		this.players[playerID].petals.forEach((petals) => {
			petals.forEach((petal) => {
				if ( petal.mob && petal.isHide ) {
					petal.mob.forEach(mobID => {
						delete this.mobs[mobID];
					})
				}
				if ( !petal.inCooldown ) {
					petal.chunks.forEach(chunk => {
						if ( this.chunks[this.getChunkID(chunk)] ) {
							this.chunks[this.getChunkID(chunk)].splice(
								this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
									return entityInChunk.type == 'petal' && entityInChunk.id == {playerID: playerID, petalID: petal.id};
								}),
								1
							);
						}
					});
				}
			})
		})
		delete this.sockets[playerID];
		delete this.players[playerID];
	}

	handleMouseDown(socket, mouseDownEvent) {
		const player = this.players[socket.id];
		if ( player ) {
			if ( mouseDownEvent & 1 ) {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_ATTACK;
				player.attack = true;
				if ( mouseDownEvent & 2 ) {
					player.defend = true;
				}
			} else if ( mouseDownEvent & 2 ) {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_DEFEND;
				player.defend = true;
			} else {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_NORMAL;
			}
		}
	}

	handleMouseUp(socket, mouseUpEvent) {
		const player = this.players[socket.id];
		if ( player ) {
			if ( mouseUpEvent & 1 ) {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_ATTACK;
				if ( !(mouseUpEvent & 2) ) {
					player.defend = false;
				}
			} else if ( mouseUpEvent & 2 ) {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_DEFEND;
				player.attack = false;
			} else {
				player.petalExpandRadius = Constants.PETAL_EXPAND_RADIUS_NORMAL;
				player.attack = false;
				player.defend = false;
			}
		}
	}

	handlePetalSwitch(socket, petalA, petalB) {
		const player = this.players[socket.id];
		if (!player) return;
		player.switchPetals(petalA, petalB);
	}

	handleMovement(socket, movement) { // handle input from a player
		const player = this.players[socket.id];
		if ( player ) {
			player.handleActiveMovement({
				direction: movement.direction,
				speed: movement.magnitude * EntityAttributes.PLAYER.SPEED,
			});
		}
	}

	// cmd

	cmdInv(sel, petal) {
		
	}

	// leaderboard

	getRankOnLeaderboard(playerID) { // find the rank of a player
		return (this.leaderboard.findIndex((player) => {
			return player.id == playerID;
		}));
	}

	removeFromLeaderboard(player) { // remove a player from leaderboard
		this.leaderboard.splice(this.getRankOnLeaderboard(player.id), 1);
	}

	updateLeaderboard(player) { // called when a player's score changes, update the player's rank on leaderboard
		if ( player.haveRankOnLeaderboard == false ) { // this is true only if this function is called in this.addPlayer.
			this.leaderboard.push({
				score: 1,
				id: player.id,
				username: player.username,
			});
			player.haveRankOnLeaderboard = true;
			return ;
		}
		const rankOnLeaderboard = this.getRankOnLeaderboard(player.id);
		var playerRank = rankOnLeaderboard;
		const playerScore = player.score;
		var rankChanged = false;
		while( playerScore > this.leaderboard[playerRank].score && playerRank > 0 ) {// comparing one by one, can be optimized with binary search
			playerRank --;
			rankChanged = true;
		}
		if ( rankChanged )
			playerRank ++;
		this.leaderboard.splice(rankOnLeaderboard, 1);
		this.leaderboard.splice(playerRank, 0, {score: playerScore, id: player.id, username: player.username});
	}

	// handle deaths

	handlePlayerDeath(player) { // handles a single player death
		// called when a player dies, adding score to 'killedBy' and remove the dead player from leaderboard
		// this function will not remove the player itself

		this.diedEntities.push({
			x: player.x,
			y: player.y,
			vdir: Math.atan2(player.velocity.y, player.velocity.x),
			type: `player`,
			size: player.attributes.RENDER_RADIUS,
			dir: player.direction,
		});
		const killedByInfo = player.hurtByInfo;
		if ( killedByInfo.type == 'player' || killedByInfo.type == 'petal' ) {
			var killedBy;
			if ( killedByInfo.type == 'player' ) {
				killedBy = this.players[killedByInfo.id];
			} else if ( killedByInfo.type == 'petal' ) {
				killedBy = this.players[killedByInfo.id.playerID];
			}
			if ( killedBy ) {
				killedBy.score += Math.floor(EntityAttributes.PLAYER + player.score * Constants.SCORE_LOOTING_COEFFICIENT);
				killedBy.addExp(EntityAttributes.PLAYER.EXPERIENCE + player.totalExp * Constants.EXP_LOOTING_COEFFICIENT);
				if ( this.getRankOnLeaderboard(killedBy.id) > 0 ) {
					// avoid crashing when two players kill each other at the exact same time
					// it will crash because the player who killed you is not on the leaderboard anymore
					// (the player who killed you is dead, and he has already been removed from leaderboard)
					this.updateLeaderboard(killedBy);
					killedBy.maxHp += 10;
				}
			}
		}
		this.removeFromLeaderboard(player);
		console.log(`${player.username} is dead!`);
	}

	handlePetalDeaths(player) { // make dead petals in cooldown
		player.petals.forEach((petals, slot) => {
			petals.forEach((petal,index) => {
				if ( !petal.inCooldown ) {
					if ( petal.hp <= 0 ) {
						this.diedEntities.push({
							x: petal.x,
							y: petal.y,
							vdir: Math.atan2(petal.velocity.y, petal.velocity.x),
							type: petal.type,
							size: petal.attributes.RADIUS * petal.attributes.RENDER_RADIUS,
							dir: petal.direction,
						});
						petal.chunks.forEach(chunk => {
							if ( this.chunks[this.getChunkID(chunk)] ) {
								this.chunks[this.getChunkID(chunk)].splice(
									this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
										return entityInChunk.type == 'petal' && entityInChunk.id == {playerID: player.id, petalID: petal.id};
									}),
									1
								);
							}
						});
						if ( petal.placeHolder != -1 ) {
							petal.inCooldown = true;
							player.reload(petal.slot,index);
							return;
						}
						player.petals.splice(slot, 1);
					}
				}
			})
		});
	}

	handlePlayerDeaths() { // handle mutiple player death
		Object.keys(this.sockets).forEach(playerID => { // handle player deaths
			const player = this.players[playerID];
			this.handlePetalDeaths(player);
			if ( player.hp <= 0 ) {
				this.handlePlayerDeath(player);
			}
		});

		Object.keys(this.sockets).forEach(playerID => { // remove dead players
			const socket = this.sockets[playerID];
			const player = this.players[playerID];
			if ( player.hp <= 0 ) {
				socket.emit(Constants.MSG_TYPES.GAME_OVER);
				this.removePlayer(socket);
			}
		})
	}

	handleMobDeaths() { // remove dead mobs
		Object.keys(this.mobs).forEach(mobID => {
			const mob = this.mobs[mobID];
			if ( !mob ) // 这个生物已经不存在了
				return;
			if ( mob.hpConnection && this.getEntity(mob.hpConnection).hp > 0 )
				return;
			if ( mob.hp <= 0 ) {
				const killedByInfo = mob.hurtByInfo;
				var killedBy;
				if ( killedByInfo.type == 'player' ) {
					killedBy = this.players[killedByInfo.id];
				} else if ( killedByInfo.type == 'petal' ) {
					killedBy = this.players[killedByInfo.id.playerID];
				} else if ( killedByInfo.type == 'mob' && this.mobs[killedByInfo.id] ) {
					let killedByMob = this.mobs[killedByInfo.id];
					if (killedByMob.team != `mobTeam` && this.players[killedByMob.team]) {
						killedBy = this.players[killedByMob.team];
					}
				}
				if ( killedBy ) {
					killedBy.score += Math.floor(EntityAttributes[mob.type].VALUE);
					killedBy.addExp(EntityAttributes[mob.type].EXPERIENCE);
					if ( this.getRankOnLeaderboard(killedBy.id) > 0 ) {
						this.updateLeaderboard(killedBy);
					}
				};
				mob.chunks.forEach(chunk => {
					if( this.chunks[this.getChunkID(chunk)] ) {
						this.chunks[this.getChunkID(chunk)].splice(
							this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
								return entityInChunk.type == 'mob' && entityInChunk.id == mob.id;
							}),
							1
						);
					}
				});
				this.areas[mob.birthplace].volumeTaken -= EntityAttributes[mob.type].VOLUME;

				// console.log("a mob has juts been killed!");

				this.diedEntities.push({
					x: mob.x,
					y: mob.y,
					vdir: Math.atan2(mob.velocity.y, mob.velocity.x),
					type: mob.type,
					size: mob.attributes.RADIUS * mob.attributes.RENDER_RADIUS,
					dir: mob.direction,
					isMob: true,
				});
				
				//召唤类花瓣重生
				if (this.players[mob.team] && mob.slot != undefined) {
					let player = this.players[mob.team];
					let petals = player.petals.find(petals => (petals[0].slot == mob.slot));
					petals.forEach((petal) => {
						if (petal.id != mob.petalID) return;
						petal.mob.splice(petal.mob.indexOf(mob.id), 1);
						if (petal.mob.length == 0) {
							petal.isHide = false;
							player.reload(petal.slot, petal.idInPlaceHolder);
							player.updatePlaceHolder();
						}
					})
				}
				
				if (mob.attributes.CONTENT_RELEASE && !(mob.team != `mobTeam` && !this.players[mob.team])) {
					if (mob.attributes.CONTENT_RELEASE.ONDIE) {
						const releases = mob.attributes.CONTENT_RELEASE.ONDIE;
						const contents = mob.attributes.CONTENT;
						Object.entries(releases.RELEASE).forEach(([type, number]) => {
							const isContentProjectile = EntityAttributes[type].ATTACK_MODE == `PROJECTILE` ? true : false;
							for (let time = 0; time < number; time++) {
								if (contents[type] <= 0) break;
								const newMob = this.spawnMob(type, mob.x, mob.y, mob.team, isContentProjectile, isContentProjectile ? Constants.PROJECTILE_EXIST_TIME : Infinity);
								if (mob.team != `mobTeam`) {
									const player = this.getEntity(mob.team);
									newMob.slot = mob.slot;
									newMob.petalID = mob.petalID;
									player.pets[newMob.id] = newMob;
									player.petals.some(petals => {
										const petal = petals.find(petal => petal.id == newMob.petalID);
										if (petal) {
											petal.mob.push(newMob.id);
											return true;
										}
									})
								}	
								contents[type]--;
							}
						})
					}
				}
				
				//创建掉落
				(() => {
					if ( this.players[mob.team] )
						return;
					if ( mob.attributes.DROP )
						this.createDrop(mob.attributes.DROP, mob.x, mob.y);
				})();
				
				//删除存于玩家的mob属性
				if ( this.players[mob.team] ) delete this.players[mob.team].pets[mobID]; 
				
				mob.segments.splice(mob.segments.indexOf(mob.id), 1);
				
				delete this.mobs[mobID];
			}
		});
	}

	// init
	
	init(deltaT) {
		this.lightningPath = [];
		this.diedEntities = [];
		Object.values(this.mobs).forEach(mob => {
			const targetId = mob.target;
			if (!this.players[targetId] && !this.mobs[targetId]) mob.target = -1;
		});
	}

	// movement

	applyForces(deltaT) {
		Object.keys(this.sockets).forEach(playerID => {
			const player = this.players[playerID];
			player.applyForces(deltaT);
		});
		Object.values(this.mobs).forEach(mob => {
			mob.applyForces(deltaT);
		});
	}

	updateMovement(deltaT) {
		Object.values(this.players).forEach(player => {
			player.updateMovement(deltaT);
		});
		Object.entries(this.mobs).forEach(([mobID,mob]) => {
			if (mob.sensitization || mob.attributes.ATTACK_MODE == `EVIL`) { //判断mob是否为主动型生物,为mob寻找目标
				if (mob.target == -1 || !(this.players[mob.target] || this.mobs[mob.target])) { //没有目标或者目标不存在
					let distances = [],
						ids = [];
						
					if (mob.team == `mobTeam`) {
						const center = {
							x: mob.x,
							y: mob.y,
						};
						Object.entries(this.players).forEach(([id,player]) => {
							const distance = Math.sqrt((center.x - player.x) ** 2 + (center.y - player.y) ** 2);
							if (distance < Constants.MOB_ATTACK_RADIUS) {
								distances.push(distance);
								ids.push(id);
							}
							Object.entries(player.pets).forEach(([id,enemyMob]) => {
								if (enemyMob.team == mob.team || enemyMob.isProjectile) return; 
								const distance = Math.sqrt((center.x - enemyMob.x) ** 2 + (center.y - enemyMob.y) ** 2);
								if (distance < Constants.MOB_ATTACK_RADIUS) {
									distances.push(distance);
									ids.push(id);
								}
							});
						});
					} else { //玩家队伍
						(() => {
							const player = this.players[mob.team];
							if ( !player )
								return ;
							const center = {
								x: player.x,
								y: player.y,
							};
							Object.entries(this.players).forEach(([id,player]) => {
								if (player.team == mob.team) return; 
								const distance = Math.sqrt((center.x - player.x) ** 2 + (center.y - player.y) ** 2);
								if (distance < Constants.MOB_ATTACK_RADIUS) {
									distances.push(distance);
									ids.push(id);
								}
							});
							Object.entries(this.mobs).forEach(([id,enemyMob]) => {
								if (id == mobID || enemyMob.isProjectile || enemyMob.team == mob.team) return;
								
								//寻找玩家附近的目标
								if (Math.sqrt((center.x - enemyMob.x) ** 2 + (center.y - enemyMob.y) ** 2) > Constants.MOB_ATTACK_RADIUS) return; 
								
								//寻找距离自己最近的目标
								const distance = Math.sqrt((mob.x - enemyMob.x) ** 2 + (mob.y - enemyMob.y) ** 2);
								if (distance < Constants.MOB_ATTACK_RADIUS) {
									distances.push(distance);
									ids.push(id);
								}
							});
						})();
					}
					
					mob.target = ids[distances.indexOf(Math.min(...distances))] || -1;
				}
			}
			
			const target = this.getEntity(mob.target);
			
			if (mob.bodyConnection && mob.segments.includes(mob.bodyConnection)) {
				return;
			}
			
			//获取目标失败或距离目标太远或离玩家（parent）太远，待机
			else if (!target || mob.distanceTo(target) > Constants.MOB_ATTACK_RADIUS || (mob.team != `mobTeam` && mob.distanceTo(this.getEntity(mob.team)) > Constants.MOB_ATTACK_RADIUS)) { 
				mob.idle(deltaT, this.players[mob.team]);
			}
			
			//成功获取目标
			else if (target) {
				mob.updateMovement(deltaT, target);
				mob.aimAt(target);
			}
		});
		Object.values(this.drops).forEach(drop => {
			drop.updateMovement(deltaT);
		});
	}
	
	updateBodyConnection(deltaT) {
		Object.values(this.mobs).forEach(mob => {
			if (mob.bodyConnection && mob.segments.includes(mob.bodyConnection)) {
				mob.connectTo(this.getEntity(mob.bodyConnection));
			}
		})
	}

	updateVelocity(deltaT) {
		Object.keys(this.sockets).forEach(playerID => {
			const player = this.players[playerID];
			player.updateVelocity(deltaT);
		});
		Object.values(this.mobs).forEach(mob => {
			mob.updateVelocity(deltaT);
		});
		Object.values(this.drops).forEach(drop => {
			drop.updateVelocity(deltaT);
		});
	}

	applyVelocity(deltaT) { // apply velocity for each entity
		Object.values(this.mobs).forEach(mob => {
			mob.applyVelocity(deltaT);
		});
		Object.keys(this.sockets).forEach(playerID => {
			this.players[playerID].applyVelocity(deltaT);
		});
		Object.values(this.drops).forEach(drop => {
			drop.applyVelocity(deltaT);
		});
	}

	updateChunks() {
		Object.keys(this.sockets).forEach(playerID => {
			const player = this.players[playerID];
			const playerChunks = player.updateChunks(); // update player
			if ( playerChunks ) { // update the player's chunks
				const chunksOld = playerChunks.chunksOld;
				const chunksNew = playerChunks.chunksNew;
				chunksOld.forEach(chunk => {
					if ( this.chunks[this.getChunkID(chunk)] ) {
						const idx = this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
							return ( entityInChunk.type == 'player' ) && ( entityInChunk.id == playerID );
						});
						if ( idx != -1 )
							this.chunks[this.getChunkID(chunk)].splice(idx, 1);
					}
				});
				chunksNew.forEach(chunk => {
					if ( this.chunks[this.getChunkID(chunk)] ) {
						this.chunks[this.getChunkID(chunk)].push({type: 'player', id: playerID});
					} else {
						this.chunks[this.getChunkID(chunk)] = new Array({type: 'player', id: playerID});
					}
				});
			}
			player.petals.forEach((petals) => {
				petals.forEach((petal) => {
					if ( !petal.inCooldown ) {
						const petalChunks = petal.updateChunks(petal.attributes.RADIUS);
						if ( petalChunks ) { // update the petals' chunks
							const chunksOld = petalChunks.chunksOld;
							const chunksNew = petalChunks.chunksNew;
							chunksOld.forEach(chunk => {
								if ( this.chunks[this.getChunkID(chunk)] ) {
									const idx = this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
										return ( entityInChunk.type == 'petal' ) && ( entityInChunk.id.playerID == playerID ) && ( entityInChunk.id.petalID == petal.id );
									});
									if ( idx != -1 )
										this.chunks[this.getChunkID(chunk)].splice(idx, 1);
								}
							});
							chunksNew.forEach(chunk => {
								if ( this.chunks[this.getChunkID(chunk)] ) {
									this.chunks[this.getChunkID(chunk)].push({type: 'petal', id: {playerID: playerID, petalID: petal.id}});
								} else {
									this.chunks[this.getChunkID(chunk)] = new Array({type: 'petal', id: {playerID: playerID, petalID: petal.id}});
								}
							});
						}
					}
				})
			}) // update the player's petals
		});
		Object.values(this.mobs).forEach(mob => {
			const chunks = mob.updateChunks();
			if ( chunks ) {
				const chunksOld = chunks.chunksOld;
				const chunksNew = chunks.chunksNew;
				chunksOld.forEach(chunk => {
					if( this.chunks[this.getChunkID(chunk)] ) {
						const idx = this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
							return ( entityInChunk.type == 'mob' ) && ( entityInChunk.id == mob.id );
						});
						if ( idx != -1 )
							this.chunks[this.getChunkID(chunk)].splice(idx, 1);
					}
				});
				chunksNew.forEach(chunk => {
					if( this.chunks[this.getChunkID(chunk)] ) {
						this.chunks[this.getChunkID(chunk)].push({type: 'mob', id: mob.id});
					} else {
						this.chunks[this.getChunkID(chunk)] = new Array({type: 'mob', id: mob.id});
					}
				});
			}
		});
		Object.values(this.drops).forEach(drop => {
			const chunks = drop.updateChunks();
			if ( chunks ) {
				const chunksOld = chunks.chunksOld;
				const chunksNew = chunks.chunksNew;
				chunksOld.forEach(chunk => {
					if( this.chunks[this.getChunkID(chunk)] ) {
						const idx = this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
							return ( entityInChunk.type == 'drop' ) && ( entityInChunk.id == drop.id );
						});
						if ( idx != -1 )
							this.chunks[this.getChunkID(chunk)].splice(idx, 1);
					}
				});
				chunksNew.forEach(chunk => {
					if( this.chunks[this.getChunkID(chunk)] ) {
						this.chunks[this.getChunkID(chunk)].push({type: 'drop', id: drop.id});
					} else {
						this.chunks[this.getChunkID(chunk)] = new Array({type: 'drop', id: drop.id});
					}
				});
			}
		});
	}

	// mob spawn

	getNewMobID() { // get a new mob ID when a mob spawns
		this.mobID ++;
		return `mob-${this.mobID}`;
	}
	
	getNewDropID() { // get a new mob ID when a mob spawns
		this.dropID ++;
		return `drop-${this.dropID}`;
	}

	mobSpawn() { // spawns mobs
		Object.entries(Constants.MAP_AREAS).forEach(([areaName, areaAttribute]) => {
			const areaAttributesNow = this.areas[areaName];
			if ( areaAttributesNow.mobSpawnTimer > 0 ) {
				areaAttributesNow.mobSpawnTimer --;
				return;
			}
			areaAttributesNow.mobSpawnTimer = areaAttribute.MOB_SPAWN_INTERVAL;
			while ( areaAttributesNow.volumeTaken < areaAttribute.MAX_VOLUME ) {
				const mobNumber = this.rnd(1, TOTAL_SPAWN_WEIGHT);
				const currentMobNumber = 0;
				Object.values(EntityAttributes).forEach(attribute => {
					if (attribute.ATTACK_MODE == `PROJECTILE` || attribute.IS_SEGMENT) return;
					Object.entries(attribute.SPAWN_AREA).forEach(([name, weight]) => {
						if ( currentMobNumber < mobNumber && currentMobNumber + weight >= mobNumber && areaName == name) {
							const startWidth = Constants.MAP_AREAS[name].START_WIDTH;
							const startHeight = Constants.MAP_AREAS[name].START_HEIGHT;
							const width = Constants.MAP_AREAS[name].WIDTH;
							const height = Constants.MAP_AREAS[name].HEIGHT;
							const spawnX = this.rnd(startWidth, width);
							const spawnY = this.rnd(startHeight, height);
							this.spawnMob(attribute.TYPE, spawnX, spawnY, `mobTeam`);
						}
					})
				});
			}
		})
	}
	
	spawnMob(type, spawnX, spawnY, team, isProjectile, existTime) {
		const newMobID = this.getNewMobID();
		const mob = new Mob(newMobID, spawnX, spawnY, type, team, false, isProjectile, existTime);
		// console.log(mob.x, mob.y);
		mob.birthplace = this.getAreaNameByEntityPosition(mob.x, mob.y);
		this.areas[mob.birthplace].volumeTaken += mob.attributes.VOLUME;
		const offsetRadiusAttributes = mob.attributes.RADIUS_DEVIATION;
		if (offsetRadiusAttributes) {
			const offsetRadius = Math.floor(Math.random() * (offsetRadiusAttributes.MAX - offsetRadiusAttributes.MIN + 1)) + offsetRadiusAttributes.MIN;
			mob.attributes.RADIUS += offsetRadius;
			// mob.attributes.RENDER_RADIUS += offsetRadius;
			if (mob.attributes.HP_DEVIATION) {
				const offsetHp = Math.round(offsetRadius / (offsetRadiusAttributes.MAX - offsetRadiusAttributes.MIN) * (mob.attributes.HP_DEVIATION.MAX - mob.attributes.HP_DEVIATION.MIN));
				mob.attributes.MAX_HP += offsetHp;
				mob.hp += offsetHp;
				mob.maxHp += offsetHp;
			}
		}
		this.mobs[newMobID] = mob;
		
		//segment
		const mobSegmentAttributes =  EntityAttributes[type].SEGMENT;
		if (mobSegmentAttributes) {
			const segmentAngle = Math.random() * Math.PI * 2;
			const segmentCount = Math.floor(Math.random() * (mobSegmentAttributes.MAX - mobSegmentAttributes.MIN + 1)) + mobSegmentAttributes.MIN;
			const segmentRadius = EntityAttributes[mobSegmentAttributes.NAME].RENDER_RADIUS;
			const mobRadius = EntityAttributes[type].RENDER_RADIUS;

			let segments = [];
			segments.push(mob.id);
			for (let segmentNumber = 0; segmentNumber < segmentCount; segmentNumber++) {
				const lastArea = Object.values(Constants.MAP_AREAS)[Object.keys(Constants.MAP_AREAS).length - 1];
				const mapWidth = lastArea.START_WIDTH + lastArea.WIDTH,
					  mapHeight = lastArea.START_HEIGHT + lastArea.HEIGHT;
				let newSpawnX = spawnX + (segmentRadius + mobRadius) * (segmentNumber + 1) * Math.sin(segmentAngle),
					newSpawnY = spawnY + (segmentRadius + mobRadius) * (segmentNumber + 1) * Math.cos(segmentAngle);
				if (newSpawnX < 0) newSpawnX = 0
				else if (newSpawnX > mapWidth) newSpawnX = mapWidth;
				if (newSpawnY < 0) newSpawnY = 0
				else if (newSpawnY > mapHeight) newSpawnY = mapHeight;
				const segment = this.spawnMob(mobSegmentAttributes.NAME, newSpawnX, newSpawnY, mob.team, false);
				segment.bodyConnection = segments[segmentNumber];
				segments.push(segment.id);
			}
			
			segments.forEach(id => {
				const segment = this.mobs[id];
				segment.segments = segments;
				if (segment.attributes.HP_CONNECT) {
					segment.hpConnection = mob.id;
					mob.hp += segment.hp;
					mob.maxHp += segment.maxHp;
					segment.hp = 0;
					segment.maxHp = 0;
				}
			})
		}
		
		//this.appendEntityToBlock(`mob`, this.mobs[newMobID]);
		
		return this.mobs[newMobID];
	}

	// solve collisions

	solveCollisions(deltaT) { // handle collisions
		let collisions = [];
		Object.values(this.chunks).forEach(entitiesInChunk => {
			const entityCount = entitiesInChunk.length;
			if ( entityCount <= 1 ) {
				return ;
			}
			for (let i = 0; i < entityCount - 1; i++) {
				for (let j = i + 1; j < entityCount; j++) {
					const entityInfoA = entitiesInChunk[i];
					const entityInfoB = entitiesInChunk[j];
					let entityA, entityB;
					if ( entityInfoA.type == 'player' ) {
						entityA = this.players[entityInfoA.id];
					} else if ( entityInfoA.type == 'mob' ) {
						entityA = this.mobs[entityInfoA.id];
					} else if ( entityInfoA.type == 'petal' ) {
						if ( !this.players[entityInfoA.id.playerID] )
							continue;
						try{
							this.players[entityInfoA.id.playerID].petals.forEach(petals => {
								petals.forEach(petal => {
									if (petal.id == entityInfoA.id.petalID) {
										if (petal.inCooldown || petal.isHide) {
											throw Error();
										} else{
											entityA = petal;
										}
									}
								})
							})
						}catch(e){
							continue;
						}
					} else if ( entityInfoA.type == 'drop' ) {
						entityA = this.drops[entityInfoA.id];
					}
					if ( entityInfoB.type == 'player' ) {
						entityB = this.players[entityInfoB.id];
					} else if ( entityInfoB.type == 'mob' ) {
						entityB = this.mobs[entityInfoB.id];
					} else if ( entityInfoB.type == 'petal' ) {
						if ( !this.players[entityInfoB.id.playerID] )
							continue;
						try{
							this.players[entityInfoB.id.playerID].petals.forEach(petals => {
								petals.forEach(petal => {
									if (petal.id == entityInfoB.id.petalID) {
										if (petal.inCooldown) {
											throw Error();
										} else{
											entityB = petal;
										}
									}
								})
							})
						}catch(e){
							continue;
						}
					} else if ( entityInfoB.type == 'drop' ) {
						entityB = this.drops[entityInfoB.id];
					}
					if (!entityA || !entityB) continue;
					if ( ( entityA.team == entityB.team ) && ( entityInfoA.type == 'petal' || entityInfoB.type == 'petal' ) ) // petals do not collide with anything of the same team
						continue;
					if (entityA.team == entityB.team && (entityA.attributes.ATTACK_MODE == 'PROJECTILE' || entityB.attributes.ATTACK_MODE == 'PROJECTILE'))
						continue;
					
					const distance = entityA.distanceTo(entityB);
					const r1 = entityA.attributes.RADIUS, r2 = entityB.attributes.RADIUS;
					if ( distance < r1 + r2) {
						collisions.push({
							infoA: entityInfoA,
							infoB: entityInfoB,
						});
					}
				}
			}
		});
		collisions = collisions.reduce((accumulator, cur) => {
			if ( !accumulator.find((item) => {
				let sameA = false, sameB = false;
				if ( item.infoA.type != 'petal' ) {
					sameA = ( (item.infoA.type == cur.infoA.type) && (item.infoA.id == cur.infoA.id) );
				} else {
					sameA = ( (item.infoA.id.playerID == cur.infoA.id.playerID) && (item.infoA.id.petalID == cur.infoA.id.petalID) )
				}
				if ( item.infoB.type != 'petal' ) {
					sameB = ( (item.infoB.type == cur.infoB.type) && (item.infoB.id == cur.infoB.id) );
				} else {
					sameB = ( (item.infoB.id.playerID == cur.infoB.id.playerID) && (item.infoB.id.petalID == cur.infoB.id.petalID) )
				}
				return sameA && sameB;
			}) ) {
				accumulator.push(cur);
			}
			return accumulator;
		}, []);
		for (let i = 0; i < collisions.length; i ++ ) {
			const collision = collisions[i];
			const entityInfoA = collision.infoA, entityInfoB = collision.infoB;
			let entityA, entityB;
			if ( entityInfoA.type == 'player' ) {
				entityA = this.players[entityInfoA.id];
			} else if ( entityInfoA.type == 'mob' ) {
				entityA = this.mobs[entityInfoA.id];
			} else if ( entityInfoA.type == 'petal' ) {
				if ( !this.players[entityInfoA.id.playerID] )
					continue;
				try{
					this.players[entityInfoA.id.playerID].petals.forEach(petals => {
						petals.forEach(petal => {
							if (petal.id == entityInfoA.id.petalID) {
								if (petal.inCooldown) {
									throw Error();
								} else{
									entityA = petal;
								}
							}
						})
					})
				}catch(e){
					continue;
				}
			} else if ( entityInfoA.type == 'drop' ) {
				entityA = this.drops[entityInfoA.id];
			}
			if ( entityInfoB.type == 'player' ) {
				entityB = this.players[entityInfoB.id];
			} else if ( entityInfoB.type == 'mob' ) {
				entityB = this.mobs[entityInfoB.id];
			} else if ( entityInfoB.type == 'petal' ) {
				if ( !this.players[entityInfoB.id.playerID] )
					continue;
				try{
					this.players[entityInfoB.id.playerID].petals.forEach(petals => {
						petals.forEach(petal => {
							if (petal.id == entityInfoB.id.petalID) {
								if (petal.inCooldown) {
									throw Error();
								} else{
									entityB = petal;
								}
							}
						})
					})
				}catch(e){
					continue;
				}
			}
			else if ( entityInfoB.type == 'drop' ) {
				entityB = this.drops[entityInfoB.id];
			}
			if (!entityA || !entityB) continue;
			
			//是否为玩家与掉落
			if (entityA.type == `PLAYER` && entityB.team == `drop`) {
				let isCollectSuccess = this.givePetal(entityA,entityB.type);
				if (isCollectSuccess) delete this.drops[entityB.id];
				continue;
			} else if (entityB.type == `PLAYER` && entityA.team == `drop`) {
				let isCollectSuccess = this.givePetal(entityB,entityA.type);
				if (isCollectSuccess) delete this.drops[entityA.id];
				continue;
			}

			if (entityA.team == `drop` || entityB.team == `drop`) continue;
			
			const distance = entityA.distanceTo(entityB);
			const r1 = entityA.attributes.RADIUS, r2 = entityB.attributes.RADIUS;
			const depth = r1 + r2 - distance;
			const mA = entityA.attributes.MASS, mB = entityB.attributes.MASS;
			const theta2 = Math.atan2(entityA.x - entityB.x, entityB.y - entityA.y); // orientation of A relative to B
			const theta1 = theta2 - Math.PI; // orientation of B relative to A
			const penetrationDepthWeightInCollision = Constants.PENETRATION_DEPTH_WEIGHT_IN_COLLISION;
			const velA = depth * penetrationDepthWeightInCollision * mB / (mA + mB);
			const velB = depth * penetrationDepthWeightInCollision * mA / (mA + mB);
			entityA.constraintVelocity.x += velA * Math.sin(theta2) / deltaT;
			entityA.constraintVelocity.y += velA * Math.cos(theta2) / deltaT;
			entityB.constraintVelocity.x += velB * Math.sin(theta1) / deltaT;
			entityB.constraintVelocity.y += velB * Math.cos(theta1) / deltaT;
			
			if ( entityA.team != entityB.team ) {
				if ( entityInfoA.type == 'player' ) {
					entityA.velocity.x += velA * Math.sin(theta2) / deltaT;
					entityA.velocity.y += velA * Math.cos(theta2) / deltaT;
					const baseKnockback = Constants.BASE_KNOCKBACK;
					const knockbackA = baseKnockback * mB / (mA + mB);
					entityA.velocity.x += knockbackA * Math.sin(theta2);
					entityA.velocity.y += knockbackA * Math.cos(theta2);
					if ( entityInfoB.type == 'petal' ) {
						this.players[entityB.parent].hp -= entityB.attributes.DAMAGE * entityA.damageReflect * (1 + entityB.fragile);
					} else if ( entityInfoB.type == 'player' ) {
						entityA.hp -= entityA.attributes.DAMAGE * entityB.damageReflect * (1 + entityA.fragile);
						entityB.hp -= entityB.attributes.DAMAGE * entityA.damageReflect * (1 + entityB.fragile);
						if ( entityA.bodyToxicity > 0 ) {
							if ( entityB.poison * entityB.poisonTime < entityA.bodyPoison ) {
								entityB.poison = entityA.bodyToxicity;
								entityB.poisonTime = entityA.bodyPoison / entityA.bodyToxicity;
							}
						}
						if ( entityB.bodyToxicity > 0 ) {
							if ( entityA.poison * entityA.poisonTime < entityB.bodyPoison ) {
								entityA.poison = entityB.bodyToxicity;
								entityA.poisonTime = entityB.bodyPoison / entityB.bodyToxicity;
							}
						}
					}
				}
				if ( entityInfoB.type == 'player' ) {
					entityB.velocity.x += velB * Math.sin(theta1) / deltaT;
					entityB.velocity.y += velB * Math.cos(theta1) / deltaT;
					const baseKnockback = Constants.BASE_KNOCKBACK;
					const knockbackB = baseKnockback * mA / (mA + mB);
					entityB.velocity.x += knockbackB * Math.sin(theta1);
					entityB.velocity.y += knockbackB * Math.cos(theta1);
					if ( entityInfoA.type == 'petal' ) {
						this.players[entityA.parent].hp -= entityA.attributes.DAMAGE * entityB.damageReflect * (1 + entityA.fragile);
					}
				}

				const dmgA = entityB.attributes.DAMAGE * (1 + entityA.fragile);
				const dmgB = entityA.attributes.DAMAGE * (1 + entityB.fragile);
				
				//第一个if是吸血相关的
				if (!entityA.segments.includes(entityB.id) && !entityB.segments.includes(entityA.id) || !(entityA.attributes.TRIGGERS.VAMPIRISM || entityB.attributes.TRIGGERS.VAMPIRISM)) {
					if ( dmgA != 0 ) {
						entityA.isHurt = true;
					}
					if ( dmgB != 0 ) {
						entityB.isHurt = true;
					}
					if (entityA.hpConnection) {
						this.getEntity(entityA.hpConnection).hp -= dmgA;
					} else {
						entityA.hp -= dmgA;
					}
					if (entityB.hpConnection) {
						this.getEntity(entityB.hpConnection).hp -= dmgB;
					} else {
						entityB.hp -= dmgB;
					}
				}

				this.releaseCollisionSkill(entityA,entityB,entityInfoB);
				this.releaseCollisionSkill(entityB,entityA,entityInfoA);
			}
		}
	}
	
	releaseCollisionSkill(entityA,entityB,entityInfo) {
		if (entityB.attributes.TRIGGERS) {
			if ( entityB.attributes.TRIGGERS.NO_HEAL ) {
				entityA.noHeal = entityB.attributes.TRIGGERS.NO_HEAL;
			}
			if ( entityB.attributes.TRIGGERS.POISON ) {
				if ( entityA.poison * entityA.poisonTime < entityB.attributes.TRIGGERS.POISON ) {
					entityA.poison = entityB.attributes.TRIGGERS.TOXICITY;
					entityA.poisonTime = entityB.attributes.TRIGGERS.POISON / entityB.attributes.TRIGGERS.TOXICITY;
				}
			}
			if ( entityB.attributes.TRIGGERS.PUNCTURE ) {
				if ( entityA.puncture < entityB.attributes.TRIGGERS.PUNCTURE ) {
					entityA.puncture = entityB.attributes.TRIGGERS.PUNCTURE;
					entityA.fragile = entityB.attributes.TRIGGERS.PUNCTURE_DAMAGE;
				}
			}
			if ( entityB.attributes.TRIGGERS.LIGHTNING && entityB.attributes.TRIGGERS.LIGHTNING.COLLIDE ) {
				this.lightning(entityB, entityA, entityInfo);
			}
			if (entityB.attributes.TRIGGERS.VAMPIRISM) {
				if (entityB.attributes.TRIGGERS.VAMPIRISM.COLLIDE) {
					entityB.hp = Math.min(entityB.maxHp, entityB.hp + entityB.attributes.DAMAGE * entityB.attributes.TRIGGERS.VAMPIRISM.HEAL);
					entityA.isHurt = true;
					if (entityB.attributes.TRIGGERS.VAMPIRISM.HEAL_PLAYER) {
						const player = this.getEntity(entityInfo.id.playerID);
						player.hp = Math.min(player.maxHp, player.hp + entityB.attributes.DAMAGE * entityB.attributes.TRIGGERS.VAMPIRISM.HEAL_PLAYER);
					}
				} 
				else if (entityB.target == entityA.id) {
					entityB.bodyConnection = entityA.id;
					entityB.segments.push(entityA.id);
				}
			}
		}
		
		if (entityA.attributes.CONTENT_RELEASE) {
			if (entityA.attributes.CONTENT_RELEASE.ONHIT) {
				const releases = entityA.attributes.CONTENT_RELEASE.ONHIT;
				const contents = entityA.attributes.CONTENT;
				const correctTimes = Math.floor((entityA.maxHp - entityA.hp) / releases.HP);
				
				if (correctTimes > releases.TIMES) {
					releases.TIMES = correctTimes;
					
					Object.entries(releases.RELEASE).forEach(([type, number]) => {
						const isContentProjectile = EntityAttributes[type].ATTACK_MODE == `PROJECTILE` ? true : false;
						for (let time = 0; time < number; time++) {
							if (contents[type] <= 0) break;
							const newMob = this.spawnMob(type, entityA.x, entityA.y, entityA.team, isContentProjectile, isContentProjectile ? Constants.PROJECTILE_EXIST_TIME : Infinity);
							if (entityA.team != `mobTeam`) {
								const player = this.getEntity(entityA.team);
								newMob.slot = entityA.slot;
								newMob.petalID = entityA.petalID;
								player.pets[newMob.id] = newMob;
								player.petals.some(petals => {
									const petal = petals.find(petal => petal.id == newMob.petalID);
									if (petal) {
										petal.mob.push(newMob.id);
										return true;
									}
								})
							}
							contents[type]--;
						}
					})
				}
			}
		}
		
		if (entityA.puncture > 0) {
			entityA.puncture--;
		}
		if (entityA.puncture == 0) {
			entityA.fragile = 0;
		}
		
		if (entityB.attributes.ATTACK_MODE == `PROJECTILE`) {
			entityA.hurtByInfo = {type: entityInfo.type, id: entityB.shootBy};
			return;
		}
		entityA.hurtByInfo = entityInfo;
	}

	applyConstraintVelocity(deltaT) {
		Object.values(this.mobs).forEach(mob => {
			mob.applyConstraintVelocity(deltaT);
		});
		Object.keys(this.sockets).forEach(playerID => {
			this.players[playerID].applyConstraintVelocity(deltaT);
		})
	}

	handleBorder() {
		Object.keys(this.sockets).forEach(playerID => {
			const player = this.players[playerID];
			player.handleBorder();
		});
		Object.values(this.mobs).forEach(mob => {
			mob.handleBorder();
		});
		Object.values(this.drops).forEach(drop => {
			drop.handleBorder();
		});
	}

	// update players and mobs

	updatePlayers(deltaT) {
		Object.keys(this.sockets).forEach(playerID => {
			const player = this.players[playerID];
			if (this.getAreaNameByEntityPosition(player.x, player.y) == `OCEAN`) {
				if (player.oxygen < 0) {
					player.suffocateTime += deltaT;
				} else {
					player.oxygen -= deltaT;
					player.suffocateTime = 0;
				}
			} else {
				player.oxygen = Constants.PLAYER_OXYGEN;
				player.suffocateTime = 0;
			}
			player.update(deltaT);
			player.petals.forEach((petals) => {
				petals.forEach((petal) => {
					//召唤类花瓣召唤
					if ( petal.attributes.TRIGGERS.SUMMON && !petal.disabled && !petal.inCooldown && !petal.isHide ) {
						if (petal.actionCooldown > 0) {
							petal.actionCooldown -= deltaT;
							return;
						}
						petal.isHide = true;
						player.updatePlaceHolder();
						player.updatePetalSlot();

						let mob = this.spawnMob(petal.attributes.TRIGGERS.SUMMON, petal.x, petal.y, petal.team);
						mob.segments.forEach(segmentID => {
							const segment = this.mobs[segmentID];
							segment.slot = petal.slot;
							segment.petalID = petal.id;
							player.pets[segment.id] = segment;
							petal.mob.push(segmentID);
						});
					}
				})
			}) 
		});
	}
	
	updateMobs(deltaT) {
		Object.values(this.mobs).forEach(mob => {
			//技能
			(() => {
				const targetId = mob.target;
				if (!mob.attributes.TRIGGERS || targetId == -1) return;
				
				if (mob.skillCoolDownTimer < mob.skillCoolDown) {
					mob.skillCoolDownTimer += deltaT;
					return;
				};
				
				if (!mob.isSkillenable) return;
				
				if (mob.attributes.TRIGGERS.SHOOT) {
					mob.skillCoolDownTimer = 0;
					
					let projectile = this.spawnMob(mob.attributes.TRIGGERS.SHOOT,mob.x,mob.y,mob.team,true,2.5);
					projectile.movement = {
						direction: mob.direction,
						speed: projectile.attributes.SPEED,
					}
					
					//后坐力
					mob.velocity.x = Math.sin(mob.direction) * -200;
					mob.velocity.y = Math.cos(mob.direction) * -200;
					
					projectile.direction = mob.direction;
					projectile.shootBy = mob.id;
					return;
				}
				
				if (mob.attributes.TRIGGERS.LIGHTNING) {
					mob.skillCoolDownTimer = 0;
					this.lightning(mob, this.getEntity(targetId), { type: `mob`, id: mob.id });
					return;
				}
				
				if (mob.attributes.TRIGGERS.VAMPIRISM && !mob.attributes.TRIGGERS.VAMPIRISM.COLLIDE) {
					const target = this.getEntity(targetId);
					if (mob.bodyConnection == target.id) {
						mob.skillCoolDownTimer = 0;
						target.hp -= mob.attributes.TRIGGERS.VAMPIRISM.DAMAGE;
						mob.hp += mob.attributes.TRIGGERS.VAMPIRISM.DAMAGE * mob.attributes.TRIGGERS.VAMPIRISM.HEAL;
						target.isHurt = true;
						this.releaseCollisionSkill(target, mob, {type: `mob`, id: mob.id});
					}
					return;
				}
			})();
			
			//存活时间
			(() => {
				if (mob.existTime > 0) {
					mob.existTime -= deltaT;
				}
				if (mob.existTime <= 0) {
					mob.hp = 0;
				}
			})();
			
			//毒
			(() => {
				if (mob.poisonTime <= 0) {
					mob.poison = 0;
					return;
				}
				if (!mob.poison) return;
				
				mob.hp -= mob.poison * deltaT;
				mob.poisonTime -= deltaT;
			})();
			
			//友军mob检测花瓣是否仍然存在
			(() => {
				if (mob.team != `mobTeam` && mob.attributes.ATTACK_MODE != 'PROJECTILE') {
					let petalIDs = [],
						isPetalInCooldown = [];
					const player = this.players[mob.team];
					if ( !player ) 
						return;
					player.petals[mob.slot].forEach((petal) => {
						petalIDs.push(petal.id);
						isPetalInCooldown.push(petal.inCooldown);
					});
					if (petalIDs.includes(mob.petalID) && !isPetalInCooldown[petalIDs.indexOf(mob.petalID)]) {
						return;
					};
					mob.hp = -1;
				}
			})();
			
			//窒息伤害
			(() => {
				/* 找出mob出现在地图外原因后即可删除以下代码 */
				if (mob.x < 0 || mob.y < 0 || mob.x > Constants.MAP_WIDTH || mob.y > Constants.MAP_HEIGHT) return; 
				/* 找出mob出现在地图外原因后即可删除以上代码 */
				if (this.getAreaNameByEntityPosition(mob.x, mob.y) == `OCEAN` && mob.attributes.ATTACK_MODE != 'PROJECTILE' && !mob.attributes.AQUATIC) {
					mob.hp -= Constants.SUFFOCATE_DAMAGE_BASE * deltaT + mob.suffocateTime * deltaT * Constants.SUFFOCATE_DAMAGE_IMPROVE;
					mob.suffocateTime += deltaT;
					return;
				}
				mob.suffocateTime = 0;
			})();
		});
	}

	// handle drops
	
	createDrop(drops, x, y) {
		let actionMovement = {
			direction: 0,
			speed: 0,
		}
		const baseAngle = Math.PI / 2;
		const successDrops = Object.entries(drops).filter(([type,chance]) => {
			return this.chance(chance);
		}) // getting success drops;
		const dropCount = successDrops.length;
		successDrops.forEach(([type], dropNumber) => {
			if (dropCount > 1) {
				actionMovement = {
					direction: baseAngle + dropNumber / dropCount * 2 * Math.PI,
					speed: Math.sqrt(Constants.DROP_SPREAD_DISTANCE * Math.sin(actionMovement.direction) ** 2 + Constants.DROP_SPREAD_DISTANCE * Math.cos(actionMovement.direction) ** 2) / Constants.DROP_ACTION_TIME,
				}
			}
			const newDropID = this.getNewDropID();
			this.drops[newDropID] = new Drop(newDropID, x, y, type, 2.5);
			this.drops[newDropID].movement = actionMovement;
			//this.appendEntityToBlock(`drop`, this.drops[newDropID]);
		});
	}
	
	givePetal(player, newPetal) {
		let primarySlot = player.primaryPetals.indexOf(`EMPTY`);
		let secondarySlot = player.secondaryPetals.indexOf(`EMPTY`);
		if (primarySlot != -1) {
			player.primaryPetals[primarySlot] = newPetal;
			player.switched = true;
			
			let times = PetalAttributes[newPetal].COUNT - player.petals[primarySlot].length;
			for (let i = 0; i < times; i++) {
				let petal = player.newPetal(newPetal, player.getNewPetalID(), primarySlot * Constants.PETAL_MULTIPLE_MAX + i, primarySlot, primarySlot);
				player.petals[primarySlot].push(petal);
			}
				
			player.petals[primarySlot].forEach((petal,index) => {
				petal.isHide = false;
				petal.idInPlaceHolder = index;
				petal.disabled = false;
				petal.type = newPetal;
				petal.updateAttributes();
				petal.cooldown = petal.attributes.RELOAD;
				petal.inCooldown = true;
			})
			
			player.updatePlaceHolder();
			player.updatePetalSlot();
			
			return true;
		} 
		else if (secondarySlot != -1) {
			player.secondaryPetals[secondarySlot] = newPetal;
			player.switched = true;
			
			return true;
		} else {
			return false;
		}
	}
	
	handleDropDeaths() {
		Object.values(this.drops).forEach((drop) => {
			if (drop.existTime > 0) return;
			
			drop.chunks.forEach(chunk => {
				if( this.chunks[this.getChunkID(chunk)] ) {
					this.chunks[this.getChunkID(chunk)].splice(
						this.chunks[this.getChunkID(chunk)].findIndex((entityInChunk) => {
							return entityInChunk.type == 'drop' && entityInChunk.id == drop.id;
						}),
						1
					);
				}
			});
			
			//this.removeEntityFromBlock(`drop`, drop);
			
			delete this.drops[drop.id];
		})
	}
	
	updateDrops(deltaT) {
		Object.values(this.drops).forEach((drop) => {
			drop.existTime -= deltaT;
		})
	}

	// update

	update() { // updates the game every tick
		const now = Date.now();

		const deltaT = 1 / Constants.TICK_PER_SECOND;

		this.lastUpdateTime = now;
		
		this.init(deltaT);
		
		this.mobSpawn();
		
		this.updateDrops(deltaT);
		
		this.updateBodyConnection(deltaT);
		
		this.updateMovement(deltaT);
		
		this.updateVelocity(deltaT);
		
		this.applyVelocity(deltaT);
		
		this.updateBodyConnection(deltaT);
		
		this.handleBorder();
		
		this.updateMobs(deltaT);
		
		this.updatePlayers(deltaT);
		
		this.solveCollisions(deltaT);

		this.updateChunks();

		this.applyConstraintVelocity(deltaT);

		this.handleBorder();

		this.info = {
			mspt: Date.now() - now,
			mobCount: Object.keys(this.mobs).length,
			mobVol: this.areas.GARDEN.volumeTaken//this.areas[this.getAreaNameByEntityPosition(this.rnd(0, 20000), this.rnd(0, 4000))].volumeTaken,
		};
		
		this.handlePlayerDeaths();
		
		this.handleMobDeaths();
		
		this.handleDropDeaths();

		this.sendUpdate();
	}

	// send update

	sendUpdate() { // send update to each client
		Object.keys(this.sockets).forEach(playerID => {
			const socket = this.sockets[playerID];
			const player = this.players[playerID];
			socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player))
		});
	}

	createUpdate(player) { // create the update and return to sendUpdate()
		const nearbyPlayers = Object.values(this.players).filter(
			p => {
				return p !== player && p.distanceTo(player) <= Constants.NEARBY_DISTANCE;
			}
		); // getting nearby players

		const nearbyMobs = Object.values(this.mobs).filter(
			e => {
				return e.distanceTo(player) <= Constants.NEARBY_DISTANCE;
			}
		) // getting nearby mobs
		
		const nearbyDrops = Object.values(this.drops).filter(
			e => {
				return e.distanceTo(player) <= Constants.NEARBY_DISTANCE;
			}
		) // getting nearby drops

		return {
			t: Date.now(), // current time
			info: this.info,
			leaderboard: this.leaderboard.slice(0, Constants.LEADERBOARD_LENGTH + 1), // leaderboard
			rankOnLeaderboard: this.getRankOnLeaderboard(player.id), // this player's rank on leaderboard
			me: player.serializeForUpdate(true), // this player
			others: nearbyPlayers.map(p => p.serializeForUpdate(false)), // nearby players
			playerCount: Object.keys(this.players).length, // the number of players online
			mobs: nearbyMobs.map(e => e.serializeForUpdate()),
			drops: nearbyDrops.map(e => e.serializeForUpdate()),
			lightningPath: this.lightningPath,
			diedEntities: this.diedEntities,
		}
	
	}
	
	lightning(start, target, entityInfo) {
		let possibleEntityPositions = [];
		let lightningPath = [];
		
		lightningPath.push({
			x: start.x,
			y: start.y,
		});
		lightningPath.push({
			x: target.x,
			y: target.y,
		});
		
		//寻找可能被连锁的实体，提升效率
		Object.entries(this.players).forEach(([id, player]) => {
			if (id == start.team) return;
			if (Math.sqrt((player.x - target.x) ** 2 + (player.y - target.y) ** 2) <= Constants.LIGHTNING_LENGTH * start.attributes.TRIGGERS.LIGHTNING.COUNT) {
				possibleEntityPositions.push([player.x,player.y,id]);
			}
		})
		Object.entries(this.mobs).forEach(([id, mob]) => {
			if (mob.team == start.team) return;
			if (Math.sqrt((mob.x - target.x) ** 2 + (mob.y - target.y) ** 2) <= Constants.LIGHTNING_LENGTH * start.attributes.TRIGGERS.LIGHTNING.COUNT) {
				possibleEntityPositions.push([mob.x,mob.y,id]);
			}
		})
		
		//指定接触目标为正在被连锁的实体并造成伤害
		target.hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + target.fragile);
		target.hurtByInfo = entityInfo;
		let damagingEntityPosition = {
			x: target.x,
			y: target.y,
		}
		let damagedEntity = [];
		damagedEntity.push(target.id)
		
		//连锁
		for (let times = 1; times < start.attributes.TRIGGERS.LIGHTNING.COUNT; times++) {
			let distances = [],
				ids = [];
			
			//寻找与正在被连锁的实体附近小于等于闪电连锁距离的实体
			possibleEntityPositions.forEach(([entityX, entityY, id]) => {
				if (damagedEntity.includes(id)) return;
				let distance = Math.sqrt((entityX - damagingEntityPosition.x) ** 2 + (entityY - damagingEntityPosition.y) ** 2);
				if (distance <= Constants.LIGHTNING_LENGTH) {
					distances.push(distance);
					ids.push(id);
				}
			})
			
			//寻找与正在被连锁实体最近的实体（距离小于等于闪电连锁范围），没有就退出循环
			let nextTargetEntityId = ids[distances.indexOf(Math.min(...distances))];
			if (!nextTargetEntityId) break;
			
			//对该实体进行伤害并指定其为正在被连锁的实体
			const nextTargetEntity = this.getEntity(nextTargetEntityId);
			if (nextTargetEntity.hpConnection) {
				this.getEntity(nextTargetEntity.hpConnection).hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + nextTargetEntity.fragile);
			} else {
				nextTargetEntity.hp -= start.attributes.TRIGGERS.LIGHTNING.DAMAGE * (1 + nextTargetEntity.fragile);
			}
			nextTargetEntity.hurtByInfo = entityInfo;
			damagingEntityPosition.x = nextTargetEntity.x;
			damagingEntityPosition.y = nextTargetEntity.y;
			lightningPath.push({
				x: damagingEntityPosition.x,
				y: damagingEntityPosition.y,
			});
			damagedEntity.push(nextTargetEntityId);
		}
		this.lightningPath.push(lightningPath);
	}	

	// other functions

	rnd(x, y) { // returns a random number in range [x, y]
		const randomBuffer = crypto.randomBytes(4);
		const randomNumber = randomBuffer.readUInt32BE(0) / 0xFFFFFFFF;
		return (randomNumber * (y - x)) + x;
	}
	
	getChunkID(chunk) { // gets the ID of the chunk
		return chunk.x * Constants.CHUNK_ID_CONSTANT + chunk.y;
	}

	getEntity(id) {
		return this.players[id] || (this.mobs[id] && this.mobs[id]) || false;
	}

	chance(chance) {
		return (Math.random() < chance);
	}

	getAreaNameByEntityPosition(x, y) {
		const areasArray = Object.entries(Constants.MAP_AREAS);
		const result = areasArray.find(([name, attribute]) => {
			return attribute.START_WIDTH <= x && x <= attribute.START_WIDTH + attribute.WIDTH && attribute.START_HEIGHT <= y && y <= attribute.START_HEIGHT + attribute.HEIGHT;
		});
		return result[0];
	}
}

export default Game;
