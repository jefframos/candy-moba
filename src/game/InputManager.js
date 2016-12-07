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
		//document.body.on('keydown', this.getKey.bind(this));		
	}

	//
    getKey(e){
  //   	if(e.keyCode === 87 || e.keyCode === 38){
		// 	this.game.updateAction('up');
		// }
		if(e.keyCode === 83 || e.keyCode === 40){
			this.addKey('down')
			this.game.updateAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.addKey('left')
			this.game.updateAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.addKey('right')
			this.game.updateAction('right');
		}else if(e.keyCode === 32){
			this.addKey('space')
			// this.game.changeFilter();
			this.game.updateAction('space');
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
			key = 'down';
			// this.game.stopAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.removeKey('left')
			key = 'left';
			// this.game.stopAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.removeKey('right')
			key = 'right';
			// this.game.stopAction('right');
		}
		else if(e.keyCode === 32){
			this.removeKey('space')
			key = 'space';
			// this.game.stopAction('space');
		}
		else if(e.keyCode === 87 || e.keyCode === 38){
			this.removeKey('up')
			//this.game.updateAction('up');
			key = 'up';
			// this.game.stopAction('up');
		}

		this.game.updateKeyUp(key)
    }
}