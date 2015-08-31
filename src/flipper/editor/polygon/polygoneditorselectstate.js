
function PolygonEditorSelect( polygoneditor )
{
    this.polygoneditor = polygoneditor;
    
    this.onActivate = null;
    this.onDeactivate = null;
}

PolygonEditorSelect.prototype.resetInput = function( point )
{
};

PolygonEditorSelect.prototype.click = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    
    var found = [];
    var equalityIndex = -1;
    for( var i = 0 ; i < that.polygons.length ; ++i )
    {
        if( polygonHitTest( point , that.polygons[i].points ) )
        {
            if( that.current === that.polygons[i] )
            {
                // no -1 needed, the poly will be pushed on next..
                equalityIndex = found.length;
            }
            found.push( that.polygons[i] );
        }
    }
    
    // nothing.
    if( found.length <= 0 )
    {
        that.currentIndex = -1;
        that.current = null;
        return;
    }
    
    var selectedIndex = 0;
    
    // Equality found, something is selected in the stack
    if( equalityIndex !== -1 )
    {
        // select "next"
        selectedIndex = equalityIndex + 1;
    }
    
    // make the selectedindex circular
    selectedIndex %= found.length;
    
    that.currentIndex = selectedIndex;
    that.current = found[ selectedIndex ];
};

PolygonEditorSelect.prototype.mousemove = function( point )
{
};

PolygonEditorSelect.prototype.mousedown = function( point )
{
};

PolygonEditorSelect.prototype.mouseup = function( point )
{
};

PolygonEditorSelect.prototype.mouseupoutside = function( point )
{
};

PolygonEditorSelect.prototype.mouseover = function( point )
{
};

PolygonEditorSelect.prototype.mouseout = function( point )
{
};

PolygonEditorSelect.prototype.keyDownEvent = function( data )
{
};

PolygonEditorSelect.prototype.keyPressEvent = function( data )
{
};

PolygonEditorSelect.prototype.keyUpEvent = function( data )
{
};
