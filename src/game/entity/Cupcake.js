import PIXI from 'pixi.js';
import utils  from '../../utils';
import AnimationManager  from './utils/AnimationManager';
import Entity  from './Entity';
export default class Cupcake extends Entity {

    constructor(game) {

    	super();

        this.game = game;

        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0);
        this.roundBase.drawCircle(0,0,100,100);
        this.roundBase.scale.y = 0.4
        this.roundBase.alpha = 0.1;
        this.roundBase.x = 0;
        this.base.addChild(this.roundBase);

        this.addChild(this.base);
        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 25
        this.addChild(this.animationContainer);


        this.animationModel = [];
        this.animationModel.push({
            label:'idle',
            src:'idle00',
            totalFrames:14,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:0,y:0},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'run',
            src:'run00',
            totalFrames:24,
            startFrame:8,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:-15,y:4},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'meleeAttack1',
            src:'meleeAttack100',
            totalFrames:16,
            startFrame:7,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:43,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'meleeAttack2',
            src:'meleeAttack200',
            totalFrames:16,
            startFrame:7,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:43,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'meleeAttack3',
            src:'meleeAttack300',
            totalFrames:28,
            startFrame:12,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:83,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'meleeAttack4',
            src:'meleeAttack400',
            totalFrames:38,
            startFrame:16,
            animationSpeed:0.7,
            movieClip:null,
            position:{x:50,y:5},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'jumpIn',
            src:'jump00',
            totalFrames:7,
            startFrame:0,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:-10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            // haveCallback:true,
        });

        this.animationModel.push({
            label:'jumpFalling',
            src:'jump00',
            totalFrames:13,
            startFrame:7,
            animationSpeed:0.3,
            movieClip:null,
            position:{x:-10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            // haveCallback:true,
        });

        this.animationModel.push({
            label:'jumpOut',
            src:'jump00',
            totalFrames:20,
            startFrame:13,
            animationSpeed:0.3,
            movieClip:null,
            position:{x:-10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'rangeAttack',
            src:'rangeAttack100',
            totalFrames:15,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:4,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'rangeAttackEnd',
            src:'rangeAttack100',
            totalFrames:33,
            startFrame:15,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:4,y:2},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'areaAttack',
            src:'areaAttack100',
            totalFrames:30,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-15,y:36},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'killBack',
            src:'kill100',
            totalFrames:22,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-190,y:15},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'revive',
            src:'areaAttack100',
            totalFrames:30,
            startFrame:23,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-15,y:36},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'speedAttack',
            src:'speedAttack00',
            totalFrames:8,
            startFrame:0,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-40,y:6},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'speedAttackEnd',
            src:'speedAttack00',
            totalFrames:18,
            startFrame:8,
            animationSpeed:0.65,
            movieClip:null,
            position:{x:-40,y:6},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });


        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer)
        this.animationManager.finishCallback = this.finishAnimation.bind(this);
        this.animationManager.startCallback = this.startAnimation.bind(this);



        this.entityModel = {
            speed:{x:350, y:250},
            standardTimeJump:0.7,
            jumpForce:300,
            rangeSpeed:4,
            attackSpeed:0.2,
        }
        this.side = 1; 
        this.meleeComboList = ['meleeAttack1','meleeAttack2','meleeAttack3','meleeAttack4']
        this.currentMeleeCombo = 0;
        // this.updateState();
       
        // this.scale.set(1.5)

        //this.timer = 3.0;
        //this.nextAction = this.animationManager.changeState;
        // setTimeout(() => {
        //     this.animationManager.changeState();
        // }, 3000);

       // this.updateState();
        this.velocity = {x:0, y:0};

        this.comboStandardTimer = 0.9;

        this.animationManager.ableToChangeAnimation = true;
        this.rangeAttacking = false;
        this.attacking = false;
        this.jumping = false;
        this.jumpingOut = false;
        this.updateable = true;


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('idle');

        // this.animationManager.showJust(['idle','speedAttack'])

        // this.entityModel.standardTimeJump = 0.7;
        this.timeJump = 0;
        this.attackTime = -1;
        this.dying = false;
        this.respawning = false;
        this.reset();


        this.radius = 100;
        this.externalRadius = 160;
        // this.debugCollision();
       

    }

    
    reset() {
        this.timeJump = 0;
        this.animationContainer.alpha = 1;
        this.base.alpha = 1;
        this.respawning = false;
        this.currentMeleeCombo = 0;
        this.animationManager.ableToChangeAnimation = true;
        this.rangeAttacking = false;
        this.speedAttacking = false;
        this.attacking = false;
        this.jumping = false;
        this.jumpingOut = false;
        this.updateable = true;
        this.comboTimer = 0;
        this.starterScale = 0.5;
        this.standardScale = this.starterScale;
        this.speedFactor = 1;

        this.collidable = true;

        this.areaAttackTimer = -1;

        this.timeJump = 0;
        this.attackTime = -1;
        this.rangeTime = -1;
        //this.scale.set(this.standardScale)

    }

    die() {
        this.collidable = false;

        if(this.animationManager.changeState('killBack')){
            this.animationContainer.y = 0;
        }
        this.dying = true;
        TweenLite.to(this.base,0.5, {alpha:0});
    }
    speedNormal() {
        this.speedFactor = 1;
        let animModel = this.animationManager.getAnimation('run');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    speedUp() {
        this.speedFactor = 1.5;
        let animModel = this.animationManager.getAnimation('run');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    areaAttackCollision() {
        this.areaAttackTimer = -1;
        let collisionList = this.game.getExternalColisionList(this,'enemy');
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                // if(collisionList[i].front || collisionList[i].back){
                collisionList[i].entity.side = this.side * -1;
                collisionList[i].entity.hit(5)
                // }
            }
        }
    }

    meleeAttackCollision() {
        let collisionList = this.game.getColisionList(this,'enemy');
        if(collisionList){
            for (var i = 0; i < collisionList.length; i++) {
                if(collisionList[i].right || collisionList[i].left){
                    collisionList[i].entity.side = this.side * -1;
                    if(collisionList[i].entity.hit(1)){
                        return true
                    }
                }
            }
        }
        return false
    }
    areaAttack() {
        if(this.dying){
            return;
        }
        if(this.jumping){
            if(this.animationManager.changeState('areaAttack')){
                this.animationContainer.y = 0;
                this.timeJump = 0;

                this.areaAttackTimer = 0.5;

                //this.jumping = false;
            }
            return;
        }
    }
    jump() {
        if(this.dying){
            return;
        }
        if(this.jumping){
            return
        }
        if(this.animationManager.changeState('jumpIn')){
            this.jumping = true;
            this.timeJump = this.entityModel.standardTimeJump;
        }
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    rangeAttack() {
        if(this.dying){
            return;
        }
        if(this.rangeAttacking){
            return;
        }
        if(this.speedAttacking){
            return;
        }
        if(this.jumping || this.jumpOut){
            return;
        }
        if(this.animationManager.changeState('rangeAttack')){

            let rangeAnimation = this.animationManager.getAnimation('rangeAttack');
            rangeAnimation.movieClip.animationSpeed = this.entityModel.rangeSpeed * rangeAnimation.animationSpeed;

            let rangeAnimationEnd = this.animationManager.getAnimation('rangeAttackEnd');
            rangeAnimationEnd.movieClip.animationSpeed = this.entityModel.rangeSpeed * rangeAnimationEnd.animationSpeed;

            console.log(rangeAnimation.movieClip.animationSpeed);

            this.rangeAttacking = true;
            this.rangeSpeedY = this.velocity.y;
        }
        
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    attack() {
        if(this.dying){
            return;
        }
        if(this.attacking){
            return;
        }
        if(this.rangeAttacking){
            return;
        }
         if(this.speedAttacking){
            return;
        }
        if(this.areaAttackTimer > 0){
            return;
        }
        if(this.jumping){
            console.log(this.rangeAttacking);
            this.areaAttack();
            return;
        }
//CONTINUAR AQUI
        // if(this.speedFactor > 1){
        //     this.animationManager.changeState('speedAttack');
        //     this.speedAttacking = true;
        // }



        // if(this.canCombo()){
        //     this.currentMeleeCombo ++;
        // }else{
        //     this.currentMeleeCombo = 0;
        // }


        // console.log('ATTACK');
        if(this.animationManager.changeState(this.meleeComboList[this.currentMeleeCombo], this.attackTime <= 0) || this.attackTime <= 0){
            this.attackTime = this.entityModel.attackSpeed;
            this.attacking = true;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.comboTimer = this.comboStandardTimer;


            let canCombo = this.meleeAttackCollision();

            if(this.canCombo() && canCombo){
                this.currentMeleeCombo ++;
            }else{
                this.currentMeleeCombo = 0;
            }

        }
    }
    canCombo() {
        // console.log(this.comboTimer);
        return this.currentMeleeCombo < this.meleeComboList.length - 1;
        // return this.comboTimer > 0 && this.currentMeleeCombo < this.meleeComboList.length - 1;
    }
    isMeleeCombo() {
        for (var i = 0; i < this.meleeComboList.length; i++) {
            if(this.animationManager.state == this.meleeComboList[i]){
                return true
            }
        }
        return false
    }
    startAnimation() {
    }
    finishJump() {
        if(this.dying){
            return;
        }
        this.jumpingOut = false;
        if(this.jumping){
            this.jumpingOut = true;
            this.animationManager.changeState('jumpOut');
        }
        this.animationContainer.y = 0;
        this.jumping = false;
    }

    respaw() {
        this.animationManager.changeState('revive');
        this.reset();
    }
    startRespaw() {
        if(this.respawning){
            return
        }
        this.respawning = true;
        TweenLite.to(this.animationContainer, 1, {alpha:0, delay:1, onComplete:this.respaw.bind(this)})
    }
    finishAnimation() {
        this.animationManager.ableToChangeAnimation = true;

        if(this.animationManager.state == 'revive'){
            this.dying = false;
        }
        

        if(this.dying){
            
            this.startRespaw();
            //respaw
            return
        }

        if(this.jumping){
            return
        }


        if(this.animationManager.state == 'speedAttackEnd'){
            this.speedAttacking = false;
        }
        if(this.speedAttacking){
            ////console.log('RANGING');
            //let bulletPosition = {x:this.position.x + (150  * this.side) * Math.abs(this.scale.x), y: this.position.y};
            //this.game.addBullet(bulletPosition, {x:800 * this.side, y:this.rangeSpeedY}, 0.1);
            this.animationManager.changeState('speedAttackEnd');
            return;
        }

        
        if(this.animationManager.state == 'rangeAttackEnd'){
            this.rangeAttacking = false;
        }
        if(this.rangeAttacking){
            ////console.log('RANGING');
            let bulletPosition = {x:this.position.x + (150  * this.side) * Math.abs(this.scale.x), y: this.position.y};
            this.game.addBullet(bulletPosition, {x:800 * this.side, y:this.rangeSpeedY}, 0.1);
            this.animationManager.changeState('rangeAttackEnd');
            return;
        }


        this.jumpingOut = false;

        if(this.isMeleeCombo()){            
            //this.attacking = false;
        }

        this.animationManager.changeState('idle');
    }

    stopMove() {
        if(this.dying){
            return;
        }
        if(this.jumping || this.jumpingOut){
            return;
        }
        this.velocity.x =0;
        this.velocity.y =0;
        this.animationManager.changeState('idle');
    }
    move(value) {
        if(this.dying){
            return;
        }
        // console.log(value, this.entityModel.speed, this.speedScale, this.speedFactor);
        this.velocity.x = this.entityModel.speed.x * (value[0]) * (this.speedScale * this.speedScale) * this.speedFactor;
        this.velocity.y = this.entityModel.speed.y * (value[1]) * (this.speedScale * this.speedScale) * this.speedFactor;
        if(Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.05){
            this.stopMove();
        }else{
            if(!this.jumping){
                this.animationManager.changeState('run');
            }
        }
    }
  
    update ( delta ) {
        ////console.log(this.jumping);
        ////console.log(this.jumpingOut);
        //console.log(this.scale);
        this.animationManager.updateAnimations();

        if(this.dying){
            return;
        }
        ////console.log(this.velocity.y);
        // this.timer -= delta;
        //console.log(this.attacking);
        if(this.comboTimer > 0){
            this.comboTimer -= delta;
        }else{
            this.comboTimer = 0;
            this.currentMeleeCombo = 0;
        }

        if(this.areaAttackTimer > 0){
            this.areaAttackTimer -= delta;
            if(this.areaAttackTimer <= 0){
                this.areaAttackCollision();
            }
        }

        if(this.attackTime > 0){
            this.attackTime -= delta;
            if(this.attackTime <= 0){
                this.attacking = false;
                this.attackTime = -1;
            }
        }

        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }

        // console.log(this.velocity, delta);

        if(this.jumping){
            this.timeJump -= delta;
            let jumpFactor = 0.5 - utils.distance(utils.linear(this.timeJump / this.entityModel.standardTimeJump),0,0.5,0);
            // let jumpFactor = 0.5 - utils.distance(utils.easeInQuad(this.timeJump / this.entityModel.standardTimeJump),0,0.5,0);
            //// console.log(this.timeJump / this.entityModel.standardTimeJump);
            this.animationContainer.y = -jumpFactor * this.entityModel.jumpForce;
            if(this.timeJump / this.entityModel.standardTimeJump > 0.5){
                this.animationManager.changeState('jumpIn')
            }else{
                this.animationManager.changeState('jumpFalling')
            }

            if(this.timeJump <= 0){
                this.finishJump();
            }
        }

        if(this.velocity.x < 0){
            this.side = -1;
        }else if(this.velocity.x > 0){
            this.side = 1;
        }
        

        // console.log(this.velocity, this.scale);

        if(this.attacking || this.jumpingOut || this.rangeAttacking){
            return
        }
        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
