
var POLYGONEDITOR_EDIT_DISTANCE = 10;

function PolygonEditor( graphics )
{
    // full of PIXI.Polygons
    this.polygons = [];
    this.current = null;
    this.currentIndex = -1;
    this.graphics = graphics;
    
    this.pointRadius = POLYGONEDITOR_EDIT_DISTANCE;
    
    this.stateSelect = new PolygonEditorSelect( this );
    this.stateDraw = new PolygonEditorDraw( this );
    this.stateDelete = new PolygonEditorDelete( this );
    this.state = null;
    
    this.changeMode( "draw" );
}

PolygonEditor.prototype.cleanUp = function()
{
    var min = 3;
    if( this.current !== null && this.current.points.length < min )
    {
        this.currentIndex = -1;
        this.current = null;
    }
    // must go backwards, if we dont, the indexes gets messed up
    for( var i = this.polygons.length - 1 ; i >= 0; --i )
    {
        if( this.polygons[i].points.length < min )
        {
            this.polygons.splice( i, 1 );
        }
    }
};

PolygonEditor.prototype.getCurrentIndex = function()
{
    return this.currentIndex;
}

PolygonEditor.prototype.push = function( polygon )
{
    this.polygons.push( polygon );
};

PolygonEditor.prototype.newPolygon = function()
{
    this.cleanUp();
    this.current = new PIXI.Polygon();
    this.currentIndex = this.polygons.length;
    this.polygons.push( this.current );
    this.changeMode( this.stateDraw );
};

PolygonEditor.prototype.changeMode = function( mode )
{
    var toState = this.stateSelect;
    if( isString( mode ) )
    {
        if( mode === "select" )
        {
            toState = this.stateSelect;
        }
        else if( mode === "draw" )
        {
            toState = this.stateDraw;
        }
        else if( mode === "delete" )
        {
            toState = this.stateDelete;
        }
    }
    else
    {
        toState = mode;
    }
    
    if( this.state === toState )
    {
        return;
    }
    
    if( this.state !== null )
    {
        // Call for deactivations
        if( this.state.onDeactivate !== null )
        {
            this.state.onDeactivate();
        }
        this.state.resetInput();
    }
    
    this.state = toState;
    
    if( this.state !== null )
    {
        if( this.state.onActivate !== null )
        {
            this.state.onActivate();
        }
    }
};

PolygonEditor.prototype.click = function( position )
{
    this.state.click( position );
};

PolygonEditor.prototype.mousemove = function( position )
{
    this.state.mousemove( position );
};

PolygonEditor.prototype.mousedown = function( position )
{
    this.state.mousedown( position );
};

PolygonEditor.prototype.mouseup = function( position )
{
    this.state.mouseup( position );
};

PolygonEditor.prototype.mouseupoutside = function( position )
{
    this.state.mouseupoutside( position );
};

PolygonEditor.prototype.mouseover = function( position )
{
    this.state.mouseover( position );
};

PolygonEditor.prototype.mouseout = function( position )
{
    this.state.mouseout( position );
};

PolygonEditor.prototype.keyDownEvent = function( data )
{
    this.state.keyDownEvent( data );
};

PolygonEditor.prototype.keyPressEvent = function( data )
{
    this.state.keyPressEvent( data );
};

PolygonEditor.prototype.keyUpEvent = function( data )
{
    this.state.keyUpEvent( data );
};

