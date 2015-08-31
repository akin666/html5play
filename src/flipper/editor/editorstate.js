
function EditorState()
{
    this.group = new PIXI.DisplayObjectContainer();
    this.toolGroup = new PIXI.DisplayObjectContainer();
    
    this.graphics = new PIXI.Graphics();
    this.temporaryGraphics = new PIXI.Graphics();
    
    // The "action button" that controls the "showing" of this state..
    // TODO, remove this blashemy
    this.parentControlButton = null;
    
    // setup group
    this.group.addChild( this.graphics );
    this.group.addChild( this.temporaryGraphics );
    
    this.group.alpha = DEFAULT_ALPHA;
}

EditorState.prototype.getContainer = function()
{
    return this.group;
};

EditorState.prototype.click = function( data )
{
};

EditorState.prototype.mousedown = function( data )
{
};

EditorState.prototype.mouseup = function( data )
{
};

EditorState.prototype.mouseupoutside = function( data )
{
};

EditorState.prototype.mouseover = function( data )
{
};

EditorState.prototype.mouseout = function( data )
{
};

EditorState.prototype.mousemove = function( data )
{
};

EditorState.prototype.keyDownEvent = function( data )
{
};

EditorState.prototype.keyPressEvent = function( data )
{
};

EditorState.prototype.keyUpEvent = function( data )
{
};

EditorState.prototype.getName = function()
{
    return "";
};

EditorState.prototype.save = function()
{
    return null;
};

EditorState.prototype.load = function( data )
{
};