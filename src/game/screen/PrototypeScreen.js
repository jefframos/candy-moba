import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import InputManager from '../InputManager';
import Cupcake from '../entity/Cupcake';
import StandardBullet from '../entity/bullets/StandardBullet';
import Rock from '../entity/environment/Rock';
import Pine from '../entity/environment/Pine';

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.inputManager = new InputManager(this);

		this.entityContainer = new PIXI.Container();
		this.addChild(this.entityContainer)

		this.cupcake = new Cupcake(this);
		this.entityContainer.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)
		this.cupcake.x = 500
		this.cupcake.y = 500

		for (var i = 0; i < 15; i++) {
			var rock;
			if(Math.random() < 0.3){
				rock = new Pine(this);
			}else{
				rock = new Rock(this);
			}
			this.entityContainer.addChild(rock)
			this.addOnUpdateList(rock)
			rock.x = Math.random() * config.width;
			rock.y = Math.random() * (config.height * 0.8) + config.height * 0.2;
			this.setScales(rock);
		}


		this.updateable = true;

		var text = new PIXI.Text('HOLD Space to see attacks\nZ: Jump\nX: Range Attack\nJump + Attack: Range Attack',{fontFamily : 'Arial', fontSize: 12});
		this.addChild(text);
		text.x = 10
		text.y = 10

		text.scale.set(0.4)

		this.bulletList = [];
	}
	build(){
		this.lastAction = null;
		super.build();

	}
	update ( delta ) {
		super.update(delta)
		this.inputManager.update();

		//let scaleFactor = 

		for (var i = 0; i < this.bulletList.length; i++) {
			this.setScales(this.bulletList[i]);
		}
		//console.log(scale *0.3 + 0.2);
		this.setScales(this.cupcake);
		//this.cupcake.setDistance(1-utils.distance(0,this.cupcake.y,0,config.height) / config.height);
		// this.inputManager.gamep.update();

		// console.log(this.inputManager.gamep.connectedGamepad);
		//console.log(this);

		this.entityContainer.children.sort(this.depthCompare);
		
	}


	 depthCompare(a,b) {
	        var yA = a.y;
	        var yB = b.y;
	        if(yA === yB){
	            return 0;
	        }
	        if(a.noDepth || b.noDepth){
	            return 0;
	        }
	        if (yA < yB){
	            return -1;
	        }
	        if (yA > yB){
	            return 1;
	        }
	        return 0;
	    }

	setScales(entity){


		if(!entity.setDistance){
			return;
		}

		// console.log(entity, 1-utils.distance(0,entity.y,0,config.height) / config.height);
		//console.log('2'+entity);

		entity.setDistance(1-utils.distance(0,entity.y,0,config.height) / config.height);

	}
	updateKeyUp(key){
		this.updateKeyDown();

		if(key == 'action5'){
			this.cupcake.speedNormal();
		}
	}
	addBullet(pos, vel, life){
		let bullet = new StandardBullet(vel, life);
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