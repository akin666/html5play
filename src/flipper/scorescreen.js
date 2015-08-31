
function ScoreScreen( gamescore , parent )
{
    this.score = gamescore;
    this.container = parent;
    this.group = new PIXI.DisplayObjectContainer();
    
    this.group.position.x = SCREEN.width / 2;
    this.group.position.y = SCREEN.height / 2;
    
    // generate list
    var list = this.score.getScoreList();
    var highscorelist = "";
    for( var i = 0 ; i < list.length ; ++i )
    {
        highscorelist += (i+1) + ". " + list[i].score + " - " + list[i].name + "\n";
    }
    
    this.levelnamepre = "Level: ";
    this.levelname = new PIXI.BitmapText( this.levelnamepre + this.score.getLevelName() , {font: "24px Unibody", align: "center"});
    this.yourscore = new PIXI.BitmapText( this.score.getName() + ": " + this.score.getScore() , {font: "20px Unibody", align: "center"});
    this.scorelist = new PIXI.BitmapText( highscorelist , {font: "18px Unibody", align: "center"});
    
    this.group.addChild( this.levelname );
    this.group.addChild( this.yourscore );
    this.group.addChild( this.scorelist );
    
    var xoff = -85;
    this.levelname.position.x = xoff;
    this.yourscore.position.x = xoff;
    this.scorelist.position.x = xoff;
    
    var yoff = -200;
    this.levelname.position.y = yoff + 50;
    this.yourscore.position.y = yoff + 80;
    this.scorelist.position.y = yoff + 110;
    
    this.group.alpha = 0;
    this.container.addChild( this.group );
};

ScoreScreen.prototype.destruct = function()
{
    if( this.container !== null )
    {
        this.container.removeChild( this.group );
        this.container = null;
    }
};

ScoreScreen.prototype.fadeOut = function()
{
    TweenLite.to( this.group , BASE_TRANSITION_TIME , {alpha: 0} );
};

ScoreScreen.prototype.fadeIn = function()
{
    TweenLite.to( this.group , BASE_TRANSITION_TIME , {alpha: 1} );
};

ScoreScreen.prototype.gameEvent = function( event )
{
    switch( event.type )
    {
        case SCORELIST_UPDATED :
            var list = this.score.getScoreList();
            var highscorelist = "";
            for( var i = 0 ; i < list.length ; ++i )
            {
                highscorelist += (i+1) + ". " + list[i].score + " - " + list[i].name + "\n";
            }
            this.scorelist.setText( highscorelist );
            
            break;
        default:
            break;
    }
};