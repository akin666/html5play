
function PolygonEditorDraw( polygoneditor )
{
    this.polygoneditor = polygoneditor;
    
    this.onActivate = null;
    this.onDeactivate = null;
    
    this.mouseActive = false;
    
    this.closeIndex = 0;
    this.selectedLineIndex = -1;
    this.selectedI1 = -1;
    this.selectedI2 = -1;
    
    this.editPointIndex = -1;
}

PolygonEditorDraw.prototype.resetInput = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    this.mouseActive = false;
    
    that.graphics.clear();
};

PolygonEditorDraw.prototype.click = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    
    if( that.current === null )
    {
        return;
    }
    
    // in editpoint?
    if( this.editPointIndex !== -1 )
    {
        this.editPointIndex = -1;
        return;
    }
    
    // Is it within edit distance? if so, then we dont do anything for click
    for( var i = 0 ; i < that.current.points.length ; ++i )
    {
        var cpoint = that.current.points[i];
        if(  dist( point , cpoint ) < that.pointRadius )
        {
            return;
        }
    }
    
    // add point..
    // push the point into a certain index position..
    if( that.current.points.length < 2 || this.selectedLineIndex === -1 )
    {
        that.current.points.push( point );
    }
    else
    {
        that.current.points.splice( this.selectedLineIndex + 1 , 0, point );
    }
};

PolygonEditorDraw.prototype.mousemove = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    
    if( that.current === null )
    {
        return;
    }
    
    that.graphics.clear();
    
    if( this.mouseActive )
    {
        if( this.editPointIndex !== -1 )
        {
            // we are in editpoint.. 
            that.current.points[ this.editPointIndex ] = point;
            drawLineV( that.current.points[this.selectedI1] , that.current.points[ this.editPointIndex ] , that.current.points[this.selectedI2] , 1.0 , 0xFFFF00 , 1.0 , that.graphics );
        }
        else
        {
            // Draw addpoint emulation
            if( that.current.points.length > 1 )
            {
                drawLineV( that.current.points[this.selectedI1] , point , that.current.points[this.selectedI2] , 1.0 , 0xFFFF00 , 1.0 , that.graphics );
            }
        }
    }
    else
    {
        // Draw selection of closest line.
        this.closeIndex = findClosestLine( point , that.current.points );
        
        drawPolygonLineIndex( 0xFF3333 , 0.7 , 3 , that.current , this.closeIndex , that.graphics );
    }
};

PolygonEditorDraw.prototype.mousedown = function( point )
{
    // we need to refer to the editor some simple way..
    var that = this.polygoneditor;
    
    this.mouseActive = true;
    
    if( that.current === null )
    {
        return;
    }
    
    // Now we must select what "drawmode".
    // If we go to editpoint, we select a vertex
    this.editPointIndex = -1;
    for( var i = 0 ; i < that.current.points.length ; ++i )
    {
        var cpoint = that.current.points[i];
        if( dist( point , cpoint ) < that.pointRadius )
        {
            this.editPointIndex = i;
            
            // reusing selected..
            this.selectedI1 = modulo( this.editPointIndex - 1 , that.current.points.length );
            this.selectedI2 = modulo( this.editPointIndex + 1 , that.current.points.length );
            
            return;
        }
    }
    
    // If we go to "draw new vertex" we select a line
    this.selectedLineIndex = findClosestLine( point , that.current.points );
    
    this.selectedI1 = modulo( this.selectedLineIndex , that.current.points.length );
    this.selectedI2 = modulo( this.selectedI1 + 1 , that.current.points.length );
};

PolygonEditorDraw.prototype.mouseup = function( point )
{
    this.mouseActive = false;
};

PolygonEditorDraw.prototype.mouseupoutside = function( point )
{
    this.mouseActive = false;
};

PolygonEditorDraw.prototype.mouseover = function( point )
{
};

PolygonEditorDraw.prototype.mouseout = function( point )
{
};

PolygonEditorDraw.prototype.keyDownEvent = function( data )
{
};

PolygonEditorDraw.prototype.keyPressEvent = function( data )
{
};

PolygonEditorDraw.prototype.keyUpEvent = function( data )
{
};
