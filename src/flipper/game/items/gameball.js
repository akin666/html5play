
function GameBall( gamephysics , world , data )
{
    GameObject.call( this , gamephysics , world );
    
    this.radius = 20;
    this.graphics = PIXI.Sprite.fromImage("gfx/ball.png");
    this.graphics2 = PIXI.Sprite.fromImage("gfx/ball_shade.png");
    this.graphics.anchor.x = 0.5;
    this.graphics.anchor.y = 0.5;
    this.graphics2.anchor.x = 0.5;
    this.graphics2.anchor.y = 0.5;
    this.container.addChild( this.graphics );
    this.container.addChild( this.graphics2 );
    
    // unserialize data.. if available
    if( data !== undefined && data !== null  )
    {
        if( data.position !== undefined )
        {
            this.setPosition( data.position );
        }
        if( data.angle !== undefined )
        {
            this.setAngle( data.angle );
        }
        if( data.scale !== undefined )
        {
            this.setScale( data.scale );
        }
    }
    
    this.update( 0 );
}

GameBall.prototype = new GameObject();
GameBall.prototype.constructor = GameBall;

GameBall.prototype.getName = function()
{
    return "ball";
};

GameBall.prototype.addPhysics = function()
{
    if( this.physics !== null )
    {
        return;
    }
    
    var pos = this.getPosition();
    var angle = this.getAngle();
    
    this.physics = new GamePhysicsObject( this.gamephysics );
    this.physics.setup(
            PHYSICS_DYNAMIC , 
            pos.x , 
            pos.y , 
            angle , 
            0.2 , 
            0.4 , 
            true , 
            true // bullet? it can move quite fast..
        );
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = BALL_DENSITY;           // weight?
    fixDef.friction = BALL_FRICTION;          // will it stop?
    fixDef.restitution = BALL_RESTITUTION;       // bouncyness
    fixDef.filter.categoryBits = PHYSICS_CATEGORY_PLAYER;
    fixDef.filter.maskBits = PHYSICS_CATEGORY_ALL;
    this.physics.addCircle( this.radius , fixDef );
    this.physics.setUserData( this );
    
    this.update( 0 );
};

GameBall.prototype.update = function( ms )
{
    if( this.graphics !== null && this.physics !== null )
    {
        this.graphics.position = this.physics.getPosition();
        this.graphics.rotation = this.physics.getAngle();
        if( this.graphics2 !== null )
        {
            this.graphics2.position = this.physics.getPosition();
            //this.graphics2.rotation = this.physics.getAngle(); graphics 2 does not rotate for this object..
        }
    }
};

GameBall.prototype.beginContactWith = function( another , x , y , nx , ny )
{
};
