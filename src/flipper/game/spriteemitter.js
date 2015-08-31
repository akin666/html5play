
var SPRITE_EMITTER_INIT = 1;
var SPRITE_EMITTER_ALIVE = 2;
var SPRITE_EMITTER_PAUSE = 3;
var SPRITE_EMITTER_DESTROYED = 4;

function SpriteEmitter( world )
{
    this.world = world;
    
    this.state = SPRITE_EMITTER_INIT;
    
    this.timeRemaining = 0;
    this.spritesPerMs = 0;
    
    this.current = new SpriteObjectData();
    
    this.current.alpha = 1.0;
    this.current.scale = 1.0;
    
    this.behavior = new SpriteBehavior();
    this.particles = [];
}

SpriteEmitter.prototype.update = function( ms )
{
    // update current particles.. remove the dead ones.
    for( var i = this.particles.length - 1 ; i >= 0 ; --i )
    {
        var particle = this.particles[i];
        
        particle.life -= ms;
        if( particle.life <= 0 )
        {
            this.behavior.onParticleDead( this , particle );
            this.particles.splice( i, 1 );
            continue;
        }
        
        this.behavior.onParticleUpdate( this , ms , particle );
    }
    
    // Add new particles, according to rules.. these should span the give ms span.
    if( this.state !== SPRITE_EMITTER_ALIVE )
    {
        return;
    }
    
    // Add new particles..
    this.timeRemaining += ms;
    var totalEmit = Math.floor( this.timeRemaining * this.spritesPerMs );
    if( totalEmit < 1.0 )
    {
        return;
    }
    
    var timeUsed = totalEmit / this.spritesPerMs;
    this.timeRemaining -= timeUsed;
    
    this.behavior.emit( this , totalEmit , timeUsed , ms );
};

SpriteEmitter.prototype.requestDestroy = function()
{
    if( this.state === SPRITE_EMITTER_DESTROYED )
    {
        // already destruction on the way..
        return;
    }
    
    // Make all current particles to go fade out and no new particles are created.
    // TODO.. This might not be necessary.. might be.. dunno..
    this.state = SPRITE_EMITTER_DESTROYED;
};

SpriteEmitter.prototype.stillAlive = function()
{
    return this.particles.length > 0;
};

SpriteEmitter.prototype.getAliveParticleCount = function()
{
    return this.particles.length;
};

SpriteEmitter.prototype.setTexture = function( texture ) 
{
    this.behavior.texture = texture;
};

SpriteEmitter.prototype.setSpawnInTime = function( seconds ) 
{
    this.behavior.spawnIn = seconds * SECOND_TO_MILLISECOND;
};

SpriteEmitter.prototype.setSpawnOutTime = function( seconds ) 
{
    this.behavior.spawnOut = seconds * SECOND_TO_MILLISECOND;
};

SpriteEmitter.prototype.setSpawnAngle = function( a , b ) 
{
    this.behavior.spawnAngle = new Span( a , b );
};

SpriteEmitter.prototype.setSpawnSpeed = function( a , b ) 
{
    // the actual velocity
    this.behavior.spawnSpeed = new Span( a / SECOND_TO_MILLISECOND , b / SECOND_TO_MILLISECOND );
};

SpriteEmitter.prototype.setSpawnLifetime = function( a , b ) 
{
    // the actual velocity
    this.behavior.spawnLife = new Span( a * SECOND_TO_MILLISECOND , b * SECOND_TO_MILLISECOND );
};

SpriteEmitter.prototype.setSpawnScale = function( a , b ) 
{
    this.behavior.spawnScale = new Span( a , b );
};

SpriteEmitter.prototype.setPosition = function( position ) 
{
    this.current.x = position.x;
    this.current.y = position.y;
};

SpriteEmitter.prototype.setRotation = function( rotation ) 
{
    this.current.rotation = rotation;
};

SpriteEmitter.prototype.setScale = function( scale ) 
{
    this.current.scale = scale;
};

SpriteEmitter.prototype.setAlpha = function( alpha ) 
{
    this.current.alpha = alpha;
};

SpriteEmitter.prototype.setSpawnRate = function( spritesPerSecond ) 
{
    this.spritesPerMs = spritesPerSecond / 1000;
};

SpriteEmitter.prototype.init = function()
{
    if( this.state === SPRITE_EMITTER_INIT )
    {
        this.state = SPRITE_EMITTER_ALIVE;
        return true;
    }
    return false;
};

