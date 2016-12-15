import PIXI from 'pixi.js';
export default class Entity extends PIXI.Container {

    constructor(debug) {  
        super();  
        this.velocity = {x:0,y:0};
        this.standardScale = 1;
        this.speedScale = 1;
        this.starterScale = 0.5;
        this.radius = 50;
        this.externalRadius = 100;
        this.static = false;
        this.side = 1;
        this.life = 5;
        this.collidable = true;
    }

    hit(power) {
        this.life -= power;
        if(this.life <= 0){
            this.dead();
        }
        return true
    }
    dead() {
        this.kill = true;
    }
    debugCollision() {
        this.colisionCircle = new PIXI.Graphics();
        this.colisionCircle.lineStyle(1,0xFF0000);
        this.colisionCircle.drawCircle(0,0,this.radius);
        this.colisionCircle.alpha = 0.8;
        this.addChild(this.colisionCircle);


        if(!this.externalRadius){
            return;
        }
        this.externalColisionCircle = new PIXI.Graphics();
        this.externalColisionCircle.lineStyle(1,0x00FF00);
        this.externalColisionCircle.drawCircle(0,0,this.externalRadius);
        this.externalColisionCircle.alpha = 0.8;
        this.addChild(this.externalColisionCircle);
    }

    getRadius() {
        return this.standardScale * this.radius;
    }
    getExternalRadius() {
        return this.standardScale * this.externalRadius;
    }
    setDistance(value) {
        this.standardScale = value * 0.35 + 0.15;
        this.speedScale = this.standardScale / this.starterScale;
        this.updateScale();
        // this.updateTint(value);
    }
    updateAlpha(value) {
        TweenLite.to(this.animationContainer, 0.5, {alpha:value});
        // this.animationContainer.alpha = value;//0xff0000
    }
    updateTint(value) {
        this.animationContainer.alpha = value * 0.4 + 0.6;//0xff0000
    }
    updateScale() {
        this.scale.x = (this.standardScale) * this.side;
        this.scale.y = this.standardScale
    }

    update ( delta ) {
    }	
}
