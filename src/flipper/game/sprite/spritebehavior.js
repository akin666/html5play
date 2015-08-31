
function SpriteBehavior()
{
    this.spawnOut = 500;
    this.spawnIn = 500;
    this.texture = null;
    this.spawnAngle = null;
    this.spawnSpeed = null;
    this.spawnLife = null;
    this.spawnScale = null;
}

SpriteBehavior.prototype.emit = function( emitter , count , span , ms )
{
    if( count <= 0 )
    {
        return;
    }
    
    // particles are added durning span..
    // but they also needs to be emulated
    // from span ends till ms ends.
    //                                 current time
    //         span begins      ends    |
    //         ms begins         |     ends
    //          |                |      |
    // ||||||||||||||||||||||||||||||||||
    // thus ms >= span
    var spanmsdiff = ms - span;
    for( var i = 0 ; i < count ; ++i )
    {
        // spread the particles randomly at the time spent.
        // the time is how much time the particle has been living
        // so we need to simulate time amount now..
        var time = (Math.random() * span) + spanmsdiff;
        
        var sprite = new SpriteObject();
        
        this.onParticleCreated( emitter , sprite );
        this.onParticleUpdate( emitter , time , sprite );
        emitter.particles.push( sprite );
    }
};

SpriteBehavior.prototype.onParticleCreated = function( emitter , particle ) 
{
    // set particle data
    particle.current.copyFrom( emitter.current );
    
    // Life
    if( this.spawnLife === null )
    {
        particle.life = Math.random() * 1000 + 1500;
    }
    else
    {
        particle.life = this.spawnLife.random();
    }
    
    // ScaleMultiplier
    if( this.spawnScale === null )
    {
        particle.scaleMultiplier = 1.0;
    }
    else
    {
        particle.scaleMultiplier = this.spawnScale.random();
    }
    
    // Speeds
    var angle = 0;
    if( this.spawnAngle === null )
    {
        angle = Math.random() * (2 * Math.PI);
    }
    else
    {
        angle = this.spawnAngle.random();
    }
    
    angle += particle.current.rotation;
    
    var speed = 0;
    if( this.spawnSpeed === null )
    {
        speed = (Math.random() * 100) / SECOND_TO_MILLISECOND;
    }
    else
    {
        speed = this.spawnSpeed.random();
    }
    
    // -angle transforms the angleToAxis output to be clockwise rotation.
    var axis = angleToAxis( -angle , speed );
    
    particle.speed.x = axis.x;
    particle.speed.y = axis.y;
    particle.speed.scale = 0;
    particle.speed.rotation = ((Math.random() * 10) - 5) / 1000.0;
    
    // Fade in the particle
    particle.current.alpha = 0;
    TweenLite.to( particle.current , this.spawnIn / 1000, {alpha: 1.0 * emitter.current.alpha } );
    
    // create "graphics"
    particle.graphics = new PIXI.Sprite( this.texture );
    particle.graphics.anchor.x = 0.5;
    particle.graphics.anchor.y = 0.5;
    
    emitter.world.group.addChild( particle.graphics );
};

SpriteBehavior.prototype.onParticleUpdate = function( emitter , ms , particle ) 
{
    // Particle is closing death.
    if( particle.state === SPRITE_STATE_ALIVE && particle.life < this.spawnOut )
    {
        particle.state = SPRITE_STATE_DYING;
        TweenLite.to( particle.current , particle.life / 1000, {alpha: 0.0} );
    }
    
    // Apply world forces.
    emitter.world.applyForces( particle , ms );
    
    // update gfx
    var graphics = particle.graphics;
    graphics.position.x = particle.current.x;
    graphics.position.y = particle.current.y;
    graphics.scale.y = graphics.scale.x = particle.current.scale * particle.scaleMultiplier;
    graphics.alpha = particle.current.alpha;
    graphics.rotation = particle.current.rotation;
};

SpriteBehavior.prototype.onParticleDead = function( emitter , particle ) 
{
    emitter.world.group.removeChild( particle.graphics );
};