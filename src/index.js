import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import PrototypeScreen from './game/screen/PrototypeScreen';



PIXI.loader
	.add('./assets/Enemies/enemies0.json')
	.add('./assets/Enemies/enemies1.json')
	.add('./assets/Enemies/enemies2.json')
	// .add('./assets/Cupcake/cupcake0.json')
	// .add('./assets/Cupcake/cupcake1.json')
	// .add('./assets/Cupcake/cupcake2.json')
	// .add('./assets/Cupcake/cupcake3.json')
	.add('./assets/Cupcake/cupcakeMini0.json')
	.add('./assets/Cupcake/cupcakeMini1.json')
	.add('./assets/Environment/environment0.json')
	.add('./assets/Effects/effects0.json')
	.add('./assets/Towers/towers0.json')
	.add('./assets/Spawners/spawners0.json')
	.add('./assets/UI/ui0.json')
	.add('./assets/data/map_data_1.json')
	.load(configGame);

function configGame(){

	window.game = new Game(config);
	
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
