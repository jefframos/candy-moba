import PIXI from 'pixi.js';

export default class Cupcake extends PIXI.Container {

    constructor() {

    	super();

        this.mcContainer = new PIXI.Container();
        this.addChild(this.mcContainer);



         let idleTextures = [];
        for (let i = 0; i < 14; i++)
        {
            if(i+1 > 9){
                var texture = PIXI.Texture.fromFrame('idle00' + (i+1) + '.png');
            }else{
                var texture = PIXI.Texture.fromFrame('idle000' + (i+1) + '.png');
            }
                idleTextures.push(texture);
                texture.smooth = true;
        }
        this.mouseIdle = new PIXI.MovieClip(idleTextures);
        this.mouseIdle.animationSpeed = 0.4
        this.mouseIdle.gotoAndPlay(0);
        this.mcContainer.addChild(this.mouseIdle);



        let runTextures = [];
        for (let i = 0; i < 24; i++)
        {
            if(i+1 > 9){
                var texture = PIXI.Texture.fromFrame('run00' + (i+1) + '.png');
            }else{
                var texture = PIXI.Texture.fromFrame('run000' + (i+1) + '.png');
            }
                runTextures.push(texture);
                texture.smooth = true;
        }
        this.mouseRun = new PIXI.MovieClip(runTextures);
        this.mouseRun.x = -15
        this.mouseRun.y = 4
        this.mouseRun.animationSpeed = 0.4
        this.mouseRun.gotoAndStop(8);
        this.mcContainer.addChild(this.mouseRun);

        

        this.standardScale = 0.5;

        this.mouseIdle.anchor.set(0.5,1);
        this.mouseRun.anchor.set(0.5,1);


        this.side = 1;
        this.state = 0;

        this.standardScale = 0.4;
        this.scale.set(this.standardScale)

        this.updateState();

        this.state = 0;
        // this.scale.set(1.5)

        //this.timer = 3.0;
        //this.nextAction = this.changeState;
        // setTimeout(() => {
        //     this.changeState();
        // }, 3000);

       // this.updateState();
        this.velocity = {x:0, y:0};

        this.updateable = true;
    }

    updateState() {
        switch (this.state){
            case 0:
                this.mouseIdle.visible = true;
                // this.mouseFlip.visible = false;
                this.mouseRun.visible = false;
            break;
            case 1:
                if(!this.mouseRun.visible){
                    this.mouseRun.gotoAndPlay(8);
                }
                this.mouseIdle.visible = false;
                // this.mouseFlip.visible = true;
                this.mouseRun.visible = true;
            break;
            case 2:
                this.mouseIdle.visible = false;
                // this.mouseFlip.visible = false;
                this.mouseRun.visible = true;
            break;
        }
    }
    update ( delta ) {

        // this.timer -= delta;

        // if(this.timer <= 0){
        //     this.timer = 999999;
        //     this.nextAction();
        // }
       this.updateState();
        if(this.velocity.x < 0){
            this.scale.x = (this.standardScale * -1)
        }else if(this.velocity.x > 0){
            this.scale.x = (this.standardScale)
        }
        this.x += this.velocity.x * delta;
    	this.y += this.velocity.y * delta;
    }	
}
