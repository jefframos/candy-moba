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

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.inputManager = new InputManager(this);

		this.worldBounds = {x:0,y:0, w:2000, h:config.height * 2}

		this.gameContainer = new PIXI.Container();
		this.addChild(this.gameContainer);

		this.entityContainer = new PIXI.Container();
		this.gameContainer.addChild(this.entityContainer)

		this.cupcake = new Cupcake(this);
		this.entityContainer.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)
		this.cupcake.x = config.width / 2
		this.cupcake.y = config.height / 2;


		this.enemyList = [];

		for (var i = 0; i < 100; i++) {

			let tempEnemy = new StandardEnemy(this);
			this.entityContainer.addChild(tempEnemy)
			this.addOnUpdateList(tempEnemy)
			tempEnemy.x = this.worldBounds.w * Math.random();
			tempEnemy.y = this.worldBounds.h * Math.random();
			this.enemyList.push(tempEnemy);

		}
		this.environmentList = [];
		for (var i = 0; i < 150; i++) {
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
			rock.x = this.worldBounds.w * Math.random();

			rock.side = rock.x < config.width/2 ? 1 : -1;
			// rock.side = Math.random() < 0.5?1:-1;
			rock.y = Math.random() < 0.6? Math.random() * (config.height * 0.2) + config.height * 0.2: Math.random() * (this.worldBounds.h * 0.5) + config.height * 0.7;
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
		//this.cupcake.setDistance(1-utils.distance(0,this.cupcake.y,0,config.height) / config.height);
		// this.inputManager.gamep.update();

		// console.log(this.inputManager.gamep.connectedGamepad);
		//console.log(this);

		this.entityContainer.children.sort(utils.depthCompare);

		this.environmentCollision(this.cupcake);
		
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


	getExternalColisionList(entity, type) {
		if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	if(type == 'enemy'){
	 		for (var i = 0; i < this.enemyList.length; i++) {
	 			let colEnt = this.enemyList[i];
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
	 	}

	 	return collideList
	 }

	 getColisionList(entity, type) {
	 	if(!entity.collidable){
			return;
		}
	 	let collideList = [];
	 	if(type == 'enemy'){
	 		for (var i = 0; i < this.enemyList.length; i++) {
	 			let colEnt = this.enemyList[i];
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
				this.cupcake.die();
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