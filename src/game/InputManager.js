// import Gamepad from './Gamepad'
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
		//document.body.on('keydown', this.getKey.bind(this));	
		// this.usingGamepad = false;	
	}
	debugAxes(id){
		let str = '';
		for (var i = 2; i < navigator.getGamepads()[this.currentGamepad].axes.length; i++) {
			str += (i+':'+navigator.getGamepads()[this.currentGamepad].axes[i]+' ');
		}
		// console.log(navigator.getGamepads()[this.currentGamepad].buttons[4]);
		console.log(str);
	}
	debugButtons(id){
		let str = '';
		for (var i = 0; i < navigator.getGamepads()[this.currentGamepad].buttons.length; i++) {
			str += (i+':'+navigator.getGamepads()[this.currentGamepad].buttons[i].value+' ');
		}
		// console.log(navigator.getGamepads()[this.currentGamepad].buttons[4]);
		console.log(str);
	}
	updateDpad(id){
		if(navigator.getGamepads()[this.currentGamepad].axes[4] == 1){
			this.leftAxes[0] = 1;
		}
		else if(navigator.getGamepads()[this.currentGamepad].axes[9] <= 0.75 && navigator.getGamepads()[this.currentGamepad].axes[9] > 0.15){
			this.leftAxes[0] = -1;
		}
		if(navigator.getGamepads()[this.currentGamepad].axes[9] == -1){
			this.leftAxes[1] = -1;
		}
		else if(navigator.getGamepads()[this.currentGamepad].axes[9] <= 0.15 && navigator.getGamepads()[this.currentGamepad].axes[9] > 0){
			this.leftAxes[1] = 1;
		}
		//console.log(navigator.getGamepads()[this.currentGamepad].axes[9])
	}
	update(){

		if(this.currentGamepad < 0){

			let gamepadList = navigator.getGamepads();

			for (var i = 0; i < gamepadList.length; i++) {
				if(gamepadList[i] && gamepadList[i].buttons && gamepadList[i].buttons.length > 11){
					if(gamepadList[i].buttons[11].value){
						console.log('achou');
						this.currentGamepad = i//gamepadList[i];
						window.currentGamepad = i;
						break
					}
					// for (var j = 0; j < gamepadList[i].buttons.length; j++) {
					// 	if(gamepadList[j].buttons[11].value){
					// 		navigator.getGamepads()[this.currentGamepad] = gamepadList[i];
					// 	}
					// }
				}
			}

			// console.log(navigator.getGamepads()[this.currentGamepad]);
		}
		//let id = navigator.getGamepads()[2]?2:1;

		//console.log(id);
		this.leftAxes = [0, 0];
		//console.log(navigator.getGamepads()[this.currentGamepad]);
		//this.debugButtons(id)
		if(this.currentGamepad < 0){
			//this.game.updateKeyDown()
			//this.game.updateKeyUp();
			return;
		}
		// console.log(navigator.getGamepads()[this.currentGamepad].axes);

		if(navigator.getGamepads()[this.currentGamepad].buttons[11].value){
			this.usingGamepad = true;
		}
		if(navigator.getGamepads()[this.currentGamepad].buttons[10].value){
			this.usingGamepad = false;
		}
		if(!this.usingGamepad){
			return;
		}
		//this.debugAxes(id);

		// console.log(this.usingGamepad);
		let hAxe = navigator.getGamepads()[this.currentGamepad].axes[0].toFixed(2);
		let vAxe = navigator.getGamepads()[this.currentGamepad].axes[1].toFixed(2);

		//console.log(navigator.getGamepads()[this.currentGamepad].axes);

		// hAxe *= 1.5;		
		// vAxe *= 1.5;

		this.leftAxes = [hAxe, vAxe];

		// console.log(this.leftAxes);
		// this.debugButtons()
		//this.updateDpad(id);

		if(navigator.getGamepads()[this.currentGamepad].buttons[4].value){
			this.act('action1');
			this.usingGamepad = true;
		}else{
			this.stopAct('action1');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[1].value){
			this.act('action2');
			this.usingGamepad = true;
		}else{
			this.stopAct('action2');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[0].value){
			this.act('action4');
			this.usingGamepad = true;
		}else{
			this.stopAct('action4');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[3].value){
			this.act('action3');
			this.usingGamepad = true;
		}else{
			this.stopAct('action3');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[7].value){
			this.act('action5');
			this.usingGamepad = true;
		}else{
			this.stopAct('action5');
		}

		if(navigator.getGamepads()[this.currentGamepad].buttons[6].value){
			this.act('action6');
			this.usingGamepad = true;
		}else{
			this.stopAct('action6');
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

		//this.game.updateAction();
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
		// if(!this.keys){
		// 	this.usingGamepad = true;
		// }
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
    	console.log(this.keys);
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
		}

		this.updateKeyboardInput();
		this.game.updateKeyUp(key)
    }
}