SpriteEmitter.prototype.pause = function()
{
    if( this.state === SPRITE_EMITTER_PAUSE || this.state === SPRITE_EMITTER_ALIVE )
    {
        this.state = SPRITE_EMITTER_PAUSE;
        return true;
    }
    return false;
};

SpriteEmitter.prototype.play = function()
{
    if( this.state === SPRITE_EMITTER_PAUSE || this.state === SPRITE_EMITTER_ALIVE )
    {
        this.state = SPRITE_EMITTER_ALIVE;
        return true;
    }
    return false;
};

// forcefully emit some particles.
SpriteEmitter.prototype.emit = function( count , span )
{
    span = span * SECOND_TO_MILLISECOND;
    this.behavior.emit( this , count , span , span );
};

/*
SpriteEmitter.prototype.destruct = function()
{
    if( this.world !== null && this.emitter !== null )
    {
        this.world.proton.removeEmitter( this.emitter );
        this.emitter = null;
    }
};

SpriteEmitter.prototype.setEmissionRate = function( min , max , mintime , maxtime )
{
    this.emitter.rate = new Proton.Rate(new Proton.Span( min , max ), new Proton.Span( mintime , maxtime ));
};

SpriteEmitter.prototype.setMass = function( mass )
{
    this.emitter.addInitialize(new Proton.Mass( mass ));
};

SpriteEmitter.prototype.setTexture = function( texture )
{
    this.emitter.addInitialize(new Proton.ImageTarget( texture ));
};

SpriteEmitter.prototype.setLife = function( min , max )
{
    this.emitter.addInitialize(new Proton.Life( min , max ));
};

SpriteEmitter.prototype.setVelocity = function( minradius , maxradius , mintha , maxtha )
{
    // TODO, not sure what the thapan is, may refer to heretical tau math, not sure.. might be radians.. no documentation
    // only js code, makes a very sad programmer.
    this.emitter.addInitialize(new Proton.Velocity(new Proton.Span( minradius , maxradius ), new Proton.Span( mintha , maxtha , true), 'polar'));
};

SpriteEmitter.prototype.setGravity = function( gravity )
{
    this.emitter.addBehaviour(new Proton.Gravity( gravity ));
};

SpriteEmitter.prototype.setScale = function( begin , end , life )
{
    this.emitter.addBehaviour(new Proton.Scale(new Proton.Span( begin , end ), life ));
};

SpriteEmitter.prototype.setAlpha = function( begin , end , life )
{
    this.emitter.addBehaviour(new Proton.Alpha( begin , end , life ));
};

SpriteEmitter.prototype.setRotate= function( start , begin , end )
{
    this.emitter.addBehaviour(new Proton.Rotate( start , Proton.getSpan( begin , end ), 'add'));
};

SpriteEmitter.prototype.setPosition= function( position )
{
    this.emitter.p.x = position.x;
    this.emitter.p.y = position.y;
};

SpriteEmitter.prototype.init= function()
{
    this.emitter.emit();
    this.world.proton.addEmitter( this.emitter );
};
*/
/*
SpriteEmitter.prototype.setup = function( texture )
{
    var texture = new PIXI.Texture.fromImage("image/bunny.png");
    proton = new Proton();
    emitter = new Proton.BehaviourEmitter();
    emitter.rate = new Proton.Rate(new Proton.Span(15, 30), new Proton.Span(.2, .5));
    emitter.addInitialize(new Proton.Mass(1));
    emitter.addInitialize(new Proton.ImageTarget(texture));
    emitter.addInitialize(new Proton.Life(2, 3));
    emitter.addInitialize(new Proton.Velocity(new Proton.Span(3, 9), new Proton.Span(0, 30, true), 'polar'));

    emitter.addBehaviour(new Proton.Gravity(8));
    emitter.addBehaviour(new Proton.Scale(new Proton.Span(1, 3), 0.3));
    emitter.addBehaviour(new Proton.Alpha(1, 0.5));
    emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-8, 9), 'add'));
    emitter.p.x = 1003 / 2;
    emitter.p.y = 100;
    emitter.emit();
    proton.addEmitter(emitter);

    emitter.addSelfBehaviour(new Proton.Gravity(5));
    emitter.addSelfBehaviour(new Proton.RandomDrift(30, 30, .1));
    emitter.addSelfBehaviour(new Proton.CrossZone(new Proton.RectZone(50, 0, 953, 610), 'bound'));
};
*/

