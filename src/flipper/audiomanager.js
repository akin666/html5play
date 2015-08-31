
function AudioManager()
{
    this.data = []; // create data array..
    this.currentMusic = null;
    
    this.requested = 0;
    this.completed = 0;
    this.error = 0;
    
    this.actionlist = [];
    
    var actionlist = [];
    
    actionlist[ RETRY_BALL ] = "sfx/ogg/Fanfare_Retry.ogg";
    actionlist[ LOOSE_BALL ] = "sfx/ogg/Event_Fail.ogg";
    actionlist[ BUMPER_HIT ] = ["sfx/ogg/Impact_BigBoob1.ogg","sfx/ogg/Impact_BigBoob2.ogg","sfx/ogg/Impact_BigBoob3.ogg"];
    
    actionlist[ LAUNCHER_START ] = "sfx/ogg/Launcher_DOWN.ogg";
    actionlist[ LAUNCHER_END ] = "sfx/ogg/Launcher_UP.ogg";
    actionlist[ BALL_LAUNCHED ] = "sfx/ogg/Launcher_Smack.ogg";
    actionlist[ EXTRA_POINTS_AREA_START ] = "";
    actionlist[ EXTRA_POINTS_AREA_END ] = "";
    actionlist[ WALL_HIT ] = ["sfx/ogg/Impact_Wall_1.ogg","sfx/ogg/Impact_Wall_2.ogg","sfx/ogg/Impact_Wall_3.ogg","sfx/ogg/Impact_Wall_4.ogg","sfx/ogg/Impact_Wall_5.ogg"];
    actionlist[ PEDAL_ACTIVATE ] = "sfx/ogg/Pedal_Whip1.ogg";
    actionlist[ PEDAL_DEACTIVATE ] = "";
    actionlist[ PEDAL_HIT ] = "sfx/ogg/Pedal_Smack1.ogg";
    actionlist[ HIGH_SCORE ] = "sfx/ogg/Fanfare_Hiscore.ogg";
    actionlist[ SCORE_POINTS ] = "";
    actionlist[ GAME_OVER ] = "sfx/ogg/Event_GameOver.ogg";
    actionlist[ COIN_PICKUP ] = "sfx/ogg/Coin.ogg";
    actionlist[ BONUS_PICKUP ] = "sfx/ogg/Fanfare_DoublePoints.ogg";
    
    // transform the list into key/audio pairs..
    for( var key in actionlist )
    {
        var audio = this.load( actionlist[ key ] );
        if( audio !== null )
        {
            this.actionlist[ key ] = audio;
        }
    }
}

function getPlaySoundFunction( path )
{
    var player = AUDIOMANAGER.load( path );
    var func = function()
    {
        if( player === undefined || player === null )
        {
            return;
        }
        player.playAt( 0 );
    };
    
    return func;
}

AudioManager.prototype.has = function( path )
{
    return !(this.data[path] === undefined || this.data[path] === null);
};

AudioManager.prototype.get = function( path )
{
    if( this.data[path] === undefined || this.data[path] === null )
    {
        return null;
    }
    return this.data[path];
};

AudioManager.prototype.loadList = function( list )
{
    var n = 0;
    for( var i = 0 ; i < list.length ; ++i )
    {
        if( load( list[i] ) !== null )
        {
            ++n;
        }
    }
    return n;
};

AudioManager.prototype.load = function( path )
{
    // null equals ""..
    if( path === "" || path === null )
    {
        return null;
    }
    
    if( path instanceof Array )
    {
        var arr = [];
        for( var i = 0 ; i < path.length ; ++i )
        {
            var ret = this.load( path[i] );
            if( ret !== null )
            {
                arr.push( ret );
            }
        }
        return arr;
    }
    
    if( this.has( path ) )
    {
        return this.data[path];
    }
    
    this.requested++;
    var that = this;
    var requestPath = path;
    
    var audio = new AudioPlayer();
    
    audio.onLoadComplete = function() 
    { 
        if( that === undefined )
        {
            LOG.error("that is undefined!");
            return;
        }
        that.completed++;
    };
        
    audio.onLoadError = function() 
    { 
        if( that === undefined )
        {
            LOG.error("that is undefined!");
            return;
        }
        LOG.error("Failed to load " + requestPath );
        that.error++;
    };
    audio.load( requestPath );
    
    this.data[ requestPath ] = audio;
    return audio;
};

AudioManager.prototype.setup = function()
{
};

AudioManager.prototype.setMusic = function( url )
{
    if( url === "" )
    {
        this.stopMusic();
        this.currentMusic = null;
        return;
    }
    
    var tmpmusic = this.load( url );
    if( tmpmusic === this.currentMusic )
    {
        return;
    }
    
    this.stopMusic();
    this.currentMusic = tmpmusic;
};

AudioManager.prototype.playMusic = function()
{
    if( this.currentMusic === null )
    {
        return;
    }
    this.currentMusic.setLoop( true );
    this.currentMusic.play( 1 );
};

AudioManager.prototype.stopMusic = function()
{
    if( this.currentMusic === null )
    {
        return;
    }
    this.currentMusic.stop( 1 );
};

AudioManager.prototype.pauseMusic = function()
{
    if( this.currentMusic === null )
    {
        return;
    }
    this.currentMusic.pause( 1 );
};

AudioManager.prototype.gameEvent = function( event )
{
    if( this.actionlist[ event.type ] !== undefined && this.actionlist[ event.type ] !== null )
    {
        var act = this.actionlist[ event.type ];
        
        if( act instanceof Array )
        {
            var index = Math.floor(Math.random() * act.length);
            act[ index ].playAt( 0 , 0.1 );
            return;
        }
        
        act.playAt( 0 , 0.1 );
    }
};
