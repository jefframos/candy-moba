// import Gamepad from './Gamepad'
import utils  from '../utils';
export default class InputManager{
	constructor(game){
		this.game = game;
		document.addEventListener('keydown', (event) => {
	  		this.getKey(event);
	   		event.preventDefault()
	 	})
	 	document.addEventListener('keyup', (event) => {
	  		this.getUpKey(event);
	   		event.preventDefault()
	 	})

	 	this.keys = [];

	 	// this.gamep = new Gamepad();
	 	// this.gamep.start();
	 	// window.gamep = this.gamep;
	 	this.leftAxes = [0,0];
	 	this.usingGamepad = false;

	 	this.currentGamepad = -1;
	 	this.gamePadType = -1;
		

		// 'a',
  //           'b',
  //           'x',
  //           'y',
  //           'leftTop',
  //           'rightTop',
  //           'leftTrigger',
  //           'rightTrigger',
  //           'select',
  //           'start',
  //           'leftStick',
  //           'rightStick',
  //           'dpadUp',
  //           'dpadDown',
  //           'dpadLeft',
  //           'dpadRight'

	 	//8bitdo, snes, xbox
	 	this.gamepadsMaxButtons = [16,10,12];
		this.gamepadMap = [];
		this.gamepadMap.push({label:'start', id:[11,9,9]});
		this.gamepadMap.push({label:'select', id:[10,8,8]});
		this.gamepadMap.push({label:'y', id:[4,3,3]});
		this.gamepadMap.push({label:'b', id:[1,2,1]});
		this.gamepadMap.push({label:'a', id:[0,1,0]});
		this.gamepadMap.push({label:'x', id:[3,0,2]});
		this.gamepadMap.push({label:'r', id:[7,6,5]});
		this.gamepadMap.push({label:'l', id:[6,4,4]});
		this.gamepadMap.push({label:'l2', id:[8,7,7]});


		// window.addEventListener("gamepadconnected", function(e) {
		//   var gp = navigator.getGamepads()[0];
		//   console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
		//   gp.index, gp.id,
		//   gp.buttons.length, gp.axes.length);
		// });
		
	}
	getButton(button, type){
		if(type < 0){
			return;
		}
		for (var i = 0; i < this.gamepadMap.length; i++) {
			if(this.gamepadMap[i].label == button){
				return this.gamepadMap[i].id[type];
			}
		}
	}
	debugAxes(id){
		let str = '';
		for (var i = 2; i < navigator.getGamepads()[this.currentGamepad].axes.length; i++) {
			str += (i+':'+navigator.getGamepads()[this.currentGamepad].axes[i]+' ');
		}
		console.log(str);
	}
	debugButtons(id){
		let str = '';
		for (var i = 0; i < navigator.getGamepads()[this.currentGamepad].buttons.length; i++) {
			str += (i+':'+navigator.getGamepads()[this.currentGamepad].buttons[i].value+' ');
		}
		console.log(this.currentGamepad, str);
	}
	updateDpad(){
		//l
		let dValue = navigator.getGamepads()[this.currentGamepad].axes[9];
		//console.log(dValue);
		if(utils.distance(dValue,0,0.7,0) < 0.1){
			this.leftAxes[0] = -1;
		}//r
		else if(utils.distance(dValue,0,-0.4,0) < 0.1){
			this.leftAxes[0] = 1;
		}//up
		if(utils.distance(dValue,0,-1,0) < 0.1){
			this.leftAxes[1] = -1;
		}//d
		else if(utils.distance(dValue,0,0.14,0) < 0.1){
			this.leftAxes[1] = 1;
		}
	}
	update(){

// this.currentGamepad = 3
		// this.debugButtons();

		// this.console.log(this);
		// this.currentGamepad = 0;
		// this.gamePadType = 0;
		// this.debugButtons();

		// return

		if(this.currentGamepad < 0){

			let gamepadList = navigator.getGamepads();

			for (var i = 0; i < gamepadList.length; i++) {
				if(gamepadList[i] && gamepadList[i].buttons && gamepadList[i].buttons.length > 5)
				{
					for (var j = 0; j < this.gamepadMap[0].id.length; j++) {

						let tempGamepad = navigator.getGamepads()[i];
						if(tempGamepad.buttons.length == this.gamepadsMaxButtons[j]&&
							tempGamepad.buttons[this.getButton('start', j)]&&
							tempGamepad.buttons[this.getButton('start', j)].value){
							this.currentGamepad = i;
							this.gamePadType = j;
							break;
						}
					}
				} 
				
			}
		}

		this.leftAxes = [0, 0];
		this.rightAxes = [0, 0];
		if(this.currentGamepad < 0){
			return;
		}
		

		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('start', this.gamePadType)].value){
			this.usingGamepad = true;
		}
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('select', this.gamePadType)].value){
			this.usingGamepad = false;
			this.currentGamepad = -1;
		}
		if(!this.usingGamepad){
			return;
		}

		//get axis
		let hAxe = navigator.getGamepads()[this.currentGamepad].axes[0].toFixed(2);
		let vAxe = navigator.getGamepads()[this.currentGamepad].axes[1].toFixed(2);

		if(navigator.getGamepads()[this.currentGamepad].axes && navigator.getGamepads()[this.currentGamepad].axes.length >= 5){
			let RhAxe = navigator.getGamepads()[this.currentGamepad].axes[2].toFixed(2);
			let RvAxe = navigator.getGamepads()[this.currentGamepad].axes[5].toFixed(2);
			this.rightAxes = [RhAxe, RvAxe];
		}
		
		this.leftAxes = [hAxe, vAxe];

		// if(this.gamePadType == 0){
		// 	this.updateDpad();
		// }


		//this.debugButtons();

		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('y', this.gamePadType)].value){
			this.act('action1');
			this.usingGamepad = true;
		}else{
			this.stopAct('action1');
		}

