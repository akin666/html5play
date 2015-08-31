
// Zero and negative states are reserved for global common states.
var STATE_INIT = 0;     // Non initialized state
var STATE_TRANSITION = -4; // wait transition.
var STATE_HIDE = -3;    // Hide the current state, to state where STATE_INIT can recover.
var STATE_IDLE = -2;    // Common state where the state is just idling
var STATE_DONE = -1;    // State is done for

function switchState( newState )
{
    // prevent infinite loop.
    if( newState === STATE || newState === null )
    {
        return;
    }
    
    // Will the newstate take care of the oldstate ?
    if( !newState.switchFrom( STATE ) )
    {
        STATE.state = STATE_DONE;
    }
    STATE = newState;
}

function sendGameEvent( event )
{
    // prevent infinite loop.
    if( STATE !== null )
    {
        STATE.gameEvent( event );
    }
}

function State( bgcolor )
{
    var color = 0x000000;
    if( bgcolor !== undefined && bgcolor !== null )
    {
        color = bgcolor;
    }
    this.stage = new PIXI.Stage( color , true );
    this.group = new PIXI.DisplayObjectContainer();
    
    this.state = STATE_INIT;
    this.disappeared = false;
    this.oldState = null;
    this.duration = 0;
    
    this.stage.addChild( this.group );
}

State.prototype.getContainer = function()
{
    return this.group;
};

State.prototype.resize = function( event )
{
    this.state = STATE_INIT;
    
    // temporary state, theres a old state on the background, update it aswell
    if( this.oldState === null )
    {
        return;
    }
    this.oldState.resize( event );
};

// This function gives great power, but beware of circular references.
State.prototype.switchFrom = function( oldState )
{
    this.oldState = oldState;
    this.state = STATE_TRANSITION;
    
    return true;
};

// once dissapeared, this function should return true.
// before that, the one calling "dissapear" should call
// dissapear function instead of its own "update" function,
// same on the paint.
State.prototype.disappear = function()
{
    if( this.state != STATE_HIDE )
    {
        this.disappeared = false;
        var that = this;
        this.state = STATE_HIDE;
        TweenLite.to( 
                this.group, 
                STATE_TRANSITION_TIME, 
                {
                    alpha:0 , 
                    onComplete: 
                        function() 
                        {
                            if( that === undefined || that === null )
                            {
                                LOG.error("That was not there.");
                                return;
                            }
                            that.disappeared = true;
                        } 
                 } 
             );
    }
    return this.disappeared;
};

State.prototype.gameEvent = function( event )
{
};

State.prototype.keyDownEvent = function( event )
{  
    var keyCode = ('which' in event) ? event.which : event.keyCode;
    LOG.print("Unicode key down: " + keyCode);
};

State.prototype.keyPressEvent = function( event )
{  
    var keyCode = ('which' in event) ? event.which : event.keyCode;
    LOG.print("Unicode key press: " + keyCode);
};

State.prototype.keyUpEvent = function( event )
{  
    var keyCode = ('which' in event) ? event.which : event.keyCode;
    LOG.print("Unicode key up: " + keyCode);
};

State.prototype.update = function( ms )
{
};

State.prototype.paint = function()
{
    if( this.state === STATE_TRANSITION )
    {
        // Only if we have oldstate
        if( this.oldState !== null )
        {
            try
            {
                SCREEN.renderer.render( this.oldState.stage );
            }
            catch(err)
            {
                ERRORMANAGER.handleSevere( err.message );
            }
        }
        return;
    }
    try
    {
        SCREEN.renderer.render( this.stage );
    }
    catch(err)
    {
        ERRORMANAGER.handleSevere( err.message );
    }
};