
function GameCamera( world , container )
{
    this.world = world;
    this.container = container;
    
    this.worldSize = new PIXI.Point( this.world.getWidth() , this.world.getHeight() );
    this.position = new PIXI.Point( this.worldSize.x / 2 , this.worldSize.y / 2 );
    this.realPosition = new PIXI.Point( this.position.x , this.position.y );
    
    this.topLeft = new PIXI.Point( this.realPosition.x - SCREEN.width / 2 , this.realPosition.y - SCREEN.width / 2 );
    this.bottomRight = new PIXI.Point( this.realPosition.x + SCREEN.width / 2 , this.realPosition.y + SCREEN.width / 2 );
    
    this.zoomLevel = 1.0;
    
    this.target = null;
    this.tmpPoint = new PIXI.Point( 0 , 0 );
    
    this.screenMin = SCREEN.width > SCREEN.height ? SCREEN.height : SCREEN.width;
    this.closeDistance = (this.screenMin) / 2 - 100;
    
    if( this.closeDistance < 100 )
    {
        this.closeDistance = 100;
    }
    
    this.moveTo( this.position );
}

GameCamera.prototype.destruct = function()
{
};

GameCamera.prototype.setTarget = function( target )
{
    this.target = target;
};

GameCamera.prototype.getTarget = function()
{
    return this.target;
};

GameCamera.prototype.calculatePosition = function( zoomLevel )
{
    
    return this.target;
};

GameCamera.prototype.zoomTo = function( zoomLevel )
{
    this.zoomLevel = zoomLevel;
    TweenLite.to( 
            this.container.scale, 
            BASE_TRANSITION_TIME, 
            {
                x:zoomLevel,
                y:zoomLevel
            } );
    
    this.applyMove( BASE_TRANSITION_TIME );
};

GameCamera.prototype.moveTo = function( position )
{
    this.position.x = position.x;
    this.position.y = position.y;
    
    this.applyMove( BASE_TRANSITION_TIME );
};

GameCamera.prototype.applyMove = function( transitiontime )
{
    var invZoom = 1.0 / this.zoomLevel;
    
    // half width and half height
    var screenw = (SCREEN.width * invZoom) / 2;
    var screenh = (SCREEN.height * invZoom) / 2;
    
    this.realPosition.x = this.position.x;
    this.realPosition.y = this.position.y;
    
    this.topLeft.x = this.realPosition.x - screenw;
    this.topLeft.y = this.realPosition.y - screenh;
    
    this.bottomRight.x = this.realPosition.x + screenw;
    this.bottomRight.y = this.realPosition.y + screenh;
    
    var right_max = RIGHT_MAX * invZoom;
    var left_max = LEFT_MAX * invZoom; 
    var top_max = TOP_MAX * invZoom;
    var bottom_max = BOTTOM_MAX * invZoom;
    
    // level corners..
    // Take into account safezone restrictions..
    if( this.bottomRight.x > this.worldSize.x + right_max )
    {
        this.realPosition.x = this.worldSize.x - screenw - right_max;
        
        this.topLeft.x = this.realPosition.x - screenw;
        this.bottomRight.x = this.realPosition.x + screenw;
    }
    if( this.topLeft.x < -left_max )
    {
        this.realPosition.x = screenw + left_max;
        
        this.topLeft.x = this.realPosition.x - screenw;
        this.bottomRight.x = this.realPosition.x + screenw;
    }
    
    if( this.bottomRight.y > this.worldSize.y + bottom_max )
    {
        this.realPosition.y = this.worldSize.y - screenh - bottom_max;
        
        this.topLeft.y = this.realPosition.y - screenh;
        this.bottomRight.y = this.realPosition.y + screenh;
    }
    if( this.topLeft.y < -top_max )
    {
        this.realPosition.y = screenh / 2 - top_max;
        
        this.topLeft.y = this.realPosition.y - screenh;
        this.bottomRight.y = this.realPosition.y + screenh;
    }
    
    // Camera emulation..
    TweenLite.to( 
            this.container.position, 
            transitiontime, 
            { 
                x: -this.topLeft.x * this.zoomLevel , 
                y: -this.topLeft.y * this.zoomLevel
            } );
};

GameCamera.prototype.update = function( ms )
{
    // follow an object
    if( this.target !== null )
    {
        var pos = this.target.getPosition();
        var distance = dist( pos , this.position ) * this.zoomLevel;

        if( distance > this.closeDistance )
        {
            this.moveTo( pos );
        }
    }
};
