
var NULL_EVENT = 0;
var RETRY_BALL = 1;
var LOOSE_BALL = 2;
var BUMPER_HIT = 3;
var LAUNCHER_START = 4;
var LAUNCHER_END = 5;
var EXTRA_POINTS_AREA_START = 6;
var EXTRA_POINTS_AREA_END = 7;
var WALL_HIT = 8;
var PEDAL_ACTIVATE = 9;
var PEDAL_DEACTIVATE = 10;
var PEDAL_HIT = 11;
var HIGH_SCORE = 12;
var SCORE_POINTS = 13;
var BALL_COUNT = 14;
var SCORE_MODIFIER = 15;
var COIN_PICKUP = 16;
var BONUS_PICKUP = 17;
var BONUS_END = 18;
var BALL_LAUNCHED = 19;

// Scoring thingys
var SCORELIST_UPDATED = 99;

// special
var GAME_START = 128;
var GAME_OVER = 129;

// input types
var INPUT_PEDAL_LEFT = 256;
var INPUT_PEDAL_RIGHT = 257;
var INPUT_LAUNCHER = 258;

function GameEvent()
{
    this.type = 0;
    this.active = false;
    this.number = 0;
}

GameEvent.prototype.setTarget = function( target )
{
};

function eventTypesString()
{
    return "pedal_left, " + "pedal_right, " + "launcher.";
}

function translateEventFromString( str )
{
    switch( str )
    {
        case "pedal_left" : 
            return INPUT_PEDAL_LEFT;
        case "pedal_right" : 
            return INPUT_PEDAL_RIGHT;
        case "launcher" : 
            return INPUT_LAUNCHER;
    }
    return NULL_EVENT;
};

function translateEventFromKey( key )
{
    switch( key )
    {
        case INPUT_PEDAL_LEFT : 
            return "pedal_left";
        case INPUT_PEDAL_RIGHT : 
            return "pedal_right";
        case INPUT_LAUNCHER : 
            return "launcher";
        case NULL_EVENT : 
            return "";
    }
    return "";
};
