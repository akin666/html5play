
var GAME_STATE_LOADING = 1;
var GAME_STATE_RUNNING = 2;
var GAME_STATE_PAUSED = 3;

// Game specific Globals!
var BALL_LAUNCH_FORCE = 50; // max launch force force

var WALL_DENSITY = 1.0;
var WALL_FRICTION = 0.5;
var WALL_RESTITUTION = 0.4;

var BALL_DENSITY = 1.75;
var BALL_FRICTION = 0.1;
var BALL_RESTITUTION = 0.4;

var PEDAL_SPEED = 2.5 * (2*Math.PI); // radians per second
var PEDAL_TORQUE = 3000; // force of the motor..
var PEDAL_DENSITY = 10.0;
var PEDAL_FRICTION = 0.3;
var PEDAL_RESTITUTION = 0.2;

var BUMPER_BUMP_FORCE = 20; // newtons.. 
var BUMPER_DENSITY = 0.7;
var BUMPER_FRICTION = 1.0;
var BUMPER_RESTITUTION = 1.0;

var BONUS_PICKUP_DURATION = 5000;

var SERVER_CONNECTION = "data.php";
var MENUMUSIC = "sfx/ogg/Boobjam_01_PinUpBoobieBallTheme.ogg";

// How much "safezone" or "obscured" zones there are around edges.
// The hud takes 80pixels on top.. so, lets make 80pixel safe zone.
var TOP_MAX = -80;
var BOTTOM_MAX = -80;
var LEFT_MAX = -80;
var RIGHT_MAX = -80;

function Game()
{
    State.call(this);
    
    this.gamescore = new GameScore();
    this.hud = new GameHud( this.gamescore );
    this.level = new Level( this.gamescore );
    
    this.currentLevel = 1;
    this.levelManager = new LevelManager();
    
    this.leveldata = "";
    
    this.group.addChild( this.level.group );
    this.group.addChild( this.hud.group );
}

Game.prototype = new State();
Game.prototype.constructor = Game;

Game.prototype.gameStart = function()
{
    this.level.start();
    this.hud.start();
    
    var gameevent = new GameEvent();
    gameevent.type = GAME_START;
    sendGameEvent( gameevent );
};

Game.prototype.setLevel = function( leveldata )
{
    this.leveldata = leveldata;
};

Game.prototype.update = function( ms )
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
            // Reset scoredata (state et all)
            this.gamescore.reset();
            this.level.reset();
            
            if( this.leveldata === "" )
            {
                this.leveldata = this.levelManager.get( this.currentLevel );
            }
            this.level.setup( this.leveldata );
            this.state = GAME_STATE_LOADING;

            // tween the stuff in
            this.group.alpha = 0;
            
            break;
        }
        case GAME_STATE_LOADING :
        {
            if( this.level.ready() && this.hud.ready() )
            {
                this.state = GAME_STATE_RUNNING;
                TweenLite.to( this.group, BASE_TRANSITION_TIME, {alpha:1} );
                this.gameStart();
            }
            break;
        }
        case GAME_STATE_RUNNING :
        {
            this.level.update( ms );
            this.hud.update( ms );
            break;
        }
        case GAME_STATE_PAUSED :
        {
            this.hud.update( ms );
            break;
        }
        case STATE_IDLE :
        {
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

Game.prototype.gameEvent = function( event )
{
    this.hud.gameEvent( event );
    this.level.gameEvent( event );
    AUDIOMANAGER.gameEvent( event );
};

// convert events to game events..
Game.prototype.keyDownEvent = function( event )
{
    if( this.hud.keyDownEvent( event ) )
    {
        return;
    }
    
    switch( event.keyCode )
    {
        case KEY_ALT :
        case KEY_B :
        case KEY_M :
        case KEY_RIGHTWIN :
        case KEY_RIGHT :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_PEDAL_RIGHT;
            gameevent.active = true;
            sendGameEvent( gameevent );
            break;
        case KEY_CONTROL :
        case KEY_A :
        case KEY_N :
        case KEY_LEFTWIN :
        case KEY_LEFT :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_PEDAL_LEFT;
            gameevent.active = true;
            sendGameEvent( gameevent );
            break;
        case KEY_DOWN :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_LAUNCHER;
            gameevent.active = true;
            sendGameEvent( gameevent );
            break;
        default:
            break;
    }
};

Game.prototype.setPlayerName = function( str )
{
    this.gamescore.setName( str );
};

Game.prototype.keyPressEvent = function( event )
{
    if( this.hud.keyPressEvent( event ) )
    {
        return;
    }
};

Game.prototype.keyUpEvent = function( event )
{
    if( this.hud.keyUpEvent( event ) )
    {
        return;
    }
    
    switch( event.keyCode )
    {
        case KEY_ALT :
        case KEY_B :
        case KEY_M :
        case KEY_RIGHTWIN :
        case KEY_RIGHT :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_PEDAL_RIGHT;
            gameevent.active = false;
            sendGameEvent( gameevent );
            break;
        case KEY_CONTROL :
        case KEY_A :
        case KEY_N :
        case KEY_LEFTWIN :
        case KEY_LEFT :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_PEDAL_LEFT;
            gameevent.active = false;
            sendGameEvent( gameevent );
            break;
        case KEY_DOWN :
            var gameevent = new GameEvent();
            gameevent.type = INPUT_LAUNCHER;
            gameevent.active = false;
            sendGameEvent( gameevent );
            break;
        default:
            break;
    }
};
