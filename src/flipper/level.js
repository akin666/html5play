
function Level( gamescore )
{
    this.group = new PIXI.DisplayObjectContainer();
    
    this.score = gamescore;
    this.duration = 0;
    // 100 for scale would sound proper..
    this.physics = new GamePhysics( 64.0 , 0 , 9.81 );
    
    this.world = new GameWorld( this.physics , gamescore , this.group , this );
    
    this.eventListenerObjects = [];
    
    this.debugCanvas = null;
}

Level.prototype.update = function( ms )
{
    this.duration += ms;
    this.physics.update( ms );
    
    this.world.update( ms );
};

Level.prototype.ready = function()
{
    return this.world.ready();
};

Level.prototype.start = function()
{
    this.world.start();
};

Level.prototype.destruct = function()
{
    this.world.destruct();
};

Level.prototype.reset = function()
{
    this.world.reset();
};

Level.prototype.setup = function( jsondata )
{
    this.duration = 0;
    var data = JSON.parse( jsondata );
    
    for( var i = 0 ; i < data.length ; ++i )
    {
        var current = data[i];
        if( current.type === "wall" )
        {
            if( this.world !== null )
            {
                this.world.setupWalls( current );
            }
        }
        else if( current.type === "info" || current.type === "background" ) // background is legacy name for info.
        {
            if( this.world !== null )
            {
                this.world.setupInfo( current );
            }
        }
        else if( current.type === "area" )
        {
            if( this.world !== null )
            {
                this.world.setupAreas( current );
            }
        }
        else if( current.type === "item" )
        {
            if( this.world !== null )
            {
                this.world.setupItems( current );
            }
        }
    }
    
    this.world.finalize();
    
    if( DEBUG_PHYSICS_MODE )
    {
        this.physics.setDebugDraw( this.world.getWidth() , this.world.getHeight() );
    }
    
    //this.camera.zoomTo( 2 );
    // Border
    //this.physics.setupBorder( 25 , 25 , SCREEN.width - 50 , SCREEN.height - 50 );
    
    return true;
};

Level.prototype.addEventListenerObject = function( object )
{
    this.eventListenerObjects.push( object );
};

Level.prototype.removeEventListenerObject = function( object )
{
    for( var i = this.eventListenerObjects.length - 1 ; i >= 0; --i )
    {
        if( this.eventListenerObjects[i] === object )
        {
            this.eventListenerObjects.splice( i, 1 );
            return;
        }
    }
};

function timerForBonusItem( gamescore , time )
{
    var scoreversion = gamescore.getVersion();
    setTimeout(
        function() { 
            var gameevent = new GameEvent();
            gameevent.type = BONUS_END;
            // scoreversion makes sure, that that begin of bonus, is actually the same score..
            gameevent.number = scoreversion;
            sendGameEvent( gameevent ); 
        }, time
    );
};

Level.prototype.gameEvent = function( event )
{
    // Game logic!
    switch( event.type )
    {
        case BONUS_PICKUP :
            this.score.addPointsModifier( 1 );
            
            timerForBonusItem( this.score , BONUS_PICKUP_DURATION );
            break;
        case BONUS_END :
            if( this.score.getVersion() === event.number )
            {
                this.score.removePointsModifier( 1 );
            }
            break;
        case COIN_PICKUP :
            this.score.addPoints( 100 );
            break;
        case EXTRA_POINTS_AREA_START :
            this.score.addPointsModifier( 1 );
            break;
        case EXTRA_POINTS_AREA_END :
            this.score.removePointsModifier( 1 );
            break;
        case RETRY_BALL :
            this.score.addBall( 1 );
            break;
        case BUMPER_HIT :
            this.score.addPoints( 10 );
            break;
        case WALL_HIT :
            this.score.addPoints( 1 );
            break;
        case PEDAL_HIT :
            this.score.addPoints( 2 );
            break;
        case LOOSE_BALL :
            if( this.score.getBallCount() === 0 && this.score.getAliveCount() === 0 )
            {
                // Game is over.. Commit score.
                this.score.commitScore();
                
                var gameevent = new GameEvent();
                gameevent.type = GAME_OVER;
                sendGameEvent( gameevent );
            }
            break;
        case GAME_START :
            AUDIOMANAGER.playMusic();
            break;
        case GAME_OVER :
            AUDIOMANAGER.stopMusic();
            break;
        default:
            break;
    }
    
    for( var i = 0 ; i < this.eventListenerObjects.length ; ++i )
    {
        this.eventListenerObjects[i].gameEvent( event );
    }
};
