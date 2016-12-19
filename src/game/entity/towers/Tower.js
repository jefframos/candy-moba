import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class Tower extends Entity {

    constructor(game) {

    	super(game);


        this.type = 'tower';

        this.scaleFator = 2;

        this.base = new PIXI.Container();
        this.roundBase = new PIXI.Graphics();
        this.roundBase.beginFill(0xFFFFFF);
        this.roundBase.drawCircle(0,0,100);
        this.roundBase.scale.y = 0.4;
        this.roundBase.alpha = 0.1;
        this.base.addChild(this.roundBase);
        this.addChild(this.base);


        this.animationContainer = new PIXI.Container();
        this.animationContainer.x = 0
        this.animationContainer.y = 0
        this.addChild(this.animationContainer);

        this.radius = 150;
        this.externalRadius = 600;
        this.debugCollision();

        this.static = true;

        this.waitingNext = 5 * Math.random() + 1;
        this.sinScale = Math.random();
        this.life = 10000;

        this.enemiesList = [];
        // this.build();


        this.hitting = false;
        this.hitTimer = -1;

        this.slotsAttack = [];

        


    }

    hit(power){
        super.hit(power);
        this.hitTimer = 0.5;
        this.hitting = true;
    }
    addEnemy (enemy) {
        for (var i = this.enemiesList.length - 1; i >= 0; i--) {
            if(this.enemiesList[i] == enemy){
                return;
            }
        }
        this.enemiesList.push(enemy);

        let id = 0;
        for (var i = 0; i < this.slotsAttack.length; i++) {
            if(this.slotsAttack[i].entity == null){
                id = i;
                break;
            }
        }
        let angle = this.slotsAttack[id].angle /180*3.14;
        // console.log('angle',angle);
        this.slotsAttack[id].entity = enemy;
        let randomRadius = this.slotsAttack[id].radius;
        let targetPosition = {x:this.x + Math.sin(angle) * randomRadius, y:this.y + Math.cos(angle) * randomRadius}
        enemy.setTarget(targetPosition);


        // this.base = new PIXI.Container();
        // this.roundBase = new PIXI.Graphics();
        // this.roundBase.beginFill(0xFFFFFF);
        // this.roundBase.drawCircle(0,0,5,5);
        // this.roundBase.x = Math.sin(angle/180*3.14) * this.radius;
        // this.roundBase.y = Math.cos(angle/180*3.14) * this.radius;
        // this.base.addChild(this.roundBase);
        // this.addChild(this.base);

    }


    updateBaseColor ( ) {
        if(this.hitting){
            this.roundBase.tint = 0xFF0000;
        }else{
            this.roundBase.tint = 0;
        }
    }

    build ( ) {

        let idRock =1// Math.floor(Math.random()*2) + 1;

        this.animationModel = [];
         this.animationModel.push({
            label:'static',
            src:'pine'+idRock+'00',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:false,
        });
        this.animationModel.push({
            label:'idle',
            src:'pine'+idRock+'00',
            totalFrames:22,
            startFrame:0,
            animationSpeed:0.5,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:true,
        });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);       


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('static');

        this.collidable = true;

        console.log(this.getRadius());
        let maxAngle = 360
        let totFixed = 10
        for (var i = 1; i < 80; i++) {
            if(i <= totFixed){
                let angle = maxAngle / totFixed * i;
                this.slotsAttack.push({angle:angle, entity:null, radius: Math.random() * this.getRadius()/4 + this.getRadius()/4});
                utils.shuffle(this.slotsAttack);
            }else{

                this.slotsAttack.push({angle:Math.random() * maxAngle, entity:null, radius: Math.random() * this.getRadius()/3 + this.getRadius()/3});
            }
        }
        // this.debugCollision()

    }
    

    update ( delta ) {
        super.update(delta);

        if(this.hitTimer > 0){
            this.hitTimer -= delta;
            if(this.hitTimer <=0 ){
                this.hitting = false;
            }
        }
        this.updateBaseColor();
    }	
}
