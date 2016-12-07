import PIXI from 'pixi.js';
import TweenLite from 'gsap';
import config  from '../../config';
import InputManager  from '../InputManager';
import CookieManager  from '../CookieManager';
import utils  from '../../utils';
import Screen from '../../screenManager/Screen';

export default class GameScreen extends Screen{
	constructor(label){
		super(label);

		this.shapes = [
		{shape:
		[
			[0,0,0,0],
			[0,1,1,0],
			[0,1,1,0],
			[0,0,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,1,0],
			[0,1,1,0,0],
			[0,0,0,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,1,1,0,0],
			[0,0,1,1,0],
			[0,0,0,0,0],
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,1,1,1,0],
			[0,0,0,0,0],			
		], type:"STANDARD"},
		{shape:[
			[0,0,0,0,0],
			[0,0,0,0,0],
			[0,0,1,0,0],
			[0,0,1,0,0],			
		], type:"SHOOTER"},
		{shape:[
			[0,0,0,0],
			[0,0,0,0],
			[0,0,0,0],
			[0,1,1,0],			
		], type:"BRICK_BREAKER"},
		]

		this.whatPiece = {shape:[
			[0,0,1,0,0],
			[0,1,0,1,0],
			[0,0,0,1,0],
			[0,0,1,0,0],			
			[0,0,0,0,0],			
			[0,0,1,0,0],			
		], type:"WHAT"}

