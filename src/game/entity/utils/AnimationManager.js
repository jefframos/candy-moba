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
            this.animationModel[i].movieClip.anchor.set(this.animationModel[i].anchor.x,this.animationModel[i].anchor.y);
            this.animationModel[i].movieClip.x = this.animationModel[i].position.x;
            this.animationModel[i].movieClip.y = this.animationModel[i].position.y;
            this.animationModel[i].movieClip.animationSpeed = this.animationModel[i].animationSpeed;
            this.animationModel[i].movieClip.gotoAndStop(this.animationModel[i].startFrame);
            this.animationContainer.addChild(this.animationModel[i].movieClip);

        }


        this.entityModel = {
            speed:{x:200, y:200}
        }
        this.side = 1;

        this.standardScale = 0.4;
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

        this.updateable = true;
        this.hideAll();
        this.stopAll();
        this.changeState('idle');
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
        console.log('play', this.state);
        let animData = this.animationModel[id];
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



    stopMove() {
        this.velocity.x =0;
        this.changeState('idle');
    }
    moveRight() {
        this.velocity.x = this.entityModel.speed.x;
        this.changeState('run');
    }
    moveLeft() {
        this.velocity.x = -this.entityModel.speed.x;
        this.changeState('run');
    }
    changeState(state){
        if(this.state == state){
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
        this.playMovieclip(this.getAnimationID(this.state));
    }
    update ( delta ) {

        // this.timer -= delta;

        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }
       
        if(this.velocity.x < 0){
            this.scale.x = (this.standardScale * -1)
        }else if(this.velocity.x > 0){
            this.scale.x = (this.standardScale)
        }
        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
