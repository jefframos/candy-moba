import plugins from './plugins';
import config  from './config';
import Game from './Game';
import ScreenManager from './screenManager/ScreenManager';
import ParticleBuilderScreen from './game/screen/ParticleBuilderScreen';



PIXI.loader
	.add('./assets/assets.json')
	.load(configGame);

function configGame(){

	let game = new Game(config);
	
	//create screen manager
	let screenManager = new ScreenManager();
	//add screens
	let startScreen = new ParticleBuilderScreen('ParticleBuilderScreen');

	game.stage.addChild(screenManager);

	screenManager.addScreen(startScreen);
	//change to init screen
	screenManager.forceChange('ParticleBuilderScreen');	

	game.start();
}
