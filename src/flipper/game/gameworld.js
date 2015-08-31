
function GameWorld( gamephysics , gamescore , container , eventmanager )
{
    this.staticGroup = new PIXI.DisplayObjectContainer();
    this.dynamicGroup = new PIXI.DisplayObjectContainer();
    this.ballGroup = new PIXI.DisplayObjectContainer();
    this.spriteGroup = new PIXI.DisplayObjectContainer();
    
    this.gamephysics = gamephysics;
    this.container = container;
    this.eventmanager = eventmanager;
    this.gamescore = gamescore;
    
    this.sprite = new SpriteWorld( this.spriteGroup );
    
    this.container.addChild( this.staticGroup );
    this.container.addChild( this.dynamicGroup );
    this.container.addChild( this.ballGroup );
    this.container.addChild( this.spriteGroup );
    
    this.proposedZoom = 1.0;
    
    this.factory = new ItemFactory();
    
    this.camera = null;
    this.wall = null;
    this.graphics = null;
    this.size = new PIXI.Point( 0 , 0 );
    
    this.area = [];
    
    this.isReady = 0;
    this.items = [];
    this.balls = [];
    
    this.killObjects = [];
    
    var that = this;
    this.factory.loadComplete = function() {
        that.isReady--;
    };
    
    this.isReady++;
    this.factory.preload();
}

GameWorld.prototype.destruct = function()
{
    if( this.wall !== null )
    {
        this.wall.destruct();
        this.wall = null;
    }
    if( this.graphics !== null )
    {
        this.staticGroup.removeChild( this.graphics );
        this.graphics = null;
    }
    if( this.container !== null )
    {
        this.container.removeChild( this.staticGroup );
        this.container.removeChild( this.dynamicGroup );
        this.container.removeChild( this.ballGroup );
        this.container.removeChild( this.spriteGroup );
        this.container = null;
    }
    
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        this.items[i].destruct();
    }
    this.items = [];
    
    for( var i = 0 ; i < this.area.length ; ++i )
    {
        this.area[i].destruct();
    }
    this.area = [];
};

GameWorld.prototype.reset = function()
{
    if( this.wall !== null )
    {
        this.wall.destruct();
        this.wall = null;
    }
    
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        this.items[i].destruct();
    }
    this.items = [];
    for( var i = 0 ; i < this.balls.length ; ++i )
    {
        this.balls[i].destruct();
    }
    this.balls = [];
    for( var i = 0 ; i < this.area.length ; ++i )
    {
        this.area[i].destruct();
    }
    this.area = [];
};

GameWorld.prototype.ready = function()
{
    return this.isReady == 0;
};

GameWorld.prototype.start = function()
{
};

GameWorld.prototype.stop = function()
{
};

GameWorld.prototype.setupCamera = function()
{
    if( this.camera !== null )
    {
        this.camera.destruct();
        this.camera = null;
    }
    this.camera = new GameCamera( this , this.container );
};

GameWorld.prototype.setupWalls = function( polydata )
{
    if( this.wall !== null )
    {
        this.wall.destruct();
        this.wall = null;
    }
    
    this.wall = new WallObject( this.gamephysics , this , polydata );
};

GameWorld.prototype.setupInfo = function( bgdata )
{
    var path = bgdata.path;
    var offset = bgdata.offset;
    
    this.size.x = bgdata.size.x;
    this.size.y = bgdata.size.y;

    if( this.graphics !== null )
    {
        this.staticGroup.removeChild( this.graphics );
        this.graphics = null;
    }
    if( path === null || path === "" )
    {
        return;
    }
    
    // Setup score/info/stats object..
    this.gamescore.setPoints( 0 );
    this.gamescore.setPointsModifier( 0 );
    if( bgdata.balls !== undefined && bgdata.balls !== null )
    {
        this.gamescore.setBallCount( bgdata.balls );
    }
    else
    {
        this.gamescore.setBallCount( 10 );
    }
    /*
    // set highscore from leveldata.
    if( bgdata.highscore !== undefined && bgdata.highscore !== null )
    {
        this.gamescore.setHighscore( bgdata.highscore );
    }
    else
    {
        this.gamescore.setHighscore( 1000 );
    }
    */
    if( bgdata.name !== undefined && bgdata.name !== null )
    {
        this.gamescore.setLevelName( bgdata.name );
    }
    else
    {
        this.gamescore.setLevelName( "anon" );
    }
    
    this.isReady++;
    var bgpath = path;
    var bgoffset = offset;
    var assetsToLoader = [ bgpath ];
    
    // music playback
    if( bgdata.music !== undefined && bgdata.music !== null && bgdata.music !== "" )
    {
        AUDIOMANAGER.setMusic( bgdata.music );
    }

    // create a new loader
    var loader = new PIXI.AssetLoader( assetsToLoader );
    var that = this;
    
    loader.onComplete = function() {
        try {
            that.graphics = PIXI.Sprite.fromImage( bgpath );

            if( that.graphics === null )
            {
                LOG.error( "Failed to load image. " + bgpath );
                return;
            }

            that.graphics.position = bgoffset;
            that.staticGroup.addChild( that.graphics );
            
            that.isReady--;
        }
        catch( e )
        {
            LOG.error("Failed to load GameStaticWorld background graphics, this is commonly caused by security exception.\n" + 
                      "Javascript standard doesnt allow reading pictures from local machine, thus security exception.\n\n" + e.message );
            return;
        }
    };
    
    loader.load();
};

