import PIXI from 'pixi.js';
import utils  from '../../utils';
export default class Cupcake extends PIXI.Container {

    constructor() {

    	super();


        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0);
        this.roundBase.drawCircle(0,0,100,100);
        this.roundBase.scale.y = 0.5
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
            startFrame:1,
            animationSpeed:0.6,
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
            startFrame:1,
            animationSpeed:0.6,
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
            startFrame:10,
            animationSpeed:0.6,
            movieClip:null,
            position:{x:93,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationModel.push({
            label:'meleeAttack4',
            src:'meleeAttack400',
            totalFrames:38,
            startFrame:16,
            animationSpeed:0.6,
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
            animationSpeed:0.6,
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
            position:{x:-8,y:6},
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
            position:{x:-8,y:6},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });


        for (var i = 0; i < this.animationModel.length; i++) {
            let texturesList = [];
            this.animationModel[i]

            for (let j = 0; j < this.animationModel[i].totalFrames; j++)
            {
                if(j+1 > 9){
                    var texture = PIXI.Texture.fromFrame(this.animationModel[i].src+ (j+1) + '.png');
                }else{
                    var texture = PIXI.Texture.fromFrame(this.animationModel[i].src  +'0'+ (j+1) + '.png');
                }

                texturesList.push(texture);
                texture.smooth = true;
            }

            this.animationModel[i].movieClip = new PIXI.MovieClip(texturesList);
            if(this.animationModel[i].loop != undefined){
                this.animationModel[i].movieClip.loop = this.animationModel[i].loop;
                this.animationModel[i].movieClip.onComplete = this.animationFinished;
            }
            this.animationModel[i].movieClip.anchor.set(this.animationModel[i].anchor.x,this.animationModel[i].anchor.y);
            this.animationModel[i].movieClip.x = this.animationModel[i].position.x;
            this.animationModel[i].movieClip.y = this.animationModel[i].position.y;
            this.animationModel[i].movieClip.animationSpeed = this.animationModel[i].animationSpeed;
            this.animationModel[i].movieClip.gotoAndStop(this.animationModel[i].startFrame);
            this.animationContainer.addChild(this.animationModel[i].movieClip);

        }


        this.entityModel = {
            speed:{x:350, y:250}
        }
        this.side = 1;
        this.speedFactor = 1;

        this.starterScale = 0.5;
        this.standardScale = this.starterScale;
        this.speedFactor = 1;
        this.scale.set(this.standardScale)


        this.meleeComboList = ['meleeAttack1','meleeAttack2','meleeAttack3','meleeAttack4']
        this.currentMeleeCombo = 0;
        // this.updateState();
       
        // this.scale.set(1.5)

        //this.timer = 3.0;
        //this.nextAction = this.changeState;
        // setTimeout(() => {
        //     this.changeState();
        // }, 3000);

       // this.updateState();
        this.velocity = {x:0, y:0};

        this.comboStandardTimer = 0.9;

        this.ableToChangeAnimation = true;
        this.rangeAttacking = false;
        this.attacking = false;
        this.jumping = false;
        this.jumpingOut = false;
        this.updateable = true;
        this.hideAll();
        this.stopAll();
        this.changeState('idle');

        this.standardTimeJump = 0.7;
        this.timeJump = 0;
        this.dying = false;
        this.respawning = false;
        this.jumpForce = 200;
        this.reset();
       

    }

    reset() {
        this.timeJump = 0;
        this.animationContainer.alpha = 1;
        this.base.alpha = 1;
        this.respawning = false;
        this.currentMeleeCombo = 0;
        this.ableToChangeAnimation = true;
        this.rangeAttacking = false;
        this.attacking = false;
        this.jumping = false;
        this.jumpingOut = false;
        this.updateable = true;
        this.comboTimer = 0;
    }

