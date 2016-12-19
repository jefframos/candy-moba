// import Gamepad from './Gamepad'
import utils  from '../utils';
import config  from '../config';
export default class Camera{
	constructor(game, worldMap){
		this.game = game;
		this.entityFollow = null;
		this.velocity = {x:0, y:0};
		this.velocityPlus = {x:0, y:0};
		this.virtualVelocity = {x:0, y:0};
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.worldMap = worldMap;
		this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		this.acceleration = {x:this.cameraSpeed.x/60, y:this.cameraSpeed.y/60};
		this.cameraDelayStandard = {x:1};
		this.cameraDelay = {x:0};
		this.cameraStopping = {x:false};
		this.cameraMoving = {x:false};
		this.fixCamera = false;
		this.startDelay = -1;
		//se a distancia minima da camera for pequena, parece que o cara ta bebado
	}
	
	follow(entity){
		this.entityFollow = entity;

		this.updatePosition(true);

		this.startDelay = 1;

		// if(this.entityFollow.entityModel && this.entityFollow.entityModel.speed){
		// 	this.cameraSpeed = {x:this.entityFollow.entityModel.speed.x, y:this.entityFollow.entityModel.speed.y};
		// 	console.log(this.cameraSpeed);
		// }else{
		// 	this.cameraSpeed = {x:config.width * 0.5, y:config.height * 0.5};
		// }
		// this.acceleration = {x:this.cameraSpeed.x*0.01, y:this.cameraSpeed.y*0.01};
	}

	unfollow(){
		this.entityFollow = null;
	}
	// updateX(globalEntityPosition){

	// 	// this.cameraStopping.x = false;
	// 	if(globalEntityPosition.x < (config.width/2 - config.width * 0.2)){
	// 		this.virtualVelocity.x = this.cameraSpeed.x * 2;
	// 	}else if(globalEntityPosition.x > (config.width/2  + config.width * 0.2)){
	// 		this.virtualVelocity.x = -this.cameraSpeed.x * 2;
	// 	}else if(globalEntityPosition.x < (config.width/2 - this.cameraSpeed.x/this.acceleration.x)){
	// 		this.virtualVelocity.x = this.cameraSpeed.x;
	// 	}else if(globalEntityPosition.x > (config.width/2 + this.cameraSpeed.x/this.acceleration.x)){
	// 		this.virtualVelocity.x = -this.cameraSpeed.x;
	// 	}else if(this.entityFollow.velocity.x == 0){//} if(this.cameraDelay.x <= 0){

	// 		console.log('STOP CAMERA');
	// 		// this.cameraStopping.x = true;
	// 		this.virtualVelocity.x = 0;
	// 		this.velocityPlus.x = 0;
	// 	}

	// 	// if(this.virtualVelocity.x != 0 && this.cameraDelay.x <= 0){
	// 	// 	this.cameraDelay.x = this.cameraDelayStandard.x;
	// 	// }

	// 	if(this.velocity.x < this.virtualVelocity.x){
	// 		if(this.velocity.x > 0){
	// 			// this.velocity.x += this.acceleration.x;
	// 		}
	// 		this.velocity.x += this.acceleration.x;
	// 		if(this.entityFollow.velocity && this.entityFollow.velocity.x){
	// 			//this.velocityPlus.x = -this.entityFollow.velocity.x;
	// 		}
	// 		if(this.velocity.x > this.virtualVelocity.x){
	// 			this.velocity.x = this.virtualVelocity.x;
	// 		}
	// 	}else if (this.velocity.x > this.virtualVelocity.x){
	// 		if(this.velocity.x < 0){
	// 			// this.velocity.x -= this.acceleration.x;
	// 		}
	// 		if(this.velocity.x > this.virtualVelocity.x){
	// 			this.velocity.x -= this.acceleration.x;
	// 			if(this.entityFollow.velocity && this.entityFollow.velocity.x){
	// 				//this.velocityPlus.x = this.entityFollow.velocity.x;
	// 			}
	// 			if(this.velocity.x < this.virtualVelocity.x){
	// 				this.velocity.x = this.virtualVelocity.x;
	// 			}
	// 		}
	// 	}else{
	// 		this.velocityPlus.x = 0;
	// 	}

	// 	// if(this.velocity.x)
	// }

