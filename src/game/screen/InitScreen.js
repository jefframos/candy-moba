import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen'

export default class InitScreen extends Screen{
	screenContainer;
	background;
	logoTimer;
	constructor(label){
		super(label);
	}
	build(){
		super.build();
		this.background = new PIXI.Graphics();
		this.background.beginFill(0);
	    this.background.drawRect( 0, 0, config.width, config.height);
		this.addChild(this.background);

		
		this.screenContainer = new PIXI.Container();
		this.addChild(this.screenContainer);

		this.description = new PIXI.Text('by Jeff Ramos',{font : '36px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.description.interactive = true;
		this.description.buttonMode = true;
		utils.addMockRect(this.description, this.description.width, this.description.height)
		this.description.on('tap', this.goToPortfolio.bind(this)).on('click', this.goToPortfolio.bind(this));	

	    this.screenContainer.addChild(this.description);
	    this.description.position.set(config.width - this.description.width - 8,config.height -this.description.height-  8);

	    this.createParticles();
	    	    	    

	    this.planet1 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/planet1.png'))
	    this.planet2 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/planet2.png'))
	    this.planet3 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/planet3.png'))
	    this.planet4 = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/planet4.png'))
	    this.sun = new PIXI.Sprite(PIXI.Texture.fromImage('./assets/sun.png'))

	    // this.addChild(this.planet1);
	    // this.addChild(this.planet2);
	    // this.addChild(this.planet3);
	    // this.addChild(this.planet4);
	    // this.addChild(this.sun);

	    this.sun.anchor.set(0.5);

	    this.planet1.scale.set(0.5);
	    this.planet2.scale.set(0.5);
	    this.planet3.scale.set(0.5);
	    this.planet4.scale.set(0.5);
	    this.sun.scale.set(0.5);

	    this.planet1.position.set(20,20);
	    this.planet2.position.set(150,300);
	    this.planet3.position.set(500,10);
	    this.planet4.position.set(500,300);
	    this.sun.position.set(config.width / 2, config.height / 2);

		this.playButton = this.createButton("");
	    this.addChild(this.screenContainer)
	    this.screenContainer.addChild(this.playButton)

	    this.playButton.position.set(config.width / 2, config.height / 1.5  + config.buttonRadius)
	    utils.centerPivot(this.playButton);

	    //config.effectsLayer.hideGreyShape(1, 1);
	    TweenLite.from(this.buttonShape.scale, 0.5, {delay:config.firstEntry?0:1.2, x:20,y:20});
	    this.playButton.on('tap', this.onPlayButtonClick.bind(this))
	    	.on('click', this.onPlayButtonClick.bind(this));
	    config.effectsLayer.removeBloom();
	    config.firstEntry = true;

	    setTimeout(function(){
			//config.effectsLayer.addRGBSplitter();
		}.bind(this), 400);
    
	}
	goToPortfolio() {
		 window.open('http://www.jefframos.me', '_blank');
	}
	onPlayButtonClick() {
		config.effectsLayer.shakeSplitter(0.4,10,0.5, true);
		config.effectsLayer.shakeSplitter(1,4,0.5);
	}
	toGame(){		
		utils.setGameScreen80(this.targetColor);
		this.screenManager.change("GAME");
	}
	onLogoClick(){
		config.effectsLayer.shake(1,15,1);
		config.effectsLayer.addShockwave(0.5,0.5,0.8);
		config.effectsLayer.shakeSplitter(1,10,1.8);
		config.effectsLayer.fadeBloom(20,0,0.5,0, true);
	}
	shuffleText(label){
		let rnd1 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let rnd2 = Math.floor(Math.random()* 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if(rndPause < 0.2){
			tempLabel[Math.floor(Math.random()*tempLabel.length)] = rnd2;
			tempLabel[Math.floor(Math.random()*tempLabel.length)] = rnd3;
		}else if(rndPause < 0.5){
			tempLabel[Math.floor(Math.random()*tempLabel.length)] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel+=tempLabel[i];
		}
		return returnLabel
	}
	update(delta){
		super.update(delta);
		this.description.text = this.shuffleText('By JEFF RAMOS');
		this.updateParticles(delta);
	}

	createButton (label) {
	    let button = new PIXI.Container()
	    this.buttonShape = new PIXI.Graphics();
	    let color = 0xFFFFFF;
	   
	   	let alphaBG = new PIXI.Graphics();
	    alphaBG.beginFill(0xFF0000);	    
	    alphaBG.drawCircle( -5, -5, config.buttonRadius );
	    alphaBG.alpha = 1;
	    //utils.applyPositionCorrection(button.addChild( utils.addToContainer(alphaBG) ));
	    this.buttonShape.beginFill(color);	    
	    this.buttonShape.drawCircle(0, 0, config.buttonRadius );
	    button.addChild( this.buttonShape)
	    button.interactive = true
	    button.buttonMode = true

	    // utils.addMockObject(button);
	    return button
	}

	createParticles(){
		this.particleUpdater = 0;
		this.particlesContainer = new PIXI.ParticleContainer(500, {
		    scale: true,
		    position: true,
		    rotation: true,
		    uvs: true,
		    alpha: true
		});
		this.addChild(this.particlesContainer);
		this.particles = [];
		for (let i = 0; i < 100; i++)
		{
		    let particle = PIXI.Sprite.fromImage('./assets/particleMini.png');
		    particle.anchor.set(0.5, 1);
		    particle.scale.set(1, 1);
		    let angle = (Math.random() *  (Math.PI * 2));
		    particle.x = config.width / 2 + Math.sin(angle) * Math.random() * config.height;
		    particle.y = config.height / 2 + Math.cos(angle) * Math.random() * config.width;
		    particle.alpha = 0;
		    particle.direction = angle;
		    particle.turningSpeed = 0;
		    particle.speed = Math.random() * 0.001 + 0.001;
		    this.particles.push(particle);
		    this.particlesContainer.addChild(particle);
		}
	}

	updateParticles(delta){
		for (var i = 0; i < this.particleUpdater; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.01;
	        particle.position.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
	        particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y);
	        particle.rotation = -particle.direction + Math.PI;
	        particle.alpha += delta;
	        if(particle.position.x < 0 || particle.position.x > config.width || particle.y < 0 || particle.position.y > config.height){
	        	particle.x = config.width / 2 + Math.sin(particle.direction)* Math.random() * config.height;
		    	particle.y = config.height / 2 + Math.cos(particle.direction)* Math.random() * config.width;
		    	particle.alpha = 0;
	        }
		}
		this.particleUpdater += delta*20;
		if(this.particleUpdater > this.particles.length){
			this.particleUpdater = this.particles.length;
		}
	}
}
