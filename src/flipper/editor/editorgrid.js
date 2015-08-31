
function EditorGrid()
{
    this.group = new PIXI.DisplayObjectContainer();
    
    this.graphics = new PIXI.Graphics();
    
    // setup group
    this.group.addChild( this.graphics );
}

EditorGrid.prototype.drawDimensionIndicator = function( x , y , size , linewidth )
{
    this.graphics.clear();
    
    var alpha = 0.75;
    var RED = 0xFF0000;
    var GREEN = 0x00FF00;
    var BLUE = 0x0000FF;
    
    var sDiff = size / 10;
    var lDiff = size / 5;
    
    this.graphics.lineStyle( linewidth , GREEN , alpha );
    this.graphics.moveTo( x , y );
    this.graphics.lineTo( x , y + size );
    this.graphics.lineTo( x - sDiff , y + size - lDiff );
    this.graphics.moveTo( x , y + size );
    this.graphics.lineTo( x + sDiff , y + size - lDiff );
    
    this.graphics.lineStyle( linewidth , RED , alpha );
    this.graphics.moveTo( x , y );
    this.graphics.lineTo( x + size , y );
    this.graphics.lineTo( x + size - lDiff , y - sDiff );
    this.graphics.moveTo( x + size , y );
    this.graphics.lineTo( x + size - lDiff , y + sDiff );
};

EditorGrid.prototype.setup = function( color , jumpWidth , jumpHeight , width , height )
{
    this.graphics.clear();
    
    this.drawDimensionIndicator( 15 , 15 , 60 , 2 );
    
    var alpha = 0.35;
    var alpha2 = 0.25;

    var i = 0;
    for( var x = 0 ; x < width ; x += jumpWidth , ++i )
    {
        this.graphics.lineStyle( 1 , color , ( i % 2 == 0 ? alpha2 : alpha ) );
        this.graphics.moveTo( x , 0 );
        this.graphics.lineTo( x , height );
    }
    i = 0;
    for( var y = 0 ; y < height ; y += jumpHeight , ++i )
    {
        this.graphics.lineStyle( 1 , color , ( i % 2 == 0 ? alpha2 : alpha ) );
        this.graphics.moveTo( 0 , y );
        this.graphics.lineTo( width , y );
    }
};

EditorGrid.prototype.getContainer = function()
{
    return this.group;
};