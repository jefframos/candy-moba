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
		this.currentZoom = 1;
		this.maxZoom = 1.1;
		// this.maxZoom = 1.2;
		this.minZoom = 0.055;
		//se a distancia minima da camera for pequena, parece que o cara ta bebado
	}
	
	follow(entity){
		this.entityFollow = entity;

		console.log('FOLLOW');
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
	
	zoomOut(value){
		return
		this.currentZoom -= value?value:0.1;
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom2(value){
		this.currentZoom += value;
		if(this.currentZoom > this.maxZoom){
			this.currentZoom = this.maxZoom;
		}
		if(this.currentZoom < this.minZoom){
			this.currentZoom = this.minZoom;
		}
		this.zoom(this.currentZoom)
	}
	zoom(value, time, delay){


		this.currentZoom = value;		
		TweenLite.to(this.worldMap.scale, time?time:0.5, {delay:delay?delay:0, x:this.currentZoom, y:this.currentZoom});//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
		//this.worldMap.scale.set(value);//, onUpdate:this.updatePosition.bind(this), onUpdateParams:[true]});
	}
	updatePosition(force){

		if(force){
			console.log('force');
		}
		let globalEntityPosition = this.entityFollow.toGlobal(new PIXI.Point());
		let globalWorldPosition = this.worldMap.toGlobal(new PIXI.Point());
		// console.log(this.worldMap.x, globalEntityPosition.x);

		if(force){
			//this.worldMap.x = (config.width / 2) - (globalEntityPosition.x)* this.worldMap.scale.x +  (globalWorldPosition.x) * this.worldMap.scale.x;
			//this.worldMap.y = (config.height / 2) - (globalEntityPosition.y)* this.worldMap.scale.y +  (globalWorldPosition.y)  * this.worldMap.scale.y;

//			TweenLite.to(this.worldMap, 0.1 ,{x:config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x, y:config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y});

			// let tempW = this.worldMap.width/this.worldMap.scale.x;
			// let tempH = this.worldMap.height/this.worldMap.scale.y;

			this.worldMap.pivot.x =this.entityFollow.x// -(this.entityFollow.x - tempW)// * this.worldMap.scale.x//((config.width / 2) - (globalEntityPosition.x) +  (globalWorldPosition.x))/2 
			this.worldMap.pivot.y = this.entityFollow.y//-(this.entityFollow.y - tempH) //* this.worldMap.scale.y//((config.height / 2) - (globalEntityPosition.y) +  (globalWorldPosition.y))/2

			this.worldMap.x = config.width / 2//-this.worldMap.pivot.x/2;
			this.worldMap.y = config.height / 2//-this.worldMap.pivot.y/2;


			// console.log(this.worldMap.width/this.worldMap.scale.x);
		//console.log(this.worldMap.x, force);
			return
		}

		let middleDistance = utils.distance(globalEntityPosition.x, globalEntityPosition.y, config.width/2, config.height/2);
		// console.log(middleDistance);
		if(middleDistance > 20){
			// this.worldMap.pivot.x =this.entityFollow.x
			// this.worldMap.pivot.y = this.entityFollow.y
			// this.worldMap.x = config.width / 2 - globalEntityPosition.x
			// console.log(config.width / 2 , globalEntityPosition.x, globalWorldPosition.x);
			TweenLite.to(this.worldMap.pivot, 1 ,{x:this.entityFollow.x, y:this.entityFollow.y});
			TweenLite.to(this.worldMap, 1 ,{x:config.width / 2, y:config.height / 2});
			//TweenLite.to(this.worldMap, 1 ,{x:config.width / 2 - globalEntityPosition.x +  globalWorldPosition.x, y:config.height / 2 - globalEntityPosition.y +  globalWorldPosition.y});
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