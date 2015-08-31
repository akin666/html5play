
function GameBox( gamephysics , world , positionX , positionY , width , height , eventmanager )
{
    GameObject.call( this , gamephysics , world , eventmanager );
    this.container = container;
    
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill( 0xFFFF00 , 0.25 );
    this.graphics.drawRect( -width/2 , -height/2 , width , height );
    this.graphics.endFill();
    
    container.addChild( this.graphics );
    
    this.physics = new GamePhysicsObject( gamephysics );
    this.physics.setup(
            PHYSICS_STATIC , 
            positionX , 
            positionY , 
            0 , 
            0 , 
            0.01 , 
            true , 
            false
        );
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = 1.0;           // weight?
    fixDef.friction = 0.5;          // will it stop?
    fixDef.restitution = 0.2;       // bouncyness
    this.physics.addBox( width , height , fixDef );
    this.physics.setUserData( this );
    
    this.update( 0 );
}

GameBox.prototype = new GameObject();
GameBox.prototype.constructor = GameBox;

GameBox.prototype.getName = function()
{
    return "box";
};
