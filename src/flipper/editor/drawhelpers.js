function drawPolygon( linecolor , alpha , linewidth , polygon , graphics )
{
    if( polygon === undefined || polygon === null )
    {
        LOG.error("Called drawhelpers with undefined/null polygon");
        return;
    }
    graphics.lineStyle( linewidth , linecolor , alpha );
    
    var points = polygon.points;
    if( points.length > 0 )
    {
        graphics.moveTo( points[0].x , points[0].y );
        for( var j = 1 ; j < points.length ; ++j )
        {
            graphics.lineTo( points[j].x , points[j].y );
        }
        graphics.lineTo( points[0].x , points[0].y );
    }
}

function drawVertexes( color , alpha , linewidth , radius , polygon , graphics )
{
    graphics.lineStyle( linewidth , color , alpha );
    
    if( polygon === undefined || polygon === null )
    {
        LOG.error("Called drawhelpers with undefined/null polygon");
        return;
    }
    
    var points = polygon.points;
    for( var j = 0 ; j < points.length ; ++j )
    {
        graphics.drawCircle( points[j].x , points[j].y , radius );
    }
}

function drawPolygonLineIndex( linecolor , alpha , linewidth , polygon , index , graphics )
{
    if( polygon === undefined || polygon === null )
    {
        LOG.error("Called drawhelpers with undefined/null polygon");
        return;
    }
    var points = polygon.points;
    if( points.length < 1 )
    {
        return;
    }
    graphics.lineStyle( linewidth , linecolor , alpha );
    
    var i1 = modulo( index , points.length );
    var i2 = modulo( i1 + 1 , points.length );
    
    graphics.moveTo( points[ i1 ].x , points[ i1 ].y );
    graphics.lineTo( points[ i2 ].x , points[ i2 ].y );
}

function drawLineV( pointa, pointb , pointc , linewidth , linecolor , alpha , graphics )
{
    graphics.lineStyle( linewidth , linecolor , alpha );
    
    graphics.moveTo( pointa.x , pointa.y );
    graphics.lineTo( pointb.x , pointb.y );
    graphics.lineTo( pointc.x , pointc.y );
}

function emulateAddPoint( point , linewidth , linecolor , alpha , polygon , graphics )
{
    graphics.lineStyle( linewidth , linecolor , alpha );
    
    if( polygon === undefined || polygon === null )
    {
        LOG.error("Called drawhelpers with undefined/null polygon");
        return;
    }
    
    var points = polygon.points;
    if( points.length > 0 )
    {
        var lastIndex = points.length - 1;
        graphics.moveTo( points[0].x , points[0].y );
        graphics.lineTo( point.x , point.y );
        graphics.lineTo( points[ lastIndex ].x , points[ lastIndex ].y );
    }
}