    die() {
        if(this.changeState('killBack')){
            this.animationContainer.y = 0;
        }
        this.dying = true;
        TweenLite.to(this.base,0.5, {alpha:0});
    }
    speedNormal() {
        this.speedFactor = 1;
        let animModel = this.getAnimation('run');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    speedUp() {
        this.speedFactor = 1.5;
        let animModel = this.getAnimation('run');
        animModel.movieClip.animationSpeed = animModel.animationSpeed * this.speedFactor;
    }
    areaAttack() {
        if(this.dying){
            return;
        }
        if(this.jumping){
            if(this.changeState('areaAttack')){
                this.animationContainer.y = 0;
                this.timeJump = 0;
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
        if(this.changeState('jumpIn')){
            this.jumping = true;
            this.timeJump = this.standardTimeJump;
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
        if(this.jumping || this.jumpOut){
            return;
        }
        if(this.changeState('rangeAttack')){
            this.rangeAttacking = true;
        }
        
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    attack() {
        if(this.dying){
            return;
        }
        if(this.jumping || this.attacking){
            return;
        }

        if(this.canCombo()){
            this.currentMeleeCombo ++;
        }else{
            this.currentMeleeCombo = 0;
        }

        if(this.changeState(this.meleeComboList[this.currentMeleeCombo])){
            this.attacking = true;
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.comboTimer = this.comboStandardTimer;
        }
    }
    canCombo() {
        console.log(this.comboTimer);
        return this.comboTimer > 0 && this.currentMeleeCombo < this.meleeComboList.length - 1;
    }
    isMeleeCombo() {
        for (var i = 0; i < this.meleeComboList.length; i++) {
            if(this.state == this.meleeComboList[i]){
                return true
            }
        }
        return false
    }
    initAnimation() {
    }
    finishJump() {
        if(this.dying){
            return;
        }
        this.jumpingOut = false;
        if(this.jumping){
            this.jumpingOut = true;
            this.changeState('jumpOut');
        }
        this.animationContainer.y = 0;
        this.jumping = false;
    }

    respaw() {
        this.changeState('revive');
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




        this.ableToChangeAnimation = true;

        ////console.log(this.state);
        if(this.state == 'revive'){
            console.log('REVIVE');
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
        if(this.state == 'rangeAttackEnd'){
            this.rangeAttacking = false;
        }
        if(this.rangeAttacking){
            ////console.log('RANGING');
            this.changeState('rangeAttackEnd');
            return;
        }
        this.jumpingOut = false;

        if(this.isMeleeCombo()){            
            this.attacking = false;
        }
    }
    stopCurrent() {
        let current = this.animationModel[this.getAnimationID(this.state)];current.movieClip.gotoAndStop(current.startFrame);
    }
    hideCurrent() {
        this.animationModel[this.getAnimationID(this.state)].movieClip.visible = false;
    }
    hideAll() {
        for (var i = 0; i < this.animationModel.length; i++) {
            let animData = this.animationModel[i];
            animData.movieClip.visible = false;
        }
    }
    stopAll() {
        for (var i = 0; i < this.animationModel.length; i++) {
            let animData = this.animationModel[i];
            if(!animData.movieClip.playing){
                animData.movieClip.stop();
            }
        }
    }
    playMovieclip(id, forcePlay) {
        let animData = this.animationModel[id];
        if(animData.haveCallback){
            this.ableToChangeAnimation = false;
        }else{
            this.ableToChangeAnimation = true;
        }
        if(!animData.movieClip.playing || forcePlay){
            this.initAnimation();
            animData.movieClip.gotoAndPlay( animData.startFrame);
            animData.movieClip.visible = true;
        }
    }

    getAnimation(label) {
        for (var i = 0; i < this.animationModel.length; i++) {
            if(this.animationModel[i].label == label){
                return this.animationModel[i]
            }            
        }
        return null;
    }

    getAnimationID(label) {
        for (var i = 0; i < this.animationModel.length; i++) {
            if(this.animationModel[i].label == label){
                return i
            }            
        }
        return -1;
    }
    setDistance(value) {
        this.standardScale = value * 0.3 + 0.2;

        this.speedScale = this.standardScale / this.starterScale;
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
        this.changeState('idle');
    }
    move(value) {
        if(this.dying){
            return;
        }
        this.velocity.x = this.entityModel.speed.x * (value[0]) * (this.speedScale * this.speedScale) * this.speedFactor;
        this.velocity.y = this.entityModel.speed.y * (value[1]) * (this.speedScale * this.speedScale) * this.speedFactor;
        if(Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.05){
            this.stopMove();
        }else{
            if(!this.jumping){
                this.changeState('run');
            }
        }
    }
    changeState(state){
        if(this.state == state || !this.ableToChangeAnimation){
            return false;
        }

        //console.log(state);

        if(this.state){
            this.stopCurrent()
            this.hideCurrent()
        }
        this.state = state;
        this.updateState();
        return true;
    }
    updateState() {
        this.playMovieclip(this.getAnimationID(this.state));
    }
    updateAnimations(){
         if(this.state && 
            this.animationModel[this.getAnimationID(this.state)].haveCallback && 
            !this.animationModel[this.getAnimationID(this.state)].movieClip.playing)
        {
            this.finishAnimation();
        }
    }
    update ( delta ) {
        ////console.log(this.jumping);
        ////console.log(this.jumpingOut);
        this.updateAnimations();

        if(this.dying){
            return;
        }
        ////console.log(this.velocity.y);
        // this.timer -= delta;
        if(this.comboTimer > 0){
            this.comboTimer -= delta;
        }else{
            this.comboTimer = 0;
            this.currentMeleeCombo = 0;
        }

        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }
        if(this.jumping){
            this.timeJump -= delta;
            let jumpFactor = 0.5 - utils.distance(utils.linear(this.timeJump / this.standardTimeJump),0,0.5,0);
            // let jumpFactor = 0.5 - utils.distance(utils.easeInQuad(this.timeJump / this.standardTimeJump),0,0.5,0);
            //// console.log(this.timeJump / this.standardTimeJump);
            this.animationContainer.y = -jumpFactor * this.jumpForce;
            if(this.timeJump / this.standardTimeJump > 0.5){
                this.changeState('jumpIn')
            }else{
                this.changeState('jumpFalling')
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
        this.scale.x = (this.standardScale) * this.side;
        this.scale.y = this.standardScale
        if(this.attacking || this.jumpingOut || this.rangeAttacking){
            return
        }
        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
