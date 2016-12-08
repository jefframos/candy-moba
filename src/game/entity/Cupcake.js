import PIXI from 'pixi.js';

export default class Cupcake extends PIXI.Container {

    constructor() {

    	super();

        this.animationContainer = new PIXI.Container();
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
            animationSpeed:0.5,
            movieClip:null,
            position:{x:-15,y:4},
            anchor:{x:0.5,y:1}
        });

        this.animationModel.push({
            label:'attack1',
            src:'attack100',
            totalFrames:25,
            startFrame:1,
            animationSpeed:0.5,
            movieClip:null,
            position:{x:30,y:0},
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
            speed:{x:300, y:300}
        }
        this.side = 1;

        this.starterScale = 0.5;
        this.standardScale = this.starterScale;
        this.speedFactor = 1;
        this.scale.set(this.standardScale)

        // this.updateState();
       
        // this.scale.set(1.5)

        //this.timer = 3.0;
        //this.nextAction = this.changeState;
        // setTimeout(() => {
        //     this.changeState();
        // }, 3000);

       // this.updateState();
        this.velocity = {x:0, y:0};

        this.ableToChangeAnimation = true;
        this.attacking = false;
        this.updateable = true;
        this.hideAll();
        this.stopAll();
        this.changeState('idle');

    }
    attack() {
        //console.log('attack');
        this.attacking = true;
        this.changeState('attack1');
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    finishAnimation() {
        this.ableToChangeAnimation = true;
        if(this.state =='attack1'){
            this.changeState('idle');
            this.attacking = false;
        }
    }
    stopCurrent() {
        this.animationModel[this.getAnimationID(this.state)].movieClip.stop();
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
            animData.movieClip.gotoAndPlay( animData.startFrame);
            animData.movieClip.visible = true;
        }
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

        this.speedFactor = this.standardScale / this.starterScale;
    }


    stopMove() {
        this.velocity.x =0;
        this.velocity.y =0;
        this.changeState('idle');
    }
    move(value) {
        this.velocity.x = this.entityModel.speed.x * (value[0]) * this.speedFactor;
        this.velocity.y = this.entityModel.speed.y * (value[1]) * this.speedFactor;

        if(Math.abs(this.velocity.x) + Math.abs(this.velocity.y) < 0.05){
            this.stopMove();
        }else{
            this.changeState('run');
        }
    }
    changeState(state){
        ////console.log(state);
        if(this.state == state || !this.ableToChangeAnimation){
            return;
        }

        if(this.state){
            this.stopCurrent()
            this.hideCurrent()
        }
        this.state = state;
        this.updateState();
    }
    updateState() {
        //console.log('updateState');
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

        this.updateAnimations();
       // console.log(this.velocity);
        // this.timer -= delta;

        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }
       
        if(this.velocity.x < 0){
            this.side = -1;
        }else if(this.velocity.x > 0){
            this.side = 1;
        }
        this.scale.x = (this.standardScale) * this.side;
        this.scale.y = this.standardScale
        if(this.attacking){
            return
        }
        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
