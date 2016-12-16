import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardEnemy extends Entity {

    constructor(game) {

    	super();

        this.game = game;
        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0);
        this.roundBase.drawCircle(0,0,60);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = -5
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);


        this.actionTimer = -1;
        this.action = null;

        this.build();


        // this.sprite.scale.set(this.starterScale)
    }

    build () {

        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'idle/tomatoIdle00',
            totalFrames:15,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'killBack',
            src:'dead1/tomatoDead100',
            totalFrames:12,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'killFront',
            src:'dead1/tomatoDead100',
            totalFrames:12,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'hurt',
            src:'hurt/tomatoHurt00',
            totalFrames:10,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:-15,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attack',
            src:'attack/tomatoAttack00',
            totalFrames:23,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:45,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

          this.animationModel.push({
            label:'walk',
            src:'walk/tomatoWalk00',
            totalFrames:17,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:2,y:0},
            anchor:{x:0.5,y:1},
            loop:true
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);
        this.animationManager.finishCallback = this.finishAnimation.bind(this);

        // this.animationContainer.addChild(this.sprite);
       
        this.speed = {x:100,y:100};
        this.velocity = {x:0,y:0};
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
         this.radius = 120;
        this.externalRadius = 160;
        // this.debugCollision();

        this.killed = false;

        // this.animationManager.showJust(['idle','attack'])

        this.flipKill = false;

        this.side = Math.random() < 0.5?1:-1;

        
        this.move();

    }
    attack ( ) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('attack');
        
        this.actionTimer = Math.random() * 2 + 1.5;
        this.action = this.move;
    }

    wait ( ) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('idle');
        
        this.actionTimer = Math.random() * 3 + 1;
        this.action = this.attack;
    }
    move ( ) {
        this.side *= -1;
        this.velocity.x = this.speed.x * this.side;

        if(Math.random() < 0.3){
            this.velocity.y = this.speed.y * (Math.random() < 0.5?1:-1);
        }
        this.animationManager.changeState('walk');
         this.actionTimer = Math.random() * 3 + 1;
        this.action = this.wait;
    }

    finishAnimation ( ) {

        if(this.animationManager.state == 'killFront' || this.animationManager.state == 'killBack'){
            this.killed = true;
            return;
        }

        this.animationManager.changeState('idle', true);
    }
    hit(power, forceSide) {
        if(this.life < 0){
            return false;
        }

        this.wait();

        this.life -= power;

        this.animationManager.changeState('hurt', true);

        if(forceSide){
            this.side = forceSide;
        }

        if(this.life <= 0){
            this.dead();
            //return false;
        }


        return true;
    }
    dead() {

        TweenLite.to(this.base,0.5,{alpha:0})
        this.collidable = false;
        
        if(this.side < 0){
            if(this.flipKill){
                this.side = 1;
            }
            this.updateScale();
            this.animationManager.ableToChangeAnimation = true;
            this.animationManager.changeState('killFront', true);
        }else{
            this.animationManager.changeState('killBack', true);
        }
        //this.kill = true;
    }
    update ( delta ) {



        if(this.killed){
            return;
        }



        if(this.actionTimer > 0){
            this.actionTimer -= delta;
            if(this.actionTimer <= 0){
                this.actionTimer = Math.random() * 3 + 1;
                this.side *= -1;
                this.action();   
            }
        }
        this.animationManager.updateAnimations();

        if(this.kill2){
            return;
        }

        // if(this.lifeTime <= 0){
        //     this.spriteVelocity.y += this.gravity;
        //     this.animationContainer.y += this.spriteVelocity.y * delta;
            
        //     if(this.animationContainer.y >= 0){
        //         this.animationContainer.rotation = 0;
        //         this.animationManager.changeState('explode');
        //         this.base.visible = false;
        //         this.kill2 = true;
        //     }
        // }else{
        //     this.lifeTime -= delta;
        // }

        // this.animationContainer.rotation += delta * 10;


        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
    }	
}
