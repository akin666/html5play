
function ErrorState( what )
{
    State.call(this);
    
    var fontcolor = 0xFFFFFF;
    
    
    var txt = "There was an error.\n\n" + "description: " + what + "\n\n" + "We are sorry for this.";
    var size = 16;
    var textobject = new PIXI.Text( txt , {font: size + "px Calibri", fill: fontcolor.toString(16) , align: "middle"});
    
    textobject.position.x = 0;
    textobject.position.y = 0;
    
    textobject.anchor.x = 0.5;
    textobject.anchor.y = 0.5;
    
    this.group.addChild( textobject );
}

ErrorState.prototype = new State();
ErrorState.prototype.constructor=Credit;

// Splash cannot be "switchedFrom"
ErrorState.prototype.switchFrom = function( oldState )
{
    return false;
};

ErrorState.prototype.update = function( ms )
{
    switch( this.state ) 
    {
        case STATE_TRANSITION :
        {
            // Only if the oldstate hasnt disappeared, we break
            if( this.oldState !== undefined && this.oldState !== null && (!this.oldState.disappear()) )
            {
                this.oldState.update( ms );
                break;
            }
            
            this.state = STATE_INIT;
            // Let the state transition through to STATE_INIT
        }
        case STATE_INIT :
        {
            this.duration = 0;
            this.state = STATE_IDLE;
            
            this.group.position.x = SCREEN.width / 2;
            this.group.position.y = SCREEN.height / 2;

            // tween the stuff in
            this.group.alpha = 0;
            TweenLite.to( this.group, LONG_TRANSITION_TIME, {alpha:1} );
            
            break;
        }
        case STATE_IDLE :
        {
            this.duration += ms;
            break;
        }
        case STATE_HIDE : 
        {
            break;
        }
        case STATE_DONE : 
        {
            break;
        }
        default: 
        {
            break;
        }
    }
};
