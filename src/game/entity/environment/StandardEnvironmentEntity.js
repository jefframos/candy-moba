import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardEnvironmentEntity extends Entity {

    constructor(velocity, lifeTime) {

    	super();

        this.lifeTime = lifeTime;
        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0);
        this.roundBase.drawCircle(0,0,20);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 0
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);

        let idRock = Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
        this.animationModel.push({
            label:'rock',
            src:'rock1000'+idRock,
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.8},
            loop:false,
            singleFrame:true
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);
             // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('rock');

        this.radius = 30;
        this.externalRadius = 0;
        this.debugCollision();

        this.static = true;

        // this.sprite.scale.set(this.starterScale)
    }

    update ( delta ) {
        //if(this.static){
            return;
        //}

        if(this.lifeTime <= 0){
            this.spriteVelocity.y += this.gravity;
            this.animationContainer.y += this.spriteVelocity.y * delta;
            
            if(this.animationContainer.y >= 0){
                this.animationContainer.rotation = 0;
                this.animationManager.changeState('explode');
                this.base.visible = false;
                this.kill2 = true;
            }
        }else{
            this.lifeTime -= delta;
        }

        this.animationContainer.rotation += delta * 10;
   
        this.scale.x = this.standardScale;
        this.scale.y = this.standardScale;

        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
    }	
}
