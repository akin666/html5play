
function ScoreItem( score , name )
{
    this.score = score;
    this.name = name;
}

function GameScore()
{
    this.name = "anonymous";
    this.current = 0;
    this.max = 0;
    
    this.levelName = "anon";
    this.highSent = false;
    
    this.version = 0;
    this.ballsAlive = 0;
    
    this.scoreList = [];
    
    this.pointsModifier = 0;
    this.ballCount = 0;
    this.ballCountMax = 0;
    this.ballRemaining = 0;
    
    this.serverConnection = new Communicator( SERVER_CONNECTION );
    
    var that = this;
    this.serverConnection.onComplete = function( code , data )
    {
        var data = JSON.parse( data );
        if( data === undefined || data === null || data.status === undefined || data.status !== "ok" )
        {
            return;
        }
        
        for( var i = 0 ; i < data.msg.length ; ++i )
        {
            LOG.print( "" + i + " server: " + data.msg[i] );
        }
        
        that.updateScoreList( data.data );
    }
    
    //We dont have levelname yet..
    //this.updateFromServer();
}

GameScore.prototype.setLevelName = function( name )
{
    this.levelName = name;
    
    // bit of a hack.. but now we know the levelname.
    this.updateFromServer();
};

GameScore.prototype.getLevelName = function()
{
    return this.levelName;
};

GameScore.prototype.updateFromServer = function()
{
    var object = { 
        level: this.levelName
    };
    
    this.serverConnection.post( object );
};

GameScore.prototype.sendScoreToServer = function( name , score )
{
    var object = { 
        level: this.levelName,
        action: "addscore",
        name: name,
        score: score
    };
    
    this.serverConnection.post( object );
};

GameScore.prototype.updateScoreList = function( object )
{
    this.scoreList = [];
    if( object === undefined || object === null )
    {
        return;
    }
    
    this.scoreList = object;
    if( this.scoreList.length > 0 )
    {
        this.max = this.scoreList[0].score;
    }
    else
    {
        this.max = 0;
    }
    this.highSent = false;
    
    var gameevent = new GameEvent();
    gameevent.type = SCORELIST_UPDATED;
    sendGameEvent( gameevent );
};

GameScore.prototype.reset = function()
{
    this.version++;
    
    this.current = 0;
    this.pointsModifier = 0;
    this.ballCount = 0;
    this.ballCountMax = 0;
    this.ballRemaining = 0;
    this.highSent = false;
};

GameScore.prototype.getVersion = function()
{
    return this.version;
};

GameScore.prototype.setName = function( name )
{
    this.name = name;
};

GameScore.prototype.getName = function()
{
    return this.name;
};

GameScore.prototype.commitScore = function()
{
    this.sendScoreToServer( this.name , this.current );
};

GameScore.prototype.getScoreList = function()
{
    return this.scoreList;
};

GameScore.prototype.getBallCount = function()
{
    return this.ballCount;
};

GameScore.prototype.setBallCount = function( count )
{
    this.ballCount = count;
    this.ballCountMax = count;
    
    var gameevent = new GameEvent();
    gameevent.type = BALL_COUNT;
    sendGameEvent( gameevent );
};

GameScore.prototype.getMaxBallCount = function()
{
    return this.ballCountMax;
};

GameScore.prototype.addAlive = function( n )
{
    this.ballsAlive += n;
};

GameScore.prototype.removeAlive = function( n )
{
    this.ballsAlive -= n;
};

GameScore.prototype.getAliveCount = function()
{
    return this.ballsAlive;
};

GameScore.prototype.getScore = function()
{
    return this.current;
};

GameScore.prototype.addBall = function( number )
{
    this.ballCount += number;
    
    var gameevent = new GameEvent();
    gameevent.type = BALL_COUNT;
    sendGameEvent( gameevent );
};

GameScore.prototype.removeBall = function( number )
{
    if( this.ballCount - number < 0 )
    {
        return false;
    }
    
    this.ballCount -= number;
    
    var gameevent = new GameEvent();
    gameevent.type = BALL_COUNT;
    sendGameEvent( gameevent );
    
    return true;
};

GameScore.prototype.setPointsModifier = function( number )
{
    this.pointsModifier = number;
};

GameScore.prototype.addPointsModifier = function( number )
{
    this.pointsModifier += number;
    
    var gameevent = new GameEvent();
    gameevent.type = SCORE_MODIFIER;
    sendGameEvent( gameevent );
};

GameScore.prototype.removePointsModifier = function( number )
{
    this.pointsModifier -= number;
    
    var gameevent = new GameEvent();
    gameevent.type = SCORE_MODIFIER;
    sendGameEvent( gameevent );
};

GameScore.prototype.setPoints = function( number )
{
    this.current = number;
    
    var gameevent = new GameEvent();
    gameevent.type = SCORE_POINTS;
    sendGameEvent( gameevent );
};

GameScore.prototype.setHighscore = function( number )
{
    this.max = number;
};

GameScore.prototype.addPoints = function( number )
{
    this.current += (this.pointsModifier + 1) * number;
    
    var high = this.current > this.max;
    if( high )
    {
        this.max = this.current;
    }
    
    var gameevent = new GameEvent();
    gameevent.type = SCORE_POINTS;
    sendGameEvent( gameevent );
    
    if( high && !this.highSent )
    {
        this.highSent = true;
        var gameevent = new GameEvent();
        gameevent.type = HIGH_SCORE;
        sendGameEvent( gameevent );
    }
};

GameScore.prototype.removePoints = function( number )
{
    this.current -= (this.pointsModifier + 1) * number;
    
    var high = this.current > this.max;
    if( high )
    {
        this.max = this.current;
    }
    
    var gameevent = new GameEvent();
    gameevent.type = SCORE_POINTS;
    sendGameEvent( gameevent );
    
    if( high && !this.highSent )
    {
        this.highSent = true;
        var gameevent = new GameEvent();
        gameevent.type = HIGH_SCORE;
        sendGameEvent( gameevent );
    }
};

GameScore.prototype.getModifierText = function()
{
    if( this.pointsModifier === 0 )
    {
        return "";
    }
    return this.pointsModifier < 0 ? "Negative points!" : "Extra points! Times " + (1 + this.pointsModifier) + "!";
};
