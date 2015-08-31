
function EditorBackground()
{
    this.group = new PIXI.DisplayObjectContainer();
    
    this.graphics = new PIXI.Graphics();
    
    // setup group
    this.group.addChild( this.graphics );
}

EditorBackground.prototype.setup = function( color , width , height )
{
    var rectangle = new PIXI.Rectangle( 0 , 0 , width , height );
    this.graphics.hitArea = rectangle;
    
    this.graphics.clear();
    this.graphics.beginFill( color , 1.0 );
    this.graphics.drawRect( 0 , 0 , width , height );
    this.graphics.endFill();
};

EditorBackground.prototype.getContainer = function()
{
    return this.group;
};
