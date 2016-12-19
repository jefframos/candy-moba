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
import Rock from '../entity/environment/Rock';
import Pine from '../entity/environment/Pine';
import Bush from '../entity/environment/Bush';
import Tower from '../entity/towers/Tower';

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.inputManager = new InputManager(this);


		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer);


		this.polyPts = [80,700,
		820,289,
		1397,279,
		1821,740,
		2524,764,
		2850,303,
		3450,307,
		3846,768,
		4377,657,
		4861,293,
		5625,242,
		5909,391,
		5909,1681,
		5690,1914,
		4456,1886,
		3953,1644,
		2566,1662,
		1946,1877,
		778,1844,
		74,1215,
		80,700];
	// this.poly = new PIXI.Polygon(this.polyPts);


		var graphics = new PIXI.Graphics();
		graphics.beginFill(0xffffff);
		graphics.alpha = 0.5
		graphics.drawPolygon(this.polyPts);
		graphics.endFill();

		this.worldPolygon = new PIXI.Polygon(this.polyPts)

		this.worldBounds = {x:80,y:300, w:6000, h:2000}
		this.gameContainer.addChild(graphics)



		this.entityContainer = new PIXI.Container();
		this.gameContainer.addChild(this.entityContainer)

		this.cupcake = new Cupcake(this, {x:300,y:1200});
		this.entityContainer.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)


		this.tower = new Tower(this);
		this.entityContainer.addChild(this.tower)
		this.addOnUpdateList(this.tower)
		this.towerList = [];
		this.towerList.push(this.tower);
		this.tower.x = 250;
		this.tower.y = 1000;

		this.setScales(this.tower);
		
		this.tower.build();
		// this.cupcake.x = this.worldBounds.w / 2 + this.worldBounds.x
		// this.cupcake.y = this.worldBounds.h / 2 + this.worldBounds.y;

		// this.cupcake.x = 300
		// this.cupcake.y = 1000


		this.enemyList = [];
		let acc = 50
		for (var i = 0; i < 25; i++) {

			let tempEnemy = new StandardEnemy(this);
			this.entityContainer.addChild(tempEnemy)
			this.addOnUpdateList(tempEnemy)


			let tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
			while(this.worldCollision(tempPos.x,tempPos.y)){
				tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
			}

			tempEnemy.x = 500 + acc * i;
			tempEnemy.y = 1000 + Math.random() + Math.random() * 50 - 25;
			tempEnemy.build();


			tempEnemy.setTarget({x:this.tower.x,y:this.tower.y})
			this.enemyList.push(tempEnemy);

		}

		// var debug3 = new PIXI.Graphics();
		// debug3.beginFill(0xff0000);
		// debug3.drawCircle(0,0,20);
		// debug3.x = 500;
		// debug3.y = 1200;

		// this.gameContainer.addChild(debug3)

		// for (var i = 0; i < 200; i++) {

		// 	let tempEnemy = new StandardEnemy(this);
		// 	this.entityContainer.addChild(tempEnemy)
		// 	this.addOnUpdateList(tempEnemy)


		// 	let tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
		// 	while(this.worldCollision(tempPos.x,tempPos.y)){
		// 		tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
		// 	}

		// 	tempEnemy.x = tempPos.x;
		// 	tempEnemy.y = tempPos.y;
		// 	this.enemyList.push(tempEnemy);

		// }
		this.environmentList = [];
		for (var i = 0; i < 200; i++) {
			var rock;
			var rnd = Math.random();
			if(rnd < 0.1){
				rock = new Pine(this);
				//rock = new Rock(this);

			}else if(rnd < 0.8){
				rock = new Rock(this);
			}else{
				rock = new Bush(this);
			}

			this.entityContainer.addChild(rock)
			this.addOnUpdateList(rock)

			let tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}

			while(this.worldCollision(tempPos.x,tempPos.y)){
				tempPos = {x:this.worldBounds.w * Math.random() + this.worldBounds.x, y:this.worldBounds.h * Math.random() + this.worldBounds.y}
			}
			rock.x = tempPos.x;
			rock.y = tempPos.y;

			// rock.side = rock.x < config.width/2 ? 1 : -1;
			rock.side = Math.random() < 0.5?1:-1;
			// rock.y = Math.random() < 0.6? Math.random() * (config.height * 0.2) + config.height * 0.2: Math.random() * (this.worldBounds.h * 0.5) + config.height * 0.7;
			this.setScales(rock);

			this.environmentList.push(rock);
		}


		this.updateable = true;

		var text = new PIXI.Text('HOLD Space to see attacks\nZ: Jump\nX: Range Attack\nJump + Attack: Range Attack',{fontFamily : 'Arial', fontSize: 12});
		this.addChild(text);
		text.x = 10
		text.y = 10

		text.scale.set(0.4)

		this.bulletList = [];


		this.camera = new Camera(this, this.gameContainer);
		this.camera.follow(this.cupcake);

	}
	build(){
		this.lastAction = null;
		super.build();

		console.log(this.worldCollision(this.cupcake));

	}
	update ( delta ) {
		super.update(delta)


		this.camera.update(delta);
		this.inputManager.update();

		//let scaleFactor = 

		for (var i = 0; i < this.bulletList.length; i++) {
			this.setScales(this.bulletList[i]);
		}

		for (var i = 0; i < this.enemyList.length; i++) {
			this.setScales(this.enemyList[i]);
		}
		//console.log(scale *0.3 + 0.2);
		this.setScales(this.cupcake);

		this.entityContainer.children.sort(utils.depthCompare);

		this.environmentCollision(this.cupcake);

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

	 				this.environmentList[i].updateAlpha((dist / (distFactor) )*0.8+0.2);

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
	getCollisionList(type){


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

	getExternalColisionList(entity, type) {
		if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionList(type);
	 	
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
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

	 	collideList.sort(utils.distCompare);
	 	return collideList
	 }

	 getColisionList(entity, type) {
	 	if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	let entitiesList = this.getCollisionList(type);
	 	// console.log(entitiesList);
 		for (var i = 0; i < entitiesList.length; i++) {
 			let colEnt = entitiesList[i];
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
 			collideList.sort(utils.distCompare);	 			
 		}
	 	return collideList
	 }

	 getSimpleEntityCollision(entity1, entity2) {
	 	if(!entity1.collidable){
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
	updateKeyDown(){
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
				// this.cupcake.die();
			}
		}

		// console.log('axes',this.inputManager.leftAxes);
		this.cupcake.move(this.inputManager.leftAxes);
	}
	
	stopAction(type){
	}
	transitionIn(){

	}
}