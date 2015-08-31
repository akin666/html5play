
function UIArea( width , height )
{
    UIComponent.call(this);
    
    this.items = new PIXI.DisplayObjectContainer();
    
    this.items.setInteractive(true);
    
    // items is a child container..
    this.group.addChild( this.items );
    
    this.graphicsMask = new PIXI.Graphics();
    this.group.mask = this.graphicsMask;
 
    // without adding the mask, the mask doesnt really work.
    this.group.addChild( this.graphicsMask );
    
    this.size = new PIXI.Point( width , height );
    this.applySize();
    
    this.isDragging = false;
    this.dragStart = new PIXI.Point( 0 , 0 );
    this.originalPosition = new PIXI.Point( 0 , 0 );
};

UIArea.prototype = new UIComponent();
UIArea.prototype.constructor = UIArea;

UIArea.prototype.organize = function()
{
};

UIArea.prototype.applySize = function()
{
    if( this.group.hitArea === undefined || this.group.hitArea === null )
    {
        this.group.hitArea = new PIXI.Rectangle( -this.size.x/2 , 0 , this.size.x , this.size.y );
    }
    this.group.hitArea.x = -this.size.x/2;
    this.group.hitArea.y = 0;
    this.group.hitArea.width = this.size.x;
    this.group.hitArea.height = this.size.y;
    
    this.graphicsMask.lineStyle(0);
    this.graphicsMask.clear();
    this.graphicsMask.beginFill(0x8bc5ff, 1.0);
    this.graphicsMask.drawRect( this.group.hitArea.x , this.group.hitArea.y , this.group.hitArea.width , this.group.hitArea.height );
    this.graphicsMask.endFill();
};

UIArea.prototype.getBounds = function()
{
    return this.bounds;
};

UIArea.prototype.setBounds = function( rectangle )
{
    this.bounds = rectangle;
    this.size.x = rectangle.width;
    this.size.y = rectangle.height;
    this.applySize();
};

UIArea.prototype.setEnable = function( state )
{
    this.isEnable = state;
    updateLook();
};

UIArea.prototype.getChildContainer = function()
{
    return this.items;
};

UIArea.prototype.updateLook = function()
{
};

UIArea.prototype.mousedown = function( data )
{
    this.isDragging = true;
    var point = data.getLocalPosition( this.group );
    
    this.dragStart.x = point.x;
    this.dragStart.y = point.y;
    
    this.originalPosition.x = this.items.position.x;
    this.originalPosition.y = this.items.position.y;
};

UIArea.prototype.mouseup = function( data , outside )
{
    this.isDragging = false;
};

UIArea.prototype.mousemove = function( data )
{
    if( !this.isDragging )
    {
        return;
    }
    
    var point = data.getLocalPosition( this.group );
    this.items.position.x = this.originalPosition.x + ( point.x - this.dragStart.x);
    this.items.position.y = this.originalPosition.y + ( point.y - this.dragStart.y );
};

UIArea.prototype.mouseout = function( data )
{
    this.isDragging = false;
};