		this.bestScore = 0//config.cookieManager.getCookie("bestPoints");
		this.gameTitle = "Simple\nBRICK GAME";
		this.addEvents();

	}

	shuffleText(label){
		let rnd1 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let rnd2 = Math.floor(Math.random()* 9);
		let rnd3 = String.fromCharCode(Math.floor(Math.random()*20) + 65);
		let tempLabel = label.split('');
		let rndPause = Math.random();
		if(rndPause < 0.2){
			let pos1 = Math.floor(Math.random()*tempLabel.length);
			let pos2 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos1] != '\n')
				tempLabel[pos1] = rnd2;
			if(tempLabel[pos2] != '\n')
				tempLabel[pos2] = rnd3;
		}else if(rndPause < 0.5){
			let pos3 = Math.floor(Math.random()*tempLabel.length);
			if(tempLabel[pos3] != '\n')
				tempLabel[pos3] = rnd3;
		}
		let returnLabel = '';
		for (var i = 0; i < tempLabel.length; i++) {
			returnLabel+=tempLabel[i];
		}
		return returnLabel
	}
	goToPortfolio() {
		 window.open('http://www.jefframos.me', '_blank');
	}
	build(){
		super.build();
		//create background shape
		this.background = new PIXI.Graphics();
		this.background.beginFill(0xFFFFFF);
	    this.background.drawRect( -100, -100, config.width + 200, config.height+ 200);
		this.addChild(this.background);
		this.backgroundColor = 0x101010;
		this.backgroundStandardColor = 0x101010;
		this.background.tint = this.backgroundColor;
		
		this.bulletList = [];
		this.createParticles();

		this.gameContainer = new PIXI.Container();
		this.gameQueueContainer = new PIXI.Container();
		this.gameBorderContainer = new PIXI.Container();
		this.gameInfoContainer = new PIXI.Container();
		this.gameComboBarContainer = new PIXI.Container();
		this.inGameButtons = new PIXI.Container();
		this.gameMatrix = [];
		

		this.filterLabel = "JUST";
		this.filterDescription = new PIXI.Text(this.filterLabel,{font : '50px super_smash_tvregular', fill : 0xBBBBBB, align : 'center'});
		this.filterDescription.alpha = 0;

		this.creatorLabel = new PIXI.Text('by Jeff Ramos',{font : '24px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.creatorLabel.interactive = true;
		this.creatorLabel.buttonMode = true;
		utils.addMockRect(this.creatorLabel, this.creatorLabel.width, this.creatorLabel.height);
		this.creatorLabel.on('tap', this.goToPortfolio.bind(this)).on('click', this.goToPortfolio.bind(this));
		this.addChild(this.creatorLabel);
		this.creatorLabel.position.x = config.width - this.creatorLabel.width;
		this.creatorLabel.position.y = 20;
		// config.effectsLayer.removePixelate();
		// config.effectsLayer.shake(1,15,1);
		// config.effectsLayer.addShockwave(0.5,0.5,0.8);
		// config.effectsLayer.shakeSplitter(1,10,1.8);
		this.labelPoints = new PIXI.Text('0000000',{font : '70px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.addChild(this.labelPoints);
		this.labelPoints.position.x = config.width - this.labelPoints.width;
		this.labelPoints.position.y = 80;
		this.labelPoints.alpha = 0;

		this.currentLevel = 1;
		this.labelLevel = new PIXI.Text('Level: '+this.currentLevel,{font : '40px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.addChild(this.labelLevel);
		this.labelLevel.position.x = 5;
		this.labelLevel.position.y = 90;
		this.labelLevel.alpha = 0;

		this.labelBestScore = new PIXI.Text("BEST SCORE: "+this.bestScore,{font : '20px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.addChild(this.labelBestScore);
		this.labelBestScore.position.x = config.width - this.labelBestScore.width - 5;
		this.labelBestScore.position.y = 60;
		this.labelBestScore.alpha = 0;

		this.labelTitle = new PIXI.Text('Just a simple\nTETRIS?',{font : '45px super_smash_tvregular', fill : 0xFFFFFF, align : 'center'});
		this.addChild(this.labelTitle);
		this.labelTitle.position.x = config.width / 2 - this.labelTitle.width / 2;
		this.labelTitle.position.y = 70;
		this.labelTitle.alpha = 0;



		this.addChild(this.gameContainer);
		this.addChild(this.gameQueueContainer);
		this.addChild(this.gameBorderContainer);
		this.addChild(this.gameInfoContainer);
		this.addChild(this.gameComboBarContainer);
		this.addChild(this.inGameButtons);
		this.drawComboContainer();

		this.gameComboBarContainer.position.x = 0;
		this.gameComboBarContainer.position.y = this.labelPoints.position.y + this.labelPoints.height;

		this.initGame();


		this.gameContainer.position.x = config.width / 2 - this.gameContainer.width / 2;
		this.gameContainer.position.y = config.height / 2 - this.gameContainer.height / 2 + 40;
		
		this.gameContainer.pivot.x = this.gameContainer.width / 2;
		this.gameContainer.pivot.y = this.gameContainer.height / 2;

		this.gameContainer.position.x += this.gameContainer.pivot.x;
		this.gameContainer.position.y += this.gameContainer.pivot.y;

		//gambiarra pra mudar a borda
		this.gameBorderContainer.pivot.x = this.gameContainer.pivot.x;
		this.gameBorderContainer.pivot.y = this.gameContainer.pivot.y;
		
		this.gameBorderContainer.position.x = this.gameContainer.position.x;
		this.gameBorderContainer.position.y = this.gameContainer.position.y;


		this.gameBorderContainer.addChild(this.border);


		let descriptionNext = new PIXI.Text('NEXT',{font : '40px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		this.gameQueueContainer.position.y = this.gameContainer.position.y - this.gameContainer.pivot.y;
		//this.gameQueueContainer.addChild(descriptionNext);
		this.gameQueueContainer.alpha = 0;
		// descriptionNext.position.x = 20;

		this.filterDescription.position.x = this.gameBorderContainer.width / 2 - this.filterDescription.width / 2;
		this.filterDescription.position.y = this.gameBorderContainer.height / 2 - this.filterDescription.height;
		

		//utils.correctPosition(this.gameContainer);

		this.inputManager = new InputManager(this);
		// config.effectsLayer.removeBloom();
		// setTimeout(function(){
		// 	config.effectsLayer.addRGBSplitter();
		// }.bind(this), 300);
		
	}
	updateCurrentLevel(){

		if(this.currentLevel > 20){
			this.currentLevel = 20;
		}
		this.labelLevel.text = 'Level: '+this.currentLevel;

		if(this.points > 0){
			this.gameLevelSpeed = this.gameLevelSpeedMax - this.currentLevel * 0.1;
		}

		if(this.gameLevelSpeed < 0.09){
			this.gameLevelSpeed = 0.09;
		}


	}
	updateComboBar(){
		this.comboBar.scale.x = this.comboTimer / this.comboMaxTimer;
		if(this.comboTimer <= 0){
			this.comboCounter = 0;
		}
		this.comboBar.tint = this.currentColor;
	}
	addCombo(){
		this.comboTimer = this.comboMaxTimer;
		if(this.comboTimer > 0){
			this.comboCounter ++;
		}
		this.comboAddList = ["GOOD", "NICE", "GREAT", "SEXY", "AWESOME"];
		let comboWordID = Math.floor(this.comboCounter / 5);
		if(comboWordID >= this.comboAddList.length){
			comboWordID = this.comboAddList.length - 1;
		}
		if(this.comboCounter > 1){

			this.addInfoLabel(["x" + this.comboCounter,"", this.comboAddList[comboWordID]], true);
		}

	}
	drawComboContainer(){

		this.comboBar = new PIXI.Graphics();
		this.comboBar.beginFill( 0xFFFFFF );
	    this.comboBar.drawRect(0,-10,config.width, 10);
		this.gameComboBarContainer.addChild(this.comboBar);

	}
	drawShapeOnList(array){
		let shape = new PIXI.Container();
		let starterPosition = {x:0,y:0};
		for (var i = 0; i < array.length; i++) {
			for (var j = 0; j < array[i].length; j++) {
				if(array[i][j]){
					let currentEntity = this.drawSquare(this.currentColor);
					currentEntity.position.x = starterPosition.x + j * config.pieceSize;
					currentEntity.position.y = i * config.pieceSize - (array[i].length - 2) * config.pieceSize - config.pieceSize/2 + starterPosition.y;
					shape.addChild(currentEntity);
				}
			}
		}
		return shape;
	}
	//FILTERS
	starterEffect(){
		config.effectsLayer.removeAllFilters();
		config.effectsLayer.updateRGBSplitter(5);
		config.effectsLayer.fadeSplitter(1,3,0.2);		
		config.effectsLayer.addPixelate();
	}
	removeFilter(){
		switch(this.currentEffectID){
			case 0:
				//this.currentEffect = "INVERT";
				config.effectsLayer.removeInvert();
				config.effectsLayer.removeAllFilters();
			break
			// case 1:
			// 	//this.currentEffect = "CROSS";
			// 	config.effectsLayer.removeAllFilters();
			// break
			case 2:
				//this.currentEffect = "ASCII";
				//config.effectsLayer.removeAllFilters();
			break
			case 3:
				this.gameContainer.scale.y = 1;
				this.gameBorderContainer.scale.y = 1;
			break
			case 4:
				this.gameContainer.scale.x = 1;
				this.gameBorderContainer.scale.x = 1;
				this.gameQueueContainer.alpha = 1;
			case 5:
				config.effectsLayer.removeAllFilters();
			case 6:
				config.effectsLayer.removeAllFilters();
			case 7:
				this.randomizeCrazy = false;
			default:
				config.effectsLayer.removeAllFilters();
				this.linearParticles();
				break
		}
	}
	changeFilter(effect){
		let nextID = this.currentEffectID;
		if(this.currentEffectID >= 0){
			nextID = -1;
		}else{
			//nao shuffle
			nextID = Math.floor(Math.random() * 8)
		}
		



		if(this.scoring > 4){
			// if(Math.random() < this.rotatingCrazy ? 0.1 : 0.05){
			// 	this.crazyCurrentPieces();
			// }


			if(Math.random() < (0.05 + this.currentLevel * 0.01)){
				this.changeBackgroundColor();
			}
			// if(Math.random() < this.rotatingCrazy ? 0.1 : 0.05){
			// 	this.removeOneColum();
			// }

			// if(Math.random() < this.rotatingCrazy ? 0.1 : 0.05){
			// 	this.addRandomBomb();
			// }

			if(!this.rotatingCrazy && Math.random() < (0.01 + this.currentLevel * 0.01)){
				this.fallForRandomSide();
			}
		}


		this.standardLabels = ['SIMPLE','JUICY','FUN','CRAZY?','INSANE','BRICK','WHY']
		this.filterLabel = this.standardLabels[Math.floor(Math.random()*this.standardLabels.length)];

		this.removeFilter();
		this.starterEffect();
		//nextID = 4
		// config.effectsLayer.updatePixelate(config.pixelSize,config.pixelSize);
		switch(nextID){
			case 0:
				//this.currentEffect = "INVERT";
				config.effectsLayer.addInvert();
				config.effectsLayer.shakeSplitter(1,6,0.3);
				this.addInfoLabel(["INVERT",["COLOR"]])
			break
			// case 1:
			// 	config.effectsLayer.fadeSplitter(-5, 3, 0);
			// 	//this.currentEffect = "CROSS";
			// 	config.effectsLayer.removeAllFilters();
			// 	config.effectsLayer.addCrossHatch();
			// 	this.addInfoLabel(["CROSS"])
			// break
			case 2:
				config.effectsLayer.shakeSplitter(1,80,5);
				this.addInfoLabel(["EARTHQUAKE"])
				//this.currentEffect = "ASCII";
				// config.effectsLayer.removeAllFilters();
				// config.effectsLayer.addAscii();
				// this.scale.y = -1;
				// this.position.y += config.height;
				// this.addInfoLabel(["OLD\nTIMES"])
			break
			case 3:
				if(this.currentLevel > 2){
					this.gameContainer.scale.y = -1;
					this.gameBorderContainer.scale.y = -1;
					config.effectsLayer.removeAllFilters();
				 	config.effectsLayer.fadeBloom(20,0,0.5,0, true);
					config.effectsLayer.shakeSplitter(1,6,0.3);
					this.addInfoLabel(["INVERT Y"])
				}
			break
			case 4:
				if(this.currentLevel > 3){
					this.gameContainer.scale.x = -1;
					this.gameBorderContainer.scale.x = -1;
					config.effectsLayer.removeAllFilters();
				 	config.effectsLayer.fadeBloom(20,0,0.5,0, true);
					config.effectsLayer.shakeSplitter(1,6,0.3);
					this.addInfoLabel(["X TREVNI"]);
					this.gameQueueContainer.alpha = 0;
				}

			break
			case 5:
				config.effectsLayer.shakeSplitter(1,6,0.3);
				config.effectsLayer.addGray();
				config.effectsLayer.addBlur();
				this.addInfoLabel(["NOT COOL"])
			break
			case 6:
				config.effectsLayer.addGlitch2();
				this.addInfoLabel(["3RRORR"])
				//config.effectsLayer.addBloom();
			break
			case 7:
				if(this.currentLevel > 4){
					this.randomizeCrazy = true;
					this.randomParticles();
					this.addInfoLabel(["SHUFFLE"])
				}
			break
			default:
				
				break
			break
		}
		this.currentEffectID = nextID;
	}
	//END FILTERS
	printMatrix(shapeArray){
		let tempLine;
		let toPrint = '';
		for (var i = 0; i < shapeArray.length; i++) {
			tempLine = '';
			for (var j = 0; j < shapeArray[i].length; j++) {
				tempLine += shapeArray[i][j]
			}
			toPrint += tempLine +'\n';
		}
		// console.log(toPrint);
	}
	rotateMatrixRight(shapeArray){
    	let temp = new Array(shapeArray.length);
	    for(let i = 0; i < temp.length; ++i){
	        temp[i] = new Array(temp.length);
	        for (let j = 0; j < temp.length; ++j){
	            temp[i][j] = shapeArray[temp.length - j - 1][i];
	        }
	    }
	    return temp;
	}
	rotatePiece(){
		let minY = 99999;
		let maxY = -99999;
		let minX = 99999;
		let maxX = -99999;
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(this.currentEntityList[i].position.x > maxX){
				maxX = this.currentEntityList[i].position.x;
			}
			if(this.currentEntityList[i].position.x < minX){
				minX = this.currentEntityList[i].position.x;
			}
			if(this.currentEntityList[i].position.y > maxY){
				maxY = this.currentEntityList[i].position.y;
			}
			if(this.currentEntityList[i].position.y < minY){
				minY = this.currentEntityList[i].position.y;
			}
			this.gameContainer.removeChild(this.currentEntityList[i]);
		}
		let ajdustedPositionY = maxY + (maxY - minY) / 2;
		let ajdustedPositionX = minX + (maxX - minX) / 2 ;
		ajdustedPositionX = Math.floor(ajdustedPositionX / config.pieceSize) * config.pieceSize;

		if(this.randomizeCrazy){
			let id = Math.floor(Math.random()*this.shapes.length);
			this.newEntity(this.shapes[id].shape, {x:ajdustedPositionX, y:ajdustedPositionY}, true);
		}else{
			this.newEntity(this.rotateMatrixRight(this.currentShape), {x:ajdustedPositionX, y:ajdustedPositionY});
		}
	}
	addShockwaveByPiece(piece){
		let yNormal = ((this.gameContainer.position.y - this.gameContainer.pivot.y) + piece.y) / config.height;
		let xNormal = ((this.gameContainer.position.x - this.gameContainer.pivot.x) + piece.x) / config.width;
		config.effectsLayer.addShockwave(xNormal,yNormal,1);
	}
	shoot(){
		let tempBullet = this.drawSquare(0xFFFFFF);
		tempBullet.tint = this.currentColor;
		tempBullet.position.x = this.currentEntityList[this.currentEntityList.length - 1].x;
		tempBullet.position.y = this.currentEntityList[this.currentEntityList.length - 1].y + config.pieceSize / 2;
		this.gameContainer.addChild(tempBullet);
		this.bulletList.push(tempBullet);
	}
	updateBrickBreaker(delta){
		if(this.brickBreakerPiece && this.brickBreakerSpeed){
			this.brickBreakerPiece.position.x += this.brickBreakerSpeed.x * delta;
			this.brickBreakerPiece.position.y += this.brickBreakerSpeed.y * delta;

			if(this.brickBreakerPiece.position.y - config.pieceSize <= config.pieceSize/2 && this.brickBreakerSpeed.y < 0)
			{
				if(this.brickBreakerPiece.position.x > this.currentEntityList[0].position.x - config.pieceSize * 1.5 && this.brickBreakerPiece.position.x < this.currentEntityList[1].position.x + config.pieceSize * 1.5)
				{
					this.brickBreakerSpeed.y *= -1;
					this.currentColor = utils.getRandomValue(config.palette.colors80);
					this.brickBreakerPiece.tint = this.currentColor;
				}else{
					this.addShockwaveByPiece(this.brickBreakerPiece);
					this.brickBreakerPiece.parent.removeChild(this.brickBreakerPiece);
					this.brickBreakerPiece = null;
					this.removeCurrentPiece();
					this.newEntity();
				}
			}

			let sideCollider = this.verifySingleSide(this.brickBreakerPiece, this.brickBreakerSpeed.x < 0);
			if(sideCollider){
				if(sideCollider.tint && sideCollider.name != "BOMB"){
					sideCollider.tint = 0
					this.removeSinglePiece(sideCollider);
				}else{
					sideCollider = false;
				}
				this.brickBreakerSpeed.x *= -1;
				this.brickBreakerPiece.position.x += this.brickBreakerSpeed.x * delta;			
				
			}
			let upDownCollider = this.verifySingleDown(this.brickBreakerPiece, this.brickBreakerSpeed.y < 0);
			if(upDownCollider){
				if(upDownCollider.tint && upDownCollider.name != "BOMB"){
					upDownCollider.tint = 0
					this.removeSinglePiece(upDownCollider);
				}else{
					upDownCollider = false;
				}
				this.brickBreakerSpeed.y *= -1;
				this.brickBreakerPiece.position.y += this.brickBreakerSpeed.y * delta;
			}

			if(upDownCollider || sideCollider){
				this.currentColor = utils.getRandomValue(config.palette.colors80);
				this.brickBreakerPiece.tint = this.currentColor;
				this.pointsParticle(10 * (this.comboCounter?this.comboCounter:1), this.brickBreakerPiece);
				this.addCombo();
			}
		}else{
			this.brickBreakerPiece = this.drawCircle(0xFFFFFF);
			this.brickBreakerPiece.tint = this.currentColor;
			this.brickBreakerPiece.position.x = config.bounds.x / 2 * config.pieceSize;
			this.brickBreakerPiece.position.y = config.pieceSize * 2;
			this.gameContainer.addChild(this.brickBreakerPiece);
			this.brickBreakerSpeed = {x:0,y:0};
			this.brickBreakerStandardSpeed = 300;
			this.brickBreakerSpeed.y = this.brickBreakerStandardSpeed;
			this.brickBreakerSpeed.x = this.brickBreakerStandardSpeed;
		}
	}
	startMeteorRain(erase, quant){
		this.meteorRain = true;
		this.meteorCounter = quant?quant:8;
		this.meteorTimeCounter = 0;
		this.shooterErase = erase;
		this.addInfoLabel(["METEOR","RAIN"]);
	}
	fallMeteor(){
		this.meteorTimeCounter = 0
		this.meteorCounter --;
		if(this.meteorCounter <= 0){
			this.meteorRain = false;
		}
		let tempBullet = this.drawSquare(0xFFFFFF);
		tempBullet.tint = this.currentColor;
		tempBullet.position.x = Math.floor(config.bounds.x * Math.random()) * config.pieceSize;
		tempBullet.position.y = config.pieceSize / 2;
		this.gameContainer.addChild(tempBullet);
		this.bulletList.push(tempBullet);

	}
	pointsParticle(value, entity, _delay, _toRemove){
		let delay = 0;
		let toRemove = _toRemove;
		if(_delay){
			delay = _delay;
		}
		this.points += value;
		let tempLabel = new PIXI.Text(value,{font : '40px super_smash_tvregular', fill : 0xFFFFFF, align : 'right'});
		tempLabel.position.x = entity.position.x + entity.width / 2 - tempLabel.width/2;
		tempLabel.position.y = entity.position.y;		
		TweenLite.to(tempLabel, 1, {onStart:function(element, parent, toRemove){
			parent.addChild(element);
			if(toRemove && toRemove.parent){
				toRemove.parent.removeChild(toRemove);
			}
		}, onStartParams:[tempLabel, this.gameContainer, toRemove], delay:delay, y: entity.position.y - config.pieceSize, onComplete:function(toRemove){
			toRemove.parent.removeChild(toRemove);
		},onCompleteScope:this, onCompleteParams:[tempLabel]})
	}
	updateBulletList(delta){
		for (var i = this.bulletList.length - 1; i >= 0; i--) {
			this.bulletList[i].position.y += delta * 500;
			this.verifyBulletPosition(this.shooterErase);
		}
		if(this.currentShapeData && this.currentShapeData.type == "SHOOTER"){
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
				this.currentEntityList[i].tint = utils.getRandomValue(config.palette.colors80);
			}
		}
	}
	verifyBulletPosition(erase){		
		let toRemove = [];
		for (var i = this.bulletList.length - 1; i >= 0; i--) {	
			let tempX = (this.bulletList[i].position.x / config.pieceSize);
			let tempY = (this.bulletList[i].position.y / config.pieceSize);
			let roundedY = Math.floor(tempY);
			if(roundedY >= config.bounds.y - 1){
				config.effectsLayer.shakeY(0.3,5,0.5);
				if(!erase){
					this.addOnMatrix(true, this.bulletList[i]);
				}else{
					this.bulletList[i].parent.removeChild(this.bulletList[i]);
				}
				this.bulletList.splice(i,1);			
				//return true
			}
			let matrixContent = this.gameMatrix[Math.ceil(tempX)][roundedY + 1]
			if(matrixContent && matrixContent != 0){
				config.effectsLayer.shakeY(0.3,5,0.5);
				if(!erase){
					this.addOnMatrix(true, this.bulletList[i]);
				}else{
					matrixContent.parent.removeChild(matrixContent);
					this.gameMatrix[Math.ceil(tempX)][roundedY + 1] = 0;
					this.addShockwaveByPiece(this.bulletList[i]);
					this.bulletList[i].parent.removeChild(this.bulletList[i]);
					config.effectsLayer.shakeY(0.5,5,0.5);
					config.effectsLayer.updateRGBSplitter(5);
					config.effectsLayer.fadeSplitter(0,4,0);

				}
				this.bulletList.splice(i,1);
				//return true
			}
		}
	}

	updateQueue(){
		for (var i = this.shapeQueue.length - 1; i >= 0; i--) {
			this.gameQueueContainer.removeChild(this.shapeQueue[i]);
		}
		// this.gameQueueContainer.alpha = 1;
		let totalQueue = 3;
		let tempShape;
		let tempId;
		let newId = 0;
		for (var i = 0; i < totalQueue; i++) {
			tempId = this.shapeStep + i + 1;
			if(tempId >= this.shapesOrder.length){
				tempId = newId;
				newId ++;
			}
			if(this.scoring > 4 && Math.random() < 0.1){
				tempShape = this.drawShapeOnList(this.whatPiece.shape);
				//tempShape.scale.y = 0.7;
				//tempShape.scale.x = 0.7;
			}else{
				tempShape = this.drawShapeOnList(this.shapes[this.shapesOrder[tempId]].shape);
			}
			this.shapeQueue.push(tempShape);
			this.gameQueueContainer.addChild(tempShape);
			tempShape.position.y = 130 * (i + 1);
		}

		//this.gameQueueContainer.position.x = (this.gameBorderContainer.position.x + this.gameBorderContainer.width / 2 + 5) * this.gameBorderContainer.scale.x;
	}
	getShape(){
		this.shapeStep ++;
		if(this.shapeStep >= this.shapesOrder.length){
			this.shapeStep = 0;
		}
		return this.shapes[this.shapesOrder[this.shapeStep]];
	}
	newEntity(shapeArray, starterPosition, randomRotate){

		this.currentEntityList = [];
		if(!shapeArray){
			this.round ++;

			this.currentLevel = Math.floor(this.round / this.roundLevelAccum) + 1;
			this.updateCurrentLevel();

			this.currentShapeData = this.getShape();
			this.currentShape = this.currentShapeData.shape;
			if(this.currentShapeData.type == "SHOOTER"){
				this.shooterErase = Math.random() < 0.4;//!this.shooterErase;
				if(this.shooterErase){
					this.addInfoLabel(["ERASE"]);
				}else{
					this.addInfoLabel(["ADD"]);
				}
			}else if(this.currentShapeData.type == "BRICK_BREAKER"){
				this.normalizedDelta = 1;
				this.downSpeedIncrease = 0;
			}else{
				if(!this.meteorRain && this.scoring > 5){
					if(Math.random()<0.15){
						this.startMeteorRain(Math.random()<0.1, 5 + Math.floor(Math.random() * 9));
					}
				}
			}
			this.updateQueue();
		}else{
			this.currentShape = shapeArray;
		}

		if(randomRotate){
		let rotationRandom = Math.floor(Math.random()*3);
			for (var i = rotationRandom - 1; i >= 0; i--) {
				this.currentShape = this.rotateMatrixRight(this.currentShape);
			}
		}
		
		let starterXPosition = 0;
		if(!starterPosition){
			starterPosition = {x:0,y:0};
			starterXPosition = (Math.ceil(config.bounds.x / 2) - 2) * config.pieceSize;
		}else{
			starterXPosition = starterPosition.x - (2 * config.pieceSize);
		}
		let shouldMove = 0;
		this.currentColor = config.palette.colors80[Math.floor(config.palette.colors80.length * Math.random())];
		for (var i = 0; i < this.currentShape.length; i++) {
			for (var j = 0; j < this.currentShape[i].length; j++) {
				if(this.currentShape[i][j]){
					let currentEntity;
					if(this.currentShapeData.type == "SHOOTER"){
						currentEntity = this.drawSquare(0xFFFFFF);
					}
					else{
						currentEntity = this.drawSquare(this.currentColor);
					}
					currentEntity.position.x = starterXPosition + j * config.pieceSize;
					currentEntity.position.y = i * config.pieceSize - (this.currentShape[i].length - 2) * config.pieceSize - config.pieceSize/2 + starterPosition.y;
					this.currentEntityList.push(currentEntity);
					this.gameContainer.addChild(currentEntity);
					if(currentEntity.position.x < 0){
						shouldMove = 1;
					}else if(currentEntity.position.x >= config.bounds.x* config.pieceSize){
						shouldMove = -1;
					}
				}
			}
		}
		this.updateVisibleParts();
		// console.log(shouldMove);
		if(shouldMove){
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
				this.currentEntityList[i].position.x += config.pieceSize * shouldMove;
			}
		}
	}
	drawSquare(color, padding){
		let newPadding = padding;
		if(!newPadding)
		{
			newPadding = 2;
		}
		let square = new PIXI.Graphics();
		square.beginFill( color );
	    square.drawRect( newPadding, newPadding, config.pieceSize -newPadding*2, config.pieceSize-newPadding*2);
	    return square;
	}
	drawCircle(color, padding){
		let newPadding = padding;
		if(!newPadding)
		{
			newPadding = 0;
		}
		let circle = new PIXI.Graphics();
		circle.beginFill( color );
	    circle.drawCircle( config.pieceSize - newPadding,(config.pieceSize - newPadding)/2,(config.pieceSize - newPadding)/2);
	    return circle;
	}
	//EVENTS
	removeEvents(){
		this.off('touchstart').off('mousedown');
		this.off('touchend').off('mouseup');
	}
	addEvents(){
		this.removeEvents();
		this.interactive = true;
		//this.on('mousedown', this.onTapDown.bind(this)).on('touchstart', this.onTapDown.bind(this)); 
		//this.on('mouseup', this.onTapUp.bind(this)).on('touchend', this.onTapUp.bind(this)); 	    
	}
	onMouseMoveCallback(e) {
		if(!this.started || this.ended){
			return;
		}
		let width = e.target.width * e.target.scale.x- this.dotRadius/2;
		let realativePosition = e.data.global.x - (e.target.position.x - width/ 2) - this.dotRadius/2;
		//console.log(e.data.global.x, e.target.position.x, e.target.width , e.target.scale.x,this.dotRadius/2, 'move');
		if(config.isJuicy){
			this.findCol(realativePosition + config.hitCorrection.x, width);
		}else{
			this.findCol(realativePosition, width);
		}
	}
	onTapUp(e) {
		this.stopAction("space");
	}
	onTapDown(e) {

		//console.log(e.data.global.y, config.height / 4);
		let type;
		if(e.data.global.y < config.height / 4){
			type = "up";
		}else if(e.data.global.y > config.height - config.height / 4){
			type = "down";
		}else if(e.data.global.x < config.width / 2){
			type = "left";
		}else if(e.data.global.x > config.width / 2){
			type = "right";
		}
		if(type){
			if(this.gameMode == "MENU"){
				if(type == "right"){
					type = "space";
				}
				// this.inMenuKeyPressed = true;
				this.stopAction(type);
			}else{
				this.updateAction(type);
			}
		}
		// console.log(e.data.global.x, e.data.global.y);
	}
	onPauseCallback() {
		
	}

	//GAMEPLAY
	
	//end game
	endGame() {
		
	}
	forceHideGame(){
		
	}
	appendMorePieces(){
		let tempArray = [];
		let tempId;
		for (var i = 0; i < 200; i++) {
			tempId = Math.floor(this.shapes.length * Math.random());
			if(this.shapes[tempId].type == "BRICK_BREAKER" && Math.random() < 0.2 || i < 35){
				// console.log("RECALC BRICK");
				tempId = Math.floor(this.shapes.length * Math.random());
			}

			if(this.shapes[tempId].type == "SHOOTER" && Math.random() < 0.5 || i < 20){
				// console.log("RECALC BRICK");
				tempId = Math.floor(this.shapes.length * Math.random());
			}

			if(i > 3){
				while(tempId == tempArray[i - 1] || tempId == tempArray[i - 2] || tempId == tempArray[i - 3] || tempId == tempArray[i - 4]){
					tempId = Math.floor(this.shapes.length * Math.random());
				}
			}

			tempArray.push(tempId);
		}
		this.shapesOrder = this.shapesOrder.slice(0, this.shapeStep + 3);
		this.shapesOrder = this.shapesOrder.concat(tempArray);

	}
	
	
	addButtonHUD(callback) {
		if(!this.buttonList){
			this.buttonList = [];
		}
		let tempButton = this.drawSquare(Math.random() * 0xFFFFFF, -10);
		tempButton.interactive = true;
		tempButton.on('tap', callback.bind(this)).on('click', callback.bind(this));
		this.addChild(tempButton);
		tempButton.position.x = tempButton.width * this.buttonList.length + tempButton.width;
		tempButton.position.y = tempButton.height / 2;
		this.buttonList.push(tempButton);
	}
	hideBlinkingLabel() {
		if(this.blinkLetter && this.blinkLetter.parent){
			this.blinkLetter.parent.removeChild(this.blinkLetter)
		}
	}
	addBlinkingLabel(label) {
		if(this.blinkLetter && this.blinkLetter.parent){
			this.blinkLetter.parent.removeChild(this.blinkLetter);
		}
		this.blinkLetter = new PIXI.Text(label,{font : '40px super_smash_tvregular', fill: 0xFFFFFF , align : 'center'});
		this.addChild(this.blinkLetter);
		this.blinkLetter.position.x = config.width / 2 - this.blinkLetter.width / 2;
		this.blinkLetter.position.y = config.height - this.blinkLetter.height * 1.5;
	}
	addInfoLabel(label, addEffects, dontRemove, grey) {
		let tempLabel = label;
		if(!addEffects){
			config.effectsLayer.updateRGBSplitter(-4);
			config.effectsLayer.fadeSplitter(1, 1, 0);
			// config.effectsLayer.fadeSplitter(1, 1, 1);
			// config.effectsLayer.fadeBloom(2,0, 2, 0, true);
		}
		let distance = 40;
		let lineHeight = 60;
		let timeDelay = 0.05
		let time = 0.6
		let timeToRemove = 1;
		while(this.gameInfoContainer.children.length){

			TweenLite.killTweensOf(this.gameInfoContainer.removeChildAt(0));
		}

		let rainbowColors = ["#FF110C",
		"#FCA40A",
		"#FCFD01",
		"#3DFD0B",
		"#0CACFA",
		"#7442FD"]
		if(grey){
			rainbowColors = ["#444444",
		"#555555",
		"#666666",
		"#777777",
		"#888888",
		"#999999"]
		}
		let fontColor = 0xFFFFFF;
		let rainbowColorsID = Math.floor(Math.random()*rainbowColors.length);
		for (var i = 0; i < tempLabel.length; i++) {
			for (var j = 0; j < tempLabel[i].length; j++) {
				let tempLetter = new PIXI.Text(tempLabel[i][j],{font : '80px super_smash_tvregular', fill : fontColor, align : 'center',
					dropShadow:true,
					dropShadowColor: rainbowColors[rainbowColorsID],
					dropShadowAngle:45,
					dropShadowDistance:10,
					stroke: rainbowColors[rainbowColorsID],
					strokeTickness:6
				});
				this.gameInfoContainer.addChild(tempLetter);
				rainbowColorsID ++;
				if(rainbowColorsID >= rainbowColors.length){
					rainbowColorsID = 0;
				}
				tempLetter.position.y = config.height / 2 - tempLabel.length/2*lineHeight + lineHeight * i;
				tempLetter.position.x = distance * j + config.width / 2 - ((tempLabel[i].length - 1) * distance + distance)/2;
				// tempLetter.position.x = distance * j + config.width / 2 - ((tempLabel[i].length - 1) * distance + distance/2)/2;

				let delay = j*timeDelay;
				if(i > 0){
					delay += tempLabel[i - 1].length * timeDelay;
				}

				TweenLite.from(tempLetter.position, time, {y:tempLetter.position.y + 30, delay:delay, ease:"easeOutElastic"});
				TweenLite.from(tempLetter, time, {alpha:0, delay:delay});

				if(!dontRemove){
					TweenLite.to(tempLetter.position, time/2, {y:tempLetter.position.y - 30, delay:delay + timeToRemove});
					TweenLite.to(tempLetter, time/2, {alpha:0, delay:delay + timeToRemove,onComplete:function(toRemove){
						if(toRemove && toRemove.parent){
							toRemove.parent.removeChild(toRemove);
						}
					}, onCompleteParams:[tempLetter]});
				}
			}
		}
	}
	initGame() {
		// this.started = true;
		// this.addButtonHUD(this.changeBackgroundColor);
		// this.addButtonHUD(this.crazyCurrentPieces);
		// this.addButtonHUD(this.addInfoLabel);
		// this.addButtonHUD(this.addCombo);
		// // this.addButtonHUD(this.removeOneColum);
		// // this.addButtonHUD(this.addRandomBomb);
		// // this.addButtonHUD(this.fallForRandomSide);
		// this.addButtonHUD(this.changeFilter);
		//this.bestScore = 0;// get best
		this.comboTimer = 0;
		this.comboMaxTimer = 5;
		this.comboCounter = 0;
		this.resetRotation();
		this.rotatingCrazy = false;
		this.gameCounter = 0;
		this.downSpeedIncrease = 0;
		this.normalizedDelta = 1;
		this.currentColor = config.palette.colors80[Math.floor(config.palette.colors80.length * Math.random())];
		this.shapesOrder = [];
		this.bombList = [];
		this.shapeStep = 0;
		this.round = 0;
		this.roundLevelAccum = 10;
		this.shapeQueue = [];
		this.points = 0;
		this.gameLevelSpeedMax = 1;
		this.gameLevelSpeed = this.gameLevelSpeedMax;
		this.currentLevel = 1;
		this.updateCurrentLevel();
		this.scoring = 0;
		//force to reset filter
		this.removeFilter();
		this.currentEffectID = 99999;
		// this.changeFilter();

		this.shapesOrder.push(0)
		this.shapesOrder.push(1)
		let tempId;
		for (var i = 0; i < 10; i++) {
			tempId = Math.floor(Math.random()*4);
			if(this.shapesOrder.length > 1){
				while(tempId == this.shapesOrder[this.shapesOrder.length - 1] || tempId == this.shapesOrder[this.shapesOrder.length - 2]){
					tempId = Math.floor(Math.random()*4);
				}
			}
			this.shapesOrder.push(tempId)
		}

		this.configGameMatrix(config.bounds.y,config.bounds.x);
		this.drawMatrix(config.pieceSize);
		this.gameContainer.addChild(this.filterDescription);
		this.gameQueueContainer.alpha = 0;
		this.started = true;
		this.updateComboBar();
		this.showMenu();

	}
	setInGamePositions(){
		if(this.menuContainer){
			while(this.menuContainer.children.length){
				this.menuContainer.removeChildAt(0);
			}
		}
		this.showGame();
		// config.effectsLayer.updateRGBSplitter(1);
		// TweenLite.to(this.labelPoints, 1, {alpha:1});
		this.filterLabel = "JUST";
		//config.effectsLayer.fadeBloom(config.effectsLayer.bloom.blur?config.effectsLayer.bloom.blur:0, 0, 2, 0.5, true);
		config.effectsLayer.fadeSplitter(1,1,0);
		//this.updateQueue();
		setTimeout(function(){
			this.started = true;
			//this.showMenu();
			this.downSpeedIncrease = 0;
			this.newEntity();
			TweenLite.to(this.gameQueueContainer, 1, {alpha:1});

		}.bind(this), 500);

		this.gameMode = "STANDARD";
	}
	showGame(){
		console.log("showGame");
		this.hideBlinkingLabel();
		TweenLite.to(this.gameContainer.position, 0.5, {x:50 + this.gameContainer.pivot.x});
		TweenLite.to(this.gameBorderContainer.position, 0.5, {x:50 + this.gameContainer.pivot.x, onComplete:this.adjustQueuePosition, onCompleteScope:this});

		TweenLite.to(this.gameContainer, 0.5, {rotation:0});
		TweenLite.to(this.gameBorderContainer, 0.5, {rotation:0});
		TweenLite.to(this.gameBorderContainer, 0.5, {alpha:1});

		TweenLite.to(this.labelTitle, 0.15, {alpha:0});
		TweenLite.to(this.labelPoints, 0.3, {alpha:1});
		TweenLite.to(this.labelLevel, 0.3, {alpha:1});
		TweenLite.to(this.labelBestScore, 0.3, {alpha:1});
		TweenLite.to(this.filterDescription, 0.3, {alpha:1});


		this.gameComboBarContainer.alpha = 1;
	}
	adjustQueuePosition(){
		this.gameQueueContainer.position.x = (this.gameBorderContainer.position.x + this.gameBorderContainer.width / 2 + 5);

	}
	hideGame(){
		TweenLite.to(this.gameContainer.position, 0.5, {x:config.width / 2 - this.gameBorderContainer.width / 2 + this.gameContainer.pivot.x});
		TweenLite.to(this.gameBorderContainer.position, 0.5, {x:config.width / 2 - this.gameBorderContainer.width / 2 + this.gameContainer.pivot.x});
		TweenLite.to(this.gameQueueContainer, 0.3, {alpha:0});
		TweenLite.to(this.filterDescription, 0.15, {alpha:0});
		TweenLite.to(this.labelPoints, 0.15, {alpha:0});
		TweenLite.to(this.labelLevel, 0.15, {alpha:0});
		TweenLite.to(this.labelBestScore, 0.15, {alpha:0});
		TweenLite.to(this.labelTitle, 0.3, {alpha:1});
		this.gameComboBarContainer.alpha = 0;
		this.gameBorderContainer.alpha = 0;
	}
	showMenu(){
		this.gameMode = "MENU";
		this.addBlinkingLabel("PESS SPACE");
		if(this.menuContainer){
			while(this.menuContainer.children.length){
				this.menuContainer.removeChildAt(0);
			}
		}
		this.menuContainer = new PIXI.Container();
		this.gameContainer.addChild(this.menuContainer);
		this.menuList = ["PLAY", "Test", "??????", "??????", "??????", "??????"];
		this.currentSelectedMenuItem = 0;
		
		this.starterEffect();
		
		this.hideGame();

		this.updateMenu();
		
	}
	updateTitle(){
		this.labelTitle.text = this.shuffleText(this.gameTitle);
		this.labelTitle.position.x = config.width / 2 - this.labelTitle.width / 2;
	}
	updateMenu(){

		

		//console.log([this.menuList[this.currentSelectedMenuItem]]);
		this.addInfoLabel([this.menuList[this.currentSelectedMenuItem]], false, true);

		// for (var i = this.menuLabels.length - 1; i >= 0; i--) {
		// 	if(this.currentSelectedMenuItem == i){
		// 		this.menuLabels[i].tint = this.currentColor;
		// 	}
		// 	else{
		// 		this.menuLabels[i].tint = 0xFFFFFF;
		// 	}
		// }
	}
	//end timer
	selectMenu(){
		switch(this.currentSelectedMenuItem)
		{
			case 0:
				this.setInGamePositions();
				while(this.gameInfoContainer.children.length){
					this.gameInfoContainer.removeChildAt(0);
				}
			break
		}
	}
	//destroy game
	destroyGame(){
		while(this.gameContainer.children.length){

			this.gameContainer.removeChildAt(0);
		}
		// for (var i = this.gameContainer.chidren.length - 1; i >= 0; i--) {
		// }
		while(this.gameQueueContainer.children.length){			
			this.gameQueueContainer.removeChildAt(0);
		}

		while(this.gameInfoContainer.children.length){

			this.gameInfoContainer.removeChildAt(0);
		}
		for (var i = 0; i < this.bulletList.length; i++) {
			if(this.bulletList[i] && this.bulletList[i].parent){
				this.bulletList[i].parent.removeChild(this.bulletList[i]);
			}
		}
		this.bulletList = [];

		this.removeEvents();
	}
	changePieceStyle(element, char, color, shape){
		if(element.name == "BOMB"){
			return;
		}
		let tempLabel = this.drawSquare(0xBBBBBB, 4);//new PIXI.Text(char,{font : '30px super_smash_tvregular', fill : color, align : 'right'});
		tempLabel.position.x = element.position.x;
		tempLabel.position.y = element.position.y;
		this.gameContainer.addChild(tempLabel);
		this.gameContainer.removeChild(element);
		return tempLabel;
	}

	resetRotation(){

		this.rotatingCrazy = false;
		TweenLite.killTweensOf(this.gameContainer);
		TweenLite.killTweensOf(this.gameBorderContainer);
		TweenLite.to(this.gameContainer, 0.5, {rotation:0, ease:"easeOutBack"});
		TweenLite.to(this.gameBorderContainer, 0.5, {rotation:0, ease:"easeOutBack"});


		TweenLite.killTweensOf(this.gameContainer.scale);
		TweenLite.killTweensOf(this.gameBorderContainer.scale);
		TweenLite.to(this.gameContainer.scale, 0.5, {x: 1, y:1, ease:"easeOutBack"});
		TweenLite.to(this.gameBorderContainer.scale, 0.5, {x: 1, y:1, ease:"easeOutBack"});
	}

	fallForRandomSide(){
		let side = Math.random() < 0.5 ? 1:-1;
		// side = 1;
		//(30 / 180 * Math.PI)
		this.rotatingCrazy = true;
		TweenLite.to(this.gameContainer, 80, {rotation:44.05 * side, ease:"easeOutBack"});
		TweenLite.to(this.gameBorderContainer, 80.3, {rotation:44.05 * side, ease:"easeOutBack", onComplete:this.resetRotation, onCompleteScope:this});

		TweenLite.to(this.gameContainer.scale, 0.5, {x: 0.8, y:0.8, ease:"easeOutBack"});
		TweenLite.to(this.gameBorderContainer.scale, 0.5, {x: 0.8, y:0.8, ease:"easeOutBack"});

	}
	changeBackgroundColor(){
		this.background.tint = utils.getRandomValue(config.palette.colors80);
		TweenLite.killTweensOf(this.background);
		this.background.alpha = 0.5;
		TweenLite.to(this.background, 2, {alpha:1});
		TweenLite.to(this.background, 4, {tint:this.backgroundStandardColor, delay: 2});
	}
	updateBombList(){
		for (var i = 0; i < this.bombList.length; i++) {
			this.bombList[i].tint = utils.getRandomValue(config.palette.colors80);
		}
	}
	removeBomb(element){
		for (var i = 0; i < this.bombList.length; i++) {
			if(this.bombList[i] == element){
				if(this.bombList[i].parent){
					this.bombList[i].parent.removeChild(this.bombList[i]);
				}
				this.bombList.splice(i, 1);
				return;
			}
		}
	}
	setBomb(element){
		let square = this.drawSquare(0xFFFFFF);
		square.position.x = element.position.x;
		square.position.y = element.position.y;
		this.gameContainer.addChild(square);
		this.gameContainer.removeChild(element);
		square.name = "BOMB";		
		this.bombList.push(square);
		return square;
	}

	addRandomBomb() {
		let havePieces = false;
		let height = this.gameMatrix[0].length - 1;
		for (var i = height; i >= 0; i--) {
			for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
				if(this.gameMatrix[j][i]){
					havePieces = true;
					break;
				}
			}			
		}
		if(!havePieces){
			return
		}
		let tempi = Math.floor(Math.random() * this.gameMatrix.length);
		let tempj = Math.floor(Math.random() * this.gameMatrix[0].length);
		let tries = 500;
		while(!this.gameMatrix[tempi][tempj] || this.gameMatrix[tempi][tempj].name == "BOMB"){
			tempi = Math.floor(Math.random() * this.gameMatrix.length);
			tempj = Math.floor(Math.random() * this.gameMatrix[0].length);
			tries --;
			if(tries <= 0)		{
				return;
			}
		}
		this.gameMatrix[tempi][tempj] = this.setBomb(this.gameMatrix[tempi][tempj]);
	}
	removeOneColum(forceColum, side) {
		let currentSide = 1;
		if(side){
			currentSide = side;
		}
		let columID = forceColum != null?forceColum:Math.floor(Math.random() * this.gameMatrix.length);
		let tempEffect = new PIXI.Graphics();
		tempEffect.beginFill( 0xFFFFFF );
	    tempEffect.drawRect( 0, 0, config.pieceSize, config.pieceSize * config.bounds.y);
		tempEffect.position.x = columID * config.pieceSize;
		tempEffect.height = config.bounds.y * config.pieceSize;
		TweenLite.to(tempEffect, 0.5, {alpha:0, onComplete:function(toRemove){
			toRemove.parent.removeChild(toRemove);
		}, onCompleteParams:[tempEffect]});
		this.gameContainer.addChild(tempEffect);
		for (var i = this.gameMatrix[columID].length; i >= 0; i--) {			
			if(this.gameMatrix[columID][i]){
				this.addPoints(this.gameMatrix[columID][i]);
				this.gameContainer.removeChild(this.gameMatrix[columID][i]);
				this.gameMatrix[columID][i] = 0;
			}
		}
		let delayAcc = 0;
		config.effectsLayer.shakeY(0.5,5,0.5);
		config.effectsLayer.updateRGBSplitter(5);
		config.effectsLayer.fadeSplitter(1,3);

		let yNormal = ((this.gameContainer.position.y - this.gameContainer.pivot.y) + config.bounds.y * config.pieceSize) / config.height;
		let xNormal = ((this.gameContainer.position.x - this.gameContainer.pivot.x) + columID * config.pieceSize) / config.width;

		config.effectsLayer.addShockwave(xNormal,yNormal,1);
		for (var i = columID + 1; i < this.gameMatrix.length; i++) {
			for (var j = this.gameMatrix[i].length - 1; j >= 0; j--) {
				if(this.gameMatrix[i][j]){
					delayAcc += 0.01;
					TweenLite.killTweensOf(this.gameMatrix[i][j].position);
					let addMore = 0;
					if(this.gameMatrix[i][j].name == "BOMB"){
						addMore = this.gameMatrix[i][j].width / 2;
					}
					// TweenLite.to(this.gameMatrix[i][j].position, 0.5, {delay:delayAcc, x:(i - 1) * config.pieceSize + addMore, ease:"easeOutElastic"});
					this.gameMatrix[i][j].position.x = (i - 1) * config.pieceSize;
					this.gameMatrix[i - currentSide][j] = this.gameMatrix[i][j];
					this.gameMatrix[i][j] = 0;
				}
			}
		}
	}

	crazyCurrentPieces() {		

		let height = this.gameMatrix[0].length - 1;
		let linesToChange = [];
		let lineCounter;
		for (var i = height; i >= 0; i--) {
			lineCounter = 0;
			for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
				if(this.gameMatrix[j][i]){
					lineCounter ++;
				}
				if(lineCounter > Math.random() * 8)	{
					linesToChange.push(i)
				}
			}			
		}
		for (var i = linesToChange.length - 1; i >= 0; i--) {			
			for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
				if(this.gameMatrix[j][linesToChange[i]] && Math.random() < 0.5){
					this.gameMatrix[j][linesToChange[i]] = this.changePieceStyle(
							this.gameMatrix[j][linesToChange[i]],
							String.fromCharCode(Math.floor(Math.random()*20) + 65),
							utils.getRandomValue(config.palette.colors80)
						);
				}				
			}
		}
		
	}
	//INITIALIZE
	//create matrix based on game bounds
	configGameMatrix(i,j) {
		this.gameMatrix = [];
	    this.entityMatrix = [];
		let tempArray = [];
		let tempArray2 = [];
		for (let jj = 0; jj < j; jj++) {
			tempArray = [];
			tempArray2 = [];
			for (let ii = 0; ii < i; ii++) {
				tempArray.push(0);
				tempArray2.push(0);
			}
			this.gameMatrix.push(tempArray2);
			this.entityMatrix.push(tempArray);
		};
	}
	//draw dots on screen
	drawMatrix(size) {
		if(this.border){
			return;
		}
		this.border = new PIXI.Graphics();
		this.border.lineStyle(config.pixelSize*2,0xFFFFFF);
		this.border.alpha = 0.8;
		this.border.tint = this.currentColor;
		this.border.drawRect(0,config.pixelSize/2,config.bounds.x*size + config.pixelSize ,config.bounds.y*size);
		this.gameContainer.addChild(this.border);
	}

	//
	stopAction(type){
		if(!this.started){
			if (type == "space"){
				this.initGame();
				return;
			}
		}
		if(!this.started || this.gameOvering){
			return;
		}
		if(this.gameMode == "MENU"){
			// if(!this.inMenuKeyPressed){
				//return;
			//}
			if(type == "left"){
				this.currentSelectedMenuItem --;
				if(this.currentSelectedMenuItem < 0){
					this.currentSelectedMenuItem = this.menuList.length - 1;
				}
				config.effectsLayer.fadeSplitter(this.currentSelectedMenuItem,1,0);
				this.updateMenu();
			}else if(type == "right"){
				this.currentSelectedMenuItem ++;
				if(this.currentSelectedMenuItem >= this.menuList.length){
					this.currentSelectedMenuItem = 0;
				}
				config.effectsLayer.fadeSplitter(this.currentSelectedMenuItem,1,0);
				this.updateMenu();
			}else if (type == "space"){
				this.selectMenu();
			}
			return;
		}
		if(type == "down" || type == "space"){
			this.downSpeedIncrease = 0;
		}
	}
	updateVisibleParts(){
		let haveOne = false;
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(this.currentEntityList[i].position.y < 0){
				this.currentEntityList[i].alpha = 0;
				haveOne = true;
			}else{

				this.currentEntityList[i].alpha = 1;
			}
		}
		return haveOne;
	}
	updateAction(type){

		if(!this.started || this.gameOvering){
			return;
		}
		if(this.gameMode == "MENU"){
			// this.inMenuKeyPressed = true;
			return;
		}
		if(!this.canMove(type)){
			return;
		}
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(type == "left"){
				this.currentEntityList[i].position.x -= config.pieceSize;
			}else if(type == "right"){
				this.currentEntityList[i].position.x += config.pieceSize;
			}else if(type == "down" || type == "space"){
				// this.currentEntityList[i].position.y += config.pieceSize / 2;
				if(this.currentShapeData.type != "BRICK_BREAKER"){
					this.downSpeedIncrease = 200;
				}
			}
		}
		// this.inMenuKeyPressed = false;
	}
	updateMove(){
		if(!this.canMove("down")){
			return;
		}		
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			this.currentEntityList[i].position.y += config.pieceSize / 2;
		}
		this.updateVisibleParts();
	}
	canMove(type) {
		if(type == "up"){
			if(this.currentShapeData.type == "SHOOTER"){
				this.shoot();
				return;
			}
			if(this.currentShapeData.type == "STANDARD"){
				this.rotatePiece();				
			}
		}
		else
		{
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {		
				let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
				let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
				let downCollide = false;
				if(type == "left"){
					if(tempX - 1 < 0|| this.verifySide(type)){
						config.effectsLayer.shakeX(0.2,5,0.3);
						return false
					}
					this.verifySide(type);
				}else if(type == "right"){
					if(tempX >= config.bounds.x - 1 || this.verifySide(type)){
						config.effectsLayer.shakeX(0.2,5,0.3);
						return false
					}
				}else if(type == "down"){
					downCollide = this.verifyDown();
					}
				if(downCollide){
					this.verifyLines();
					//this.started = false;
					this.newEntity();
					return false
				}			
			}
		}
		this.updateVisibleParts();
		return true
	}
	verifyLines() {
		let lineCounter = 0;
		let height = this.gameMatrix[0].length - 1;
		let linesToRemove = [];
		for (var i = height; i >= 0; i--) {
			lineCounter = 0;
			for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
				if(this.gameMatrix[j][i]){
					lineCounter ++;
				}				
			}
			if(lineCounter >= this.gameMatrix.length){
				linesToRemove.push(i);
			}
		}
		if(linesToRemove.length > 0){

			let yNormal = ((this.gameContainer.position.y - this.gameContainer.pivot.y) + linesToRemove[0] * config.pieceSize) / config.height;
			let xNormal = ((this.gameContainer.position.x - this.gameContainer.pivot.x) + this.currentEntityList[0].x) / config.width;
			config.effectsLayer.addShockwave(xNormal,yNormal,1);
			config.effectsLayer.shakeX(0.5,5,0.5);
			config.effectsLayer.shakeY(0.5,5,0.5);

			//console.log(this.gameMatrix);
			this.scoring ++;
			
			if(this.scoring == 1){
				this.filterLabel = "JUST\nA"
			}else if(this.scoring == 2){
				this.filterLabel = "JUST\nA\nSIMPLE"
			}else if(this.scoring == 3){			
				this.filterLabel = "BRICK\nGAME?"
				this.changeFilter();
			}else if(this.scoring == 4){	
				this.appendMorePieces();
				this.changeFilter();
			}else{
				this.changeFilter();				
			}
		}
		for (var i = linesToRemove.length - 1; i >= 0; i--) {			
			this.removeLine(linesToRemove[i]);
		}
		if(linesToRemove.length >= 2){
			this.addRandomBomb();
		}
		if(linesToRemove.length >= 3){
			this.addRandomBomb();
			//this.addRandomBomb();
		}
		if(linesToRemove.length >= 4){
			this.addRandomBomb();
			this.addRandomBomb();
			//this.addRandomBomb();
		}
	}
	addPoints(toRemove) {
		let toAdd = this.rotatingCrazy ? 20 : 10 * (this.comboCounter?this.comboCounter:1);
		// console.log(toAdd);
		if(toRemove){
			this.pointsParticle(toAdd, toRemove);
		}
		this.points += toAdd;
	}
	removeLine(line) {
		
		this.addCombo();

		let lineCounter = 0;
		
		this.pointsParticle(100 * (this.comboCounter?this.comboCounter:1), this.gameMatrix[Math.floor(this.gameMatrix.length / 2)][line]);
		let timeline = new TimelineLite();
		for (var j = this.gameMatrix.length - 1; j >= 0; j--) {
			if(this.gameMatrix[j][line]){
				if(this.gameMatrix[j][line].name == "BOMB"){
					this.removeBomb(this.gameMatrix[j][line]);
					this.removeOneColum(j);
				}
				this.gameContainer.removeChild(this.gameMatrix[j][line]);
				// timeline.add(TweenLite.to(this, 0.1, {onComplete: this.addPoints, onCompleteScope: this}));
				this.gameMatrix[j][line] = 0;
			}				
		}
		
		let upTo = line - 1;
		for (var i = this.gameMatrix.length - 1; i >= 0; i--) {
			for (var j = upTo; j >= 0; j--) {
				if(this.gameMatrix[i][j]){
					this.gameMatrix[i][j].position.y += config.pieceSize;
					this.gameMatrix[i][j+1] = this.gameMatrix[i][j];
					this.gameMatrix[i][j] = 0;
				}
			}
		}

	}
	verifySide(type) {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			if(this.verifySingleSide(this.currentEntityList[i], type)){
				return true;
			}
		}
	}
	verifySingleSide(entity, type) {
		if(!entity){
			return false;
		}
		let tempX = (entity.position.x / config.pieceSize) + (type=="left"?-1:1);
		let tempY = (entity.position.y / config.pieceSize) + 0.5;
		let roundedY = Math.floor(tempY);
		let roundedX = Math.floor(tempX);
		if(tempX < 0 || tempX >= this.gameMatrix.length){
			return true
		}
		let matrixContent = this.gameMatrix[roundedX][roundedY]
		if(matrixContent && matrixContent != 0){
			return matrixContent
		}
		return false
	}
	verifySingleDown(entity, type) {
		if(!entity){
			return false;
		}
		// for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
		let tempX = (entity.position.x / config.pieceSize);
		let tempY = (entity.position.y / config.pieceSize) + (type? - 1:0);
		let roundedY = Math.floor(tempY);
		if(tempX >= this.gameMatrix.length){
			return false
		}
		if(roundedY >= this.gameMatrix[0].length){
			return false
		}
		if(roundedY >= config.bounds.y - 1){
			return true
		}
		let matrixContent = this.gameMatrix[Math.ceil(tempX)][roundedY + 1]
		if(matrixContent && matrixContent != 0){
			return matrixContent
		}
		// }
	}
	verifyDown() {
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
			if(this.verifySingleDown(this.currentEntityList[i])){
				config.effectsLayer.shakeY(0.3,5,0.5);
				this.addOnMatrix(true);
				return true;
			}
		}
	}
	removeCurrentPiece(){
		for (var i = this.currentEntityList.length - 1; i >= 0; i--) {
			if(this.currentEntityList[i] && this.currentEntityList[i].parent){
				this.currentEntityList[i].parent.removeChild(this.currentEntityList[i]);
			}
		}
	}
	removeSinglePiece(piece){
		let tempX = (piece.position.x / config.pieceSize);
		let tempY = (piece.position.y / config.pieceSize);
		let roundedY = Math.ceil(tempY)
		this.gameMatrix[tempX][roundedY] = 0;
		if(piece.parent)
			piece.parent.removeChild(piece);
	}
	addOnMatrix(isColided, piece) {
		if(this.currentShapeData.type == "SHOOTER" && !piece){
			this.removeCurrentPiece();
			this.addShockwaveByPiece(this.currentEntityList[this.currentEntityList.length - 1]);
			config.effectsLayer.shakeX(0.5,5,0.5);
			config.effectsLayer.shakeY(0.5,5,0.5);
			config.effectsLayer.updateRGBSplitter(4);
			config.effectsLayer.fadeSplitter(0,2,0);

			this.border.tint = this.currentColor;
			return;
		}
		if(!piece){
			for (var i = this.currentEntityList.length - 1; i >= 0; i--) {	
				let tempX = (this.currentEntityList[i].position.x / config.pieceSize);
				let tempY = (this.currentEntityList[i].position.y / config.pieceSize);
				let roundedY = Math.ceil(tempY)
				if(this.gameMatrix[tempX][roundedY] == 0){
					this.gameMatrix[tempX][roundedY] = this.currentEntityList[i];
					this.currentEntityList[i].position.y = Math.floor(this.currentEntityList[i].position.y / config.pieceSize) * config.pieceSize;
				}else{
					if(this.currentEntityList[i] && this.currentEntityList[i].parent){
						this.currentEntityList[i].parent.removeChild(this.currentEntityList[i]);
					}
				}
			}
			if(isColided && this.updateVisibleParts()){
				this.gameOver();
			}
		}else{
			let tempX = (piece.position.x / config.pieceSize);
			let tempY = (piece.position.y / config.pieceSize);
			let roundedY = Math.ceil(tempY) - 1
			if(this.gameMatrix[tempX][roundedY] == 0){

				// if(!this.gameMatrix[tempX][roundedY]){
				piece.position.y = Math.floor(piece.position.y / config.pieceSize) * config.pieceSize;
				piece.tint = this.currentColor;
				this.gameMatrix[tempX][roundedY] = piece;
				this.verifyLines();			
			}else{
				piece.parent.removeChild(piece);
			}

		}
		this.border.tint = this.currentColor;
	}
	gameOver() {
		this.downSpeedIncrease = 0;
		this.started = false;
		this.gameOvering = true;
		this.hideGame();


		console.log(this.points);


		let accum = 1;
		for (var i = 0; i < this.gameMatrix.length; i++) {
			for (var j = 0; j < this.gameMatrix[i].length; j++) {
				if(this.gameMatrix[i][j]){
					this.pointsParticle(accum, this.gameMatrix[i][j], accum * 0.05 + 0.1, this.gameMatrix[i][j]);
					accum++;
				}
			}
		}
		setTimeout(function(){
			this.destroyGame();
			this.showGameOverInfo();	
		}.bind(this), ((accum * 0.05 + 0.1) * 1000 + 1000));	
	}
	//SCREEN
	showGameOverInfo() {
		this.gameOvering = false;

		if(this.bestScore < this.points){
			this.addInfoLabel(["new","record",this.updatePoints()], false, true);
			this.bestScore = this.points;

			this.labelBestScore.text = "BEST SCORE: "+this.bestScore;
			this.labelBestScore.position.x = config.width - this.labelBestScore.width - 5;

			config.cookieManager.createCookie("bestPoints",this.bestScore,365);
			//save best score
		}else{
			this.addInfoLabel(["SCORE", this.updatePoints()], false, true, true);
			this.addBlinkingLabel("BEST SCORE: "+this.bestScore);
		}

	}
	onBackCallback() {
		
	}
	toInit(){
		
	}


	//PARTICLES
	//update particles position
	updateParticles(delta){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction += particle.turningSpeed * 0.01;
	        particle.position.x += Math.sin(particle.direction) * (particle.speed * particle.scale.y);
	        particle.position.y += Math.cos(particle.direction) * (particle.speed * particle.scale.y) - (delta * 0.7);
	        //particle.rotation = -particle.direction + Math.PI;
	        //particle.alpha += delta;
	        if(particle.position.x < 0 || particle.position.x > config.width || particle.y < 0){
	        	particle.x = Math.floor(config.width * Math.random() / 4) * 4;
		    	particle.y = (config.height) + 200 * Math.random();
	        }
		}
		// this.particleUpdater += delta*20;
		// if(this.particleUpdater > this.particles.length){
		// 	this.particleUpdater = this.particles.length;
		// }
	}
	//create new particles
	randomParticles(){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction = ((Math.random() * 180 - 90) /180 * Math.PI);
	    }
	}
	linearParticles(){
		for (var i = 0; i < this.particles.length; i++)
	    {
	        var particle = this.particles[i];
	        particle.direction = 0;
	    }
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
		for (let i = 0; i < 50; i++)
		{
		    let particle = PIXI.Sprite.fromImage('./assets/particle2.png');
		    particle.anchor.set(1, 1);
		    particle.scale.set(1, 0.5);
		    // let angle = (Math.random() * 180 + 90) /180 * Math.PI;
		    // particle.x = config.width / 2 + Math.sin(angle) * 100;
		    // particle.y = config.height / 2 + Math.cos(angle) * 50;

		    particle.x = Math.floor(config.width * Math.random() / 4) * 4;
		    particle.y = (config.height + 200) * Math.random();


		    particle.alpha = Math.random();
		    particle.direction = 0;
		    particle.turningSpeed = 0;
		    particle.speed = -8 + Math.random() * 1.5;
		    this.particles.push(particle);
		    this.particlesContainer.addChild(particle);
		}
	}

	//UPDATE
	//update timer
	updateTimer(delta){
		
		if(this.ended){
			return;
		}
		
	}
	//game update
	updatePoints(){
		let str = '0000000';
		if(this.points < 100){
			str = '000000'+this.points
		}else if(this.points < 100){
			str = '00000'+this.points
		}else if(this.points < 1000){
			str = '0000'+this.points
		}else if(this.points < 10000){
			str = '000'+this.points
		}else if(this.points < 100000){
			str = '00'+this.points
		}else if(this.points < 1000000){
			str = '0'+this.points
		}else{
			str = this.points
		}
		
		this.labelPoints.text = str;
		return str;
	}
	update(delta){
		this.rawDelta = delta;
		delta *= (this.normalizedDelta + this.downSpeedIncrease);
		
		super.update(delta);
		this.updateParticles(delta);
		this.creatorLabel.text = this.shuffleText('By JEFF RAMOS');


		

		
		if(this.gameMode == "MENU" || this.gameOvering){
			this.updateTitle();
			//this.updateMenu();
			return;
		}


		if(!this.started){
			return;
		}

		this.filterDescription.text = this.shuffleText(this.filterLabel, false, true);
		this.filterDescription.position.x = (this.gameBorderContainer.width * this.gameContainer.scale.x / 2 - this.filterDescription.width / 2) ;
		this.filterDescription.position.y = this.gameBorderContainer.height * this.gameContainer.scale.y / 2 - this.filterDescription.height;
		if(this.filterDescription.tint != this.currentColor){
			this.filterDescription.tint = this.currentColor;
		}

		//this.gameContainer.rotation += 0.001;
		//this.gameBorderContainer.rotation += 0.001;
		this.updatePoints();
		this.gameCounter += delta;
		this.updateBulletList(this.rawDelta);
		this.updateBombList();

		if(this.meteorRain){
			this.meteorTimeCounter += this.rawDelta;
			if(this.meteorTimeCounter >= 0.3){
				this.fallMeteor();
			}
		}

		if(this.currentShapeData && this.currentShapeData.type == "BRICK_BREAKER"){
			this.updateBrickBreaker(this.rawDelta);
			return;
		}

		this.comboTimer -= this.rawDelta;
		if(this.comboTimer < 0){
			this.comboTimer = 0;
		}
		this.updateComboBar();
		if(this.gameCounter >  (this.rotatingCrazy ? 0.5 : this.gameLevelSpeed)){
			this.updateMove();
			this.gameCounter = 0;
		}
		
	}
}
