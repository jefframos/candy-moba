import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class StandardEnemy extends Entity {

    constructor(game) {

    	super();

        this.type = 'enemy';

        this.game = game;
        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0xffffff);
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
        

        // this.build();

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
            label:'attackIn',
            src:'attack/tomatoAttack00',
            totalFrames:10,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:45,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'attackOut',
            src:'attack/tomatoAttack00',
            totalFrames:23,
            startFrame:11,
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

        this.side = -1;//Math.random() < 0.5?1:-1;

        this.attackTimer = -1;
        this.attackSpeed = 3;
        this.attacking = false;

        this.ableToMove = true;

        this.entityToAttack = null;
        //this.actionTimer = Math.random() * 2 + 1.5;
        //this.action = this.move;

        this.targetPosition = {x:-1,y:-10};
        this.followTarget = false;
        this.move();

    }


    wait ( ) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('idle');
        
        this.actionTimer = 0.1//Math.random() * 3 + 1;
        this.action = this.move;
    }
    setTarget (position) {
        this.targetPosition.x = position.x;
        this.targetPosition.y = position.y;
        this.followTarget = true;
        this.move();
    }
    move () {
        // console.log(this.attacking);
        if(this.attacking && !this.ableToMove){
            return
        }
        if(this.followTarget){

            let angle = Math.atan2(this.targetPosition.y - this.y, this.targetPosition.x - this.x);
            this.velocity.x = Math.cos(angle) * this.speed.x;
            this.velocity.y = Math.sin(angle) * this.speed.x;

            if(this.velocity.x < 0){
                this.side = -1;
            }else{
                this.side = 1;
            }
        }else{
            this.velocity.x = this.speed.x * this.side;
        }

        this.animationManager.changeState('walk');
    }

    moveBack (delta) {
        this.side *= -1;

        this.velocity.x = this.speed.x * this.side;
        this.velocity.y *= -1;

        this.x += this.velocity.x * delta * this.speedScale * 2;
        this.y += this.velocity.y * delta * this.speedScale * 2;
        
        this.animationManager.changeState('walk');
        // this.actionTimer = 2//Math.random() * 3 + 1;
        // this.action = this.wait;
    }

    attack () {
        //this.actionTimer = this.attackTimer + 0.1//Math.random() * 2 + 1.5;
        //this.action = this.move;
        this.attackTimer = this.attackSpeed;
        // console.log(this.entityToAttack);
        let newList = this.game.getSimpleEntityCollision(this, this.entityToAttack.entity);
        // console.log('ATTACK', newList);
        if(newList.length){
            this.entityToAttack.entity.hit(1);
        }
        // this.attacking = false;
    }
    prepareAttack (target) {
        if(!target || this.attacking){
            return
        }

        this.ableToMove = false;

        this.entityToAttack = target;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.animationManager.changeState('attackIn', true);
        this.attacking = true;

        
        if(this.entityToAttack.entity.type == 'tower'){
            this.entityToAttack.entity.addEnemy(this);
        }
        
    }
    finishAnimation ( ) {
        if(this.animationManager.state == 'attackOut'){
            this.ableToMove = true;
        }
        if(this.animationManager.state == 'attackIn'){
            this.animationManager.changeState('attackOut', true);
            this.attack();
            return;

        }
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

        // this.wait();

        this.hitting = true;
        this.hitTime = 0.3;

        this.life -= power;

        if(this.animationManager.state != 'attack'){
            this.animationManager.changeState('hurt', true);
        }

        if(forceSide){
            this.side = forceSide;
        }

        if(this.life <= 0){
            this.dead();
            //return false;
        }


        return true;
    }

    endHit(){
        this.hitting = false;
        this.hitTime = -1;
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
    updateBaseColor ( ) {
        if(this.hitting){
            this.roundBase.tint = 0xFF0000;
        }else{
            this.roundBase.tint = 0;
        }
    }
    update ( delta ) {



        if(this.killed){
            return;
        }
        // console.log(this.followTarget);
        

        if(!this.attacking){
            let entityCollisions = this.game.getColisionList(this,['tower','player']);
            // console.log(entityCollisions);
            if(entityCollisions && entityCollisions.length){
                if(entityCollisions[0].ableToHit || entityCollisions[0].entity.type == 'tower'){
                    if(entityCollisions[0].trueLeft){
                        this.side = 1;
                    }else{
                        this.side = -1;
                    }
                    this.prepareAttack(entityCollisions[0]);
                }
            }
        }

        if(this.attackTimer > 0){
            this.attackTimer -= delta;
            if (this.attackTimer <= 0) {
                this.attacking = false;
            }
        }
        // console.log(this.velocity);
        if(this.actionTimer > 0){
            this.actionTimer -= delta;
            if(this.actionTimer <= 0){
                //this.actionTimer = Math.random() * 3 + 1;
                //this.side *= -1;
                this.action();   
            }
        }
        this.animationManager.updateAnimations();

        if(this.hitTime > 0){
            this.hitTime -= delta;
            if(this.hitTime <= 0){
                this.endHit();
            }
        }

        if(this.followTarget){
            if(utils.distance(this.targetPosition.x, this.targetPosition.y, this.x, this.y) < 20){
                //this.followTarget = false;
                this.wait();
            }else{
                // console.log('MOVE');
                this.move();
            }
        }


        this.updateBaseColor();

        if(this.game.worldCollision(this.x , this.y)){
            this.moveBack(delta);
            return
        }
        // console.log(this.velocity);

        this.x += this.velocity.x * delta * this.speedScale;
        this.y += this.velocity.y * delta * this.speedScale;
    }	
}
