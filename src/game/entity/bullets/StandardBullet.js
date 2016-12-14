import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardBullet extends Entity {

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
        this.animationContainer.y = -135
        this.addChild(this.animationContainer);

        // this.sprite = new PIXI.Sprite(PIXI.Texture.fromFrame('cherry.png'))    
        // this.sprite.anchor.set(0.6);

        let idCherry = Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'cherryBullet'+idCherry+'00',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5},
            loop:false
        });

        this.animationModel.push({
            label:'explode',
            src:'cherryBullet'+idCherry+'00',
            totalFrames:6,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:0.5},
            loop:false
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);

        // this.animationContainer.addChild(this.sprite);
       
        this.velocity = velocity;
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.gravity = 15;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        this.radius = 30;
        this.externalRadius = 0;
        //this.debugCollision();

        // this.sprite.scale.set(this.starterScale)
    }

    update ( delta ) {
        if(this.kill2){
            return;
        }

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


        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
    }	
}
