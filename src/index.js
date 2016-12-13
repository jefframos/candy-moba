import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import PrototypeScreen from './game/screen/PrototypeScreen';



PIXI.loader
	.add('./assets/Cupcake/cupcake0.json')
	.add('./assets/Cupcake/cupcake1.json')
	.add('./assets/Cupcake/cupcake2.json')
	.add('./assets/Environment/environment0.json')
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
