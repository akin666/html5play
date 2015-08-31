
function PolygonEditorDelete( polygoneditor )
{
    this.polygoneditor = polygoneditor;
    
    this.onActivate = null;
    this.onDeactivate = null;
}

PolygonEditorDelete.prototype.resetInput = function( point )
{
};

PolygonEditorDelete.prototype.click = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    
    if( that.current === null )
    {
        return;
    }
    
    // Is it within edit distance? if so, then we delete it.
    for( var i = that.current.points.length - 1 ; i >= 0; --i )
    {
        var cpoint = that.current.points[i];
        if(  dist( point , cpoint ) < that.pointRadius )
        {
            that.current.points.splice( i, 1 );
        }
    }
};

PolygonEditorDelete.prototype.mousemove = function( point )
{
};

PolygonEditorDelete.prototype.mousedown = function( point )
{
};

PolygonEditorDelete.prototype.mouseup = function( point )
{
};

PolygonEditorDelete.prototype.mouseupoutside = function( point )
{
};

PolygonEditorDelete.prototype.mouseover = function( point )
{
};

PolygonEditorDelete.prototype.mouseout = function( point )
{
};

PolygonEditorDelete.prototype.keyDownEvent = function( data )
{
};

PolygonEditorDelete.prototype.keyPressEvent = function( data )
{
};

PolygonEditorDelete.prototype.keyUpEvent = function( data )
{
};