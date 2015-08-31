
function LauncherObject( gamephysics , world , data , eventmanager , dynamicworld )
{
    GameObject.call( this , gamephysics , world , eventmanager );
    
    this.dynamicworld = dynamicworld;
    this.launchState = false;
    this.launchTimer = 0;
    this.launchMaxTime = 1000;
    this.radius = 25;
    this.graphics = PIXI.Sprite.fromImage("gfx/launcher.png");
    this.graphics.anchor.x = 0.5;
    this.graphics.anchor.y = 1.0;
    this.container.addChild( this.graphics );
    this.activationEvent = INPUT_LAUNCHER;
    
    // save the world, we need it to create balls
    this.world = world;
    
    this.currentBall = null;
    
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
        if( data.activation !== undefined )
        {
            this.setTrigger( data.activation );
        }
    }
}

LauncherObject.prototype = new GameObject();
LauncherObject.prototype.constructor = LauncherObject;

LauncherObject.prototype.hitTest = function( point )
{
    var point2 = this.getPosition();
    
    var distance = dist( point , point2 );
    
    if( distance < this.radius )
    {
        return true;
    }
    return false;
};

LauncherObject.prototype.setTrigger = function( str )
{
    this.activationEvent = translateEventFromString( str );
};

LauncherObject.prototype.getTrigger = function()
{
    return translateEventFromKey( this.activationEvent );
};

LauncherObject.prototype.getName = function()
{
    return "launcher";
};

LauncherObject.prototype.save = function()
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

LauncherObject.prototype.load = function( data )
{
    this.setPosition( data.position );
    this.setAngle( data.angle );
    this.setScale( data.scale );
    if( data.activation !== undefined )
    {
        this.setTrigger( data.activation );
    }
};

LauncherObject.prototype.updateGraphics = function()
{
    var scaling = 1.0;
    if( this.launchTimer >= this.launchMaxTime )
    {
        scaling = 0.0;
    }
    else
    {
        // calculate scaling between 0.0 and 1.0
        scaling = 1.0 - (this.launchTimer / this.launchMaxTime);
    }
    
    var total = 0.5 + ( 0.5 * scaling );
    this.graphics.scale.y = total;
    
    if( this.currentBall !== null )
    {
        var off = angleToAxis( this.getAngle() , this.graphics.height + (this.currentBall.getHeight() / 2 ) );
        
        var pos = new PIXI.Point( this.graphics.position.x + off.x , this.graphics.position.y - off.y );
        this.currentBall.setPosition( pos );
    }
};

LauncherObject.prototype.update = function( ms )
{
    if( this.graphics === null || !this.launchState )
    {
        return;
    }
    
    this.launchTimer += ms;
    this.updateGraphics();
};

LauncherObject.prototype.startLaunch = function()
{
    if( this.launchState )
    {
        return;
    }
    
    this.launchState = true;
    this.launchTimer = 0;
    
    var gameevent = new GameEvent();
    gameevent.type = LAUNCHER_START;
    sendGameEvent( gameevent );
    
    var position = new PIXI.Point( this.graphics.position.x , this.graphics.position.y - this.graphics.height );
    var data = { 
        position: position,
        angle: 0.0,
        scale: 1.0
    };
    this.currentBall = this.world.createBall( data );

    if( this.currentBall === null )
    {
        return;
    }
    
    // offset the ball by the ball radius
    var off = angleToAxis( this.getAngle() , this.graphics.height + (this.currentBall.getHeight() / 2 ) );
    var pos = new PIXI.Point( this.graphics.position.x + off.x , this.graphics.position.y - off.y );
    this.currentBall.setPosition( pos );
    
    this.currentBall.fadeIn( BASE_TRANSITION_TIME );
};

LauncherObject.prototype.endLaunch = function()
{
    if( !this.launchState )
    {
        return;
    }
    
    var gameevent = new GameEvent();
    gameevent.type = LAUNCHER_END;
    sendGameEvent( gameevent );
    
    this.launchState = false;
    
    // let the ball go
    if( this.currentBall !== null )
    {
        var gameevent = new GameEvent();
        gameevent.type = BALL_LAUNCHED;
        sendGameEvent( gameevent );
        
        // calculate normalized force..
        var scaling = 0.0;
        if( this.launchTimer >= this.launchMaxTime )
        {
            scaling = 1.0;
        }
        else
        {
            // calculate scaling between 0.0 and 1.0
            scaling = this.launchTimer / this.launchMaxTime;
        }
        
        var totalForce = scaling * BALL_LAUNCH_FORCE;
        var force = angleToAxis( this.getAngle() , -totalForce );
        
        this.currentBall.addPhysics();
        var physics = this.currentBall.getPhysics();
        if( physics === null )
        {
            LOG.error("Achtung, no physics for the ball.");
            return;
        }
        physics.applyImpulse( force , this.currentBall.getPosition() );
    }
    this.currentBall = null;
    
    TweenLite.to( this.graphics.scale , 0.1 , {y:1 , ease:Quart.easeInOut} );
};

LauncherObject.prototype.gameEvent = function( event )
{
    if( event.type === this.activationEvent )
    {
        if( event.active )
        {
            this.startLaunch();
        }
        else
        {
            this.endLaunch();
        }
    }
};
