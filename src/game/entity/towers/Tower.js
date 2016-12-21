import PIXI from 'pixi.js';
import utils  from '../../../utils';
import AnimationManager  from './../utils/AnimationManager';
import Entity  from './../Entity';
export default class Tower extends Entity {

    constructor(game, team) {

    	super(game);


        this.type = 'tower';
        this.name = 'tower';
        this.team = team;

        this.game = game;

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

        if(this.team == 1){
            this.tint = 0x0000FF;
        }

        this.reset();
    }

     reset() {
        this.addLifeBar({x:20, y:-this.height * 0.4}, {w:200, h:20}, this.team == 0?0x0000FF:0x00FF00);

        this.waitingNext = 5 * Math.random() + 1;
        this.sinScale = Math.random();
        this.maxLife = 50;
        this.life = 50;

        this.enemiesList = [];
        // this.build();


        this.hitting = false;
        this.hitTimer = -1;

        this.slotsAttack = [];

        this.attacking = false;
        this.attackTimer = -1;
        this.attackSpeed = 0.75;

        

        this.updateable = true;
     }
     dead() {
        this.removeLifeBar();
        this.updateable = false;
        TweenLite.to(this.base,0.5,{alpha:0})
        TweenLite.to(this,0.5,{alpha:0})
        this.collidable = false;
        
        for (var i = this.enemiesList.length - 1; i >= 0; i--) {
            this.enemiesList[i].updateWaypoints(true);
        }
        //this.kill = true;
    }

    hit(power){
        super.hit(power);
        this.hitTimer = 0.5;
        this.hitting = true;
        this.updateLifeBar();
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
        enemy.setTarget(targetPosition, true);


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
            src:'tower1/idle/tower',
            totalFrames:1,
            startFrame:0,
            animationSpeed:0.4,
            movieClip:null,
            position:{x:10,y:0},
            anchor:{x:0.5,y:1},
            loop:false,
            haveCallback:false,
            singleFrame:true,
        });
        // this.animationModel.push({
        //     label:'idle',
        //     src:'pine'+idRock+'00',
        //     totalFrames:22,
        //     startFrame:0,
        //     animationSpeed:0.5,
        //     movieClip:null,
        //     position:{x:10,y:0},
        //     anchor:{x:0.5,y:1},
        //     loop:false,
        //     haveCallback:true,
        // });

        this.animationManager = new AnimationManager(this.animationModel, this.animationContainer);       


        this.animationManager.hideAll();
        this.animationManager.stopAll();
        this.animationManager.changeState('static');

        this.collidable = true;

        let maxAngle = 180
        let startAngle = -90
        let totFixed = 10
        for (var i = 1; i < 80; i++) {
            if(i <= totFixed){
                let angle = maxAngle / totFixed * i + startAngle;
                this.slotsAttack.push({angle:angle, entity:null, radius: Math.random() * this.getRadius()/3 + this.getRadius()/3});
                utils.shuffle(this.slotsAttack);
            }else{

                this.slotsAttack.push({angle:Math.random() * maxAngle, entity:null, radius: Math.random() * this.getRadius()/4 + this.getRadius()/4});
            }
        }
        // this.debugCollision()

    }
    

    attack (entity) {
        if(this.team == entity.team){
            return
        }
        this.attackTimer = this.attackSpeed;

        let bulletPosition = {x:this.x, y: this.y - this.getRadius()};

        let angle = Math.atan2(entity.y - bulletPosition.y, entity.x - bulletPosition.x);

        let bulletSpeed = {x:Math.cos(angle) * 600, y:Math.sin(angle) * 600}

        let power = 2;

        this.game.addTowerBullet(bulletPosition, bulletSpeed, 1, power, this.team);
    }

    update ( delta ) {
        if(!this.updateable){
            return
        }
        super.update(delta);

        if(this.attackTimer > 0){
            this.attackTimer -= delta;
            // if(this.attackTimer <=0 ){
            //     this.hitting = false;
            // }
        }

        if(this.attackTimer <= 0){
            let entityCollisions = this.game.getExternalColisionList(this,['enemy', 'player'], true);

            if(entityCollisions && entityCollisions.length){
                //console.log(this.name, entityCollisions);
                // console.log(entityCollisions.length);
                if(entityCollisions.length > 1 && entityCollisions[0].entity.type == 'hero'){
                    this.attack(entityCollisions[1].entity);
                }else{
                    this.attack(entityCollisions[0].entity);
                }
            }
        }
        // console.log(entityCollisions);

        if(this.hitTimer > 0){
            this.hitTimer -= delta;
            if(this.hitTimer <=0 ){
                this.hitting = false;
            }
        }
        this.updateBaseColor();
    }	
}
