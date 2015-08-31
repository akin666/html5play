
var SPLASH_DURATION = 3000;

function SplashState()
{
    State.call( this , 0xFFFFFF );
    this.music = MENUMUSIC;
    
    //this.background =  new PIXI.Graphics();
    this.logoSprite =  PIXI.Sprite.fromImage("gfx/omnom.jpg");
    
    // Setup background
    //this.background.clear();
    //this.background.beginFill( 0xFFFFFF , 1.0 );
    //this.background.drawRect( -SCREEN.width/2 , -SCREEN.height/2 , SCREEN.width , SCREEN.height );
    //this.background.endFill();
    
    // Setup splash sprite
    this.logoSprite.anchor.x = 0.5;
    this.logoSprite.anchor.y = 0.5;
    
    //this.group.addChild( this.background );
    this.group.addChild( this.logoSprite );
    
    this.canContinue = false;
    
    // Begin to load menubg
    var assets = [];
    assets.push( "gfx/Titlescreenehdotus.jpg" );
    var loader = new PIXI.AssetLoader( assets );
    var that = this;
    loader.onComplete = function() {
        that.canContinue = true;
    };
    loader.load();
}

SplashState.prototype = new State();
SplashState.prototype.constructor=SplashState;

// Splash cannot be "switchedFrom"
SplashState.prototype.switchFrom = function( oldState )
{
    return false;
};

SplashState.prototype.update = function( ms )
{
    switch( this.state ) 
    {
        case STATE_TRANSITION :
        {
            if( this.music !== "" )
            {
                AUDIOMANAGER.setMusic( this.music );
                AUDIOMANAGER.playMusic();
            }
            
            this.state = STATE_INIT;
            // Let the state transition through to STATE_INIT
        }
        case STATE_INIT :
        {
            if( document.readyState == 'complete' ) 
            {
                // Document is complete, we may create the screen.
                SCREEN.create();
                
                this.duration = 0;
                this.state = STATE_IDLE;
                
                this.group.position.x = SCREEN.width / 2;
                this.group.position.y = SCREEN.height / 2;
                
                // tween the stuff in
                this.group.alpha = 0;
                var fadeInTime = 1.5;
                TweenLite.to( this.group, fadeInTime, {alpha:1} );
                
                // setup audiomanager.
                AUDIOMANAGER.setup();
            }
            break;
        }
        case STATE_IDLE :
        {
            this.duration += ms;
            if( this.duration > SPLASH_DURATION ) 
            {
                if( !this.canContinue )
                {
                    return;
                }
                
                if( DEBUG_MODE )
                {
                    switchState( new MenuStateDev() );
                }
                else
                {
                    switchState( new MenuState() );
                }
            }
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
