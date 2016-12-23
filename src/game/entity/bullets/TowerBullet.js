import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
import StandardBullet  from './StandardBullet';
export default class TowerBullet extends StandardBullet {

    constructor(game, velocity, lifeTime, power, team) {

        super(game,velocity,lifeTime);

        
        this.power = power;
        this.team = team;

        // this.build();
    }

    buid(){
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
       
        this.spriteVelocity = {x:0,y:0};

        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.gravity = 3800;
        // this.scale.set(0);
        this.kill2 = false

        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        this.radius = 10;
        this.externalRadius = 0;
    }

    bulletAttackCollision() {
        let collisionList = this.game.getCollisionList(this,['enemy', 'player'], true);
        if(collisionList){
        for (var i = 0; i < collisionList.length; i++) {
                if(collisionList[i].entity.hit(this.power)){
                    return true
                }
            }
        }
        return false
    }

}
