
function SpriteWorld( container )
{
    this.group = container;
    
    this.emitters = [];
    this.effectors = [];
    
    this.skipping = 500;
    
    this.gravity = new PIXI.Point( 0 / SECOND_TO_MILLISECOND , 0.981 / SECOND_TO_MILLISECOND );
    this.destroylist = [];
}

SpriteWorld.prototype.update = function( ms )
{
    // we do not simulate too much.
    if( ms > this.skipping )
    {
        LOG.error("Sprite skipping " + ( ms - this.skipping ) + " milliseconds of simulation." );
        ms = this.skipping;
    }
    
    for( var i = 0 ; i < this.effectors.length ; ++i )
    {
        this.effectors[i].update( ms );
    }
    for( var i = 0 ; i < this.emitters.length ; ++i )
    {
        this.emitters[i].update( ms );
    }
    
    // update the dying emitters.
    // the dying must be graceful, and must cleanup themselfs.
    for( var i = this.destroylist.length - 1 ; i >= 0 ; --i )
    {
        var emitter = this.destroylist[i];
        emitter.update( ms );
        if( !emitter.stillAlive() )
        {
            this.destroylist.splice( i, 1 );
        }
    }
};

SpriteWorld.prototype.createEmitter = function()
{
    var emitter = new SpriteEmitter( this );
    this.emitters.push( emitter );
    return emitter;
};

SpriteWorld.prototype.destroyEmitter = function( emitter )
{
    for( var i = this.emitters.length - 1 ; i >= 0 ; --i )
    {
        if( this.emitters[i] === emitter )
        {
            this.emitters.splice( i, 1 );
            
            emitter.requestDestroy();
            if( emitter.stillAlive() )
            {
                this.destroylist.push( emitter );
            }
            return;
        }
    }
};

SpriteWorld.prototype.createEffector = function( effector )
{
    var effector = new SpriteEffector();
    this.effectors.push( effector );
    return effector;
};

SpriteWorld.prototype.destroyEffector = function( effector )
{
    for( var i = this.effectors.length - 1 ; i >= 0 ; --i )
    {
        if( this.effectors[i] === effector )
        {
            this.effectors.splice( i, 1 );
            return;
        }
    }
};

SpriteWorld.prototype.setGravity = function( vector )
{
    // Convert to millisecond form.
    this.gravity.x = vector.x / SECOND_TO_MILLISECOND;
    this.gravity.y = vector.y / SECOND_TO_MILLISECOND;
};

SpriteWorld.prototype.applyForces = function( particle , ms )
{
    // Apply gravity
    particle.speed.x += this.gravity.x * ms;
    particle.speed.y += this.gravity.y * ms;
    
    // Apply effectors
    
    
    // All numbers are converted into N/ms format, from N/s format.
    // move
    particle.current.x += particle.speed.x * ms;
    particle.current.y += particle.speed.y * ms;
    particle.current.scale += particle.speed.scale * ms;
    particle.current.rotation += particle.speed.rotation * ms;
};
