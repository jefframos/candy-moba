import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import PrototypeScreen from './game/screen/PrototypeScreen';



PIXI.loader
	.add('./assets/Cupcake/cupcake.json')
	.load(configGame);

function configGame(){

	let game = new Game(config);
	
	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let startScreen = new PrototypeScreen('PrototypeScreen');

	game.stage.addChild(screenManager);

	screenManager.addScreen(startScreen);
	//change to init screen
	screenManager.forceChange('PrototypeScreen');	

	game.start();
}