//1B
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('b', this.gamePadType)].value){
			this.act('action2');
			this.usingGamepad = true;
		}else{
			this.stopAct('action2');
		}

//0 A
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('a', this.gamePadType)].value){
			this.act('action4');
			this.usingGamepad = true;
		}else{
			this.stopAct('action4');
		}

//3 X
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('x', this.gamePadType)].value){
			this.act('action3');
			this.usingGamepad = true;
		}else{
			this.stopAct('action3');
		}
//7 R
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('r', this.gamePadType)].value){
			this.act('action5');
			this.usingGamepad = true;
		}else{
			this.stopAct('action5');
		}
//6 R
		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('l', this.gamePadType)].value){
			this.act('action6');
			this.usingGamepad = true;
		}else{
			this.stopAct('action6');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[this.getButton('l2', this.gamePadType)].value){
			this.act('action7');
			this.usingGamepad = true;
		}else{
			this.stopAct('action7');
		}

		if(this.leftAxes[0] < -0.1){
			this.act('left');
			this.usingGamepad = true;
		}else if(this.leftAxes[0] > 0.1){
			this.act('right');
			this.usingGamepad = true;
		}else if (this.usingGamepad){
			this.stopAct('left')
			this.stopAct('right')
		}
		if(this.leftAxes[1] < -0.1){
			this.act('up');
			this.usingGamepad = true;
		}else if(this.leftAxes[1] > 0.1){
			this.act('down');
			this.usingGamepad = true;
		}else if (this.usingGamepad){
			this.stopAct('up')
			this.stopAct('down')
		}

	}
	stopAct(type){
		this.removeKey(type)
		this.game.updateKeyUp(type)
	}
	act(type){
		this.addKey(type);
		this.game.updateKeyDown()
	}
	//
    getKey(e){
  //   	if(e.keyCode === 87 || e.keyCode === 38){
			//// this.game.updateAction('up');
		// }
		if(e.keyCode === 83 || e.keyCode === 40){
			this.addKey('down')
			this.leftAxes[1] = 1;
			this.usingGamepad = false;
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.addKey('left')
			this.leftAxes[0] = -1;
			this.usingGamepad = false;
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.addKey('right')
			this.leftAxes[0] = 1;
			this.usingGamepad = false;
		}else if(e.keyCode === 32){
			this.addKey('action1')
			this.usingGamepad = false;
		}else if(e.keyCode === 87 || e.keyCode === 38){
			this.addKey('up')
			this.leftAxes[1] = -1;
			this.usingGamepad = false;
		}
		else if(e.keyCode === 90){
			this.addKey('action2')
			this.usingGamepad = false;
		}
		else if(e.keyCode === 88){
			this.addKey('action3')
			this.usingGamepad = false;
		}
		else if(e.keyCode === 67){
			this.addKey('action4')
			this.usingGamepad = false;
		}
		else if(e.keyCode === 86){
			this.addKey('action5')
			this.usingGamepad = false;
		}
		else if(e.keyCode === 107 || e.keyCode === 187){
			this.addKey('zoomIn')
			// this.usingGamepad = false;
		}else if(e.keyCode === 189 || e.keyCode === 109){
			this.addKey('zoomOut')
			// this.usingGamepad = false;
		}else if(e.keyCode === 16 || e.keyCode === 16){
			this.addKey('action7')
			// this.usingGamepad = false;
		}else if(e.keyCode === 27){
			this.addKey('action8')
			// this.usingGamepad = false;
		}
		 console.log(e.keyCode);
		// if(!this.keys){
		// 	this.usingGamepad = true;
		// }107 187+ 189 109 -
		this.updateKeyboardInput()
		this.game.updateKeyDown()
    }

    updateKeyboardInput(){
    	for (var i = 0; i < this.keys.length; i++) {
    		switch(this.keys[i]){
    			case 'up':
					this.leftAxes[1] = -1;
    			break;
    			case 'down':
					this.leftAxes[1] = 1;
    			break;
    			case 'left':
					this.leftAxes[0] = -1;
    			break;
    			case 'right':
					this.leftAxes[0] = 1;
    			break;			
    		}
    	}
    	// console.log(this.keys);
    }
    removeKey(key){
    	for (var i = 0; i < this.keys.length; i++) {
    		if(this.keys[i] == key){
    			this.keys.splice(i,1);
    			break;
    		}
    	}
    }
    addKey(key){
    	let have = false;
    	for (var i = 0; i < this.keys.length; i++) {
    		if(this.keys[i] == key){
    			have = true;
    			break;
    		}
    	}
    	if(!have){
    		this.keys.push(key)
    	}
    }
    getUpKey(e){
  //   	if(e.keyCode === 83 || e.keyCode === 40){
		// 	this.game.stopAction('down');
		// }
		let key = '';
		if(e.keyCode === 83 || e.keyCode === 40){
			this.removeKey('down')
			this.leftAxes[1] = 0;
			key = 'down';
			this.usingGamepad = false;
			// this.game.stopAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.removeKey('left')
			this.leftAxes[0] = 0;			
			key = 'left';
			this.usingGamepad = false;
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.removeKey('right')
			this.leftAxes[0] = 0;
			key = 'right';
			this.usingGamepad = false;
		}
		else if(e.keyCode === 32){
			this.removeKey('action1')
			key = 'action1';
			this.usingGamepad = false;
		}
		else if(e.keyCode === 87 || e.keyCode === 38){
			this.removeKey('up')
			this.leftAxes[1] = 0;
			this.usingGamepad = false;
			key = 'up';
		}
		else if(e.keyCode === 90){
			this.removeKey('action2')
			this.usingGamepad = false;
			key = 'action2';
		}
		else if(e.keyCode === 88){
			this.removeKey('action3')
			this.usingGamepad = false;
			key = 'action3';
		}
		else if(e.keyCode === 67){
			this.removeKey('action4')
			this.usingGamepad = false;
			key = 'action4';
		}
		else if(e.keyCode === 86){
			this.removeKey('action5')
			this.usingGamepad = false;
			key = 'action5';
		}else if(e.keyCode === 107 || e.keyCode === 187){
			this.removeKey('zoomIn')
			key = 'zoomIn';
			// this.usingGamepad = false;
		}else if(e.keyCode === 189 || e.keyCode === 109){
			this.removeKey('zoomOut')
			key = 'zoomOut';
			// this.usingGamepad = false;
		}else if(e.keyCode === 16 || e.keyCode === 16){
			this.removeKey('action7')
			key = 'action7';
			// this.usingGamepad = false;
		}else if(e.keyCode === 27){
			this.removeKey('action8')
			key = 'action8';
			// this.usingGamepad = false;
		}

		this.updateKeyboardInput();
		this.game.updateKeyUp(key)
    }
}