	// updateY(globalEntityPosition){
	// 	if(globalEntityPosition.y < (config.height/2 - config.height * 0.2)){
	// 		this.virtualVelocity.y = this.cameraSpeed.y * 2;
	// 	}else if(globalEntityPosition.y > (config.height/2  + config.height * 0.2)){
	// 		this.virtualVelocity.y = -this.cameraSpeed.y * 2;
	// 	}else if(globalEntityPosition.y < (config.height/2 - config.height * this.cameraSpeed.y*this.acceleration.y)){
	// 		this.virtualVelocity.y = this.cameraSpeed.y;
	// 	}else if(globalEntityPosition.y > (config.height/2 + config.height * this.cameraSpeed.y*this.acceleration.y)){
	// 		this.virtualVelocity.y = -this.cameraSpeed.y;
	// 	}else{
	// 		this.virtualVelocity.y = 0;
	// 		this.velocityPlus.y = 0;
	// 	}

	// 	if(this.velocity.y < this.virtualVelocity.y){
	// 		if(this.velocity.y > 0){
	// 			// this.velocity.y += this.acceleration.y;
	// 		}
	// 		this.velocity.y += this.acceleration.y;
	// 		if(this.entityFollow.velocity && this.entityFollow.velocity.y){
	// 			this.velocityPlus.y = -this.entityFollow.velocity.y;
	// 		}
	// 		if(this.velocity.y > this.virtualVelocity.y){
	// 			this.velocity.y = this.virtualVelocity.y;
	// 		}
	// 	}else if (this.velocity.y > this.virtualVelocity.y){
	// 		if(this.velocity.y > this.virtualVelocity.y){
	// 			if(this.velocity.y < 0){
	// 				// this.velocity.y -= this.acceleration.y;
	// 			}
	// 			this.velocity.y -= this.acceleration.y;
	// 			if(this.entityFollow.velocity && this.entityFollow.velocity.y){
	// 				//this.velocityPlus.y = this.entityFollow.velocity.y;
	// 			}
	// 			if(this.velocity.y < this.virtualVelocity.y){
	// 				this.velocity.y = this.virtualVelocity.y;
	// 			}
	// 		}
	// 	}else{
	// 		this.velocityPlus.y = 0;
	// 	}
	// }

	updatePosition(force){
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);

		if(force){
			this.worldMap.x = config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x;
			this.worldMap.y = config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y;
			return
		}

		let middleDistance = utils.distance(globalEntityPosition.x, globalEntityPosition.y, config.width/2, config.height/2);
		// console.log(middleDistance);
		if(middleDistance > 20){
			// this.worldMap.x = config.width / 2 - globalEntityPosition.x
			// console.log(config.width / 2 , globalEntityPosition.x, globalWorldPosition.x);
			TweenLite.to(this.worldMap, 1 ,{x:config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x, y:config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y});
		}
	}
	update(delta){

		if(!this.entityFollow){
			return;
		}

		if(this.startDelay > 0){
			this.startDelay -= delta;
			return;	
		}

		this.updatePosition();
		// if(Math.abs(this.entityFollow.velocity.y) + Math.abs(this.entityFollow.velocity.x)){
		// }
		// let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		// let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// // console.log(this.worldMap.x, globalEntityPosition.x);

		// let middleDistance = utils.distance(globalEntityPosition.x, globalEntityPosition.y, config.width/2, config.height/2);
		// // console.log(middleDistance);
		// if(middleDistance > 20){
		// 	// this.worldMap.x = config.width / 2 - globalEntityPosition.x
		// 	// console.log(config.width / 2 , globalEntityPosition.x, globalWorldPosition.x);
		// 	TweenLite.to(this.worldMap, 1 ,{x:config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x, y:config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y});
		// }
		// console.log(middleDistance);
		// if(middleDistance >  config.width * 0.1){
		// 	let percentageOfMiddleX = middleDistance / config.width * 0.2;
		// 	this.velocityPlus.x = this.cameraSpeed.x * percentageOfMiddleX;
		// }
		// if(middleDistance >  config.height * 0.1){
		// 	let percentageOfMiddleY = middleDistance / config.height * 0.2;
		// 	this.velocityPlus.y = this.cameraSpeed.y * percentageOfMiddleY;
		// }


		// if(this.cameraDelay.x > 0){
		// 	// console.log(delta);
		// 	this.cameraDelay.x -= delta;
		// }
		// //console.log(this.cameraDelay.x);
		// if(this.virtualVelocity.x != 0){
		// 	this.cameraMoving.x = true;
		// }else{
		// 	this.cameraMoving.x = false;
		// }

		//this.updateX(globalEntityPosition);
		//this.updateY(globalEntityPosition);


		//this.worldMap.x += (this.velocity.x + this.velocityPlus.x) * delta // this.entityFollow.standardScale;
		//this.worldMap.y += (this.velocity.y + this.velocityPlus.y) * delta // this.entityFollow.standardScale;
	}
	
}