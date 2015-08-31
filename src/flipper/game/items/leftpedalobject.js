
function LeftPedalObject( gamephysics , world , data , eventmanager )
{
    GameObject.call( this , gamephysics , world , eventmanager );
    
    // 150x50 , the origo is at 15x25, 
    // shape is from 0x0 to 150x20 to 150x30 to 0x50
    this.radius = 25;
    this.graphics = PIXI.Sprite.fromImage("gfx/left-pedal.png");
    this.graphics.anchor.x = 0.5;
    this.graphics.anchor.y = 0.5;
    this.container.addChild( this.graphics );
    this.activationEvent = INPUT_PEDAL_LEFT;
    
    // data..
    var position = new PIXI.Point( 0 , 0 );
    var scale = 1;
    var angle = 0;
    
    // unserialize data.. if available
    if( data !== undefined && data !== null  )
    {
        if( data.position !== undefined )
        {
            position = data.position;
            this.setPosition( data.position );
        }
        if( data.angle !== undefined )
        {
            angle = data.angle;
            this.setAngle( data.angle );
        }
        if( data.scale !== undefined )
        {
            scale = data.scale;
            this.setScale( data.scale );
        }
        if( data.activation !== undefined )
        {
            this.setTrigger( data.activation );
        }
    }
    
    if( this.gamephysics === null )
    {
        return;
    }
    
    // Offset the position for physics
    position.x -= 60;
    
    // create the shape..
    var poly = [];
    poly.push( new PIXI.Point( -75 , -20 ) );
    poly.push( new PIXI.Point(  75 ,  -5 ) );
    poly.push( new PIXI.Point(  75 ,   5 ) );
    poly.push( new PIXI.Point( -75 ,  20 ) );
    
    this.physics = new GamePhysicsObject( this.gamephysics );
    this.physics.setup(
            PHYSICS_DYNAMIC , 
            position.x , 
            position.y , 
            angle , 
            0.2 , 
            0.2 ,
            true , 
            false
        );
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = PEDAL_DENSITY;           // weight?
    fixDef.friction = PEDAL_FRICTION;          // will it stop?
    fixDef.restitution = PEDAL_RESTITUTION;       // bouncyness
    fixDef.filter.categoryBits = PHYSICS_CATEGORY_GAME_OBJECT;
    fixDef.filter.maskBits = PHYSICS_CATEGORY_PLAYER | PHYSICS_CATEGORY_ITEMS;
    this.physics.addPolygon( poly , fixDef );
    this.physics.setUserData( this );

    // create static connection point..
    this.physics2 = new GamePhysicsObject( this.gamephysics );
    this.physics2.setup(
            PHYSICS_STATIC , 
            position.x , 
            position.y , 
            0 , 
            0.2 , 
            0.2 , 
            true , 
            false
        );
    
    fixDef = new box2d.FixtureDef();
    fixDef.density = 1.0;           // weight?
    fixDef.friction = 1.0;          // will it stop?
    fixDef.restitution = 0.2;       // bouncyness
    fixDef.filter.categoryBits = PHYSICS_CATEGORY_NO_COLLISION;
    fixDef.filter.maskBits = PHYSICS_CATEGORY_NO_COLLISION;
    this.physics2.addCircle( 1 , fixDef );
    
    // joint the objects..
    var ancA = new PIXI.Point( 0 , 0 );
    var ancB = new PIXI.Point( -60 , 0 );
    this.joint = new GamePhysicsJoint( this.gamephysics );
    
    // this is just plain weird..
    // in terms of basic degrees (0-360)
    // the 0 in this joint is at position of 135 degrees..
    var rotoffset = -135;
    var degtorad = Math.PI / 180;
    
    // these are in standard coordinates, where the degree 0 is at the sky..
    var maxa = 65;
    var mina = 115;
    
    this.joint.setupRevoluteRanged( 
            this.physics2 , 
            this.physics , 
            ancA , 
            ancB , 
            (maxa + rotoffset) * degtorad , 
            (mina + rotoffset) * degtorad ); 
            
    this.joint.setMotorTorgue( PEDAL_TORQUE );
    this.joint.setMotorSpeed( -PEDAL_SPEED ); // 1round per second.
    
    this.update( 0 );
}

LeftPedalObject.prototype = new GameObject();
LeftPedalObject.prototype.constructor = LeftPedalObject;

LeftPedalObject.prototype.hitTest = function( point )
{
    var point2 = this.getPosition();
    
    var distance = dist( point , point2 );
    
    if( distance < this.radius )
    {
        return true;
    }
    return false;
};

LeftPedalObject.prototype.setTrigger = function( str )
{
    this.activationEvent = translateEventFromString( str );
};

LeftPedalObject.prototype.getTrigger = function()
{
    return translateEventFromKey( this.activationEvent );
};

LeftPedalObject.prototype.getName = function()
{
    return "left-pedal";
};

LeftPedalObject.prototype.save = function()
{
    var object = { 
        type: this.getName(),
        position: this.getPosition(),
        angle: this.getAngle(),
        scale: this.getScale(),
        activation: this.getTrigger()
    };
    
    return object;
};

LeftPedalObject.prototype.load = function( data )
{
    this.setPosition( data.position );
    this.setAngle( data.angle );
    this.setScale( data.scale );
    if( data.activation !== undefined )
    {
        this.setTrigger( data.activation );
    }
};

LeftPedalObject.prototype.activeState = function( state )
{
    this.physics.wakeUp();
    this.joint.setMotorActive( state );
    
    var gameevent = new GameEvent();
    gameevent.type = state ? PEDAL_ACTIVATE : PEDAL_DEACTIVATE;
    sendGameEvent( gameevent );
};

LeftPedalObject.prototype.gameEvent = function( event )
{
    if( event.type === this.activationEvent )
    {
        this.activeState( event.active );
    }
};

LeftPedalObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
    if( another.getName() === "ball" )
    {
        var gameevent = new GameEvent();
        gameevent.type = PEDAL_HIT;
        sendGameEvent( gameevent );
    }
};

LeftPedalObject.prototype.endContactWith = function( another )
{
    return true;
};
