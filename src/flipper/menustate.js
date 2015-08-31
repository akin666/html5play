
function MenuState()
{
    State.call( this , 0xE45B6F );
    this.music = MENUMUSIC;
    
    this.playButton = UIFACTORY.createButton( 
        "Play" ,
        0xAAFFAA ,
        0x000000 ,
        function(data){
            var game = new Game();
            
            var str = prompt("Please enter the player name" , "anonymous" );
            game.setPlayerName( str );
            
            switchState( game );
        } 
    );

    this.creditButton = UIFACTORY.createButton( 
        "Credits" ,
        0xAAFFAA ,
        0x000000 ,
        function(data){
            switchState( new Credit() );
        } 
    );
        
    // BG
    this.background = PIXI.Sprite.fromImage("gfx/Titlescreenehdotus.jpg");
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    
    // add bg
    this.group.addChild( this.background );
    
    // Setup buttons
    var pos = -2;
    this.playButton.getContainer().position.y = pos++ * 50;
    this.group.addChild( this.playButton.getContainer() );

    this.creditButton.getContainer().position.y = pos++ * 50;
    this.group.addChild( this.creditButton.getContainer() );
}

MenuState.prototype = new State();
MenuState.prototype.constructor = MenuState;

MenuState.prototype.update = function( ms )
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
            
            if( this.music !== "" )
            {
                AUDIOMANAGER.setMusic( this.music );
                AUDIOMANAGER.playMusic();
            }
            
            // special state, loose the old states.
            this.oldState = null;
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
