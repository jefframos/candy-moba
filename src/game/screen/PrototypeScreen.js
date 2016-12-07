import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'
import InputManager from '../InputManager'
import Cupcake from '../entity/Cupcake'

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
		//console.log(this);
	}
	updateKeyUp(key){
		switch (key){
			case 'left':{
				this.cupcake.velocity.x =0;
				this.cupcake.state = 0;
			}
			case 'right':{
				this.cupcake.velocity.x = 0;
				this.cupcake.state = 0;
			}
		}
	}
	updateKeyDown(){
	//console.log(this.inputManager.keys);		
		for (var i = 0; i < this.inputManager.keys.length; i++) {
			switch (this.inputManager.keys[i]){
				case 'left':{
					this.cupcake.velocity.x = -200;
					this.cupcake.state = 1;
				}
				break;
				case 'right':{
					this.cupcake.velocity.x = 200;
					this.cupcake.state = 1;
				}
				break;
			}
		}
	}
	updateAction(type){
		// switch (type){
		// 	case 'left':{
		// 		this.cupcake.velocity.x = -50;
		// 		this.cupcake.state = 1;
		// 	}
		// 	break;
		// 	case 'right':{
		// 		this.cupcake.velocity.x = 50;
		// 		this.cupcake.state = 1;
		// 	}
		// 	break;
		// }
	}
	stopAction(type){
	}
	transitionIn(){


	}
}