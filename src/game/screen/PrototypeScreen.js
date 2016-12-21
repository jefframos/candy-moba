import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import InputManager from '../InputManager';
import Camera from '../Camera';
import Cupcake from '../entity/Cupcake';
import StandardEnemy from '../entity/enemies/StandardEnemy';
import StandardBullet from '../entity/bullets/StandardBullet';
import TowerBullet from '../entity/bullets/TowerBullet';
import Rock from '../entity/environment/Rock';
import Pine from '../entity/environment/Pine';
import Bush from '../entity/environment/Bush';
import Tower from '../entity/towers/Tower';
import Spawner from '../entity/spawner/Spawner';

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.inputManager = new InputManager(this);


		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer);

		// this.gameContainer.scale.set(0.3)


		this.polyPts = config.worldBounds;
		var worldBoundsGraphic = new PIXI.Graphics();
		worldBoundsGraphic.beginFill(0xffffff);
		worldBoundsGraphic.alpha = 0.1
		worldBoundsGraphic.drawPolygon(this.polyPts);
		worldBoundsGraphic.endFill();

		this.gameContainer.addChild(worldBoundsGraphic)

		for (var i = config.wayPath.length - 1; i >= 0; i--) {
			
			let wayGraphic = new PIXI.Graphics();
			wayGraphic.beginFill(0xffffff);
			wayGraphic.alpha = 0.1
			wayGraphic.drawPolygon(config.wayPath[i]);
			wayGraphic.endFill();

			this.gameContainer.addChild(wayGraphic)
		}


		this.worldPolygon = new PIXI.Polygon(this.polyPts)
		this.worldBounds = {x:0,y:0, w:6000, h:2000}


		this.floorContainer = new PIXI.Container();
		this.gameContainer.addChild(this.floorContainer);

		this.entityContainer = new PIXI.Container();
		this.gameContainer.addChild(this.entityContainer);

		this.cupcake = new Cupcake(this, {x:config.playerPositions[0][1],y:config.playerPositions[0][2]}, 0);
		this.entityContainer.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)



		this.spawnerList = [];
		for (var i = 0; i < config.spawnerList.length; i++) {
			let spawnerDataList = config.spawnerList[i];
			for (var k = spawnerDataList.length - 1; k >= 0; k--) {
				var spawnerData = spawnerDataList[k];
				let team = 0;
				if(spawnerData[0][0].indexOf('t2') !== -1){
					team = 1;
				}
				let spawner = new Spawner(this, team);
				this.entityContainer.addChild(spawner)
				this.addOnUpdateList(spawner)
				this.spawnerList.push(spawner);
				spawner.x = spawnerData[0][1];
				spawner.y = spawnerData[0][2];
				spawner.build();
				this.setScales(spawner);

				for (var j = 1; j < spawnerData.length; j++) {
					spawner.addWaypoint(spawnerData[j][1],spawnerData[j][2]);
				}
			}
		}

		this.towerList = [];
		for (var i = 0; i < config.towerList.length; i++) {
			for (var j = 0; j < config.towerList[i].length; j++) {
				var towerData = config.towerList[i][j];
				let tower = new Tower(this, towerData[3]);
				tower.name = towerData[0];
				this.entityContainer.addChild(tower)
				this.addOnUpdateList(tower)
				this.towerList.push(tower);
				tower.x = towerData[1];
				tower.y = towerData[2];

				this.setScales(tower);

				tower.build();
			}
		}
		// this.cupcake.x = this.worldBounds.w / 2 + this.worldBounds.x
		// this.cupcake.y = this.worldBounds.h / 2 + this.worldBounds.y;

		// this.cupcake.x = 300
		// this.cupcake.y = 1000


		this.enemyList = [];
		// let acc = 50
		// for (var i = 0; i < 25; i++) {

		// 	let tempEnemy = new StandardEnemy(this);
		// 	this.entityContainer.addChild(tempEnemy)
		// 	this.addOnUpdateList(tempEnemy)


		// 	let tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
		// 	while(this.worldCollision(tempPos.x,tempPos.y)){
		// 		tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
		// 	}

		// 	tempEnemy.x = 500 + acc * i;
		// 	tempEnemy.y = 1000 + Math.random() + Math.random() * 50 - 25;
		// 	tempEnemy.build();


		// 	tempEnemy.setTarget({x:this.towerList[0].x,y:this.towerList[0].y})
		// 	this.enemyList.push(tempEnemy);
		// }

		this.environmentList = [];
		// for (var i = 0; i < config.environmentList.length; i++) {
		// 	var envData = config.environmentList[i];
		// 	// console.log(envData);
		// 	var environmentEntity;

		// 	if(envData[0] == 'pine'){
		// 		environmentEntity = new Pine(this, true);
		// 	}else if(envData[0].indexOf('rock') !== -1){
		// 		console.log(envData[0]);
		// 		environmentEntity = new Rock(this, true);
		// 	}else if(envData[0].indexOf('bush') !== -1){
		// 		environmentEntity = new Bush(this, true);
		// 	}

		// 	this.entityContainer.addChild(environmentEntity)
		// 	//this.addOnUpdateList(environmentEntity)

		// 	environmentEntity.x = envData[1];
		// 	environmentEntity.y = envData[2];

		// 	environmentEntity.side = envData[3]
		// 	environmentEntity.starterScale = envData[4] * 2


		// 	// environmentEntity.y = Math.random() < 0.6? Math.random() * (config.height * 0.2) + config.height * 0.2: Math.random() * (this.worldBounds.h * 0.5) + config.height * 0.7;
		// 	this.setScales(environmentEntity);

		// 	this.environmentList.push(environmentEntity);

		// }


		this.updateable = true;

		// var text = new PIXI.Text('HOLD Space to see attacks\nZ: Jump\nX: Range Attack\nJump + Attack: Range Attack',{fontFamily : 'Arial', fontSize: 12});
		// this.addChild(text);
		// text.x = 10
		// text.y = 10

		// text.scale.set(0.4)

		this.bulletList = [];


		this.camera = new Camera(this, this.gameContainer);
		this.speedUpValue = 1;

		this.initGame();

	}
	initGame(){
		this.speedUpValue = 1;
		for (var i = this.spawnerList.length - 1; i >= 0; i--) {
			this.spawnerList[i].start();
		}
	}
	addEnemy(type, position, waypoints, team){

		let tempEnemy = new StandardEnemy(this, team);


		tempEnemy.setWaypoints(waypoints)


		this.entityContainer.addChild(tempEnemy)
		this.addOnUpdateList(tempEnemy)



		tempEnemy.x = position.x;
		tempEnemy.y = position.y;


		tempEnemy.build();


		// tempEnemy.setTarget({x:this.towerList[0].x,y:this.towerList[0].y})
		this.enemyList.push(tempEnemy);

	}
	build(){
		this.lastAction = null;
		super.build();

		this.camera.zoom(0.5, 1, 0.2);
		this.camera.follow(this.cupcake);

	}
	update ( delta ) {

		let newDelta = delta * this.speedUpValue;

		super.update(newDelta)


		this.camera.update(newDelta);
		this.inputManager.update();

		//let scaleFactor = 

		for (var i = 0; i < this.bulletList.length; i++) {
			if(this.bulletList[i].killed){
				this.floorContainer.addChild(this.bulletList[i]);
				this.bulletList.splice(i,1)
			}else{
				this.setScales(this.bulletList[i]);
			}
		}

		for (var i = 0; i < this.enemyList.length; i++) {
			if(this.enemyList[i].killed){
				this.floorContainer.addChild(this.enemyList[i]);
				this.enemyList.splice(i,1)
			}else{
				this.setScales(this.enemyList[i]);
			}
		}
		//console.log(scale *0.3 + 0.2);
		this.setScales(this.cupcake);

		this.entityContainer.children.sort(utils.depthCompare);

		this.environmentCollision(this.cupcake);

		// console.log(this.enemyList);
		// if(this.enemyList)
		// 	console.log(this.enemyList.length);
		//console.log(this.worldCollision(this.cupcake));
		
	}
	worldCollision(x,y) {
		if(this.worldPolygon.contains(x,y)){
			return false
		}else{
			return true
		}
	}
	environmentCollision(entity) {
	 	let collideList = [];
 		for (var i = 0; i < this.environmentList.length; i++) {
 			let colEnt = this.environmentList[i];	
 			if(colEnt.y > entity.y){
	 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
	 			let distFactor = entity.getExternalRadius() * 4;
	 			if(dist < distFactor){

	 				this.environmentList[i].updateAlpha((dist / (distFactor) )*0.9+0.1);

	 				// let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
	 				// let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
	 				// let left = Math.abs(angle) > 150 && entity.side == 1;
	 				// let right = Math.abs(angle) < 30 && entity.side == -1;

	 				// collideList.push({entity:colEnt, angle:angle, dist:dist, ableToHit: ableToHit, left:left, right:right});
	 			}else{
	 				this.environmentList[i].updateAlpha(1);
	 			}
 			}else{
 				this.environmentList[i].updateAlpha(1);
 			}
 		}

	 	//collideList.sort(utils.distCompare);

	 	//return collideList
	 }

	getSingleCollisionList(type){

		let entitiesList = [];
		if(type == 'enemy'){
			entitiesList = this.enemyList;
		}else if(type == 'player'){
			entitiesList.push(this.cupcake);
		}else if(type == 'tower'){
			entitiesList = this.towerList;
		}
		return entitiesList

	}
	getCollisionsArray(type){

		let entitiesList = [];

		if(typeof type === 'object'){
			for (var i = type.length - 1; i >= 0; i--) {
				if(entitiesList.length == 0){
					entitiesList = this.getSingleCollisionList(type[i]);
				}else{
					entitiesList = entitiesList.concat(this.getSingleCollisionList(type[i]));
				}
			}
		}else{
			entitiesList = this.getSingleCollisionList(type);
		}
		return entitiesList
	}

	getExternalColisionList(entity, type, rival) {
		if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionsArray(type);
	 	
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
 			if(!rival || (rival && entity.team != colEnt.team)){
	 			if(colEnt.collidable){	 				
		 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
		 			if(dist < colEnt.getExternalRadius() + entity.getExternalRadius()){

		 				let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
		 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
		 				let left = Math.abs(angle) > 150 && entity.side == 1;
		 				let right = Math.abs(angle) < 30 && entity.side == -1;

		 				collideList.push({entity:colEnt, angle:angle, dist:dist, ableToHit: ableToHit, left:left, right:right});
		 			}
		 		}
	 		}
 		}

	 	collideList.sort(utils.distCompare);
	 	return collideList
	 }

	 getCollisionList(entity, type, rival) {
	 	if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionsArray(type);
	 	// console.log(entitiesList);
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
 			if(!rival || (rival && entity.team != colEnt.team)){
	 			if(colEnt.collidable){		 			
		 			let dist = utils.distance(entity.x,entity.y, colEnt.x,colEnt.y)
		 			if(dist < colEnt.getRadius() + entity.getRadius()){
		 				let angle = Math.atan2(entity.y - colEnt.y, entity.x - colEnt.x) * 180 / 3.14
		 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
		 				let left = Math.abs(angle) > 150 && entity.side == 1;
		 				let right = Math.abs(angle) < 30 && entity.side == -1;
		 				let trueLeft = Math.abs(angle) > 150;
		 				let trueRight = Math.abs(angle) < 30;
		 				collideList.push(
		 					{
		 						entity:colEnt,
		 						angle:angle,
		 						dist:dist,
		 						ableToHit: ableToHit,
		 						left:left,
		 						right:right ,
								trueLeft:trueLeft,
		 						trueRight:trueRight
		 					}
		 				);
		 			}
				}
			}
	 		collideList.sort(utils.distCompare);	 			
 		}
	 	return collideList
	 }

	 getSimpleEntityCollision(entity1, entity2, rival) {
	 	if(!entity1.collidable){
			return;
		}
		if((rival && entity1.team == entity2.team)){
			return;
		}

	 	let collideList = [];
		let colEnt = entity2;
		if(colEnt.collidable){		 			
 			let dist = utils.distance(entity1.x,entity1.y, colEnt.x,colEnt.y)
 			if(dist < colEnt.getRadius() + entity1.getRadius()){
 				let angle = Math.atan2(entity1.y - colEnt.y, entity1.x - colEnt.x) * 180 / 3.14
 				let ableToHit = Math.abs(angle) > 150 || Math.abs(angle) < 30;
 				let left = Math.abs(angle) > 150 && entity1.side == 1;
 				let right = Math.abs(angle) < 30 && entity1.side == -1;

 				let trueLeft = Math.abs(angle) > 150;
 				let trueRight = Math.abs(angle) < 30;

 				collideList.push(
 					{
 						entity1:colEnt,
 						angle:angle,
 						dist:dist,
 						ableToHit: ableToHit,
 						left:left,
 						right:right ,
						trueLeft:trueLeft,
 						trueRight:trueRight
 					}
 				);
 			}
		}
	 	return collideList
	 }
	 

	setScales(entity){

		if(!entity.setDistance){
			return;
		}

		// console.log(entity, 1-utils.distance(0,entity.y,0,config.height) / config.height);
		//console.log('2'+entity);

		let h = this.worldBounds.h;
		entity.setDistance(1-utils.distance(0,entity.y,0,h) / h +  0.3);

	}
	updateKeyUp(key){
		this.updateKeyDown();

		if(key == 'action5'){
			this.cupcake.speedNormal();
		}
	}
	addBullet(pos, vel, life){
		let bullet = new StandardBullet(this, vel, life);
		this.entityContainer.addChild(bullet)
		this.addOnUpdateList(bullet)
		bullet.position.x = pos.x
		bullet.position.y = pos.y

		this.bulletList.push(bullet);

		this.setScales(bullet);

	}
	addTowerBullet(pos, vel, life, power, team){
		let bullet = new TowerBullet(this, vel, life, power, team);
		this.entityContainer.addChild(bullet)
		this.addOnUpdateList(bullet)
		bullet.position.x = pos.x
		bullet.position.y = pos.y

		this.bulletList.push(bullet);

		this.setScales(bullet);

	}
	updateKeyDown(){
		this.speedUpValue = 1;
		window.game.frameskip = 1;
		for (var i = 0; i < this.inputManager.keys.length; i++) {
			if(this.inputManager.keys[i] == 'action1'){
				//console.log('space');

				
				
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.attack();
			}
			if(this.inputManager.keys[i] == 'action2'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.jump();
			}
			if(this.inputManager.keys[i] == 'action3'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.rangeAttack();
			}
			if(this.inputManager.keys[i] == 'action4'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				// console.log(this.cupcake);
				this.cupcake.areaAttack();
			}
			if(this.inputManager.keys[i] == 'action5'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.cupcake.speedUp();
			}
			if(this.inputManager.keys[i] == 'action6'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				window.game.frameskip = 3;
				//this.speedUpValue = 5;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'action7'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				window.game.frameskip = 6;
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'zoomIn'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.camera.zoom2(0.1);
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
			if(this.inputManager.keys[i] == 'zoomOut'){
				//console.log('space');
				this.lastAction = this.inputManager.keys[i];
				this.camera.zoom2(-0.1);
				//this.speedUpValue = 10;
				// this.cupcake.die();
			}
		}

		// console.log('axes',this.inputManager.leftAxes);
		this.cupcake.move(this.inputManager.leftAxes);

		if(this.inputManager.rightAxes && this.inputManager.rightAxes[1]){
			let zoomValue = this.inputManager.rightAxes[1] + 0;
			if(zoomValue != 0){
				this.camera.zoom2(zoomValue * -0.001);
			}
		}
		
	}
	
	stopAction(type){
	}
	transitionIn(){

	}
}