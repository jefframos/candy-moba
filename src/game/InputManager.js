import Gamepad from './Gamepad'
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
		//document.body.on('keydown', this.getKey.bind(this));		
	}
	debugAxes(id){
		let str = '';
		for (var i = 2; i < navigator.getGamepads()[id].axes.length; i++) {
			str += (i+':'+navigator.getGamepads()[id].axes[i]+' ');
		}
		// console.log(navigator.getGamepads()[id].buttons[4]);
		console.log(str);
	}
	debugButtons(id){
		let str = '';
		for (var i = 0; i < navigator.getGamepads()[id].buttons.length; i++) {
			str += (i+':'+navigator.getGamepads()[id].buttons[i].value+' ');
		}
		// console.log(navigator.getGamepads()[id].buttons[4]);
		console.log(str);
	}
	updateDpad(id){
		if(navigator.getGamepads()[id].axes[4] == 1){
			this.leftAxes[0] = 1;
		}
		else if(navigator.getGamepads()[id].axes[9] <= 0.75 && navigator.getGamepads()[id].axes[9] > 0.15){
			this.leftAxes[0] = -1;
		}
		if(navigator.getGamepads()[id].axes[9] == -1){
			this.leftAxes[1] = -1;
		}
		else if(navigator.getGamepads()[id].axes[9] <= 0.15 && navigator.getGamepads()[id].axes[9] > 0){
			this.leftAxes[1] = 1;
		}
		//console.log(navigator.getGamepads()[id].axes[9])
	}
	update(){
		let id = navigator.getGamepads()[2]?2:1;

		if(!navigator.getGamepads()[id]){
			return;
		}
		
		//this.debugAxes(id);

		let hAxe = navigator.getGamepads()[1].axes[0].toFixed(2);
		let vAxe = navigator.getGamepads()[1].axes[1].toFixed(2);

		// hAxe *= 1.5;		
		// vAxe *= 1.5;

		this.leftAxes = [hAxe, vAxe];
		//this.debugButtons(id)
		this.updateDpad(id);

		if(navigator.getGamepads()[id].buttons[4].value){
			this.act('space');
			this.usingGamepad = true;
		}else{
			this.stopAct('space');
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
			this.addKey('space')
			this.usingGamepad = false;
		}else if(e.keyCode === 87 || e.keyCode === 38){
			this.addKey('up')
			this.leftAxes[1] = -1;
			this.usingGamepad = false;
		}

		this.game.updateKeyDown()
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
			// this.game.stopAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.removeKey('right')
			this.leftAxes[0] = 0;
			key = 'right';
			this.usingGamepad = false;
			// this.game.stopAction('right');
		}
		else if(e.keyCode === 32){
			this.removeKey('space')
			key = 'space';
			this.usingGamepad = false;
			// this.game.stopAction('space');
		}
		else if(e.keyCode === 87 || e.keyCode === 38){
			this.removeKey('up')
			this.leftAxes[1] = 0;
			this.usingGamepad = false;
			//// this.game.updateAction('up');
			key = 'up';
			// this.game.stopAction('up');
		}

		this.game.updateKeyUp(key)
    }
}