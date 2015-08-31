
function MenuStateDev()
{
    State.call( this , 0xE45B6F );
    this.music = MENUMUSIC;
    
    this.scalefactor = SCREEN.height / 1000;
    
    this.playButton = UIFACTORY.createButton( 
        "Play" ,
        0xFFD3D0 ,
        0xFFFFFF ,
        function(data){
            var str = prompt("Please enter the player name" , "anonymous" );
            if( str === undefined || str === null )
            {
                return;
            }
            
            if( str === "" ) str = "anonymous";
            var game = new Game();
            game.setPlayerName( str );
            
            switchState( game );
        } 
    );
    this.playButton.hover = getPlaySoundFunction( "sfx/ogg/Menu_Hover_Play.ogg" );
    this.playButton.select = getPlaySoundFunction( "sfx/ogg/Menu_Select_Play.ogg" );
        
    this.customButton = UIFACTORY.createButton( 
        "Play Custom" ,
        0xFFB3C0 ,
        0xFFFFFF ,
        function(data){
            var customjson = prompt( "Please enter the custom data" );
            if( customjson === null )
            {
                return;
            }
            
            var str = prompt("Please enter the player name" , "anonymous" );
            if( str === undefined || str === null )
            {
                return;
            }
            if( str === "" ) str = "anonymous";
            var game = new Game();
            game.setPlayerName( str );
            
            game.setLevel( customjson );
            switchState( game );
        } 
    );
    this.customButton.hover = getPlaySoundFunction( "sfx/ogg/Menu_Hover_PlayCustom.ogg" );
    this.customButton.select = getPlaySoundFunction( "sfx/ogg/Menu_Select_PlayCustom.ogg" );
    /*
    this.settingButton = UIFACTORY.createButton( 
        "Settings" ,
        0xAAFFAA ,
        0x000000 ,
        function(data){
            switchState( new Setting() );
        } 
    );
    */
    this.editorButton = UIFACTORY.createButton( 
        "Editor" ,
        0xFFB3C0 ,
        0xFFFFFF ,
        function(data){
            switchState( new Editor() );
        } 
    );
    this.editorButton.hover = getPlaySoundFunction( "sfx/ogg/Menu_Hover_Editor.ogg" );
    this.editorButton.select = getPlaySoundFunction( "sfx/ogg/Menu_Select_Editor.ogg" );
    
    this.creditButton = UIFACTORY.createButton( 
        "Credits" ,
        0xFFB3C0 ,
        0xFFFFFF ,
        function(data){
            switchState( new Credit() );
        } 
    );
    this.creditButton.hover = getPlaySoundFunction( "sfx/ogg/Menu_Hover_Credits.ogg" );
    this.creditButton.select = getPlaySoundFunction( "sfx/ogg/Menu_Select_Credits.ogg" );
        
    // BG
    this.background = PIXI.Sprite.fromImage("gfx/Titlescreenehdotus.jpg");
    this.background.anchor.x = 0.5;
    this.background.anchor.y = 0.5;
    this.background.scale.x = this.scalefactor;
    this.background.scale.y = this.scalefactor;
    
    // add bg
    this.group.addChild( this.background );
    
    // Setup buttons
    var button_offset_x = this.scalefactor * 150;
    var button_offset_y = this.scalefactor * -20;
    
    var jump_dist = 40;
    var pos = 0;
    this.playButton.getContainer().position.x = button_offset_x;
    this.playButton.getContainer().position.y = button_offset_y + (pos++ * jump_dist);
    this.group.addChild( this.playButton.getContainer() );
    
    this.customButton.getContainer().position.x = button_offset_x;
    this.customButton.getContainer().position.y = button_offset_y + (pos++ * jump_dist);
    this.group.addChild( this.customButton.getContainer() );
    /*
    this.settingButton.getContainer().position.y = pos++ * 50;
    this.group.addChild( this.settingButton.getContainer() );
    */
    this.editorButton.getContainer().position.x = button_offset_x;
    this.editorButton.getContainer().position.y = button_offset_y + (pos++ * jump_dist);
    this.group.addChild( this.editorButton.getContainer() );

    this.creditButton.getContainer().position.x = button_offset_x;
    this.creditButton.getContainer().position.y = button_offset_y + (pos++ * jump_dist);
    this.group.addChild( this.creditButton.getContainer() );
}

MenuStateDev.prototype = new State();
MenuStateDev.prototype.constructor = MenuStateDev;

MenuStateDev.prototype.update = function( ms )
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
