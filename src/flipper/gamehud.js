
function GameHud( gamescore )
{
    this.group = new PIXI.DisplayObjectContainer();
    
    this.score = gamescore;
    
    this.isReady = 0;
    var that = this;
    
    var assetsToLoad = [];
    assetsToLoad.push( "gfx/unibody.fnt" );
    assetsToLoad.push( "gfx/topbar.png" );
    assetsToLoad.push( "gfx/ui_left_pedal.png" );
    assetsToLoad.push( "gfx/ui_right_pedal.png" );
    assetsToLoad.push( "gfx/ui_launcher.png" );
    assetsToLoad.push( "gfx/ui_menu.png" );
    assetsToLoad.push( "gfx/gameover.png" );
    assetsToLoad.push( "gfx/highscore.png" );
    
    this.leftbottom = null;
    this.rightbottom = null;
    this.centerbottom = null;
    
    this.leftpedalbutton = null;
    this.rightpedalbutton = null;
    this.launchbutton = null;
    this.menubutton = null;
    
    this.midtop = null;
    
    this.midcenter = null;
    
    this.scoretext = null;
    this.balltext = null;
    this.statustext = null;
    
    this.gameover = null;
    this.highscore = null;
    this.scorescreen = null;
    
    this.scoretextdef = "Score: ";
    this.balltextdef = "Balls: ";
    
    // Scoremanagement..
    
    // create a new loader to load all the assets
    // upon completion decrease the isReady count.
    this.isReady++;
    var loader = new PIXI.AssetLoader( assetsToLoad );
    loader.onComplete = function() 
    {
        that.isReady--;
    };
    
    loader.load();
}

GameHud.prototype.start = function()
{
    if( this.scorescreen !== null )
    {
        this.scorescreen.destruct();
        this.scorescreen = null;
    }
    
    // setup midcenter
    if( this.midcenter === null )
    {
        this.midcenter = new PIXI.DisplayObjectContainer();
        this.group.addChild( this.midcenter );
    }
    this.midcenter.position.x = SCREEN.width / 2;
    this.midcenter.position.y = SCREEN.height / 2;
    
    // setup midtop
    if( this.midtop === null )
    {
        this.midtop = PIXI.Sprite.fromImage("gfx/topbar.png");
        this.midtop.anchor.x = 0.5;
        this.midtop.anchor.y = 0;
        
        this.group.addChild( this.midtop );
    }
    this.midtop.position.x = SCREEN.width / 2;
    this.midtop.position.y = 0;
    
    // setup centerbottom
    if( this.leftbottom === null )
    {
        this.leftbottom = new PIXI.DisplayObjectContainer();
        this.group.addChild( this.leftbottom );
    }
    this.leftbottom.position.x = 0;
    this.leftbottom.position.y = SCREEN.height;
    
    // setup rightbottom
    if( this.rightbottom === null )
    {
        this.rightbottom = new PIXI.DisplayObjectContainer();
        this.group.addChild( this.rightbottom );
    }
    this.rightbottom.position.x = SCREEN.width;
    this.rightbottom.position.y = SCREEN.height;
    
    // setup centerbottom
    if( this.centerbottom === null )
    {
        this.centerbottom = new PIXI.DisplayObjectContainer();
        this.group.addChild( this.centerbottom );
    }
    this.centerbottom.position.x = SCREEN.width / 2;
    this.centerbottom.position.y = SCREEN.height;
    
    // button setup
    if( this.leftpedalbutton === null )
    {
        this.leftpedalbutton = PIXI.Sprite.fromImage("gfx/ui_left_pedal.png");
        this.leftpedalbutton.anchor.x = 0;
        this.leftpedalbutton.anchor.y = 1;
        this.leftpedalbutton.buttonMode = true;
        this.leftpedalbutton.setInteractive(true);
        
        this.leftpedalbutton.mousedown = this.leftpedalbutton.touchstart = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_PEDAL_LEFT;
                gameevent.active = true;
                sendGameEvent( gameevent );
            };

        this.leftpedalbutton.mouseup = this.leftpedalbutton.touchend = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_PEDAL_LEFT;
                gameevent.active = false;
                sendGameEvent( gameevent );
            };
        
        this.leftbottom.addChild( this.leftpedalbutton );
    }
    if( this.rightpedalbutton === null )
    {
        this.rightpedalbutton =  PIXI.Sprite.fromImage("gfx/ui_right_pedal.png");
        this.rightpedalbutton.anchor.x = 1;
        this.rightpedalbutton.anchor.y = 1;
        this.rightpedalbutton.buttonMode = true;
        this.rightpedalbutton.setInteractive(true);
        
        this.rightpedalbutton.mousedown = this.rightpedalbutton.touchstart = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_PEDAL_RIGHT;
                gameevent.active = true;
                sendGameEvent( gameevent );
            };

        this.rightpedalbutton.mouseup = this.rightpedalbutton.touchend = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_PEDAL_RIGHT;
                gameevent.active = false;
                sendGameEvent( gameevent );
            };
        
        this.rightbottom.addChild( this.rightpedalbutton );
    }
    if( this.launchbutton === null )
    {
        this.launchbutton =  PIXI.Sprite.fromImage("gfx/ui_launcher.png");
        this.launchbutton.anchor.x = 0.5;
        this.launchbutton.anchor.y = 1;
        this.launchbutton.buttonMode = true;
        this.launchbutton.setInteractive(true);
        
        this.launchbutton.mousedown = this.launchbutton.touchstart = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_LAUNCHER;
                gameevent.active = true;
                sendGameEvent( gameevent );
            };

        this.launchbutton.mouseup = this.launchbutton.touchend = 
            function(data){
                var gameevent = new GameEvent();
                gameevent.type = INPUT_LAUNCHER;
                gameevent.active = false;
                sendGameEvent( gameevent );
            };
        
        this.centerbottom.addChild( this.launchbutton );
    }
    this.launchbutton.position.x = 0;
    if( this.menubutton === null )
    {
        this.menubutton =  PIXI.Sprite.fromImage("gfx/ui_menu.png");
        this.menubutton.anchor.x = 1;
        this.menubutton.anchor.y = 1;
        this.menubutton.buttonMode = true;
        this.menubutton.setInteractive(true);
        
        this.menubutton.click = this.menubutton.tap = 
            function(data){
                if( DEBUG_MODE )
                {
                    switchState( new MenuStateDev() );
                }
                else
                {
                    switchState( new MenuState() );
                }
            };
        
        this.centerbottom.addChild( this.menubutton );
    }
    this.menubutton.position.x = 200;
    
    var score_text_offset_y = 30;
    var score_text_offset_x = -110;
    // setup midtop data
    if( this.scoretext === null )
    {
        this.scoretext = new PIXI.BitmapText( this.scoretextdef + this.score.getScore() , {font: "24px Unibody", align: "center"});
        this.scoretext.position.x = score_text_offset_x;
        this.scoretext.position.y = score_text_offset_y;
        this.midtop.addChild( this.scoretext );
    }
    if( this.balltext === null )
    {
        this.balltext = new PIXI.BitmapText( this.balltextdef + this.score.getBallCount() + "/" +  this.score.getMaxBallCount() , {font: "24px Unibody", align: "center"});
        this.balltext.position.x = score_text_offset_x;
        this.balltext.position.y = score_text_offset_y + 25;
        this.midtop.addChild( this.balltext );
    }
    if( this.statustext === null )
    {
        this.statustext = new PIXI.BitmapText("", {font: "24px Unibody", align: "center"});
        this.statustext.position.x = score_text_offset_x;
        this.statustext.position.y = score_text_offset_y + 50;
        this.midtop.addChild( this.statustext );
    }
    
    // setup gameover
    var gameover_offset_y = -200;
    if( this.gameover === null )
    {
        this.gameover =  PIXI.Sprite.fromImage("gfx/gameover.png");
        this.gameover.anchor.x = 0.5;
        this.gameover.anchor.y = 0.5;
        
        this.midcenter.addChild( this.gameover );
    }
    this.gameover.position.x = 0;
    this.gameover.position.y = gameover_offset_y;
    this.gameover.alpha = 0.0;
    // setup highscore
    if( this.highscore === null )
    {
        this.highscore =  PIXI.Sprite.fromImage("gfx/highscore.png");
        this.highscore.anchor.x = 0.5;
        this.highscore.anchor.y = 0.5;
        
        this.midcenter.addChild( this.highscore );
    }
    this.highscore.position.x = 0;
    this.highscore.position.y = gameover_offset_y;
    this.highscore.alpha = 0.0;
};