GameWorld.prototype.setupAreas = function( data )
{
    for( var i = 0 ; i < this.area.length ; ++i )
    {
        this.area[i].destruct();
    }
    this.area = [];
    
    var arr = data.data;
    if( arr === undefined || arr === null )
    {
        return;
    }
    
    for( var i = 0 ; i < arr.length ; ++i )
    {
        var object = arr[i];
        
        this.area.push( new AreaObject( this.gamephysics , this , object ) );
    }
};

GameWorld.prototype.setupItems = function( itemdata )
{
    this.isReady++;
    var itemarray = itemdata.items;
    
    // destruct "loaded" items..
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        this.items[i].destruct();
    }
    this.items = [];
    
    for( var i = 0 ; i < itemarray.length ; ++i )
    {
        var item = itemarray[i];
        var newitem = this.factory.create( item.type , this.gamephysics , this , item , this.eventmanager );
        this.items.push( newitem );
    }
    this.isReady--;
};

GameWorld.prototype.finalize = function()
{
    this.setupCamera();
    
    // Zoom out, according to screen size..
    var mindistance = SCREEN.width < SCREEN.height ? SCREEN.width : SCREEN.height;
    var maxdistance = SCREEN.width > SCREEN.height ? SCREEN.width : SCREEN.height;
    
    // Certain objects are pixelsized.. like the ball..
    if( mindistance < 1000 )
    {
        this.proposedZoom = mindistance / 1000;
    }
    
    if( this.camera !== null )
    {
        this.camera.zoomTo( this.proposedZoom );
    }
};

GameWorld.prototype.getContainerFor = function( type )
{
    if( type === "ball" )
    {
        return this.ballGroup;
    }
    else if( type === "wall" )
    {
        return this.staticGroup;
    }
    return this.dynamicGroup;
};

GameWorld.prototype.getWidth = function()
{
    return this.size.x;
};

GameWorld.prototype.getHeight = function()
{
    return this.size.y;
};

GameWorld.prototype.update = function( ms )
{
    for( var i = 0 ; i < this.items.length ; ++i )
    {
        this.items[i].update( ms );
    }
    for( var i = 0 ; i < this.balls.length ; ++i )
    {
        this.balls[i].update( ms );
    }
    
    // destroy invisible objects..
    // update still lingering objects.
    for( var i = this.killObjects.length - 1 ; i >= 0; --i )
    {
        var gameobject = this.killObjects[i];
        if( !gameobject.isVisible() )
        {
            this.killObjects.splice( i, 1 );
            gameobject.destruct();
        }
        else
        {
            gameobject.update( ms );
        }
    }
    
    this.sprite.update( ms );
    
    if( this.camera !== null )
    {
        this.camera.update( ms );
    }
};

GameWorld.prototype.createBall = function( data )
{
    // only 1 ball at a time alive.
    if( this.gamescore.getAliveCount() > 0 )
    {
        return null;
    }
    
    if( !this.gamescore.removeBall( 1 ) )
    {
        return null;
    }
    
    this.gamescore.addAlive( 1 );
    var ball = this.factory.create( "ball" , this.gamephysics , this , data , this.eventmanager );
    this.balls.push( ball );
    ball.alive = true;
    
    if( this.camera !== null )
    {
        this.camera.setTarget( ball );
    }
    
    return ball;
};

GameWorld.prototype.destroyBall = function( ball )
{
    ball.fadeOut( BASE_TRANSITION_TIME );
    ball.alive = false;
    
    this.gamescore.removeAlive( 1 );
    
    // take out of ball list..
    for( var i = 0 ; i < this.balls.length ; ++i )
    {
        if( this.balls[i] === ball )
        {
            this.balls.splice( i, 1 );
            break;
        }
    }
    
    if( this.camera !== null && this.camera.getTarget() === ball )
    {
        this.camera.setTarget( null );
    }
    
    this.killObjects.push( ball );
};

GameWorld.prototype.getSpriteWorld = function()
{
    return this.sprite;
};