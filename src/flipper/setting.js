
function Setting()
{
    State.call(this);
    
    // pass this to closures.
    var that = this;
    
    // back
    var sure = UIFACTORY.createCheckBox( 
        "Are you sure?" ,
        0xFFFFFF ,
        false
    );
    sure.getContainer().position.y = 0;
    this.group.addChild( sure.getContainer() );
    
    // back
    var back = UIFACTORY.createButton( 
        "BACK" ,
        0xAAAAFF ,
        0xFFFFFF ,
        function(data){
            if( that === null || that === undefined ) {
                LOG.error("that is not set for back.");
                return;
            }
            if( that.oldState === null || that === undefined ) {
                LOG.error("oldState is not set for back.");
                return;
            }
            switchState( that.oldState );
        } 
    );
    back.getContainer().position.y = 100;
    this.group.addChild( back.getContainer() );
}

Setting.prototype = new State();
Setting.prototype.constructor=Setting;

Setting.prototype.update = function( ms )
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
            var totalFadeTime = 0.5;
            TweenLite.to( this.group, totalFadeTime, {alpha:1} );
            
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