GameHud.prototype.ready = function()
{
    return this.isReady <= 0;
};

GameHud.prototype.update = function( ms )
{
};

GameHud.prototype.gameEvent = function( event )
{
    if( this.scorescreen !== null )
    {
        this.scorescreen.gameEvent( event );
    }
    switch( event.type )
    {
        case SCORE_MODIFIER :
            if( this.statustext !== null )
            {
                this.statustext.setText( this.score.getModifierText() );
            }
            break;
        case LOOSE_BALL :
            break;
        case RETRY_BALL :
            if( this.statustext !== null )
            {
                this.statustext.setText("Retry!");
            }
        case BALL_COUNT :
            if( this.balltext !== null )
            {
                this.balltext.setText( this.balltextdef + this.score.getBallCount() + "/" +  this.score.getMaxBallCount() );
            }
            break;
        case SCORE_POINTS :
            if( this.scoretext !== null )
            {
                this.scoretext.setText( this.scoretextdef + this.score.getScore() );
            }
            break;
        case GAME_OVER :
            TweenLite.to( this.gameover , BASE_TRANSITION_TIME, {alpha:1} );
            
            this.scorescreen = new ScoreScreen( this.score , this.group );
            this.scorescreen.fadeIn();
            
            break;
        case HIGH_SCORE :
            var tl1 = new TimelineLite();
            tl1.to( this.highscore , 0.3, {alpha:1}).to(this.highscore, 0.3, {alpha:0, delay:1});
            break;
        default:
            break;
    }
};

GameHud.prototype.keyDownEvent = function( event )
{
    return false;
};

GameHud.prototype.keyPressEvent = function( event )
{
    return false;
};

GameHud.prototype.keyUpEvent = function( event )
{
    return false;
};