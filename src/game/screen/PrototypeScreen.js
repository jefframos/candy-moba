import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';
import InputManager from '../InputManager';
import Cupcake from '../entity/Cupcake';

export default class PrototypeScreen extends Screen{
	constructor(label){
		super(label);

		this.inputManager = new InputManager(this);

		this.cupcake = new Cupcake();

		this.addChild(this.cupcake)
		this.addOnUpdateList(this.cupcake)

		this.cupcake.x = 500
		this.cupcake.y = 500

		this.updateable = true;
	}
	build(){
		super.build();

	}
	update ( delta ) {
		super.update(delta)
		this.inputManager.update();

		//console.log(scale *0.3 + 0.2);
		this.cupcake.setDistance(1-utils.distance(0,this.cupcake.y,0,config.height) / config.height);
		// this.inputManager.gamep.update();

		// console.log(this.inputManager.gamep.connectedGamepad);
		//console.log(this);
	}
	updateKeyUp(key){
		this.updateKeyDown();
	}
	updateKeyDown(){
		for (var i = 0; i < this.inputManager.keys.length; i++) {
			if(this.inputManager.keys[i] == 'space'){
				//console.log('space');
				this.cupcake.attack();
			}
		}
		this.cupcake.move(this.inputManager.leftAxes);
	}
	
	stopAction(type){
	}
	transitionIn(){

	}
}