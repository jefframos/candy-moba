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
		//document.body.on('keydown', this.getKey.bind(this));		
	}

	//
    getKey(e){
  //   	if(e.keyCode === 87 || e.keyCode === 38){
		// 	this.game.updateAction('up');
		// }
		if(e.keyCode === 83 || e.keyCode === 40){
			this.game.updateAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.game.updateAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.game.updateAction('right');
		}else if(e.keyCode === 32){
			// this.game.changeFilter();
			this.game.updateAction('space');
		}
    }

    getUpKey(e){
  //   	if(e.keyCode === 83 || e.keyCode === 40){
		// 	this.game.stopAction('down');
		// }
		if(e.keyCode === 83 || e.keyCode === 40){
			this.game.stopAction('down');
		}
		else if(e.keyCode === 65 || e.keyCode === 37){
			this.game.stopAction('left');
		}
		else if(e.keyCode === 68 || e.keyCode === 39){
			this.game.stopAction('right');
		}
		else if(e.keyCode === 32){
			this.game.stopAction('space');
		}
		else if(e.keyCode === 87 || e.keyCode === 38){
			this.game.updateAction('up');
			this.game.stopAction('up');
		}
    }
}