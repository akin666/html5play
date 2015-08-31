
var MILLISECOND_TO_SECOND = 0.001;
var SECOND_TO_MILLISECOND = 1000;

var DEG2RAD = Math.PI / 180.0;
var RAD2DEG = 180.0 / Math.PI;

function isInside(x, y, w, h, x2, y2)
{
	return (x2 >= x && x2 <= x + w
		&& y2 >= y && y2 <= y + h);
}

function isInsideCenter(x, y, w, h, x2, y2)
{
	return (x2 >= x - w/2 && x2 <= x + w/2
		&& y2 >= y - h/2 && y2 <= y + h/2);
}

function dist(pos1, pos2)
{
	var diffX = pos2.x - pos1.x;
	var diffY = pos2.y - pos1.y;
	return Math.sqrt(diffX*diffX + diffY*diffY);
}

function distSq(pos1, pos2)
{
	var diffX = pos2.x - pos1.x;
	var diffY = pos2.y - pos1.y;
	return diffX*diffX + diffY*diffY;
}

function vecLength(vec)
{
	return Math.sqrt(vec.x*vec.x+vec.y*vec.y);
}
function clamp( value , min , max ) 
{
    return (value < min) ? min : ((value > max) ? max : value);
}

// http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
function modulo(a, n) {
        return a - (n * Math.floor( a / n ));
}

function findClosestPoint( point , points )
{
    if( points === undefined || points === null )
    {
        LOG.error("Called helpers with undefined/null polygon");
        return -1;
    }
    if( points.length === 0  )
    {
        return -1;
    }
    
    var index = 0;
    var distance = dist( point , points[0] );
    var tmp = 0;
    for( var i = 1 ; i < points.length ; ++i )
    {
        tmp = dist( point , points[ i ] );
        if( tmp < distance )
        {
            distance = tmp;
            index = i;
        }
    }
    return index;
}

function getPointDistance( point , points , index )
{
    if( points === undefined || points === null )
    {
        LOG.error("Called helpers with undefined/null polygon");
        return -1;
    }
    if( points.length === 0  )
    {
        return -1;
    }
    
    index = modulo( index , points.length );
    return dist( point , points[index] );
}

// http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
function getPointDistanceToLineSquared( point , l1 , l2 ) {
  var linelen = distSq( l1 , l2 );
  if( linelen == 0 )
  {
      return distSq( point , l1 );
  }
  var t = ((point.x - l1.x) * (l2.x - l1.x) + (point.y - l1.y) * (l2.y - l1.y)) / linelen;
  if( t < 0 )
  {
      return distSq( point, l1 );
  }
  if( t > 1 )
  {
      return distSq( point, l2 );
  }
  return distSq( point , { x: l1.x + t * (l2.x - l1.x) , y: l1.y + t * (l2.y - l1.y) } );
}

function dotProduct( a , b ) 
{
    return a.x * b.x + a.y * b.y;
}

function getPointDistanceToLine( point , l1, l2 ) 
{
    return Math.sqrt( getPointDistanceToLineSquared( point , l1, l2 ) ); 
}

function getLineDistance( point , points , index )
{
    if( points === undefined || points === null )
    {
        LOG.error("Called helpers with undefined/null polygon");
        return -1;
    }
    if( points.length === 0  )
    {
        return -1;
    }
    
    var i1 = modulo( index , points.length );
    var i2 = modulo( i1 + 1 , points.length );
    
    return getPointDistanceToLine( point , points[i1] , points[i2] );
}

function findClosestLine( point , points )
{
    if( points === undefined || points === null )
    {
        LOG.error("Called helpers with undefined/null polygon");
        return -1;
    }
    if( points.length < 2  )
    {
        return -1;
    }
    else if( point.length === 2 )
    {
        return 0;
    }
    
    var index = 0;
    var distance = getLineDistance( point , points , 0 );
    var tmp = 0;
    for( var i = 1 ; i < points.length ; ++i )
    {
        tmp = getLineDistance( point , points , i );
        if( tmp < distance )
        {
            distance = tmp;
            index = i;
        }
    }
    return index;
}

// radians!
// angle 0 is up
// angle PI is down
// angle PI/2 is right
// Y positive is down
// X positive is left
function angleToAxis( angle , magnitude )
{
    var vec = { 
        x: Math.sin(angle) * magnitude,
        y: Math.cos(angle) * magnitude
    };
    
    return vec;
}

function axisToAngle( axis )
{
    return Math.atan2( axis.y , axis.x );
}

function isString( o ) {
    if( o === null ) return false;
    return (typeof o === "string") || (typeof o === "object" && o.constructor === String);
}

function centered( position , dim ) 
{
	return position - (dim/2);
}

function leftered( position , dim ) 
{
	return position;
}

function rightered( position , dim ) 
{
	return position - dim;
}

function Position( x , y ) 
{
	this.x = x;
	this.y = y;
}

function clearDisplayObjectContainer( container )
{
    for( x in container.children )
    {
        container.removeChild( x );
    }
}

function polygonHitTest( point , pointArray )
{
    // game coding complete 4th edition page 300.
    var inside = false;
    var size = pointArray.length;

    if( size < 3 )
    {
        return false;
    }

    for( var i = 0 ; i < size ; ++i )
    {
        var curr = pointArray[ i ];
        var prev = pointArray[ (size - 1 + i) % size  ];

        if( curr.x > prev.x )
        {
            if( (curr.x < point.x) == (point.x <= prev.x) && (point.y - prev.y) * (curr.x-prev.x) < (curr.y-prev.y) * (point.x-prev.x) )
            {
                inside = !inside;
            }
            continue;
        }
        if( (curr.x < point.x) == (point.x <= prev.x) && (point.y - curr.y) * (prev.x-curr.x) < (prev.y-curr.y) * (point.x-curr.x) )
        {
            inside = !inside;
        }
    }

    return inside;
}

// The result depends on whether the Y axis points up or down.
function polygonWindingOrderCW( vertices , yaxisup )
{
    var area = 0;
    var size = vertices.length;
    for( var i = 0 ; i < size ; ++i )
    {
        var av = vertices[ i ];
        var bv = vertices[ (i + 1) % size ];
        area += av.x * bv.y - bv.x * av.y; 
    }
    area *= 0.5;
    
    if( yaxisup === undefined || yaxisup === false )
    {
        return area > 0;
    }
    return area < 0;
}

function tweenRemoveChildFrom( container , child , delay )
{
    var removeItem = child;
    var removeContainer = container;
    TweenLite.to( 
            removeItem, 
            delay, 
            {
                alpha:0 , 
                onComplete: 
                    function() 
                    {
                        if( removeItem === undefined || removeItem === null || removeContainer === undefined || removeContainer === null )
                        {
                            return;
                        }
                        removeContainer.removeChild( removeItem );
                    } 
             } 
         );
}

function tweenAddChildTo( container , child , delay )
{
    container.addChild( child );
    child.alpha = 0;
    TweenLite.to( 
            child, 
            delay, 
            {alpha:1} 
         );
}

function degToRad( angle )
{
     return angle * (Math.PI / 180.0);
}

function radToDeg( angle )
{
     return angle * (180.0 / Math.PI);
}
