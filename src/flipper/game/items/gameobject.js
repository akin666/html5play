
function GameObject( gamephysics , world , eventmanager )
{
    this.alive = true;
    if( world === undefined )
    {
        this.container = null;
    }
    else
    {
        this.container = world.getContainerFor( this.getName() );
    }
    this.gamephysics = gamephysics;
    this.physics = null;
    this.physics2 = null;
    this.graphics = null;
    this.graphics2 = null;
    this.joint = null;
    this.world = world;
    this.emitter = null;
    
    if( eventmanager !== undefined && eventmanager !== null )
    {
        this.eventmanager = eventmanager;
        this.eventmanager.addEventListenerObject( this );
    }
}

GameObject.prototype.destruct = function()
{
    if( this.eventmanager !== undefined && this.eventmanager !== null )
    {
        this.eventmanager.removeEventListenerObject( this );
    }
    
    if( this.joint !== null )
    {
        this.joint.destruct();
        this.joint = null;
    }
    if( this.physics !== null )
    {
        this.physics.destruct();
        this.physics = null;
    }
    if( this.physics2 !== null )
    {
        this.physics2.destruct();
        this.physics2 = null;
    }
    if( this.graphics !== null )
    {
        this.container.removeChild( this.graphics );
        this.graphics = null;
    }
    if( this.graphics2 !== null )
    {
        this.container.removeChild( this.graphics2 );
        this.graphics2 = null;
    }
    if( this.emitter !== null )
    {
        this.world.getSpriteWorld().destroyEmitter( this.emitter );
        this.emitter = null;
    }
};

GameObject.prototype.getName = function()
{
    return "null";
};

GameObject.prototype.getPhysics = function()
{
    return this.physics;
};

GameObject.prototype.getScale = function()
{
    return 1.0;
};

GameObject.prototype.setScale = function( scale )
{
    // TODO
};

GameObject.prototype.getAngle = function()
{
    if( this.physics !== null )
    {
        return this.physics.getAngle();
    }
    if( this.graphics !== null )
    {
        return this.graphics.rotation;
    }
};

GameObject.prototype.setAngle = function( angle )
{
    if( this.physics !== null )
    {
        this.physics.setAngle( angle );
        return;
    }
    if( this.graphics !== null )
    {
        this.graphics.rotation = angle;
        
        if( this.graphics2 !== null )
        {
            this.graphics2.rotation = angle;
        }
        
        return;
    }
};

GameObject.prototype.setPosition = function( position )
{
    if( this.physics !== null )
    {
        this.physics.setPosition( position );
        return;
    }
    if( this.graphics !== null )
    {
        this.graphics.position.x = position.x;
        this.graphics.position.y = position.y;
        
        if( this.graphics2 !== null )
        {
            this.graphics2.position.x = position.x;
            this.graphics2.position.y = position.y;
        }
        return;
    }
};

GameObject.prototype.getPosition = function()
{
    if( this.physics !== null )
    {
        return this.physics.getPosition();
    }
    if( this.graphics !== null )
    {
        return this.graphics.position;
    }
    return new PIXI.Point( 0 , 0 );
};

GameObject.prototype.getHeight = function()
{
    if( this.graphics !== null )
    {
        return this.graphics.height;
    }
    return 0;
};

GameObject.prototype.getWidth = function()
{
    if( this.graphics !== null )
    {
        return this.graphics.width;
    }
    return 0;
};

GameObject.prototype.hitTest = function( point )
{
    return false;
};

GameObject.prototype.update = function( ms )
{
    if( this.graphics !== null && this.physics !== null )
    {
        this.graphics.position = this.physics.getPosition();
        this.graphics.rotation = this.physics.getAngle();
        if( this.graphics2 !== null )
        {
            this.graphics2.position = this.physics.getPosition();
            this.graphics2.rotation = this.physics.getAngle();
        }
    }
};

GameObject.prototype.beginContactWith = function( another , x , y , nx , ny )
{
};

GameObject.prototype.endContactWith = function( another )
{
    return false;
};

GameObject.prototype.save = function()
{
    return null;
};

GameObject.prototype.load = function( data )
{
};

GameObject.prototype.setAlpha = function( alpha )
{
    if( this.graphics === undefined || this.graphics === null )
    {
        return;
    }
    this.graphics.alpha = alpha;
    
    if( this.graphics2 !== undefined && this.graphics2 !== null )
    {
        this.graphics2.alpha = alpha;
    }
};

GameObject.prototype.fadeTo = function( time , alpha )
{
    if( this.graphics === undefined || this.graphics === null )
    {
        return;
    }
    TweenLite.to( this.graphics , time, {alpha:alpha} );
    
    if( this.graphics2 !== undefined && this.graphics2 !== null )
    {
        TweenLite.to( this.graphics2 , time, {alpha:alpha} );
    }
};

GameObject.prototype.fadeIn = function( time )
{
    if( this.graphics === undefined || this.graphics === null )
    {
        return;
    }
    this.graphics.alpha = 0;
    TweenLite.to( this.graphics , time, {alpha:1.0} );
    
    if( this.graphics2 !== undefined && this.graphics2 !== null )
    {
        this.graphics2.alpha = 0;
        TweenLite.to( this.graphics2 , time, {alpha:1.0} );
    }
};

GameObject.prototype.fadeOut = function( time )
{
    if( this.graphics === undefined || this.graphics === null )
    {
        return;
    }
    TweenLite.to( this.graphics , time, {alpha:0.0} );
    
    if( this.graphics2 !== undefined && this.graphics2 !== null )
    {
        TweenLite.to( this.graphics2 , time, {alpha:0.0} );
    }
};

GameObject.prototype.isVisible = function()
{
    if( this.graphics === undefined || this.graphics === null )
    {
        return false;
    }
    return this.graphics.alpha !== 0.0;
};