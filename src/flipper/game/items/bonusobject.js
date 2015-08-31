
var BONUS_NONE = 0;
var BONUS_ALIVE = 1;
var BONUS_PICKEDUP = 2;

function BonusObject( gamephysics , world , data )
{
    GameObject.call( this , gamephysics , world );
    
    this.state = BONUS_ALIVE;
    this.radius = 25;
    this.graphics = PIXI.Sprite.fromImage("gfx/bonus.png");
    this.particletexture = PIXI.Texture.fromImage("gfx/particles/star.png");
    this.graphics.anchor.x = 0.5;
    this.graphics.anchor.y = 0.5;
    this.container.addChild( this.graphics );
    this.spawnrate = 0;
    this.rateleft = 0;
    
    // data..
    var position = new PIXI.Point( 0 , 0 );
    var scale = 1;
    var angle = 0;
    var spawnrate = 20000;
    
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
        if( data.spawnrate !== undefined )
        {
            spawnrate = data.spawnrate;
        }
    }
    this.setSpawnRate( spawnrate );
    
    if( this.gamephysics === null )
    {
        return;
    }
    
    // Offset from center
    var centerOffsetY = 0;
    position.y -= centerOffsetY;
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
    fixDef.isSensor = true; 
    
    this.physics.addCircle( this.radius , fixDef );
    this.physics.setUserData( this );
    
    if( this.emitter === null )
    {
        this.emitter = this.world.getSpriteWorld().createEmitter();

        this.emitter.setTexture( this.particletexture );
        this.emitter.setPosition( position );
        this.emitter.setSpawnRate( 100 );
        this.emitter.setAlpha( 1.0 );
        this.emitter.setSpawnSpeed( 400 , 500 );
        this.emitter.setSpawnLifetime( 0.8 , 1 );
        this.emitter.setSpawnInTime( 0.25 );
        this.emitter.setSpawnOutTime( 0.5 );
        this.emitter.setSpawnScale( 0.3 , 1.0 );
        
        this.emitter.init();
        this.emitter.pause();
    }
    
    this.update( 0 );
}

BonusObject.prototype = new GameObject();
BonusObject.prototype.constructor = BonusObject;

BonusObject.prototype.hitTest = function( point )
{
    var point2 = this.getPosition();
    
    var distance = dist( point , point2 );
    
    if( distance < this.radius )
    {
        return true;
    }
    return false;
};

BonusObject.prototype.setSpawnRate = function( rate )
{
    this.spawnrate = rate;
};

BonusObject.prototype.getSpawnRate = function()
{
    return this.spawnrate;
};

BonusObject.prototype.getName = function()
{
    return "bonus";
};

BonusObject.prototype.save = function()
{
    var object = { 
        type: this.getName(),
        position: this.getPosition(),
        angle: this.getAngle(),
        scale: this.getScale(),
        spawnrate: this.getSpawnRate()
    };
    
    return object;
};

BonusObject.prototype.load = function( data )
{
    this.setPosition( data.position );
    this.setAngle( data.angle );
    this.setScale( data.scale );
    this.setSpawnRate( data.spawnrate );
};

BonusObject.prototype.update = function( ms )
{
    if( this.graphics !== null && this.physics !== null )
    {
        this.graphics.position = this.physics.getPosition();
    }
    
    if( this.state === BONUS_PICKEDUP )
    {
        this.rateleft -= ms;
        if( this.rateleft < 0 )
        {
            this.state = BONUS_ALIVE;
            TweenLite.to( this.graphics , BASE_TRANSITION_TIME , {alpha: 1} );
        }
    }
};

BonusObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
    if( this.state !== BONUS_ALIVE )
    {
        return;
    }
    
    this.state = BONUS_PICKEDUP;
    this.rateleft = this.spawnrate;
    TweenLite.to( this.graphics , 0.2 , {alpha: 0} );
    
    var gameevent = new GameEvent();
    gameevent.type = BONUS_PICKUP;
    sendGameEvent( gameevent );
    
    // Particles
    if( this.emitter !== null )
    {
        var position = new PIXI.Point( x , y );
        var normal = new PIXI.Point( nx , ny );
        var angle = axisToAngle( normal );

        // for some reason bumpers normal is Math.PI in wrong direction :(
        angle += (Math.PI / 2);
        
        // set emitter position
        this.emitter.setPosition( this.graphics.position );
        
        // emit 10 particles, inside 200ms
        this.emitter.emit( 10 , 0.2 );
    }
};

BonusObject.prototype.endContactWith = function( another )
{
};
