
function BumperObject( gamephysics , world , data )
{
    GameObject.call( this , gamephysics , world );
    
    this.radius = 75;
    this.graphics = PIXI.Sprite.fromImage("gfx/bumper.png");
    this.particletexture = PIXI.Texture.fromImage("gfx/particles/sparky.png");
    this.graphics.anchor.x = 0.5;
    this.graphics.anchor.y = 0.5;
    this.container.addChild( this.graphics );
    
    // data..
    var position = new PIXI.Point( 0 , 0 );
    var scale = 1;
    var angle = 0;
    
    this.effectScale = 0;
    this.curve = 0;
    this.hitNormal = new PIXI.Point( 0 , 0 );
    
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
    }
    
    if( this.gamephysics === null )
    {
        return;
    }
    
    // Offset from center
 //   var centerOffsetY = 50;
 //   position.y -= centerOffsetY;
    this.physics = new GamePhysicsObject( this.gamephysics );
    this.physics.setup(
            PHYSICS_STATIC , 
            position.x , 
            position.y , 
            angle , 
            0 , 
            0.1 , 
            true , 
            false
        );
    
    var fixDef = new box2d.FixtureDef();
    fixDef.density = BUMPER_DENSITY;           // weight?
    fixDef.friction = BUMPER_FRICTION;          // will it stop?
    fixDef.restitution = BUMPER_RESTITUTION;       // bouncyness
    fixDef.filter.categoryBits = PHYSICS_CATEGORY_GAME_OBJECT;
    fixDef.filter.maskBits = PHYSICS_CATEGORY_ALL;
    this.physics.addCircle( this.radius , fixDef );
    this.physics.setUserData( this );
    /*
    // create static connection point..
    this.physics2 = new GamePhysicsObject( this.gamephysics );
    this.physics2.setup(
            PHYSICS_STATIC , 
            position.x , 
            position.y , 
            0 , 
            0.2 , 
            0.9 , 
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
    var ancB = new PIXI.Point( 0 , -centerOffsetY );
    this.joint = new GamePhysicsJoint( this.gamephysics );
    
    this.joint.setupDistance(
            this.physics2 , 
            this.physics , 
            ancA , 
            ancB , 
            2.0 ,
            false ,
            4 ,
            0.7 ); */
            
    
    if( this.emitter === null )
    {
        this.emitter = this.world.getSpriteWorld().createEmitter();

        this.emitter.setTexture( this.particletexture );
        this.emitter.setPosition( position );
        this.emitter.setSpawnRate( 100 );
        this.emitter.setAlpha( 1.0 );
        this.emitter.setSpawnAngle( -45 * DEG2RAD , 45 * DEG2RAD );
        this.emitter.setSpawnSpeed( 400 , 500 );
        this.emitter.setSpawnLifetime( 0.8 , 1 );
        this.emitter.setSpawnInTime( 0.25 );
        this.emitter.setSpawnOutTime( 0.5 );
        this.emitter.setSpawnScale( 0.25 , 1.5 );
        
        this.emitter.init();
        this.emitter.pause();
    }
    
    this.update( 0 );
}

BumperObject.prototype = new GameObject();
BumperObject.prototype.constructor = BumperObject;

BumperObject.prototype.hitTest = function( point )
{
    var point2 = this.getPosition();
    
    var distance = dist( point , point2 );
    
    if( distance < this.radius )
    {
        return true;
    }
    return false;
};

BumperObject.prototype.getName = function()
{
    return "bumper";
};

BumperObject.prototype.save = function()
{
    var object = { 
        type: this.getName(),
        position: this.getPosition(),
        angle: this.getAngle(),
        scale: this.getScale()
    };
    
    return object;
};

BumperObject.prototype.load = function( data )
{
    this.setPosition( data.position );
    this.setAngle( data.angle );
    this.setScale( data.scale );
};

BumperObject.prototype.update = function( ms )
{
    if( this.graphics !== null && this.physics !== null )
    {
        this.curve += ms * 0.01;
        
        var heff = this.effectScale * Math.cos( this.curve ) * 15 * this.hitNormal.y;
        var weff = this.effectScale * Math.sin( this.curve ) * 15 * this.hitNormal.x;
        
        this.graphics.position.x = this.physics.getPosition().x + weff;
        this.graphics.position.y = this.physics.getPosition().y + heff;
        this.graphics.rotation = this.physics.getAngle();
        this.graphics.scale.x = 1.0 + ((this.effectScale * Math.sin( this.curve )) * 0.1);
        this.graphics.scale.y = 1.0 + ((this.effectScale * Math.cos( this.curve )) * 0.1);
        
        if( this.graphics2 !== null )
        {
            this.graphics2.position = this.physics.getPosition();
            this.graphics2.rotation = this.physics.getAngle();
        }
    }
};

BumperObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
    var apos = this.getPosition();
    var bpos = another.getPosition();
    
    var diff = new PIXI.Point( bpos.x - apos.x , bpos.y - apos.y );
    
    var len = vecLength( diff );
    diff.x /= len;
    diff.y /= len;
    
    var newtons = BUMPER_BUMP_FORCE;
    var force = new PIXI.Point( newtons * diff.x , newtons * diff.y );
    another.physics.applyImpulse( force , bpos );
    
    // counter force to bumper
    var newtons2 = BUMPER_BUMP_FORCE / 4;
    var force2 = new PIXI.Point( newtons2 * -diff.x , newtons2 * -diff.y );
    this.physics.applyImpulse( force2 , apos );
    
    var gameevent = new GameEvent();
    gameevent.type = BUMPER_HIT;
    sendGameEvent( gameevent );
    
    var tl1 = new TimelineLite();
    tl1.to(this, 0.3, {effectScale:1}).to(this, 1.5, {effectScale:0});

    this.hitNormal.x = nx;
    this.hitNormal.y = ny;
    
    // Particles
    if( this.emitter !== null )
    {
        var position = new PIXI.Point( x , y );
        
        var normal = new PIXI.Point( nx , ny );
        
        var angle = axisToAngle( normal );

        // for some reason bumpers normal is Math.PI in wrong direction :(
        angle += (Math.PI / 2);
        
        // set emitter position
        this.emitter.setPosition( position );
        this.emitter.setRotation( angle );
        
        // emit 10 particles, inside 100ms
        this.emitter.emit( 10 , 0.1 );
    }
};

BumperObject.prototype.endContactWith = function( another )
{
};
